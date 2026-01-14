<template>
  <div class="box-form">

    <!-- ===== TABLE SCROLL ===== -->
    <div class="table-scroll-x">
      <table class="table table-indicator table-wide">
        <thead>
          <!-- ===== ROW PHÂN NHÓM ===== -->
          <tr class="group-header">
            <th
              class="section-header section-common bold"
              colspan="6"
            >
              CHUNG
            </th>

            <th
              class="section-header section-revenue bold"
              colspan="19"
            >
              DOANH THU
            </th>

            <th
              class="section-header section-partner bold"
              colspan="6"
            >
              CHI PHÍ ĐỐI TÁC BÊN NGOÀI
            </th>

            <th
              class="section-header section-factory bold"
              colspan="13"
            >
              CHI PHÍ PHẢI TRẢ FACTORY
            </th>
          </tr>

          <!-- ===== ROW HEADER CỘT (ĐÃ CÓ) ===== -->
          <tr>
            <th class="center">
              <input type="checkbox" v-model="checkAll" @change="onCheckAll" />
            </th>
            <th class="center">STT</th>

            <th>Mã dự án</th>
            <th>Tên khách hàng</th>
            <th>Trạng thái</th>
            <th>Trạng thái hệ số</th>

            <!-- DOANH THU -->
            <th>Loại doanh thu</th>
            <th>Mã số thuế</th>
            <th>Số hợp đồng</th>
            <th>Ngày hợp đồng</th>
            <th>Ngày BBNT</th>
            <th>Ngày KH thanh toán</th>
            <th>Tên SPDV</th>
            <th>Ngày hóa đơn</th>
            <th>Serial</th>
            <th>Số hóa đơn</th>
            <th>Tổng tiền (gồm VAT)</th>
            <th>DT HĐ (chưa VAT)</th>
            <th>VAT</th>
            <th>Thuế suất (%)</th>
            <th>Chứng từ thanh toán</th>
            <th>Kỳ dữ liệu</th>
            <th>Nội dung dịch vụ</th>
            <th>Hệ số dịch vụ (%)</th>
            <th>Doanh thu tính lương</th>

            <!-- ĐỐI TÁC -->
            <th>Nội dung CP</th>
            <th>Loại chi phí</th>
            <th>Tên đối tác</th>
            <th>Số HĐ</th>
            <th>Ngày HĐ</th>
            <th>Ngày BBNT</th>

            <!-- FACTORY -->
            <th>Nội dung CP</th>
            <th>Đơn đặt hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Ngày BBNT</th>
            <th>Nội dung DV</th>
            <th>Ngày hóa đơn</th>
            <th>Serial</th>
            <th>Số hóa đơn</th>
            <th>Tổng tiền</th>
            <th>Chi phí</th>
            <th>VAT</th>
            <th>Thuế suất</th>
            <th>Tháng bù trừ B11</th>
            
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in pagedData"
            :key="row.project_123_id || index"
          >
            <td class="center">
              <input
                type="checkbox"
                v-model="row.checked"
                @change="onCheckRow"
              />
            </td>

            <td class="center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>

            <!-- ===== CHUNG ===== -->
            
            <td> 
              <a
                href="javascript:void(0)"
                class="project-link"
                @click.prevent="onClickProject(row)"
                :title="'Xem chi tiết dự án ' + row.project_123_code"
              >
                {{ row.project_123_code }}
              </a>
            </td>

            <td>{{ row.customer_name }}</td>
            
            <td class="center">
              <span
                class="badge"
                :class="badgeProjectStatus(row.project_status)"
              >
                {{ row.project_status_name }}
              </span>
            </td>
            <td class="center">
              <span
                class="badge"
                :class="badgeCoefficientStatus(row.coefficient_status)"
              >
                {{ row.coefficient_status_name }}
              </span>
            </td>

            <!-- ===== DOANH THU ===== -->
            <td>{{ row.revenue_type_name }}</td>
            <td>{{ row.tax_code }}</td>
            <td>{{ row.contract_no }}</td>
            <td>{{ row.contract_date }}</td>
            <td>{{ row.bbnt_date }}</td>
            <td>{{ row.customer_payment_date }}</td>
            <td>{{ row.product_name }}</td>
            <td>{{ row.invoice_date }}</td>
            <td>{{ row.serial }}</td>
            <td>{{ row.invoice_no }}</td>
            <td style="text-align: right;">{{ format(row.total_amount) }}</td>
            <td style="text-align: right;">{{ format(row.contract_revenue) }}</td>
            <td style="text-align: right;">{{ format(row.vat_amount) }}</td>
            <td style="text-align: right;">{{ row.vat_rate_name }}</td>
            <td>{{ row.payment_doc }}</td>
            <td>{{ row.period }}</td>
            <td>{{ row.service_content }}</td>
            <td style="text-align: center;">{{ row.service_rate }}</td>
            <td style="text-align: right;">{{ format(row.salary_revenue) }}</td>

            <!-- ===== ĐỐI TÁC ===== -->
            <td>{{ row.partner_cost_content_name }}</td>
            <td>{{ row.cost_type }}</td>
            <td>{{ row.partner_name }}</td>
            <td>{{ row.partner_contract_no }}</td>
            <td>{{ row.partner_contract_date }}</td>
            <td>{{ row.partner_bbnt_date }}</td>

            <!-- ===== FACTORY ===== -->
            <td>{{ row.factory_cost_content_name }}</td>
            <td>{{ row.order_no }}</td>
            <td>{{ row.order_date }}</td>
            <td>{{ row.factory_bbnt_date }}</td>
            <td>{{ row.factory_service_content }}</td>
            <td>{{ row.factory_invoice_date }}</td>
            <td>{{ row.factory_serial }}</td>
            <td>{{ row.factory_invoice_no }}</td>
            <td style="text-align: right;">{{ format(row.factory_total_amount) }}</td>
            <td style="text-align: right;">{{ format(row.factory_cost_amount) }}</td>
            <td style="text-align: right;">{{ format(row.factory_vat_amount) }}</td>
            <td style="text-align: center;">{{ row.factory_vat_rate_name }}</td>
            <td>{{ row.factory_period }}</td>
          </tr>

          <tr v-if="pagedData.length === 0">
            <td colspan="45" class="center text-muted">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-container" v-if="localData.length > 0">
      <div class="pagination-wrapper">
        <button
          class="page-btn nav"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ‹
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ active: p === currentPage }"
          @click="currentPage = p"
        >
          {{ p }}
        </button>

        <button
          class="page-btn nav"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          ›
        </button>
      </div>

      <div class="record-info">
        Hiển thị
        <b>{{ recordInfo.from }}</b> –
        <b>{{ recordInfo.to }}</b>
        trên tổng
        <b>{{ recordInfo.total }}</b> bản ghi
      </div>
    </div>

  </div>
</template>
<script>
import * as XLSX from 'xlsx-js-style'
export default {
  name: 'Contract447Table',

  props: {
    data: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 10 }
  },

  data() {
    return {
      currentPage: 1,
      checkAll: false,
      localData: []
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.localData.length / this.pageSize)
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.localData.slice(start, start + this.pageSize)
    },
    recordInfo() {
      const total = this.localData.length
      if (!total) return { from: 0, to: 0, total: 0 }

      const from = (this.currentPage - 1) * this.pageSize + 1
      const to = Math.min(this.currentPage * this.pageSize, total)
      return { from, to, total }
    }
  },

  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        this.localData = (val || []).map(x => ({
          ...x,
          checked: false
        }))
        this.checkAll = false
        this.currentPage = 1
      }
    },
    pageSize() {
      this.currentPage = 1
    }
  },

  methods: {
    onCheckAll() {
      this.localData.forEach(r => (r.checked = this.checkAll))
      this.emitSelection()
    },
    onCheckRow() {
      this.checkAll =
        this.localData.length &&
        this.localData.every(r => r.checked)
      this.emitSelection()
    },
    emitSelection() {
      this.$emit(
        'selection-change',
        this.localData.filter(r => r.checked)
      )
    },
    onClickProject(row){
       this.$emit(
        'onClickProject',
        row
      )
    },
    format(val) {
      if (val == null || val === '') return ''
      return Number(val).toLocaleString('vi-VN')
    },
    badgeProjectStatus(status) {
      return {
        'badge-gray': status == 1,     // Chờ xác nhận
        'badge-blue': status == 2,    // Đã xác nhận dữ liệu
        'badge-yellow': status == 3,   // Đã hoàn trả
        'badge-green': status == 4     // Đã kiểm tra dữ liệu
      }
    },
    badgeCoefficientStatus(status) {
      return {
        'badge-gray': status == 5, // Chưa xác nhận hệ số
        'badge-green': status == 6  // Đã xác nhận hệ số
      }
    },
    exportExcel() {
      const data = this.localData || []
      if (!data.length) {
        this.$toast?.warning?.('Không có dữ liệu để xuất')
        return
      }

      /* ================= HEADER CONFIG ================= */
      const HEADER_GROUP = [
        { text: 'CHUNG', col: 5, bg: 'E5E7EB' },
        { text: 'DOANH THU', col: 19, bg: 'DBEAFE' },
        { text: 'CHI PHÍ ĐỐI TÁC BÊN NGOÀI', col: 6, bg: 'FFEDD5' },
        { text: 'CHI PHÍ PHẢI TRẢ FACTORY', col: 13, bg: 'E0E7FF' }
      ]

      const HEADER_COLUMNS = [
        'STT','Mã dự án','Tên khách hàng','Trạng thái','Trạng thái hệ số',
        'Loại doanh thu','Mã số thuế','Số hợp đồng','Ngày hợp đồng','Ngày BBNT',
        'Ngày KH thanh toán','Tên SPDV','Ngày hóa đơn','Serial','Số hóa đơn',
        'Tổng tiền (gồm VAT)','DT HĐ (chưa VAT)','VAT','Thuế suất (%)',
        'Chứng từ thanh toán','Kỳ dữ liệu','Nội dung dịch vụ',
        'Hệ số dịch vụ (%)','Doanh thu tính lương',
        'Nội dung CP','Loại chi phí','Tên đối tác','Số HĐ','Ngày HĐ','Ngày BBNT',
        'Nội dung CP','Đơn đặt hàng','Ngày đặt hàng','Ngày BBNT',
        'Nội dung DV','Ngày hóa đơn','Serial','Số hóa đơn',
        'Tổng tiền','Chi phí','VAT','Thuế suất','Tháng bù trừ B11'
      ]

      const wsData = []

      /* ================= ROW 1: GROUP HEADER ================= */
      const groupRow = []
      HEADER_GROUP.forEach(g => {
        groupRow.push(g.text)
        for (let i = 1; i < g.col; i++) groupRow.push('')
      })
      wsData.push(groupRow)

      /* ================= ROW 2: COLUMN HEADER ================= */
      wsData.push(HEADER_COLUMNS)

      /* ================= DATA ================= */
      data.forEach((r, i) => {
        wsData.push([
          i + 1,
          r.project_123_code || '',
          r.customer_name || '',
          r.project_status_name || '',
          r.coefficient_status_name || '',
          r.revenue_type_name || '',
          r.tax_code || '',
          r.contract_no || '',
          r.contract_date || '',
          r.bbnt_date || '',
          r.customer_payment_date || '',
          r.product_name || '',
          r.invoice_date || '',
          r.serial || '',
          r.invoice_no || '',
          r.total_amount ?? '',
          r.contract_revenue ?? '',
          r.vat_amount ?? '',
          r.vat_rate_name || '',
          r.payment_doc || '',
          r.period || '',
          r.service_content || '',
          r.service_rate ?? '',
          r.salary_revenue ?? '',
          r.partner_cost_content_name || '',
          r.cost_type || '',
          r.partner_name || '',
          r.partner_contract_no || '',
          r.partner_contract_date || '',
          r.partner_bbnt_date || '',
          r.factory_cost_content_name || '',
          r.order_no || '',
          r.order_date || '',
          r.factory_bbnt_date || '',
          r.factory_service_content || '',
          r.factory_invoice_date || '',
          r.factory_serial || '',
          r.factory_invoice_no || '',
          r.factory_total_amount ?? '',
          r.factory_cost_amount ?? '',
          r.factory_vat_amount ?? '',
          r.factory_vat_rate_name || '',
          r.factory_period || ''
        ])
      })

      const ws = XLSX.utils.aoa_to_sheet(wsData)

      /* ================= MERGE GROUP HEADER ================= */
      ws['!merges'] = []
      let colIndex = 0
      HEADER_GROUP.forEach(g => {
        ws['!merges'].push({
          s: { r: 0, c: colIndex },
          e: { r: 0, c: colIndex + g.col - 1 }
        })
        colIndex += g.col
      })

      /* ================= STYLES ================= */
      const borderAll = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }

      /* GROUP HEADER STYLE */
      colIndex = 0
      HEADER_GROUP.forEach(g => {
        for (let c = colIndex; c < colIndex + g.col; c++) {
          const cell = XLSX.utils.encode_cell({ r: 0, c })
          ws[cell].s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' },
            fill: { fgColor: { rgb: g.bg } },
            border: borderAll
          }
        }
        colIndex += g.col
      })

      /* COLUMN HEADER STYLE */
      HEADER_COLUMNS.forEach((_, c) => {
        const cell = XLSX.utils.encode_cell({ r: 1, c })
        ws[cell].s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          fill: { fgColor: { rgb: 'F3F4F6' } },
          border: borderAll
        }
      })

      /* DATA STYLE */
      for (let r = 2; r < wsData.length; r++) {
        for (let c = 0; c < HEADER_COLUMNS.length; c++) {
          const cell = XLSX.utils.encode_cell({ r, c })
          if (!ws[cell]) continue
          ws[cell].s = {
            alignment: {
              horizontal: c >= 13 ? 'right' : 'left',
              vertical: 'center'
            },
            border: borderAll
          }
        }
      }

      /* ================= FREEZE + WIDTH ================= */
      ws['!freeze'] = { xSplit: 0, ySplit: 2 }
      ws['!cols'] = HEADER_COLUMNS.map(() => ({ wch: 18 }))

      /* ================= EXPORT ================= */
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Project_447')

      XLSX.writeFile(
        wb,
        `Danh_sach_du_an_447_${new Date().toISOString().slice(0,10)}.xlsx`
      )
    }


  }
}
</script>
<style scoped>
.table-scroll-x .table th,
.table-scroll-x .table td {
  vertical-align: middle !important;
}
.table-scroll-x .table th{
  text-align: center;
}
/* ===== SCROLL ===== */
.table-scroll-x {
  overflow-x: auto;
  max-width: 100%;
}

/* ===== TABLE ===== */
.table-wide {
  min-width: 2600px;
}

.table-indicator {
  width: 100%;
  border-collapse: collapse;
}

.table-indicator th,
.table-indicator td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 13px;
  white-space: nowrap;
}

.table-indicator thead th {
  background: #f8fafc;
  font-weight: 600;
}

/* ===== ALIGN ===== */
.center { text-align: center }
.right { text-align: right }
.link { color: #2563eb; cursor: pointer }

.note {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== BADGE ===== */
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.badge-green { background: #dcfce7; color: #15803d }
.badge-gray { background: #f1f5f9; color: #64748b }

/* 🟡 Hoàn trả */
.badge-yellow {
  background: #fef3c7;   /* vàng nhạt */
  color: #92400e;        /* nâu vàng đậm */
}

/* 🔴 Hủy */
.badge-red {
  background: #fee2e2;   /* đỏ nhạt */
  color: #991b1b;        /* đỏ đậm */
}
.badge-blue {
  background: #e0f2fe;
  color: #0369a1;
}

/* 🟠 Chưa xác nhận hệ số */
.badge-orange {
  background: #ffedd5;
  color: #9a3412;
}

/* 🟣 Đã xác nhận hệ số */
.badge-purple {
  background: #ede9fe;
  color: #5b21b6;
}

/* ===== PAGINATION (FIX) ===== */
/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
}

.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
}

.page-btn.nav {
  font-size: 16px;
  padding: 4px 12px;
}

.page-btn:disabled {
  background: #f9fafb;
  color: #9ca3af;
  border-color: #e5e7eb;
  cursor: not-allowed;
}
.file-icon {
  font-size: 16px;
  color: #2563eb; /* xanh */
}

.file-icon.clickable {
  cursor: pointer;
}

.file-icon.clickable:hover {
  color: #1d4ed8;
  transform: scale(1.1);
}
/* ===== CHECKBOX TO ===== */
.table-indicator input[type="checkbox"] {
  transform: scale(1.3);        /* tăng size */
  cursor: pointer;
}

/* căn giữa đẹp hơn */
.table-indicator td.center input[type="checkbox"],
.table-indicator th.center input[type="checkbox"] {
  margin: 0;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

/* record info bên trái */
.record-info {
  font-size: 13px;
  color: #374151;
  text-align: right; 
}

.record-info b {
  font-weight: 600;
}

/* ===== GROUP HEADER ===== */
.group-header th {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  padding: 6px 8px;
}

/* ===== CHUNG ===== */
.section-common {
  background: #f1f5f9;
  border-bottom: 2px solid rgba(148, 163, 184, 0.4);
}

/* ===== DOANH THU ===== */
.section-revenue {
  background: #eff6ff;
  color: #2563eb;
  border-bottom: 2px solid rgba(37, 99, 235, 0.4);
}

/* ===== ĐỐI TÁC ===== */
.section-partner {
  background: #fff7ed;
  color: #ea580c;
  border-bottom: 2px solid rgba(234, 88, 12, 0.4);
}

/* ===== FACTORY ===== */
.section-factory {
  background: #eef2ff;
  color: #4f46e5;
  border-bottom: 2px solid rgba(79, 70, 229, 0.4);
}

</style>
