import os
import sys
from dotenv import load_dotenv

# Add workspace directory to python path to allow importing api package
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv("api/.env")

from api.database import SessionLocal, engine
from api.models import RoomModel, BookingModel

# Stunning, high-quality mountain and eco-homestay Unsplash image IDs
UNSPLASH_IDS = [
    "1510798831971-661eb04b3739",  # Snowy wooden cottage
    "1470770841072-f978cf4d019e",  # Lakeside cottage
    "1504280390367-361c6d9f38f4",  # Forest camping/cabin
    "1464822759023-fed622ff2c3b",  # Mountain meadow cabin
    "1542718610-a1d656d1884c",  # Deep forest cabin
    "1566073771259-6a8506099945",  # Green boutique retreat
    "1520250497591-112f2f40a3f4",  # Eco valley lodge
    "1549693578-d683be217e58",  # Wooden treehouse
    "1518780664697-55e3ad937233",  # Cozy cabin in red wood
    "1434082033009-b81d41d36e50",  # Mountain stream cottage
    "1521401830884-6c03c1c87efa",  # A-frame cabin
    "1618773928121-c32242e63f39",  # Warm cabin interior
    "1502672260266-1c1ef2d93688",  # Wooden deck in forest
    "1600585154340-be6161a56a0c",  # Luxury modern eco-villa
    "1499793983690-e29da59ef1c2",  # Waterfront cabin
    "1501785888041-af3ef285b470",  # Peaceful lakeside cabins
]

HOMESTAY_TEMPLATES = [
    {
        "name": "Chopta Eco Retreat",
        "description": "Nestled in the lush meadows of Chopta, this retreat offers panoramic views of the Trishul peak and runs entirely on solar power. Savor delicious local Garhwali meals cooked with organic ingredients directly from our garden.",
        "price_base": 2800
    },
    {
        "name": "Himalayan Heritage Home",
        "description": "A beautiful 100-year-old stone house restored with modern comforts. Located in Sari Village, it serves as the perfect base camp for the Deoriatal trek. Experience local warmth, bonfire evenings, and birdwatching.",
        "price_base": 2400
    },
    {
        "name": "Tungnath Alpine Lodge",
        "description": "Perched at a high altitude near the start of the Tungnath trail. Enjoy chilly mountain air, cozy wooden interiors, a hot cup of rhododendron tea, and pristine stargazing sessions away from light pollution.",
        "price_base": 3200
    },
    {
        "name": "Deoriatal Mirror Cabin",
        "description": "Overlooking the sacred Deoriatal lake, this cabin features wide glass windows that reflect the snow-capped Himalayan peaks. Features a fireplace, local library, and guided eco-tours.",
        "price_base": 3800
    },
    {
        "name": "Sari Village Orchard Cottage",
        "description": "Surrounded by apple and peach orchards, this cottage offers a cozy room, clean amenities, and a quiet balcony to write, paint, or read. Run by the local Negi family.",
        "price_base": 1800
    },
    {
        "name": " Trishul View Dome",
        "description": "Experience luxury glamping in our geodesic dome with an unobstructed view of Mount Trishul and Nanda Devi. Includes private deck, ensuite bathroom, and absolute tranquility.",
        "price_base": 4800
    },
    {
        "name": "Kedarnath Wildlife Sanctuary Camp",
        "description": "Set up at the edge of the wildlife sanctuary. Wake up to the songs of the Monal pheasant and enjoy guided hikes, local legend storytelling, and sleeping under a canopy of stars.",
        "price_base": 1500
    },
    {
        "name": "Oak Forest A-Frame",
        "description": "An intimate, beautifully crafted A-frame cabin tucked deep inside an ancient oak forest. Features a private firepit, hammock, and absolute silence interrupted only by bird songs.",
        "price_base": 3500
    },
    {
        "name": "Garhwal Valley Homestay",
        "description": "A traditional home run by local village women. Learn Garhwali cooking, participate in organic farming, and explore remote mountain paths with local expert guides.",
        "price_base": 1200
    },
    {
        "name": "Chandrashila Summit Lodge",
        "description": "The closest eco-lodge to the Chandrashila peak trail. Offers rustic charm, thermal insulation, thick wool blankets, and breathtaking views of the sunrise over the peak.",
        "price_base": 2900
    }
]

LOCATIONS = ["Upper Chopta", "Sari Village", "Maku Bend", "Ukhimath", "Baniya Kund", "Dugalbitta", "Rudraprayag Valley"]
ROOM_TYPES = ["Deluxe Cabin", "Luxury Suite", "Eco Cottage", "Premium Villa", "Standard Tent", "Alpine Den", "Mountain Suite"]

def seed_database():
    db = SessionLocal()
    try:
        print("Cleaning up old bookings and rooms...")
        db.query(BookingModel).delete()
        db.query(RoomModel).delete()
        db.commit()
        print("Clean up completed successfully.")

        rooms = []
        # Generate 50 unique homestays
        for i in range(1, 51):
            template = HOMESTAY_TEMPLATES[(i - 1) % len(HOMESTAY_TEMPLATES)]
            loc = LOCATIONS[(i - 1) % len(LOCATIONS)]
            room_type = ROOM_TYPES[(i - 1) % len(ROOM_TYPES)]
            image_id = UNSPLASH_IDS[(i - 1) % len(UNSPLASH_IDS)]
            
            name = f"{template['name']} - {room_type} ({loc})"
            price = template['price_base'] + (i % 7) * 200 - (i % 3) * 100
            description = f"{template['description']} Located in the scenic area of {loc}."
            image_url = f"https://images.unsplash.com/photo-{image_id}?auto=format&fit=crop&w=800&q=80"
            
            room = RoomModel(
                name=name,
                price=price,
                is_available=True if i % 10 != 0 else False,  # 90% available
                description=description,
                image_url=image_url
            )
            rooms.append(room)
            
        print(f"Adding {len(rooms)} fresh eco-homestays to database...")
        db.add_all(rooms)
        db.commit()
        print("Database seeded successfully with 50 homestays!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
