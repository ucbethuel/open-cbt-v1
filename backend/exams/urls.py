from django.urls import path
# from rest_framework import routers
from .views import  UploadQuestionsView


urlpatterns = [
    # path('', include(router.urls)),
    path('upload-questions/', UploadQuestionsView.as_view(), name='upload-questions'),
    # path("student/<int:student_id>/data", , name="student subject questions")
]
