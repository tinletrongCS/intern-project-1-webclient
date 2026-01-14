<template>
  <div class="overflow-auto table-container"> <table class="table-report">
      <thead>
        <tr>
          <th rowspan="3" class="sticky-col sticky-col-0">TT</th>
          <th rowspan="3" class="sticky-col sticky-col-1 text-left">Chỉ tiêu</th>
          <th rowspan="2" class="sticky-col sticky-col-2">Kế hoạch giao</th>
          <th colspan="2" rowspan="2" class="sticky-col sticky-col-3-merged">Thực hiện lũy kế</th> 
          
          <template v-for="month in months" :key="'month-head-' + month">
            <th :colspan="1 + actualColSpan">Tháng {{ month }}</th>
          </template>
        </tr>
        <tr>
          <template v-for="month in months" :key="'month-sub-' + month">
            <th rowspan="2">Phân rã KH</th>
            <th :colspan="actualColSpan">Thực hiện</th>
          </template>
        </tr>
        <tr>
          <th class="sticky-col sticky-col-2-1">Tổng giao</th>
          <th class="sticky-col sticky-col-3-1">Tỷ lệ</th>
          <th class="sticky-col sticky-col-3-2">Tổng</th> <template v-for="month in months" :key="'month-detail-' + month">
            <th>Tổng</th>
            <th>Duy trì</th>
            <th>PT mới</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-if="dataSum!=null" class="bold">
          <td class="sticky-col sticky-col-0">*</td>
          <td class="sticky-col sticky-col-1 text-left">{{dataSum.department_name}}</td>
          <td class="sticky-col sticky-col-2">{{formatCurrencyVND(dataSum.total_planned_revenue)}}</td>
          <td class="sticky-col sticky-col-3">{{dataSum.percent}}</td>
          <td class="sticky-col sticky-col-4">{{ formatCurrencyVND(dataSum.total_actual_revenue) }}</td> 
          <template v-for="revenue_month in dataSum.revenue_months" :key="'sum_month-'+revenue_month.period">
            <td>{{ formatCurrencyVND(revenue_month.planned_revenue) }}</td>
            <td>{{ formatCurrencyVND(revenue_month.actual_revenue) }}</td>
            <td>{{ formatCurrencyVND(revenue_month.actual_revenue_maintain) }}</td>
            <td>{{ formatCurrencyVND(revenue_month.actual_revenue_new) }}</td>
          </template>
        </tr>
        <template v-for="(group, groupIndex) in dataGrid" :key="'group-' + groupIndex">
          <tr class="bold">
            <td class="sticky-col sticky-col-0">{{ groupIndex + 1 }}</td>
            
            <td class="sticky-col sticky-col-1 text-left">{{ group.department_name }}</td>
            <td class="sticky-col sticky-col-2">{{ formatCurrencyVND(group.total_planned_revenue) }}</td>
            <td class="sticky-col sticky-col-3">{{ group.percent }}</td>
            <td class="sticky-col sticky-col-4">{{ formatCurrencyVND(group.total_actual_revenue) }}</td> <template v-for="revenue_month in group.revenue_months" :key="'gmonth-' + groupIndex + '-' + revenue_month.period">
              <td>{{ formatCurrencyVND(revenue_month.planned_revenue) }}</td>
              <td>{{ formatCurrencyVND(revenue_month.actual_revenue) }}</td>
              <td>{{ formatCurrencyVND(revenue_month.actual_revenue_maintain) }}</td>
              <td>{{ formatCurrencyVND(revenue_month.actual_revenue_new) }}</td>
            </template>
          </tr>
          <tr v-for="(child, childIndex) in group.children" :key="'child-' + groupIndex + '-' + childIndex">
            <td class="sticky-col sticky-col-0">-</td>
            <td class="sticky-col sticky-col-1 text-left">{{ child.item_revenue_name }}</td>
            <td class="sticky-col sticky-col-2">{{ formatCurrencyVND(child.total_planned_revenue) }}</td>
            <td class="sticky-col sticky-col-3">{{ child.percent }}</td>
            <td class="sticky-col sticky-col-4">{{ formatCurrencyVND(child.total_actual_revenue) }}</td> <template v-for="child_revenue_month in child.revenue_months" :key="'cmonth-' + groupIndex + '-' + childIndex + '-' + child_revenue_month.period">
              <td>{{ formatCurrencyVND(child_revenue_month.planned_revenue) }}</td>
              <td>{{ formatCurrencyVND(child_revenue_month.actual_revenue) }}</td>
              <td>{{ formatCurrencyVND(child_revenue_month.actual_revenue_maintain) }}</td>
              <td>{{ formatCurrencyVND(child_revenue_month.actual_revenue_new) }}</td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
import * as XLSX from 'xlsx-js-style'

export default {
  name: "PlanBreakdownTable",
  data() {
    return {
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      actualColSpan: 3,
      dataGrid: [],
      dataSum:null
    };
  },
  methods: {
    loadData(data, dataSum) {
      this.dataGrid = data.concat([])
      this.dataSum=dataSum
    },
    formatCurrencyVND(value) {
      if (typeof value !== 'number') return '0';
      return value.toLocaleString('vi-VN');
    },
    ExportExcel() {
      const table = this.$el.querySelector('.table-report')
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.table_to_sheet(table, { raw: true })

      const range = XLSX.utils.decode_range(ws['!ref'])

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' }
        }
      }

      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
          const cell = ws[cellRef]
          if (cell && typeof cell.v === 'string' && /^[\d.,]+$/.test(cell.v)) {
            cell.v = parseFloat(cell.v.replace(/\./g, '').replace(',', ''))
            cell.t = 'n'
          }
        }
      }

      const borderStyle = {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
          const cell = ws[cellRef]
          cell.s = {
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            border: borderStyle
          }
        }
      }

      if (ws['!merges']) {
        ws['!merges'].forEach(merge => {
          for (let R = merge.s.r; R <= merge.e.r; ++R) {
            for (let C = merge.s.c; C <= merge.e.c; ++C) {
              const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
              if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' }
              ws[cellRef].s = {
                alignment: {
                  vertical: 'center',
                  horizontal: 'center',
                  wrapText: true
                },
                border: borderStyle
              }
            }
          }
        })
      }

      ws['!cols'] = [
        { wch: 5 },
        { wch: 36 },
        { wch: 18 },
        { wch: 16 },
        { wch: 18 },
        ...this.months.flatMap(() => [
          { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }
        ])
      ]

      XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'bao_cao_doanh_thu.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
};
</script>
<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto; /* Ensure vertical scroll for sticky headers */
  /* max-height: 80vh; /* Optional: if you want fixed height and internal scroll */
}

.table-report {
  /* border-collapse: collapse; */
  border-spacing: 0 !important;
  border-collapse: separate !important;
  width: 100%;
  /* Adjusted min-width to accommodate 5 sticky columns + monthly data */
  min-width: 2800px; 
  font-size: 13px;
  text-align: center;
}
.table-report th,
.table-report td {
  border: 1px solid #ccc;
  padding: 6px 8px;
  white-space: nowrap;
  box-sizing: border-box; /* Important for width calculations */
  transform: translateZ(0);
}
.table-report th {
  background-color: #f0f8ff;
  font-weight: bold;
  position: sticky; /* Make header sticky vertically */
  top: 0;
  z-index: 10; /* Ensure header is on top of content */
  transform: translateZ(0);
}

.text-left {
  text-align: left;
}
.bold {
  font-weight: bold;
}

/* Sticky columns */
.sticky-col {
  position: sticky;
  background: #f0f8ff; /* Header sticky background */
  z-index: 5; /* Base z-index for fixed columns, higher than normal cells (default z-index is 0) */
  transform: translateZ(0);
}

/* Adjust z-index for specific sticky header cells for correct layering when overlapping */
.table-report thead .sticky-col-0 { z-index: 15; } /* TT */
.table-report thead .sticky-col-1 { z-index: 14; } /* Chỉ tiêu */
.table-report thead .sticky-col-2 { z-index: 13; } /* Kế hoạch giao (header row 1) */
.table-report thead .sticky-col-3-merged { z-index: 12; } /* Thực hiện lũy kế (header row 1, merged) */

/* Specific z-index for sub-headers in row 3 */
.table-report thead .sticky-col-2-1 { z-index: 13; } /* Tổng giao */
.table-report thead .sticky-col-3-1 { z-index: 12; } /* Tỷ lệ */
.table-report thead .sticky-col-3-2 { z-index: 11; } /* Tổng (cột mới dính) */


/* Sticky cells in tbody */
tbody .sticky-col {
  background: white; /* Body sticky background */
  z-index: 1; /* Lower z-index than headers */
}
/* Ensure sticky body cells correctly overlap if their columns are side-by-side */
tbody .sticky-col-0 { z-index: 4; } /* TT */
tbody .sticky-col-1 { z-index: 3; } /* Chỉ tiêu */
tbody .sticky-col-2 { z-index: 2; } /* Kế hoạch giao */
tbody .sticky-col-3 { z-index: 2; } /* Tỷ lệ */
tbody .sticky-col-4 { z-index: 2; } /* Tổng */


/* Define fixed widths for sticky columns AND calculate their left positions */
/* It's crucial to set explicit widths for sticky columns to ensure correct 'left' calculations */

/* Cột TT */
.sticky-col-0 { 
  left: 0; 
  min-width: 60px; /* Use min-width for flexibility, but ensure it's honored */
  width: 60px; /* Set a fixed width to ensure precise left positioning for subsequent columns */
  box-shadow: 1px 0 0 0 #ccc;
}

/* Cột Chỉ tiêu */
.sticky-col-1 { 
  left: 60px; /* width of sticky-col-0 */
  min-width: 250px;
  width: 250px; 
}

/* Cột Kế hoạch giao (Tổng giao) */
.sticky-col-2, .sticky-col-2-1 { /* Both main header and sub-header */
  left: calc(60px + 250px); /* width of sticky-col-0 + sticky-col-1 */
  min-width: 150px;
  width: 150px; 
}

/* Cột Thực hiện lũy kế - Tỷ lệ */
.sticky-col-3, .sticky-col-3-1 { /* Main header and sub-header */
  left: calc(60px + 250px + 150px); /* width of sticky-col-0 + sticky-col-1 + sticky-col-2 */
  min-width: 120px;
  width: 120px; 
}

/* Cột Thực hiện lũy kế - Tổng */
/* This is the 5th fixed column you want to stick */
.sticky-col-4, .sticky-col-3-2 { /* Body cell and sub-header */
  left: calc(60px + 250px + 150px + 120px); /* Sum of sticky-col-0, sticky-col-1, sticky-col-2, sticky-col-3 */
  min-width: 120px;
  width: 120px; 
}

/* The merged header for "Thực hiện lũy kế" (header row 1) spans across sticky-col-3 and sticky-col-4 */
.sticky-col-3-merged {
  left: calc(60px + 250px + 150px); /* Same left as sticky-col-3 */
  min-width: calc(120px + 120px); /* Total width of sticky-col-3 and sticky-col-4 */
  width: calc(120px + 120px);
}
</style>