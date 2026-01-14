<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupUserDayOffDetail" :showCloseIcon="true"
    width="60%" :isModal="true" :target="target" :header="header" :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w180 bold">Mã nhân viên</div>
                <div style="
                    display: flex !important;
                    align-items: center !important;
                  ">
                  <div class="value value-responsive">
                    <input type="text" disabled :value="input_code" @change="e => input_code = e.target.value"
                      class="form-control" />
                  </div>

                </div>
              </div>
            </div>
            <!-- <div class="col-sm-6 col-12">
              <div class="info-row"></div>
            </div> -->

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w180 bold">Họ và tên</div>
                <div style="
                    display: flex !important;
                    align-items: center !important;
                  ">
                  <div class="value value-responsive">
                    <input type="text" disabled :value="input_full_name" @change="e => input_full_name = e.target.value"
                      class="form-control" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">

          </div>

          <div class="col-sm-6 col-12">
            <div class="info-row"></div>
          </div>

          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w180 bold">Công chuẩn</div>
                <div style="
                    display: flex !important;
                    align-items: center !important;
                  ">
                  <div class="value value-responsive">
                    <input type="text" disabled :value="input_total_paid_days"
                      @change="e => input_total_paid_days = e.target.value" class="form-control" />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="info-row">
                  <div class="key w180 bold">
                    Ngày công thực tế<required-marker />
                  </div>
                  <div style="
                      display: flex !important;
                      align-items: center !important;
                    ">
                    <div class="value value-responsive">
                      <input type="number" :value="input_day_off_count" :min="0" :step="0.5"
                        @change="e => input_day_off_count = e.target.value" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="group-buttons -bottom right" style="margin-top: 37px !important; margin-bottom: 10px !important">
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
import moment from 'moment'
import API from './API'
export default {
  name: 'UserDayOffDetailModal',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    isViewDetail: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {

  },
  computed: {
    header() {
      if (this.isAdd) {
        return `<span class="icon one-notepad"></span> Tạo mới nguồn lực`
      } else if (!this.isAdd && !this.isViewDetail) {
        return `<span class="icon one-notepad"></span> Điều chỉnh nguồn lực`
      } else {
        return `<span class="icon one-notepad"></span> Thông tin chấm công`
      }
    },
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },

      input_code: '',
      input_full_name: '',
      input_total_paid_days: '',
      input_day_off_count: '',
    }
  },
  methods: {
    showModal() {
      this.$refs["popupUserDayOffDetail"].show()
    },
    hideModal() {
      this.$refs["popupUserDayOffDetail"].hide()
    },
    handleShowModal() {
      this.clear()
      setTimeout(() => {
        this.initDuLieu()
      }, 200)
    },
    async initDuLieu() {
      console.log(this.data);
      this.input_code = this.data.code
      this.input_full_name = this.data.full_name
      this.input_total_paid_days = this.data.total_paid_days
      this.input_day_off_count = this.data.day_off_count
    },
    copyToClipboard(value) {
      if (!value || value == '') return;
      var result = value.toString().split('-');
      const textarea = document.createElement('textarea');
      textarea.value = result[0];
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$toast.success('Copied!')
    },
    validate() {
      console.log(this.input_day_off_count)
      if (!/^-?\d+(\.\d{1,2})?$/.test(this.input_day_off_count) || isNaN(parseFloat(this.input_day_off_count)) || parseFloat(this.input_day_off_count) < 0) {
        this.$toast.error("Ngày trực tiếp làm việc được hưởng lương không hợp lệ");
        return false;
      }
      if (parseFloat(this.input_day_off_count) > parseFloat(this.input_total_paid_days)) {
        this.$toast.error("Ngày trực tiếp làm việc được hưởng lương phải nhỏ hơn Công chuẩn")
        return false
      }

      return true
    },

    async updateUserDayOff() {
      //Check
      if (!this.validate()) return;
      //
      let dataRequest = {
        day_off_count: this.input_day_off_count,
      }
      let result = await API.UpdateUserDayOff(this, this.data.day_off_id, dataRequest)
      if (result == '1') {
        this.$toast.success('Lưu dữ liệu thành công!')
        this.$emit('successUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async onSave() {
      this.updateUserDayOff()

    },
    clear() {
      this.input_code = ''
      this.input_full_name = ''
      this.input_total_paid_days = ''
      this.input_day_off_count = ''
    },
  }
}
</script>
<style scoped>
.custom-value-btn {
  min-width: 40px !important;
  display: flex !important;
  justify-content: center !important;
}

.value-responsive {
  width: 100%;
}

/* Nếu màn hình < 1000px thì full width */
@media (max-width: 1000px) {
  .value-responsive {
    width: 100% !important;
  }
}
</style>