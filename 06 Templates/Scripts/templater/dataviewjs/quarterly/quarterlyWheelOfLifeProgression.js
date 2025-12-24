const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);

// 1. Buscar semanas del trimestre
const currentFile = dv.current();
const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
    .where(p => p.date && moment(p.date.toString()).isSame(moment(currentFile.date.toString()), 'quarter'))
    .sort(p => p.file.name);

const labels = weeks.map(p => p.file.name);

// 2. Datasets
const datasets = wolService.getKeys().map(key => {
    return {
        label: wolService.getCategories()[key],
        data: weeks.map(w => w.wheelOfLife?.[key] || 0),
        borderColor: wolService.getBorder(key),
        backgroundColor: wolService.getColor(key),
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2
    };
});

// 3. Renderizar
const chartData = {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { min: 0, max: 10, grid: { color: style.getPropertyValue('--background-modifier-border') } },
            x: { grid: { display: false }, ticks: { display: false } } // Oculto nombres de semana para que no se amontonen
        },
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, color: style.getPropertyValue('--text-muted') } }
        }
    }
};

window.renderChart(chartData, container);