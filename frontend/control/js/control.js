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
// WS STATUS
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
// WS MESSAGE
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

        agregarEvento(

            "Movimiento: "
            + data.movimiento
        );
    }

    // ==================================
    // OBSTACULO
    // ==================================

    if(
        data.tipo ==
        "obstaculo"
    )
    {
        mostrarAlertaObstaculo(
            data.distancia
        );

        agregarEvento(

            "Obstáculo: "
            + data.distancia
            + " cm"
        );
    }

    // ==================================
    // PARAMETRO
    // ==================================

    if(
        data.tipo ==
        "parametro"
    )
    {
        document.getElementById(
            "valorVelocidad"
        ).innerHTML =
        data.velocidad;
    }
};

// ======================================
// ALERTA
// ======================================

function mostrarAlertaObstaculo(
    distancia
)
{
    const alerta =
    document.getElementById(
        "alertaObstaculo"
    );

    alerta.style.display =
    "block";

    alerta.innerHTML = `

    <i class="
    bi bi-exclamation-triangle-fill
    "></i>

    OBSTÁCULO DETECTADO

    (${distancia} cm)

    `;

    setTimeout(() => {

        alerta.style.display =
        "none";

    }, 3000);
}

// ======================================
// EVENTOS
// ======================================

function agregarEvento(
    texto
)
{
    const lista =
    document.getElementById(
        "listaEventos"
    );

    lista.innerHTML = `

    <li class="
    list-group-item
    ">

        ${texto}

    </li>

    ` + lista.innerHTML;

    while(
        lista.children.length > 10
    )
    {
        lista.removeChild(
            lista.lastChild
        );
    }
}

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
// DEMOS
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
            ${demo.id_demo},
            '${demo.nombre_demo}'
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

    id_demo,
    nombre_demo

)
{
    ws.send(

        JSON.stringify({

            tipo:"demo",

            id_demo:id_demo,

            nombre_demo:nombre_demo

        })
    );

    const response =
    await fetch(

        `${API}/api/demo/${id_demo}`
    );

    const movimientos =
    await response.json();

    for(const mov of movimientos)
    {
        await fetch(

            `${API}/${mov.nombre_movimiento}`,

            {
                method:"POST"
            }
        );

        await esperar(
            mov.delay_ms
        );
    }

    await fetch(

        `${API}/stop`,

        {
            method:"POST"
        }
    );
}

// ======================================
// ESPERAR
// ======================================

function esperar(ms)
{
    return new Promise(resolve => {

        setTimeout(
            resolve,
            ms
        );

    });
}

// ======================================
// INIT
// ======================================

cargarDemos();
