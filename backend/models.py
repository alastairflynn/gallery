from django.db import models
from datetime import datetime, timezone

class ImageModel(models.Model):
  src = models.CharField(max_length=200)
  thumb = models.CharField(max_length=200)
  belongs_to = models.IntegerField()
  width = models.IntegerField()
  height = models.IntegerField()
  date = models.DateTimeField(default=datetime(1,1,1,tzinfo=timezone.utc))
  lat = models.FloatField(null=True)
  lon = models.FloatField(null=True)
  name = models.CharField(max_length=100)
  filesize = models.IntegerField()
  camera_make = models.CharField(max_length=50, null=True)
  camera_model = models.CharField(max_length=50, null=True)
  f_value = models.FloatField(null=True)
  exposure = models.IntegerField(null=True)
  focal_length = models.FloatField(null=True)
  iso = models.IntegerField(null=True)

class PathModel(models.Model):
  path = models.CharField(max_length=100)
