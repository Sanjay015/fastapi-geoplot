import json
import pandas as pd


def geo_data():
    with open('data/rewind.geojson') as fp:
        return json.load(fp)


def cluster_data():
    data = pd.read_csv('data/cluster_data.csv')
    return data.to_dict(orient='records')
