from rest_framework import serializers
from institutions.models import Institution


class InstitutionalSerializers(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = "__all__"