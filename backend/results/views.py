from rest_framework import viewsets, permissions
from .models import Result
from .serializers import ResultSerializer


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [permissions.AllowAny]  # Customize as needed

    def get_queryset(self):
        # Optional filter by student_id or exam_id
        queryset = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        exam_id = self.request.query_params.get('exam_id')

        if student_id:
            queryset = queryset.filter(answer__session__student__student_id=student_id)
        if exam_id:
            queryset = queryset.filter(answer__session__exam__exam_id=exam_id)

        return queryset
