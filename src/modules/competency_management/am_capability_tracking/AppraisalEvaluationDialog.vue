<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupAppraisal"
    :showCloseIcon="true"
    width="80%"
    :isModal="true"
    :target="target"
    :header="'Thẩm định đánh giá'"
    id="appraisal-evaluation-dialog"
    :open="handleShowModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">

        <!-- ===== HEADER ===== -->
        <div class="appraisal-header">
          <div class="left">
            <div class="title">Danh sách thẩm định</div>
          </div>

          <div class="right">
            <span class="selected">
              Đã chọn: <b>{{ selectedCount }}</b>
            </span>

            <button
              class="btn btn-success"
              :disabled="selectedCount === 0"
              @click="approve"
            >
              ✔ Đồng ý
            </button>

            <button
              class="btn btn-danger"
              :disabled="selectedCount === 0"
              @click="prepareReject"
            >
              ✕ Từ chối
            </button>
          </div>
        </div>

        <!-- ===== TABLE ===== -->
        <div class="table-responsive">
          <table class="table appraisal-table">
            <thead>
              <tr>
                <th style="width:50px;">
                  <input type="checkbox" v-model="checkAll" />
                </th>
                <th>Yêu cầu kiến thức</th>

                <th style="width:140px">Số hợp đồng</th>
                <th style="width:200px">Tên hợp đồng</th>
                <th style="width:200px">Khách hàng</th>
                <th style="width:220px">File đính kèm</th>

                <th style="width:160px">Đánh giá</th>
                <th style="width:160px">Giá trị hợp đồng</th>
                <th style="width:160px" class="text-center">
                  Hợp đồng nghiệm thu
                </th>
                <th style="width:120px" class="text-center">
                  Điểm tích lũy
                </th>
                <th style="width:160px" class="text-center">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in pagedList" :key="row.id">
                <td class="text-center">
                  <input type="checkbox" v-model="row.checked" />
                </td>

                <td class="service-name">
                  {{ row.service_name }}
                </td>

                <!-- SỐ HỢP ĐỒNG -->
                <td>
                  {{ row.contract_number || '-' }}
                </td>

                <!-- TÊN HỢP ĐỒNG -->
                <td style="text-align: left;">
                  {{ row.contract_name || '-' }}
                </td>

                <!-- KHÁCH HÀNG -->
                <td>
                  {{ row.customer_name || '-' }}
                </td>

                <!-- FILE ĐÍNH KÈM -->
                <td style="text-align: left;">
                  <ul
                    v-if="row.file_attachments && row.file_attachments.length"
                    class="file-list"
                  >
                    <li
                      v-for="f in row.file_attachments"
                      :key="f.file_attachment_id"
                    >
                      📎
                      <a
                      class="file-link"
                        @click.prevent="onClickDownloadFile(f)"
                        rel="noopener"
                      >
                        {{ f.file_name }}
                      </a>
                    </li>
                  </ul>
                  <span v-else class="text-muted">-</span>
                </td>

                <!-- Đánh giá -->
                <td class="evaluation">
                  <div
                    v-for="(line, i) in (row.measure || '').split('\n')"
                    :key="i"
                  >
                    {{ line }}
                  </div>
                </td>

                <!-- Giá trị hợp đồng -->
                <td class="money">
                  {{ formatMoney(row.contract_value) }}
                </td>

                <!-- Hợp đồng nghiệm thu -->
                <td class="text-center">
                  <input
                    type="checkbox"
                    class="checkbox-readonly"
                    :checked="row.has_acceptance_us"
                  />
                </td>

                <!-- Điểm tích lũy -->
                <td class="text-center">
                  {{ row.total_point ?? '-' }}
                </td>

                <!-- Trạng thái -->
                <td class="text-center">
                  <span
                    class="status"
                    :class="{
                      pending: row.evaluation_status === 1,
                      approved: row.evaluation_status === 2,
                      rejected: row.evaluation_status === 3
                    }"
                  >
                    {{ row.evaluation_status_name }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===== PAGINATION ===== -->
        <div class="pagination-wrapper">
          <button
            class="page-btn nav"
            :disabled="currentPage == 1"
            @click="goPrev"
          >
            ‹
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            class="page-btn"
            :class="{ active: page == currentPage }"
            @click="goPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="page-btn nav"
            :disabled="currentPage == totalPages"
            @click="goNext"
          >
            ›
          </button>
        </div>

        <!-- ===== REJECT REASON DIALOG ===== -->
      <ejs-dialog
        ref="popupRejectReason"
        :visible="false"
        width="420px"
        :isModal="true"
        :showCloseIcon="true"
        :target="target"
        header="Lý do từ chối"
      >
        <div class="reject-dialog-body">
          <label class="reject-label">
            Vui lòng nhập lý do từ chối <span class="required">*</span>
          </label>

          <textarea
            v-model="rejectNote"
            class="form-control"
            rows="4"
            placeholder="Nhập lý do từ chối..."
          />

          <div class="reject-actions">
            <button class="btn btn-second" @click="closeRejectDialog">
              Hủy
            </button>
            <button class="btn btn-danger" @click="confirmReject">
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </ejs-dialog>

      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import API from './API'
export default {
  name: 'AppraisalEvaluationDialog',
  props:{
    data: { type: Object, default: () => [] },
    user_id: { type: Number, default: 0 }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },

      appraisalList: [],
      //checkAll: false,

      actionType: null,
      rejectNote: '',

      pageSize: 10,
      currentPage: 1
    }
  },
  computed: {
    selectedCount() {
      return this.appraisalList.filter(x => x.checked).length
    },
    totalPages() {
      return Math.ceil(this.appraisalList.length / this.pageSize)
    },
    pagedList() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.appraisalList.slice(start, start + this.pageSize)
    },
    checkAll: {
      get() {
        // chỉ xét các dòng đang hiển thị (pagedList)
        return (
          this.pagedList.length > 0 &&
          this.pagedList.every(row => row.checked)
        )
      },
      set(val) {
        this.pagedList.forEach(row => {
          row.checked = val
        })
      }
    }
  },
  methods: {
    showModal() {
      this.$refs.popupAppraisal.show()
    },
    hideModal() {
      this.$refs.popupAppraisal.hide()
    },
    handleShowModal() {
      this.reset()
      setTimeout(()=>{
        this.loadDataFromApi()
      }, 200)
    },
    reset() {
      this.appraisalList = []
      this.checkAll = false
      this.rejectNote = ''
      this.actionType = null
      this.currentPage = 1
    },
    async loadDataFromApi() {
      this.appraisalList=[]
      var result = await API.GetIndicatorByUserScoreIds(this, {
        arrIds:JSON.stringify(this.data),
        userId:this.user_id
      })
      if(result){
        result =  JSON.parse(result)
        this.appraisalList = (result|| []).map(x => ({
          ...x,
          checked: false // phục vụ checkbox
        }))
      }
    },
    // toggleAll() {
    //   this.pagedList.forEach(x => (x.checked = this.checkAll))
    // },
    formatMoney(val) {
      return val?Number(val).toLocaleString('vi-VN'):''
    },
    goPage(p) {
      this.currentPage = p
    },
    goPrev() {
      if (this.currentPage > 1) this.currentPage--
    },
    goNext() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    prepareReject() {
      if (!this.selectedCount) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng')
        return
      }

      // chỉ cho từ chối trạng thái CHỜ
      const invalidRow = this.appraisalList.find(
        x => x.checked && x.evaluation_status !== 1
      )
      if (invalidRow) {
        this.$toast.error(
          `Dịch vụ "${invalidRow.service_name}" không ở trạng thái Chờ thẩm định`
        )
        return
      }

      this.rejectNote = ''
      this.$refs.popupRejectReason.show()
    },
    closeRejectDialog() {
      this.$refs.popupRejectReason.hide()
    },
    onClickDownloadFile(file){
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
    },
    async approve() {
      // ===== VALIDATE =====
      if (!this.selectedCount) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng')
        return
      }

      // chỉ cho thẩm định dòng đang CHỜ
      const invalidRow = this.appraisalList.find(
        x => x.checked && x.evaluation_status != 1
      )
      if (invalidRow) {
        this.$toast.error(
          `Dịch vụ "${invalidRow.service_name}" không ở trạng thái Chờ thẩm định`
        )
        return
      }

      // ===== CONFIRM =====
      const confirm = await this.$confirm(
        'Thẩm định',
        'Bạn chắc chắn muốn đồng ý các dòng đã chọn?'
      )
      if (confirm == 0) return

      // ===== BUILD REQUEST =====
      const selectedIds = this.appraisalList
        .filter(x => x.checked)
        .map(x => x.indicator_user_score_id)

      const request = {
        arrIds: JSON.stringify(selectedIds)
      }

      // ===== CALL API =====
      const result = await API.ApproveIndicatorUserScore(this, request)

      if (result == '1') {
        this.$toast.success('Thẩm định thành công!')
        this.$emit('success')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async confirmReject() {
      if (!this.rejectNote || !this.rejectNote.trim()) {
        this.$toast.error('Vui lòng nhập lý do từ chối')
        return
      }

      const confirm = await this.$confirm(
        'Từ chối',
        'Bạn chắc chắn muốn từ chối các dòng đã chọn?'
      )
      if (confirm == 0) return

      const selectedIds = this.appraisalList
        .filter(x => x.checked)
        .map(x => x.indicator_user_score_id)

      const request = {
        arrIds: JSON.stringify(selectedIds),
        rejectionReason: this.rejectNote.trim()
      }

      const result = await API.RejectIndicatorUserScore(this, request)

      if (result == '1') {
        this.$toast.success('Từ chối thẩm định thành công!')
        this.$emit('success')
        this.$refs.popupRejectReason.hide()
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    }

  }
}
</script>

<style>
:deep(#appraisal-evaluation-dialog .e-dlg-content) {
  max-height: 85vh;
  overflow-y: auto;
}
#appraisal-evaluation-dialog .table th,
#appraisal-evaluation-dialog .table td {
  vertical-align: middle !important;
}
/* =========================
   HEADER
========================= */
.appraisal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.appraisal-header .right {
  display: flex;
  align-items: center;
  gap: 14px;
}


/* =========================
   TABLE – FULL BORDER
========================= */
.appraisal-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb; /* border ngoài */
  background: #fff;
}

.appraisal-table th,
.appraisal-table td {
  border: 1px solid #e5e7eb; /* border trong */
  font-size: 13px;
  padding: .75rem;
  vertical-align: center !important;
  border-top: 1px solid #dee2e6;
}

/* Header */
.appraisal-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

/* Hover */
.appraisal-table tbody tr:hover {
  background: #f9fafb;
}

/* =========================
   CHECKBOX COLUMN (LEFT)
========================= */
.appraisal-table th:first-child,
.appraisal-table td:first-child {
  width: 50px;
  text-align: center;
}

.appraisal-table input[type="checkbox"] {
  transform: scale(1.15);
  cursor: pointer;
}

/* =========================
   YÊU CẦU KIẾN THỨC – LEFT
========================= */
.service-name {
  font-weight: 600;
  color: #111827;
  text-align: left;
}

/* =========================
   ĐÁNH GIÁ
========================= */
.evaluation {
  font-size: 12px;
  line-height: 1.5;
  color: #374151;
}

/* =========================
   GIÁ TRỊ HỢP ĐỒNG – RIGHT
========================= */
.appraisal-table th{
  text-align: center;
}

.appraisal-table td:nth-child(4) {
  text-align: right;
}

.money {
  background: #fff4cc;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
  text-align: right;
}

/* =========================
   HĐ NGHIỆM THU – SÁNG MÀU
========================= */
/* KHÔNG dùng disabled → giả readonly */
.appraisal-table td:nth-child(5) input[type="checkbox"] {
  pointer-events: none;      /* không cho click */
  opacity: 1;                /* không bị xám */
  accent-color: #16a34a;     /* xanh rõ */
  cursor: default;
}

/* =========================
   ĐIỂM TÍCH LŨY
========================= */
.appraisal-table th:nth-child(6),
.appraisal-table td:nth-child(6) {
  text-align: center;
}

/* =========================
   STATUS
========================= */
.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.approved {
  background: #dcfce7;
  color: #166534;
}

.status.rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* =========================
   PAGINATION
========================= */
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
#appraisal-evaluation-dialog  .checkbox-readonly {
  pointer-events: none;      /* không cho click */
  opacity: 1;                /* không bị mờ */
  accent-color: #2563eb !important;     /* xanh rõ */
  cursor: default;
  transform: scale(1.1);
}

.reject-dialog-body {
  padding: 16px;
}

.reject-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.reject-label .required {
  color: #dc2626;
}

.reject-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
.file-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  font-size: 12px;
}

.file-list li {
  white-space: nowrap;
}

.file-list a {
  color: #2563eb;
  text-decoration: none;
}

.file-list a:hover {
  text-decoration: underline;
}

.file-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.file-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 12.5px;
}

.file-icon {
  color: #f59e0b; /* vàng cam – nổi icon 📎 */
  font-size: 14px;
}

.file-link {
  color: #2563eb; /* xanh primary */
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
}

.file-link:hover {
  color: #1d4ed8; /* xanh đậm hơn khi hover */
  text-decoration: underline;
}

.text-muted {
  color: #9ca3af; /* xám nhạt */
}
</style>
