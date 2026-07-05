import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from api.database import DATABASE_URL
from api.models import RoomModel

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()

print("Altering table to add image_url...")
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE rooms ADD COLUMN image_url VARCHAR;"))
        print("Column added successfully.")
except Exception as e:
    print("Column might already exist, skipping alter:", e)

# Update existing rows
images = [
    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800", # Himalayan Heritage Home
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800", # Chopta Eco Retreat
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800", # Nanda Devi Viewhouse
    "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?auto=format&fit=crop&q=80&w=800", # Pine Breeze Cottage
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800", # Kedarnath Basecamp Stay
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"  # Ganga Edge Retreat
]

rooms = db.query(RoomModel).all()
for i, room in enumerate(rooms):
    if i < len(images):
        room.image_url = images[i]

# Add two more!
new_rooms = [
    RoomModel(name="Valley View Treehouse", price=4200, description="An elevated wooden treehouse offering a panoramic view of the lush green valley below.", is_available=True, image_url="https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&q=80&w=800"),
    RoomModel(name="Alpine Solitude Cabin", price=2900, description="A remote, peaceful cabin perfect for writers or anyone looking for absolute silence in the snow.", is_available=True, image_url="https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=800")
]

db.add_all(new_rooms)
db.commit()

print("Successfully updated homestays with images and added 2 more!")
db.close()
