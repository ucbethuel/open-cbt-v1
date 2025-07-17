from rest_framework import serializers
from .models import ExamSession, Answer
from exams.models import Question
from exams.serializers import QuestionSerializer


class AnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    subject_id = serializers.IntegerField(source='question.subject.id', read_only=True)
    choices = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = [
            'id',
            'session',
            'question',
            'subject_id',
            'question_text',
            'choices',
            'selected_option',
            'correct_option',
            'is_correct',
            'awarded_grade',
            'question_start_at',
            'answered_at',
            'question_duration_spent',
            'grade'
        ]
        read_only_fields = [
            'correct_option',
            'is_correct',
            'awarded_grade',
            'answered_at',
            'choices',
            'question_text',
            'subject_id'
        ]
        extra_kwargs = {
            'session': {'read_only': True}
        }

    def get_choices(self, obj):
        return {
            'a': obj.question.option_a,
            'b': obj.question.option_b,
            'c': obj.question.option_c,
            'd': obj.question.option_d
        }

    def validate_selected_option(self, value):
        if value not in ['a', 'b', 'c', 'd']:
            raise serializers.ValidationError("Invalid selected option. Must be one of: a, b, c, d.")
        return value


class ExamSessionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    subject = serializers.SerializerMethodField()
    questions = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            'id',
            'student',
            'exam',
            'subject',
            "questions",
            'started_at',
            'ended_at',
            'time_remaining',
            'duration',
            'current_question',
            'flagged_questions',
            'completed',
            'answers'
        ]
        extra_kwargs = {
            'student': {'read_only': True}
        }

    def get_subject(self, obj):
        return str(obj.exam.subject)

    def get_questions(self, obj):
        questions = Question.objects.filter(subject=obj.exam.subject)
        return QuestionSerializer(questions, many=True).data


class ExamSessionUpdateSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, write_only=True, required=False)
    flagged_questions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Question.objects.all(),
        required=False
    )

    class Meta:
        model = ExamSession
        fields = [
            'time_remaining',
            'current_question',
            'flagged_questions',
            'completed',
            'ended_at',
            'answers'
        ]
        extra_kwargs = {
            'ended_at': {'required': False}
        }

    def update(self, instance, validated_data):
        # Update core fields
        for field in ['time_remaining', 'current_question', 'completed', 'ended_at']:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        if 'flagged_questions' in validated_data:
            instance.flagged_questions.set(validated_data['flagged_questions'])

        instance.save()

        # Handle answer saving
        answers_data = validated_data.get('answers', [])
        for answer_data in answers_data:
            question_id = answer_data['question']
            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                raise serializers.ValidationError(f"Question with ID {question_id} does not exist.")

            selected_option = answer_data.get('selected_option')
            correct_option = question.answer
            is_correct = selected_option == correct_option
            awarded_grade = question.score if is_correct else 0.00

            Answer.objects.update_or_create(
                session=instance,
                question=question,
                defaults={
                    'selected_option': selected_option,
                    'correct_option': correct_option,
                    'is_correct': is_correct,
                    'awarded_grade': awarded_grade,
                    'question_start_at': answer_data.get('question_start_at'),
                    'answered_at': answer_data.get('answered_at'),
                    'question_duration_spent': answer_data.get('question_duration_spent'),
                    'grade': answer_data.get('grade'),
                }
            )

        return instance
