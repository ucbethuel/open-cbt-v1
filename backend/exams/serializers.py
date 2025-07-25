from rest_framework import serializers
from .models import Exam, Subject, Question, ExamGroup


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'exam_id', 'subject', 'name', 'date', 'duration']
       


# class SubjectSerializer(serializers.ModelSerializer):
#     # exam_name = serializers.CharField(source='exam.name', read_only=True)

#     class Meta:
#         model = Subject
#         fields = ['id', 'name', 'code']


# # class QuestionSerializer(serializers.ModelSerializer):
# #     choices = serializers.SerializerMethodField()

# #     class Meta:
# #         model = Question
# #         fields = [
# #             'id',
# #             'subject',
# #             'text',
# #             'option_a', 'option_b', 'option_c', 'option_d',
# #             'choices',
# #             # 'score',
# #             # 'answer',  # ⚠️ Optional: remove from output if this goes to students
# #         ]
        
      

#     def get_choices(self, obj):
#         return {
#             'a': obj.option_a,
#             'b': obj.option_b,
#             'c': obj.option_c,
#             'd': obj.option_d,
#         }


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']


class QuestionSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)  # ← now it works
    choices = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id',
            'subject',
            'text',
            'option_a', 'option_b', 'option_c', 'option_d',
            'choices',
        ]

    def get_choices(self, obj):
        return {
            'a': obj.option_a,
            'b': obj.option_b,
            'c': obj.option_c,
            'd': obj.option_d,
        }


class ExamGroupSerializer(serializers.ModelSerializer):
    subject_names = serializers.SerializerMethodField()

    class Meta:
        model = ExamGroup
        fields = [
            'id',
            'exam',
            'student',
            'name',
            'subjects'
            'institution',
        ]

    def get_subject_names(self, obj):
        return [(subject.id ,subject.name, subject.code) for subject in obj.exam.subject.all()]
