from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models

load_dotenv()

# We will initialize DB inside the first request instead of global scope to prevent Vercel crashes

app = FastAPI(title="Trishul Eco-Homestays API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:5173", "http://127.0.0.1:8000"],
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

# Models (Pydantic for validation/responses)
class RoomBase(BaseModel):
    name: str
    price: int
    is_available: bool = True
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    is_available: Optional[bool] = None
    description: Optional[str] = None

class Room(RoomBase):
    id: int
    
    class Config:
        from_attributes = True

# 1. GET list of all items
@app.get("/api/rooms", response_model=List[Room], status_code=status.HTTP_200_OK)
def get_rooms(db: Session = Depends(get_db)):
    return [
        {
            "id": 1,
            "name": "Testing Connection Homestay",
            "price": 9999,
            "is_available": True,
            "description": "If you see this, the Vercel app is running successfully."
        }
    ]

# 2. GET search/filter
@app.get("/api/rooms/search/", response_model=List[Room], status_code=status.HTTP_200_OK)
def search_rooms(q: Optional[str] = None, max_price: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.RoomModel)
    if q:
        search_term = f"%{q.lower()}%"
        query = query.filter(
            models.RoomModel.name.ilike(search_term) | 
            models.RoomModel.description.ilike(search_term)
        )
    if max_price is not None:
        query = query.filter(models.RoomModel.price <= max_price)
    
    return query.all()

# 3. GET single item
@app.get("/api/rooms/{room_id}", response_model=Room, status_code=status.HTTP_200_OK)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(models.RoomModel).filter(models.RoomModel.id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room

# 4. POST create item
@app.post("/api/rooms", response_model=Room, status_code=status.HTTP_201_CREATED)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    new_room = models.RoomModel(**room.model_dump())
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

# 5. PUT/PATCH update item
@app.patch("/api/rooms/{room_id}", response_model=Room, status_code=status.HTTP_200_OK)
def update_room(room_id: int, room_update: RoomUpdate, db: Session = Depends(get_db)):
    db_room = db.query(models.RoomModel).filter(models.RoomModel.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    update_data = room_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_room, key, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room

# 6. DELETE remove item
@app.delete("/api/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = db.query(models.RoomModel).filter(models.RoomModel.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    db.delete(db_room)
    db.commit()
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=5000, reload=True)
