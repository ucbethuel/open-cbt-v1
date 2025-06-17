from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    student_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=True)
    submissions = relationship("Submission", back_populates="user")
    progresses = relationship("Progress", back_populates="user")

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    subjects = relationship("Subject", back_populates="exam")
    submissions = relationship("Submission", back_populates="exam")
    progresses = relationship("Progress", back_populates="exam")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    exam = relationship("Exam", back_populates="subjects")
    questions = relationship("Question", back_populates="subject")
    progresses = relationship("Progress", back_populates="subject")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    text = Column(String, nullable=False)
    options = Column(JSON, nullable=False)
    correct_answer = Column(String, nullable=False)
    subject = relationship("Subject", back_populates="questions")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.student_id"), nullable=False)
    exam_id = Column(String, ForeignKey("exams.exam_id"), nullable=False)
    answers = Column(JSON, nullable=False)
    flagged_questions = Column(JSON, nullable=True)
    time_used = Column(Integer, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="submissions")
    exam = relationship("Exam", back_populates="submissions")

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.student_id"), nullable=False)
    exam_id = Column(String, ForeignKey("exams.exam_id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    answers = Column(JSON, nullable=True)
    flagged_questions = Column(JSON, nullable=True)
    current_question = Column(Integer, nullable=True)
    time_remaining = Column(Integer, nullable=True)
    timestamp = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="progresses")
    exam = relationship("Exam", back_populates="progresses")
    subject = relationship("Subject", back_populates="progresses")

#  Admin Roles
class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    # Add any additional fields or relationships as needed

