from django.shortcuts import render
from django.http import HttpResponse
from app0.Analisis import Vis1 as visualizacion1
from app0.Analisis import Vis2 as visualizacion2
from app0.Analisis import Vis3 as visualizacion3
from app0.Analisis import Vis4 as visualizacion4

def index(request):
    return render(request, 'app0/index.html', None)

def vis1(request):
    return visualizacion1.analizar(request)

def vis2(request):
    return visualizacion2.analizar(request)

def vis3(request):
    return visualizacion3.analizar(request)

def vis4(request):
    return visualizacion4.analizar(request)

def about(request):
    return render(request, 'app0/about.html', None)
