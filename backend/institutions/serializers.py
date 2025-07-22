from rest_framework import serializers
from institutions.models import Institution

class InstitutionalSerializers(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = ['id', 'name', 'address', 'logo_url']  # use logo_url instead of raw logo path

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and hasattr(obj.logo, 'url'):
            return request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
        return None
