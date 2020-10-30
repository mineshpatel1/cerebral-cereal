import psycopg2
from psycopg2.extras import DictCursor

# Converts decimal types to floats automatically in queries
DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    'DEC2FLOAT',
    lambda value, curs: float(value) if value is not None else None
)
psycopg2.extensions.register_type(DEC2FLOAT)

from .utils import log, get_config

class DBClient:
    def __init__(self, database, host=None, user=None, password=None):
        self.database = database
        self.host = host or get_config('HOST')
        self.user = user or get_config('POSTGRES_USER')
        self.password = password or get_config('POSTGRES_PASSWORD')

        self.conn = None
        self.connect()

    def connect(self):
        self.conn = psycopg2.connect(
            host=self.host,
            database=self.database,
            user=self.user,
            password=self.password,
        )

    def disconnect(self):
        self.conn.close()


    def get_table_schema(self, table):
        sql = f"""
        SELECT
            column_name
        FROM
            INFORMATION_SCHEMA.COLUMNS
        WHERE
            table_name = %s
            AND (
                column_default IS NULL
                OR column_default NOT LIKE '%%nextval%%'
            )
        """

        cur = self.conn.cursor()
        cur.execute(sql, (table,))
        rows = cur.fetchall()

        columns = [row[0] for row in rows]
        cur.close()

        return columns

    def insert(self, table, rows):
        columns = self.get_table_schema(table)
        _rows = []

        for row in rows:
            _row = []
            for col in columns:
                _row.append(row.get(col))
            _rows.append(tuple(_row))

        cur = self.conn.cursor()
        sql = f"""
        INSERT INTO {table}({','.join(columns)})
        VALUES ({','.join(['%s'] * len(columns))})
        """
        cur.executemany(sql, _rows)
        self.conn.commit()
        log.info(f"Inserted {len(rows)} rows into {table}.")
        cur.close()


    def query(self, query, limit=None):
        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute(query)

        if limit is None:
            rows = cur.fetchall()

        cur.close()
        return rows

