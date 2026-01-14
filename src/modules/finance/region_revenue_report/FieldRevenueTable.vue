<template>
  <div class="field-revenue-table">
    <!-- Heading cho bảng -->
    <div class="table-heading text-left">
      <h3>Doanh thu kế hoạch theo lĩnh vực từng địa bàn {{year}}</h3>
    </div>
    
    <!-- Bảng doanh thu kế hoạch theo lĩnh vực -->
    <div class="overflow-auto table-container">
      <table class="table-report">
        <thead>
          <tr>
            <th rowspan="3" class="sticky-col sticky-col-0 no-wrap">STT</th>
            <th rowspan="3" class="sticky-col sticky-col-1 no-wrap">Đơn vị</th>
            <th :colspan="sizeField+1" class="no-wrap">Kế hoạch địa bàn giao đơn vị {{year}}</th>
            <th :colspan="sizeField+2" class="no-wrap">Kết quả thực hiện 6 tháng {{year}}</th>
            <th :colspan="sizeField+2" class="no-wrap">Dự kiến thực hiện 9 tháng {{year}}</th>
            <th :colspan="sizeField+2" class="no-wrap">Dự kiến thực hiện năm {{year}}</th>
          </tr>
          <tr>
            <th rowspan="2" class="no-wrap">Tổng</th>
            <th rowspan="2" class="no-wrap" v-for="(field, index) in fields" :key="'field-planned-' + index">
              {{field.field_revenue_name}}
            </th>

            <th rowspan="2" class="no-wrap" v-for="(field, index) in fields" :key="'field-actual6m-' + index">
              {{field.field_revenue_name}}
            </th>
            <th rowspan="2" class="no-wrap">Tổng</th>
            <th rowspan="2" class="no-wrap">Tỷ lệ % so kế hoạch năm địa bàn giao</th>

            <th rowspan="2" class="no-wrap" v-for="(field, index) in fields" :key="'field-actual9m-' + index">
              {{field.field_revenue_name}}
            </th>
            <th rowspan="2" class="no-wrap">Tổng</th>
            <th rowspan="2" class="no-wrap">Tỷ lệ % so kế hoạch năm địa bàn giao</th>
            
            <th rowspan="2" class="no-wrap" v-for="(field, index) in fields" :key="'field-projected-' + index">
              {{field.field_revenue_name}}
            </th>
            <th rowspan="2" class="no-wrap">Tổng</th>
            <th rowspan="2" class="no-wrap">Tỷ lệ % so kế hoạch năm địa bàn giao</th>
          </tr>
          <tr>
            <!-- Row 3 is empty since all columns have rowspan="2" -->
          </tr>
        </thead>
        <tbody>
          <tr v-if="dataSum!=null" class="main-row bold">
            <td class="sticky-col sticky-col-0">*</td>
            <td class="sticky-col sticky-col-1 text-left">{{ dataSum.department_name }}</td>
            <!-- Kế hoạch địa bàn giao -->
            <td>{{formatCurrency(dataSum.planned_total)}}</td>
            <td v-for="(field, index) in dataSum.planned.fields" :key="'field-sum-planned-' + index">
                {{formatCurrency(field.revenue)}}
            </td>
            <!-- Kết quả 6 tháng -->
            <td v-for="(field, index) in dataSum.actual_6m.fields" :key="'field-sum-actual_6m-' + index">
                {{formatCurrency(field.revenue)}}
            </td>
            <td>{{formatCurrency(dataSum.actual_6m.total_revenue)}}</td>
            <td>{{formatPercentage(dataSum.actual_6m.total_revenue, dataSum.planned_total)}}</td>
            <!-- Dự kiến 9 tháng -->
            <td v-for="(field, index) in dataSum.projected_9m.fields" :key="'field-sum-actual_9m-' + index">
                {{formatCurrency(field.revenue)}}
            </td>

            <td>{{formatCurrency(dataSum.projected_9m.total_revenue)}}</td>
            <td>{{formatPercentage(dataSum.projected_9m.total_revenue, dataSum.planned_total)}}</td>
            <!-- Dự kiến năm -->
            <td v-for="(field, index) in dataSum.projected.fields" :key="'field-sum-projected-' + index">
                {{formatCurrency(field.revenue)}}
            </td>

            <td>{{formatCurrency(dataSum.projected.total_revenue)}}</td>
            <td>{{formatPercentage(dataSum.projected.total_revenue, dataSum.planned_total)}}</td>
          </tr>
          <template v-for="(item, itemIndex) in tableData" :key="'field-item-' + itemIndex">
            <tr class="main-row bold">
              <td class="sticky-col sticky-col-0">{{ item.stt || (itemIndex + 1) }}</td>
              <td class="sticky-col sticky-col-1 text-left">{{ item.department_name }}</td>
              <!-- Kế hoạch địa bàn giao -->
              <td>{{formatCurrency(item.planned_total)}}</td>
              <td v-for="(field, index) in item.planned.fields" :key="'field-parent-planned-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>
              <!-- Kết quả 6 tháng -->
              <td v-for="(field, index) in item.actual_6m.fields" :key="'field-parent-actual_6m-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>
              <td>{{formatCurrency(item.actual_6m.total_revenue)}}</td>
              <td>{{formatPercentage(item.actual_6m.total_revenue, item.planned_total)}}</td>
              <!-- Dự kiến 9 tháng -->
              <td v-for="(field, index) in item.projected_9m.fields" :key="'field-parent-actual_9m-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>

              <td>{{formatCurrency(item.projected_9m.total_revenue)}}</td>
              <td>{{formatPercentage(item.projected_9m.total_revenue, item.planned_total)}}</td>
              <!-- Dự kiến năm -->
              <td v-for="(field, index) in item.projected.fields" :key="'field-parent-projected-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>

              <td>{{formatCurrency(item.projected.total_revenue)}}</td>
              <td>{{formatPercentage(item.projected.total_revenue, item.planned_total)}}</td>
            </tr>
            <tr v-for="(child, childIndex) in item.children" :key="'field-child-' + itemIndex + '-' + childIndex">
              <td class="sticky-col sticky-col-0">-</td>
              <td class="sticky-col sticky-col-1 text-left">{{ child.department_name }}</td>
              <!-- Kế hoạch địa bàn giao -->
              <td>{{formatCurrency(child.planned_total)}}</td>
              <td v-for="(field, index) in child.planned.fields" :key="'field-child-planned-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>
              <!-- Kết quả 6 tháng -->
              <td v-for="(field, index) in child.actual_6m.fields" :key="'field-child-actual_6m-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>
              <td>{{formatCurrency(child.actual_6m.total_revenue)}}</td>
              <td>{{formatPercentage(child.actual_6m.total_revenue, child.planned_total)}}</td>
              <!-- Dự kiến 9 tháng -->
              <td v-for="(field, index) in child.projected_9m.fields" :key="'field-child-actual_9m-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>
              <td>{{formatCurrency(child.projected_9m.total_revenue)}}</td>
              <td>{{formatPercentage(child.projected_9m.total_revenue, child.planned_total)}}</td>
              <!-- Dự kiến năm -->
              <td v-for="(field, index) in child.projected.fields" :key="'field-child-projected-' + index">
                  {{formatCurrency(field.revenue)}}
              </td>
              <td>{{formatCurrency(child.projected.total_revenue)}}</td>
              <td>{{formatPercentage(child.projected.total_revenue, child.planned_total)}}</td>
            </tr>
          </template>
          <tr v-if="tableData.length === 0">
            <td colspan="21" class="text-center">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx-js-style';

export default {
  name: "FieldRevenueTable",
  props:{
    year:{
      type:Number,
      default:2025
    },
  },
  computed:{
    sizeField(){
      return this.fields.length
    }
  },
  data() {
    return {
      tableData: [],
      fields:[],
      dataSum:null
    }
  },
  methods: {
    loadData(data, dataSum, fields) {
      this.tableData = data.concat([])
      this.fields=fields.concat([])
      this.dataSum=dataSum
    },
    formatCurrency(value) {
      if (!value || value === 0) return '0';
      return new Intl.NumberFormat('vi-VN').format(value);
    },
    borderAll() {
      return {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      };
    },
    formatPercentage(numerator, denominator) {
      if (!denominator || denominator === 0) return '0.00%';
      const percent = numerator / denominator;
      return `${(percent * 100).toFixed(2)}%`;
    },
    ExportExcel() {
      const table = this.$el.querySelector("table.table-report");
      if (!table) {
        console.error("Không tìm thấy bảng với class .table-report");
        return;
      }

      // Tạo workbook từ bảng HTML
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.table_to_sheet(table, { raw: true });

      // Đặt độ rộng cho từng cột (tùy chỉnh theo nhu cầu)
      let colCount = 0;
      for (let row of table.rows) {
        let currentColCount = 0;
        for (let cell of row.cells) {
          currentColCount += cell.colSpan || 1;
        }
        if (currentColCount > colCount) colCount = currentColCount;
      }
      ws["!cols"] = new Array(colCount).fill({ wpx: 160 });

      // Gán style đơn giản cho toàn bộ ô (nâng cấp tùy nhu cầu)
        // Border style cho toàn bộ ô
      const borderStyle = {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      };

      // Áp dụng style cho tất cả ô có trong phạm vi
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cell_address]) ws[cell_address] = { v: '', t: 's' }; // nếu ô trống thì thêm ô rỗng

          const cell = ws[cell_address];
          cell.s = {
            font: { name: "Arial", sz: 12, bold: R <= 2 },
            alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: true,
            },
            border: borderStyle,
          };

          // Màu nền cho tiêu đề (3 hàng đầu)
          if (R <= 2) {
            cell.s.fill = { fgColor: { rgb: "f0f8ff" } };
          }
        }
      }

      // Nếu có ô merge, thêm border cho vùng merge
      if (ws["!merges"]) {
        ws["!merges"].forEach((merge) => {
          for (let R = merge.s.r; R <= merge.e.r; ++R) {
            for (let C = merge.s.c; C <= merge.e.c; ++C) {
              const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
              if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' };
              ws[cellRef].s = {
                font: { name: "Arial", sz: 12, bold: R <= 2 },
                alignment: {
                  vertical: "center",
                  horizontal: "center",
                  wrapText: true,
                },
                border: borderStyle,
                fill: R <= 2 ? { fgColor: { rgb: "f0f8ff" } } : undefined,
              };
            }
          }
        });
      }

      // Thêm sheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Báo cáo doanh thu");

      // Ghi file
      XLSX.writeFile(wb, `Doanh_thu_theo_linh_vuc_${this.year}.xlsx`);
    }
  }
};
</script>

<style scoped>
.field-revenue-table {
  margin-top: 30px;
}

.table-heading {
  text-align: center;
  margin-bottom: 15px;
}

.table-heading h3 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.table-report {
  border-spacing: 0 !important;
  border-collapse: separate !important;
  width: 100%;
  min-width: 2200px; 
  font-size: 13px;
  text-align: center;
}

.table-report td {
  border: 1px solid #ccc;
  padding: 6px 8px;
  box-sizing: border-box;
  transform: translateZ(0);
  white-space: nowrap;
}

.table-report th {
  border: 1px solid #ccc;
  padding: 6px 8px;
  box-sizing: border-box;
  background-color: #f0f8ff;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
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
  background: #f0f8ff;
  z-index: 5;
  transform: translateZ(0);
}

/* Header sticky columns with higher z-index */
.table-report thead .sticky-col-0 { z-index: 15; }
.table-report thead .sticky-col-1 { z-index: 14; }

/* Body sticky columns */
tbody .sticky-col {
  background: white;
  z-index: 1;
}
tbody .sticky-col-0 { z-index: 4; }
tbody .sticky-col-1 { z-index: 3; }

/* Fixed widths and positions for sticky columns */
.sticky-col-0 { 
  left: 0; 
  min-width: 60px;
  width: 60px;
  box-shadow: 1px 0 0 0 #ccc;
}

.sticky-col-1 { 
  left: 60px;
  min-width: 250px;
  width: 250px; 
  box-shadow: 1px 0 0 0 #ccc;
}
.no-wrap {
  white-space: nowrap;
}
</style>
