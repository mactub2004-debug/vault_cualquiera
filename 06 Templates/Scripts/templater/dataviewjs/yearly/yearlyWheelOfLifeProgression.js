const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);
const page = dv.current();

const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
    .where(p => p.date && moment(p.date.toString()).isSame(moment(page.date.toString()), 'year'))
    .sort(p => p.date);

const monthsData = Array.from({length: 12}, () => ({count: 0, sums: {}}));
weeks.forEach(w => {
    const m = moment(w.date.toString()).month();
    monthsData[m].count++;
    wolService.getKeys().forEach(k => {
        monthsData[m].sums[k] = (monthsData[m].sums[k] || 0) + (w.wheelOfLife?.[k] || 0);
    });
});

const datasets = wolService.getKeys().map(key => ({
    label: wolService.getCategories()[key],
    data: monthsData.map(m => m.count > 0 ? (m.sums[key] / m.count).toFixed(1) : null),
    borderColor: wolService.getBorder(key),
    backgroundColor: wolService.getColor(key),
    borderWidth: 2, tension: 0.4, spanGaps: true
}));

const chartData = {
    type: 'line',
    data: { labels: moment.monthsShort(), datasets: datasets },
    options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
            y: { min: 0, max: 10, grid: { color: style.getPropertyValue('--background-modifier-border') } },
            x: { grid: { display: false }, ticks: { color: style.getPropertyValue('--text-muted') } }
        },
        plugins: { legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-muted') } } }
    }
};
window.renderChart(chartData, container);