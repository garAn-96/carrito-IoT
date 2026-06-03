from utils.db import Database


class MovimientoModel:

    # ======================================
    # REGISTRAR MOVIMIENTO
    # ======================================

    @staticmethod
    def registrar_movimiento(

        movimiento,
        origen="manual"

    ):

        connection = Database.get_connection()

        cursor = connection.cursor()

        cursor.callproc(

            "sp_registrar_movimiento",

            [
                movimiento,
                origen
            ]
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

        SELECT

            mr.id_registro,

            cm.nombre_movimiento,

            mr.origen,

            mr.fecha_registro

        FROM movimientos_registrados mr

        INNER JOIN cat_movimientos cm
        ON mr.id_movimiento =
        cm.id_movimiento

        ORDER BY mr.id_registro DESC

        LIMIT 10

        """

        cursor.execute(query)

        resultado = cursor.fetchall()

        cursor.close()

        connection.close()

        return resultado

    # ======================================
    # ULTIMO MOVIMIENTO
    # ======================================

    @staticmethod
    def obtener_ultimo():

        connection = Database.get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """

        SELECT

            cm.nombre_movimiento,

            mr.origen,

            mr.fecha_registro

        FROM movimientos_registrados mr

        INNER JOIN cat_movimientos cm
        ON mr.id_movimiento =
        cm.id_movimiento

        ORDER BY mr.id_registro DESC

        LIMIT 1

        """

        cursor.execute(query)

        resultado = cursor.fetchone()

        cursor.close()

        connection.close()

        return resultado
