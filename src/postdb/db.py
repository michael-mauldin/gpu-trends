from __future__ import annotations
from typing import Any, Iterator
from datetime import datetime
import sqlite3
import csv

from src.postdb import posts as p


def init_db(database_name: str, schema_file: str, models_csv: str) -> None:
    """
    Setup tables for posts and models.
    
    Parameters
    ----------
    database_name: str
        name of the database to be created
    schema_file: str
        name of the sql file containing the table schema
    models_csv: str
        name of csv with GPU model info to be inserted into the 'models' table.
    """
    with (
        sqlite3.connect(database_name) as connection,
        open(schema_file, 'r') as script,
        open(models_csv, 'r') as file
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
    """
    Update posts table by requesting and parsing posts between given date range.
    
    Parameters
    ----------
    database: str
        name of the database to update
    before: datetime
        requests posts dated before this date (upper bound).
    after: datetime
        request posts dated after this date (lower bound).
    """
    with sqlite3.connect(database) as connection:        
        c: Any = connection.execute('SELECT keyword FROM models;')
        models: list[str] = [item[0] for item in c.fetchall()]
        
        posts_gen: Iterator = p.request_posts(before, after)
        parsed_posts: list[tuple] = p.parse_posts(posts_gen, models)

        c.executemany('INSERT OR IGNORE INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)', parsed_posts)
        connection.commit()