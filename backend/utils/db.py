## CONEXIÓN MYSQL
import mysql.connector

from config.config import (
    MYSQL_CONFIG
)


class Database:

    @staticmethod
    def get_connection():

        return mysql.connector.connect(

            host=
            MYSQL_CONFIG["host"],

            user=
            MYSQL_CONFIG["user"],

            password=
            MYSQL_CONFIG["password"],

            database=
            MYSQL_CONFIG["database"]
        )
