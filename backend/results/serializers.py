from rest_framework import serializers
from .models import Result
from cbt_sessions.models import Answer


class ResultSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='answer.question.text', read_only=True)
    student_id = serializers.CharField(source='answer.session.student.student_id', read_only=True)
    exam_id = serializers.CharField(source='answer.session.exam.exam_id', read_only=True)

    class Meta:
        model = Result
        fields = [
            'id',
            'answer',
            'student_id',
            'exam_id',
            'question_text',
            'score',
            'grade',
            'remarks',
        ]
