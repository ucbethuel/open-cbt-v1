from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ExamSession, Answer
from .serializers import (
    ExamSessionSerializer,
    ExamSessionUpdateSerializer,
    AnswerSerializer
)

class ExamSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing CBT exam sessions for authenticated students (via student_id header).
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only sessions for the current authenticated student
        return ExamSession.objects.filter(student=self.request.user)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ExamSessionUpdateSerializer
        return ExamSessionSerializer

    def perform_create(self, serializer):
        # Automatically attach the logged-in student
        serializer.save(student=self.request.user)


class AnswerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student answers within a session.
    """
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only answers that belong to the logged-in student
        return Answer.objects.filter(session__student=self.request.user)

    def perform_create(self, serializer):
        # Ensure answer is saved only if session belongs to this student
        session = serializer.validated_data['session']
        if session.student != self.request.user:
            return Response({"error": "Unauthorized session."}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
