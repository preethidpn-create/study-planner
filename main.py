from fastapi import FastAPI
from database import create_db_and_tables
import models
from routes.users import router as user_router
from routes.subjects import router as subject_router
from routes.tasks import router as task_router
from fastapi.middleware.cors import CORSMiddleware
from routes import ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router)
app.include_router(subject_router)
app.include_router(task_router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Study Planner API is running "}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
