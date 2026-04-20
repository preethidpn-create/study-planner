from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import Task
from schemas import TaskCreate
from datetime import datetime

router = APIRouter()


@router.post("/tasks")
def create_task(task: TaskCreate, session: Session = Depends(get_session)):
    new_task = Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        subject_id=task.subject_id,
        priority=task.priority,
        difficulty=task.difficulty
    )
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task

@router.get("/tasks/{user_id}")
def get_tasks(user_id: int, session: Session = Depends(get_session)):

    tasks = session.exec(
        select(Task)
    ).all()

    return tasks


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


@router.get("/tasks/pending/{subject_id}")
def get_pending_tasks(subject_id: int, session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).where(
            Task.subject_id == subject_id,
            Task.is_completed == False
        )
    ).all()
    return tasks


@router.get("/tasks/completed/{subject_id}")
def get_completed_tasks(subject_id: int, session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).where(
            Task.subject_id == subject_id,
            Task.is_completed == True
        )
    ).all()
    return tasks


@router.get("/smart-plan/{user_id}")
def smart_plan(user_id: int, session: Session = Depends(get_session)):

    tasks = session.exec(select(Task)).all()

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


@router.get("/smart-plan")
def smart_plan_all(session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).where(Task.is_completed == False)
    ).all()

    priority_order = {"high": 0, "medium": 1, "low": 2}

    tasks_sorted = sorted(
        tasks,
        key=lambda x: (
            priority_order.get(x.priority.lower(), 1),
            datetime.strptime(x.due_date, "%Y-%m-%d")
        )
    )

    return tasks_sorted[:5]   # top 5 tasks


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)

    if not task:
        return {"error": "Task not found"}

    session.delete(task)
    session.commit()

    return {"message": "Task deleted"}