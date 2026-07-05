import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# The user provided the URL directly, so we will use it instead of relying on Vercel Env Vars
DATABASE_URL = "postgresql://postgres.mlkblvegideqoirezuwb:qiX1zFXKCyy2dK28@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# Initialize Engine globally, but lazily connect
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    engine = None
    SessionLocal = None

# Supabase specific: when using SQLAlchemy, it's recommended to disable the connection pool
# if running in serverless environments, or to use the pooler. Supabase provides a pooler URL
# on port 6543 (transaction) or 5432 (session). The user provided port 5432.


Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
