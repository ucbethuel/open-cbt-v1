from django.db import models

from cbt_sessions.models import Answer

# Create your models here.
class Result(models.Model):
    answer = models.OneToOneField(Answer, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=10)
    remarks = models.TextField(blank=True)
