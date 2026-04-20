from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SubjectCreate(BaseModel):
    name: str
    user_id: int

class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: date
    subject_id: int
    priority: str = "medium"
    difficulty: str = "easy"