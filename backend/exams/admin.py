from django.contrib import admin
from django.urls import path
from django.contrib import messages
from django.shortcuts import redirect
from django.template.response import TemplateResponse
import pandas as pd
from .models import Exam, Subject, Question, ExamGroup

# Register your models here.
# admin.site.register([Exam, Subject, Question, Option])

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('exam_id', 'name', 'date')
    search_fields = ('exam_id', 'name')

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'exam')
    search_fields = ('name', 'code')

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<path:object_id>/upload-questions/', self.admin_site.admin_view(self.upload_questions), name='subject-upload-questions'),
        ]
        return custom_urls + urls

    def upload_questions(self, request, object_id, *args, **kwargs):
        subject = self.get_object(request, object_id)
        if request.method == 'POST' and 'questions_file' in request.FILES:
            file = request.FILES['questions_file']
            try:
                if file.name.endswith('.csv'):
                    df = pd.read_csv(file)
                elif file.name.endswith(('.xls', '.xlsx')):
                    df = pd.read_excel(file)
                else:
                    self.message_user(request, 'Unsupported file format.', level=messages.ERROR)
                    return redirect(request.path)
                required_columns = {'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer'}
                if not required_columns.issubset(df.columns):
                    self.message_user(request, f'Missing columns. Required: {required_columns}', level=messages.ERROR)
                    return redirect(request.path)
                created = 0
                for _, row in df.iterrows():
                    Question.objects.create(
                        subject=subject,
                        text=row['question'],
                        option_a=row['option_a'],
                        option_b=row['option_b'],
                        option_c=row['option_c'],
                        option_d=row['option_d'],
                        answer=row['answer'].strip().lower()
                    )
                    created += 1
                self.message_user(request, f'{created} questions uploaded successfully.', level=messages.SUCCESS)
                return redirect(f'../../{object_id}/change/')
            except Exception as e:
                self.message_user(request, f'Error: {e}', level=messages.ERROR)
                return redirect(request.path)
        opts = self.model._meta
        app_label = opts.app_label
        context = dict(
            self.admin_site.each_context(request),
            original=subject,
            title='Upload Questions',
            opts=opts,
            app_label=app_label,
            add=False,  # Fixes KeyError for 'add'
        )
        return TemplateResponse(request, 'admin/exams/subject/change_form.html', context)

admin.site.register(Subject, SubjectAdmin)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'answer')
    search_fields = ('text',)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-questions/', self.admin_site.admin_view(self.upload_questions), name='question-upload-questions'),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        from .models import Subject
        if extra_context is None:
            extra_context = {}
        extra_context['messages'] = messages.get_messages(request)
        extra_context['subjects'] = Subject.objects.all()
        return super().changelist_view(request, extra_context=extra_context)

    def upload_questions(self, request, *args, **kwargs):
        from .models import Subject
        if request.method == 'POST' and 'questions_file' in request.FILES and 'subject_id' in request.POST:
            file = request.FILES['questions_file']
            subject_id = request.POST['subject_id']
            try:
                subject = Subject.objects.get(id=subject_id)
                if file.name.endswith('.csv'):
                    df = pd.read_csv(file)
                elif file.name.endswith(('.xls', '.xlsx')):
                    df = pd.read_excel(file)
                else:
                    self.message_user(request, 'Unsupported file format.', level=messages.ERROR)
                    return redirect(request.path)
                required_columns = {'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer'}
                if not required_columns.issubset(df.columns):
                    self.message_user(request, f'Missing columns. Required: {required_columns}', level=messages.ERROR)
                    return redirect(request.path)
                created = 0
                for _, row in df.iterrows():
                    answer_raw = str(row['answer']).strip()
                    options = [str(row['option_a']).strip(), str(row['option_b']).strip(), str(row['option_c']).strip(), str(row['option_d']).strip()]
                    answer_letter = ''
                    # Accept a/b/c/d or option text
                    if answer_raw.lower() in ['a', 'b', 'c', 'd']:
                        answer_letter = answer_raw.lower()
                    else:
                        for idx, opt in enumerate(options):
                            if opt.lower() == answer_raw.lower():
                                answer_letter = chr(ord('a') + idx)
                                break
                    if not answer_letter:
                        self.message_user(request, f"Answer '{answer_raw}' does not match any option or valid letter for question: {row['question']}", level=messages.ERROR)
                        continue
                    Question.objects.create(
                        subject=subject,
                        text=row['question'],
                        option_a=row['option_a'],
                        option_b=row['option_b'],
                        option_c=row['option_c'],
                        option_d=row['option_d'],
                        answer=answer_letter
                    )
                    created += 1
                self.message_user(request, f'{created} questions uploaded successfully.', level=messages.SUCCESS)
                return redirect('..')
            except Exception as e:
                self.message_user(request, f'Error: {e}', level=messages.ERROR)
                return redirect(request.path)
        context = dict(
            self.admin_site.each_context(request),
            title='Upload Questions',
            subjects=Subject.objects.all(),
        )
        return TemplateResponse(request, 'admin/exams/question/change_list.html', context)

@admin.register(ExamGroup)
class ExamGroupAdmin(admin.ModelAdmin):
    list_display = ('exam', 'name')
    search_fields = ('exam', 'student')