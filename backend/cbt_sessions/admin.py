from django.contrib import admin

# Register your models here.

# admin.site.register(Session)
# admin.site.register(SessionDetail)
from .models import ExamSession, Answer

@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'subject', 'started_at', 'completed')
    search_fields = ('student__user__username', 'exam__name', 'subject__name')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('session', 'question', 'selected_option', 'answered_at')
    search_fields = ('session__student__user__username', 'question__text')