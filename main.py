from datetime import datetime, timedelta

from src.posts import db
from src.posts import posts

DATABASE: str = 'posts.db'

db.init_db(DATABASE, './data/postsdb_schema.sql', './data/gpu_models.csv')

before: datetime = datetime(2022, 9, 1)
after: datetime = datetime(2020, 9, 1)

db.update_posts(DATABASE, before, after)
