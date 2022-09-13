from typing import Any
import pandas as pd
import sqlite3


def get_gpu_trend_chart_data(database: str) -> dict[str, str]:
    """"""
    with sqlite3.connect(database) as connection:
        df:pd.DataFrame = pd.read_sql(
            'SELECT * FROM plot_posts',
            connection,
            parse_dates=['postdate'],
            index_col='postdate'
        )

        # group by company and calculate price_to_msrp trend
        output: dict[Any, Any] = {}
        for company, group in df.groupby('company'):
            output[company] = (
                group[['price_to_msrp']]
                .sort_index()
                .resample('W').mean()
                .rolling('30D').mean()
                .reset_index()
                .to_dict(orient='records')
            )

        # sample the plot posts for the scatter plot
        size: int = len(df) if len(df) < 1000 else 1000
        
        df_scatter: pd.DataFrame = (
            df[['price_to_msrp']]
            .reset_index()
            .sample(size)
        )

        # add sampled scatter to output
        output['scatter'] = df_scatter.to_dict(orient='records')

    return output


def get_gpu_price_data(database: str) -> dict[Any, Any]:
    with sqlite3.connect(database) as connection:
        query: str = """
        WITH daycount AS (
            SELECT
                *,
                dense_rank() over (order by date(postdate) desc) as days
            FROM plot_posts
        ),
        addperiod AS (
            SELECT
                *,
                CASE
                    WHEN days BETWEEN 1 AND 30 THEN "Month 1"
                    WHEN days BETWEEN 90 AND 120 THEN "Month 3"
                    ELSE NULL
                END period
            FROM daycount
            WHERE period IS NOT NULL
        )
        SELECT
            company,
            model,
            period,
            ROUND(AVG(price), 2) AS avg_price
        FROM addperiod
        GROUP BY company, model, period
        ORDER BY company, model, period
        """
        df: pd.DataFrame = (
            pd.read_sql(query, connection)
            .pivot(index=['company', 'model'], columns='period')
            .dropna()
            .reset_index()
            .sort_values(('avg_price', 'Month 3'))
        )
        df.columns = ['company', 'model', 'now', 'mo3_ago']  # type: ignore
        output: dict[Any, Any] = {}
        for company, group in df.groupby('company'):
            output[company] = group.to_dict(orient='records')
        
        return output


def get_gpu_posts_data(database: str) -> dict[Any, Any]:
    with sqlite3.connect(database) as connection:
        query: str = """
        select
            postdate,
            company,
            model,
            url,
            price,
            price_to_msrp
        from
            plot_posts
        where
            postdate > date( (select max(postdate) from plot_posts), '-7 days' )
        """
        
        df: pd.DataFrame = pd.read_sql(query, connection)
        df_models: pd.DataFrame = df.model.unique()
