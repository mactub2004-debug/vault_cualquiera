---
tags:
  - "#type/monthly-note"
cssclasses:
  - image-borders
  - image-small
  - timegarden-monthly
  - october
  - monthly
banner:
  - - MonthlyBanner3.gif
banner-y: 30
banner-x: 30
content-start: 200
banner-display: cover
banner-repeat: true
banner-height: 400
banner-fade: -75
banner-radius: 25
date: 2025-10-01
alias:
aiAnswer: ""
MonthSummary: ""
monthlyWheelOfLifeCategoryChartType: line
journal: monthly
journal-date: 2025-10-01
journal-start-date: 2025-10-01
journal-end-date: 2025-10-31
wheelOfLife:
  career:
  careerSummary: ""
  health:
  healthSummary: ""
  growth:
  growthSummary: ""
  recreation:
  recreationSummary: ""
  social:
  socialSummary: ""
---
# ✧ *10-October*

`BUTTON[prev-month, current-quarter, next-month]`
```meta-bind-button
id: prev-month
style: primary
class: phone-responsive
label: ← Previous Month
hidden: true
actions:
  - type: open
    link: "[[/03 Monthly/2025/2025-09-September]]"
    newTab: false
```
```meta-bind-button
id: current-quarter
style: primary
class: phone-responsive
label: This Quarter
hidden: true
actions:
    - type: open  
      link: "[[/04 Quarterly/2025/2025-Q4]]"
      newTab: false
```
```meta-bind-button
id: next-month
style: primary
class: phone-responsive
label: Next Month →
hidden: true
actions:
    - type: open
      link: "[[/03 Monthly/2025/2025-11-November]]"
      newTab: false
```

```meta-bind
INPUT[text(placeholder('Name this Month!'), class('custom-input')):alias]
```

```meta-bind
INPUT[editor(class(custom-editor)):MonthSummary]
```


## Ratings ✮⋆˙
---
```tracker
searchType: frontmatter
searchTarget: dayRating
dateFormat: YYYY-MM-DD-dddd
datasetName: dayRating
startDate: 2025-10-01-Wednesday
endDate: 2025-10-31-Friday
summary:
    template: "Average Rating: {{average()}}" 
```

```dataviewjs
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyRatingChart", {container: this.container})
```

### <p hidden>PicturesHeader</p>
> [! pictures]- Gallery of M10
> ![[2025-W40#<p hidden>PicturesHeader</p>]]
> ![[2025-W41#<p hidden>PicturesHeader</p>]]
> ![[2025-W42#<p hidden>PicturesHeader</p>]]
> ![[2025-W43#<p hidden>PicturesHeader</p>]]
> ![[2025-W44#<p hidden>PicturesHeader</p>]]

## Logs
---
> [!logsone]- Logs of W40
> ![[2025-W40#Logs]]

> [!logstwo]- Logs of W41
> ![[2025-W41#Logs]]

> [!logsthree]- Logs of W42
> ![[2025-W42#Logs]]

> [!logsfour]- Logs of W43
> ![[2025-W43#Logs]]

> [!logsfive]- Logs of W44
> ![[2025-W44#Logs]]



## Week Overview
---
```dataviewjs
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyWeekDisplay", {container: this.container})
```
## Wheel of Life Overview
---
```dataviewjs
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyWheelOfLifeChart", {container: this.container})
```

**Chart Type:** `INPUT[inlineSelect(option(line, 📈 Line), option(bar, 📊 Bar)):wolChartType]`

```dataviewjs
// Leemos el tipo de gráfico actual desde la nota
const chartType = dv.current().wolChartType; 

// Pasamos el tipo como un argumento extra al script
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyWheelOfLifeProgression", {
    container: this.container, 
    chartType: chartType // <--- ESTO ES LA CLAVE
})
```
