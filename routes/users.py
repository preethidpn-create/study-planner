from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from database import get_session
from models import User
from schemas import UserCreate, UserLogin
from utils.security import hash_password, verify_password
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"


def create_token(user_id: int):
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
def register_user(user: UserCreate, session: Session = Depends(get_session)):

    existing_user = session.exec(
        select(User).where(User.email == user.email.strip().lower())
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username,
        email=user.email.strip().lower(),
        password=hash_password(user.password)
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login_user(user: UserLogin, session: Session = Depends(get_session)):

    db_user = session.exec(
        select(User).where(User.email == user.email.strip().lower())
    ).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token(db_user.id)

    return {
        "access_token": token,
        "user": {
            "id": db_user.id,
            "username": db_user.username
        }
    }