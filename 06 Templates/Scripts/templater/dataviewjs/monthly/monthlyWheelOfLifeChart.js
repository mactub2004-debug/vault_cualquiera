const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);

// 1. Obtener notas semanales de este mes
const currentFile = dv.current();
const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
    .where(p => p.date && moment(p.date.toString()).format('YYYY-MM') === moment(currentFile.date.toString()).format('YYYY-MM'))
    .sort(p => p.file.name);

// 2. Calcular promedios usando las claves del servicio
const keys = wolService.getKeys();
const averages = keys.map(key => {
    let sum = 0;
    let count = 0;
    weeks.forEach(w => {
        const val = w.wheelOfLife?.[key];
        if (typeof val === 'number') {
            sum += val;
            count++;
        }
    });
    return count > 0 ? (sum / count).toFixed(1) : 0;
});

// 3. Renderizar Gráfico Polar
const chartData = {
    type: 'polarArea',
    data: {
        labels: wolService.getLabels(),
        datasets: [{
            data: averages,
            backgroundColor: wolService.getAllColors(),
            borderColor: wolService.getAllBorders(),
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
                ticks: { display: false },
                grid: { color: style.getPropertyValue('--background-modifier-border') }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: style.getPropertyValue('--text-muted') }
            },
            title: {
                display: true,
                text: 'Monthly Average',
                color: style.getPropertyValue('--text-normal')
            }
        }
    }
};

window.renderChart(chartData, container);