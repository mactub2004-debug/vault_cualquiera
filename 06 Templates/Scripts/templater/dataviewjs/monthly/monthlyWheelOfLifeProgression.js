const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);
const page = dv.current();

const filterUnit = page.file.path.includes("Quarterly") ? 'quarter' : 'month';

// CAMBIO 1: Agregamos .array() al final para convertir DataArray a Array normal
const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
    .where(p => p.date && moment(p.date.toString()).isSame(moment(page.date.toString()), filterUnit))
    .sort(p => p.file.name)
    .array(); 

const datasets = wolService.getKeys().map(key => ({
    label: wolService.getCategories()[key],
    // CAMBIO 2: Parseamos a Float por seguridad, igual que en el script anterior
    data: weeks.map(w => parseFloat(w.wheelOfLife?.[key] || 0)),
    borderColor: wolService.getBorder(key),
    backgroundColor: wolService.getColor(key),
    borderWidth: 2, tension: 0.3, pointRadius: 3
}));

const chartData = {
    type: 'line',
    data: { 
        // weeks ya es un array normal, así que este map devuelve un array normal
        labels: weeks.map(p => p.file.name), 
        datasets: datasets 
    },
    options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
            y: { min: 0, max: 10, grid: { color: style.getPropertyValue('--background-modifier-border') } },
            x: { display: false }
        },
        plugins: { legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-muted') } } }
    }
};
window.renderChart(chartData, container);