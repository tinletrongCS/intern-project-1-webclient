<template>
  <div class="monthly-plan-table">
    <!-- Heading cho bảng -->
    <div class="table-heading text-left">
      <h3>Dự kiến giao kế hoạch doanh thu khách hàng - dịch vụ nhóm b-c năm {{ year }}</h3>
    </div>
    
    <!-- Bảng dự kiến giao kế hoạch doanh thu khách hàng -->
    <div class="overflow-auto table-container">
      <table class="table-report">
        <thead>
          <tr>
            <th rowspan="3" class="sticky-col sticky-col-0">STT</th>
            <th rowspan="3" class="sticky-col sticky-col-1">Đơn vị</th>
            <th colspan="4">Kế hoạch doanh thu khách hàng</th>
            <th colspan="36">Doanh thu khách hàng phân kỳ tháng {{ year }}</th>
            <th colspan="38">Kết quả thực hiện {{ year }}</th>
          </tr>
          <tr>
            <th rowspan="2">Doanh thu duy trì</th>
            <th rowspan="2">Doanh thu PT mới</th>
            <th rowspan="2">Doanh thu PT khác</th>
            <th rowspan="2">Cộng kế hoạch giao doanh thu khách hàng</th>
            <th colspan="3">Tháng 1</th>
            <th colspan="3">Tháng 2</th>
            <th colspan="3">Tháng 3</th>
            <th colspan="3">Tháng 4</th>
            <th colspan="3">Tháng 5</th>
            <th colspan="3">Tháng 6</th>
            <th colspan="3">Tháng 7</th>
            <th colspan="3">Tháng 8</th>
            <th colspan="3">Tháng 9</th>
            <th colspan="3">Tháng 10</th>
            <th colspan="3">Tháng 11</th>
            <th colspan="3">Tháng 12</th>
            <th colspan="3">Tháng 1</th>
            <th colspan="3">Tháng 2</th>
            <th colspan="3">Tháng 3</th>
            <th colspan="3">Tháng 4</th>
            <th colspan="3">Tháng 5</th>
            <th colspan="3">Tháng 6</th>
            <th colspan="3">Tháng 7</th>
            <th colspan="3">Tháng 8</th>
            <th colspan="3">Tháng 9</th>
            <th colspan="3">Tháng 10</th>
            <th colspan="3">Tháng 11</th>
            <th colspan="3">Tháng 12</th>
            <th rowspan="2">Lũy kế thực hiện</th>
            <th rowspan="2">Tỷ lệ % thực hiện/kế hoạch</th>
          </tr>
          <tr>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
            <th>Duy trì</th>
            <th>PT mới</th>
            <th>Khác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="dataSum!=null" class="main-row bold">
            <td class="sticky-col sticky-col-0">*</td>
            <td class="sticky-col sticky-col-1 text-left">{{ dataSum.department_name }}</td>
            <!-- Kế hoạch địa bàn giao -->
            <td>{{ formatCurrency(dataSum.projected_maintain_total) }}</td>
            <td>{{ formatCurrency(dataSum.projected_new_total) }}</td>
            <td>{{ formatCurrency(dataSum.projected_other_total) }}</td>
            <td>{{ formatCurrency(dataSum.projected_planed_total) }}</td>
            <!-- 12 tháng x 3 cột = 36 cột cho kế hoạch -->
            <template v-for="month in 12" :key="'month-' + month">
              <td>{{ formatCurrency(dataSum.projected_data && dataSum.projected_data[month - 1]?.projected_maintain || 0) }}</td>
              <td>{{ formatCurrency(dataSum.projected_data && dataSum.projected_data[month - 1]?.projected_new || 0) }}</td>
              <td>{{ formatCurrency(dataSum.projected_data && dataSum.projected_data[month - 1]?.projected_other || 0) }}</td>
            </template>
            <!-- 12 tháng x 3 cột = 36 cột cho thực hiện -->
            <template v-for="month in 12" :key="'actual-month-' + month">
              <td>{{ formatCurrency(dataSum.actual_data && dataSum.actual_data[month - 1]?.actual_maintain || 0) }}</td>
              <td>{{ formatCurrency(dataSum.actual_data && dataSum.actual_data[month - 1]?.actual_new || 0) }}</td>
              <td>{{ formatCurrency(dataSum.actual_data && dataSum.actual_data[month - 1]?.actual_other || 0) }}</td>
            </template>
            <!-- Lũy kế và tỷ lệ -->
            <td>{{ formatCurrency(dataSum.actual_cumulative_total) }}</td>
            <td>{{ dataSum.percent_actual_projected }}</td>
          </tr>
          <template v-for="(item, itemIndex) in tableData" :key="'monthly-item-' + itemIndex">
            <tr class="main-row bold">
              <td class="sticky-col sticky-col-0">{{ item.stt || (itemIndex + 1) }}</td>
              <td class="sticky-col sticky-col-1 text-left">{{ item.department_name }}</td>
              <td>{{ formatCurrency(item.projected_maintain_total) }}</td>
              <td>{{ formatCurrency(item.projected_new_total) }}</td>
              <td>{{ formatCurrency(item.projected_other_total) }}</td>
              <td>{{ formatCurrency(item.projected_planed_total) }}</td>
              <!-- 12 tháng x 3 cột = 36 cột cho kế hoạch -->
              <template v-for="month in 12" :key="'month-' + month">
                <td>{{ formatCurrency(item.projected_data && item.projected_data[month - 1]?.projected_maintain || 0) }}</td>
                <td>{{ formatCurrency(item.projected_data && item.projected_data[month - 1]?.projected_new || 0) }}</td>
                <td>{{ formatCurrency(item.projected_data && item.projected_data[month - 1]?.projected_other || 0) }}</td>
              </template>
              <!-- 12 tháng x 3 cột = 36 cột cho thực hiện -->
              <template v-for="month in 12" :key="'actual-month-' + month">
                <td>{{ formatCurrency(item.actual_data && item.actual_data[month - 1]?.actual_maintain || 0) }}</td>
                <td>{{ formatCurrency(item.actual_data && item.actual_data[month - 1]?.actual_new || 0) }}</td>
                <td>{{ formatCurrency(item.actual_data && item.actual_data[month - 1]?.actual_other || 0) }}</td>
              </template>
              <!-- Lũy kế và tỷ lệ -->
              <td>{{ formatCurrency(item.actual_cumulative_total) }}</td>
              <td>{{ item.percent_actual_projected }}</td>
            </tr>
            <tr v-for="(child, childIndex) in item.children" :key="'monthly-child-' + itemIndex + '-' + childIndex">
              <td class="sticky-col sticky-col-0">{{ child.stt || '-' }}</td>
              <td class="sticky-col sticky-col-1 text-left">{{ child.department_name }}</td>
              <td>{{ formatCurrency(child.projected_maintain_total) }}</td>
              <td>{{ formatCurrency(child.projected_new_total) }}</td>
              <td>{{ formatCurrency(child.projected_other_total) }}</td>
              <td>{{ formatCurrency(child.projected_planed_total) }}</td>
              <!-- 12 tháng x 3 cột = 36 cột cho kế hoạch -->
              <template v-for="month in 12" :key="'child-month-' + month">
                <td>{{ formatCurrency(child.projected_data && child.projected_data[month - 1]?.projected_maintain || 0) }}</td>
                <td>{{ formatCurrency(child.projected_data && child.projected_data[month - 1]?.projected_new || 0) }}</td>
                <td>{{ formatCurrency(child.projected_data && child.projected_data[month - 1]?.projected_other || 0) }}</td>
              </template>
              <!-- 12 tháng x 3 cột = 36 cột cho thực hiện -->
              <template v-for="month in 12" :key="'child-actual-month-' + month">
                <td>{{ formatCurrency(child.actual_data && child.actual_data[month - 1]?.actual_maintain || 0) }}</td>
                <td>{{ formatCurrency(child.actual_data && child.actual_data[month - 1]?.actual_new || 0) }}</td>
                <td>{{ formatCurrency(child.actual_data && child.actual_data[month - 1]?.actual_other || 0) }}</td>
              </template>
              <!-- Lũy kế và tỷ lệ -->
              <td>{{ formatCurrency(child.actual_cumulative_total) }}</td>
              <td>{{ child.percent_actual_projected }}</td>
            </tr>
          </template>
          <tr v-if="tableData.length === 0">
            <td colspan="81" class="text-center">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx-js-style';

export default {
  name: "MonthlyPlanTable",
  data() {
    return {
      year: 0,
      tableData: []
    };
  },
  methods: {
    loadData(year, data, dataSum) {
      this.year = year;
      this.tableData = data.concat([])
      this.dataSum = dataSum
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
    ExportExcel() {
      try {
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
        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Kế hoạch hàng tháng');

        // Ghi file
        XLSX.writeFile(wb, `KeHoachHangThang_${this.year}.xlsx`);
        
        this.$toast.success('Xuất Excel thành công!');
      } catch (error) {
        console.error('Lỗi xuất Excel:', error);
        this.$toast.error('Có lỗi xảy ra khi xuất Excel');
      }
    },
  }
};
</script>

<style scoped>
.monthly-plan-table {
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
  min-width: 5000px; 
  font-size: 13px;
  text-align: center;
}

.table-report th,
.table-report td {
  border: 1px solid #ccc;
  padding: 6px 8px;
  white-space: nowrap;
  box-sizing: border-box;
  transform: translateZ(0);
}

.table-report th {
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
.table-report thead .sticky-col-2 { z-index: 13; }

/* Body sticky columns */
tbody .sticky-col {
  background: white;
  z-index: 1;
}
tbody .sticky-col-0 { z-index: 4; }
tbody .sticky-col-1 { z-index: 3; }
tbody .sticky-col-2 { z-index: 2; }

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
}

.sticky-col-2 { 
  left: 310px;
  min-width: 180px;
  width: 180px;
  box-shadow: 1px 0 0 0 #ccc;
}
</style>
