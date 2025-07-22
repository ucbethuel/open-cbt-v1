from rest_framework import serializers
from .models import Student
from institutions.serializers import InstitutionalSerializers

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    institution = InstitutionalSerializers(read_only=True)
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id','student_id', 'first_name', 'last_name', 'full_name', 'email', 'phone_number', 'gender', 'institution', 'course', 'exam_groups', 'photo']  # customize this list
        # read_only = ('exam_groups')

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url'):
            photo_url = obj.photo.url
            if request is not None:
                return request.build_absolute_uri(photo_url)
            return photo_url
        return None
