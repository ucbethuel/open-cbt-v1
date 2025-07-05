from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import Exam, Subject, Question
from .serializers import ExamSerializer, SubjectSerializer, QuestionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import pandas as pd
from rest_framework.decorators import action

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class UploadQuestionsView(APIView):
    def post(self, request, *args, **kwargs):
        subject_id = request.data.get('subject_id')
        file = request.FILES.get('file')
        if not subject_id or not file:
            return Response({'error': 'subject_id and file are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found.'}, status=status.HTTP_404_NOT_FOUND)
        # Read file (csv or excel)
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return Response({'error': 'Unsupported file format.'}, status=status.HTTP_400_BAD_REQUEST)
        required_columns = {'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer'}
        if not required_columns.issubset(df.columns):
            return Response({'error': f'Missing columns. Required: {required_columns}'}, status=status.HTTP_400_BAD_REQUEST)
        created = 0
        with transaction.atomic():
            for _, row in df.iterrows():
                Question.objects.create(
                    subject=subject,
                    text=row['question'],
                    option_a=row['option_a'],
                    option_b=row['option_b'],
                    option_c=row['option_c'],
                    option_d=row['option_d'],
                    answer=row['answer'].strip().lower()
                )
                created += 1
        return Response({'message': f'{created} questions uploaded successfully.'}, status=status.HTTP_201_CREATED)