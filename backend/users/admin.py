from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.contrib import messages
from django.template.response import TemplateResponse
from users.models import Student
# # Register your models here.
# admin.site.register(Student)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'first_name', 'last_name', 'email', "institution", 'course', 'is_active', 'created_by')
    search_fields = ('student_id', 'first_name', 'last_name', 'email', 'course', "institution")
    list_filter = ('is_active', 'course', 'gender', "institution")
    readonly_fields = ('date_joined', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('student_id', 'first_name', 'last_name', 'email', "institution", 'phone_number', 'date_of_birth', 'gender', 'course', 'photo', 'is_active', 'created_by', 'date_joined')
        }),
    )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-students/', self.admin_site.admin_view(self.upload_students), name='student-upload-students'),
        ]
        return custom_urls + urls

    # def changelist_view(self, request, extra_context=None):
    #     if extra_context is None:
    #         extra_context = {}
    #     extra_context['messages'] = messages.get_messages(request)
    #     return super().changelist_view(request, extra_context=extra_context)

    def upload_students(self, request, *args, **kwargs):
        from django.contrib.auth.models import User
        if request.method == 'POST' and 'students_file' in request.FILES:
            file = request.FILES['students_file']
            try:
                import pandas as pd
                if file.name.endswith('.csv'):
                    df = pd.read_csv(file)
                elif file.name.endswith(('.xls', '.xlsx')):
                    df = pd.read_excel(file)
                else:
                    self.message_user(request, 'Unsupported file format.', level=messages.ERROR)
                    return redirect(request.path)
                required_columns = {'student_id', 'first_name', 'last_name', 'email', 'course'}
                if not required_columns.issubset(df.columns):
                    self.message_user(request, f'Missing columns. Required: {required_columns}', level=messages.ERROR)
                    return redirect(request.path)
                created = 0
                for _, row in df.iterrows():
                    student_id = str(row['student_id']).strip()
                    first_name = str(row['first_name']).strip()
                    last_name = str(row['last_name']).strip()
                    email = str(row['email']).strip()
                    course = str(row['course']).strip()
                    phone_number = str(row.get('phone_number', '')).strip()
                    date_of_birth = row.get('date_of_birth', None)
                    gender = str(row.get('gender', '')).strip().upper()[:1] if row.get('gender') else ''
                    is_active = bool(row.get('is_active', True))
                    if not student_id or not first_name or not last_name or not email or not course:
                        continue
                    Student.objects.get_or_create(
                        student_id=student_id,
                        defaults={
                            'first_name': first_name,
                            'last_name': last_name,
                            'email': email,
                            'course': course,
                            'phone_number': phone_number,
                            'date_of_birth': date_of_birth,
                            'gender': gender,
                            'is_active': is_active,
                            'created_by': request.user if request.user.is_authenticated else None
                        }
                    )
                    created += 1
                self.message_user(request, f'{created} students uploaded successfully.', level=messages.SUCCESS)
                return redirect('..')
            except Exception as e:
                self.message_user(request, f'Error: {e}', level=messages.ERROR)
                return redirect(request.path)
        context = dict(
            self.admin_site.each_context(request),
            title='Upload Students',
            help_text=(
                "<b>Expected columns:</b> student_id, first_name, last_name, email, course. "
                "Optional: phone_number, date_of_birth (YYYY-MM-DD), gender (M/F), is_active (True/False).<br>"
                "Upload a CSV or Excel file. Existing student_id will be ignored. "
                "Date of birth must be in YYYY-MM-DD format. Gender must be 'M' or 'F'. "
                "Email must be unique."
            )
        )
        return TemplateResponse(request, 'admin/users/student/change_list.html', context)



admin.site.site_header = "CBT Admin Portal"
admin.site.site_title = "CBT Management"
admin.site.index_title = "Welcome to the CBT Admin Panel"
