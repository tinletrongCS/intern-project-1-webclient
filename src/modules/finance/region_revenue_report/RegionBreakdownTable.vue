<template>
  <div class="region-breakdown-table">
    <!-- Heading cho bảng -->
    <div class="table-heading text-left">
      <h3>Báo cáo doanh thu địa bàn kế hoạch sản xuất kinh doanh năm {{year}}</h3>
    </div>
    
    <!-- Bảng phân tích doanh thu theo địa bàn -->
    <div class="overflow-auto table-container">
      <table class="table-report">
        <thead>
          <tr>
            <th rowspan="4" class="sticky-col sticky-col-0">STT</th>
            <th rowspan="4" class="sticky-col sticky-col-1">Tên chi tiêu</th>
            <th rowspan="4" class="sticky-col sticky-col-2">Mã lĩnh vực</th>
            <th colspan="3">Kế hoạch năm {{year}}</th>
            <th colspan="4">Thực hiện lũy kế 6T năm {{year}}</th>
            <th colspan="4">Dự kiến thực hiện lũy kế 9T năm {{year}}</th>
            <th colspan="4">Dự kiến thực hiện năm {{year}}</th>
          </tr>
          <tr>
            <th rowspan="3">Địa bàn</th>
            <th colspan="2">Chi tiết</th>
            <th rowspan="3">Địa bàn</th>
            <th colspan="2">Chi tiết</th>
            <th rowspan="2">Tỷ lệ (%) so KH năm</th>
            <th rowspan="3">Địa bàn</th>
            <th colspan="2">Chi tiết</th>
            <th rowspan="2">Tỷ lệ (%) so KH năm</th>
            <th rowspan="3">Địa bàn</th>
            <th colspan="2">Chi tiết</th>
            <th rowspan="2">Tỷ lệ (%) so KH năm</th>
          </tr>
          <tr>
            <th>VNPT TTP</th>
            <th>TTKD Vinaphone</th>
            <th>VNPT TTP</th>
            <th>TTKD Vinaphone</th>
            <th>VNPT TTP</th>
            <th>TTKD Vinaphone</th>
            <th>VNPT TTP</th>
            <th>TTKD Vinaphone</th>
          </tr>
       </thead>
        <tbody>
          <template v-for="(item, itemIndex) in tableData" :key="'item-' + itemIndex">
            <tr class="main-row bold">
              
              
              <td class="sticky-col sticky-col-0">{{ itemIndex + 1 }}</td>
              <td class="sticky-col sticky-col-1 text-left">{{ item.field_revenue_name }}</td>
              <td class="sticky-col sticky-col-2">{{ item.field_revenue_code }}</td>
              <td>{{ formatCurrency(item.planned_total) }}</td>
              <td>{{ formatCurrency(item.planned_total-item.planned_total_ttkd) }}</td>
              <td>{{ formatCurrency(item.planned_total_ttkd) }}</td>

              <td>{{ formatCurrency(item.actual_total_6m) }}</td>
              <td>{{ formatCurrency(item.actual_total_6m-item.actual_total_6m_ttkd) }}</td>
              <td>{{ formatCurrency(item.actual_total_6m_ttkd) }}</td>
              <td>{{formatPercentage(item.actual_total_6m, item.planned_total)}}</td>

              <td>{{ formatCurrency(item.projected_total_9m) }}</td>
              <td>{{ formatCurrency(item.projected_total_9m-item.projected_total_9m_ttkd) }}</td>
              <td>{{ formatCurrency(item.projected_total_9m_ttkd) }}</td>
              <td>{{formatPercentage(item.projected_total_9m, item.planned_total)}}</td>

              <td>{{ formatCurrency(item.projected_total) }}</td>
              <td>{{ formatCurrency(item.projected_total-item.projected_total_ttkd) }}</td>
              <td>{{ formatCurrency(item.projected_total_ttkd) }}</td>
              <td>{{formatPercentage(item.projected_total, item.planned_total)}}</td>
            </tr>
            <tr v-for="(child, childIndex) in item.items" :key="'child-' + itemIndex + '-' + childIndex">
              <td class="sticky-col sticky-col-0">-</td>
              <td class="sticky-col sticky-col-1 text-left">{{ child.item_revenue_name }}</td>
              <td class="sticky-col sticky-col-2">-</td>

              <td>{{ formatCurrency(child.planned_total) }}</td>
              <td>{{ formatCurrency(child.planned_total-child.planned_total_ttkd) }}</td>
              <td>{{ formatCurrency(child.planned_total_ttkd) }}</td>

              <td>{{ formatCurrency(child.actual_total_6m) }}</td>
              <td>{{ formatCurrency(child.actual_total_6m-child.actual_total_6m_ttkd) }}</td>
              <td>{{ formatCurrency(child.actual_total_6m_ttkd) }}</td>
              <td>{{formatPercentage(child.actual_total_6m, child.planned_total)}}</td>

              <td>{{ formatCurrency(child.projected_total_9m) }}</td>
              <td>{{ formatCurrency(child.projected_total_9m-child.projected_total_9m_ttkd) }}</td>
              <td>{{ formatCurrency(child.projected_total_9m_ttkd) }}</td>
              <td>{{formatPercentage(child.projected_total_9m, child.planned_total)}}</td>

              <td>{{ formatCurrency(child.projected_total) }}</td>
              <td>{{ formatCurrency(child.projected_total-child.projected_total_ttkd) }}</td>
              <td>{{ formatCurrency(child.projected_total_ttkd) }}</td>
              <td>{{formatPercentage(child.projected_total, child.planned_total)}}</td>
            </tr>
          </template>
          <tr v-if="tableData.length === 0">
            <td colspan="18" class="text-center">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx-js-style';

export default {
  name: "RegionBreakdownTable",
  props:{
    year:{
      type:Number,
      default:2025
    },
  },
  data() {
    return {
      tableData: [],
      summaryData: null
    };
  },
  methods: {
    loadData(data) {
      this.tableData = data.concat([])
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
        const workbook = XLSX.utils.book_new();

        // Tạo phần tiêu đề bảng và header nhiều dòng
        const headers = [
          [`BÁO CÁO DOANH THU ĐỊA BÀN KẾ HOẠCH SẢN XUẤT KINH DOANH NĂM ${this.year}`],
          [],
          ['STT', 'Tên chi tiêu', 'Mã dịch vụ', 
            `Kế hoạch năm ${this.year}`, '', '', 
            `Thực hiện lũy kế 6T năm ${this.year}`, '', '', '', 
            `Dự kiến lũy kế 9T năm ${this.year}`, '', '', '', 
            `Dự kiến thực hiện năm ${this.year}`, '', '', ''],
          ['', '', '', 'Địa bàn', 'VNPT TTP', 'TTKD Vinaphone', 
            'Địa bàn', 'VNPT TTP', 'TTKD Vinaphone', 'Tỷ lệ (%)', 
            'Địa bàn', 'VNPT TTP', 'TTKD Vinaphone', 'Tỷ lệ (%)', 
            'Địa bàn', 'VNPT TTP', 'TTKD Vinaphone', 'Tỷ lệ (%)'],
        ];

        // Dữ liệu nội dung bảng
        const rows = [];

        this.tableData.forEach((item, index) => {
          rows.push([
            { v: index + 1 },
            { v: item.field_revenue_name },
            { v: item.field_revenue_code },

            { v: item.planned_total, z: '#,##0' },
            { v: item.planned_total - item.planned_total_ttkd, z: '#,##0' },
            { v: item.planned_total_ttkd, z: '#,##0' },

            { v: item.actual_total_6m, z: '#,##0' },
            { v: item.actual_total_6m - item.actual_total_6m_ttkd, z: '#,##0' },
            { v: item.actual_total_6m_ttkd, z: '#,##0' },
            { v: this.formatPercentage(item.actual_total_6m, item.actual_total), t: 's' },

            { v: item.actual_total_9m, z: '#,##0' },
            { v: item.actual_total_9m - item.actual_total_9m_ttkd, z: '#,##0' },
            { v: item.actual_total_9m_ttkd, z: '#,##0' },
            { v: this.formatPercentage(item.actual_total_9m, item.actual_total), t: 's' },

            { v: item.projected_total, z: '#,##0' },
            { v: item.projected_total - item.projected_total_ttkd, z: '#,##0' },
            { v: item.projected_total_ttkd, z: '#,##0' },
            { v: this.formatPercentage(item.projected_total, item.planned_total), t: 's' },
          ]);

          item.items?.forEach(child => {
            rows.push([
              { v: '-' },
              { v: child.item_revenue_name },
              { v: '-' },

              { v: child.planned_total, z: '#,##0' },
              { v: child.planned_total - child.planned_total_ttkd, z: '#,##0' },
              { v: child.planned_total_ttkd, z: '#,##0' },

              { v: child.actual_total_6m, z: '#,##0' },
              { v: child.actual_total_6m - child.actual_total_6m_ttkd, z: '#,##0' },
              { v: child.actual_total_6m_ttkd, z: '#,##0' },
              { v: this.formatPercentage(child.actual_total_6m, child.actual_total), t: 's' },

              { v: child.actual_total_9m, z: '#,##0' },
              { v: child.actual_total_9m - child.actual_total_9m_ttkd, z: '#,##0' },
              { v: child.actual_total_9m_ttkd, z: '#,##0' },
              { v: this.formatPercentage(child.actual_total_9m, child.actual_total), t: 's' },

              { v: child.projected_total, z: '#,##0' },
              { v: child.projected_total - child.projected_total_ttkd, z: '#,##0' },
              { v: child.projected_total_ttkd, z: '#,##0' },
              { v: this.formatPercentage(child.projected_total, child.planned_total), t: 's' },
            ]);
          });
        });

        const data = [...headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Bỏ một số đuôi % nhầm cột
        data.forEach((row, R) => {
          row.forEach((cellValue, C) => {
            const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
            if (!cell) return;

             if (typeof cellValue === 'number') {
              if (cellValue > 0 && cellValue < 1) {
                // Tránh format phần trăm auto nếu không chắc chắn
                cell.z = '#,##0.00'; // Hoặc '#,##0' nếu bạn không muốn số thập phân
              } else {
                cell.z = '#,##0';
              }
            } else if (typeof cellValue === 'string' && cellValue.includes('%')) {
              // Nếu đã là chuỗi có dấu %, không cho Excel format lại
              cell.t = 's'; // dạng string
            }

          });
        });

        // Merge cells
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }, // Tiêu đề
          { s: { r: 2, c: 3 }, e: { r: 2, c: 5 } },  // Kế hoạch
          { s: { r: 2, c: 6 }, e: { r: 2, c: 9 } },  // 6T
          { s: { r: 2, c: 10 }, e: { r: 2, c: 13 } },// 9T
          { s: { r: 2, c: 14 }, e: { r: 2, c: 17 } },// Năm

          { s: { r: 3, c: 0 }, e: { r: 3, c: 0 } },  // STT
          { s: { r: 3, c: 1 }, e: { r: 3, c: 1 } },  // Tên chi tiêu
          { s: { r: 3, c: 2 }, e: { r: 3, c: 2 } }   // Mã dịch vụ
        ];

        // Định dạng style
        const border = this.borderAll();

        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[cellRef] || { t: 's', v: '' };

            cell.s = {
              font: { bold: R < 4 },
              alignment: { horizontal: R < 4 ? 'center' : (C < 3 ? 'left' : 'right'), vertical: 'middle', wrapText: true },
              border
            };

            if (R >= 4 && C >= 3 && typeof cell.v === 'number') {
              cell.z = C % 4 === 3 ? '0.00%' : '#,##0';
            }

            ws[cellRef] = cell;
          }
        }

        // Set column width
        ws['!cols'] = [
          { wch: 6 },   // STT
          { wch: 35 },  // Tên chi tiêu
          { wch: 20 },  // Mã dịch vụ
          ...Array(15).fill({ wch: 16 })
        ];

        XLSX.utils.book_append_sheet(workbook, ws, 'Báo cáo');
        const fileName = `BaoCaoDoanhThuDiaBan_${this.year}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        this.$toast?.success?.('Xuất Excel thành công!');
      } catch (error) {
        console.error(error);
        this.$toast?.error?.('Có lỗi xảy ra khi xuất Excel');
      }
    },
    formatPercentage(numerator, denominator) {
      if (!denominator || denominator === 0) return '0.00%';
      const percent = numerator / denominator;
      return `${(percent * 100).toFixed(2)}%`;
    }
    
  }
};
</script>

<style scoped>
.region-breakdown-table {
  margin-top: 20px;
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
  min-width: 2400px; 
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
  left: calc(60px + 250px);
  min-width: 150px;
  width: 150px; 
}

</style>
