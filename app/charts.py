from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.model import geo_data
from app.model import cluster_data

app = FastAPI()
app.mount('/static', StaticFiles(directory='bower_components'), name='static')
app.mount('/js', StaticFiles(directory='js'), name='js')
templates = Jinja2Templates(directory='templates/')


@app.get('/')
def chart_data(request: Request):
    map_data = geo_data()
    cluster_plot_data = cluster_data()

    return templates.TemplateResponse(
        'map.html',
        context={
            'request': request,
            'map_data': map_data,
            'chart_data': cluster_plot_data,
        })
