from utils.db import Database


class ObstaculoModel:

    # ======================================
    # REGISTRAR
    # ======================================

    @staticmethod
    def registrar_obstaculo(
        distancia
    ):

        connection = Database.get_connection()

        cursor = connection.cursor()

        cursor.callproc(

            "sp_registrar_obstaculo",

            [distancia]
        )

        connection.commit()

        cursor.close()

        connection.close()

    # ======================================
    # HISTORIAL
    # ======================================

    @staticmethod
    def obtener_historial():

        connection = Database.get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """

        SELECT *

        FROM obstaculos

        ORDER BY id_obstaculo DESC

        LIMIT 10

        """

        cursor.execute(query)

        resultado = cursor.fetchall()

        cursor.close()

        connection.close()

        return resultado

    # ======================================
    # ULTIMO
    # ======================================

    @staticmethod
    def obtener_ultimo():

        connection = Database.get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """

        SELECT *

        FROM obstaculos

        ORDER BY id_obstaculo DESC

        LIMIT 1

        """

        cursor.execute(query)

        resultado = cursor.fetchone()

        cursor.close()

        connection.close()

        return resultado

