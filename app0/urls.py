from django.urls import path, include

from . import views

app_name = 'app0'

urlpatterns = [
    path('', views.index, name='index'),
    path('vis1', views.vis1, name='vis1'),
    path('vis2', views.vis2, name='vis2'),
    path('vis3', views.vis3, name='vis3'),
    path('vis4', views.vis4, name='vis4'),
    path('about', views.about, name='about'),
]
