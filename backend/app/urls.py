"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from users.views import StudentViewSet
from exams.views import ExamViewSet, SubjectViewSet, QuestionViewSet
from cbt_sessions.views import ExamSessionViewSet, AnswerViewSet

router = routers.DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'sessions', ExamSessionViewSet)
router.register(r'answers', AnswerViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/users/', include('users.urls')),  # for login and batch upload
    path('api/exams/', include('exams.urls')),  # for upload-questions endpoint
    path('api/cbt/', include('cbt_sessions.urls')),  # for any custom cbt endpoints
]
