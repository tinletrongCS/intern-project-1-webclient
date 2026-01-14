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
    header="THÔNG TIN XÁC NHẬN HỆ SỐ DỊCH VỤ"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="confirm-box box-form">

          <!-- MÃ DỰ ÁN -->
          <div class="project-badge">
            MÃ DỰ ÁN: {{ projectCode }}
          </div>

          <!-- HỆ SỐ DỊCH VỤ -->
          <div class="form-row" ref="serviceRateRow">
            <label class="label">
              Hệ số dịch vụ <span class="red">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              class="form-control"
              v-model.number="form.service_rate"
              placeholder="Nhập hệ số dịch vụ"
            />
          </div>

          <!-- GHI CHÚ -->
          <div class="form-row">
            <label class="label">Ghi chú</label>
            <textarea
              v-model="form.note"
              rows="3"
              class="form-control"
              placeholder="Nhập ghi chú ..."
            ></textarea>
          </div>

          <!-- FOOTER -->
          <div class="dialog-footer">
            <button
              class="btn btn-danger btn-sm"
              style="width: 120px"
              @click="hide"
            >
              <span class="icon fa fa-close"></span> Bỏ qua
            </button>
            <button
              class="btn btn-primary btn-sm"
              style="width: 120px"
              @click="onSubmit"
            >
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
  name: 'Project123ServiceRateConfirmDialog',

  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },

      projectCode: '',

      form: {
        service_rate: null,
        note: ''
      }
    }
  },

  methods: {
    /**
     * @param row dữ liệu project (từ list)
     */
    show(row) {
      this.projectCode = row.project_123_code

      // gán sẵn hệ số nếu có
      this.form.service_rate = row.service_rate ?? null
      this.form.note = ''

      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    focusServiceRate() {
      this.$nextTick(() => {
        const el = this.$refs.serviceRateRow
        if (!el) return

        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('error-focus')

        const input = el.querySelector('input')
        if (input) input.focus()

        setTimeout(() => {
          el.classList.remove('error-focus')
        }, 3000)
      })
    },

    onSubmit() {
      // ===== VALIDATE =====
      if (
        this.form.service_rate === null ||
        this.form.service_rate <= 0
      ) {
        this.$toast.error('Vui lòng nhập hệ số dịch vụ hợp lệ')
        this.focusServiceRate()
        return
      }

      this.$emit('confirm', {
        service_rate: this.form.service_rate,
        note: this.form.note?.trim() || ''
      })

      this.hide()
    }
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

.red {
  color: red;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 20px;
}
</style>

