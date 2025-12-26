```dataviewjs
// Leemos el tipo de gráfico actual desde la nota
const chartType = dv.current().wolChartType; 

// Pasamos el tipo como un argumento extra al script
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyWheelOfLifeProgression", {
    container: this.container, 
    chartType: chartType // <--- ESTO ES LA CLAVE
})
```