from django.urls import path
# from rest_framework import routers
from .views import  UploadQuestionsView

# router = routers.DefaultRouter()
# router.register(r'exams', ExamViewSet)
# router.register(r'subjects', SubjectViewSet)
# router.register(r'questions', QuestionViewSet)
# router.register(r'options', OptionViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    path('upload-questions/', UploadQuestionsView.as_view(), name='upload-questions'),
]
