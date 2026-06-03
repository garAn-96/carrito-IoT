from utils.db import Database


class DemoModel:

    # ======================================
    # OBTENER DEMOS
    # ======================================

    @staticmethod
    def obtener_demos():

        connection = Database.get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """

        SELECT *

        FROM demos

        ORDER BY id_demo ASC

        """

        cursor.execute(query)

        resultado = cursor.fetchall()

        cursor.close()

        connection.close()

        return resultado

    # ======================================
    # MOVIMIENTOS DEMO
    # ======================================

    @staticmethod
    def obtener_movimientos_demo(
        id_demo
    ):

        connection = Database.get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """

        SELECT

            dm.orden_movimiento,

            cm.nombre_movimiento

        FROM demo_movimientos dm

        INNER JOIN cat_movimientos cm
        ON dm.id_movimiento =
        cm.id_movimiento

        WHERE dm.id_demo = %s

        ORDER BY dm.orden_movimiento ASC

        """

        cursor.execute(
            query,
            [id_demo]
        )

        resultado = cursor.fetchall()

        cursor.close()

        connection.close()

        return resultado
