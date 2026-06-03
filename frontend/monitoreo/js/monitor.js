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
// RADAR CHART
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
                "Distancia"
            ],

            datasets:[{

                label:
                "Obstáculo",

                data:[100],

                fill:true
            }]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{

                r:{

                    suggestedMin:0,

                    suggestedMax:100,

                    ticks:{
                        backdropColor:
                        "transparent",

                        color:"white"
                    },

                    pointLabels:{
                        color:"white"
                    },

                    grid:{
                        color:
                        "rgba(255,255,255,.2)"
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
        "WS MONITOR OK"
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

    if(
        data.tipo ==
        "heartbeat"
    )
    {
        document.getElementById(
            "estadoESP"
        ).innerHTML =
        "ONLINE";

        agregarTelemetria(
            data.ip
        );
    }

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

        agregarMovimiento(
            data.movimiento,
            data.origen
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
        radarChart.data.datasets[0]
        .data = [

            data.distancia
        ];

        radarChart.update();
    }
};

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

    lista.innerHTML = `

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-wifi
        "></i>

        ${ip}

    </li>

    `;
}

// ======================================
// MOVIMIENTO
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

        <strong>
        ${movimiento}
        </strong>

        <br>

        <small>
        ${origen}
        </small>

    </li>

    ` + lista.innerHTML;
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

    const lista =
    document.getElementById(
        "historialMovimientos"
    );

    lista.innerHTML =
    "";

    data.forEach(item => {

        lista.innerHTML += `

        <li class="
        list-group-item
        ">

            <strong>

            ${item.nombre_movimiento}

            </strong>

            <br>

            <small>

            ${item.origen}

            </small>

        </li>

        `;
    });
}

// ======================================
// CARGAR TELEMETRIA
// ======================================

async function cargarTelemetria()
{
    const response =
    await fetch(

        `${API}/api/telemetria`
    );

    const data =
    await response.json();

    const lista =
    document.getElementById(
        "telemetriaLista"
    );

    lista.innerHTML = `

    <li class="
    list-group-item
    ">

        <i class="
        bi bi-cpu
        "></i>

        ${data.ip}

        <br>

        <small>

        ${data.estado}

        </small>

    </li>

    `;
}

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

        <div class="
        demo-card
        ">

            <h5>

                ${demo.nombre_demo}

            </h5>

            <ul>

                ${htmlMovs}

            </ul>

        </div>

        `;
    }
}

// ======================================
// INIT
// ======================================

cargarHistorial();

cargarTelemetria();

cargarDemos();
