from flask import Flask
from flask import jsonify
from flask_cors import CORS

import asyncio
import threading
import time

from websocket.websocket_server import (
    WebSocketServer
)

from models.movimiento_model import (
    MovimientoModel
)

from models.obstaculo_model import (
    ObstaculoModel
)

from models.telemetria_model import (
    TelemetriaModel
)

from models.demo_model import (
    DemoModel
)

# ==========================================
# FLASK
# ==========================================

app = Flask(__name__)

CORS(app)

# ==========================================
# WEBSOCKET
# ==========================================

def iniciar_websocket():

    WebSocketServer.start(
        host="0.0.0.0",
        port=8765
    )

threading.Thread(

    target=iniciar_websocket,

    daemon=True

).start()

# ==========================================
# FUNCION ENVIAR MOVIMIENTO
# ==========================================

def enviar_movimiento(

    movimiento,
    origen="manual"

):

    # ======================================
    # GUARDAR DB
    # ======================================

    MovimientoModel.registrar_movimiento(

        movimiento,
        origen
    )

    # ======================================
    # WS
    # ======================================

    data = {

        "tipo":"movimiento",

        "movimiento": movimiento,

        "origen": origen
    }

    asyncio.run(

        WebSocketServer.enviar_a_esp(
            data
        )

    )

    asyncio.run(

        WebSocketServer.broadcast(
            data
        )

    )

    return jsonify({

        "ok":True
    })

# ==========================================
# MOVIMIENTOS BASICOS
# ==========================================

@app.route(
    "/adelante",
    methods=["POST"]
)
def adelante():

    return enviar_movimiento(
        "adelante"
    )

@app.route(
    "/atras",
    methods=["POST"]
)
def atras():

    return enviar_movimiento(
        "atras"
    )

@app.route(
    "/izquierda",
    methods=["POST"]
)
def izquierda():

    return enviar_movimiento(
        "izquierda"
    )

@app.route(
    "/derecha",
    methods=["POST"]
)
def derecha():

    return enviar_movimiento(
        "derecha"
    )

@app.route(
    "/stop",
    methods=["POST"]
)
def stop():

    return enviar_movimiento(
        "stop"
    )

# ==========================================
# DIAGONALES
# ==========================================

@app.route(
    "/vuelta_adelante_derecha",
    methods=["POST"]
)
def vuelta_adelante_derecha():

    return enviar_movimiento(
        "vuelta_adelante_derecha"
    )

@app.route(
    "/vuelta_adelante_izquierda",
    methods=["POST"]
)
def vuelta_adelante_izquierda():

    return enviar_movimiento(
        "vuelta_adelante_izquierda"
    )

@app.route(
    "/vuelta_atras_derecha",
    methods=["POST"]
)
def vuelta_atras_derecha():

    return enviar_movimiento(
        "vuelta_atras_derecha"
    )

@app.route(
    "/vuelta_atras_izquierda",
    methods=["POST"]
)
def vuelta_atras_izquierda():

    return enviar_movimiento(
        "vuelta_atras_izquierda"
    )

# ==========================================
# GIROS
# ==========================================

@app.route(
    "/giro_90_derecha",
    methods=["POST"]
)
def giro_90_derecha():

    return enviar_movimiento(
        "giro_90_derecha"
    )

@app.route(
    "/giro_90_izquierda",
    methods=["POST"]
)
def giro_90_izquierda():

    return enviar_movimiento(
        "giro_90_izquierda"
    )

@app.route(
    "/giro_360_derecha",
    methods=["POST"]
)
def giro_360_derecha():

    return enviar_movimiento(
        "giro_360_derecha"
    )

@app.route(
    "/giro_360_izquierda",
    methods=["POST"]
)
def giro_360_izquierda():

    return enviar_movimiento(
        "giro_360_izquierda"
    )

# ==========================================
# VELOCIDAD
# ==========================================

@app.route(
    "/api/velocidad/<int:valor>",
    methods=["POST"]
)
def velocidad(valor):

    data = {

        "tipo":"parametro",

        "velocidad": valor
    }

    asyncio.run(

        WebSocketServer.enviar_a_esp(
            data
        )

    )

    asyncio.run(

        WebSocketServer.broadcast(
            data
        )

    )

    return jsonify({
        "ok":True
    })

# ==========================================
# HISTORIAL MOVIMIENTOS
# ==========================================

@app.route(
    "/api/historial"
)
def historial():

    return jsonify(

        MovimientoModel
        .obtener_historial()

    )

# ==========================================
# ULTIMO MOVIMIENTO
# ==========================================

@app.route(
    "/api/ultimo_movimiento"
)
def ultimo_movimiento():

    return jsonify(

        MovimientoModel
        .obtener_ultimo()

    )

# ==========================================
# OBSTACULOS
# ==========================================

@app.route(
    "/api/obstaculos"
)
def obstaculos():

    return jsonify(

        ObstaculoModel
        .obtener_historial()

    )

# ==========================================
# ULTIMO OBSTACULO
# ==========================================

@app.route(
    "/api/ultimo_obstaculo"
)
def ultimo_obstaculo():

    return jsonify(

        ObstaculoModel
        .obtener_ultimo()

    )

# ==========================================
# TELEMETRIA
# ==========================================

@app.route(
    "/api/telemetria"
)
def telemetria():

    return jsonify(

        TelemetriaModel
        .obtener_ultima()

    )

# ==========================================
# DEMOS
# ==========================================

@app.route(
    "/api/demos"
)
def demos():

    return jsonify(

        DemoModel
        .obtener_demos()

    )

# ==========================================
# MOVIMIENTOS DEMO
# ==========================================

@app.route(
    "/api/demo/<int:id_demo>"
)
def demo_movimientos(
    id_demo
):

    return jsonify(

        DemoModel
        .obtener_movimientos_demo(
            id_demo
        )

    )

# ==========================================
# EJECUTAR DEMO
# ==========================================

@app.route(
    "/api/ejecutar_demo/<int:id_demo>",
    methods=["POST"]
)
def ejecutar_demo(
    id_demo
):

    movimientos = (

        DemoModel
        .obtener_movimientos_demo(
            id_demo
        )
    )

    def ejecutar():

        for movimiento in movimientos:

            enviar_movimiento(

                movimiento[
                    "nombre_movimiento"
                ],

                "demo"
            )

            time.sleep(2)

        enviar_movimiento(
            "stop",
            "demo"
        )

    threading.Thread(

        target=ejecutar,

        daemon=True

    ).start()

    return jsonify({
        "ok":True
    })

# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=False,

        use_reloader=False
    )