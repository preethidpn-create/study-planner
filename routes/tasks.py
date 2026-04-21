from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import Task
from schemas import TaskCreate
from datetime import datetime

router = APIRouter()


# 🔥 CREATE TASK (user-specific)
@router.post("/tasks")
def create_task(task: TaskCreate, session: Session = Depends(get_session)):
    new_task = Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        subject_id=task.subject_id,
        user_id=task.user_id,   # ✅ IMPORTANT
        priority=task.priority,
        difficulty=task.difficulty
    )
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task


# 🔥 GET ALL TASKS (ONLY FOR LOGGED-IN USER)
@router.get("/tasks/{user_id}")
def get_tasks(user_id: int, session: Session = Depends(get_session)):

    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

    return tasks


# 🔥 MARK COMPLETE
@router.put("/tasks/{task_id}/complete")
def complete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)

    if not task:
        return {"error": "Task not found"}

    task.is_completed = True
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


# 🔥 GET PENDING TASKS (USER-SPECIFIC)
@router.get("/tasks/pending/{user_id}")
def get_pending_tasks(user_id: int, session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).where(
            Task.user_id == user_id,
            Task.is_completed == False
        )
    ).all()

    return tasks


# 🔥 GET COMPLETED TASKS (USER-SPECIFIC)
@router.get("/tasks/completed/{user_id}")
def get_completed_tasks(user_id: int, session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).where(
            Task.user_id == user_id,
            Task.is_completed == True
        )
    ).all()

    return tasks


# 🔥 SMART PLAN (TOP 3 USER TASKS)
@router.get("/smart-plan/{user_id}")
def smart_plan(user_id: int, session: Session = Depends(get_session)):

    tasks = session.exec(
        select(Task).where(
            Task.user_id == user_id,
            Task.is_completed == False
        )
    ).all()

    priority_order = {"high": 0, "medium": 1, "low": 2}

    def safe_date(task):
        try:
            return datetime.strptime(str(task.due_date), "%Y-%m-%d")
        except:
            return datetime.max

    tasks_sorted = sorted(
        tasks,
        key=lambda x: (
            priority_order.get(x.priority.lower(), 1),
            safe_date(x)
        )
    )

    return tasks_sorted[:3]


# 🔥 DELETE TASK
@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)

    if not task:
        return {"error": "Task not found"}

    session.delete(task)
    session.commit()

    return {"message": "Task deleted"}