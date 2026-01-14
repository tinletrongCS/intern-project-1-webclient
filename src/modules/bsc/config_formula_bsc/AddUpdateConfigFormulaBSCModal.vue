<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupAddUpdateLibraryBSC" :showCloseIcon="true"
    width="60%" :isModal='true' :target="target" :header="header" id="add-update-config-bsc" :open="handleShowModal">
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
                <div class="key w150 bold">Loại chỉ số</div>
                <div class="value">
                  <select2 v-model='input_violate' :options="data_violate" ref="inputDataType"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w150 bold">Danh mục chỉ số<required-marker /></div>
                <div class="value">
                  <input type="text" :value="input_bsc_name" @change="e => input_bsc_name = e.target.value" disabled
                    class="form-control">
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w150 bold">Loại dữ liệu<required-marker /></div>
                <div class="value">
                  <select2 v-model='input_data_type' :options="data_type_list" ref="inputDataType"
                    @select="onChangeDataType" />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w150 bold">Schema<required-marker v-if="formulaAuto" /></div>
                <div class="value">
                  <input type="text" :value="input_schema" @change="e => input_schema = e.target.value"
                    :disabled="!formulaAuto" ref="inputSchema" class="form-control">
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w150 bold">Function<required-marker v-if="formulaAuto" /></div>
                <div class="value">
                  <input type="text" :value="input_function" @change="e => input_function = e.target.value"
                    :disabled="!formulaAuto" ref="inputFunction" class="form-control">
                </div>
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="key w150 bold">Công thức/ Cách đo lường<required-marker /></div>
            <div class="value">
              <textarea ref="inputCalculationFormula" :value="input_calculation_formula"
                @change="e => input_calculation_formula = e.target.value" disabled class="form-control"
                rows="3"></textarea>
            </div>
          </div>
          <!-- <div class="info-row">
            <div class="key w150 bold">Công thức đánh giá<required-marker v-if="!formulaAuto" /></div>
            <div class="value">
              <textarea ref="inputFormula" v-model.trim="input_formula" :placeholder="placeholderFormula"
                @change="onChangeTextArea" class="form-control" rows="3" :class="{ 'is-invalid': hasError }"
                :disabled="formulaAuto"></textarea>
              <div v-if="hasError" class="invalid-feedback">
                {{ errorMessage }}
              </div>
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
import API from './ConfigFormulaBSCApi'
export default {
  name: 'AddUpdateConfigFormulaBSCModal',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    codeList: {
      type: Array,
      default: () => []
    }
  },
  components: {

  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span>CẤU HÌNH CHỈ SỐ BSC`,
      input_bsc_code: '',
      input_bsc_name: '',
      input_data_type: '',
      input_violate: '',
      input_schema: '',
      input_function: '',
      input_calculation_formula: '',
      // input_formula: '',
      data_type_list: [
        { id: 1, text: 'Thủ công' },
        { id: 2, text: 'Tự động' }
      ],
      hasError: false,
      errorMessage: '',
      placeholderFormula: '',
      formulaAuto: false,
      data_violate: [
        { id: "violate", text: 'Chấp hành nội quy' },
        { id: "revenue", text: 'Chỉ tiêu doanh thu (PS)' }
      ],
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
        this.onChangeDataType()
      }, 200)
    },
    async initPopup() {
      if (!this.isAdd) {
        this.input_bsc_code = this.data.code
        this.input_bsc_name = this.data.name
        this.input_data_type = this.data.data_type
        this.input_violate = this.data.violate
        this.input_schema = this.data.schema
        this.input_function = this.data.function
        this.input_calculation_formula = this.data.calculation_formula
        // this.input_formula = this.data.formula
      }
    },
    clear() {
      this.input_bsc_code = ''
      this.input_bsc_name = ''
      this.input_data_type = ''
      this.input_violate = ''
      this.input_schema = ''
      this.input_function = ''
      this.input_calculation_formula = ''
      // this.input_formula = ''
    },
    validateBSCLibrary() {
      if (!this.input_data_type || this.input_data_type.trim?.() === '') {
        this.$toast.error('Vui lòng chọn loại dữ liệu!');
        this.$refs.inputDataType?.focus();
        return false;
      }

      if (this.formulaAuto === true) {
        if (!this.input_schema || this.input_schema.trim() === '') {
          this.$toast.error('Vui lòng nhập tên schema!');
          this.$refs.inputSchema?.focus();
          return false;
        }

        if (!this.input_function || this.input_function.trim() === '') {
          this.$toast.error('Vui lòng nhập tên function!');
          this.$refs.inputFunction?.focus();
          return false;
        }
      }

      else {
        // if (!this.input_formula || this.input_formula.trim() === '') {
        //   this.$toast.error('Vui lòng nhập công thức tính!');
        //   this.$refs.inputFormula?.focus();
        //   return false;
        // }
      }

      return true;
    }
    ,
    async updateBSCLibrary() {
      if (!this.validateBSCLibrary()) return

      if (this.hasError === true) {
        this.$toast.error('Công thức đang sai, vui lòng kiểm tra lại!');
        this.$refs.inputFormula?.focus();
        return;
      }

      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn cập nhật?`)
      if (messConfirm == 0) {
        return
      }

      let dataRequest = {
        bsc_library_id: this.data.bsc_library_id,
        code: this.input_bsc_code.trim(),
        name: this.input_bsc_name.trim(),
        data_type: this.input_data_type,
        calculation_formula: this.input_calculation_formula.trim(),
        violate: this.input_violate
      };
      if (this.formulaAuto === true) {
        dataRequest.schema = this.input_schema?.trim() || null;
        dataRequest.function = this.input_function?.trim() || null;
        dataRequest.formula = null;
      }

      else {
        dataRequest.schema = null;
        dataRequest.function = null;
        // dataRequest.formula = this.input_formula?.trim() || null;
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
    },
    onChangeTextArea(e) {
      if (this.input_data_type == 2) {
        this.hasError = false;
        return;
      }

      const value = (this.input_formula || "").trim();

      if (!value.startsWith("=")) {
        this.hasError = true;
        this.errorMessage = "Công thức phải bắt đầu bằng dấu '='.";
        return;
      }

      const formulaBody = value.slice(1);  // bỏ '=' phía đầu

      const tokens = formulaBody
        .split(/[\+\-\*\/\^\(\)]/g)
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const variableTokens = tokens.filter(t => isNaN(Number(t)));

      const codeSet = new Set(this.codeList);
      const invalidTokens = variableTokens.filter(t => !codeSet.has(t));

      if (invalidTokens.length > 0) {
        this.hasError = true;
        this.errorMessage = `Các mã sau không hợp lệ: ${invalidTokens.join(", ")}`;
        return;
      }

      const validPattern = /^=[A-Za-z0-9+\-*/^().\s]+$/;
      if (!validPattern.test(value)) {
        this.hasError = true;
        this.errorMessage = "Công thức chứa ký tự không hợp lệ!";
        return;
      }

      const invalidEndPattern = /[+\-*/^.(]$/;
      if (invalidEndPattern.test(value)) {
        this.hasError = true;
        this.errorMessage = "Công thức không được kết thúc bằng ký tự đặc biệt!";
        return;
      }

      const consecutiveOps = /[+\-*/^]{2,}/;
      if (consecutiveOps.test(value)) {
        this.hasError = true;
        this.errorMessage = "Công thức có hai toán tử liền nhau!";
        return;
      }

      this.hasError = false;
      this.errorMessage = "";
    }
    ,
    onChangeDataType(e) {
      this.placeholderFormula = this.input_data_type == 2 ? '' : 'Nhập công thức, ví dụ: =A1+B2'
      this.formulaAuto = this.input_data_type == 2 ? true : false;
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
:deep(.e-control.e-dialog.add-update-config-bsc.e-popup-open .e-dlg-content) {
  max-height: 85vh !important;
  overflow-y: auto;
}
</style>