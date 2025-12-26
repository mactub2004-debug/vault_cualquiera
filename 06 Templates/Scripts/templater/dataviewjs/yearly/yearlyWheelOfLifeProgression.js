const wolService = require(app.vault.adapter.basePath + "/06 Templates/Scripts/services/wheelOfLife.js");
const container = input.container;

container.style.height = '400px';
container.style.width = '100%';
const style = getComputedStyle(document.body);

const validTypes = ['line', 'bar'];
let selectedType = input.chartType || dv.current().wolChartType || 'line';
if (!validTypes.includes(selectedType)) selectedType = 'line';

const page = dv.current();
let year = null;
if (page.date) {
    year = moment(page.date.toString()).year();
} else {
    const match = page.file.name.match(/^(\d{4})/);
    if (match) year = parseInt(match[1]);
}

function getWeekDate(p) {
    if (p.date) return moment(p.date.toString());
    const match = p.file.name.match(/^(\d{4})-W(\d{1,2})$/i);
    if (match) return moment(`${match[1]}-W${match[2].padStart(2, '0')}`, "YYYY-WW");
    return null;
}

if (year) {
    const weeksData = dv.pages('"02 Weekly"')
        .where(p => {
            const wDate = getWeekDate(p);
            return wDate && wDate.isValid() && wDate.year() === year;
        });
    
    const weeks = Array.from(weeksData);

    if (weeks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding-top:50px; color:var(--text-muted);">⚠️ No hay notas semanales para el año ${year}.</div>`;
        return;
    }

    const monthsData = Array.from({length: 12}, () => ({ sum: {}, count: 0 }));
    
    weeks.forEach(w => {
        const wDate = getWeekDate(w);
        const monthIndex = wDate.month();
        monthsData[monthIndex].count++;
        wolService.getKeys().forEach(key => {
            const val = parseFloat(w.wheelOfLife?.[key] || 0);
            if (!monthsData[monthIndex].sum[key]) monthsData[monthIndex].sum[key] = 0;
            monthsData[monthIndex].sum[key] += val;
        });
    });

    const datasets = wolService.getKeys().map(key => ({
        label: wolService.getCategories()[key],
        data: monthsData.map(m => m.count > 0 ? (m.sum[key] / m.count).toFixed(1) : null),
        borderColor: wolService.getBorder(key),
        backgroundColor: wolService.getColor(key),
        borderWidth: 2,
        tension: 0.3,
        pointRadius: selectedType === 'line' ? 4 : 0,
        spanGaps: true
    }));

    const chartData = {
        type: selectedType,
        data: { 
            labels: moment.monthsShort(),
            datasets: datasets 
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                y: { min: 0, max: 10, grid: { color: style.getPropertyValue('--background-modifier-border') } },
                x: { grid: { display: false } }
            },
            plugins: { 
                legend: { position: 'bottom', labels: { usePointStyle: true, color: style.getPropertyValue('--text-muted') } },
                title: { display: true, text: `Evolución Mensual ${year}`, color: style.getPropertyValue('--text-normal') }
            }
        }
    };
    
    window.renderChart(chartData, container);
} else {
    container.innerHTML = "Error: No se pudo determinar el año.";
}