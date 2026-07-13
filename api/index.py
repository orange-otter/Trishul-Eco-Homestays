import traceback
from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from api.limiter import limiter

app = FastAPI(title="Trishul Eco-Homestays API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An unexpected error occurred.", "details": str(exc)},
    )

from sqlalchemy.orm import Session
from api.database import engine, get_db
from api import models
import os
import httpx
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Supabase credentials not configured in backend")
        
    token = credentials.credentials
    url = f"{SUPABASE_URL}/auth/v1/user"
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_data = response.json()
        return {"id": user_data.get("id"), "email": user_data.get("email")}

# Models (Pydantic for validation/responses)
class RoomBase(BaseModel):
    name: str
    price: int
    is_available: bool = True
    description: Optional[str] = None
    image_url: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    is_available: Optional[bool] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class Room(RoomBase):
    id: int
    
    class Config:
        from_attributes = True

# 1. GET list of all items
@app.get("/api/rooms", response_model=List[Room], status_code=status.HTTP_200_OK)
def get_rooms(db: Session = Depends(get_db)):
    try:
        models.Base.metadata.create_all(bind=engine)
        if db.query(models.RoomModel).count() == 0:
            db.add_all([
                models.RoomModel(name="Himalayan Heritage Home", price=2500, description="A traditional stone and wood house offering panoramic views."),
                models.RoomModel(name="Chopta Eco Retreat", price=1800, description="Sustainable mud cottages in the heart of Chopta.")
            ])
            db.commit()
        rooms = db.query(models.RoomModel).all()
        return rooms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

# 2. POST create a new room
@app.post("/api/rooms", response_model=Room, status_code=status.HTTP_201_CREATED)
def create_room(room: RoomCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        new_room = models.RoomModel(**room.model_dump())
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
        return new_room
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

# 3. PATCH update a room
@app.patch("/api/rooms/{room_id}", response_model=Room)
def update_room(room_id: int, room_update: RoomUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_room = db.query(models.RoomModel).filter(models.RoomModel.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    update_data = room_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_room, key, value)
        
    try:
        db.commit()
        db.refresh(db_room)
        return db_room
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

# 4. DELETE a room
@app.delete("/api/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_room = db.query(models.RoomModel).filter(models.RoomModel.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    try:
        db.delete(db_room)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=5000, reload=True)
