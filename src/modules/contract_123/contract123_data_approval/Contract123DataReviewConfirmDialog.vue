<template>
  <ejs-dialog
    ref="dialog"
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    :showCloseIcon="true"
    width="30%"
    :isModal="true"
    :target="target"
    header="THÔNG TIN XÁC NHẬN DỮ LIỆU"
  >
  <div class="modal-content popup-box">
    <div class="popup-body">
      <div class="confirm-box box-form">

        <!-- MÃ DỰ ÁN -->
        <div class="project-badge">
          MÃ DỰ ÁN: {{ projectCode }}
        </div>

        <!-- ĐỀ XUẤT -->
        <div class="form-row">
          <label class="label">Đề xuất</label>
          <select v-model="form.action" class="form-control">

            <!-- MODE: KIỂM TRA -->
            <template v-if="mode === 'check'">
              <option value="approve">Thống nhất dữ liệu</option>
              <option value="return">Hoàn trả dữ liệu</option>
            </template>

            <!-- MODE: XÁC NHẬN -->
            <template v-if="mode === 'approval'">
              <option value="sync">Xác nhận dữ liệu</option>
              <option value="return">Hoàn trả dữ liệu</option>
            </template>

          </select>
        </div>

        <!-- GHI CHÚ -->
        <div class="form-row" ref="noteRow">
          <label class="label">
            Ghi chú
            <span v-if="form.action === 'return'" class="red">*</span>
          </label>
          <textarea
            v-model="form.note"
            rows="3"
            class="form-control"
            placeholder="Nhập ghi chú ..."
          ></textarea>
        </div>

        <!-- FOOTER -->
        <div class="dialog-footer">
           <button class="btn btn-danger btn-sm" style="width: 120px !important;" @click="hide">
              <span class="icon fa fa-close"></span> Bỏ qua
            </button>
            <button class="btn btn-primary btn-sm" style="width: 120px !important;" @click="onSubmit">
              <span class="icon one-save"></span> Lưu
            </button>
        </div>

      </div>
    </div>
  </div>
  </ejs-dialog>
</template>
<script>
export default {
  name: 'Contract123DataReviewConfirmDialog',

  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      projectCode: '',

      mode: 'check', // check | approval

      form: {
        action: '',
        note: ''
      }
    }
  },

  methods: {
    /**
     * @param row dữ liệu dự án
     * @param mode 'check' | 'approval'
     */
    show(row, mode = 'check') {
      this.projectCode = row.project_123_code
      this.mode = mode

      // set default action theo mode
      if (mode === 'check') {
        this.form.action = 'approve'
      } else if (mode === 'approval') {
        this.form.action = 'sync'
      }

      this.form.note = ''
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    focusNote() {
      this.$nextTick(() => {
        const el = this.$refs.noteRow
        if (!el) return

        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('error-focus')

        const textarea = el.querySelector('textarea')
        if (textarea) textarea.focus()

        setTimeout(() => {
          el.classList.remove('error-focus')
        }, 3000)
      })
    },
    
    onSubmit() {
      // ===== VALIDATE: HOÀN TRẢ BẮT BUỘC GHI CHÚ =====
      if (
        this.form.action === 'return' &&
        (!this.form.note || !this.form.note.trim())
      ) {
        this.$toast.error('Vui lòng nhập lý do hoàn trả dữ liệu')
        this.focusNote()
        return
      }

      this.$emit('confirm', {
        action: this.form.action,
        note: this.form.note?.trim() || ''
      })

      this.hide()
    },
  }
}
</script>
<style scoped>
.confirm-box {
  padding: 16px;
}

.project-badge {
  text-align: center;
  padding: 8px 12px;
  border-radius: 6px;
  background: #fde68a;
  color: #dc2626;
  font-weight: 700;
  margin-bottom: 16px;
}

.form-row {
  margin-bottom: 14px;
}

.label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 20px;
}

</style>