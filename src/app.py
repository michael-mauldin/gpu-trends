from datetime import datetime, timedelta

from flask import Flask, render_template

from src.charts import charts


"""
Start up:
set FLASK_ENV=development
flask run
"""

app: Flask = Flask(__name__)

DATABASE: str = '../tests.db'

@app.route('/')
def index() -> str:
    return render_template('index.html')


@app.route('/gpu_trend')
def get_gpu_trend() -> dict[str, str]:
    return charts.get_gpu_trend_chart_data(DATABASE)
    

if __name__ == '__main__':
    app.run(debug=True)