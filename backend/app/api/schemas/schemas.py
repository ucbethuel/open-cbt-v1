from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Option(BaseModel):
    id: str
    text: str

class Question(BaseModel):
    id: int
    text: str
    options: List[Option]
    correct_answer: Optional[str] = None

class Subject(BaseModel):
    id: int
    name: str
    code: str

class Exam(BaseModel):
    id: int
    exam_id: str
    title: str
    duration: int
    start_time: datetime
    end_time: datetime
    subjects: List[Subject]

class Submission(BaseModel):
    student_id: str
    exam_id: str
    answers: dict
    flagged_questions: List[int]
    time_used: int
    submitted_at: datetime

class Progress(BaseModel):
    student_id: str
    exam_id: str
    subject_id: int
    answers: dict
    flagged_questions: List[int]
    current_question: int
    time_remaining: int
    timestamp: datetime