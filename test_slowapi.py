from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_handler(request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(status_code=500, content={"error": str(exc)})

@app.get("/test")
@limiter.limit("5/minute")
def test(request: Request):
    return {"status": "ok"}

client = TestClient(app)
# Simulate Vercel removing request.client
try:
    response = client.get("/test", headers={"X-Forwarded-For": "127.0.0.1"})
    print("Response 1:", response.status_code, response.text)
except Exception as e:
    print("CRASHED:", e)
