from rest_framework import serializers
from .models import ImageModel, PathModel

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = ['id',
                  'src',
                  'thumb',
                  'belongs_to',
                  'width',
                  'height',
                  'date',
                  'lat',
                  'lon',
                  'name',
                  'filesize',
                  'camera_make',
                  'camera_model',
                  'f_value',
                  'exposure',
                  'focal_length',
                  'iso']

class PathSerializer(serializers.ModelSerializer):
  class Meta:
    model = PathModel
    fields = ['id', 'path']
