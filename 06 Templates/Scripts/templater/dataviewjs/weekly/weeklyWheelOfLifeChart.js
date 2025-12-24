const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;

// 1. FORZAR TAMAÑO
container.style.height = '400px'; 
container.style.width = '100%';
container.style.position = 'relative';

const style = getComputedStyle(document.body);
const page = dv.current();

let dataValues = [];
const keys = wolService.getKeys();

// Lógica de obtención de datos
if (page.file.path.includes("02 Weekly")) {
    dataValues = keys.map(k => parseFloat(page.wheelOfLife?.[k] || 0));
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
        return count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });
}

const gridColor = style.getPropertyValue('--background-modifier-border') || 'rgba(150, 150, 150, 0.3)';

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
                min: 0, 
                max: 10,
                ticks: { 
                    display: false, // Oculta los números 1-10
                    backdropColor: 'transparent',
                    z: 1 
                },
                grid: { 
                    display: true, 
                    color: gridColor,
                    circular: true 
                },
                angleLines: {
                    display: true, 
                    color: gridColor
                },
                pointLabels: {
                    display: false // <--- CAMBIO AQUÍ: Oculta los nombres alrededor del círculo
                }
            }
        },
        plugins: {
            legend: { 
                display: true, // Mantiene la leyenda inferior
                position: 'bottom', 
                labels: { color: style.getPropertyValue('--text-muted') } 
            }
        }
    }
};

window.renderChart(chartData, container);