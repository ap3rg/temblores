import json
import requests
import pandas as pd
import os.path as osp
from django.shortcuts import render

PATH_mecanismoV = osp.join("data", "Violencia_interpersonal", "csv", "Violencia_interpersonal_mecanismo.csv")
PATH_mecanismoH= osp.join("data", "homicidios", "csv", "Homicidos_mecanismo.csv")
PATH_causaH = osp.join("data", "homicidios", "csv", "Homicidios_causa.csv")
PATH_ocupacionH = osp.join("data", "homicidios", "csv", "Homicidios_ocupacion.csv")
PATH_ocupacionV = osp.join("data", "Violencia_interpersonal", "csv", "Violencia_interpersonal_ocupacion.csv")
PATH_minoriaH = osp.join("data", "homicidios", "csv", "Homicidios_minoria.csv")
PATH_minoriaV = osp.join("data", "Violencia_interpersonal", "csv", "Violencia_interpersonal_minoria.csv")

def getData(path):
    data = {}
    df = pd.read_csv(path, sep="\t")
    label_name = df.columns[0]
    data_name = df.columns[1]

    labels = df[label_name].tolist()
    values = df[data_name].tolist()

    data = {"labels": labels, "data": values}
    return json.dumps(data)


def analizar(request):

    context = {}
    context["mecanismoV"] = getData(PATH_mecanismoV)
    context["mecanismoH"] = getData(PATH_mecanismoH)
    context["causaH"] = getData(PATH_causaH)
    context["ocupacionH"] = getData(PATH_ocupacionH)
    context["ocupacionV"] = getData(PATH_ocupacionV)
    context["minoriaV"] = getData(PATH_minoriaV)
    context["minoriaH"] = getData(PATH_minoriaH)

    return render(request, 'app0/vis4.html', context)
