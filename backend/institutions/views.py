from django.shortcuts import render

# Create your views here.

# views.py
from rest_framework.response import Response
from .models import Institution, Student
from .serializers import InstitutionSerializer

def student_login_view(request):
    student_id = request.GET.get("student_id")
    student = Student.objects.get(student_id=student_id)
    
    institution = student.institution  # Assuming ForeignKey to Institution

    # Serialize the institution
    serialized_institution = InstitutionSerializer(institution).data

    return Response({
        "student_id": student.student_id,
        "institution": serialized_institution,
    })

