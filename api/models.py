from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class RoomModel(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer)
    is_available = Column(Boolean, default=True)
    description = Column(String, nullable=True)
