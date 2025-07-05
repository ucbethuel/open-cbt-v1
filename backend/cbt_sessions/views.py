from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import ExamSession, Answer
from .serializers import ExamSessionSerializer, AnswerSerializer

class ExamSessionViewSet(viewsets.ModelViewSet):
    queryset = ExamSession.objects.all()
    serializer_class = ExamSessionSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer