import json
import requests
import datetime
import pandas as pd
import os.path as osp
from django.shortcuts import render
from django.template import Context

print("Loading data ...")
PATH_violencia = osp.join("data", "Violencia_interpersonal", "csv", "violencia_interpersonal_fecha_hora.csv")
df_v = pd.read_csv(PATH_violencia, sep='\t')
PATH_homicidio = osp.join("data", "homicidios", "csv", "Homicidios_hora_fecha.csv")
df_h = pd.read_csv(PATH_homicidio, sep='\t')

# for col in df_v.columns:
#     df_v[col] = df_v[col].apply(str)


def get_total(array, df):
    if len(array) != 2:
        print("Wrong length time array.")
        return
    year = array[0]
    month = array[1]

    return df.loc[(df['year'] == year) & (df['month'] == month)]

def get_totals(df):
    return df.loc[(df['month'] == 0)]

def build_data_dict(df):
    data = {}
    tmp = df.drop(['year'], inplace=False, axis=1)
    tmp.drop(['month'], inplace=True, axis=1)
    tmp.drop(['day'], inplace=True, axis=1)
    tmp.drop(['Total General'], inplace=True, axis=1)
    for i in range(0, df.shape[0]):
        year = df.iloc[i]['year']
        month = df.iloc[i]['month']
        day = df.iloc[i]['day']
        total = df.iloc[i]['Total General']
        instances = tmp.iloc[i].values.tolist()
        if(month != 0 and day != 0):
            date = datetime.datetime(year, month, day).strftime("%Y-%m-%d")
            #date = "{}-{}-{}".format(year, month, day)
            data[date] = instances

    # totals = get_totals()


    return json.dumps(data)

def analizar(request):
    context = {}
    context["data_v"] = build_data_dict(df_v)
    context["data_h"] = build_data_dict(df_h)


    print(context)
    return render(request, 'app0/vis1.html', context)
