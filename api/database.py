import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Try to load .env from the current directory
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./dummy.db"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# Supabase specific: when using SQLAlchemy, it's recommended to disable the connection pool
# if running in serverless environments, or to use the pooler. Supabase provides a pooler URL
# on port 6543 (transaction) or 5432 (session). The user provided port 5432.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
