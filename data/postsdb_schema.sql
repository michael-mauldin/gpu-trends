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

CREATE VIEW IF NOT EXISTS plot_posts
AS
WITH rank_price_to_msrp AS (
	SELECT
		datetime(p.created_utc, 'unixepoch', 'localtime') AS postdate,
		m.company,
		m.model,
		p.url,
		p.price,
		p.price / m.launch_price AS price_to_msrp,
		PERCENT_RANK() OVER (ORDER BY p.price / m.launch_price) price_rank
	FROM posts p
	JOIN models m
	ON p.model = m.keyword
	WHERE p.price IS NOT NULL
)
SELECT
	*
FROM rank_price_to_msrp
WHERE
	price_rank > 0.01 AND
	price_rank < 0.99 AND
	postdate >  date('now', '-2 years');
	