from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.utils.timezone import now

class Student(models.Model):
    student_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    course = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='student_photos/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # admin who added

    def __str__(self):
        return f"{self.student_id} - {self.first_name} {self.last_name} ({self.course})"