---
tags:
  - "#type/monthly-note"
cssclasses:
  - image-borders
  - image-small
  - timegarden-monthly
  - december
  - monthly
banner:
  - - MonthlyBanner1.gif
banner-y: 10
banner-x: 30
content-start: 200
banner-display: cover
banner-repeat: true
banner-height: 400
banner-fade: -75
banner-radius: 25
date: 2025-12-01
alias:
aiAnswer: ""
MonthSummary: ""
monthlyWheelOfLifeCategoryChartType: line
journal: monthly
journal-date: 2025-12-01
journal-start-date: 2025-12-01
journal-end-date: 2025-12-31
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
# ✧ *12-December*

`BUTTON[prev-month, current-quarter, next-month]`
```meta-bind-button
id: prev-month
style: primary
class: phone-responsive
label: ← Previous Month
hidden: true
actions:
  - type: open
    link: "[[/03 Monthly/2025/2025-11-November]]"
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
      link: "[[/03 Monthly/2026/2026-01-January]]"
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
startDate: 2025-12-01-Monday
endDate: 2025-12-31-Wednesday
summary:
    template: "Average Rating: {{average()}}" 
```

```dataviewjs
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyRatingChart", {container: this.container})
```

### <p hidden>PicturesHeader</p>
> [! pictures]- Gallery of M12
> ![[2025-W01#<p hidden>PicturesHeader</p>]]
> ![[2025-W49#<p hidden>PicturesHeader</p>]]
> ![[2025-W50#<p hidden>PicturesHeader</p>]]
> ![[2025-W51#<p hidden>PicturesHeader</p>]]
> ![[2025-W52#<p hidden>PicturesHeader</p>]]

## Logs
---
> [!logsone]- Logs of W49
> ![[2025-W49#Logs]]

> [!logstwo]- Logs of W50
> ![[2025-W50#Logs]]

> [!logsthree]- Logs of W51
> ![[2025-W51#Logs]]

> [!logsfour]- Logs of W52
> ![[2025-W52#Logs]]



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

**Chart Type:** `INPUT[suggester(title('chart type'), option(line), option(bar), option(pie), option(radar)):monthlyWheelOfLifeCategoryChartType]`

```dataviewjs
dv.view("06 Templates/Scripts/templater/dataviewjs/monthly/monthlyWheelOfLifeProgression", {container: this.container})
```

## Q&A
---
```meta-bind
INPUT[text(placeholder('Write a question'), class('custom-input')):aiQuestion]
```
---
```meta-bind-button
label: 🔎 Ask your Month
icon: ""
style: primary
class: phone-responsive
cssStyle: ""
backgroundImage: ""
tooltip: ""
id: ""
hidden: false
actions:
  - type: command
    command: templater-obsidian:06 Templates/Components/Monthly AI QA Execute.md

```

```meta-bind
INPUT[editor(class(custom-editor)):aiAnswer]
```

