// Importar servicio centralizado
const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;
const style = getComputedStyle(document.body);

// Datos
const page = dv.current();
const keys = wolService.getKeys();
const dataValues = keys.map(k => page.wheelOfLife?.[k] || 0);

// Configuración Gráfico
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
                beginAtZero: true,
                grid: {
                    display: true,
                    color: style.getPropertyValue('--background-modifier-border')
                },
                ticks: { display: false } // Ocultar números para limpieza
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: style.getPropertyValue('--text-muted') }
            }
        }
    }
};

window.renderChart(chartData, container);