from django.contrib import admin
from django.urls import path, reverse
from django.contrib import messages
from django.shortcuts import redirect
from django.template.response import TemplateResponse
import pandas as pd
from exams.views import UploadQuestionsView
from .models import Exam, Subject, Question, ExamGroup

# Register your models here.
# admin.site.register([Exam, Subject, Question, Option])

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('exam_id','subject', 'name', 'date', 'duration')
    search_fields = ('exam_id', 'subject', 'name')
    
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

    
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'answer', 'score')
    search_fields = ('text', 'subject')

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-questions/', self.admin_site.admin_view(self.upload_questions), name='question-upload-questions'),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):

        if extra_context is None:
            extra_context = {}

        extra_context['messages'] = messages.get_messages(request)
        extra_context['subjects'] = Subject.objects.all()

        # Add custom URL name (based on your custom path name)
        upload_url = reverse('admin:question-upload-questions')
        extra_context['upload_questions_url'] = upload_url

        return super().changelist_view(request, extra_context=extra_context)


    def upload_questions(self, request, *args, **kwargs):
        from .models import Subject

        if request.method == 'POST' and 'questions_file' in request.FILES and 'subject_id' in request.POST:
            file = request.FILES['questions_file']
            subject_id = request.POST['subject_id']

            try:
                subject = Subject.objects.get(id=subject_id)

                # Read the uploaded file
                if file.name.endswith('.csv'):
                    df = pd.read_csv(file)
                elif file.name.endswith(('.xls', '.xlsx')):
                    df = pd.read_excel(file)
                else:
                    self.message_user(request, 'Unsupported file format.', level=messages.ERROR)
                    return redirect(request.path)

                required_columns = {'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer', 'score'}

                if not required_columns.issubset(df.columns):
                    self.message_user(
                        request,
                        f'Missing columns. Required: {required_columns}',
                        level=messages.ERROR
                    )
                    return redirect(request.path)

                created = 0
                for _, row in df.iterrows():
                    answer_raw = str(row['answer']).strip()
                    options = [
                        str(row['option_a']).strip(),
                        str(row['option_b']).strip(),
                        str(row['option_c']).strip(),
                        str(row['option_d']).strip()
                    ]

                    answer_letter = ''
                    if answer_raw.lower() in ['a', 'b', 'c', 'd']:
                        answer_letter = answer_raw.lower()
                    else:
                        for idx, opt in enumerate(options):
                            if opt.lower() == answer_raw.lower():
                                answer_letter = chr(ord('a') + idx)
                                break

                    if not answer_letter:
                        self.message_user(
                            request,
                            f"Answer '{answer_raw}' does not match any option or valid letter for question: {row['question']}",
                            level=messages.ERROR
                        )
                        continue

                    Question.objects.create(
                        subject=subject,
                        text=row['question'],
                        option_a=row['option_a'],
                        option_b=row['option_b'],
                        option_c=row['option_c'],
                        option_d=row['option_d'],
                        answer=answer_letter,
                        score=float(str(row.get('score', 1)).strip())
                    )
                    created += 1

                self.message_user(request, f'{created} questions uploaded successfully.', level=messages.SUCCESS)
                return redirect(reverse('admin:exams_question_changelist'))

            except Exception as e:
                self.message_user(request, f'Error: {e}', level=messages.ERROR)
                return redirect(request.path)

        # GET request fallback: render upload form
        context = dict(
            self.admin_site.each_context(request),
            title='Upload Questions',
            subjects=Subject.objects.all(),
            app_label='exams',  
        )
        return TemplateResponse(request, 'admin/exams/question/upload_questions.html', context)


@admin.register(ExamGroup)
class ExamGroupAdmin(admin.ModelAdmin):
    list_display = ('exam', 'name','institution')
    search_fields = ('exam', 'student')