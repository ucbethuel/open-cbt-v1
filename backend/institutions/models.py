from django.db import models

# Create your models here.
class Institution(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    logo = models.ImageField(upload_to='assets/photos/institutions/', null=True, blank=True)

    def __str__(self):
        return self.name