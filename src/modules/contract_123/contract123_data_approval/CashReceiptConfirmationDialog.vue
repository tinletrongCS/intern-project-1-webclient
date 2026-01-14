<template>
  <ejs-dialog
    ref="receiptDialog"
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    :showCloseIcon="true"
    width="30%"
    :isModal="true"
    :target="target"
    id="receipt_cash"
    header="Xác nhận Thu tiền"
  >
  <div class="modal-content popup-box">
    <div class="popup-body">

      <!-- TIỀN THU -->
      <div class="info-row error-wrapper" ref="receiptAmount">
        <div class="key bold">
          Tiền thu <span class="red">*</span>
        </div>
        <div class="value">
          <input
            class="form-control text-right"
            v-model="form.receiptAmount_display"
            @input="formatMoney('receiptAmount_display', 'receiptAmount')"
            placeholder="Nhập số tiền"
          />
        </div>
      </div>

      <!-- NGÀY THANH TOÁN -->
      <div class="info-row mt-2 error-wrapper" ref="paymentDate">
        <div class="key bold">
          Ngày thanh toán <span class="red">*</span>
        </div>
        <div class="value">
          <div class="input-icon-right">
            <ejs-datepicker
              :key="datePickerKey.payment"
              v-model="form.paymentDate"
              format="dd/MM/yyyy"
              :showClearButton="true"
              :allowEdit="false"
              :strictMode="true"
              locale="vi"
              :firstDayOfWeek="1"
              @change="changeNgayThanhToan"
            />
          </div>
        </div>
      </div>

      <!-- SỐ HÓA ĐƠN -->
      <div class="info-row mt-2 error-wrapper" ref="invoiceNo">
        <div class="key bold">
          Số hóa đơn <span class="red">*</span>
        </div>
        <div class="value">
          <input
            class="form-control"
            v-model="form.invoice_no"
            placeholder="Nhập số hóa đơn"
          />
        </div>
      </div>

      <!-- GHI CHÚ -->
      <div class="info-row mt-2">
        <div class="key bold">Ghi chú</div>
        <div class="value">
          <textarea
            class="form-control"
            rows="3"
            v-model="form.note"
            placeholder="Nhập ghi chú (nếu có)"
          ></textarea>
        </div>
      </div>

      <!-- ĐÍNH KÈM FILE -->
      <div class="info-row mt-2">
        <div class="key bold">Đính kèm file</div>
        <div class="value">
          <div class="file-upload">
            <input
              ref="fileInput"
              type="file"
              class="file-input"
              accept=".doc,.docx,.pdf,.xlsx,.xls,.zip,.rar,.xml,.jpeg,.jpg,.png,.pptx"
              @change="onFileChange"
            />

            <button
              type="button"
              class="btn file-btn"
              @click="$refs.fileInput.click()"
            >
              Chọn file
            </button>

            <span class="file-name" v-if="form.file">
              {{ form.file.name }}
            </span>
            <span class="file-placeholder" v-else>
              Chưa chọn file
            </span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="dialog-footer">
        <button class="btn btn-second" @click="hide">Hủy</button>
        <button class="btn btn-primary" @click="onConfirm">
          Xác nhận
        </button>
      </div>

    </div>
  </div>
  </ejs-dialog>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CashReceiptConfirmationDialog',

  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },

      datePickerKey: {
        payment: 1
      },

      form: {
        contract_project_123_id: null,

        // ===== TIỀN =====
        receiptAmount: null,
        receiptAmount_display: '',

        // ===== NGÀY =====
        paymentDate: '',

        // ===== KHÁC =====
        invoice_no: '',
        note: '',
        file: null
      }
    }
  },

  methods: {
    show(row) {
      console.log('SHow', row)
      this.form.contract_project_123_id = row.id

      // auto fill tiền = tổng tiền
      if (row.total_amount) {
        this.form.receiptAmount = Number(row.total_amount)
        this.form.receiptAmount_display =
          Number(row.total_amount).toLocaleString('vi-VN')
      } else {
        this.form.receiptAmount = null
        this.form.receiptAmount_display = ''
      }

      this.form.paymentDate = row.payment_date||''
      this.form.invoice_no = row.invoice_code||''
      this.form.note = ''
      this.form.file = null

      // reset datepicker
      this.datePickerKey.payment++

      this.$refs.receiptDialog.show()
    },

    hide() {
      this.$refs.receiptDialog.hide()
    },

    /* ===== FILE ===== */
    onFileChange(e) {
      const file = e.target.files && e.target.files[0]
      this.form.file = file || null
    },

    /* ===== FORMAT TIỀN ===== */
    formatMoney(fieldDisplay, fieldValue) {
      let raw = this.form[fieldDisplay]
        ? this.form[fieldDisplay].replace(/\D/g, '')
        : ''

      this.form[fieldValue] = raw !== ''
        ? Number(raw)
        : null

      this.form[fieldDisplay] = raw !== ''
        ? Number(raw).toLocaleString('vi-VN')
        : ''
    },

    /* ===== NGÀY THANH TOÁN ===== */
    changeNgayThanhToan(event) {
      this.form.paymentDate = event?.value
        ? moment(event.value).format('DD/MM/YYYY')
        : ''
    },
    focusError(refName) {
      this.$nextTick(() => {
        const el = this.$refs[refName]
        if (!el) return

        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })

        el.classList.add('error-focus')

        const input =
          el.querySelector('input') ||
          el.querySelector('textarea') ||
          el.querySelector('.e-input') ||
          el.querySelector('.e-control')

        if (input) input.focus()

        setTimeout(() => {
          el.classList.remove('error-focus')
        }, 3000)
      })
    },

    /* ===== CONFIRM ===== */
    onConfirm() {
      if (!this.form.receiptAmount || this.form.receiptAmount <= 0) {
        this.$toast.error('Vui lòng nhập Tiền thu')
        this.focusError('receiptAmount')
        return
      }

      if (!this.form.paymentDate) {
        this.$toast.error('Vui lòng chọn Ngày thanh toán')
        this.focusError('paymentDate')
        return
      }

      if (!this.form.invoice_no || !this.form.invoice_no.trim()) {
        this.$toast.error('Vui lòng nhập Số hóa đơn')
        this.focusError('invoiceNo')
        return
      }

      this.$emit('confirm', {
        contract_project_123_id: this.form.contract_project_123_id,
        receipt_amount: this.form.receiptAmount,
        payment_date: this.form.paymentDate,
        invoice_no: this.form.invoice_no.trim(),
        note: this.form.note?.trim() || '',
        file: this.form.file
      })

      this.hide()
    }
  }
}
</script>

<style>
.popup-body {
  padding: 16px;
}
#receipt_cash .info-row {
  display: table;
  width: 100%;
  table-layout: fixed;
}

#receipt_cash .info-row .key {
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  display: table-caption;
  padding-left: 6px;
}


.text-right {
  text-align: right;
}

.amount-box {
  display: flex;
  align-items: center;
}

.amount-box .suffix {
  margin-left: 8px;
  font-size: 13px;
  color: #6b7280;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.red {
  color: #dc2626;
}

/* ===== FILE ===== */
.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-input {
  display: none;
}

.file-btn {
  border: 1px solid #94a3b8 !important;      /* viền rõ hơn */
  background: #f8fafc!important;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: #374151 !important;
}

.file-btn:hover {
  background: #f8fafc!important;
  border-color: #94a3b8!important;        /* hover đậm hơn */
}

.file-name {
  font-size: 13px;
  color: #2563eb;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-placeholder {
  font-size: 13px;
  color: #9ca3af;
}

.error-focus input:focus,
.error-focus select:focus,
.error-focus textarea:focus,
.error-focus .e-input:focus,
.error-focus .e-control:focus {
  outline: none !important;
  box-shadow: none !important;
  background-color: #fff !important;
  border-color: #ef4444 !important;
}

/* Syncfusion */
.error-focus .e-input,
.error-focus .e-control {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.45) !important;
}
</style>
