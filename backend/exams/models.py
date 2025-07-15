from django.db import models
from institutions.models import Institution
from users.models import Student



class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Exam(models.Model):
    exam_id = models.CharField(max_length=50, unique=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    date = models.DateTimeField()
    duration = models.IntegerField(help_text="Exam Duration should be written in integer minutes value")

    def __str__(self):
        return self.name
    

class Question(models.Model):
    subject = models.ForeignKey(Subject, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    ANSWER_CHOICES = [
        ('a', 'Option A'),
        ('b', 'Option B'),
        ('c', 'Option C'),
        ('d', 'Option D'),
    ]
    answer = models.CharField(max_length=1, choices=ANSWER_CHOICES)
    score = models.DecimalField(decimal_places=2, max_digits=5)
    def __str__(self):
        return f"Q{self.id}: {self.text[:50]}"
    
class ExamGroup(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student, related_name='exam_groups')
    institution = models.ForeignKey(Institution, related_name='exam_groups', on_delete=models.CASCADE)
    name= models.CharField(max_length=200)

    def __str__(self):
        return self.name


# students__examgroup__exam
# subject__.

