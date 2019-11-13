from django.urls import path, include

from . import views

app_name = 'app0'

urlpatterns = [
    path('', views.index, name='index'),
    path('vis1', views.vis1, name='vis1'),
    path('vis2', views.vis2, name='vis2'),
    path('about', views.about, name='about'),
    path('contact', views.contact, name='contact')
]
