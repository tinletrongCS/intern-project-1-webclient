<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{X:'center', Y:'center'}"
    :visible="false"
    ref="popupService"
    :showCloseIcon="true"
            width="60%"
    :isModal='true'
    :target="target"
    :header="header"
    :open="handleShowModal"
    :close="clear"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <h5 v-if="isViewDetail" class="text-primary bold mb-3">
                A. Thông tin chung
          </h5>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Khách hàng <span class="text-danger">*</span></label>
                <select2 v-model="customerId" :options="customer_list" :disabled="isViewDetail" />
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Dịch vụ <span class="text-danger">*</span></label>
                <select2 v-model="serviceId" :options="service_list" :disabled="isViewDetail" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Mã dự án OneBss <span class="text-danger">*</span></label>
                <input type="text" v-model="projectCode" class="form-control" :disabled="isViewDetail">
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Loại doanh thu <span class="text-danger">*</span></label>
                <select2 v-model="revenueType" :options="revenue_type_list" :disabled="isViewDetail" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Đơn giá <span class="text-danger">*</span></label>
                <input type="text" v-model="unitPrice" class="form-control" :disabled="isViewDetail" @input="formatCurrency($event, 'unitPrice')">
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Số lượng <span class="text-danger">*</span></label>
                <input type="number" v-model="quantity" class="form-control" :disabled="isViewDetail">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Thành tiền <span class="text-danger">*</span></label>
                <input type="text" v-model="totalAmount" class="form-control" :disabled="true">
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Hệ số quy đổi <span class="text-danger">*</span></label>
                <input type="number" v-model="conversionRate" class="form-control" :disabled="isViewDetail">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Doanh thu quy đổi <span class="text-danger">*</span></label>
                <input type="text" v-model="convertedRevenue" class="form-control" :disabled="true">
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">% chi phí <span class="text-danger">*</span></label>
                <input type="number" v-model="costPercent" class="form-control" :disabled="isViewDetail">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Chi phí dự kiến</label>
                <input type="text" v-model="expectedCost" class="form-control" :disabled="true">
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="form-group">
                <label class="form-label bold">Ngày ĐK nghiệm thu</label>
                <ejs-datepicker v-model="acceptanceDate" format="dd/MM/yyyy" :showClearButton="true" :allowEdit="true" :strict-mode="true" locale="vi" :firstDayOfWeek="1" :enabled="!isViewDetail" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label class="form-label bold">Ghi chú</label>
                <textarea v-model="note" class="form-control" rows="2" :disabled="isViewDetail"></textarea>
              </div>
            </div>
          </div>

          <!-- Hiển thị Lịch sử thay đổi khi xem chi tiết -->
          <div v-if="isViewDetail" class="row">
            <div class="mb-4">
              <h5 class="text-primary bold mb-3">
                B. Lịch sử thay đổi
              </h5>
              <KDataGrid
                ref="historyGrid"
                :columns="historyColumns"
                :dataSource="serviceHistory"
                :enable-paging-server="false"
                :allowPaging="false"
                :showFilter="false"
                :showColumnCheckbox="false"
                :enabledSelectFirstRow="false"
                :showSTT="true"
                height="200"
              />
            </div>
          </div>

          <div class="group-buttons -bottom right mt-5">
            <button v-if="!isViewDetail" @click="onSave" class="btn btn-primary nocorner">
              <span class="icon fa fa-check"></span> {{ isAdd ? 'Tạo mới' : 'Lưu thay đổi' }}
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
  name: 'ServiceModal',
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
    customer_list: {
      type: Array,
      default: () => []
    },
    service_list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      customerId: null,
      serviceId: null,
      projectCode: '',
      revenueType: 1,
      unitPrice: '',
      quantity: 1,
      totalAmount: '',
      conversionRate: 1,
      convertedRevenue: '',
      revenue: '',
      costPercent: 0,
      expectedCost: '',
      acceptanceDate: null,
      note: '',
      revenue_type_list: [
        { id: 1, text: 'Thu một lần' },
        { id: 2, text: 'Thu định kỳ' }
      ],
      serviceHistory: [],
      historyColumns: [
        {
          fieldName: 'userName',
          headerText: 'Người chỉnh sửa',
          width: '150'
        },
        {
          fieldName: 'changeCol',
          headerText: 'Cột thay đổi',
          width: '120'
        },
        {
          fieldName: 'changeColumn',
          headerText: 'Nội dung cũ',
          width: '200'
        },
        {
          fieldName: 'newValue',
          headerText: 'Nội dung mới',
          width: '200'
        },
        {
          fieldName: 'changeTime',
          headerText: 'Thời gian điều chỉnh',
          width: '150',
          textAlign: 'Center'
        }
      ]
    }
  },
  computed: {
    header() {
      if(this.isAdd){
        return `<span class='icon fa fa-plus'></span> Tạo mới dịch vụ theo khách hàng`;
      }else if(!this.isAdd&&!this.isViewDetail){
        return `<span class='icon one-edit'></span> Điều chỉnh dịch vụ`;
      }else{
        return `<span class='icon fa fa-eye'></span> Chi tiết dịch vụ`;
      }
    }
  },
  watch: {
    unitPrice: 'calculateAll',
    quantity: 'calculateAll',
    conversionRate: 'calculateAll',
    costPercent: 'calculateAll'
  },
  methods: {
    showModal() {
      this.$refs["popupService"].show();
    },
    hideModal() {
      this.$refs["popupService"].hide();
    },
    handleShowModal() {
      this.clear();
      if(!this.isAdd){
        this.loadData();
        // Load lịch sử thay đổi khi xem chi tiết
        if (this.isViewDetail && this.data && this.data.id) {
          this.loadServiceHistory();
        }
      }
    },
    clear() {
      this.customerId = null;
      this.serviceId = null;
      this.projectCode = '';
      this.revenueType = 1;
      this.unitPrice = '';
      this.quantity = 1;
      this.totalAmount = '';
      this.conversionRate = 1;
      this.convertedRevenue = '';
      this.revenue = '';
      this.costPercent = 0;
      this.expectedCost = '';
      this.acceptanceDate = null;
      this.note = '';
      this.serviceHistory = [];
    },
    loadServiceHistory() {
      // Dữ liệu mẫu cho lịch sử thay đổi
      this.serviceHistory = [
        {
          userName: 'Lê Bảo Hoàng',
          changeCol: 'Đơn giá',
          changeColumn: '259.890',
          newValue: '325.900',
          changeTime: '12/09/2025 13:15'
        },
        {
          userName: 'Nguyễn Văn An',
          changeCol: 'Trạng thái',
          changeColumn: 'Chờ xác nhận',
          newValue: 'Đã trả lại',
          changeTime: '12/09/2025 15:15'
        }
      ];
    },
    loadData() {
      if(this.data){
        this.customerId = this.data.id.customer_id;
        this.serviceId = this.data.id.service_id;
        this.projectCode = this.data.project || '';
        this.revenueType = this.data.revenueType === 'Thu một lần' ? 1 : 2;
        this.unitPrice = this.data.unitPrice?.toLocaleString('de-DE') || '0';
        this.quantity = this.data.quantity || 1;
        this.conversionRate = this.data.conversionRate || 0;
        this.costPercent = this.data.costPercent || 0;
        this.acceptanceDate = this.data.acceptanceDate ? new Date(this.data.acceptanceDate.split('/').reverse().join('-')) : null;
        this.note = this.data.note || '';
        this.calculateAll();
      }
    },
    parseCurrency(value) {
      return parseInt(String(value).replace(/[^\d]/g, '')) || 0;
    },
    formatCurrency(value) {
      return value ? Number(value).toLocaleString('de-DE') : '0';
    },

    handleInput(event, model) {
      this[model] = this.formatCurrency(this.parseCurrency(event.target.value));
    },

    calculateAll() {
      const price = this.parseCurrency(this.unitPrice);
      const qty = parseInt(this.quantity) || 0;
      const rate = parseInt(this.conversionRate) || 0;
      const percent = parseFloat(this.costPercent) || 0;

      // Công thức 1: Thành tiền (Doanh thu dự kiến/thực tế)
      const total = price * qty;
      this.totalAmount = this.formatCurrency(total);

      // Công thức 2: Doanh thu quy đổi
      const converted = (total * rate) / 100;
      this.convertedRevenue = this.formatCurrency(converted);

      // Công thức 3: Chi phí dự kiến
      const cost = (converted * percent) / 100;
      this.expectedCost = this.formatCurrency(cost);
    },
    
    onSave() {
      if (!this.customerId || !this.serviceId) {
        this.$toast.error('Vui lòng chọn Khách hàng và Dịch vụ!');
        return;
      }

      const payload = {
        CustomerId: this.customerId,
        ServiceId: this.serviceId,
        RevenueType: this.revenueType,
        Quantity: parseInt(this.quantity) || 0,
        UnitPrice: this.parseCurrency(this.unitPrice),
        ExpectedRevenue: this.parseCurrency(this.expectedCost), // Chi phí dự kiến
        ActualRevenue: this.parseCurrency(this.totalAmount), // Thành tiền
        ConversionRate: parseInt(this.conversionRate) || 0,
        ConvertedRevenue: this.parseCurrency(this.convertedRevenue), // Doanh thu quy đổi
        CostPercent: parseInt(this.costPercent) || 0,
        TotalCost: this.parseCurrency(this.expectedCost), // Chi phí dự kiến
        ProjectCode: this.projectCode,
        AcceptanceDate: this.acceptanceDate,
        Note: this.note
      };
      
      this.$emit('successService', payload);
      this.hideModal();
    }
  }
}
</script>
