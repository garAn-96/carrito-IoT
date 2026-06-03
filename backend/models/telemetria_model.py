from utils.db import Database


class TelemetriaModel:

    # ======================================
    # REGISTRAR
    # ======================================

    @staticmethod
    def registrar_telemetria(

        ip,
        estado

    ):

        connection = Database.get_connection()

        cursor = connection.cursor()

        cursor.callproc(

            "sp_registrar_telemetria",

            [
                ip,
                estado
            ]
        )

        connection.commit()

        cursor.close()

        connection.close()

    # ======================================
    # ULTIMA
    # ======================================

    @staticmethod
    def obtener_ultima():

        connection = Database.get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """

        SELECT *

        FROM telemetria

        ORDER BY id_telemetria DESC

        LIMIT 1

        """

        cursor.execute(query)

        resultado = cursor.fetchone()

        cursor.close()

        connection.close()

        return resultado

