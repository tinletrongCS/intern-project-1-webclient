<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{X:'center', Y:'center'}"
    :visible="false"
    ref="popupSchedule"
    :showCloseIcon="true"
    width="30%"
    :isModal='true'
    :target="target"
    :header="header"
    :open="handleShowModal"
    :close="clear"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">          
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label class="form-label bold">Presale <span class="text-danger">*</span></label>
                <select2 v-model="presaleId" :options="presale_list" :disabled="isViewDetail" />
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label class="form-label bold">Ngày hẹn <span class="text-danger">*</span></label>
                <ejs-datepicker 
                  v-model="scheduleDate" 
                  format="dd/MM/yyyy" 
                  :showClearButton="true" 
                  :allowEdit="true" 
                  :strict-mode="true" 
                  locale="vi" 
                  :firstDayOfWeek="1" 
                  :enabled="!isViewDetail" 
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label class="form-label bold">Loại CV hỗ trợ <span class="text-danger">*</span></label>
                <select2 v-model="workAssist" :options="workAssistOptions" :disabled="isViewDetail" />
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label class="form-label bold">Tỷ lệ (%) <span class="text-danger">*</span></label>
                <input type="number" v-model="percentage" class="form-control" :disabled="isViewDetail" min="0" max="100">
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label class="form-label bold">Ghi chú</label>
                <textarea v-model="note" class="form-control" rows="3" :disabled="isViewDetail"></textarea>
              </div>
            </div>
          </div>

          <div class="group-buttons -bottom right modal-buttons">
            <button v-if="!isViewDetail" @click="onSave" class="btn btn-primary nocorner btn-save-schedule">
              <span class="icon fa fa-check"></span> Lưu
            </button>
            <button @click="hideModal" class="btn btn-secondary nocorner">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
export default {
  name: 'ScheduleModal',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    isViewDetail: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    presale_list: {
      type: Array,
      default: () => []
    },
    workAssistOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      presaleId: null,
      scheduleDate: null,
      workAssist: null,
      percentage: 20,
      note: ''
    }
  },
  computed: {
    header() {
      return `<span class='icon fa fa-calendar'></span> Đặt lịch PS`;
    }
  },
  methods: {
    showModal() {
      this.$refs["popupSchedule"].show();
    },
    hideModal() {
      this.$refs["popupSchedule"].hide();
    },
    handleShowModal() {
      this.clear();
      if(!this.isAdd){
        this.loadData();
      }
    },
    clear() {
      this.presaleId = null;
      this.scheduleDate = null;
      this.workAssist = null;
      this.percentage = 20;
      this.note = '';
    },
    loadData() {
      if(this.data){
        // Tìm presaleId từ text
        const presaleItem = this.presale_list.find(p => p.text === this.data.presale);
        this.presaleId = presaleItem ? presaleItem.id : null;
        this.workAssist = this.data.workAssist || null;
        this.scheduleDate = this.data.scheduleDate ? new Date(this.data.scheduleDate.split('/').reverse().join('-')) : null;
        this.percentage = this.data.projectRate || 20;
        this.note = this.data.note || '';
      }
    },
    onSave() {
      // Validate required fields
      if (!this.presaleId || !this.scheduleDate || !this.workAssist || !this.percentage) {
        this.$toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
        return;
      }
      
      if (this.percentage < 0 || this.percentage > 100) {
        this.$toast.error('Tỷ lệ phải từ 0 đến 100!');
        return;
      }
      
      this.$emit('successSchedule', {
        presaleId: this.presaleId,
        scheduleDate: this.scheduleDate,
        workAssist: this.workAssist,
        percentage: this.percentage,
        note: this.note
      });
      this.hideModal();
    }
  }
}
</script>