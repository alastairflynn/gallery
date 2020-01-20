#from django.shortcuts import render
#from django.views import View
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from PIL import Image, ExifTags
from os.path import join, split, basename, getsize
from os import walk, makedirs, symlink, unlink
from shutil import rmtree
from datetime import datetime, timezone

from .models import ImageModel, PathModel
from .serializers import ImageSerializer, PathSerializer

@require_http_methods(['GET'])
def get_paths(request):
  serial = PathSerializer(PathModel.objects.all().order_by('-id'), many=True)
  return JsonResponse(serial.data, safe=False)

@require_http_methods(['GET'])
def get_image(request, id):
  serial = ImageSerializer(ImageModel.get(id=id))
  return JsonResponse(serial.data, safe=False)

@require_http_methods(['GET'])
def get_next_image(request, id):
  im = ImageModel.objects.get(id=id)
  more_recent = ImageModel.objects.filter(date__gt=im.date).order_by('date')
  serial = ImageSerializer(more_recent[0])
  return JsonResponse(serial.data, safe=False)

@require_http_methods(['GET'])
def get_previous_image(request, id):
  im = ImageModel.objects.get(id=id)
  less_recent = ImageModel.objects.filter(date__lt=im.date).order_by('-date')
  serial = ImageSerializer(less_recent[0])
  return JsonResponse(serial.data, safe=False)

@csrf_exempt
@require_http_methods(['POST'])
def add_path(request):
  path = request.body.decode('utf-8')
  image_path = process_directory(path)
  serial = PathSerializer(image_path)
  return JsonResponse(serial.data, safe=False)

@require_http_methods(['GET'])
def get_thumbs(request):
  serial = ImageSerializer(ImageModel.objects.all().order_by('-date'), many=True)
  return JsonResponse(serial.data, safe=False)

@csrf_exempt
@require_http_methods(['PUT'])
def refresh_all(request):
  reload_library()
  return HttpResponse()

@csrf_exempt
@require_http_methods(['PUT'])
def refresh_path(request, id):
  reload_directory(id)
  return HttpResponse()

@csrf_exempt
@require_http_methods(['DELETE'])
def delete_all(request):
  remove_all()
  return HttpResponse()

@csrf_exempt
@require_http_methods(['DELETE'])
def delete_path(request, id):
  remove_directory(id)
  return HttpResponse()

def remove_all():
  ImageModel.objects.all().delete()
  try:
    rmtree(join(settings.BASE_DIR, 'images', 'thumbs'))
  except FileNotFoundError:
    pass
  for image_path in PathModel.objects.all():
    try:
      unlink(join('images', str(image_path.id)))
    except FileNotFoundError:
      pass
  PathModel.objects.all().delete()

def remove_directory(id):
  image_path = PathModel.objects.get(id=id)
  ImageModel.objects.filter(belongs_to=id).delete()
  try:
    rmtree(join(settings.BASE_DIR, 'images', 'thumbs', str(id)))
  except FileNotFoundError:
    pass
  try:
    unlink(join('images', str(id)))
  except FileNotFoundError:
    pass
  image_path.delete()

def reload_library():
  ImageModel.objects.all().delete()
  try:
    rmtree(join(settings.BASE_DIR, 'images', 'thumbs'))
  except FileNotFoundError:
    pass
  for image_path in PathModel.objects.all():
    try:
      makedirs(join(settings.BASE_DIR, 'images', 'thumbs', str(image_path.id)))
    except FileExistsError:
      pass
    link = join('images', str(image_path.id))
    for root, dirs, files in walk(link):
      for name in files:
        process_image(join(root, name), image_path.id)

def reload_directory(id):
  for image in ImageModel.objects.filter(belongs_to=id):
    image.delete()
  try:
    rmtree(join(settings.BASE_DIR, 'images', 'thumbs', str(id)))
  except FileNotFoundError:
    pass
  try:
    makedirs(join(settings.BASE_DIR, 'images', 'thumbs', str(id)))
  except FileExistsError:
    pass
  link = join('images', str(id))
  for root, dirs, files in walk(link):
    for name in files:
      process_image(join(root, name), id)

def process_directory(path):
  try:
    PathModel.objects.get(path=path)
    image_path = None
  except PathModel.DoesNotExist:
    image_path = PathModel(path=path)
    image_path.save()

    link = join('images', str(image_path.id))
    full_link = join(settings.BASE_DIR, link)
    symlink(path, full_link)

    #image_path.path = link
    #image_path.save()

    try:
      makedirs(join(settings.BASE_DIR, 'images', 'thumbs', str(image_path.id)))
    except FileExistsError:
      pass

    for root, dirs, files in walk(link):
      for name in files:
        process_image(join(root, name), image_path.id)
  return image_path

def process_image(path, dir_id):
  try:
    im = Image.open(path)

    width, height = im.size

    exif = {ExifTags.TAGS[k]:v for (k,v) in im._getexif().items() if k in ExifTags.TAGS}
    date = datetime.fromisoformat(exif['DateTime'].replace(':', '-', 2))
    if date.tzinfo is None:
      date = date.replace(tzinfo=timezone.utc)
    camera_make = exif['Make']
    camera_model = exif['Model']
    f_value = exif['FNumber'][0] / exif['FNumber'][1]
    exposure = exif['ExposureTime'][1] // exif['ExposureTime'][0]
    focal_length = exif['FocalLength'][0] / exif['FocalLength'][1]
    iso = exif['ISOSpeedRatings']
    try:
      gpsinfo = exif['GPSInfo']
      lat, lon = get_latlon(gpsinfo)
    except KeyError:
      lat = None
      lon = None

    #print(f_value, exposure, focal_length, iso)
    image = ImageModel(src=path, thumb='dummy', belongs_to=dir_id, width=width, height=height, date=date, lat=lat, lon=lon, name=basename(path), filesize=getsize(path), camera_make=camera_make, camera_model=camera_model, f_value=f_value, exposure=exposure, focal_length=focal_length, iso=iso)
    image.save()

    thumbpath = join('images', 'thumbs', str(dir_id), str(image.id)) + '.webp'
    full_thumbpath = join(settings.BASE_DIR, thumbpath)
    thumb = im.thumbnail((int(200*width/height), 200))
    im.save(full_thumbpath, format='webp')

    image.thumb = thumbpath
    image.save()
  except IOError:
    pass

def get_latlon(gpsinfo):
  y = gpsinfo[2]
  x = gpsinfo[4]
  lat = y[0][0]/y[0][1] + (y[1][0]/y[1][1])/60 + (y[2][0]/y[2][1])/60**2
  lon = x[0][0]/x[0][1] + (x[1][0]/x[1][1])/60 + (x[2][0]/x[2][1])/60**2
  if gpsinfo[1] == 'S':
    lat *= -1
  if gpsinfo[3] == 'W':
    lon *= -1
  return lat, lon
