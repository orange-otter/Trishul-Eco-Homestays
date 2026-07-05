from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database import DATABASE_URL
from api.models import RoomModel

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()

new_rooms = [
    RoomModel(name="Nanda Devi Viewhouse", price=3200, description="Cozy wooden interiors with a breathtaking view of Nanda Devi peak. Perfect for nature lovers.", is_available=True),
    RoomModel(name="Pine Breeze Cottage", price=1500, description="Budget-friendly mud and stone cottage nestled within a dense pine forest.", is_available=True),
    RoomModel(name="Kedarnath Basecamp Stay", price=2100, description="A warm, rustic homestay providing authentic local meals and a perfect starting point for treks.", is_available=True),
    RoomModel(name="Ganga Edge Retreat", price=4500, description="Premium eco-friendly retreat located beside the river, offering yoga classes and organic food.", is_available=True)
]

db.add_all(new_rooms)
db.commit()

print("Successfully added 4 new homestays to the database!")
db.close()
