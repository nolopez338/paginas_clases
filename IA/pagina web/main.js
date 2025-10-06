// --- Datos iniciales ---
let datos = [
    { horas: 1, nota: 2.0 },
    { horas: 2, nota: 4.0 },
    { horas: 3, nota: 5.0 },
    { horas: 4, nota: 4.5 },
    { horas: 5, nota: 6.0 }
];
let metodo = 'manual'; // 'manual' o 'sklearn' (simulado)
let puntoArrastrando = null;
let chart = null;
let prediccionActual = null;

// --- Utilidades de regresión lineal ---
function regresionLinealManual(puntos) {
    const n = puntos.length;
    if (n < 2) return { m: 0, b: 0, r2: 1 };
    const sumX = puntos.reduce((a, p) => a + p.horas, 0);
    const sumY = puntos.reduce((a, p) => a + p.nota, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    let num = 0, den = 0;
    for (const p of puntos) {
        num += (p.horas - meanX) * (p.nota - meanY);
        den += (p.horas - meanX) ** 2;
    }
    const m = den === 0 ? 0 : num / den;
    const b = meanY - m * meanX;
    // Calcular R2
    let ssRes = 0, ssTot = 0;
    for (const p of puntos) {
        const yPred = m * p.horas + b;
        ssRes += (p.nota - yPred) ** 2;
        ssTot += (p.nota - meanY) ** 2;
    }
    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    return { m, b, r2 };
}

// --- Gráfica con Chart.js ---
function crearGrafica() {
    const ctx = document.getElementById('grafica-canvas').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Datos',
                    data: datos.map(p => ({ x: p.horas, y: p.nota })),
                    backgroundColor: '#1976d2',
                    pointRadius: 7,
                    pointHoverRadius: 10,
                    showLine: false,
                    dragData: true,
                },
                {
                    label: 'Regresión',
                    data: [],
                    type: 'line',
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    order: 1,
                },
                {
                    label: 'Predicción',
                    data: [],
                    type: 'scatter',
                    backgroundColor: 'red',
                    pointStyle: 'cross',
                    pointRadius: 10,
                    order: 2,
                }
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: 10,
                    title: { display: true, text: 'Horas de Estudio' }
                },
                y: {
                    min: 0,
                    max: 10,
                    title: { display: true, text: 'Nota Obtenida' }
                }
            },
            plugins: {
                legend: { display: true },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.dataset.label === 'Datos' ? `(${ctx.parsed.x.toFixed(2)}, ${ctx.parsed.y.toFixed(2)})` : ctx.dataset.label
                    }
                },
                dragData: {
                    round: 2,
                    showTooltip: true,
                    dragX: true, // Permitir arrastrar en X y Y
                    onDragStart: function(e, datasetIndex, index, value) {
                        if (datasetIndex === 0) puntoArrastrando = index;
                    },
                    onDrag: function(e, datasetIndex, index, value) {
                        if (datasetIndex === 0 && puntoArrastrando !== null) {
                            datos[puntoArrastrando] = { horas: value.x, nota: value.y };
                            actualizarTodo();
                        }
                    },
                    onDragEnd: function(e, datasetIndex, index, value) {
                        puntoArrastrando = null;
                    }
                }
            },
            onClick: (e, elements) => {
                if (e.native && e.native.button === 2) {
                    // Clic derecho: eliminar punto si se hace sobre uno
                    if (elements.length && elements[0].datasetIndex === 0) {
                        const index = elements[0].index;
                        datos.splice(index, 1);
                        actualizarTodo();
                    }
                    return;
                }
                if (!elements.length) {
                    const rect = chart.canvas.getBoundingClientRect();
                    const xPixel = e.native ? e.native.clientX : e.clientX;
                    const yPixel = e.native ? e.native.clientY : e.clientY;
                    const x = chart.scales.x.getValueForPixel(xPixel - rect.left);
                    const y = chart.scales.y.getValueForPixel(yPixel - rect.top);
                    if (x >= 0 && y >= 0 && x <= 10 && y <= 10) {
                        datos.push({ horas: x, nota: y });
                        actualizarTodo();
                    }
                }
            }
        }
    });
}

// --- Actualizar gráfica y modelo ---
function actualizarTodo() {
    // Actualizar puntos
    chart.data.datasets[0].data = datos.map(p => ({ x: p.horas, y: p.nota }));
    // Calcular regresión
    const { m, b, r2 } = regresionLinealManual(datos);
    // Línea de regresión
    const xLine = [0, 10];
    const yLine = xLine.map(x => m * x + b);
    chart.data.datasets[1].data = [ { x: xLine[0], y: yLine[0] }, { x: xLine[1], y: yLine[1] } ];
    // Predicción
    if (prediccionActual) {
        const yPred = m * prediccionActual + b;
        chart.data.datasets[2].data = [ { x: prediccionActual, y: yPred } ];
    } else {
        chart.data.datasets[2].data = [];
    }
    chart.update();
    // Actualizar info modelo
    document.getElementById('info-modelo').innerText = `${metodo === 'manual' ? '🧮 Manual' : '🤖 Simulado'}\ny = ${m.toFixed(3)}x + ${b.toFixed(3)}\nR² = ${r2.toFixed(4)}`;
    // Estadísticas
    actualizarEstadisticas();
}

function actualizarEstadisticas() {
    const n = datos.length;
    const horas = datos.map(p => p.horas);
    const notas = datos.map(p => p.nota);
    const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = arr => {
        const m = mean(arr);
        return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
    };
    const stats = `Puntos de datos: ${n}
Horas promedio: ${mean(horas).toFixed(2)}
Nota promedio: ${mean(notas).toFixed(2)}

Horas (min/max): ${Math.min(...horas).toFixed(1)} / ${Math.max(...horas).toFixed(1)}
Nota (min/max): ${Math.min(...notas).toFixed(1)} / ${Math.max(...notas).toFixed(1)}

Desv. estándar horas: ${std(horas).toFixed(2)}
Desv. estándar notas: ${std(notas).toFixed(2)}`;
    document.getElementById('stats-text').innerText = stats;
}

// --- Controles ---
document.addEventListener('DOMContentLoaded', () => {
    crearGrafica();
    actualizarTodo();

    // Método de entrenamiento
    document.querySelectorAll('input[name="metodo"]').forEach(radio => {
        radio.addEventListener('change', e => {
            metodo = e.target.value;
            actualizarTodo();
        });
    });

    // Reiniciar datos
    document.getElementById('reiniciar-btn').onclick = () => {
        datos = [
            { horas: 1, nota: 2.0 },
            { horas: 2, nota: 4.0 },
            { horas: 3, nota: 5.0 },
            { horas: 4, nota: 4.5 },
            { horas: 5, nota: 6.0 }
        ];
        prediccionActual = null;
        document.getElementById('slider-horas').value = 3.5;
        document.getElementById('valor-slider').innerText = '3.5';
        document.getElementById('entrada-horas').value = 3.5;
        document.getElementById('resultado-prediccion').innerText = '';
        actualizarTodo();
    };

    // Generar aleatorios
    document.getElementById('aleatorios-btn').onclick = () => {
        const n = Math.floor(Math.random() * 7) + 8;
        datos = Array.from({ length: n }, () => {
            const horas = +(Math.random() * 7 + 1).toFixed(2);
            let nota = 0.8 * horas + 1.5 + (Math.random() * 1.6 - 0.8);
            nota = Math.max(0, Math.min(10, nota));
            return { horas, nota: +nota.toFixed(2) };
        });
        prediccionActual = null;
        document.getElementById('slider-horas').value = 3.5;
        document.getElementById('valor-slider').innerText = '3.5';
        document.getElementById('entrada-horas').value = 3.5;
        document.getElementById('resultado-prediccion').innerText = '';
        actualizarTodo();
    };

    // Slider y entrada manual
    const slider = document.getElementById('slider-horas');
    const entrada = document.getElementById('entrada-horas');
    slider.oninput = () => {
        entrada.value = slider.value;
        document.getElementById('valor-slider').innerText = slider.value;
        actualizarPrediccion(slider.value);
    };
    entrada.oninput = () => {
        let v = parseFloat(entrada.value);
        if (isNaN(v) || v < 0) v = 0;
        if (v > 10) v = 10;
        slider.value = v;
        document.getElementById('valor-slider').innerText = v;
        actualizarPrediccion(v);
    };
    document.getElementById('predecir-btn').onclick = () => {
        let v = parseFloat(entrada.value);
        if (isNaN(v) || v < 0) v = 0;
        if (v > 10) v = 10;
        slider.value = v;
        document.getElementById('valor-slider').innerText = v;
        actualizarPrediccion(v);
    };

    // Botón de predicción (ventana modal)
    document.getElementById('prediccion-btn').onclick = () => {
        const horas = prompt('Introduce las horas de estudio:');
        if (horas !== null) {
            const v = parseFloat(horas);
            if (isNaN(v) || v < 0) {
                alert('❌ Horas no pueden ser negativas');
                return;
            }
            mostrarPrediccionModal(v);
        }
    };

    const canvas = document.getElementById('grafica-canvas');
    if (canvas) {
        canvas.addEventListener('contextmenu', e => e.preventDefault());
        canvas.addEventListener('mousedown', function(e) {
            if (e.button === 2 && chart) { // botón derecho
                const rect = canvas.getBoundingClientRect();
                const event = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                // Buscar el punto más cercano usando Chart.js
                const elements = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                if (elements.length && elements[0].datasetIndex === 0) {
                    const index = elements[0].index;
                    datos.splice(index, 1);
                    actualizarTodo();
                }
            }
        });
    }
});

function actualizarPrediccion(horas) {
    prediccionActual = parseFloat(horas);
    if (isNaN(prediccionActual) || datos.length < 2) {
        document.getElementById('resultado-prediccion').innerText = '';
        chart.data.datasets[2].data = [];
        chart.update();
        return;
    }
    const { m, b } = regresionLinealManual(datos);
    let pred = m * prediccionActual + b;
    pred = Math.max(0, Math.min(10, pred));
    chart.data.datasets[2].data = [ { x: prediccionActual, y: pred } ];
    chart.update();
    // Recomendación
    let recomendacion = '';
    if (pred >= 7) recomendacion = '✅ ¡Excelente! Con esas horas deberías obtener una buena nota.';
    else if (pred >= 5) recomendacion = '⚠️ Con esas horas podrías aprobar, pero considera estudiar más.';
    else recomendacion = '❌ Con esas horas podrías tener dificultades. Te recomiendo estudiar más.';
    document.getElementById('resultado-prediccion').innerText = `📚 ${prediccionActual.toFixed(1)} horas → ${pred.toFixed(2)}/10\n${recomendacion}`;
}

function mostrarPrediccionModal(horas) {
    if (datos.length < 2) return;
    const { m, b } = regresionLinealManual(datos);
    let pred = m * horas + b;
    pred = Math.max(0, Math.min(10, pred));
    alert(`📚 ${horas} horas → ${pred.toFixed(2)}/10`);
} 