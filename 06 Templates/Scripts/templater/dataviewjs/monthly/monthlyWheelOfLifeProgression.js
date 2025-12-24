const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);

// 1. Buscar semanas de este mes
const currentFile = dv.current();
const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
    .where(p => p.date && moment(p.date.toString()).format('YYYY-MM') === moment(currentFile.date.toString()).format('YYYY-MM'))
    .sort(p => p.file.name);

const labels = weeks.map(p => p.file.name); // Eje X: Nombres de las notas semanales

// 2. Construir datasets para las 5 categorías
const datasets = wolService.getKeys().map(key => {
    return {
        label: wolService.getCategories()[key], // Nombre visual (ej: "Workout")
        data: weeks.map(w => w.wheelOfLife?.[key] || 0), // Datos
        borderColor: wolService.getBorder(key), // Color específico
        backgroundColor: wolService.getColor(key),
        borderWidth: 2,
        tension: 0.3, // Líneas curvas
        pointRadius: 3
    };
});

// 3. Renderizar Gráfico de Líneas
const chartData = {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { 
                min: 0, max: 10, 
                grid: { color: style.getPropertyValue('--background-modifier-border') } 
            },
            x: { 
                grid: { display: false },
                ticks: { color: style.getPropertyValue('--text-muted') }
            }
        },
        plugins: {
            legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-muted') } },
            title: { display: true, text: 'Progreso Mensual', color: style.getPropertyValue('--text-normal') }
        }
    }
};

window.renderChart(chartData, container);