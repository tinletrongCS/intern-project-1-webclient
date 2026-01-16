<template>
  <div class="box-form">

    <!-- TITLE -->
    <div class="info-row bold mb-2">
      {{ title }}
    </div>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table table-bordered capability-table">
        <thead>
          <tr>
            <th style="width:50px" class="text-center">
              <input
                type="checkbox"
                :checked="isAllChecked"
                @change="toggleAll"
              />
            </th>
            <th style="width:80px">STT</th>
            <th>Yêu cầu kiến thức</th>
            <th style="width:90px">Bắt buộc</th>
            <th>Cách đo lường</th>
            <th style="width:160px">Giá trị hợp đồng</th>
            <th style="width:140px">HĐ nghiệm thu</th>
            <th style="width:120px">Điểm tích lũy</th>

            <th style="width:140px">Trạng thái</th>
          </tr>
        </thead>
        
        <tbody>
          <template v-for="row in pagedRows" :key="row._key">

            <!-- ===== LEVEL 1 ===== -->
            <tr v-if="row.level == 1" class="row-lv1">
              <td class="text-center">
                <input
                  type="checkbox"
                  :checked="isGroupChecked(row)"
                  :indeterminate.prop="isGroupIndeterminate(row)"
                  @change="toggleGroup(row)"
                />
              </td>
              <td class="text-center">{{ row.stt }}</td>
              <td colspan="7">
                {{ row.name }}
              </td>
            </tr>

            <!-- ===== LEVEL 2 ===== -->
            <tr v-else-if="row.level == 2" class="row-lv2">
              <td class="text-center">
                <input
                  type="checkbox"
                  :checked="isGroupChecked(row)"
                  :indeterminate.prop="isGroupIndeterminate(row)"
                  @change="toggleGroup(row)"
                />
              </td>
              <td class="text-center" style="padding-left: 9px !important;">{{ row.stt }}</td>
              <td colspan="7">
                {{ row.name }}
              </td>
            </tr>

            <!-- ===== LEVEL 3 ===== -->
            <tr v-else class="row-lv3">
              <td class="text-center">
                <input
                  type="checkbox"
                  v-model="checkedMap[row._key]"
                  @change="emitChecked"
                />
              </td>
              <td class="text-center">
                {{ row.stt }}
              </td>
              <td>
                <span class="tag">{{ row.name }}</span>
              </td>
              <td class="text-center">
                <span v-if="row.required">✔</span>
              </td>
              <td style="white-space: pre-line">
                {{ row.measure }}
              </td>
              <td>
                <span class="money" v-if="row.amount != null">
                  {{ formatMoney(row.amount) }}
                </span>
              </td>
              <td class="text-center">
                <input class="checkbox-readonly" type="checkbox" :checked="row.accepted" />
              </td>
              <td class="text-center">
                {{ row.score }}
              </td>
              <td class="text-center">
                <span
                  class="status-tag"
                  :class="statusClass(row.evaluationStatusName)"
                >
                  {{ row.evaluationStatusName || 'Chưa tạo' }}
                </span>
              </td>
            </tr>

          </template>

          <tr v-if="dataSource.length === 0">
            <td colspan="9" class="text-center text-muted">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="pagination-wrapper" v-if="dataSource.length > 0">
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

  </div>
</template>

<script>
import * as XLSX from 'xlsx'
export default {
  name: 'CapabilityTable',
  props: {
    title: {
      type: String,
      default: 'DANH SÁCH KHUNG NĂNG LỰC CHỜ THẨM ĐỊNH'
    },
    dataSource: {
      type: Array,
      required: true
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      checkedMap: {},
      currentPage: 1
    }
  },
  computed: {
    /* ===== Flatten tree + STT phân cấp ===== */
    flatRows() {
      const rows = []
      let lv1Index = 0

      this.dataSource.forEach(group => {
        lv1Index++
        const lv1Stt = String.fromCharCode(64 + lv1Index) // A, B, C
        const lv1Key = `g-${group.service_group_id}`

        rows.push({
          level: 1,
          _key: lv1Key,
          stt: lv1Stt,
          name: group.service_group_name
        })

        let lv2Index = 0
        group.children?.forEach(type => {
          lv2Index++
          const lv2Stt = `${lv1Stt}.${lv2Index}`
          const lv2Key = `${lv1Key}-t-${type.service_type_id}`

          rows.push({
            level: 2,
            _key: lv2Key,
            stt: lv2Stt,
            name: type.service_type_name
          })

          let lv3Index = 0
          type.children?.forEach(service => {
            lv3Index++
            rows.push({
              level: 3,
              _key: `${lv2Key}-s-${service.indicator_config_id}`,
              stt: `${lv2Stt}.${lv3Index}`,

              name: service.service_name,
              required: service.is_required,
              measure: service.measure,
              amount: service.contract_value,

              //accepted: service.has_acceptance_us,
              accepted: service.has_acceptance,

              score: service.total_point,
              evaluationStatusName: service.evaluation_status_name,
              raw: service
            })
          })
        })
      })

      return rows
    },

    leafRows() {
      return this.flatRows.filter(r => r.level == 3)
    },

    totalPages() {
      return Math.ceil(this.flatRows.length / this.pageSize)
    },

    pagedRows() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.flatRows.slice(start, start + this.pageSize)
    },

    isAllChecked() {
      return (
        this.leafRows.length > 0 &&
        this.leafRows.every(r => this.checkedMap[r._key])
      )
    },
    


  },
  methods: {
    toggleAll(e) {
      const checked = e.target.checked
      this.leafRows.forEach(r => {
        this.checkedMap[r._key] = checked
      })
      this.emitChecked()
    },
    statusClass(status) {
      switch (status) {
        case 'Đã thẩm định':
          return 'status-approved'
        case 'Chờ thẩm định':
          return 'status-pending'
        case 'Từ chối':
          return 'status-rejected'
        default:
          return 'status-empty'
      }
    },
    toggleGroup(row) {
      const children = this.leafRows.filter(r =>
        r._key.startsWith(row._key)
      )

      const checked = !children.every(r => this.checkedMap[r._key])
      children.forEach(r => {
        this.checkedMap[r._key] = checked
      })

      this.emitChecked()
    },

    isGroupChecked(row) {
      const children = this.leafRows.filter(r =>
        r._key.startsWith(row._key)
      )
      return (
        children.length > 0 &&
        children.every(r => this.checkedMap[r._key])
      )
    },

    isGroupIndeterminate(row) {
      const children = this.leafRows.filter(r =>
        r._key.startsWith(row._key)
      )
      const checkedCount = children.filter(
        r => this.checkedMap[r._key]
      ).length
      return checkedCount > 0 && checkedCount < children.length
    },

    emitChecked() {
      const selected = this.leafRows
        .filter(r => this.checkedMap[r._key])
        .map(r => r.raw)

      this.$emit('selection-change', selected.concat([]))
    },

    formatMoney(val) {
      return Number(val).toLocaleString('vi-VN')
    },
    exportExcel() {
      if (!this.leafRows || this.leafRows.length === 0) {
        this.$toast?.error('Không có dữ liệu để xuất Excel')
        return
      }

      // ================= HEADER =================
      const header = [
        'STT',
        'Dịch vụ',
        'Giá trị hợp đồng',
        'Hợp đồng đã nghiệm thu'
      ]

      // ================= WORKSHEET =================
      const ws = {}

      // ----- Write header -----
      header.forEach((text, c) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c })
        ws[cellRef] = {
          v: text,
          t: 's'
        }
      })

      // ================= DATA =================
      this.leafRows.forEach((row, r) => {
        // normalize score: "1,2" -> 1.2 -> Number
        let scoreValue = ''
        if (row.score !== null && row.score !== undefined && row.score !== '') {
          if (typeof row.score === 'string') {
            scoreValue = Number(row.score.replace(',', '.'))
          } else {
            scoreValue = Number(row.score)
          }
          if (isNaN(scoreValue)) scoreValue = ''
        }

        const dataRow = [
          r + 1, // STT
          row.name || '',
          row.amount != null ? Number(row.amount) : '',
          row.accepted ? 'X' : ''
        ]

        dataRow.forEach((value, c) => {
          const cellRef = XLSX.utils.encode_cell({ r: r + 1, c })

          // ---- Money column ----
          if (c === 3 && value !== '' && !isNaN(value)) {
            ws[cellRef] = {
              v: Number(value),
              t: 'n',
              z: '#,##0'
            }
            return
          }

          // ---- Score column (DECIMAL) ----
          if (c === 5 && value !== '' && !isNaN(value)) {
            ws[cellRef] = {
              v: Number(value),
              t: 'n',
              z: '0.0'
            }
            return
          }

          // ---- Default ----
          ws[cellRef] = {
            v: value,
            t: typeof value === 'number' ? 'n' : 's'
          }
        })
      })

      // ================= RANGE =================
      ws['!ref'] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: this.leafRows.length, c: header.length - 1 }
      })

      // ================= COLUMN WIDTH =================
      ws['!cols'] = [
        { wch: 6 },   // STT
        { wch: 32 },  // Dịch vụ
        { wch: 18 },  // Giá trị hợp đồng
        { wch: 26 },  // HĐ nghiệm thu
      ]

      // ================= FREEZE HEADER =================
      ws['!freeze'] = { xSplit: 0, ySplit: 1 }

      // ================= WORKBOOK =================
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách năng lực')

      // ================= EXPORT =================
      const today = new Date().toISOString().slice(0, 10)
      XLSX.writeFile(wb, `Danh_sach_nang_luc_${today}.xlsx`)
    }
  },
  watch: {
    dataSource() {
      this.currentPage = 1
      this.checkedMap = {}
    }
  }
}
</script>

<style scoped>
.capability-table th {
  background: #f5f7fa;
  text-align: center;
  font-size: 13px;
}

.capability-table td {
  font-size: 13px;
  vertical-align: middle;
}

.row-lv1 td {
  background: #fafafa;
  font-weight: bold;
}

.row-lv2 td {
  background: #fcfcfc;
  font-weight: 600;
  /* padding-left: 20px; */
}

.row-lv3 td {
  padding-left: 10px;
}

.tag {
  background: #e6f0ff;
  padding: 4px 10px;
  border-radius: 20px;
}

.money {
  background: #fff4cc;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
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
.status-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-approved {
  background: #dcfce7;
  color: #166534;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.status-empty {
  background: #f3f4f6;
  color: #6b7280;
}
.capability-table input[type="checkbox"] {
  transform: scale(1.1);   /* 1.2 – 1.4 tuỳ mắt */
  transform-origin: center;
  cursor: pointer;
}
/* Checkbox chỉ xem – không bị xám */
.checkbox-readonly {
  pointer-events: none;      /* không cho click */
  opacity: 1;                /* không bị mờ */
  accent-color: #2563eb;     /* xanh rõ */
  cursor: default;
  transform: scale(1.1);
}
.capability-table td:nth-child(6) {
  text-align: right;
}
</style>
