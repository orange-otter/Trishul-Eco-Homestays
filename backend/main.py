from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Trishul Eco-Homestays API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:5173", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler (Middleware-like error handling)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An unexpected error occurred.", "details": str(exc)},
    )

# Models
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

# In-memory "Database"
rooms_db: List[Room] = [
    Room(id=1, name="Himalayan View Room", price=2500, is_available=True, description="Wake up to a majestic sunrise over the snow-capped Himalayan peaks. Features a private balcony and traditional wooden architecture."),
    Room(id=2, name="Forest Retreat", price=1800, is_available=False, description="Nestled near the dense oak and rhododendron forests. Perfect for bird watchers and nature lovers seeking complete peace."),
    Room(id=3, name="Traditional Mud House", price=1200, is_available=True, description="Experience authentic village life in our eco-friendly mud and stone house. Naturally insulated for a cozy stay during winters."),
    Room(id=4, name="Star Gazer Tent", price=2000, is_available=True, description="Premium Swiss tent pitched in the meadows of Chopta. Equipped with a transparent roof section for stargazing at night."),
    Room(id=5, name="Family Suite", price=4500, is_available=True, description="Spacious two-room suite ideal for families or large groups. Includes a shared sitting area and locally sourced organic meals."),
    Room(id=6, name="Solo Traveler Pod", price=800, is_available=True, description="Budget-friendly, comfortable single bed in a shared eco-dormitory. Great for trekkers heading to Tungnath."),
]
next_room_id = 7

# 1. GET list of all items
@app.get("/api/rooms", response_model=List[Room], status_code=status.HTTP_200_OK)
def get_rooms():
    return rooms_db

# 2. GET search/filter (Additional Endpoint)
@app.get("/api/rooms/search/", response_model=List[Room], status_code=status.HTTP_200_OK)
def search_rooms(q: Optional[str] = None, max_price: Optional[int] = None):
    results = rooms_db
    if q:
        results = [r for r in results if q.lower() in r.name.lower() or (r.description and q.lower() in r.description.lower())]
    if max_price is not None:
        results = [r for r in results if r.price <= max_price]
    return results

# 3. GET single item
@app.get("/api/rooms/{room_id}", response_model=Room, status_code=status.HTTP_200_OK)
def get_room(room_id: int):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room

# 4. POST create item
@app.post("/api/rooms", response_model=Room, status_code=status.HTTP_201_CREATED)
def create_room(room: RoomCreate):
    global next_room_id
    new_room = Room(id=next_room_id, **room.model_dump())
    rooms_db.append(new_room)
    next_room_id += 1
    return new_room

# 5. PUT/PATCH update item
@app.patch("/api/rooms/{room_id}", response_model=Room, status_code=status.HTTP_200_OK)
def update_room(room_id: int, room_update: RoomUpdate):
    room_idx = next((i for i, r in enumerate(rooms_db) if r.id == room_id), None)
    if room_idx is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    current_room = rooms_db[room_idx]
    update_data = room_update.model_dump(exclude_unset=True)
    updated_room_data = current_room.model_copy(update=update_data)
    rooms_db[room_idx] = updated_room_data
    
    return updated_room_data

# 6. DELETE remove item
@app.delete("/api/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int):
    room_idx = next((i for i, r in enumerate(rooms_db) if r.id == room_id), None)
    if room_idx is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    rooms_db.pop(room_idx)
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
