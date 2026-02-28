from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from app.database import get_connection
from app.utils import generate_alias
from app.rate_limiter import check_rate_limit
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
app = FastAPI()
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]
app.add_middleware(

    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#POST Request

@app.post("/api/shorten")
async def shorten_url(request:Request):
    data = await request.json()
    original_url = data.get("url")

    if not original_url:
        raise HTTPException(status_code = 400, detail = "URL is required")
    
    ip = request.client.host
    allowed, retry_after = check_rate_limit(ip)

    if not allowed:
        raise HTTPException(status_code=429, detail = {"error":"Too many request", "retry_after":retry_after})
    
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT short_alias FROM urls WHERE original_url = %s",
        (original_url,)
    )
    row = cur.fetchone()

    if row:
        existing_alias = row[0]
        cur.close()
        conn.close()
        return {"short_url": existing_alias}

    alias = generate_alias()

    while True:
        cur.execute("SELECT id FROM urls WHERE short_alias = %s",(alias,))

        if cur.fetchone() is None:
            break
        alias = generate_alias()
    cur.execute(
        "INSERT INTO urls (original_url, short_alias) VALUES (%s,%s)",(original_url,alias)
    )
    conn.commit()

    cur.close()
    conn.close()

    return{
        "short_url":alias
    }

@app.get("/{alias}")
def redirect(alias:str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT original_url FROM urls WHERE short_alias = %s",(alias,)
    )

    result = cur.fetchone()

    if result is None:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404,detail="No URL found")
    
    cur.execute("UPDATE urls SET click_count = click_count + 1 WHERE short_alias = %s",(alias,))

    cur.execute(
        "INSERT INTO click (short_alias) VALUES (%s)",(alias,)
    )

    conn.commit()

    original_url = result[0]

    cur.close()
    conn.close()

    return RedirectResponse(original_url)

@app.get("/api/dashboard")
def get_all_urls():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT id, original_url, short_alias,click_count, created_at
    FROM urls
    ORDER BY created_at DESC
    """)

    url_rows = cur.fetchall()

    urls = []
    
    for row in url_rows:
        urls.append({
            "id":row[0],
            "original_url":row[1],
            "short_alias":row[2],
            "click_count":row[3],
            "created_at":row[4].strftime("%Y-%m-%d"),
    })
    cur.close()
    conn.close()

    return urls

@app.get("/api/analytics/{alias}")
def get_analytics(alias:str):
    conn = get_connection()
    cur = conn.cursor()

    seven_day_ago = datetime.now() - timedelta(days=7)

    cur.execute("""
    SELECT clicked_at::date as day, COUNT(*)
    FROM click
    WHERE short_alias = %s AND clicked_at >= %s
    GROUP BY day
    ORDER BY day ASC
    """,(alias,seven_day_ago))

    rows = cur.fetchall()
    db_data = {row[0].strftime("%Y-%m-%d"): row[1] for row in rows}
    cur.close()
    conn.close()

    labels = []
    values = []
    for i in range(6, -1, -1):
        date_str = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        labels.append(date_str)
        values.append(db_data.get(date_str, 0))

    return {"labels": labels, "values": values}

