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
        output: dict[str, str] = {}
        for model, company in df.groupby('company'):
            output[model] = (
                company[['price_to_msrp']]
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