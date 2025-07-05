from django.urls import path
from .views import StudentLoginAPIView, StudentBatchUploadAPIView

# router = routers.DefaultRouter()
# # router.register(r'students', StudentViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    path('student-login/', StudentLoginAPIView.as_view(), name='student-login'),
    path('students/batch-upload/', StudentBatchUploadAPIView.as_view(), name='student-batch-upload'),
]