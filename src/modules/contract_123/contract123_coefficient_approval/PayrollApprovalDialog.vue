<template>
  <ejs-dialog
    ref="approvalDialog"
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    :showCloseIcon="true"
    width="40%"
    :isModal="true"
    :target="target"
    header="Duyệt tính lương"
  >
    <div class="popup-body">

      <!-- MÃ DỰ ÁN -->
      <div class="info-row">
        <div class="key bold">Mã dự án</div>
        <div class="value">
          <input
            class="form-control"
            :value="form.project_code"
            disabled
          />
        </div>
      </div>

      <!-- ĐỀ XUẤT -->
      <div class="info-row mt-2">
        <div class="key bold">Đề xuất</div>
        <div class="value proposal-list">

          <label
            v-for="p in proposalList"
            :key="p.id"
            class="proposal-item"
            :class="{ active: form.proposal_type_id === p.id }"
          >
            <input
              type="radio"
              :value="p.id"
              v-model="form.proposal_type_id"
            />

            <div class="proposal-content">
              <div class="title">
                {{ p.text }}
              </div>
              <div class="desc">{{ p.desc }}</div>
            </div>

            <!-- ICON -->
            <div class="proposal-icon">
              <i :class="p.icon"></i>
            </div>
          </label>

        </div>
      </div>

      <!-- GHI CHÚ -->
      <div class="info-row mt-2">
        <div class="key bold">
          Ghi chú
          <span v-if="form.proposal_type_id === 2 || form.proposal_type_id === 3"
                class="red">*</span>
        </div>
        <div class="value">
          <textarea
            class="form-control"
            rows="3"
            v-model="form.approval_note"
            placeholder="Nhập lý do hoặc nội dung ghi chú thêm..."
          ></textarea>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="dialog-footer">
        <button class="btn btn-second" @click="hide">Hủy</button>
        <button class="btn btn-primary" @click="onConfirm" :disabled="isConfirmDisabled">
          Xác nhận
        </button>
      </div>

    </div>
  </ejs-dialog>
</template>
<script>
export default {
  name: 'PayrollApprovalDialog',

  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },

      form: {
        contract_project_123_id: null,
        project_code: '',
        proposal_type_id: 1,
        approval_note: ''
      },

      proposalList: [
        {
          id: 1,
          text: 'Ghi nhận tính lương',
          desc: 'Hợp đồng hợp lệ, chuyển sang kế toán',
          icon: 'fa fa-check text-success'
        },
        {
          id: 2,
          text: 'Hoàn trả',
          desc: 'Yêu cầu bổ sung thông tin',
          icon: 'fa fa-undo text-warning'
        },
        {
          id: 3,
          text: 'Hủy',
          desc: 'Từ chối và đóng hồ sơ',
          icon: 'fa fa-times text-danger'
        }
      ]
    }
  },
  computed: {
    isConfirmDisabled() {
      if (this.form.proposal_type_id === 2 || this.form.proposal_type_id === 3) {
        return !this.form.approval_note || !this.form.approval_note.trim()
      }
      return false
    }
  },

  methods: {
    show(row) {
      // row lấy từ table (1 dòng được chọn)
      this.form.contract_project_123_id = row.id
      this.form.project_code = row.project_code
      this.form.proposal_type_id = 1
      this.form.approval_note = ''

      this.$refs.approvalDialog.show()
    },

    hide() {
      this.$refs.approvalDialog.hide()
    },

    onConfirm() {
      if (!this.form.proposal_type_id) {
        this.$toast.error('Vui lòng chọn Đề xuất')
        return
      }

      // 🚨 Hoàn trả / Hủy → bắt buộc nhập ghi chú
      if (
        (this.form.proposal_type_id === 2 || this.form.proposal_type_id === 3) &&
        (!this.form.approval_note || !this.form.approval_note.trim())
      ) {
        this.$toast.error('Vui lòng nhập Ghi chú cho Hoàn trả / Hủy')
        return
      }

      this.$emit('confirm', {
        ...this.form,
        approval_note: this.form.approval_note?.trim() || ''
      })

      this.hide()
    }
  }
}
</script>
<style>
.popup-body {
  padding: 12px;
}

.info-row {
  margin-bottom: 10px;
}

.key {
  font-size: 13px;
  margin-bottom: 4px;
}

.proposal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.proposal-item {
  position: relative;
  display: flex;
  align-items: center;     /* căn giữa theo chiều dọc */
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 40px 12px 12px; /* chừa chỗ bên phải cho icon */
  cursor: pointer;
}

.proposal-content {
  flex: 1;   /* chiếm hết chiều ngang còn lại */
}

.proposal-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%); /* căn giữa dọc */
  font-size: 18px;
}

.text-success { color: #16a34a; }
.text-warning { color: #f59e0b; }
.text-danger  { color: #dc2626; }

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

</style>