---
tags:
  - "#type/monthly-note"
cssclasses:
  - image-borders
  - image-small
  - timegarden-monthly
  - november
  - monthly
banner:
  - - MonthlyBanner4.gif
banner-y: 50
banner-x: 30
content-start: 200
banner-display: cover
banner-repeat: true
banner-height: 400
banner-fade: -75
banner-radius: 25
date: 2025-11-01
alias:
aiAnswer: ""
MonthSummary: ""
monthlyWheelOfLifeCategoryChartType: line
journal: monthly
journal-date: 2025-11-01
journal-start-date: 2025-11-01
journal-end-date: 2025-11-30
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
# ✧ *11-November*

`BUTTON[prev-month, current-quarter, next-month]`
```meta-bind-button
id: prev-month
style: primary
class: phone-responsive
label: ← Previous Month
hidden: true
actions:
  - type: open
    link: "[[/03 Monthly/2025/2025-10-October]]"
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
      link: "[[/03 Monthly/2025/2025-12-December]]"
      newTab: false
```

```meta-bind
INPUT[text(placeholder('Name this Month!'), class('custom-input')):alias]
```

```meta-bind
INPUT[editor(class(custom-editor)):MonthSummary]
```

`BUTTON[generate-monthly-summary, generate-monthly-alias]`
```meta-bind-button
id: generate-monthly-summary
style: primary
label: ✨ Generate Summary
hidden: true
actions:
  - type: command
    command: templater-obsidian:06 Templates/Components/Monthly AI Summarize.md
```
```meta-bind-button
id: generate-monthly-alias
style: primary
label: 🏷️ Generate Alias
hidden: true
actions:
  - type: command
    command: templater-obsidian:06 Templates/Components/Monthly AI Alias.md
```

## Ratings ✮⋆˙
---
```tracker
searchType: frontmatter
searchTarget: dayRating
dateFormat: YYYY-MM-DD-dddd
datasetName: dayRating
startDate: 2025-11-01-Saturday
endDate: 2025-11-30-Sunday
summary:
    template: "Average Rating: {{average()}}" 
```

```dataviewjs
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyRatingChart", {container: this.container})
```

### <p hidden>PicturesHeader</p>
> [! pictures]- Gallery of M11
> ![[2025-W44#<p hidden>PicturesHeader</p>]]
> ![[2025-W45#<p hidden>PicturesHeader</p>]]
> ![[2025-W46#<p hidden>PicturesHeader</p>]]
> ![[2025-W47#<p hidden>PicturesHeader</p>]]
> ![[2025-W48#<p hidden>PicturesHeader</p>]]

## Logs
---
> [!logsone]- Logs of W45
> ![[2025-W45#Logs]]

> [!logstwo]- Logs of W46
> ![[2025-W46#Logs]]

> [!logsthree]- Logs of W47
> ![[2025-W47#Logs]]

> [!logsfour]- Logs of W48
> ![[2025-W48#Logs]]



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
