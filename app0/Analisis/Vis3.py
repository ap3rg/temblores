import json
import requests
import unidecode
import pandas as pd
import os.path as osp
from django.shortcuts import render

def clean_data(file_name):
    PATH_READ = osp.join("data", "homicidios", "csv", file_name)
    PATH_WRITE = osp.join("data", "homicidios", "csv", "clean_" + file_name)
    with open(PATH_READ, 'r') as r:
        with open(PATH_WRITE, 'w') as w:
            for line in r:
                line = line.strip()
                line = unidecode.unidecode(line)
                w.write(line + "\n")

print("Loading data ...")
PATH_violencia = osp.join("data", "Violencia_interpersonal", "csv", "clean_Violencia_interpersonal_departamento.csv")
PATH_population = osp.join("data", "department_population_data.csv")
df_p = pd.read_csv(PATH_population, sep="\t")
df_p["departamento"] = df_p["departamento"].str.upper()
df_v = pd.read_csv(PATH_violencia, sep='\t')
PATH_homicidio = osp.join("data", "homicidios", "csv", "clean_Homicidios_departamento.csv")
df_h = pd.read_csv(PATH_homicidio, sep='\t')
df_v.rename(columns=lambda x: x.strip(), inplace=True)
df_h.rename(columns=lambda x: x.strip(), inplace=True)



def get_totals(df):
    data = {}
    data_totals = df.loc[df['Municipio'] == "Total"]
    data_totals.drop(["Municipio"], inplace=True, axis=1)
    for val in data_totals["Departamento"]:
        print(val)
        data[val.upper()] = data_totals.loc[data_totals["Departamento"] == val]["casos"].values.tolist()[0]

    return json.dumps(data)

def get_data(df):
    data = {}
    dpts = df["Departamento"].unique().tolist()
    for dpt in dpts:
        datos = df.loc[df['Departamento'] == dpt]
        municipios = datos["Municipio"].tolist()[1:]
        casos = datos["casos"].tolist()[1:]
        data[dpt.upper()] = {"municipios": municipios, "casos": casos}

    return json.dumps(data)


def analizar(request):

    context = {}
    context["totals_v"] = get_totals(df_v)
    context["totals_h"] = get_totals(df_h)
    context["pop_data"] = df_p.to_json(orient="records")
    context["data_v"] = get_data(df_v)
    context["data_h"] = get_data(df_h)
    return render(request, 'app0/vis3.html', context)
