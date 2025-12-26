const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;

// --- CONFIGURACIÓN VISUAL ---
container.style.height = '400px';
container.style.width = '100%';
const style = getComputedStyle(document.body);

// --- SELECCIÓN DEL TIPO DE GRÁFICO (Dinámico) ---
// Esto permite que el gráfico cambie según lo que elijas en el botón
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
let targetDate = page.date ? moment(page.date.toString()) : null;

// Fallback para detectar trimestre por nombre (ej: 2025-Q1)
if (!targetDate) {
     const qMatch = page.file.name.match(/^(\d{4})-Q(\d)/i);
     if (qMatch) {
         const month = (parseInt(qMatch[2]) - 1) * 3;
         targetDate = moment([parseInt(qMatch[1]), month, 1]);
     }
}

if (targetDate && targetDate.isValid()) {
    // 1. Buscar datos
    const weeksData = dv.pages('"02 Weekly"')
        .where(p => {
            const wDate = getPageDate(p);
            return wDate && wDate.isValid() && wDate.isSame(targetDate, 'quarter');
        })
        .sort(p => p.file.name);
    
    // 2. CONVERSIÓN SEGURA (La misma técnica "paranoica" del anual)
    const weeks = Array.from(weeksData);

    if (weeks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding-top:50px; color:var(--text-muted);">
            ⚠️ No hay datos semanales para este Trimestre.<br>
            <small>(${targetDate.format("Qo [Quarter] YYYY")})</small>
        </div>`;
        return;
    }

    // 3. Configurar Datasets
    const datasets = wolService.getKeys().map(key => ({
        label: wolService.getCategories()[key],
        data: weeks.map(w => parseFloat(w.wheelOfLife?.[key] || 0)),
        borderColor: wolService.getBorder(key),
        backgroundColor: wolService.getColor(key),
        borderWidth: 2,
        tension: 0.3,
        // Ocultar puntos si es gráfico de barras para que se vea más limpio
        pointRadius: selectedType === 'line' ? 4 : 0, 
        fill: false
    }));

    const chartData = {
        type: selectedType, // <--- AQUÍ ESTÁ LA MAGIA (Usa la variable, no texto fijo)
        data: { 
            labels: weeks.map(p => p.file.name),
            datasets: datasets 
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                y: { min: 0, max: 10, grid: { color: style.getPropertyValue('--background-modifier-border') } },
                x: { display: true, grid: { display: false } }
            },
            plugins: { 
                legend: { position: 'bottom', labels: { usePointStyle: true, color: style.getPropertyValue('--text-muted') } },
                title: { display: true, text: `Progreso Trimestral (${selectedType === 'line' ? 'Línea' : 'Barras'})`, color: style.getPropertyValue('--text-normal') }
            }
        }
    };
    
    window.renderChart(chartData, container);

} else {
    container.innerHTML = "Error: No se pudo determinar el trimestre.";
}