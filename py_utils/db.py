import psycopg2
from psycopg2.extras import DictCursor, CompositeCaster

# Converts decimal types to floats automatically in queries
DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    'DEC2FLOAT',
    lambda value, curs: float(value) if value is not None else None
)
psycopg2.extensions.register_type(DEC2FLOAT)

# Converts composite types to dicts instead of named tuples
class DictComposite(CompositeCaster):
    def make(self, values):
        return dict(zip(self.attnames, values))

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

    
    def query(self, query, params=None, limit=None, composites=None):
        cur = self.conn.cursor(cursor_factory=DictCursor)

        if composites:
            for ctype in composites:
                psycopg2.extras.register_composite(ctype, cur, factory=DictComposite)

        cur.execute(query, params)
        if limit is None:
            rows = cur.fetchall()
        else:
            raise NotImplementedError

        cur.close()
        return rows


    def get_type_attributes(self, user_defined_type):
        sql = f"""
        SELECT
            attribute_name
        FROM
            INFORMATION_SCHEMA.attributes
        WHERE
            udt_catalog = %s
            AND udt_name = %s
        ORDER BY ordinal_position
        """
        raw = self.query(sql, (self.database, user_defined_type))
        return [c['attribute_name'] for c in raw]


    def get_table_schema(self, table):
        sql = f"""
        SELECT
            column_name,
            data_type,
            udt_name,
            udt_schema
        FROM
            information_schema.columns
        WHERE
            table_catalog = %s
            AND table_name = %s
            AND (
                column_default IS NULL
                OR column_default NOT LIKE '%%nextval%%'
            )
        """
        return self.query(sql, (self.database, table))

    def insert(self, table, rows):
        schema = self.get_table_schema(table)

        columns = []
        for column in schema:
            column_name = column['column_name']
            if column['data_type'] == 'USER-DEFINED':
                data_type = None
                udt_name = column["udt_name"]
                udt_attrs = self.get_type_attributes(udt_name)
                placeholder = f'%s::{udt_name}'
            elif (
                column['data_type'] == 'ARRAY' and
                column['udt_schema'] == 'public'
            ):
                data_type = column['data_type']
                udt_name = column["udt_name"].replace("_", "", 1)
                udt_attrs = self.get_type_attributes(udt_name)
                placeholder = f'%s::{udt_name + "[]"}'
            else:
                data_type = None
                udt_name = None
                udt_attrs = None
                placeholder = '%s'

            columns.append({
                'column_name': column_name,
                'data_type': data_type,
                'placeholder': placeholder,
                'udt_name': udt_name,
                'udt_attrs': udt_attrs,
            })

        def _udt(cell, udt_attrs):
            item = []
            for attr in udt_attrs:
                item.append(cell.get(attr))
            return tuple(item)

        # Structure input dynamically based on user-defined types
        _rows = []
        for row in rows:
            _row = []
            for col in columns:
                _value = row.get(col['column_name'])

                if _value:
                    if col['udt_attrs']:
                        if col['data_type'] == 'ARRAY':
                            _values = []
                            for element in _value:
                                _values.append(
                                    _udt(element, col['udt_attrs'])
                                )
                            _value = _values
                        else:
                            _value = _udt(_value, col['udt_attrs'])
                _row.append(_value)
            _rows.append(tuple(_row))

        cur = self.conn.cursor()
        sql = f"""
        INSERT INTO {table}({','.join(c['column_name'] for c in columns)})
        VALUES ({','.join(c['placeholder'] for c in columns)})
        """
        cur.executemany(sql, _rows)
        self.conn.commit()
        log.info(f"Inserted {len(rows)} rows into {table}.")
        cur.close()


    

