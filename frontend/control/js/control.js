const API =
"http://localhost:5000";

// ======================================
// WEBSOCKET
// ======================================

const ws =
new WebSocket(
    "ws://localhost:8765"
);

// ======================================
// ESTADO WS
// ======================================

ws.onopen = () =>
{
    document.getElementById(
        "estadoWS"
    ).innerHTML =
    "CONECTADO";
};

ws.onclose = () =>
{
    document.getElementById(
        "estadoWS"
    ).innerHTML =
    "DESCONECTADO";
};

// ======================================
// MENSAJES WS
// ======================================

ws.onmessage = (event) =>
{
    const data =
    JSON.parse(
        event.data
    );

    console.log(data);

    // ==================================
    // MOVIMIENTO
    // ==================================

    if(
        data.tipo ==
        "movimiento"
    )
    {
        document.getElementById(
            "movimientoActual"
        ).innerHTML =
        data.movimiento;
    }

    // ==================================
    // OBSTACULO
    // ==================================

    if(
        data.tipo ==
        "obstaculo"
    )
    {
        const alerta =
        document.getElementById(
            "alertaObstaculo"
        );

        alerta.style.display =
        "block";

        alerta.innerHTML = `
        
        <i class="bi bi-exclamation-triangle-fill"></i>

        OBSTÁCULO DETECTADO
        (${data.distancia} cm)

        `;

        setTimeout(() => {

            alerta.style.display =
            "none";

        }, 3000);
    }
};

// ======================================
// MOVER
// ======================================

async function mover(
    movimiento
)
{
    try
    {
        await fetch(

            `${API}/${movimiento}`,

            {
                method:"POST"
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}

// ======================================
// VELOCIDAD
// ======================================

const sliderVelocidad =
document.getElementById(
    "sliderVelocidad"
);

const valorVelocidad =
document.getElementById(
    "valorVelocidad"
);

sliderVelocidad.addEventListener(

    "input",

    async () =>
    {
        const valor =
        sliderVelocidad.value;

        valorVelocidad.innerHTML =
        valor;

        try
        {
            await fetch(

                `${API}/api/velocidad/${valor}`,

                {
                    method:"POST"
                }
            );
        }
        catch(error)
        {
            console.log(error);
        }
    }
);

// ======================================
// CARGAR DEMOS
// ======================================

async function cargarDemos()
{
    const response =
    await fetch(
        `${API}/api/demos`
    );

    const demos =
    await response.json();

    const contenedor =
    document.getElementById(
        "listaDemos"
    );

    contenedor.innerHTML =
    "";

    demos.forEach(demo => {

        contenedor.innerHTML += `

        <button

        class="
        btn
        btn-primary
        demo-btn
        "

        onclick="
        ejecutarDemo(
            ${demo.id_demo}
        )
        ">

            <i class="
            bi bi-play-fill
            "></i>

            ${demo.nombre_demo}

        </button>

        `;
    });
}

// ======================================
// EJECUTAR DEMO
// ======================================

async function ejecutarDemo(
    id_demo
)
{
    try
    {
        await fetch(

            `${API}/api/ejecutar_demo/${id_demo}`,

            {
                method:"POST"
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}

// ======================================
// INIT
// ======================================

cargarDemos();

