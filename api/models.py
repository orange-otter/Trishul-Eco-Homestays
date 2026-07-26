from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from api.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    is_admin = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=True)
    auth_provider = Column(String, default="local")
    oauth_id = Column(String, nullable=True)
    
    # bookings = relationship("BookingModel", back_populates="user")  # Removed because BookingModel no longer has a foreign key to UserModel
class RoomModel(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer)
    is_available = Column(Boolean, default=True)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    bookings = relationship("BookingModel", back_populates="room")

class BookingModel(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String) # Changed to String to store Supabase UUID, removed FK for simplicity
    room_id = Column(Integer, ForeignKey("rooms.id"))
    check_in = Column(Date)
    check_out = Column(Date)
    total_price = Column(Integer)

    room = relationship("RoomModel", back_populates="bookings")
