from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    has_uploaded_1st_year = Column(Boolean, default=False)
    has_uploaded_2nd_year = Column(Boolean, default=False)
    has_uploaded_3rd_year = Column(Boolean, default=False)
    has_uploaded_4th_year = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_number = Column(String, nullable=False)
    leetcode_url = Column(String, nullable=True)
    hackerrank_url = Column(String, nullable=True)
    category = Column(String, nullable=False)  # "2nd_year" or "3rd_year"
    leetcode_solved = Column(Integer, nullable=True)
    hr_java_stars = Column(Integer, nullable=True)
    hr_python_stars = Column(Integer, nullable=True)
    hr_c_stars = Column(Integer, nullable=True)
    hr_sql_stars = Column(Integer, nullable=True)
    last_fetched = Column(DateTime, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
