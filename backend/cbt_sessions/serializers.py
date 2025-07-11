from rest_framework import serializers
from .models import ExamSession, Answer


class AnswerSerializer(serializers.ModelSerializer):
    # Optional: Show question text or ID
    question_text = serializers.CharField(source='question.text', read_only=True)

    class Meta:
        model = Answer
        fields = [
            'id',
            'session',
            'question',
            'question_text',
            'selected_option',
            'correct_option',
            'is_correct',
            'answered_at',
        ]
        read_only_fields = ['correct_option', 'is_correct', 'answered_at']


class ExamSessionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)  # Nested

    class Meta:
        model = ExamSession
        fields = [
            'id',
            'student',
            'exam',
            'subject',
            'started_at',
            'time_remaining',
            'duration',           # if added
            'submitted_at',       # if added
            'current_question',
            'flagged_questions',
            'completed',
            'answers',
        ]


class ExamSessionUpdateSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, write_only=True)

    class Meta:
        model = ExamSession
        fields = [
            'id',
            'time_remaining',
            'current_question',
            'flagged_questions',
            'answers',
        ]

    def update(self, instance, validated_data):
        # Update session fields
        instance.time_remaining = validated_data.get('time_remaining', instance.time_remaining)
        instance.current_question = validated_data.get('current_question', instance.current_question)
        instance.save()

        # Handle answer updates
        answers_data = validated_data.get('answers', [])
        for answer_data in answers_data:
            question = answer_data['question']
            selected_option = answer_data['selected_option']
            # Update or create the Answer
            Answer.objects.update_or_create(
                session=instance,
                question=question,
                defaults={'selected_option': selected_option}
            )

        return instance
