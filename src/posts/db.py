from __future__ import annotations
from typing import Any, Iterator
from datetime import datetime
import sqlite3
import csv

from src.posts import posts as p


def init_db(database: str, schema: str, models: str) -> None:
    """Setup tables for posts and models."""
    with (
        sqlite3.connect(database) as connection,
        open(schema, 'r') as script,
        open(models, 'r') as file
    ):
        # setup tables
        connection.executescript(script.read())
        connection.commit()

        # insert gpu model data
        csvreader: Any = csv.reader(file)
        next(csvreader)  # skip headers
        for row in csvreader:
            connection.execute('INSERT INTO models VALUES (?, ?, ?, ?, ?);', row)
        connection.commit()


def update_posts(database: str, before: datetime, after: datetime) -> None:
    """Update posts table by requesting and parsing posts between given date range."""
    with sqlite3.connect(database) as connection:        
        c: Any = connection.execute('SELECT keyword FROM models;')
        models: list[str] = [item[0] for item in c.fetchall()]
        
        posts_gen: Iterator = p.request_posts(before, after)
        parsed_posts: list[tuple] = p.parse_posts(posts_gen, models)

        c.executemany('INSERT OR IGNORE INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)', parsed_posts)
        connection.commit()