const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);

// 1. Buscar semanas del año
const currentFile = dv.current();
const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
    .where(p => p.date && moment(p.date.toString()).isSame(moment(currentFile.date.toString()), 'year'))
    .sort(p => p.date);

// 2. Agrupar por mes (0-11)
const monthsData = Array.from({ length: 12 }, () => ({ count: 0, sums: {} }));
wolService.getKeys().forEach(k => monthsData.forEach(m => m.sums[k] = 0));

weeks.forEach(w => {
    const monthIndex = moment(w.date.toString()).month(); // 0 = Enero
    monthsData[monthIndex].count++;
    wolService.getKeys().forEach(key => {
        monthsData[monthIndex].sums[key] += (w.wheelOfLife?.[key] || 0);
    });
});

// 3. Calcular promedios
const datasets = wolService.getKeys().map(key => {
    return {
        label: wolService.getCategories()[key],
        data: monthsData.map(m => m.count > 0 ? (m.sums[key] / m.count).toFixed(1) : null),
        borderColor: wolService.getBorder(key),
        backgroundColor: wolService.getColor(key),
        borderWidth: 2,
        tension: 0.4, // Curvas más suaves para el año
        spanGaps: true // Conectar líneas si falta un mes
    };
});

const monthLabels = moment.monthsShort(); // ["Jan", "Feb", ...]

// 4. Renderizar
const chartData = {
    type: 'line',
    data: { labels: monthLabels, datasets: datasets },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { min: 0, max: 10, grid: { color: style.getPropertyValue('--background-modifier-border') } },
            x: { grid: { display: false }, ticks: { color: style.getPropertyValue('--text-muted') } }
        },
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, color: style.getPropertyValue('--text-muted') } },
            title: { display: true, text: 'Resumen Anual (Promedio Mensual)', color: style.getPropertyValue('--text-normal') }
        }
    }
};

window.renderChart(chartData, container);