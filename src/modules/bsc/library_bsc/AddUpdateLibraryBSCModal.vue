<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupAddUpdateLibraryBSC" :showCloseIcon="true"
    width="60%" :isModal='true' :target="target" :header="header" id="add-update-library-bsc" :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w150 bold">Mã chỉ số<required-marker /></div>
                <div class="value">
                  <input type="text" :value="input_bsc_code" @change="e => input_bsc_code = e.target.value" disabled
                    class="form-control">
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w150 bold">Đơn vị tính<required-marker /></div>
                <div class="value">
                  <input type="text" ref="inputUnit" :value="input_bsc_unit"
                    @change="e => input_bsc_unit = e.target.value" class="form-control">
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="info-row">
            <div class="key w150 bold">Chỉ tiêu giao<required-marker /></div>
            <div class="value">
              <textarea ref="inputAssignTarget" :value="input_bsc_assign_target"
                @change="e => input_bsc_assign_target = e.target.value" class="form-control" rows="3"></textarea>
            </div>
          </div> -->
          <div class="info-row">
            <div class="key w150 bold">Danh mục chỉ số<required-marker /></div>
            <div class="value">
              <textarea ref="inputName" :value="input_bsc_name" @change="e => input_bsc_name = e.target.value"
                class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="info-row">
            <div class="key w150 bold">Mô tả<required-marker /></div>
            <div class="value">
              <textarea ref="inputDesc" :value="input_description" @change="e => input_description = e.target.value"
                class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="info-row">
            <div class="key w150 bold">Công thức/ Cách đo lường<required-marker /></div>
            <div class="value">
              <textarea ref="inputFormula" :value="input_calculation_formula" @change="e => input_calculation_formula = e.target.value"
                class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="info-row">
            <div class="key w150 bold">Nguồn dữ liệu<required-marker /></div>
            <div class="value">
              <textarea ref="inputDataSource" :value="input_data_source"
                @change="e => input_data_source = e.target.value" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <!-- <div class="info-row">
            <div class="key w150 bold">Tỷ trọng<required-marker /></div>
            <div class="value">
              <input type="text" ref="inputWeight" :value="input_bsc_weight" @keypress="validateNumber" maxlength="4"
                @input="onInputWeight" @change="e => input_bsc_weight = e.target.value" class="form-control">
            </div>
          </div> -->

          <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
            <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
              <span class="icon one-save"></span> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import API from './API'
export default {
  name: 'AddUpdateLibraryBSCModal',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {

  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span>THÔNG TIN DANH MỤC BSC`,
      input_bsc_code: '',
      // input_bsc_assign_target: '',
      input_bsc_unit: '',
      input_bsc_name: '',
      input_description: '',
      input_calculation_formula: '',
      input_data_source: '',
      input_bsc_weight: '',
    }
  },
  methods: {
    showModal() {
      this.$refs["popupAddUpdateLibraryBSC"].show()
    },
    hideModal() {
      this.$refs["popupAddUpdateLibraryBSC"].hide()
    },
    handleShowModal() {
      this.clear()
      setTimeout(() => {
        this.initPopup()
      }, 200)
    },
    async initPopup() {
      if (!this.isAdd) {
        this.input_bsc_code = this.data.code
        this.input_bsc_unit = this.data.unit
        // this.input_bsc_assign_target = this.data.assign_target
        this.input_bsc_name = this.data.name
        this.input_description = this.data.description
        this.input_calculation_formula = this.data.calculation_formula
        this.input_data_source = this.data.data_source,
        this.input_bsc_weight = this.data.weight
      }
    },
    clear() {
      this.input_bsc_code = ''
      this.input_bsc_unit = '',
      // this.input_bsc_assign_target = ''
      this.input_bsc_name = ''
      this.input_description = ''
      this.input_calculation_formula = ''
      this.input_data_source = '',
      this.input_bsc_weight = ''
    },
    validateBSCLibrary() {
      if (this.input_bsc_unit.trim() === '') {
        this.$toast.error('Vui lòng nhập đơn vị tính!')
        this.$refs.inputUnit?.focus()
        return false
      }

      // if (this.input_bsc_assign_target.trim() === '') {
      //   this.$toast.error('Vui lòng nhập chỉ tiêu giao!')
      //   this.$refs.inputAssignTarget?.focus()
      //   return false
      // }

      if (this.input_bsc_name.trim() === '') {
        this.$toast.error('Vui lòng nhập danh mục chỉ số!')
        this.$refs.inputName?.focus()
        return false
      }

      if (this.input_description.trim() === '') {
        this.$toast.error('Vui lòng nhập mô tả chỉ số!')
        this.$refs.inputDesc?.focus()
        return false
      }

      if (this.input_calculation_formula.trim() === '') {
        this.$toast.error('Vui lòng nhập công thức tính!')
        this.$refs.inputFormula?.focus()
        return false
      }

      if (this.input_data_source.trim() === '') {
        this.$toast.error('Vui lòng nhập nguồn dữ liệu!')
        this.$refs.inputDataSource?.focus()
        return false
      }
      // if (
      //   this.input_bsc_weight === null ||
      //   this.input_bsc_weight === undefined ||
      //   String(this.input_bsc_weight).trim() === ''
      // ) {
      //   this.$toast.error('Vui lòng nhập tỷ trọng!')
      //   this.$refs.inputWeight?.focus()
      //   return false
      // }

      return true
    },
    async addBSCLibrary() {
      if (!this.validateBSCLibrary()) return

      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm danh mục BSC: '${this.input_bsc_name.trim()}'?`)
      if (messConfirm == 0) {
        return
      }

      let dataRequest = {
        code: this.input_bsc_code.trim(),
        unit: this.input_bsc_unit.trim(),
        // assign_target: this.input_bsc_assign_target.trim(),
        name: this.input_bsc_name.trim(),
        description: this.input_description.trim(),
        calculation_formula: this.input_calculation_formula.trim(),
        data_source: this.input_data_source.trim(),
        // weight: this.input_bsc_weight.trim()
        // weight: this.input_bsc_weight ? Number(this.input_bsc_weight) : null
      }
      let result = await API.AddBSCLibrary(this, dataRequest)
      if (result == '1') {
        this.$toast.success('Thêm mới thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async updateBSCLibrary() {
      if (!this.validateBSCLibrary()) return

      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn cập nhật?`)
      if (messConfirm == 0) {
        return
      }

      let dataRequest = {
        bsc_library_id: this.data.bsc_library_id,
        code: this.input_bsc_code.trim(),
        unit: this.input_bsc_unit.trim(),
        // assign_target: this.input_bsc_assign_target.trim(),
        name: this.input_bsc_name.trim(),
        description: this.input_description.trim(),
        calculation_formula: this.input_calculation_formula.trim(),
        data_source: this.input_data_source.trim(),
        // weight: this.input_bsc_weight.trim()
        // weight: this.input_bsc_weight ? Number(this.input_bsc_weight) : null
      }
      let result = await API.UpdateBSCLibrary(this, dataRequest)
      if (result == '1') {
        this.$toast.success('Cập nhật thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async onSave() {
      if (this.isAdd) {
        this.addBSCLibrary()
      } else {
        this.updateBSCLibrary()
      }
    },
    validateNumber(event) {
      const char = String.fromCharCode(event.keyCode)
      if (!/[0-9.]/.test(char)) {
        event.preventDefault()
      }
    },
    onInputWeight(e) {
      let cleanValue = e.target.value.replace(/[^0-9.]/g, '')

      if (cleanValue.length > 4) {
        cleanValue = cleanValue.substring(0, 4)
      }

      this.input_bsc_weight = cleanValue
    }
  },
  mounted() {

  }
}
</script>
<style>
/* #add-update-library-bsc .e-dlg-content {
  overflow: visible !important;
}

@media (max-width: 768px) {
  #add-update-library-bsc{
    overflow-y: auto !important;
    max-height: 500px;
  }
} */
 :deep(.e-control.e-dialog.add-update-library-bsc.e-popup-open .e-dlg-content) {
  max-height: 85vh !important;
  overflow-y: auto;
}
</style>