const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;

// --- CONFIGURACIÓN VISUAL ---
container.style.height = '400px'; 
container.style.width = '100%';
container.style.position = 'relative';
const style = getComputedStyle(document.body);
const gridColor = style.getPropertyValue('--background-modifier-border') || 'rgba(150, 150, 150, 0.3)';

const page = dv.current();
let dataValues = [];
const keys = wolService.getKeys();

// --- LÓGICA DE FECHAS (Detectar Año) ---
let year = null;
if (page.date) {
    year = moment(page.date.toString()).year();
} else {
    const match = page.file.name.match(/^(\d{4})/);
    if (match) year = parseInt(match[1]);
}

if (year) {
    // Buscar TODAS las semanas del año
    const weeks = dv.pages('"02 Weekly"')
        .where(p => {
            // Lógica robusta para detectar fecha de la semana
            let wDate = p.date ? moment(p.date.toString()) : null;
            if (!wDate) {
                const wMatch = p.file.name.match(/^(\d{4})-W(\d{1,2})$/i);
                if (wMatch) wDate = moment(`${wMatch[1]}-W${wMatch[2].padStart(2, '0')}`, "YYYY-WW");
            }
            // Comparamos el año ISO
            return wDate && wDate.isValid() && wDate.isoWeekYear() === year;
        });
    
    if (weeks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding-top: 50px; color: var(--text-muted);">
            ⚠️ Aún no hay semanas registradas para el año ${year}.
        </div>`;
        return;
    }

    dataValues = keys.map(key => {
        let sum = 0, count = 0;
        weeks.forEach(w => {
            const val = w.wheelOfLife?.[key];
            if (typeof val === 'number') { sum += val; count++; }
        });
        return count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });

} else {
    container.innerHTML = "No se pudo identificar el año.";
    return;
}

// --- RENDERIZADO DEL GRÁFICO ---
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
                ticks: { display: false, backdropColor: 'transparent', z: 1 },
                grid: { display: true, color: gridColor, circular: true },
                angleLines: { display: true, color: gridColor },
                pointLabels: { display: false }
            }
        },
        plugins: {
            legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-muted'), padding: 20, usePointStyle: true } }
        }
    }
};

window.renderChart(chartData, container);