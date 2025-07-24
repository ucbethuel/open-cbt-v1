from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from exams.models import Exam, Question, Subject
from cbt_sessions.models import ExamSession, Answer

User = get_user_model()

class ExamSessionTests(APITestCase):
    def setUp(self):
        # Create test user and authenticate
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.login(username='testuser', password='password123')

        # Create exam, subject
        self.subject = Subject.objects.create(name="Math")
        self.exam = Exam.objects.create(name="Midterm", subject=self.subject)

    def test_create_exam_session(self):
        url = reverse('exam-session-list')
        data = {"exam": self.exam.id}

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "New exam session started.")
        self.assertEqual(response.data['session']['student'], self.user.id)
        self.assertEqual(response.data['session']['exam'], self.exam.id)

    def test_resume_existing_session(self):
        session = ExamSession.objects.create(student=self.user, exam=self.exam)
        url = reverse('exam-session-list')
        data = {"exam": self.exam.id}

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Resuming existing exam session.")
        self.assertEqual(response.data['session']['id'], session.id)

    def test_partial_update_exam_session(self):
        session = ExamSession.objects.create(student=self.user, exam=self.exam)
        url = reverse('exam-session-detail', kwargs={'pk': session.pk})

        data = {
            'time_remaining': 1200,
            'completed': True,
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['time_remaining'], 1200)
        self.assertTrue(response.data['completed'])

class AnswerTests(APITestCase):
    def setUp(self):
        # User and data setup
        self.user = User.objects.create_user(username='answeruser', password='password123')
        self.client.login(username='answeruser', password='password123')

        self.subject = Subject.objects.create(name="Science")
        self.exam = Exam.objects.create(name="Final", subject=self.subject)
        self.session = ExamSession.objects.create(student=self.user, exam=self.exam)

        self.question = Question.objects.create(
            subject=self.subject,
            text="What is H2O?",
            option_a="Water",
            option_b="Oxygen",
            option_c="Hydrogen",
            option_d="Helium",
            answer='a',
            score=5.0
        )

    def test_create_answer(self):
        url = reverse('answer-list')
        data = {
            "session": self.session.id,
            "question": self.question.id,
            "selected_option": "a",
            "question_start_at": "2025-07-22T12:00:00Z",
            "question_duration_spent": 60,
            "grade": 5.0
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['selected_option'], 'a')
        self.assertEqual(response.data['correct_option'], 'a')
        self.assertTrue(response.data['is_correct'])
        self.assertEqual(float(response.data['awarded_grade']), 5.0)
