from fastapi import APIRouter
from sqlmodel import Session
from database import engine
from models import Subject
from schemas import SubjectCreate

router = APIRouter()

@router.post("/subjects")
def create_subject(subject: SubjectCreate):
    with Session(engine) as session:
        new_subject = Subject(
            name=subject.name,
            user_id=subject.user_id
        )
        session.add(new_subject)
        session.commit()
        session.refresh(new_subject)
        return new_subject