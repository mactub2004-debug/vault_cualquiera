const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;

// --- CONFIGURACIÓN VISUAL ---
container.style.height = '400px';
container.style.width = '100%';
const style = getComputedStyle(document.body);

// --- SELECCIÓN DEL TIPO DE GRÁFICO ---
// Solo permitimos 'line' y 'bar'. Si falla, por defecto es 'line'.
const validTypes = ['line', 'bar'];
let selectedType = input.chartType || dv.current().wolChartType || 'line';

if (!validTypes.includes(selectedType)) selectedType = 'line';

// --- FUNCIÓN DE FECHAS ROBUSTA ---
function getPageDate(p) {
    if (p.date) return moment(p.date.toString());
    const match = p.file.name.match(/^(\d{4})-W(\d{1,2})$/i);
    if (match) return moment(`${match[1]}-W${match[2].padStart(2, '0')}`, "YYYY-WW");
    return null;
}

// --- LÓGICA DE DATOS ---
const page = dv.current();
const filterUnit = page.file.path.includes("Quarterly") ? 'quarter' : 'month';
let targetDate = page.date ? moment(page.date.toString()) : null;

// Fallback fecha por nombre de archivo
if (!targetDate) {
     const mMatch = page.file.name.match(/^(\d{4})-(\d{2})/);
     if (mMatch) targetDate = moment(`${mMatch[1]}-${mMatch[2]}-01`);
}

if (targetDate && targetDate.isValid()) {
    const weeks = dv.pages('"02 Weekly"')
        .where(p => {
            const wDate = getPageDate(p);
            return wDate && wDate.isValid() && wDate.isSame(targetDate, filterUnit);
        })
        .sort(p => p.file.name)
        .array();

    if (weeks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding-top:50px; color:var(--text-muted);">
            ⚠️ No hay datos semanales.<br><small>(${targetDate.format("MMMM YYYY")})</small>
        </div>`;
        return;
    }

    const datasets = wolService.getKeys().map(key => ({
        label: wolService.getCategories()[key],
        data: weeks.map(w => parseFloat(w.wheelOfLife?.[key] || 0)),
        borderColor: wolService.getBorder(key),
        backgroundColor: wolService.getColor(key), // Usado para barras
        borderWidth: 2,
        tension: 0.3,
        pointRadius: selectedType === 'line' ? 4 : 0, // Puntos solo en líneas
        fill: false
    }));

    const chartData = {
        type: selectedType,
        data: { 
            labels: weeks.map(p => p.file.name),
            datasets: datasets 
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    min: 0, 
                    max: 10, 
                    grid: { color: style.getPropertyValue('--background-modifier-border') } 
                },
                x: { 
                    display: true, 
                    grid: { display: false } 
                }
            },
            plugins: { 
                legend: { 
                    position: 'bottom', 
                    labels: { usePointStyle: true, color: style.getPropertyValue('--text-muted') } 
                },
                title: { 
                    display: true, 
                    text: `Progreso Mensual (${selectedType === 'line' ? 'Línea' : 'Barras'})`, 
                    color: style.getPropertyValue('--text-normal') 
                }
            }
        }
    };
    
    window.renderChart(chartData, container);

} else {
    container.innerHTML = "Error: Fecha no válida.";
}