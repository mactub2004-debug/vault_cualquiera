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

// --- FUNCIÓN DE FECHAS ROBUSTA (Para Semanas) ---
function getPageDate(p) {
    if (p.date) return moment(p.date.toString());
    const match = p.file.name.match(/^(\d{4})-W(\d{1,2})$/i);
    if (match) return moment(`${match[1]}-W${match[2].padStart(2, '0')}`, "YYYY-WW");
    return null;
}

// --- LÓGICA DE DATOS TRIMESTRAL ---
// 1. Determinar fecha del Trimestre actual
let targetDate = page.date ? moment(page.date.toString()) : null;

// Fallback: intentar sacar fecha del nombre de la nota (ej: 2025-Q1)
if (!targetDate) {
     const qMatch = page.file.name.match(/^(\d{4})-Q(\d)/i);
     if (qMatch) {
         // Trimestre 1 = Enero (mes 0), T2 = Abril (mes 3), etc.
         const month = (parseInt(qMatch[2]) - 1) * 3;
         targetDate = moment([parseInt(qMatch[1]), month, 1]);
     }
}

if (targetDate && targetDate.isValid()) {
    // 2. BUSCAR SEMANAS DEL TRIMESTRE
    const weeks = dv.pages('"02 Weekly"')
        .where(p => {
            const wDate = getPageDate(p);
            // 'quarter' compara si están en el mismo trimestre y año
            return wDate && wDate.isValid() && wDate.isSame(targetDate, 'quarter');
        });
    
    // DEBUG: Aviso si no hay datos
    if (weeks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding-top: 50px; color: var(--text-muted);">
            ⚠️ No se encontraron semanas para el Trimestre.<br>
            <small>(${targetDate.format("Qo [Quarter] YYYY")})</small>
        </div>`;
        return;
    }

    // 3. CALCULAR PROMEDIOS
    dataValues = keys.map(key => {
        let sum = 0, count = 0;
        weeks.forEach(w => {
            const val = w.wheelOfLife?.[key];
            if (typeof val === 'number') { sum += val; count++; }
        });
        // parseFloat evita el error n.push
        return count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });

} else {
    // Si es la nota semanal actual (caso raro para este script, pero por seguridad)
    if (page.file.path.includes("02 Weekly")) {
        dataValues = keys.map(k => parseFloat(page.wheelOfLife?.[k] || 0));
    } else {
        container.innerHTML = `<div style="text-align:center; padding-top: 50px; color: var(--text-muted);">No se pudo determinar el trimestre.</div>`;
        return;
    }
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
                min: 0, 
                max: 10,
                ticks: { display: false, backdropColor: 'transparent', z: 1 },
                grid: { display: true, color: gridColor, circular: true },
                angleLines: { display: true, color: gridColor },
                pointLabels: { display: false }
            }
        },
        plugins: {
            legend: { 
                position: 'bottom', 
                labels: { color: style.getPropertyValue('--text-muted'), padding: 20, usePointStyle: true } 
            }
        }
    }
};

window.renderChart(chartData, container);