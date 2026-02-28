## Base URL (local development):

`http://localhost:8000/api`

1. POST /api/shorten – Create Short URL

- Generate a short alias for a given long URL.

  ## Request

  **Headers:**
  Content-Type: application/json

  **Body (JSON)**

{
"url": "https://example.com/long/path"
}
Response (200 OK)
{
"short_url": "abcd1234"
}

**If the URL already exists, returns the existing alias.**

**Errors**
Status Description
400 URL is missing in request
429 Rate limit exceeded (Too many requests)

**Example Rate Limit Response:**

{
"detail": {
"error": "Too many request",
"retry_after": 30
}
}

**Rate Limiting:**

Implemented with a sliding window algorithm.

Tracks requests per IP and limits excessive requests over a rolling time window.

2. GET /{alias} – Redirect Short URL

- Redirects a short alias to its original URL.

**Request**
GET http://localhost:8000/abcd1234

**Response**

302 Redirect to original URL:
https://example.com/long/path

**Errors**
Status Description
404 Alias not found
Notes

Each redirect increments the click_count for analytics.

A new record is inserted into the click table with timestamp.

3. GET /api/dashboard – Get All URLs

- Returns a list of all shortened URLs and metadata.

Request
GET http://localhost:8000/api/dashboard
Response (200 OK)
[
{
"id": 1,
"original_url": "https://example.com/long/path",
"short_alias": "abcd1234",
"click_count": 15,
"created_at": "2026-02-28"
},
{
"id": 2,
"original_url": "https://another.com/page",
"short_alias": "efgh5678",
"click_count": 7,
"created_at": "2026-02-27"
}
] 4. GET /api/analytics/{alias} – URL Analytics

Returns the last 7 days of clicks for a given short alias.

Request
GET http://localhost:8000/api/analytics/abcd1234
Response (200 OK)
{
"labels": [
"2026-02-22",
"2026-02-23",
"2026-02-24",
"2026-02-25",
"2026-02-26",
"2026-02-27",
"2026-02-28"
],
"values": [0, 2, 1, 5, 0, 3, 4]
}

labels: Dates for the last 7 days (YYYY-MM-DD)

values: Number of clicks per day

Notes

Uses the click table to track analytics.

If no clicks exist for a day, value = 0.

# Rate Limiting – Sliding Window Algorithm

Each client IP is tracked for requests to /api/shorten.

The algorithm maintains a rolling window of recent request timestamps.

Steps:

Remove timestamps older than the time window (e.g., 1 minute).

Count remaining requests in the window.

If count < limit → allow request

Else → return 429 Too Many Requests with retry_after.

Benefits over fixed windows:

Prevents burst requests at window boundaries.

Provides smoother request limiting.
