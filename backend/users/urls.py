from django.http import JsonResponse
from django.urls import path
from .views import StudentLoginAPIView, StudentBatchUploadAPIView

urlpatterns = [
    # path('', include(router.urls)),
    path('debug/', lambda request: JsonResponse({'message': 'Debug endpoint'}), name='debug'),
    path('student-login/', StudentLoginAPIView.as_view(), name='student-login'),
    path('students/batch-upload/', StudentBatchUploadAPIView.as_view(), name='student-batch-upload'),
]