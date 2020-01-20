from django.urls import include, path
from . import views

urlpatterns = [
  path('paths/', views.get_paths),
  path('thumbs/', views.get_thumbs),
  path('image/<int:id>/', views.get_image),
  path('image/<int:id>/next', views.get_next_image),
  path('image/<int:id>/previous', views.get_previous_image),
  path('import/', views.add_path),
  path('refresh/', views.refresh_all),
  path('path/<int:id>/refresh/', views.refresh_path),
  path('remove/', views.delete_all),
  path('path/<int:id>/remove', views.delete_path)
]

