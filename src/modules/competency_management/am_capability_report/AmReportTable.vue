<template>
  <div class="am-report-table card">

    <table class="table">
      <thead>
        <tr>
          <th>ĐƠN VỊ</th>
          <th>TÊN NHÂN VIÊN</th>
          <th class="center">ĐIỂM KHỞI ĐẦU</th>
          <th class="center">ĐIỂM CHUYÊN NGHIỆP</th>
          <th class="center">TỔNG ĐIỂM</th>
          <th>TỔNG DỊCH VỤ</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in pagedData" :key="index">
          <!-- Đơn vị -->
          <td>
            <span class="unit-tag" :class="row.unitClass">
              {{ row.unit }}
            </span>
          </td>

          <!-- Nhân viên -->
          <td class="user">
            <div class="user-tags">
              <img
                v-if="!row.loadImageError && hasAvatar(row)"
                :src="getAvatarUrl(row)"
                :title="row.name"
                class="avatar-image"
                @error="row.loadImageError = true"
              />
              <span
                v-else
                class="initial"
                :title="row.name"
              >
                {{ row.prefix_name }}
              </span>
            </div>

            <span class="user-name">
              {{ row.name }}
            </span>
          </td>

          <!-- Điểm -->
          <td class="center">{{ row.startPoint }}</td>
          <td class="center">{{ row.proPoint }}</td>
          <td class="center bold">{{ row.totalPoint }}</td>

          <!-- Tổng dịch vụ -->
          <td>
            <div class="service-cell">
              <div class="progress">
                <span
                  :class="row.serviceColor"
                  :style="{ width: row.servicePercent + '%' }"
                ></span>
              </div>
              <span class="service-value">
                {{ row.serviceCount }}
              </span>
            </div>
          </td>
        </tr>

        <!-- Empty -->
        <tr v-if="pagedData.length === 0">
          <td colspan="6" class="empty">
            Không có dữ liệu
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination" v-if="data.length > 0">
      <span>
        Hiển thị {{ startItem }}–{{ endItem }} của {{ data.length }} kết quả
      </span>

      <div class="pager">
        <button
          :disabled="currentPage == 1"
          @click="currentPage--"
        >
          ‹
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          :class="{ active: p == currentPage }"
          @click="currentPage = p"
        >
          {{ p }}
        </button>

        <button
          :disabled="currentPage == totalPages"
          @click="currentPage++"
        >
          ›
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import * as XLSX from 'xlsx'
export default {
  name: 'AmReportTable',

  props: {
    data: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },

  data() {
    return {
      currentPage: 1
    }
  },

  computed: {
    sourceData() {
      return this.data && this.data.length > 0
        ? this.data
        : []
    },
    totalPages() {
      return Math.ceil(this.sourceData.length / this.pageSize)
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.sourceData.slice(start, start + this.pageSize)
    },
    startItem() {
      return (this.currentPage - 1) * this.pageSize + 1
    },
    endItem() {
      return Math.min(
        this.currentPage * this.pageSize,
        this.sourceData.length
      )
    },
    
  },
  methods:{
    hasAvatar(row) {
      return row.avatar && row.avatar.trim() !== ''
    },
    getAvatarUrl(row) {
      return `${import.meta.env.VNPT_API}/user/Account/ImageView/${row.avatar}`
    },
    exportExcel () {
      if (!this.data || this.data.length === 0) {
        this.$toast?.error('Không có dữ liệu để xuất Excel')
        return
      }

      /* ===== HEADER ===== */
      const header = [
        'STT',
        'Đơn vị',
        'Tên nhân viên',
        'Điểm khởi đầu',
        'Điểm chuyên nghiệp',
        'Tổng điểm',
        'Số dịch vụ',
        'Tổng dịch vụ',
        'Tỷ lệ (%)'
      ]

      /* ===== DATA ===== */
      const rows = this.data.map((row, index) => [
        index + 1,
        row.unit,
        row.name,
        row.startPoint ?? 0,
        row.proPoint ?? 0,
        row.totalPoint ?? 0,
        row.serviceCount ?? 0,
        row.totalService ?? 0,
        row.servicePercent ?? 0
      ])

      /* ===== CREATE SHEET ===== */
      const ws = XLSX.utils.aoa_to_sheet([header, ...rows])

      /* ===== FORMAT COLUMN WIDTH ===== */
      ws['!cols'] = [
        { wch: 6 },   // STT
        { wch: 25 },  // Đơn vị
        { wch: 25 },  // Tên
        { wch: 16 },  // Start
        { wch: 18 },  // Pro
        { wch: 14 },  // Total
        { wch: 14 },  // Service
        { wch: 16 },  // Total Service
        { wch: 12 }   // %
      ]

      /* ===== CREATE WORKBOOK ===== */
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo năng lực AM')

      /* ===== EXPORT ===== */
      XLSX.writeFile(
        wb,
        `Bao_cao_nang_luc_AM_${new Date().toISOString().slice(0,10)}.xlsx`
      )
    }
  },
  watch: {
    data() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
/* ===== CARD ===== */
.am-report-table {
  background: #fff;
  border-radius: 4px;
  padding: 12px;
}
.am-report-table.table th,
.am-report-table .table td {
  vertical-align: middle !important;
  border-top: 0px solid #dee2e6;
}
/* ===== TABLE ===== */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.center {
  text-align: center;
}

.bold {
  font-weight: 600;
}

.empty {
  text-align: center;
  color: #94a3b8;
}

/* ===== USER ===== */
.user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* ===== UNIT TAG ===== */
.unit-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.unit-tag.blue {
  background: #e0e7ff;
  color: #1d4ed8;
}

.unit-tag.purple {
  background: #ede9fe;
  color: #6d28d9;
}

.unit-tag.green {
  background: #dcfce7;
  color: #15803d;
}

/* ===== SERVICE ===== */
.service-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress {
  width: 120px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 6px;
  position: relative;
}

.progress span {
  position: absolute;
  height: 100%;
  border-radius: 6px;
}

.progress .blue {
  background: #2563eb;
}

.progress .orange {
  background: #f59e0b;
}

.progress .red {
  background: #ef4444;
}

.service-value {
  font-size: 13px;
  color: #475569;
}

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
}

.pager button {
  margin-left: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}

.pager button.active {
  background: #2563eb;
  color: #fff;
}

.pager button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== AVATAR ===== */
.user-tags {
  display: flex;
  align-items: center;
}

.avatar-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;

  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

/* fallback chữ cái */
.initial {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
  font-size: 13px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  margin-left: 8px;
}
</style>
