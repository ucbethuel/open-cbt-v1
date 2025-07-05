from django.db import models

# Create your models here.
from users.models import Student
from exams.models import Exam, Subject, Question  # Removed Option

class ExamSession(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    time_remaining = models.IntegerField()  # seconds
    current_question = models.IntegerField(default=0)
    flagged_questions = models.ManyToManyField(Question, related_name='flagged_in_sessions', blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student} - {self.exam} - {self.subject}"

class Answer(models.Model):
    session = models.ForeignKey(ExamSession, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='session_answers')
    selected_option = models.CharField(max_length=1, choices=Question.ANSWER_CHOICES)  # Store 'a', 'b', 'c', or 'd'
    answered_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('session', 'question')

    def __str__(self):
        return f"{self.session} - Q{self.question.id}: {self.selected_option}"