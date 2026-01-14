<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupUpdateCapability"
    :showCloseIcon="true"
    width="80%"
    :isModal="true"
    :target="target"
    :header="header"
    id="update-capability-contract-dialog"
    :open="handleShowModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">

        <!-- TABLE -->
        <div class="table-responsive">
          <!-- thêm table-bordered -->
          <table class="table table-bordered capability-contract-table">
            <thead>
              <tr>
                <th style="width:70px">STT</th>
                <th>Dịch vụ</th>
                <th style="width:220px">Đối tượng</th>

                <th style="width:160px">Số hợp đồng</th>
                <th style="width:220px">Tên hợp đồng</th>
                <th style="width:220px">Khách hàng</th>
                

                <th style="width:220px">Giá trị hợp đồng</th>

                <!-- <th style="width:260px">Có hay không hợp đồng nghiệm thu</th> -->

                <th style="width:220px">Đính kèm file</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(row, index) in capabilityList"
                :key="row.indicator_config_id"
              >
                <td class="stt">
                  {{ formatIndex(index) }}
                </td>

                <td class="service-name">
                  {{ row.service_name }}
                </td>

                <td>
                  <span
                    class="target-tag"
                  >
                    {{ row.object_names }}
                  </span>
                </td>

                <td>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập số HĐ"
                    v-model="capabilityList[index].contract_number"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên hợp đồng"
                    v-model="capabilityList[index].contract_name"
                  />
                </td>

                <td>
                  <!-- <select
                    class="form-control"
                    v-model="capabilityList[index].customer_id"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    <option
                      v-for="c in customerList"
                      :key="c.customer_id"
                      :value="c.customer_id"
                    >
                      {{ c.customer_name }}
                    </option>
                  </select> -->
                  <CustomerSelect ref="customerSelect" 
                    v-model="capabilityList[index].customer_selected"
                    class="form-control"
                    :customerName="capabilityList[index].customer_name"
                    :isSelectAll="false"/>
                </td>

                

                <td>
                  <input
                    type="text"
                    class="form-control contract-input"
                    placeholder="₫ Nhập giá trị"
                    v-model="capabilityList[index].contract_value_display"
                    @input="formatMoney(row)"
                  />
                </td>

                <!-- <td class="text-center">
                  <input
                    type="checkbox"
                    class="acceptance-check"
                    v-model="capabilityList[index].has_acceptance_us"
                  />
                </td> -->

                <td class="file-upload-cell">
                  <!-- Hidden input -->
                  <input
                    type="file"
                    multiple
                    class="d-none"
                    :accept="'.doc,.docx,.pdf,.xlsx,.xls,.zip,.rar,.xml,.jpeg,.jpg,.png,.pptx'"
                    :id="'file-input-' + index"
                    @change="onFileChange($event, row)"
                  />

                  <!-- Button -->
                  <button
                    type="button"
                    class="btn btn-upload"
                    @click="triggerFileInput(index)"
                  >
                    📎 Chọn file
                  </button>

                  <!-- File list -->
                  <ul
                      class="file-list"
                      v-if="row.all_files && row.all_files.length"
                    >
                    <li
                      v-for="(f, fIndex) in row.all_files"
                      :key="f.uid"
                      class="file-item"
                    >
                      <span class="file-name" :title="f.file_name">
                        {{ f.file_name }}
                      </span>

                      <span
                        class="remove-file"
                        @click="removeFile(row, fIndex)"
                      >
                        ✕
                      </span>
                    </li>
                  </ul>
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>

        <!-- GUIDE -->
        <div class="guide-box">
          <b>Hướng dẫn:</b>
          <div>
            Các trường <b>Dịch vụ</b> và <b>Đối tượng</b> chỉ dùng để xem.
            <br />
            Vui lòng nhập <b>Số hợp đồng</b>, <b>Tên hợp đồng</b>, <b>Khách hàng</b>,
            <b>Giá trị hợp đồng</b>, tích chọn <b>Hợp đồng nghiệm thu</b> (nếu có)
            và <b>đính kèm file hợp đồng</b> tương ứng.
          </div>
        </div>

        <!-- FOOTER -->
        <div class="dialog-footer">
          <div class="total">
            Tổng số: <b>{{ capabilityList.length }}</b> mục
          </div>

          <div class="actions">
            <button class="btn btn-second" @click="hideModal">
              ✕ Hủy
            </button>
            <button class="btn btn-primary" @click="onSave">
              ✔ Lưu thay đổi
            </button>
          </div>
        </div>

      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import API from './API'
import CustomerSelect from './CustomerSelect.vue'
export default {
  name: 'UpdateCapabilityContractDialog',
  components: {
    CustomerSelect
  },
  props:{
    data: { type: Object, default: () => [] },
    user_id: { type: Number, default: 0 }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: 'Danh sách năng lực',
      capabilityList: [],
      customerList: []
    }
  },
  methods: {
    showModal() {
      this.$refs.popupUpdateCapability.show()
    },
    hideModal() {
      this.$refs.popupUpdateCapability.hide()
    },
    handleShowModal() {
      this.clear()
      // giữ fake data, không cần init
      setTimeout(()=>{
        this.loadDialog()
      }, 200)
    },
    loadDialog(){
      this.capabilityList = this.data.map(x => {
        // clone sâu toàn bộ object (1 level)
        const cloned = { ...x }
        const oldFiles = x.file_attachments || []

        return {
          ...cloned,

          file_attachments: oldFiles,

          contract_number: x.contract_number || '',
          contract_name: x.contract_name || '',
          
          new_files: [],
          deleted_files: [],

          // 👇 PHẢI CÓ NGAY TỪ ĐẦU
          all_files: oldFiles.map(f => ({
            uid: 'db_' + f.file_attachment_id,
            file_attachment_id: f.file_attachment_id,
            file_name: f.file_name,
            is_new: false
          })),

          // tách riêng value cho UI (RẤT QUAN TRỌNG)
          contract_value_raw:
            x.contract_value != null && x.contract_value != undefined
              ? Number(String(x.contract_value).replace(/\D/g, ''))
              : null,

          contract_value_display:
            x.contract_value != null && x.contract_value != undefined
              ? Number(x.contract_value).toLocaleString('vi-VN'): '',

          has_acceptance: !!x.has_acceptance
        }
      })
    },
    triggerFileInput(index) {
      document.getElementById(`file-input-${index}`).click()
    },

    onFileChange(event, row) {
      const files = Array.from(event.target.files)

      files.forEach(file => {
        row.new_files.push(file)

        row.all_files.push({
          uid: 'new_' + Date.now() + '_' + file.name,
          file_name: file.name,
          file_obj: file,
          is_new: true
        })
      })
      // reset input để chọn lại cùng file vẫn trigger
      event.target.value = ''
    },
    clear(){
      this.capabilityList=[]
    },
    removeFile(row, index) {
      const file = row.all_files[index]

      if (file.is_new) {
        // xoá file mới
        row.new_files = row.new_files.filter(
          f => f !== file.file_obj
        )
      } else {
        // đánh dấu xoá file cũ
        if (!row.deleted_files) row.deleted_files = []
        row.deleted_files.push(file.file_attachment_id)
      }

      row.all_files.splice(index, 1)
    },
    formatIndex(index) {
      return String(index + 1).padStart(2, '0')
    },

    formatMoney(row) {
      // lấy giá trị người dùng nhập (display)
      let raw = row.contract_value_display
        ? row.contract_value_display.replace(/\D/g, '')
        : ''

      // ghi giá trị thô (số)
      row.contract_value_raw = raw !== ''
        ? Number(raw)
        : null

      // ghi lại giá trị hiển thị (format tiền)
      row.contract_value_display = raw !== ''
        ? Number(raw).toLocaleString('vi-VN')
        : ''
    },

    async onSave() {
      // ===== VALIDATE =====
      if (!this.capabilityList || this.capabilityList.length === 0) {
        this.$toast.error('Không có dữ liệu để lưu')
        return
      }
      if(!this.user_id){
        this.$toast.error('Không có thông tin user')
        return
      }

      const hasAnyRowInput = this.capabilityList.some(row =>
        row.contract_number ||
        row.contract_name ||
        row.customer_selected.id ||
        row.contract_value_raw
      )

      if (!hasAnyRowInput) {
        this.$toast.error('Vui lòng nhập thông tin trước khi lưu')
        return
      }

      // ===== ROW VALIDATE =====
      for (let i = 0; i < this.capabilityList.length; i++) {
        const row = this.capabilityList[i]
        const rowIndex = this.formatIndex(i)

        const hasAnyContractInfo =
          row.contract_number ||
          row.contract_name ||
          row.customer_selected.id ||
          row.contract_value_raw ||
          row.has_acceptance_us

        // ❌ Không cho dòng trống hoàn toàn
        if (!hasAnyContractInfo) {
          continue // cho phép bỏ qua dòng chưa nhập gì
        }

        // ❌ Nhập hợp đồng thì bắt buộc đủ thông tin
        if (!row.contract_number) {
          this.$toast.error(`Dòng ${rowIndex}: Vui lòng nhập Số hợp đồng`)
          return
        }

        if (!row.contract_name) {
          this.$toast.error(`Dòng ${rowIndex}: Vui lòng nhập Tên hợp đồng`)
          return
        }

        if (!row.customer_selected || !row.customer_selected.id) {
          this.$toast.error(`Dòng ${rowIndex}: Vui lòng chọn Khách hàng`)
          return
        }


        // ❗ FILE BẮT BUỘC
        const totalFiles =
          (row.all_files && row.all_files.length) || 0

        if (totalFiles === 0) {
          this.$toast.error(
            `Dòng ${rowIndex}: Vui lòng đính kèm file hợp đồng`
          )
          return
        }
      }

      // ===== CONFIRM =====
      const confirm = await this.$confirm(
        'Thông báo',
        'Bạn chắc chắn muốn lưu thay đổi?'
      )
      if (confirm === 0) return

      // ===== BUILD REQUEST LIST =====
      const formData = new FormData()

      this.capabilityList.forEach((row, index) => {
        formData.append(`[${index}].indicator_user_score_id`, row.indicator_user_score_id || '')
        formData.append(`[${index}].indicator_config_id`, row.indicator_config_id)
        formData.append(`[${index}].user_id`, this.user_id)

        formData.append(`[${index}].contract_number`, row.contract_number || '')
        formData.append(`[${index}].contract_name`, row.contract_name || '')
        formData.append(
          `[${index}].customer_id`,
          row.customer_selected?.id || ''
        )

        formData.append(
          `[${index}].contract_value`,
          row.contract_value_raw != null ? row.contract_value_raw : ''
        )

        formData.append(
          `[${index}].has_acceptance_us`,
          !!row.has_acceptance_us
        )

        // ===== FILE MỚI =====
        if (row.new_files && row.new_files.length > 0) {
          row.new_files.forEach(file => {
            formData.append(`[${index}].new_files`, file)
          })
        }

        // ===== FILE XOÁ =====
        if (row.deleted_files && row.deleted_files.length > 0) {
          row.deleted_files.forEach(id => {
            formData.append(`[${index}].deleted_file_ids`, id)
          })
        }
      })

      // ===== CALL API =====
      const result = await API.AddOrUpdateIndicatorUserScore(this, formData)
      if (result === '1') {
        this.$toast.success('Lưu thay đổi thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }

    }
  }
}
</script>

<style>
:deep(#update-capability-contract-dialog .e-dlg-content) {
  max-height: 85vh;
  overflow-y: auto;
}
#update-capability-contract-dialog .table th,
#update-capability-contract-dialog .table td {
  vertical-align: middle !important;
}
#update-capability-contract-dialog .table th{
  text-align: center;
}
/* Table */
.capability-contract-table {
  /* border-radius: 4px; */
  overflow: hidden;
}

.capability-contract-table th {
  background: #f8fafc;
  font-size: 13px;
  border: 1px solid #e5e7eb;
}

.capability-contract-table td {
  padding: 14px 12px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
}

.stt {
  font-weight: 600;
}

/* Target tag */
.target-tag {
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  margin-right: 6px;
}

/* Input */
.contract-input {
  border-radius: 8px;
}

/* Checkbox */
.acceptance-check {
    width: 18px;
    height: 26px;
}
/* Guide */
.guide-box {
  margin-top: 16px;
  padding: 12px 16px;
  background: #eef4ff;
  border-radius: 10px;
  font-size: 13px;
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
}

.dialog-footer .actions {
  display: flex;
  gap: 10px;
}
.file-upload-cell {
  min-width: 220px;
}

.btn-upload {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  background: #e0e7ff !important;
  color: #6055ff !important;
  border: 1px dashed #e0e7ff;
}

.btn-upload:hover {
  background: #e0e7ff;
}

.file-list {
  margin-top: 6px;
  padding-left: 0;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 8px;
  margin-bottom: 4px;
  font-size: 12px;
}

.file-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file {
  cursor: pointer;
  color: #ef4444;
  font-weight: 600;
}
.remove-file:hover {
  color: #dc2626;
}
</style>
