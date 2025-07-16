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
from exams.views import ExamViewSet, StudentExamViewSet, SubjectViewSet, QuestionViewSet
from cbt_sessions.views import ExamSessionViewSet, AnswerViewSet

router = routers.DefaultRouter()
# Students
router.register(r'students', StudentViewSet)
# # Exams
router.register(r'exams', ExamViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r"studentexam", StudentExamViewSet, basename="studentexam")
# # Sessions
router.register(r'exam-sessions', ExamSessionViewSet, basename='exam-session')
router.register(r'answers', AnswerViewSet, basename='answer')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/users/', include('users.urls')),

    # path('api/exams/', include('exams.urls')),  # for upload-questions endpoint
    # path('api/cbt/', include('cbt_sessions.urls')),  # for any custom cbt endpoints
    # path("api/", include("exam.urls")), path("docs", include_docs_urls(title="My API Docs"))
]


# | URL Pattern                   | ViewSet              | Description                               |
# | ----------------------------- | -------------------- | ----------------------------------------- |
# | `/api/students/`              | `StudentViewSet`     | Manage students                           |
# | `/api/exams/`                 | `ExamViewSet`        | Manage exams                              |
# | `/api/subjects/`              | `SubjectViewSet`     | Manage subjects                           |
# | `/api/questions/`             | `QuestionViewSet`    | Manage exam questions                     |
# | `/api/studentexam/<pk>/data/` | `StudentExamViewSet` | Get student-specific exam + question data |
# | `/api/exam-sessions/`         | `ExamSessionViewSet` | Create/update/fetch exam sessions         |
# | `/api/answers/`               | `AnswerViewSet`      | Handle answers for sessions               |


# | URL Pattern          | View                        | Description                    |
# | -------------------- | --------------------------- | ------------------------------ |
# | `/api/users/login/`  | `StudentLoginAPIView`       | Student login (GET/POST by ID) |
# | `/api/users/upload/` | `StudentBatchUploadAPIView` | Upload students via Excel/CSV  |


# | URL Pattern                    | View                  | Description                    |
# | ------------------------------ | --------------------- | ------------------------------ |
# | `/api/exams/upload-questions/` | `UploadQuestionsView` | Upload exam questions via file |

