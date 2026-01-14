<template>
  <div class="box-form">

    <!-- ===== TABLE SCROLL ===== -->
    <div class="table-scroll-x">
      <table class="table table-indicator table-wide">
        <thead>
          <tr>
            <th class="center">
              <input type="checkbox" v-model="checkAll" @change="onCheckAll" />
            </th>
            <th class="center">STT</th>

            <th>Mã dự án</th>
            <th>Dịch vụ</th>
            <th>Mã giao dịch</th>
            <th>Mã thuê bao</th>
            <th>Mã số thuế</th>
            <th>Tên khách hàng</th>
            <th>Địa chỉ lắp đặt</th>
            <th>Kiểu yêu cầu</th>
            <th>Mã AM</th>
            <th>Tên nhân viên</th>
            <th>Số hợp đồng</th>
            <th>Ngày nghiệm thu</th>
            <th>Số hóa đơn</th>

            <th>DT chưa VAT</th>
            <th>DT đối tác</th>
            <th>Tên đối tác</th>
            <th>Số tiền thu</th>
            <th>Ngày thanh toán</th>
            <th>Trạng thái</th>
            <th>CS lương</th>
            <th>Mã chứng từ</th>
            <th>Tiền CK</th>
            <th>Ngày hóa đơn</th>
            <th>Ghi chú</th>
            <th>File</th>

            <th>Trạng thái duyệt</th>
            <th>Đề xuất tính lương</th>
            <th>DT gói BSC</th>
            <th>DT gói đối tác</th>
            <th>Người đề xuất</th>
            <th>Ngày đề xuất</th>

            <!-- ===== XÁC NHẬN THU TIỀN ===== -->
            <th>Tiền thu (TKTH)</th>
            <th>Ngày thanh toán (TKTH)</th>
            <th>Số hóa đơn (TKTH)</th>
            <th>Người xác nhận thu tiền</th>
            <th>Ngày xác nhận</th>
            <th>Trạng thái xác nhận</th>

          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in pagedData"
            :key="row.id || index"
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

            <td>{{ row.project_code }}</td>
            <td>{{ row.service_name }}</td>
            <td>{{ row.transaction_code }}</td>
            <td>{{ row.sub_code }}</td>
            <td>{{ row.tax_code }}</td>
            <td class="link">{{ row.customer_name }}</td>
            <td>{{ row.address }}</td>
            <td><span class="badge badge-blue">{{ row.request_type_text }}</span></td>
            <td>{{ row.am_code }}</td>
            <td>{{ row.staff_name }}</td>
            <td>{{ row.contract_no }}</td>
            <td>{{ row.acceptance_date }}</td>
            <td>{{ row.invoice_code }}</td>

            <td style="text-align: right;">{{ format(row.revenue) }}</td>
            <td style="text-align: right;">{{ format(row.partner_revenue) }}</td>
            <td>{{ row.partner_name }}</td>
            <td style="text-align: right;">{{ format(row.total_amount) }}</td>
            <td>{{ row.payment_date }}</td>

            <td>
              <span class="badge" :class="badgeStatus(row.status)">
                {{ row.status_text }}
              </span>
            </td>

            <td>{{ row.salary_policy_text }}</td>
            <td>{{ row.voucher_code }}</td>
            <td style="text-align: right;">{{ format(row.transfer_amount) }}</td>
            <td>{{ row.invoice_date }}</td>
            <td class="note" :title="row.note">{{ row.note }}</td>
            <td class="center">
              <i
                v-if="row.has_file"
                class="fa fa-paperclip file-icon clickable"
                title="Xem file đính kèm"
                @click="openFilePopup(row)"
              ></i>
            </td>

            <td class="center">
              <span
                class="badge"
                :class="badgeApproval(row.approval_status)"
              >
                {{ row.approval_status_text }}
              </span>
            </td>

            <td>
              <span class="badge badge-blue">
                {{ row.proposal_type_name }}
              </span>
            </td>

            <td style="text-align: right;">
              {{ format(row.bsc_revenue) }}
            </td>

            <td style="text-align: right;">
              {{ format(row.proposal_partner_revenue) }}
            </td>

            <td>
              {{ row.proposer_name }}
            </td>

            <td>
              {{ row.proposal_date }}
            </td>

            <!-- ===== XÁC NHẬN THU TIỀN ===== -->

            <td style="text-align: right;">
              {{ format(row.receipt_amount) }}
            </td>

            <td class="center">
              {{ row.receipt_payment_date }}
            </td>

            <td>
              {{ row.receipt_invoice_no }}
            </td>

            <td>
              {{ row.confirmed_by_name }}
            </td>

            <td class="center">
              {{ row.confirmed_date }}
            </td>
            <td class="center">
              <span
                class="badge"
                :class="badgeApproval(row.confirm_status)"
              >
                {{ row.confirm_status_text }}
              </span>
            </td>

          </tr>

          <tr v-if="pagedData.length === 0">
            <td colspan="39" class="center text-muted">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container" v-if="localData.length > 0">
      <!-- Góc trái: pagination -->
      <div class="pagination-wrapper">
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
      <!-- Góc phải: thông tin record -->
      <div class="record-info">
        Hiển thị
        <b>{{ recordInfo.from }}</b> –
        <b>{{ recordInfo.to }}</b>
        trên tổng
        <b>{{ recordInfo.total }}</b> bản ghi
      </div>
      
    </div>

    <ejs-dialog
      ref="fileDialog"
      :allowDragging="true"
      :animationSettings="animationSettings"
      :enableResize="false"
      :position="{ X: 'center', Y: 'center' }"
      :visible="false"
      header="Danh sách file đính kèm"
      width="500px"
      :isModal="true"
      :showCloseIcon="true"
    >
      <div class="popup-body">
        <div
          v-for="(f, i) in fileList"
          :key="i"
          class="file-item"
        >
          <a
            href="javascript:void(0)"
            @click="downloadFile(f)"
            class="file-link"
          >
            📎 {{ f.file_name }}
          </a>
        </div>

        <div v-if="fileList.length === 0" class="text-muted">
          Không có file
        </div>
      </div>
    </ejs-dialog>

  </div>
</template>

<script>
export default {
  name: 'CashReceiptConfirmationTable',

  props: {
    data: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 10 }
  },

  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      currentPage: 1,
      checkAll: false,
      localData: [],
      fileList: []
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
      if (total === 0) {
        return { from: 0, to: 0, total: 0 }
      }

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
    badgeApproval(status) {
      return {
        'badge-gray': status == 1,    // Chờ duyệt
        'badge-green': status == 2,   // Đã duyệt
        'badge-yellow': status == 3,   // HOàn trả
        'badge-red': status == 4      // Từ chối
      }
    },

    format(val) {
      if (val == null || val === '') return ''
      return Number(val).toLocaleString('vi-VN')
    },

    // ✅ CHỈ 2 TRẠNG THÁI
    badgeStatus(s) {
      return {
        'badge-gray': s == 1,   // Chờ duyệt
        'badge-green': s == 2  // Đã duyệt
      }
    },

    openFilePopup(row) {
      // row.files lấy từ API DB (json files)
      this.fileList = row.files || []
      this.$refs.fileDialog.show()
    },

    downloadFile(file) {
      this.axios.get(`revenue/Upload/Download`, {
          params: { filePath: file.file_path },
          responseType: 'blob',
      })
      .then((response) => {
          // Tạo URL và trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.file_name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
      })
      .catch((error) => {
          console.error("Download lỗi:", error);
      });
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
.badge-blue {
  background: #e0f2fe;
  color: #0369a1;
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

.record-info {
  font-size: 13px;
  color: #374151;
  text-align: right;
}

.record-info b {
  font-weight: 600;
}
</style>
