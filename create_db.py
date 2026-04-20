from sqlmodel import SQLModel
from database import engine
import models  # IMPORTANT: ensures all models are registered

# Create all tables
SQLModel.metadata.create_all(engine)

print("Database tables created successfully!")