from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import Student

class StudentIDAuthentication(BaseAuthentication):
    """
    Custom authentication using student_id in Authorization header.
    Example header: Authorization: StudentID 123456
    """
    def authenticate(self, request):
        auth = request.headers.get('Authorization')
        if not auth or not auth.startswith('StudentID '):
            return None

        student_id = auth.split(' ')[1]
        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            raise AuthenticationFailed('Invalid student_id.')

        # Return the student object as the 'user' (and None for auth)
        return (student, None)
