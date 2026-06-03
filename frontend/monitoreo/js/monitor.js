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
// ELEMENTOS
// ======================================

const movimientoActual =
document.getElementById(
    "movimientoActual"
);

const velocidadActual =
document.getElementById(
    "velocidadActual"
);

const estadoESP =
document.getElementById(
    "estadoESP"
);

const arrowMovimiento =
document.getElementById(
    "arrowMovimiento"
);

const alertaObstaculo =
document.getElementById(
    "alertaObstaculo"
);

// ======================================
// RADAR PREMIUM
// ======================================

const radarCtx =
document.getElementById(
    "radarChart"
);

const radarChart =
new Chart(

    radarCtx,

    {

        type:"radar",

        data:{

            labels:[
                "Sensor"
            ],

            datasets:[{

                label:
                "Distancia",

                data:[100],

                borderWidth:3,

                pointRadius:6,

                fill:true
            }]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{
                duration:500
            },

            scales:{

                r:{

                    suggestedMin:0,

                    suggestedMax:100,

                    angleLines:{
                        color:
                        "rgba(255,255,255,.1)"
                    },

                    grid:{
                        color:
                        "rgba(255,255,255,.1)"
                    },

                    pointLabels:{
                        color:"white"
                    },

                    ticks:{
                        color:"white",

                        backdropColor:
                        "transparent"
                    }
                }
            },

            plugins:{

                legend:{

                    labels:{
                        color:"white"
                    }
                }
            }
        }
    }
);

// ======================================
// WS OPEN
// ======================================

ws.onopen = () =>
{
    console.log(
        "MONITOR WS OK"
    );
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
    // HEARTBEAT
    // ==================================

    if(data.tipo == "heartbeat")
    {
        estadoESP.innerHTML =
        "ONLINE";

        agregarTelemetria(
            data.ip
        );
    }

    // ==================================
    // MOVIMIENTO
    // ==================================

    if(data.tipo == "movimiento")
    {
        movimientoActual.innerHTML =
        data.movimiento;

        agregarMovimiento(

            data.movimiento,
            data.origen
        );

        actualizarCarrito(
            data.movimiento
        );
    }

    // ==================================
    // DEMO LIVE
    // ==================================

    if(data.tipo == "demo")
    {
        iluminarDemo(
            data.id_demo
        );
    }

    // ==================================
    // PARAMETRO
    // ==================================

    if(data.tipo == "parametro" || data.tipo == "velocidad")
    {
        velocidadActual.innerHTML =
        data.velocidad;
    }

    // ==================================
    // OBSTACULO
    // ==================================

    if(data.tipo == "obstaculo")
    {
        radarChart.data.datasets[0]
        .data = [

            data.distancia
        ];

        radarChart.update();

        agregarObstaculo(
            data.distancia
        );

        mostrarAlerta(
            data.distancia
        );
    }
};

// ======================================
// CARRITO VISUAL
// ======================================

function actualizarCarrito(
    movimiento
)
{
    let flecha = "⬆";

    if(
        movimiento == "atras"
    )
    {
        flecha = "⬇";
    }

    else if(
        movimiento == "izquierda"
    )
    {
        flecha = "⬅";
    }

    else if(
        movimiento == "derecha"
    )
    {
        flecha = "➡";
    }

    else if(
        movimiento == "stop"
    )
    {
        flecha = "⏹";
    }

    arrowMovimiento.innerHTML =
    flecha;
}

// ======================================
// MOVIMIENTOS
// ======================================

function agregarMovimiento(

    movimiento,
    origen

)
{
    const lista =
    document.getElementById(
        "historialMovimientos"
    );

    lista.innerHTML = `

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-arrow-repeat
        "></i>

        <strong>

        ${movimiento}

        </strong>

        <br>

        <small>

        ${origen}

        </small>

    </li>

    ` + lista.innerHTML;

    limitarLista(
        lista,
        10
    );
}

// ======================================
// OBSTACULOS
// ======================================

function agregarObstaculo(
    distancia
)
{
    const lista =
    document.getElementById(
        "listaObstaculos"
    );

    lista.innerHTML = `

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-exclamation-triangle-fill
        text-danger
        "></i>

        Obstáculo a

        <strong>

        ${distancia} cm

        </strong>

    </li>

    ` + lista.innerHTML;

    limitarLista(
        lista,
        10
    );
}

// ======================================
// TELEMETRIA
// ======================================
function agregarTelemetria(
    ip
)
{
    const lista =
    document.getElementById(
        "telemetriaLista"
    );

    const hora =
    new Date()
    .toLocaleTimeString();

    lista.innerHTML = `

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-wifi
        text-info
        "></i>

        IP:
        ${ip}

    </li>

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-clock
        text-warning
        "></i>

        ${hora}

    </li>

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-cpu
        text-success
        "></i>

        ESP8266 ONLINE

    </li>

    `;
}


function mostrarAlerta(
    distancia
)
{
    alertaObstaculo.style.display =
    "block";

    alertaObstaculo.innerHTML = `

    <i class="
    bi bi-exclamation-triangle-fill
    "></i>

    Obstáculo Detectado

    (${distancia} cm)

    `;

    setTimeout(() => {

        alertaObstaculo.style.display =
        "none";

    }, 2500);
}


// ======================================
// LIMITAR LISTA
// ======================================

function limitarLista(
    lista,
    max
)
{
    while(
        lista.children.length > max
    )
    {
        lista.removeChild(
            lista.lastChild
        );
    }
}

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

    for(const demo of demos)
    {
        const responseMovs =
        await fetch(

            `${API}/api/demo/${demo.id_demo}`
        );

        const movimientos =
        await responseMovs.json();

        let htmlMovs =
        "";

        movimientos.forEach(mov => {

            htmlMovs += `

            <li>

                ${mov.nombre_movimiento}

            </li>

            `;
        });

        contenedor.innerHTML += `

        <div

        id="
        demo-${demo.id_demo}
        "

        class="
        demo-card
        ">

            <h5>

                ${demo.nombre_demo}

                <span
                class="
                live-badge
                "
                style="
                display:none;
                ">

                    LIVE

                </span>

            </h5>

            <ul
            class="
            movimientos-demo
            "
            style="
            display:none;
            ">

                ${htmlMovs}

            </ul>

        </div>

        `;
    }
}

// ======================================
// DEMO LIVE
// ======================================
function iluminarDemo(
    id_demo
)
{
    const demos =
    document.querySelectorAll(
        ".demo-card"
    );

    demos.forEach(demo => {

        demo.classList.remove(
            "active"
        );

        demo.querySelector(
            ".live-badge"
        ).style.display =
        "none";

        demo.querySelector(
            ".movimientos-demo"
        ).style.display =
        "none";
    });

    const demoActiva =
    document.getElementById(

        `demo-${id_demo}`
    );

    if(demoActiva)
    {
        demoActiva.classList.add(
            "active"
        );

        demoActiva.querySelector(
            ".live-badge"
        ).style.display =
        "inline-block";

        demoActiva.querySelector(
            ".movimientos-demo"
        ).style.display =
        "block";
    }
}

// ======================================
// CARGAR HISTORIAL
// ======================================

async function cargarHistorial()
{
    const response =
    await fetch(

        `${API}/api/historial`
    );

    const data =
    await response.json();

    data.reverse();

    data.forEach(item => {

        agregarMovimiento(

            item.nombre_movimiento,

            item.origen
        );
    });
}

// ======================================
// CARGAR OBSTACULOS
// ======================================

async function cargarObstaculos()
{
    const response =
    await fetch(

        `${API}/api/obstaculos`
    );

    const data =
    await response.json();

    data.reverse();

    data.forEach(item => {

        agregarObstaculo(
            item.distancia_cm
        );
    });
}

// ======================================
// INIT
// ======================================

cargarHistorial();

cargarObstaculos();

cargarDemos();
