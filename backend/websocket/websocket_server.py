import asyncio
import json
import websockets


class WebSocketServer:

    clients = set()

    esp_client = None

    # ======================================
    # HANDLER
    # ======================================

    @staticmethod
    async def handler(
        websocket
    ):

        print(
            "Cliente conectado"
        )

        WebSocketServer.clients.add(
            websocket
        )

        try:

            async for message in websocket:

                print(
                    "MENSAJE:",
                    message
                )

                data = json.loads(
                    message
                )

                # ==========================
                # REGISTRAR ESP
                # ==========================

                if(
                    "cliente" in data
                ):
                    if(
                        data["cliente"]
                        == "esp"
                    ):
                        WebSocketServer.esp_client = websocket

                        print(
                            "ESP REGISTRADO"
                        )

                # ==========================
                # REENVIAR
                # ==========================

                await WebSocketServer.broadcast(
                    data
                )

        except Exception as e:

            print(e)

        finally:

            WebSocketServer.clients.remove(
                websocket
            )

            print(
                "Cliente desconectado"
            )

    # ======================================
    # ENVIAR A TODOS
    # ======================================

    @staticmethod
    async def broadcast(data):

        if not WebSocketServer.clients:
            return

        mensaje = json.dumps(
            data
        )

        desconectados = set()

        for client in WebSocketServer.clients:

            try:

                await client.send(
                    mensaje
                )

            except:

                desconectados.add(
                    client
                )

        WebSocketServer.clients -= desconectados

    # ======================================
    # ENVIAR SOLO ESP
    # ======================================

    @staticmethod
    async def enviar_a_esp(data):

        if(
            WebSocketServer.esp_client
            is None
        ):
            return

        try:

            await WebSocketServer.esp_client.send(
                json.dumps(data)
            )

        except Exception as e:

            print(e)

    # ======================================
    # MAIN
    # ======================================

    @staticmethod
    async def main(
        host,
        port
    ):

        async with websockets.serve(

            WebSocketServer.handler,

            host,

            port

        ):

            print(
                f"WS activo {host}:{port}"
            )

            await asyncio.Future()

    # ======================================
    # START
    # ======================================

    @staticmethod
    def start(
        host="0.0.0.0",
        port=8765
    ):

        asyncio.run(
            WebSocketServer.main(
                host,
                port
            )
        )
