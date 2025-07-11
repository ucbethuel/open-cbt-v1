from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name']  # customize this list

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
