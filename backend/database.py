from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Default to an absolute path for the database file
db_path = os.path.join(BASE_DIR, 'app.db')
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")

# Fix for Windows paths in SQLAlchemy (needs 4 slashes for absolute paths on some systems)
if DATABASE_URL.startswith("sqlite:///"):
    # Ensure it's treated as an absolute path
    path = DATABASE_URL.replace("sqlite:///", "")
    if not os.path.isabs(path):
        DATABASE_URL = f"sqlite:///{os.path.abspath(path)}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from models import User, Student
    Base.metadata.create_all(bind=engine)
