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

// --- FUNCIÓN PARA OBTENER FECHA ---
function getPageDate(p) {
    if (p.date) return moment(p.date.toString());
    const match = p.file.name.match(/^(\d{4})-W(\d{1,2})$/i);
    if (match) return moment(`${match[1]}-W${match[2].padStart(2, '0')}`, "YYYY-WW");
    return null;
}

// --- LÓGICA DE DATOS ---
if (page.file.path.includes("02 Weekly")) {
    // Modo: Nota Semanal
    dataValues = keys.map(k => parseFloat(page.wheelOfLife?.[k] || 0));
} else {
    // Modo: Nota Mensual / Trimestral / Anual
    let filterUnit = 'month';
    if (page.file.path.includes("Quarterly")) filterUnit = 'quarter';
    if (page.file.path.includes("Yearly")) filterUnit = 'year';
    
    // 1. Determinar fecha objetivo
    let targetDate = page.date ? moment(page.date.toString()) : null;
    if (!targetDate) {
         const mMatch = page.file.name.match(/^(\d{4})-(\d{2})/);
         if (mMatch) targetDate = moment(`${mMatch[1]}-${mMatch[2]}-01`);
    }

    if (targetDate && targetDate.isValid()) {
        // 2. BUSCAR SEMANAS (Ruta "02 Weekly" directa para evitar errores de ruta)
        const weeks = dv.pages('"02 Weekly"')
            .where(p => {
                const wDate = getPageDate(p);
                return wDate && wDate.isValid() && wDate.isSame(targetDate, filterUnit);
            });
        
        // DEBUG: Si no encuentra semanas, muestra un aviso en lugar de un gráfico vacío
        if (weeks.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding-top: 50px; color: var(--text-muted);">
                ⚠️ No se encontraron notas semanales en "02 Weekly" para ${targetDate.format("MMMM YYYY")}.
                <br>Revisa que las notas existan y tengan fecha.
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
        container.innerHTML = `<div style="text-align:center; padding-top: 50px; color: var(--text-muted);">No se pudo determinar la fecha de esta nota mensual.</div>`;
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