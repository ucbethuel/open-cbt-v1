from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import ExamSession, Answer
from .serializers import (
    ExamSessionSerializer,
    ExamSessionUpdateSerializer,
    AnswerSerializer
)


class ExamSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ExamSession.objects.filter(student=self.request.user)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ExamSessionUpdateSerializer
        return ExamSessionSerializer

    def create(self, request, *args, **kwargs):
        exam_id = request.data.get('exam')
        if not exam_id:
            return Response({"error": "Exam ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        student = request.user
        existing_session = ExamSession.objects.filter(student=student, exam_id=exam_id).first()

        if existing_session:
            serializer = self.get_serializer(existing_session)
            return Response({
                "message": "Resuming existing exam session.",
                "session": serializer.data
            }, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(student=student)
        return Response({
            "message": "New exam session started.",
            "session": serializer.data
        }, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Answer.objects.filter(session__student=self.request.user)

    def perform_create(self, serializer):
        session = serializer.validated_data['session']
        if session.student != self.request.user:
            raise PermissionDenied("Unauthorized session.")
        serializer.save()
