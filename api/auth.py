import os
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import hashlib
import os
import binascii
import jwt
from pydantic import BaseModel, EmailStr
from typing import Optional

from api.database import get_db
from api.models import UserModel
from api import models
from api.limiter import limiter

router = APIRouter()

# JWT setup
SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool

    class Config:
        from_attributes = True

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password or len(hashed_password) < 64:
        return False
    try:
        salt = hashed_password[:64].encode('ascii')
        stored_password = hashed_password[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha512', plain_password.encode('utf-8'), salt, 100000)
        pwdhash = binascii.hexlify(pwdhash).decode('ascii')
        return pwdhash == stored_password
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(UserModel).filter(UserModel.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = UserModel(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        auth_provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def login(request: Request, user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

import httpx
from fastapi.responses import RedirectResponse

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
# On vercel, use origin. Locally, use localhost:5000. For this task we'll use a dynamic or static local one.
# For standard testing in this env:
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:5000/api/auth/callback/google")

GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.environ.get("GITHUB_REDIRECT_URI", "http://localhost:5000/api/auth/callback/github")
FRONTEND_OAUTH_CALLBACK = os.environ.get("FRONTEND_OAUTH_CALLBACK", "http://localhost:5173/oauth/callback")

@router.get("/login/google")
def login_google():
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    url = f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile&access_type=offline"
    return RedirectResponse(url)

@router.get("/callback/google")
async def auth_google(code: str, db: Session = Depends(get_db)):
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        access_token = response.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Invalid Google OAuth code")
        
        user_info_response = await client.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})
        user_info = user_info_response.json()
        
    email = user_info.get("email")
    name = user_info.get("name")
    oauth_id = user_info.get("id")
    
    # Check if user exists
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        user = UserModel(email=email, name=name, auth_provider="google", oauth_id=oauth_id)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Generate JWT
    token = create_access_token(data={"sub": str(user.id)})
    
    # Redirect to frontend with token
    return RedirectResponse(f"{FRONTEND_OAUTH_CALLBACK}?token={token}")

@router.get("/login/github")
def login_github():
    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={GITHUB_REDIRECT_URI}&scope=user:email"
    return RedirectResponse(url)

@router.get("/callback/github")
async def auth_github(code: str, db: Session = Depends(get_db)):
    token_url = "https://github.com/login/oauth/access_token"
    data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": GITHUB_REDIRECT_URI,
    }
    headers = {"Accept": "application/json"}
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data, headers=headers)
        access_token = response.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Invalid GitHub OAuth code")
            
        user_info_response = await client.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}"})
        user_info = user_info_response.json()
        
        emails_response = await client.get("https://api.github.com/user/emails", headers={"Authorization": f"Bearer {access_token}"})
        emails = emails_response.json()
        
    primary_email = next((e["email"] for e in emails if e["primary"]), None)
    if not primary_email:
        raise HTTPException(status_code=400, detail="No primary email found in GitHub account")
        
    name = user_info.get("name") or user_info.get("login")
    oauth_id = str(user_info.get("id"))
    
    user = db.query(UserModel).filter(UserModel.email == primary_email).first()
    if not user:
        user = UserModel(email=primary_email, name=name, auth_provider="github", oauth_id=oauth_id)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    token = create_access_token(data={"sub": str(user.id)})
    
    return RedirectResponse(f"{FRONTEND_OAUTH_CALLBACK}?token={token}")
