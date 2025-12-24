const container = input.container;
const style = getComputedStyle(document.body);

// --- 1. COLORES DE SECCIONES ---
const categoryColors = {
    "career": "rgba(255, 99, 132, 0.5)",
    "health": "rgba(75, 192, 192, 0.5)",
    "growth": "rgba(54, 162, 235, 0.5)",
    "recreation": "rgba(255, 206, 86, 0.5)",
    "social": "rgba(153, 102, 255, 0.5)"
};

const categoryBorders = {
    "career": "rgba(255, 99, 132, 1)",
    "health": "rgba(75, 192, 192, 1)",
    "growth": "rgba(54, 162, 235, 1)",
    "recreation": "rgba(255, 206, 86, 1)",
    "social": "rgba(153, 102, 255, 1)"
};

// --- 2. DATOS ---
const categories = {
    "career": "Career",
    "health": "Workout",
    "growth": "Growth",
    "recreation": "Recreation",
    "social": "Social"
};

const page = dv.current();
const keys = Object.keys(categories);
const dataValues = keys.map(k => page.wheelOfLife?.[k] || 0);

// --- 3. CONFIGURACIÓN DEL GRÁFICO ---
const chartData = {
    type: 'polarArea',
    data: {
        labels: Object.values(categories),
        datasets: [{
            data: dataValues,
            backgroundColor: keys.map(k => categoryColors[k]),
            borderColor: keys.map(k => categoryBorders[k]),
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                min: 0,
                max: 10,
                beginAtZero: true,
                grid: {
                    display: true,
                    color: style.getPropertyValue('--background-modifier-border') // Líneas de los anillos
                },
                angleLines: {
                    display: true,
                    color: style.getPropertyValue('--background-modifier-border') // Líneas divisorias
                },
                ticks: {
                    display: false, // Oculta los números (0, 2, 4...) para que no molesten
                    stepSize: 2
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: style.getPropertyValue('--text-muted'), padding: 20 }
            }
        }
    }
};

window.renderChart(chartData, container);