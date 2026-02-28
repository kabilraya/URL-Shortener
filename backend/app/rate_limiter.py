
import time
request_log = {}
LIMIT = 5
WINDOW = 60 #seconds

def check_rate_limit(ip):
    current_time = time.time()

    if ip not in request_log:
        request_log[ip] = []
    
    request_log[ip] = [
        t for t in request_log[ip]
        if current_time - t < WINDOW
    ]
    if len(request_log[ip]) >= LIMIT:
        retry_after = WINDOW - (current_time - request_log[ip][0])
        return False, int(retry_after)
    
    request_log[ip].append(current_time)
    return True, 0