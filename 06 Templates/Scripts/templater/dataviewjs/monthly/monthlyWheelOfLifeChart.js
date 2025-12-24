const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);
const page = dv.current();

let dataValues = [];
const keys = wolService.getKeys();

if (page.file.path.includes("02 Weekly")) {
    dataValues = keys.map(k => page.wheelOfLife?.[k] || 0);
} else {
    let filterUnit = 'month';
    if (page.file.path.includes("Quarterly")) filterUnit = 'quarter';
    if (page.file.path.includes("Yearly")) filterUnit = 'year';

    const weeks = dv.pages(`"${window.timeGarden.rootPath}02 Weekly"`)
        .where(p => p.date && moment(p.date.toString()).isSame(moment(page.date.toString()), filterUnit));
    
    dataValues = keys.map(key => {
        let sum = 0, count = 0;
        weeks.forEach(w => {
            const val = w.wheelOfLife?.[key];
            if (typeof val === 'number') { sum += val; count++; }
        });
        // CAMBIO AQUÍ: Agregado parseFloat() para asegurar que sea un número, no texto
        return count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });
}

const chartData = {
    type: 'polarArea',
    data: {
        labels: wolService.getLabels(),
        datasets: [{
            data: dataValues,
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
                min: 0, max: 10,
                ticks: { display: false },
                grid: { display: true, color: style.getPropertyValue('--background-modifier-border') }
            }
        },
        plugins: {
            legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-muted') } }
        }
    }
};

window.renderChart(chartData, container);