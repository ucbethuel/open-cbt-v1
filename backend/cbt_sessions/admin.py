from django.contrib import admin
from .models import ExamSession, Answer


@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'started_at', 'ended_at', 'completed', 'time_remaining')
    list_filter = ('exam', 'completed')
    search_fields = ('student__student_id', 'student__first_name', 'exam__name')
    readonly_fields = [field.name for field in ExamSession._meta.fields if field.name not in ['id', 'started_at']]
    # actions = None

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return True

    def has_change_permission(self, request, obj=None):
        return True


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('session', 'question', 'selected_option', 'correct_option', 'is_correct', 'awarded_grade')
    list_filter = ('is_correct', 'question__subject')
    search_fields = ('session__student__student_id', 'question__text')
    readonly_fields = [field.name for field in Answer._meta.fields]
    actions = None

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False
