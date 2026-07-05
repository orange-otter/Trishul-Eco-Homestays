from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/rooms")
def get_rooms():
    return [
        {
            "id": 1,
            "name": "Barebones Connection Test",
            "price": 100,
            "is_available": True,
            "description": "If you see this, Vercel is working and the crash was caused by one of our imports (like database or models)."
        }
    ]
