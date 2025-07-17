from datetime import timezone
from django.db import models

# Create your models here.
from users.models import Student
from exams.models import Exam, Question  # Removed Option

class ExamSession(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    duration = models.DurationField(blank=True, null=True)
    time_remaining = models.IntegerField()  # seconds
    current_question = models.IntegerField(default=0)
    flagged_questions = models.ManyToManyField(Question, related_name='flagged_in_sessions', blank=True)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'exam')


    def save(self, *args, **kwargs):
        if self.ended_at and self.started_at:
            self.duration = self.ended_at - self.started_at
        super().save(*args, **kwargs)
    
    def mark_as_ended(self):
        self.ended_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.pk} - {self.student} - {self.exam}"

class Answer(models.Model):
    session = models.ForeignKey(ExamSession, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='session_answers')

    selected_option = models.CharField(max_length=1, choices=Question.ANSWER_CHOICES, null=True, blank=True)
    correct_option = models.CharField(max_length=1, choices=Question.ANSWER_CHOICES)
    is_correct = models.BooleanField(default=False)

    awarded_grade = models.DecimalField(decimal_places=2, max_digits=5)
    question_start_at = models.DateTimeField(blank=True, null=True)
    answered_at = models.DateTimeField(blank=True, null=True)
    question_duration_spent = models.DecimalField(decimal_places=2, max_digits=5,verbose_name="Time spent on Question", help_text="Total time spent by a student in answering question.")
    grade = models.DecimalField(decimal_places=2, max_digits=5)

    class Meta:
        unique_together = ('session', 'question')

    def save(self, *args, **kwargs):
        self.correct_option = self.question.answer  # snapshot of correct answer
        self.is_correct = self.selected_option == self.correct_option
        self.awarded_grade = self.question.score if self.is_correct else 0.00
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.session} - Q{self.question.id}: {self.selected_option} (correct: {self.correct_option})"
