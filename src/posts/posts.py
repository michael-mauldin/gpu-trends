from __future__ import annotations
from typing import Any, Iterator
from datetime import datetime, time, timedelta
import re

from pmaw import PushshiftAPI


def get_yesterday() -> datetime:
    """Return yesterday's date."""
    return datetime.combine(
        datetime.utcnow().date() - timedelta(days=1),
        time()
    )


def parse_price(description: str) -> float | None:
    """Return the highest price from the description."""
    regex: str = "[$]\s*(?<!\d)(?<!\d\.)(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?(?!\.?\d)"
    match: list[str] = re.findall(regex, description)
    if match:
        return max([float(value.replace('$','').replace(',','')) for value in match])
    return None


def parse_model(description: str, models: list[str]) -> str | None:
    """
    Search for model from list of GPU model keywords.
    
    Parameters
    ----------
    description: str
        description from a post's title field
    models: list
        list of gpu model keywords (high-end models ranked first)
    
    Returns
    -------
    keyword: str
        Return the found GPU model keyword
    """
    collapse_description: str = ''.join([char for char in description.lower() if char.isalnum()])

    for model in models:
        if model in collapse_description:
            return model
    return None


def request_posts(before: datetime, after: datetime) -> Iterator:
    """"""
    # Pushshift API requires timestamps
    before_ts: int = int(before.timestamp())
    after_ts: int = int(after.timestamp())

    api: PushshiftAPI = PushshiftAPI()

    def filter_gpu_flair(post) -> bool:
        """
        'search_submissions' filter function:
        returns True if GPU flair is in the post title.
        """
        return '[GPU]' in post['title']

    posts: Any = api.search_submissions(
        subreddit='buildapcsales',
        before=before_ts,
        after=after_ts,
        filter_fn=filter_gpu_flair
    )
    return posts


def parse_posts(posts: Iterator, models: list) -> list[tuple]:
    """
    Parse posts for price and model information.
    """
    post_list: list[tuple] = []
    for post in posts:
        description: str | None = post.get('title')
        post_list.append((
            post.get('id'),
            post.get('created_utc'),
            description,
            parse_price(description) if description else None,
            parse_model(description, models) if description else None,
            post.get('domain'),
            post.get('url')
        ))
    return post_list