from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    student_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=True)
    # hashed_password = Column(String, nullable=True)

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(String, unique=True, index=True)
    title = Column(String)
    duration = Column(Integer)
    start_time = Column(DateTime)
    end_time = Column(DateTime)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String)
    exam_id = Column(Integer, ForeignKey("exams.id"))

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    text = Column(String)
    options = Column(JSON)
    correct_answer = Column(String)

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.student_id"))
    exam_id = Column(String, ForeignKey("exams.exam_id"))
    answers = Column(JSON)
    flagged_questions = Column(JSON)
    time_used = Column(Integer)
    submitted_at = Column(DateTime)

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.student_id"))
    exam_id = Column(String, ForeignKey("exams.exam_id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    answers = Column(JSON)
    flagged_questions = Column(JSON)
    current_question = Column(Integer)
    time_remaining = Column(Integer)
    timestamp = Column(DateTime)