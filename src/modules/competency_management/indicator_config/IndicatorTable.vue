<template>
  <div class="box-form">

    <div class="table-responsive">
      <table class="table table-indicator">
        <thead>
          <tr>
            <th rowspan="2" class="center">
              <input
                type="checkbox"
                v-model="checkAll"
                @change="onCheckAll"
              />
            </th>
            <th rowspan="2" class="center">STT</th>
            <th rowspan="2"  class="center">Yêu cầu kiến thức</th>
            <th rowspan="2" class="center">Bắt buộc</th>
            <th rowspan="2"  class="center">Đối tượng</th>
            <th colspan="4" class="center">Đánh giá</th>
          </tr>

          <tr>
            <th class="center bg-start">Khởi đầu</th>
            <th class="center bg-start">Điểm tích luỹ</th>
            <th class="center bg-pro">Chuyên nghiệp</th>
            <th class="center bg-pro">Điểm tích luỹ</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in pagedData"
            :key="row.indicator_config_id || index"
          >
            <!-- Checkbox -->
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

            <td>
              <span class="badge badge-blue">
                {{ row.service_name }}
              </span>
            </td>

            <td class="center">
              <i
                v-if="row.is_required"
                class="fa fa-check text-success"
              ></i>
            </td>

            <td>{{ row.object_names }}</td>

            <td>
              <span
                v-if="row.has_acceptance"
                class="badge badge-light-blue"
              >
                Có hợp đồng nghiệm thu
              </span>
              <span v-else class="badge badge-light-blue">
                 ≤{{ formatDot(row.start_condition) }}
              </span>
            </td>

            <td class="center">
              {{ row.has_acceptance ? row.acceptance_point : row.start_point }}
            </td>

            <td>
              <span
                class="badge"
                :class="row.has_acceptance
                  ? 'badge-gray'
                  : 'badge-light-green'"
              >
                {{ row.has_acceptance ? 'Không áp dụng' : `&gt;${formatDot(row.pro_condition)}`  }}
              </span>
            </td>

            <td
              class="center"
              :class="row.pro_point > 0 ? 'text-success' : ''"
            >
              {{ row.has_acceptance ? 0 : row.pro_point }}
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="pagedData.length === 0">
            <td colspan="9" class="center text-muted">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-wrapper" v-if="localData.length > 0">
      <button
        class="page-btn nav"
        :disabled="currentPage == 1"
        @click="currentPage--"
      >
        ‹
      </button>

      <button
        v-for="p in totalPages"
        :key="p"
        class="page-btn"
        :class="{ active: p == currentPage }"
        @click="currentPage = p"
      >
        {{ p }}
      </button>

      <button
        class="page-btn nav"
        :disabled="currentPage == totalPages"
        @click="currentPage++"
      >
        ›
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'IndicatorTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 20   // 👈 20 record / page
    }
  },
  data() {
    return {
      checkAll: false,
      localData: [],
      currentPage: 1
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.localData.length / this.pageSize)
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.localData.slice(start, start + this.pageSize)
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        this.localData = (val || []).map(item => ({
          ...item,
          checked: false
        }))
        this.checkAll = false
        this.currentPage = 1
      }
    }
  },
  methods: {
    onCheckAll() {
      this.localData.forEach(row => {
        row.checked = this.checkAll
      })
      this.emitSelection()
    },
    formatDot(val) {
      if (val == null) return ''
      return Number(val).toLocaleString('vi-VN')
    },
    onCheckRow() {
      this.checkAll =
        this.localData.length > 0 &&
        this.localData.every(r => r.checked)
      this.emitSelection()
    },
    emitSelection() {
      const selectedRows = this.localData.filter(r => r.checked)
      this.$emit('selection-change', selectedRows)
    }
  }
}
</script>

<style scoped>
.table-indicator th,
.table-indicator td {
  vertical-align: middle;
  font-size: 13px;
}

.center {
  text-align: center;
}

.badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

.badge-blue {
  background: #e7f0ff;
  color: #1d4ed8;
}

.badge-light-blue {
  background: #eef4ff;
  color: #2563eb;
}

.badge-light-green {
  background: #e6f7ec;
  color: #16a34a;
}

.badge-gray {
  background: #f1f5f9;
  color: #64748b;
}

.table-indicator {
  border-collapse: collapse;
  width: 100%;
  background: #fff;
}

.table-indicator th,
.table-indicator td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
}

.table-indicator thead th {
  background: #f8fafc;
  font-weight: 600;
}

.table-indicator input[type='checkbox'] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
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
</style>
