from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import Task
from datetime import datetime

router = APIRouter()


@router.get("/ai-suggestions/{subject_id}")
def ai_suggestions(subject_id: int, session: Session = Depends(get_session)):

    tasks = session.exec(
        select(Task).where(
            Task.subject_id == subject_id,
            Task.is_completed == False
        )
    ).all()

    today = datetime.today().date()
    suggestions = []

    for task in tasks:
        try:
            due = datetime.strptime(task.due_date, "%Y-%m-%d").date()
            days_left = (due - today).days
        except:
            continue  # skip bad dates safely

        # 🔥 IMPROVED AI LOGIC
        if task.priority.lower() == "high":
            if days_left <= 1:
                suggestions.append(f"🔥 Urgent: Finish '{task.title}' today!")
            elif days_left <= 3:
                suggestions.append(f"⚠️ Important: Start '{task.title}' soon")
            else:
                suggestions.append(f"📌 Plan ahead: '{task.title}'")

        elif task.priority.lower() == "medium":
            if days_left <= 2:
                suggestions.append(f"⚠️ Plan soon: '{task.title}'")
            else:
                suggestions.append(f"📖 Work gradually on '{task.title}'")

        else:  # low priority
            suggestions.append(f"🟢 You can delay: '{task.title}'")

    # ✅ NEVER RETURN EMPTY
    if not suggestions:
        suggestions.append("No urgent tasks. You're all caught up! 🎉")

    return suggestions[:5]