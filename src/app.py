from datetime import datetime, timedelta
from typing import Any

from flask import Flask, render_template, request

from src.posts import charts


"""
Start up:
set FLASK_ENV=development
flask run
"""

app: Flask = Flask(__name__)

DATABASE: str = '../posts.db'

@app.route('/')
def index() -> str:
    return render_template('index.html')


@app.route('/gpu_trend')
def get_gpu_trend() -> dict[Any, Any]:
    return charts.get_gpu_trend_chart_data(DATABASE)
    

@app.route('/gpu_prices')
def get_gpu_prices() -> dict[Any, Any]:
    return charts.get_gpu_price_data(DATABASE)


@app.route('/gpu_list')
def get_gpu_list() -> str:
    return charts.get_gpu_list_data(DATABASE)


@app.route('/gpu_posts')
def get_gpu_posts() -> str:
    model: str | None = request.args.get('model')
    return charts.get_gpu_posts_data(DATABASE, model)



if __name__ == '__main__':
    app.run(debug=True)


# TODO

# [ ] Section Blurbs.
# [ ] Data last updated query and component. 