<template>
  <div class="am-report-table card">

    <div class="info-row bold mb-2" style="padding-left: 12px; padding-top: 8px; font-size: 16px;">
      {{ title }}
    </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th style="width:50px" class="center">
              <input
                type="checkbox"
                :checked="isAllChecked"
                @change="toggleAll"
              />
            </th>
            
            <th style="width:60px" class="center">STT</th>
            <th>TÊN NHÂN VIÊN</th>
            <th>ĐƠN VỊ</th>
            <th style="width:150px" class="center">SỐ LƯỢNG</th>
            <th style="width:160px" class="center">TRẠNG THÁI</th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-for="(row, index) in pagedRows" :key="index">
            
            <td class="center">
              <input
                type="checkbox"
                v-model="row.checked"
                @change="emitChecked"
              />
            </td>

            <td class="center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>

            <td class="user">
               <div class="user-tags">
                  <span class="initial" :title="row.user_name">
                    {{ getInitial(row.user_name) }}
                  </span>
               </div>
               <span class="user-name">
                 {{ row.user_name }}
               </span>
            </td>

            <td>
              <span class="unit-tag" :class="getUnitColor(row.department_name)">
                {{ row.department_name }}
              </span>
            </td>

            <td class="center">
               <span class="service-count">
                {{ row.count }} dịch vụ
              </span>
            </td>

            <td class="center">
              <span class="status-tag status-pending">
                Chờ thẩm định
              </span>
            </td>

          </tr>

          <tr v-if="!dataSource || dataSource.length === 0">
            <td colspan="6" class="empty">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="dataSource.length > 0">
      <span>
        Hiển thị {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, dataSource.length) }} của {{ dataSource.length }} kết quả
      </span>

      <div class="pager">
        <button :disabled="currentPage === 1" @click="currentPage--">‹</button>
        
        <button 
          v-for="p in totalPages" 
          :key="p" 
          :class="{ active: p === currentPage }" 
          @click="currentPage = p"
        >
          {{ p }}
        </button>
        
        <button :disabled="currentPage === totalPages" @click="currentPage++">›</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CapabilityAppraisalTable',
  props: {
    title: {
      type: String,
      default: 'DANH SÁCH NHÂN SỰ CÓ DỊCH VỤ CHỜ THẨM ĐỊNH'
    },
    // Dữ liệu đầu vào: Danh sách nhân viên (Phẳng)
    dataSource: {
      type: Array,
      required: true,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1,
      localDataSource: []
    }
  },
  watch: {
    // Khi dữ liệu thay đổi, reset checkbox và trang
    dataSource: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.localDataSource = newVal.map(item => ({
            ...item,
            checked: false
          }))
          this.currentPage = 1
        } else {
          this.localDataSource = []
        }
      }
    }
  },
  computed: {
    // Tổng số trang
    totalPages() {
      return Math.ceil(this.localDataSource.length / this.pageSize)
    },

    // Cắt dữ liệu theo trang (KHÔNG DÙNG FLATROWS NỮA)
    pagedRows() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.localDataSource.slice(start, start + this.pageSize)
    },

    // Kiểm tra check all
    isAllChecked() {
      if (this.pagedRows.length === 0) return false
      return this.pagedRows.every(r => r.checked === true)
    }
  },
  methods: {
    hasAvatar(row) {
      return row.avatar && row.avatar.trim() !== ''
    },
    getAvatarUrl(row) {
      return `${import.meta.env.VNPT_API}/user/Account/ImageView/${row.avatar}`
    },
    toggleAll(e) {
      const isChecked = e.target.checked
      this.pagedRows.forEach(row => { row.checked = isChecked })
      this.emitChecked()
    },
    emitChecked() {
      const selectedItems = this.localDataSource.filter(r => r.checked === true)
      this.$emit('selection-change', selectedItems)
    },
    onClickView(row){
      this.$emit('click-view', row)
    },

    // --- Helper Functions cho giao diện đẹp ---
    getInitial(name) {
      if (!name) return '?';
      const parts = name.trim().split(' ');
      return parts[parts.length - 1].charAt(0).toUpperCase();
    },
    getUnitColor(name) {
      if (!name) return 'blue';
      const len = name.length;
      if (len % 3 === 0) return 'purple';
      if (len % 3 === 1) return 'green';
      return 'blue';
    }
  }
}
</script>

<style scoped>
/* ===== CARD STYLE ===== */
.am-report-table {
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  /* box-shadow: 0 1px 3px rgba(0,0,0,0.1); */
}

/* ===== TABLE STYLE ===== */
.table {
  width: 100%;
  border-collapse: collapse;
  font-family: inherit;
}

th {
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 13px;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #334155;
  font-size: 13px;
}

.center { text-align: center; }
.bold { font-weight: 600; }
.empty { text-align: center; color: #94a3b8; padding: 20px; }

/* ===== USER COLUMN ===== */
.user {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Avatar chữ cái */
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
  border: 1px solid #e2e8f0;
}

.user-name {
  margin-left: 8px;
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


/* ===== STATUS TAG ===== */
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.status-pending { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
.service-count { font-weight: 600; color: #475569; }

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 13px;
  color: #64748b;
  padding-bottom: 4px;
}
.pager button {
  margin-left: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s;
}
.pager button:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
.pager button.active { background: #2563eb; color: #fff; border-color: #2563eb; }
.pager button:disabled { opacity: 0.5; cursor: not-allowed; background: #f1f5f9; }

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
/* Checkbox */
input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
  vertical-align: middle;
}
</style>