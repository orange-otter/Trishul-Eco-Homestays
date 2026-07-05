import traceback
from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Trishul Eco-Homestays API")

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

import_error = None
try:
    from sqlalchemy.orm import Session
    from database import engine, get_db
    import models
except Exception as e:
    import_error = traceback.format_exc()

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
def get_rooms():
    if import_error:
        return [
            {
                "id": 1,
                "name": "FATAL IMPORT ERROR",
                "price": 9999,
                "is_available": False,
                "description": import_error
            }
        ]
    
    # Normally we would use db: Session = Depends(get_db)
    # But we can't because get_db might not be imported!
    try:
        db = next(get_db())
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

# (Skipping the rest of the routes for this debug step since they would crash if models is undefined)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=5000, reload=True)
