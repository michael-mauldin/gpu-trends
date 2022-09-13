from datetime import datetime, timedelta
from typing import Any

from flask import Flask, render_template

from src.charts import charts


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


if __name__ == '__main__':
    app.run(debug=True)