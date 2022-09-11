from datetime import datetime, timedelta

from src.posts import posts, db

DATABASE: str = 'tests.db'

db.init_db(DATABASE, './data/postsdb_schema.sql', './data/gpu_models.csv')

before = posts.get_yesterday()
after = before - timedelta(days=7)

db.update_posts(DATABASE, before, after)