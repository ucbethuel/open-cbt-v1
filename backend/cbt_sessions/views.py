from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import ExamSession, Answer
from .serializers import (
    ExamSessionSerializer,
    ExamSessionUpdateSerializer,
    AnswerSerializer
)


class ExamSessionViewSet(viewsets.ModelViewSet):
    queryset = ExamSession.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ExamSessionUpdateSerializer
        return ExamSessionSerializer

    def perform_create(self, serializer):
        # Automatically assign the student from request.user (assuming user is a Student)
        student = self.request.user.student
        serializer.save(student=student)

    def get_queryset(self):
        # Filter by logged-in student's sessions
        return ExamSession.objects.filter(student=self.request.user.student)


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Optional: prevent mismatched sessions
        serializer.save()

    def get_queryset(self):
        # Only answers that belong to the logged-in student
        return Answer.objects.filter(session__student=self.request.user.student)
