---
name: charts
description: "Chart creation and verification guide for the minimax-xlsx skill. Read this document when the task requires embedded Excel charts or data visualizations."
---

**Path note**: Relative paths in this document (e.g., `./scripts/`) are anchored to the skill directory that contains this file.

<embedded_objects>

## Charts Must Be Real Embedded Objects

**Proactive stance on visualization:**
- If the user asks for charts or visuals, generate them immediately — don't wait for per-dataset instructions
- When a workbook has multiple data tables, each table should have at least one chart unless the user says otherwise

**What you must NOT do:**
- Output a helper-only "chart dataset" tab and ask the user to insert charts manually
- Mark chart work complete while expecting end users to finish chart insertion

**What you must do:**
- Build embedded charts inside the .xlsx via openpyxl by default
- Standalone image exports (PNG/JPG) only when explicitly requested

</embedded_objects>

<creation_sequence>

**Mandatory sequence:**
```
1. Construct the workbook with openpyxl (data, styling)
2. Insert charts using openpyxl.chart classes
3. Save the file
4. Run chart to confirm charts have data and don't collide
5. If overlaps are detected → reposition with adequate spacing
6. If exit code is 1 → fix broken/empty charts before delivery
```

**Positioning guidelines:**
- Lay out charts in a tidy grid (e.g., two per row)
- Keep uniform gaps between charts (1-2 empty rows or columns recommended)
- Typical first-row anchors for 10-column-wide charts: `E2`, `P2` (or `Q2`)
- Second-row anchors: `E20`, `P20`
- After setting positions, confirm with `chart -v`

</creation_sequence>

<code_samples>

**Imports:**
```python
from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.chart.label import DataLabelList
```

**Bar chart walkthrough:**
```python
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference

wb = Workbook()
ws = wb.active

rows = [
    ['Region', 'Revenue'],
    ['East', 480],
    ['West', 320],
    ['North', 560],
    ['South', 410],
]
for r in rows:
    ws.append(r)

ch = BarChart()
ch.type = "col"
ch.style = 10
ch.title = "Revenue by Region"
ch.y_axis.title = 'Revenue'
ch.x_axis.title = 'Region'

vals = Reference(ws, min_col=2, min_row=1, max_row=5)
cats = Reference(ws, min_col=1, min_row=2, max_row=5)

ch.add_data(vals, titles_from_data=True)
ch.set_categories(cats)
ch.shape = 4

ws.add_chart(ch, "E2")

wb.save('output.xlsx')
```

</code_samples>

<post_check>

**Post-generation check (non-negotiable):**
```bash
./scripts/MiniMaxXlsx chart output.xlsx
```
Exit code 1 means broken charts — they must be fixed.

</post_check>
