# from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from .models import Student
from .serializers import StudentSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
import pandas as pd

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentLoginAPIView(APIView):
    def post(self, request):
        student_id = request.data.get('student_id')
        if not student_id:
            return Response({'error': 'student_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = Student.objects.get(student_id=student_id)
            # You can return student info or just a success message
            return Response({
                'success': True,
                'student_id': student.student_id,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'email': student.email,
                'course': student.course,
                'is_active': student.is_active
            }, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Invalid student_id'}, status=status.HTTP_404_NOT_FOUND)
        

class StudentBatchUploadAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine file type
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return Response({'error': 'Unsupported file type'}, status=status.HTTP_400_BAD_REQUEST)

        created = 0
        for _, row in df.iterrows():
            student_id = str(row.get('student_id')).strip()
            course = str(row.get('course')).strip()
            if student_id and course:
                Student.objects.get_or_create(
                    student_id=student_id,
                    defaults={'course': course, 'created_by': request.user}
                )
                created += 1

        return Response({'message': f'{created} students uploaded successfully.'}, status=status.HTTP_201_CREATED)