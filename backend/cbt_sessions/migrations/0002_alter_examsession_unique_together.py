# Generated by Django 5.2.4 on 2025-07-17 14:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cbt_sessions', '0001_initial'),
        ('exams', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='examsession',
            unique_together={('student', 'exam')},
        ),
    ]
