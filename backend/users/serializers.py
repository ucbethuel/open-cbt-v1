from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id','student_id', 'first_name', 'last_name', 'full_name', 'email', 'phone_number', 'gender', 'institution', 'course', 'exam_groups', 'photo']  # customize this list
        # read_only = ('exam_groups')

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
