from django.shortcuts import render
from django.http import HttpResponse
from app0.Analisis import Vis1 as visualizacion1

def index(request):
    return render(request, 'app0/index.html', None)

def vis1(request):
    return visualizacion1.analizar(request)

def about(request):
    return render(request, 'app0/about.html', None)

def contact(request):
    return render(request, 'app0/contact.html', None)
