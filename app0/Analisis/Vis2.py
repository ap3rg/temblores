import json
import requests
import pandas as pd
import os.path as osp
from django.shortcuts import render

print("Loading data ...")
PATH_violencia = osp.join("data", "Violencia_interpersonal", "csv", "Violencia_interpersonal_edad_sexo.csv")
df_v = pd.read_csv(PATH_violencia, sep='\t')
PATH_homicidio = osp.join("data", "homicidios", "csv", "Homicidios_edad_sexo.csv")
df_h = pd.read_csv(PATH_homicidio, sep='\t')

df_v.rename(columns=lambda x: x.strip(), inplace=True)
df_h.rename(columns=lambda x: x.strip(), inplace=True)
df_v.drop(df_v.index[len(df_v)-1], inplace=True)
df_h.drop(df_h.index[len(df_h)-1], inplace=True)

def get_slider(df):
    data = df['Edad'].values.tolist()
    total = data.pop()
    return data

def get_data(df):
    data = []
    for x in df['Edad']:
        value = {}
        value["edad"] = x;
        value["mujer"] = df.loc[df["Edad"] == x]["Mujer"].values[0].tolist()
        value["hombre"] = df.loc[df["Edad"] == x]["Hombre"].values[0].tolist()
        value["total"] = df.loc[df["Edad"] == x]["Total"].values[0].tolist()
        data.append(value);
        print(data);
    return json.dumps(data)

def analizar(request):
    data_v = get_data(df_v)
    data_h = get_data(df_h)
    context = {}
    context["sliderValues"] = json.dumps(get_slider(df_v))
    context["data_v"] = data_v
    context["data_h"] = data_h

    return render(request, 'app0/vis2.html', context)
