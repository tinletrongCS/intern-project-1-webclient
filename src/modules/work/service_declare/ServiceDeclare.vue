<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80 bold">Khách hàng</div>
              <div class="value">
                <select2 v-model="customer_selected" :options="customer_list" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w50 bold">Dịch vụ</div>
              <div class="value">
                <select2 v-model="service_selected" :options="service_list" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-form">
        <div class="info-row">
          <div class="group-buttons -bottom">
            <button class="btn btn-second" style="min-width: 100px;" @click.prevent="addService">
              <span class="icon fa fa-plus"></span>&nbsp;Tạo mới
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click.prevent="editService">
              <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteService">
              <span class="icon one-trash"></span>&nbsp;Xóa
            </button>&nbsp;
            <button class="btn btn-primary" style="min-width: 100px;" @click.prevent="bookSchedule">
              <span class="icon fa fa-calendar"></span>&nbsp;Đặt lịch
            </button>
          </div>
        </div>
        <KDataGrid
          ref="serviceGrid"
          :columns="columns"
          :dataSource="dataSource"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="false"
          :showColumnCheckbox="true"
          :enabledSelectFirstRow="false"
          :showSTT="true"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
          @rowSelected="onRowSelected"
          @recordDoubleClick="onRecordDoubleClick"
        />
      </div>
    </div>
    
    <!-- Modal tạo mới/chỉnh sửa/xem chi tiết dịch vụ -->
    <ServiceModal ref="serviceModal"
      :isAdd="is_add_new"
      :isViewDetail="is_view_detail"
      @successService="successService"
      :data="row_selected"
      :customer_list="customer_list"
      :service_list="service_list"/>
      
    <!-- Modal đặt lịch -->
    <ScheduleModal ref="scheduleModal"
      :isAdd="true"
      :isViewDetail="false"
      @successSchedule="onScheduleCreated"
      :presale_list="presale_list"
      :workAssistOptions="workAssistOptions"/>
  </div>
</template>

<script>
import ServiceModal from './ServiceModal.vue';
import ScheduleModal from '../schedule_management/ScheduleModal.vue';
import ProjectAPI from '../../project/pipeline/ProjectAPI.js';
import ServiceDeclareAPI from './ServiceDeclareAPI.js';
export default {
  name: "ServiceDeclare",
  components: {
    ServiceModal,
    ScheduleModal
  },
  data() {
    return {
      header: {
        title: "Khai báo dịch vụ",
        list: []
      },
      customer_selected: 0,
      service_selected: 0,
      is_add_new: false,
      is_view_detail: true,
      row_selected: {},
      customer_list: [
        { id: 0, text: 'Tất cả' }
      ],
      service_list: [
        { id: 0, text: 'Tất cả' }
      ],
      presale_list: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'Nguyễn Văn A' },
        { id: 2, text: 'Trần Thị B' }
      ],
      workAssistOptions: [
        { id: 1, text: 'Khảo sát xây dựng phương án kỹ thuật' },
        { id: 2, text: 'Giới thiệu DV: TSL, INT LL, SIP, ...' },
        { id: 3, text: 'Dịch vụ CNTT nhóm BC' }
      ],
      isLoading: false,
      columns: [
        { fieldName: 'customer', headerText: 'Khách hàng', width: 200 },
        { fieldName: 'service', headerText: 'Dịch vụ', width: 150 },
        { fieldName: 'revenueType', headerText: 'Loại doanh thu', width: 120 },
        { fieldName: 'quantity', headerText: 'Số lượng', width: 80, type: 'number', textAlign: 'Center' },
        { fieldName: 'unitPrice', headerText: 'Đơn giá', width: 120 },
        { fieldName: 'expectedRevenue', headerText: 'Doanh thu dự kiến', width: 140 },
        { fieldName: 'actualRevenue', headerText: 'Doanh thu thực hiện', width: 140 },
        { fieldName: 'conversionRate', headerText: 'Hệ quy đổi', width: 100 },
        { fieldName: 'convertedRevenue', headerText: 'Doanh thu quy đổi', width: 140 },
        { fieldName: 'costPercent', headerText: '% chi phí', width: 80 },
        { fieldName: 'project', headerText: 'Dự án', width: 100 },
        { fieldName: 'totalCost', headerText: 'Chi phí tổng', width: 120 },
        { fieldName: 'acceptanceDate', headerText: 'Ngày nghiệm thu', width: 120 },
        { fieldName: 'presale', headerText: 'Presale', width: 120 },
        { fieldName: 'scheduleDate', headerText: 'Ngày hẹn', width: 120 },
        { fieldName: 'projectRate', headerText: 'Tỷ lệ dự án', width: 100 },
        { fieldName: 'status', headerText: 'Trạng thái', width: 120 }
      ],
      dataSource: []
    }
  },
  watch: {
    customer_selected() {
      this.loadGridData();
    },
    service_selected() {
      this.loadGridData();
    }
  },
  async mounted() {
    this.loading(true);
    await this.loadCustomers();
    await this.loadServices();
    await this.loadGridData();
    this.loading(false);
  },
  methods: {
    loading(state) {
      this.isLoading = state;
    },
    async loadCustomers() {
      try {
        const customers = await ProjectAPI.GetActiveCustomers(this);
        this.customer_list = [
          { id: 0, text: 'Tất cả' },
          ...(customers || [])
        ];
      } catch (error) {
        console.error('Error loading customers:', error);
        this.$toast.error('Lỗi khi tải danh sách khách hàng');
      }
    },
    async loadServices() {
      try {
        const services = await ProjectAPI.GetAllServices(this);
        this.service_list = [
          { id: 0, text: 'Tất cả' },
          ...services
        ];
      } catch (error) {
        console.error('Error loading services:', error);
        this.$toast.error('Lỗi khi tải danh sách dịch vụ');
      }
    },
    async loadGridData() {
      const response = await ServiceDeclareAPI.GetAll(this, this.customer_selected, this.service_selected);
      if (response && response.success) {
        this.dataSource = response.data.map(item => ({
          ...item,
          unitPrice: Number(item.unitPrice || 0).toLocaleString('de-DE'),
          expectedRevenue: Number(item.expectedRevenue || 0).toLocaleString('de-DE'),
          actualRevenue: Number(item.actualRevenue || 0).toLocaleString('de-DE'),
          convertedRevenue: Number(item.convertedRevenue || 0).toLocaleString('de-DE'),
          totalCost: Number(item.totalCost || 0).toLocaleString('de-DE')
        }));
      } else {
        this.dataSource = [];
      }
    },
    addService() {
      this.is_add_new = true
      this.is_view_detail = false
      this.row_selected = {}
      this.$refs.serviceModal.showModal()
    },
    bookSchedule() {
      this.$refs.scheduleModal.showModal();
    },
    getSelectedRow() {
      try {
        if (this.$refs.serviceGrid) {
          const selectedRecords = this.$refs.serviceGrid.getSelectedRecords();
          
          if (selectedRecords.length > 1) {
            return;
          }
          
          return selectedRecords.length === 1 ? selectedRecords[0] : null;
        }
      } catch (error) {
        console.error('Error getting selected row:', error)
      }
      return null
    },
    viewDetail(rowData) {
      this.is_add_new = false;
      this.is_view_detail = true;
      this.row_selected = rowData;
      this.$refs.serviceModal.showModal();
    },
    editService() {
      const dsSelected = this.$refs.serviceGrid.getSelectedRecords();
      if (dsSelected.length === 0) {
          this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!');
          return;
      }
      if (dsSelected.length > 1) {
          this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!');
          return;
      }
      this.is_add_new = false;
      this.is_view_detail = false;
      this.row_selected = dsSelected[0];
      this.$refs.serviceModal.showModal();
    },
    async deleteService() {
      let dsSelected = this.$refs.serviceGrid.getSelectedRecords();
      if (dsSelected.length === 0) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng cần xóa!');
        return;
      }
      const confirmation = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa ${dsSelected.length} dịch vụ đang chọn?`);
      if (confirmation !== 'ok') return;

      this.loading(true);
      let successCount = 0;
      for (const item of dsSelected) {
        const response = await ServiceDeclareAPI.Delete(this, item.id.customer_id, item.id.service_id);
        if (response && response.success) {
          successCount++;
        }
      }
      this.loading(false);

      if (successCount > 0) {
        this.$toast.success(`Đã xóa thành công ${successCount} dịch vụ.`);
        await this.loadGridData();
      }
    },
    onRowSelected(args) {
      this.row_selected = args.data
    },
    onRecordDoubleClick(args) {
      if (args.rowData) {
        this.viewDetail(args.rowData)
      }
    },
    async successService(payload) {
      this.loading(true);
      let response;
      if (this.is_add_new) {
        response = await ServiceDeclareAPI.Add(this, payload);
      } else {
        response = await ServiceDeclareAPI.Update(this, payload);
      }
      this.loading(false);

      if (response && response.success) {
        this.$toast.success(response.message);
        await this.loadGridData();
      }
    },
    onScheduleCreated(scheduleData) {
      // Cập nhật dữ liệu mẫu với thông tin đặt lịch mới
      const presale = this.presale_list.find(p => p.id === scheduleData.presaleId);
      const formattedDate = scheduleData.scheduleDate ? 
        scheduleData.scheduleDate.toLocaleDateString('vi-VN') : '';
      
      // Cập nhật item đầu tiên hoặc thêm mới (demo)
      if (this.dataSource.length > 0) {
        this.dataSource[0].presale = presale ? presale.text : '';
        this.dataSource[0].scheduleDate = formattedDate;
        this.dataSource[0].projectRate = scheduleData.percentage;
        this.dataSource[0].status = 'Đã đặt lịch';
      }
      
      this.$toast.success('Đặt lịch thành công!');
    }
  }
}
</script>