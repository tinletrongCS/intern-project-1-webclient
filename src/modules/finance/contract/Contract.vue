<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control">
        <div class="row">
          <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key w150 bold">Tìm kiếm</div>
              <div class="value">
                <input type="text" v-model="search_query" class="form-control" placeholder="Nhập số hợp đồng hoặc tên hợp đồng..." @input="searchContracts">
              </div>
            </div>
          </div>
          <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key w150 bold">Hình thức hợp đồng</div>
              <div class="value">
                <select2 v-model='contract_type_selected' :options="contract_types" @select="onContractTypeChange" />
              </div>
            </div>
          </div>
          <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key w100 bold">Trạng thái</div>
              <div class="value">
                <select2 v-model='status_selected' :options="statuses" @select="onStatusChange" />
              </div>
            </div>
          </div>
          <!-- Nút mở rộng tìm kiếm nâng cao -->
          <div class="form-seach-more">
            <div class="info-row">
              <div class="value text-right">
                <button
                  class="btn btn-circle btn-expand"
                  @click="toggleAdvancedSearch"
                  :class="{ 'expanded': show_advanced_search }"
                  title="Mở rộng tìm kiếm"
                >Tìm kiếm mở rộng
                  <i class="fa" :class="{ 'fa-chevron-down': !show_advanced_search, 'fa-chevron-up': show_advanced_search }"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="show_advanced_search" class="advanced-search-section">
          <!-- Tìm kiếm theo dự án -->
          <div class="row">
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w150 bold">Dự án</div>
                <div class="value">
                  <select2 v-model='advanced_search.project_id' :options="project_list_for_filter" @select="searchContracts" />
                </div>
              </div>
            </div>
            <!-- Tìm kiếm theo khách hàng -->
            <div class="col-sm-4 col-12">
            <div class="info-row">
                <div class="key w150 bold">Khách hàng</div>
                  <div class="value">
                    <!-- <select2 v-model='advanced_search.customer_id' :options="customer_list_for_filter" @select="searchContracts" /> -->
                    <CustomerSelect ref="customerSelect" 
                      v-model="khachhang_selected"
                      :customerName="khachhang_selected.text"
                      @select="searchContracts"
                      :isSelectAll="false"/>
                  </div>
                </div>
            </div>
          </div>

          <!-- Tìm kiếm theo ngày tháng -->
          <div class="row">
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w150 bold">Ngày ký</div>
                <div class="value">
                  <ejs-datepicker
                    v-model="advanced_search.signing_date_from"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="true"
                    :strict-mode="true"
                    locale="vi"
                    :firstDayOfWeek="1"
                    @change="searchContracts"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w150 bold">Thời gian thực hiện</div>
                <div class="value">
                  <ejs-datepicker
                    v-model="advanced_search.execution_time"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="true"
                    :strict-mode="true"
                    locale="vi"
                    :firstDayOfWeek="1"
                    @change="searchContracts"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w150 bold">Ngày bắt đầu hiệu lực</div>
                <div class="value ">
                  <ejs-datepicker
                    v-model="advanced_search.effective_date"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="true"
                    :strict-mode="true"
                    locale="vi"
                    :firstDayOfWeek="1"
                    @change="searchContracts"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w150 bold">Ngày kết thúc hiệu lực</div>
                <div class="value">
                  <ejs-datepicker
                    v-model="advanced_search.expiry_date"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="true"
                    :strict-mode="true"
                    locale="vi"
                    :firstDayOfWeek="1"
                    @change="searchContracts"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12">
              <div class="info-row text-right">
                <button class="btn btn-secondary ml-2" @click="clearAdvancedSearch">
                  <i class="fa fa-eraser"></i> Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-form">
            <div class="info-row">
              <div class="info-row">
                <div class="group-buttons -bottom">
                  <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ThemMoi()">
                    <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
                  </button>&nbsp;

                  <button class="btn btn-second" style="min-width: 100px;" @click.prevent="editContract()">
                    <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                  </button>&nbsp;
                  
                  <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteContract()">
                    <span class="icon one-trash"></span>&nbsp;Xóa
                  </button>&nbsp;
                  
                  <button class="btn btn-second" style="min-width: 150px;" @click.prevent="handlePhuLucHopDong">
                      <span class="icon fa fa-files-o"></span>&nbsp;Phụ lục HĐ
                  </button>&nbsp;
                  
                  <button class="btn btn-second" style="min-width: 120px;" @click.prevent="handleDoanhThu">
                      <span class="icon fa fa-money"></span>&nbsp;Doanh thu
                  </button>&nbsp;
                  
                  <button class="btn btn-second" style="min-width: 180px;" @click.prevent="handleDoanhThuHopDong">
                      <span class="icon fa fa-bar-chart"></span>&nbsp;Doanh thu HĐ
                  </button>
                </div>
              </div>
        </div>
          <KDataGrid
            ref="gridDs"
            :columns="filteredColumns"
            :dataSource="data_sources"
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
    
    <!-- Modal tạo mới/chỉnh sửa/xem chi tiết hợp đồng -->
    <ContractModal ref="contractModal"
      :isAdd="is_add_new"
      :isViewDetail="is_view_detail"
      @successContract="successContract"
      :data="row_selected"
      :service_list="all_services"
      :user_list="all_users"
      :unit_list="all_units"
      :project_list="all_projects"
      :customer_list="all_customers"
      :contract_type="currentContractType"/>
      
    <!-- Modal quản lý phụ lục hợp đồng -->
    <ContractAppendixModal ref="appendixModal"
      :contractData="row_selected"/>
      
    <!-- Modal thông tin doanh thu hợp đồng -->
    <ContractRevenueModal ref="revenueModal"
      :contractData="row_selected"/>
      
    <!-- Modal quản lý doanh thu hợp đồng -->
    <ContractRevenueManagementModal ref="revenueManagementModal"
      :contractData="row_selected"/>
  </div>
</template>

<script>
import moment from 'moment'
import ContractModal from './popups/ContractModal.vue'
import ContractAppendixModal from './popups/ContractAppendixModal.vue'
import ContractRevenueModal from './popups/ContractRevenueModal.vue'
import ContractRevenueManagementModal from './popups/ManagementContractRevenueModal.vue'
import CustomerSelect from '@/modules/work/kanban/search/CustomerSelect.vue'
import API from './API.js' 

export default {
  name: "FinanceContract",
  components: {
    ContractModal,
    ContractAppendixModal,
    ContractRevenueModal,
    ContractRevenueManagementModal,
    CustomerSelect
  },
  data() {
    return {
      header: {
        title: "Hợp đồng",
        list: [],
      },
      all_projects: [],
      search_query: '',
      show_advanced_search: false,
      advanced_search: {
        project_id: 0,
        customer_id: null, //'Tất cả',
        signing_date_from: null,
        execution_time: null,
        effective_date: null,
        expiry_date: null
      },
      khachhang_selected:{
        id: 0,
        selected:true,
        text:""
      },
      contract_type_selected: 0,
      status_selected: 0,
      contract_types: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'Mua trọn gói' },
        { id: 2, text: 'Thuê dịch vụ' },
        { id: 3, text: 'Khác' },
      ],
      statuses: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'Còn hiệu lực' },
        { id: 2, text: 'Hết hiệu lực' },
      ],
      data_sources: [],
      original_data_sources: [],
      is_loading: false,
      is_add_new: false,
      is_view_detail: true,
      row_selected: {},
      all_services: [],
      all_users: [],
      all_units: [],
      all_customers: [],
      columns: [
        {
          fieldName: 'contractNumber',
          headerText: 'Số hợp đồng',
          allowFiltering: true,
          textAlign: 'center',
          width: '150'
        },
        {
          fieldName: 'contractName',
          headerText: 'Tên hợp đồng',
          allowFiltering: true,
          width: '250'
        },
        {
          fieldName: 'contractType',
          headerText: 'Hình thức hợp đồng',
          allowFiltering: true,
          extAlign: 'center',
          width: '180'
        },
        {
          fieldName: 'signingDate',
          headerText: 'Ngày ký hợp đồng',
          allowFiltering: true,
          textAlign: 'center',
          width: '170',
          valueAccessor: this.formatDate
        },
        {
          fieldName: 'effectiveDate',
          headerText: 'Ngày bắt đầu hiệu lực',
          allowFiltering: true,
          textAlign: 'center',
          width: '200',
          valueAccessor: this.formatDate
        },
        {
          fieldName: 'expiryDate', 
          headerText: 'Ngày kết thúc hiệu lực', 
          allowFiltering: true, 
          textAlign: 'center', 
          width: '200', 
          valueAccessor: this.formatDate
        },
        {
          fieldName: 'executionTime',
          headerText: 'Thời gian thực hiện hợp đồng', 
          allowFiltering: true, 
          textAlign: 'center', 
          width: '250', 
          valueAccessor: this.formatDate
        },
        {
          fieldName: 'valueBeforeTax',
          headerText: 'Giá trị trước thuế (VND)', 
          allowFiltering: true, 
          width: '200', 
          valueAccessor: this.formatVND
        },
        {
          fieldName: 'valueAfterTax', 
          headerText: 'Giá trị sau thuế (VND)', 
          allowFiltering: true, 
          width: '200', 
          valueAccessor: this.formatVND
        },
        {
          fieldName: 'project',
          headerText: 'Dự án', 
          allowFiltering: true, 
          textAlign: 'center', 
          width: '250',
          valueAccessor: this.getProjectName
        },
        {
          fieldName: 'customerName',
          headerText: 'Tên khách hàng', 
          allowFiltering: true, 
          width: '200'
        },
        {
          fieldName: 'status',
          headerText: 'Trạng thái', 
          allowFiltering: true, 
          textAlign: 'center', 
          width: '120'
        }
      ],
    }
  },
  computed: {
    customer_list_for_filter() {
        return [{ id: 'Tất cả', text: 'Tất cả' }, ...this.all_customers];
    },
    currentContractType() {
        if (this.$route.path.includes('medicalcontract')) return 205;
        if (this.$route.path.includes('governmentcontract')) return 206;
    },
    project_list_for_filter() {
        return [{ id: 0, text: 'Tất cả' }, ...this.all_projects];
    },
    filteredColumns() {
        // Ẩn cột Dự án khi là medicalcontract
        if (this.$route.path.includes('medicalcontract')) {
            return this.columns.filter(col => col.fieldName !== 'project');
        }
        return this.columns;
    }
  },
  watch: {
    // Theo dõi sự thay đổi của route để cập nhật lại dữ liệu
    '$route.path': {
      handler() {
        this.loadData();
        this.updatePageTitle();
        this.loadServices();
        this.loadUsers();
        this.loadUnits();
        this.loadCustomers();
        this.loadProjects();
      },
      immediate: true
    }
  },
  methods: {
    loading(show) {
      this.$root.showLoading(show)
    },
    formatVND(field, data, column) {
      if (typeof data[field] !== 'number') return '';
      return new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 0
      }).format(data[field]);
    },
    formatDate(field, data, column) {
      const dateString = data[field];
      if (!dateString) return '';
      return moment(dateString).format('DD/MM/YYYY');
    },
    ThemMoi() {
      this.is_add_new = true
      this.is_view_detail = false
      this.row_selected = {}
      this.$refs.contractModal.showModal()
    },
    getSelectedRow() {
      try {
        if (this.$refs.gridDs) {
          const selectedRecords = this.$refs.gridDs.getSelectedRecords();
          
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
    handlePhuLucHopDong() {
      const selectedRow = this.getSelectedRow();
      if (!selectedRow) {
        this.$toast.error('Vui lòng chọn 1 dòng cần xử lý!');
        return;
      }
      this.row_selected = selectedRow;
      this.$refs.appendixModal.showModal();
    },
    handleDoanhThu() {
      const selectedRow = this.getSelectedRow();
      if (!selectedRow) {
        this.$toast.error('Vui lòng chọn 1 dòng cần xử lý!');
        return;
      }
      this.row_selected = selectedRow;
      this.$refs.revenueModal.showModal();
    },
    handleDoanhThuHopDong() {
      const selectedRow = this.getSelectedRow();
      if (!selectedRow) {
        this.$toast.error('Vui lòng chọn 1 dòng cần xử lý!');
        return;
      }
      this.row_selected = selectedRow;
      this.$refs.revenueManagementModal.showModal();
    },
    viewDetail(rowData) {
      this.is_add_new = false;
      this.is_view_detail = true;
      this.row_selected = rowData;
      this.$refs.contractModal.showModal();
    },
    editContract() {
      const dsSelected = this.$refs.gridDs.getSelectedRecords();
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
      this.row_selected = dsSelected[0]; // Lấy phần tử duy nhất trong mảng
      this.$refs.contractModal.showModal();
    },
    async deleteContract() {
      let dsSelected = this.$refs.gridDs.getSelectedRecords();
      if (dsSelected.length == 0) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng cần xóa!');
        return;
      }

      let dsId = dsSelected.map(x => x.id);
      let contractNumbers = dsSelected.map(x => x.contractNumber).join(', ');

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa các hợp đồng đang chọn?`);
      if (result == 0) return;

      const response = await API.DeleteContract(this, JSON.stringify(dsId));

      // Kiểm tra thuộc tính .success của đối tượng response
      if (response && response.success) {
          this.$toast.success(response.message || `Đã xóa các hợp đồng thành công`);
          // Xóa các item đã chọn khỏi original_data_sources
          dsId.forEach(id => {
              const index = this.original_data_sources.findIndex(item => item.id === id);
              if (index > -1) {
                  this.original_data_sources.splice(index, 1);
              }
          });
          this.initDataGrid();
      }
    },
    toggleAdvancedSearch() {
      this.show_advanced_search = !this.show_advanced_search;
    },
    clearAdvancedSearch() {
      this.advanced_search = {
        project_id: 0,
        customer_id: null, //'Tất cả',
        signing_date_from: null,
        execution_time: null,
        effective_date: null,
        expiry_date: null
      };
      this.khachhang_selected = {
        id: 0,
        selected:true,
        text:""
      }
      this.search_query = '';
      this.contract_type_selected = 0;
      this.status_selected = 0;
      
      // Force refresh các datepicker components
      this.$nextTick(() => {
        // Tìm tất cả các datepicker trong advanced search section và clear chúng
        const datepickers = this.$el.querySelectorAll('.advanced-search-section .e-datepicker');
        datepickers.forEach(datepicker => {
          const datepickerInstance = datepicker.ej2_instances?.[0];
          if (datepickerInstance) {
            datepickerInstance.value = null;
            datepickerInstance.dataBind();
          }
        });
      });
      
      this.initDataGrid();
    },
    async onContractTypeChange(option) {
      if (option && option.id !== undefined) {
        this.contract_type_selected = option.id;
      }
      this.initDataGrid();
    },
    async onStatusChange(option) {
      if (option && option.id !== undefined) {
        this.status_selected = option.id;
      }
      this.initDataGrid();
    },
    searchContracts() {
      this.initDataGrid();
    },
    updatePageTitle() {
        if (this.$route.path.includes('medicalcontract')) {
            this.header.title = "Hợp đồng y tế số";
        } else {
            this.header.title = "Hợp đồng chính quyền số";
        }
    },
    async loadServices() {
        const serviceData = await API.GetServices(this);
        this.all_services = serviceData || [];
    },
    async loadUsers() {
        const userData = await API.GetUsers(this);
        this.all_users = userData || [];
    },
    async loadUnits() {
        const unitData = await API.GetUnits(this);
        this.all_units = unitData || [];
    },
    async loadCustomers() {
        const customerData = await API.GetCustomers(this);
        this.all_customers = customerData || [];
    },
        async loadProjects() {
        const projectData = await API.GetProjects(this);
        this.all_projects = projectData || [];
    },
    async loadData() {
      // Xác định loại hợp đồng dựa trên URL
        let contractTypeToLoad = null;
        if (this.$route.path.includes('medicalcontract')) {
            contractTypeToLoad = 205; // Hợp đồng y tế
        } else if (this.$route.path.includes('governmentcontract')) {
            contractTypeToLoad = 206; // Hợp đồng chính quyền
        }
      this.loading(true);
      const jsonString = await API.GetFullContractAll(this, contractTypeToLoad);
      this.loading(false);
      try {
        // Kiểm tra chuỗi nhận về có hợp lệ không (không rỗng, không null)
        if (jsonString && jsonString.trim()) {
          // Dùng JSON.parse để chuyển chuỗi thành mảng đối tượng JavaScript
          const parsedData = JSON.parse(jsonString);
          // Gán dữ liệu gốc để thực hiện lọc phía client
          this.original_data_sources = parsedData;
          // Gọi hàm để hiển thị dữ liệu lên grid (và áp dụng các bộ lọc nếu có)
          this.initDataGrid();
        } else {
          // Nếu không có dữ liệu, gán mảng rỗng
          this.original_data_sources = [];
          this.data_sources = [];
        }
      } catch (error) {
        // Bắt lỗi nếu chuỗi JSON từ backend không hợp lệ
        console.error("Lỗi khi parse JSON từ server:", error);
        this.$toast.error("Dữ liệu trả về từ server có định dạng không hợp lệ.");
        this.original_data_sources = [];
        this.data_sources = [];
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
    async successContract() {
      await this.loadData();
    },
    initDataGrid() {
      let filteredData = [...this.original_data_sources];
      
      // Lọc theo từ khóa tìm kiếm
      if (this.search_query.trim()) {
        const query = this.search_query.toLowerCase();
        filteredData = filteredData.filter(c =>
          c.contractNumber?.toLowerCase().includes(query) ||
          c.contractName?.toLowerCase().includes(query)
        );
      }

      // Lọc theo hình thức hợp đồng
      if (this.contract_type_selected > 0) {
        const selectedType = this.contract_types.find(t => t.id == this.contract_type_selected);
        if (selectedType) {
          filteredData = filteredData.filter(c => c.contractType === selectedType.text);
        }
      }

      // Lọc theo trạng thái
      if (this.status_selected > 0) {
        const selectedStatus = this.statuses.find(s => s.id == this.status_selected);
        if (selectedStatus) {
          filteredData = filteredData.filter(c => c.status === selectedStatus.text);
        }
      }
      
      // --- Lọc nâng cao ---
      // Lọc theo dự án
      if (this.advanced_search.project_id > 0) {
          filteredData = filteredData.filter(c => c.projectId == this.advanced_search.project_id);
      }
      
      // Lọc theo khách hàng
      if (this.khachhang_selected.id && this.khachhang_selected.id !== 0) {
          filteredData = filteredData.filter(c => c.customerId == this.khachhang_selected.id);
      }

      // Lọc theo Ngày ký
      if (this.advanced_search.signing_date_from) {
        const fromDate = new Date(this.advanced_search.signing_date_from);
        fromDate.setHours(0, 0, 0, 0); // Chuẩn hóa về đầu ngày
        filteredData = filteredData.filter(c => {
            if (!c.signingDate) return false;
            const contractDate = new Date(c.signingDate);
            return contractDate >= fromDate;
        });
      }
      
      // Lọc theo Ngày bắt đầu hiệu lực
      if (this.advanced_search.effective_date) {
        const effectiveDateFilter = new Date(this.advanced_search.effective_date);
        effectiveDateFilter.setHours(0, 0, 0, 0);
        filteredData = filteredData.filter(c => {
            if (!c.effectiveDate) return false;
            const contractDate = new Date(c.effectiveDate);
            return contractDate >= effectiveDateFilter;
        });
      }

      // Lọc theo Ngày kết thúc hiệu lực
      if (this.advanced_search.expiry_date) {
        const expiryDateFilter = new Date(this.advanced_search.expiry_date);
        expiryDateFilter.setHours(0, 0, 0, 0);
        filteredData = filteredData.filter(c => {
            if (!c.expiryDate) return false;
            const contractDate = new Date(c.expiryDate);
            // Tìm các hợp đồng hết hạn vào hoặc trước ngày được chọn
            return contractDate <= expiryDateFilter;
        });
      }

      // Lọc theo Thời gian thực hiện
      if (this.advanced_search.execution_time) {
        const executionTimeFilter = new Date(this.advanced_search.execution_time);
        executionTimeFilter.setHours(0, 0, 0, 0);
        filteredData = filteredData.filter(c => {
            if (!c.executionTime) return false;
            const contractDate = new Date(c.executionTime);
            return contractDate >= executionTimeFilter;
        });
      }

      this.data_sources = filteredData;
    }
  },
}
</script>

<style src="./Contract.css" scoped> </style>