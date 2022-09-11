-- Table Schema
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    created_utc INTEGER,
    title TEXT,
    price REAL,
    model TEXT,
    domain TEXT,
    url TEXT
);

CREATE TABLE IF NOT EXISTS models (
    company TEXT,
    model TEXT,
    launch_date_utc INTEGER,
    launch_price REAL,
    keyword TEXT
);

