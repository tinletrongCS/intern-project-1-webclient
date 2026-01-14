<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="key w150 bold">Tìm kiếm</div>
              <div class="value">
                <input type="text" v-model="search_query" class="form-control"
                  placeholder="Nhập số hợp đồng hoặc tên hợp đồng..." @input="searchContracts">
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-12">
            <div class="value text-right">
              <button class="btn btn-circle btn-expand" @click="toggleAdvancedSearch"
                :class="{ 'expanded': show_advanced_search }" title="Mở rộng tìm kiếm">Tìm kiếm mở rộng
                <i class="fa"
                  :class="{ 'fa-chevron-down': !show_advanced_search, 'fa-chevron-up': show_advanced_search }"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-show="show_advanced_search" class="advanced-search-section">
          <!-- Tìm kiếm theo dự án -->
          <div class="row">
            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Số hợp đồng</div>
                <div class="value">
                  <input type="text" v-model="advanced_search.contract_no" class="form-control"
                    placeholder="Nhập số hợp đồng" @input="searchContracts">
                </div>
              </div>
            </div>
            <!-- Tìm kiếm theo khách hàng -->
            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Tên hợp đồng</div>
                <div class="value">
                  <input type="text" v-model="advanced_search.contract_name" class="form-control"
                    placeholder="Nhập tên hợp đồng" @input="searchContracts">
                </div>
              </div>
            </div>

            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Khách hàng</div>
                <div class="value">
                  <input type="text" v-model="advanced_search.customer_name" class="form-control"
                    placeholder="Nhập tên khách hàng" @input="searchContracts">
                </div>
              </div>
            </div>

            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Mốc thời gian</div>
                <div class="value">
                  <ejs-datepicker v-model="advanced_search.time_contract" format="dd/MM/yyyy" :showClearButton="true"
                    :allowEdit="true" :strict-mode="true" locale="vi" :firstDayOfWeek="1" @change="searchContracts"
                    placeholder="Chọn mốc thời gian" />
                </div>
              </div>
            </div>

            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Tình trạng thanh toán</div>
                <div class="value">
                  <select2 v-model='advanced_search.payment_status' :options="status_payment_contract_list"
                    @select="searchContracts"
                    :settings="{ placeholder: 'Chọn tình trạng thanh toán', allowClear: false, width: '100%' }" />
                </div>
              </div>
            </div>

            <!-- <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Trạng thái hợp đồng</div>
                <div class="value">
                  <select2 v-model='advanced_search.contract_status' :options="form_contract_execution_list" @select="searchContracts" 
                    :settings="{ placeholder: 'Chọn trạng thái hợp đồng', allowClear: false, width: '100%' }"/>
                </div>
              </div>
            </div> -->

            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w150 bold">Hình thức hợp đồng</div>
                <div class="value">
                  <select2 v-model='advanced_search.contract_form' :options="form_contract_execution_list"
                    @select="searchContracts"
                    :settings="{ placeholder: 'Chọn hình thức hợp đồng', allowClear: false, width: '100%' }" />
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

              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="importFile()">
                <span class="icon fa fa-files-o"></span>&nbsp;Import
              </button>&nbsp;

              <input ref="fileInput" id="file" type="file" accept=".xlsx,.xls" style="display:none"
                @change="onChangeFile($event)" />

              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="exportExcelTemplate()">
                <span class="icon fa fa-money"></span>&nbsp;Export
              </button>&nbsp;

              <!-- <button class="btn btn-second" style="min-width: 180px;" @click.prevent="handleDoanhThuHopDong">
                <span class="icon fa fa-bar-chart"></span>&nbsp;Doanh thu HĐ
              </button> -->
            </div>
          </div>
        </div>
        <KDataGrid ref="gridDs" :columns="gridColumns" :dataSource="data_sources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="false" :showColumnCheckbox="true" :enabledSelectFirstRow="false"
          :showSTT="true" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" @rowSelected="onRowSelected"
          @recordDoubleClick="onRecordDoubleClick" />
      </div>
    </div>

    <!-- Modal tạo mới/chỉnh sửa/xem chi tiết hợp đồng -->
    <ContractModal ref="contractModal" :isAdd="is_add_new" :isViewDetail="is_view_detail"
      @successContract="successContract" :data="row_selected" :service_list="all_services" :user_list="all_users"
      :unit_list="all_units" :project_list="all_projects" :customer_list="all_customers"
      :contract_type="currentContractType" />

    <!-- Modal import excel -->
    <!-- <ImportContractExcelModal ref="importModal" @confirm="handleConfirmImport" /> -->

    <ImportContractExcelModal ref="checkImportIndicatorUserScoreModal" :dataCheckImports="dataCheckImports"
      :importItems="danhsach_excel" :headerDepth="headerDepth" @successImportData="successImportData" />
  </div>
</template>

<script>
import moment from 'moment'
import ContractModal from './popups/ContractModal.vue'
import CustomerSelect from '@/modules/work/kanban/search/CustomerSelect.vue'
import ImportContractExcelModal from './popups/ImportContractExcelModal.vue'
import API from './API.js'
import * as XLSX from 'xlsx-js-style'
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
export default {
  name: "ContractManagement",
  components: {
    ContractModal,
    CustomerSelect,
    ImportContractExcelModal
  },
  data() {
    return {
      header: {
        title: "Quản lý hợp đồng",
        list: [],
      },
      all_projects: [],
      dataCheckImports: {
        total: 0,
        valid: 0,
        invalid: 0,
        is_valid: true,
        rows: []
      },
      importItems: { type: Array, default: () => [] },
      headerDepth: { type: Number, default: 1 },
      search_query: '',
      show_advanced_search: false,
      advanced_search: {
        contract_no: '',
        contract_name: '',
        customer_name: '',
        time_contract: null,
        contract_form: null,
        payment_status: null,
        contract_status: null
      },
      khachhang_selected: {
        id: 0,
        selected: true,
        text: ""
      },
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

      type_contract_list: [
        { id: 1, text: 'Trọn gói' },
        { id: 2, text: 'Đơn giá cố định' },
        { id: 3, text: 'Đơn giá điều chỉnh' },
      ],
      form_contract_execution_list: [
        { id: 1, text: 'Cung cấp SPDV 1 lần' },
        { id: 2, text: 'Thuê SPDV theo định kỳ' }
      ],
      form_payment_list: [
        { id: 1, text: 'Thanh toán 1 lần' },
        { id: 2, text: 'Thanh toán định kỳ' }
      ],
      type_revenue: [
        { id: 1, text: 'Doanh thu duy trì' },
        { id: 2, text: 'Doanh thu phát triển mới' }
      ],
      status_payment_contract_list: [
        { id: 1, text: 'Đã thanh toán' },
        { id: 2, text: 'Chưa thanh toán' }
      ],
      columns: [
        {
          fieldName: 'contract_no',
          headerText: 'Số hợp đồng',
          allowFiltering: true,
          textAlign: 'left',
          width: '150'
        },
        {
          fieldName: 'contract_name',
          headerText: 'Tên hợp đồng',
          allowFiltering: true,
          width: '250'
        },
        {
          fieldName: 'customer_name',
          headerText: 'Khách hàng',
          allowFiltering: true,
          extAlign: 'center',
          width: '180'
        },
        {
          headerText: 'MỐC THỜI GIAN HỢP ĐỒNG',
          columns: [
            {
              fieldName: 'contract_sign_date',
              headerText: 'Ngày ký HĐ',
              textAlign: 'center',
              width: 130,
              allowFiltering: true,
              valueAccessor: this.formatDate
            },
            {
              fieldName: 'contract_execution_time',
              headerText: 'Thời gian thực hiện',
              textAlign: 'left',
              width: 170
            },
            {
              fieldName: 'contract_expiration_date',
              headerText: 'Ngày hết hạn',
              textAlign: 'center',
              width: 130,
              valueAccessor: this.formatDate
            },
            {
              fieldName: 'test_payment_date',
              headerText: 'Đợt NT/TT',
              textAlign: 'left',
              width: 150
            }
          ]
        },
        {
          fieldName: 'contract_value',
          headerText: 'Giá trị hợp đồng',
          allowFiltering: true,
          textAlign: 'right',
          width: '200',
          valueAccessor: this.formatVND
        },
        {
          fieldName: 'arr_serviceids',
          headerText: 'Sản phẩm dịch vụ',
          allowFiltering: true,
          textAlign: 'left',
          width: '200',
          valueAccessor: (value, row) => this.serviceNamesAccessor(value, row)
        },
        // {
        //   fieldName: 'contract_sign_date',
        //   headerText: 'Sản phẩm dịch vụ',
        //   allowFiltering: true,
        //   textAlign: 'center',
        //   width: '200',
        //   valueAccessor: this.formatDate
        // },
        {
          fieldName: 'revenue_value',
          headerText: 'Giá trị doanh thu',
          allowFiltering: true,
          textAlign: 'right',
          width: '250',
          valueAccessor: this.formatVND
        },
        {
          fieldName: 'contract_type',
          headerText: 'Loại hợp đồng',
          allowFiltering: true,
          width: '200',
          valueAccessor: (value, row) =>
            this.transferDataDropdown(this.type_contract_list, 'contract_type')(value, row),
          textAlign: 'left'
        },
        {
          fieldName: 'form_payment_selected',
          headerText: 'Hình thức thanh toán',
          allowFiltering: true,
          width: '200',
          valueAccessor: (value, row) =>
            this.transferDataDropdown(this.form_payment_list, 'form_payment_selected')(value, row),
          textAlign: 'left'
        },
        {
          fieldName: 'form_contract_execution',
          headerText: 'Hình thức thực hiện',
          allowFiltering: true,
          textAlign: 'center',
          width: '250',
          valueAccessor: (value, row) =>
            this.transferDataDropdown(this.form_contract_execution_list, 'form_contract_execution')(value, row),
          textAlign: 'left'
        },
        {
          headerText: 'NGHIỆM THU & THANH TOÁN',
          columns: [
            {
              fieldName: 'acceptance_sign_date',           // Ngày ký HĐ
              headerText: 'Ngày ký NT',
              textAlign: 'center',
              width: 130,
              valueAccessor: this.formatDate
            },
            {
              fieldName: 'acceptance_value',      // Thời gian (tháng)
              headerText: 'Giá trị NT',
              textAlign: 'right',
              width: 110,
              valueAccessor: this.formatVND
            },
            {
              fieldName: 'invoice_value',            // Ngày hết hạn
              headerText: 'Giá trị hoá đơn',
              textAlign: 'right',
              width: 150,
              valueAccessor: this.formatVND
            },
            {
              fieldName: 'invoice_date',   // Đợt NT/TT (vd: Theo giai đoạn (3 đợt))
              headerText: 'Ngày xuất hoá đơn',
              textAlign: 'center',
              width: 170,
              valueAccessor: this.formatDate
            },
            {
              fieldName: 'contract_payment_status',   // Đợt NT/TT (vd: Theo giai đoạn (3 đợt))
              headerText: 'Tình trạng thanh toán',
              valueAccessor: (value, row) =>
                this.transferDataDropdown(this.status_payment_contract_list, 'contract_payment_status')(value, row),
              textAlign: 'left'
            }
          ]
        },
        {
          fieldName: 'full_name',
          headerText: 'Nhân sự hợp đồng',
          allowFiltering: true,
          textAlign: 'left',
          width: '170'
        },
        {
          fieldName: 'revenue_type',
          headerText: 'Loại doanh thu',
          allowFiltering: true,
          valueAccessor: (value, row) =>
            this.transferDataDropdown(this.type_revenue, 'revenue_type')(value, row),
          textAlign: 'left',
          width: '150'
        },
      ],
      all_services: [],
      importing: false,
      importErrors: [],
      file: null,
      all_users: []
    }
  },
  computed: {
    currentContractType() {
      if (this.$route.path.includes('medicalcontract')) return 205;
      if (this.$route.path.includes('governmentcontract')) return 206;
    },
    gridColumns() {
      const normalize = (col) => {
        // Nếu là group column
        if (Array.isArray(col.columns) && col.columns.length > 0) {
          return {
            ...col,
            columns: col.columns.map(normalize)
          };
        }

        return {
          ...col,
          field: col.fieldName
        };
      };
      return (this.columns || []).map(normalize);
    }
  },
  watch: {
    // Theo dõi sự thay đổi của route để cập nhật lại dữ liệu
    '$route.path': {
      handler() {
        this.loadData();
        this.updatePageTitle();
        this.loadServices();
        // this.loadUsers();
        this.loadUnits();
        this.loadCustomers();
        this.loadProjects();
        this.loadAllUser();
      },
      immediate: true
    }
  },
  methods: {
    async loadAllUser() {
      this.all_users = await API.GetAllUserDepartment(this) || [];
    },
    loading(show) {
      this.$root.showLoading(show)
    },
    async successImportData() {
      // this.initDataGrid();
      await this.loadData();
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

      let dsId = dsSelected.map(x => x.contract_management_id);
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
        // this.initDataGrid();
        await this.loadData();
      }
    },
    toggleAdvancedSearch() {
      this.show_advanced_search = !this.show_advanced_search;
    },
    clearAdvancedSearch() {
      this.advanced_search = {
        contract_no: '',
        contract_name: '',
        customer_name: '',
        time_contract: null
      },
        this.khachhang_selected = {
          id: 0,
          selected: true,
          text: ""
        }
      this.search_query = '';

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
    searchContracts() {
      this.initDataGrid();
    },
    updatePageTitle() {
      this.header.title = "Quản lý hợp đồng";
    },
    async loadServices() {
      const serviceData = await API.GetServices(this);
      this.all_services = serviceData || [];
    },
    // async loadUsers() {
    //   const userData = await API.GetUsers(this);
    //   this.all_users = userData || [];
    // },
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
      const jsonString = await API.GetFullContractManagement(this, contractTypeToLoad);
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
      let filteredData = [...(this.original_data_sources || [])];

      // helper: lấy field linh hoạt camelCase/snake_case
      const getField = (obj, ...keys) => {
        for (const k of keys) {
          const v = obj?.[k];
          if (v !== undefined && v !== null && v !== '') return v;
        }
        return null;
      };

      // helper: chuẩn hoá chuỗi để tìm kiếm
      const norm = (s) => String(s ?? '').trim().toLowerCase();

      // helper: parse date (hỗ trợ Date / ISO string)
      const toDateOnly = (val) => {
        if (!val) return null;
        const d = (val instanceof Date) ? val : new Date(val);
        if (Number.isNaN(d.getTime())) return null;
        d.setHours(0, 0, 0, 0);
        return d;
      };

      // ===== 1) Search nhanh (search_query) =====
      if (norm(this.search_query)) {
        const q = norm(this.search_query);
        filteredData = filteredData.filter(c => {
          const contractNumber = norm(getField(c, 'contractNumber', 'contract_no'));
          const contractName = norm(getField(c, 'contractName', 'contract_name'));
          return contractNumber.includes(q) || contractName.includes(q);
        });
      }

      // ===== 2) Advanced filters theo UI =====

      // Số hợp đồng (contains cho thân thiện; nếu cần exact thì đổi includes -> ===)
      if (norm(this.advanced_search.contract_no)) {
        const q = norm(this.advanced_search.contract_no);
        filteredData = filteredData.filter(c => {
          const val = norm(getField(c, 'contractNumber', 'contract_no'));
          return val.includes(q);
        });
      }

      // Tên hợp đồng
      if (norm(this.advanced_search.contract_name)) {
        const q = norm(this.advanced_search.contract_name);
        filteredData = filteredData.filter(c => {
          const val = norm(getField(c, 'contractName', 'contract_name'));
          return val.includes(q);
        });
      }

      // Khách hàng
      if (norm(this.advanced_search.customer_name)) {
        const q = norm(this.advanced_search.customer_name);
        filteredData = filteredData.filter(c => {
          const val = norm(getField(c, 'customerName', 'customer_name'));
          return val.includes(q);
        });
      }

      // Mốc thời gian: match nếu trùng NGÀY với 1 trong các mốc ngày của hợp đồng
      if (this.advanced_search.time_contract) {
        const picked = toDateOnly(this.advanced_search.time_contract);

        filteredData = filteredData.filter(c => {
          if (!picked) return true;

          const signDate = toDateOnly(getField(c, 'signingDate', 'sign_date', 'contract_sign_date'));
          const startDate = toDateOnly(getField(c, 'effectiveDate', 'start_date', 'active_date'));
          const endDate = toDateOnly(getField(c, 'expiryDate', 'end_date', 'contract_expiration_date'));
          const execDate = toDateOnly(getField(c, 'executionTime', 'contract_execution_time'));

          // tuỳ nghiệp vụ:
          // A) trùng đúng ngày với bất kỳ mốc nào:
          return [signDate, startDate, endDate, execDate].some(d => d && d.getTime() === picked.getTime());

          // B) nếu bạn muốn "nằm trong khoảng hiệu lực" thì dùng:
          // if (!startDate || !endDate) return false;
          // return picked >= startDate && picked <= endDate;
        });
      }

      // Tình trạng thanh toán (payment_status)
      if (this.advanced_search.payment_status !== null && this.advanced_search.payment_status !== undefined && String(this.advanced_search.payment_status) !== '') {
        const sel = String(this.advanced_search.payment_status);

        filteredData = filteredData.filter(c => {
          const val = getField(
            c,
            'contract_payment_status'
          );
          return val !== null && String(val) === sel;
        });
      }

      // Hình thức hợp đồng (contract_form)
      if (this.advanced_search.contract_form !== null && this.advanced_search.contract_form !== undefined && String(this.advanced_search.contract_form) !== '') {
        const sel = String(this.advanced_search.contract_form);

        filteredData = filteredData.filter(c => {
          const val = getField(
            c,
            'form_contract_execution',
          );
          return val !== null && String(val) === sel;
        });
      }


      this.data_sources = filteredData;
    },

    transferDataDropdown(list, fieldName) {
      return (value, row) => {
        // ưu tiên lấy từ row[fieldName], fallback sang value
        const id = row?.[fieldName] ?? value;

        if (id === null || id === undefined) return '';

        const found = list.find(
          x => String(x.id) === String(id)
        );

        return found ? found.text : '';
      };
    },

    normalizeIds(val) {
      if (val == null) return [];

      // đã là array
      if (Array.isArray(val)) {
        return val.map(x => Number(x)).filter(n => Number.isFinite(n));
      }

      // là string JSON: "[120,117]" hoặc "["120","117"]"
      if (typeof val === 'string') {
        const s = val.trim();
        if (!s) return [];

        try {
          const arr = JSON.parse(s);
          if (Array.isArray(arr)) {
            return arr.map(x => Number(x)).filter(n => Number.isFinite(n));
          }
        } catch (_) {
          // fallback: "120,117"
          return s.split(',').map(x => Number(x.trim())).filter(n => Number.isFinite(n));
        }
      }

      return [];
    },

    // build map id -> name 1 lần (nhanh hơn find liên tục)
    buildServiceNameMap() {
      const map = new Map();

      (this.all_services || []).forEach(s => {
        const id = Number(s.id ?? s.service_id ?? s.serviceId);
        const name = s.text ?? s.service_name ?? s.serviceName ?? s.name;
        if (Number.isFinite(id) && name) map.set(id, String(name));
      });

      return map;
    },

    // valueAccessor cho cột SPDV
    serviceNamesAccessor(value, row) {
      const ids = this.normalizeIds(row?.arr_serviceids ?? value);
      if (ids.length === 0) return '';

      const nameMap = this.buildServiceNameMap();
      const names = ids
        .map(id => nameMap.get(id))
        .filter(Boolean);

      return names.join(', ');
    },

    exportExcel() {
      // =========================
      // 0) Helpers
      // =========================
      const isGroup = (c) => Array.isArray(c?.columns) && c.columns.length > 0;

      const maxDepth = (cols, d = 1) =>
        Math.max(
          d,
          ...(cols || []).map((c) => (isGroup(c) ? maxDepth(c.columns, d + 1) : d))
        );

      const leafCount = (col) => {
        if (!isGroup(col)) return 1;
        return (col.columns || []).reduce((sum, c) => sum + leafCount(c), 0);
      };

      const toWpx = (w) => {
        if (w == null) return 160;
        if (typeof w === "number") return w;
        const n = parseInt(String(w).replace(/[^\d]/g, ""), 10);
        return Number.isFinite(n) ? n : 160;
      };

      // =========================
      // 1) Build header rows + merges + leaf columns (order)
      // =========================
      const buildHeader = (columns) => {
        const depth = maxDepth(columns);
        const headerRows = Array.from({ length: depth }, () => []);
        const merges = [];
        const leafCols = [];

        let curCol = 0;

        const setCell = (r, c, v) => {
          headerRows[r][c] = v;
        };

        const walk = (cols, level) => {
          (cols || []).forEach((col) => {
            const startCol = curCol;
            const span = leafCount(col);

            // put group/leaf header text at this level
            setCell(level, startCol, col.headerText || col.fieldName || "");

            // fill blanks across span on this row (keeps matrix rectangular)
            for (let i = 1; i < span; i++) setCell(level, startCol + i, "");

            if (isGroup(col)) {
              // merge horizontally for group header
              if (span > 1) {
                merges.push({
                  s: { r: level, c: startCol },
                  e: { r: level, c: startCol + span - 1 }
                });
              }

              // go down
              walk(col.columns, level + 1);

              // after finishing children, advance cursor by span
              curCol = startCol + span;
            } else {
              // leaf
              leafCols.push(col);

              // merge vertically down if header has more than 1 row
              if (level < depth - 1) {
                merges.push({
                  s: { r: level, c: startCol },
                  e: { r: depth - 1, c: startCol }
                });
              }

              curCol += 1;
            }
          });
        };

        walk(columns, 0);

        // normalize row lengths
        const totalCols = headerRows[0].length;
        headerRows.forEach((r) => {
          for (let i = 0; i < totalCols; i++) {
            if (r[i] === undefined || r[i] === null) r[i] = "";
          }
        });

        return { headerRows, merges, leafCols, depth, totalCols };
      };

      const { headerRows, merges, leafCols, depth } = buildHeader(this.columns);

      // =========================
      // 2) Prepend STT + FIX merges offset
      // =========================
      headerRows.forEach((r, i) => r.unshift(i === 0 ? "STT" : ""));

      // ✅ IMPORTANT: shift all existing merges right by 1 col (because of STT)
      merges.forEach((m) => {
        m.s.c += 1;
        m.e.c += 1;
      });

      // Merge STT vertically through header depth
      merges.push({ s: { r: 0, c: 0 }, e: { r: depth - 1, c: 0 } });

      // =========================
      // 3) Data rows (use valueAccessor like grid)
      // =========================
      const dataRows = (this.data_sources || []).map((row, idx) => {
        const cells = leafCols.map((col) => {
          const raw = row?.[col.fieldName];

          if (typeof col.valueAccessor === "function") {
            try {
              const v = col.valueAccessor(raw, row, col);
              return v === undefined || v === null ? "" : v;
            } catch (e) {
              return raw === undefined || raw === null ? "" : raw;
            }
          }

          return raw === undefined || raw === null ? "" : raw;
        });

        return [idx + 1, ...cells];
      });

      const excelData = [...headerRows, ...dataRows];

      // =========================
      // 4) Create sheet + merges
      // =========================
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set merges (critical for group header)
      ws["!merges"] = merges;

      // =========================
      // 5) Style header (requires xlsx-js-style to actually work)
      // =========================
      const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        fill: { fgColor: { rgb: "BAE7FF" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };

      const totalCols = headerRows[0].length;
      for (let r = 0; r < depth; r++) {
        for (let c = 0; c < totalCols; c++) {
          const addr = XLSX.utils.encode_cell({ r, c });
          if (!ws[addr]) ws[addr] = { t: "s", v: "" };
          ws[addr].s = headerStyle;
        }
      }

      // (optional) set header row heights for nicer look
      // ws["!rows"] = Array.from({ length: depth }, () => ({ hpx: 26 }));

      // =========================
      // 6) Column widths: STT + from config
      // =========================
      ws["!cols"] = [
        { wpx: 60 }, // STT
        ...leafCols.map((c) => ({ wpx: toWpx(c.width) }))
      ];

      // =========================
      // 7) Export file
      // =========================
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách hợp đồng");
      XLSX.writeFile(wb, "Danh_sach_hop_dong.xlsx");
    },

    // exportExcelTemplate() {
    //   const isGroup = (c) => Array.isArray(c?.columns) && c.columns.length > 0;

    //   const maxDepth = (cols, d = 1) =>
    //     Math.max(
    //       d,
    //       ...(cols || []).map((c) => (isGroup(c) ? maxDepth(c.columns, d + 1) : d))
    //     );

    //   const leafCount = (col) => {
    //     if (!isGroup(col)) return 1;
    //     return (col.columns || []).reduce((sum, c) => sum + leafCount(c), 0);
    //   };

    //   const toWpx = (w) => {
    //     if (w == null) return 160;
    //     if (typeof w === "number") return w;
    //     const n = parseInt(String(w).replace(/[^\d]/g, ""), 10);
    //     return Number.isFinite(n) ? n : 160;
    //   };

    //   // Quy đổi gần đúng wpx -> ExcelJS width (character units)
    //   const wpxToChar = (wpx) => Math.max(8, Math.round((toWpx(wpx) || 160) / 7));

    //   // =========================
    //   // 1) Build header rows + merges + leaf columns (order)
    //   // =========================
    //   const buildHeader = (columns) => {
    //     const depth = maxDepth(columns);
    //     const headerRows = Array.from({ length: depth }, () => []);
    //     const merges = [];
    //     const leafCols = [];
    //     let curCol = 0;

    //     const setCell = (r, c, v) => {
    //       headerRows[r][c] = v;
    //     };

    //     const walk = (cols, level) => {
    //       (cols || []).forEach((col) => {
    //         const startCol = curCol;
    //         const span = leafCount(col);

    //         // Put header text at this level
    //         setCell(level, startCol, col.headerText || col.fieldName || "");

    //         // Fill blanks in the same row for this span
    //         for (let i = 1; i < span; i++) setCell(level, startCol + i, "");

    //         if (isGroup(col)) {
    //           // horizontal merge for group
    //           if (span > 1) {
    //             merges.push({
    //               s: { r: level, c: startCol },
    //               e: { r: level, c: startCol + span - 1 }
    //             });
    //           }

    //           // recurse children
    //           walk(col.columns, level + 1);

    //           // advance cursor by span
    //           curCol = startCol + span;
    //         } else {
    //           // leaf
    //           leafCols.push(col);

    //           // vertical merge down to bottom header row if needed
    //           if (level < depth - 1) {
    //             merges.push({
    //               s: { r: level, c: startCol },
    //               e: { r: depth - 1, c: startCol }
    //             });
    //           }

    //           curCol += 1;
    //         }
    //       });
    //     };

    //     walk(columns, 0);

    //     // normalize all header rows to same length
    //     const totalCols = headerRows[0].length;
    //     headerRows.forEach((r) => {
    //       for (let i = 0; i < totalCols; i++) {
    //         if (r[i] === undefined || r[i] === null) r[i] = "";
    //       }
    //     });

    //     return { headerRows, merges, leafCols, depth };
    //   };

    //   const { headerRows, merges, leafCols, depth } = buildHeader(this.columns);

    //   // =========================
    //   // 2) (Optional) thêm STT như grid
    //   // =========================
    //   headerRows.forEach((r, i) => r.unshift(i === 0 ? "STT" : ""));

    //   // IMPORTANT: shift merges right by 1 because of STT column
    //   merges.forEach((m) => {
    //     m.s.c += 1;
    //     m.e.c += 1;
    //   });

    //   // merge dọc cho STT
    //   merges.push({ s: { r: 0, c: 0 }, e: { r: depth - 1, c: 0 } });

    //   // =========================
    //   // 3) Add empty rows for user input (template)
    //   // =========================
    //   const EMPTY_ROWS = 50; // bạn đổi số dòng muốn tạo sẵn
    //   const emptyRow = new Array(1 + leafCols.length).fill(""); // +1 vì STT
    //   const emptyRows = Array.from({ length: EMPTY_ROWS }, () => [...emptyRow]);

    //   const excelData = [...headerRows, ...emptyRows];

    //   // =========================
    //   // Helper: tìm cột excel (1-based) theo fieldName
    //   // STT = col 1
    //   // leafCols[0] = col 2
    //   // =========================
    //   const getExcelColIndexByField = (fieldName) => {
    //     const leafIndex = leafCols.findIndex((c) => c.fieldName === fieldName);
    //     return leafIndex < 0 ? -1 : leafIndex + 2;
    //   };

    //   // =========================
    //   // 4) Create workbook/sheets (ExcelJS) + merges + styles
    //   // =========================
    //   const wb = new ExcelJS.Workbook();
    //   const ws = wb.addWorksheet("Hợp đồng");
    //   const wsLookup = wb.addWorksheet("Lookups");

    //   // ✅ NEW: sheet thứ 2 xuất danh sách user
    //   const wsUsers = wb.addWorksheet("Nhân viên");

    //   // 4.1) write AOA to Template
    //   excelData.forEach((row, rIdx) => {
    //     const excelRow = ws.getRow(rIdx + 1);
    //     row.forEach((val, cIdx) => {
    //       excelRow.getCell(cIdx + 1).value = val ?? "";
    //     });
    //   });

    //   // 4.2) apply merges (convert 0-based -> 1-based)
    //   merges.forEach((m) => {
    //     ws.mergeCells(m.s.r + 1, m.s.c + 1, m.e.r + 1, m.e.c + 1);
    //   });

    //   // 4.3) style header rows
    //   const headerStyle = {
    //     font: { bold: true },
    //     alignment: { horizontal: "center", vertical: "middle", wrapText: true },
    //     fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFBAE7FF" } },
    //     border: {
    //       top: { style: "thin" },
    //       bottom: { style: "thin" },
    //       left: { style: "thin" },
    //       right: { style: "thin" }
    //     }
    //   };

    //   const totalCols = headerRows[0].length;
    //   for (let r = 1; r <= depth; r++) {
    //     for (let c = 1; c <= totalCols; c++) {
    //       ws.getCell(r, c).style = headerStyle;
    //     }
    //   }

    //   // =========================
    //   // 5) Column widths
    //   // =========================
    //   ws.getColumn(1).width = wpxToChar(60); // STT
    //   leafCols.forEach((c, idx) => {
    //     const excelCol = idx + 2; // +2 vì STT
    //     ws.getColumn(excelCol).width = wpxToChar(c.width);
    //   });

    //   // =========================
    //   // 6) Dropdown validations (Lookups + DataValidation)
    //   // =========================
    //   const putLookupList = (colLetter, items) => {
    //     (items || []).forEach((t, i) => {
    //       wsLookup.getCell(`${colLetter}${i + 1}`).value = t ?? "";
    //     });
    //     return `'Lookups'!$${colLetter}$1:$${colLetter}$${Math.max(
    //       (items || []).length,
    //       1
    //     )}`;
    //   };

    //   const applyDropdownForField = (fieldName, lookupRange) => {
    //     const col = getExcelColIndexByField(fieldName);
    //     if (col <= 0) return;

    //     const firstDataRow = depth + 1;
    //     const lastDataRow = depth + EMPTY_ROWS;

    //     for (let r = firstDataRow; r <= lastDataRow; r++) {
    //       ws.getCell(r, col).dataValidation = {
    //         type: "list",
    //         allowBlank: true,
    //         formulae: [lookupRange]
    //       };
    //     }
    //   };

    //   // Ẩn sheet Lookups (optional)
    //   wsLookup.state = "veryHidden";

    //   const contractTypeTexts = (this.type_contract_list || []).map((x) => x.text);
    //   const contractTypeRange = putLookupList("A", contractTypeTexts);
    //   applyDropdownForField("contract_type", contractTypeRange);

    //   const formPaymentTexts = (this.form_payment_list || []).map((x) => x.text);
    //   const formPaymentRange = putLookupList("B", formPaymentTexts);
    //   applyDropdownForField("form_payment_selected", formPaymentRange);

    //   const formExecutionTexts = (this.form_contract_execution_list || []).map(
    //     (x) => x.text
    //   );
    //   const formExecutionRange = putLookupList("C", formExecutionTexts);
    //   applyDropdownForField("form_contract_execution", formExecutionRange);

    //   const statusPaymentTexts = (this.status_payment_contract_list || []).map(
    //     (x) => x.text
    //   );
    //   const statusPaymentRange = putLookupList("D", statusPaymentTexts);
    //   applyDropdownForField("contract_payment_status", statusPaymentRange);

    //   const revenueTypeTexts = (this.type_revenue || this.type_revenue_list || []).map(
    //     (x) => x.text
    //   );
    //   const revenueTypeRange = putLookupList("E", revenueTypeTexts);
    //   applyDropdownForField("revenue_type", revenueTypeRange);

    //   // =========================
    //   // ✅ 6.6) NEW: Sheet Users - xuất dữ liệu this.all_users (đổi header theo yêu cầu)
    //   // =========================
    //   const users = Array.isArray(this.all_users) ? this.all_users : [];

    //   // ✅ Header đổi tên:
    //   wsUsers.addRow(["Mã nhân viên", "Nhân viên", "Phòng/Nhóm"]);

    //   // Style header Users
    //   for (let c = 1; c <= 3; c++) {
    //     wsUsers.getCell(1, c).style = headerStyle;
    //   }

    //   // Data Users
    //   users.forEach((u) => {
    //     wsUsers.addRow([u?.code ?? "", u?.full_name ?? "", u?.department_name ?? ""]);
    //   });

    //   // Width Users
    //   wsUsers.getColumn(1).width = 18; // Mã nhân viên
    //   wsUsers.getColumn(2).width = 30; // Nhân viên
    //   wsUsers.getColumn(3).width = 35; // Phòng/Nhóm

    //   // Freeze header Users
    //   wsUsers.views = [{ state: "frozen", ySplit: 1 }];

    //   // (optional) border cho sheet Users
    //   const lastUserRow = Math.max(2, wsUsers.rowCount);
    //   for (let r = 2; r <= lastUserRow; r++) {
    //     for (let c = 1; c <= 3; c++) {
    //       wsUsers.getCell(r, c).border = {
    //         top: { style: "thin" },
    //         bottom: { style: "thin" },
    //         left: { style: "thin" },
    //         right: { style: "thin" }
    //       };
    //       wsUsers.getCell(r, c).alignment = { vertical: "middle", wrapText: true };
    //     }
    //   }

    //   // =========================
    //   // 7) Export file template
    //   // =========================
    //   wb.xlsx.writeBuffer().then((buffer) => {
    //     saveAs(new Blob([buffer]), "file_import_hop_dong.xlsx");
    //   });
    // },

    exportExcelTemplate() {
      const isGroup = (c) => Array.isArray(c?.columns) && c.columns.length > 0;

      const maxDepth = (cols, d = 1) =>
        Math.max(
          d,
          ...(cols || []).map((c) => (isGroup(c) ? maxDepth(c.columns, d + 1) : d))
        );

      const leafCount = (col) => {
        if (!isGroup(col)) return 1;
        return (col.columns || []).reduce((sum, c) => sum + leafCount(c), 0);
      };

      const toWpx = (w) => {
        if (w == null) return 160;
        if (typeof w === "number") return w;
        const n = parseInt(String(w).replace(/[^\d]/g, ""), 10);
        return Number.isFinite(n) ? n : 160;
      };

      // Quy đổi gần đúng wpx -> ExcelJS width (character units)
      const wpxToChar = (wpx) => Math.max(8, Math.round((toWpx(wpx) || 160) / 7));

      // =========================
      // 1) Build header rows + merges + leaf columns (order)
      // =========================
      const buildHeader = (columns) => {
        const depth = maxDepth(columns);
        const headerRows = Array.from({ length: depth }, () => []);
        const merges = [];
        const leafCols = [];
        let curCol = 0;

        const setCell = (r, c, v) => {
          headerRows[r][c] = v;
        };

        const walk = (cols, level) => {
          (cols || []).forEach((col) => {
            const startCol = curCol;
            const span = leafCount(col);

            // Put header text at this level
            setCell(level, startCol, col.headerText || col.fieldName || "");

            // Fill blanks in the same row for this span
            for (let i = 1; i < span; i++) setCell(level, startCol + i, "");

            if (isGroup(col)) {
              // horizontal merge for group
              if (span > 1) {
                merges.push({
                  s: { r: level, c: startCol },
                  e: { r: level, c: startCol + span - 1 }
                });
              }

              // recurse children
              walk(col.columns, level + 1);

              // advance cursor by span
              curCol = startCol + span;
            } else {
              // leaf
              leafCols.push(col);

              // vertical merge down to bottom header row if needed
              if (level < depth - 1) {
                merges.push({
                  s: { r: level, c: startCol },
                  e: { r: depth - 1, c: startCol }
                });
              }

              curCol += 1;
            }
          });
        };

        walk(columns, 0);

        // normalize all header rows to same length
        const totalCols = headerRows[0].length;
        headerRows.forEach((r) => {
          for (let i = 0; i < totalCols; i++) {
            if (r[i] === undefined || r[i] === null) r[i] = "";
          }
        });

        return { headerRows, merges, leafCols, depth };
      };

      const { headerRows, merges, leafCols, depth } = buildHeader(this.columns);

      // =========================
      // 2) (Optional) thêm STT như grid
      // =========================
      headerRows.forEach((r, i) => r.unshift(i === 0 ? "STT" : ""));

      // IMPORTANT: shift merges right by 1 because of STT column
      merges.forEach((m) => {
        m.s.c += 1;
        m.e.c += 1;
      });

      // merge dọc cho STT
      merges.push({ s: { r: 0, c: 0 }, e: { r: depth - 1, c: 0 } });

      // =========================
      // 3) Add empty rows for user input (template)
      // =========================
      const EMPTY_ROWS = 50; // bạn đổi số dòng muốn tạo sẵn
      const emptyRow = new Array(1 + leafCols.length).fill(""); // +1 vì STT
      const emptyRows = Array.from({ length: EMPTY_ROWS }, () => [...emptyRow]);

      const excelData = [...headerRows, ...emptyRows];

      // =========================
      // Helper: tìm cột excel (1-based) theo fieldName
      // STT = col 1
      // leafCols[0] = col 2
      // =========================
      const getExcelColIndexByField = (fieldName) => {
        const leafIndex = leafCols.findIndex((c) => c.fieldName === fieldName);
        return leafIndex < 0 ? -1 : leafIndex + 2;
      };

      // =========================
      // 4) Create workbook/sheets (ExcelJS) + merges + styles
      // =========================
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Hợp đồng");
      const wsLookup = wb.addWorksheet("Lookups");

      // ✅ sheet thứ 2 xuất danh sách user
      const wsUsers = wb.addWorksheet("Nhân viên");

      // 4.1) write AOA to Template
      excelData.forEach((row, rIdx) => {
        const excelRow = ws.getRow(rIdx + 1);
        row.forEach((val, cIdx) => {
          excelRow.getCell(cIdx + 1).value = val ?? "";
        });
      });

      // 4.2) apply merges (convert 0-based -> 1-based)
      merges.forEach((m) => {
        ws.mergeCells(m.s.r + 1, m.s.c + 1, m.e.r + 1, m.e.c + 1);
      });

      // 4.3) style header rows
      const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFBAE7FF" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };

      const totalCols = headerRows[0].length;
      for (let r = 1; r <= depth; r++) {
        for (let c = 1; c <= totalCols; c++) {
          ws.getCell(r, c).style = headerStyle;
        }
      }

      // =========================
      // 5) Column widths
      // =========================
      ws.getColumn(1).width = wpxToChar(60); // STT
      leafCols.forEach((c, idx) => {
        const excelCol = idx + 2; // +2 vì STT
        ws.getColumn(excelCol).width = wpxToChar(c.width);
      });

      // =========================
      // 6) Dropdown validations (Lookups + DataValidation)
      // =========================
      const putLookupList = (colLetter, items) => {
        (items || []).forEach((t, i) => {
          wsLookup.getCell(`${colLetter}${i + 1}`).value = t ?? "";
        });
        return `'Lookups'!$${colLetter}$1:$${colLetter}$${Math.max(
          (items || []).length,
          1
        )}`;
      };

      const applyDropdownForField = (fieldName, lookupRange) => {
        const col = getExcelColIndexByField(fieldName);
        if (col <= 0) return;

        const firstDataRow = depth + 1;
        const lastDataRow = depth + EMPTY_ROWS;

        for (let r = firstDataRow; r <= lastDataRow; r++) {
          ws.getCell(r, col).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [lookupRange]
          };
        }
      };

      // Ẩn sheet Lookups (optional)
      wsLookup.state = "veryHidden";

      // 6.1) contract_type
      const contractTypeTexts = (this.type_contract_list || []).map((x) => x.text);
      const contractTypeRange = putLookupList("A", contractTypeTexts);
      applyDropdownForField("contract_type", contractTypeRange);

      // 6.2) form_payment_selected
      const formPaymentTexts = (this.form_payment_list || []).map((x) => x.text);
      const formPaymentRange = putLookupList("B", formPaymentTexts);
      applyDropdownForField("form_payment_selected", formPaymentRange);

      // 6.3) form_contract_execution
      const formExecutionTexts = (this.form_contract_execution_list || []).map((x) => x.text);
      const formExecutionRange = putLookupList("C", formExecutionTexts);
      applyDropdownForField("form_contract_execution", formExecutionRange);

      // 6.4) contract_payment_status
      const statusPaymentTexts = (this.status_payment_contract_list || []).map((x) => x.text);
      const statusPaymentRange = putLookupList("D", statusPaymentTexts);
      applyDropdownForField("contract_payment_status", statusPaymentRange);

      // 6.5) revenue_type
      const revenueTypeTexts = (this.type_revenue || this.type_revenue_list || []).map((x) => x.text);
      const revenueTypeRange = putLookupList("E", revenueTypeTexts);
      applyDropdownForField("revenue_type", revenueTypeRange);

      // 6.6) ✅ NEW: arr_serviceids (Sản phẩm dịch vụ) từ this.all_services
      // Dựa theo mapping bạn đưa:
      // const id = Number(s.id ?? s.service_id ?? s.serviceId);
      // const name = s.text ?? s.service_name ?? s.serviceName ?? s.name;
      const serviceNameSet = new Set();
      (this.all_services || []).forEach((s) => {
        const id = Number(s?.id ?? s?.service_id ?? s?.serviceId);
        const name = s?.text ?? s?.service_name ?? s?.serviceName ?? s?.name;
        if (Number.isFinite(id) && name) serviceNameSet.add(String(name));
      });

      // Sort để dropdown dễ dùng
      const serviceTexts = Array.from(serviceNameSet).sort((a, b) =>
        a.localeCompare(b, "vi", { sensitivity: "base" })
      );

      const serviceRange = putLookupList("F", serviceTexts);
      applyDropdownForField("arr_serviceids", serviceRange);

      // =========================
      // ✅ 6.7) Sheet Users - xuất dữ liệu this.all_users
      // =========================
      const users = Array.isArray(this.all_users) ? this.all_users : [];

      wsUsers.addRow(["Mã nhân viên", "Nhân viên", "Phòng/Nhóm"]);
      for (let c = 1; c <= 3; c++) wsUsers.getCell(1, c).style = headerStyle;

      users.forEach((u) => {
        wsUsers.addRow([u?.code ?? "", u?.full_name ?? "", u?.department_name ?? ""]);
      });

      wsUsers.getColumn(1).width = 18;
      wsUsers.getColumn(2).width = 30;
      wsUsers.getColumn(3).width = 35;
      wsUsers.views = [{ state: "frozen", ySplit: 1 }];

      // border nhẹ cho data Users
      const lastUserRow = Math.max(2, wsUsers.rowCount);
      for (let r = 2; r <= lastUserRow; r++) {
        for (let c = 1; c <= 3; c++) {
          wsUsers.getCell(r, c).border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          };
          wsUsers.getCell(r, c).alignment = { vertical: "middle", wrapText: true };
        }
      }

      // =========================
      // 7) Export file template
      // =========================
      wb.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), "file_import_hop_dong.xlsx");
      });
    },


    openImport() {
      const el = this.$refs.fileInput;
      if (!el) return;
      el.value = "";       // cho phép chọn lại cùng 1 file
      el.click();
    },

    async onChangeFile(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      const modal = this.$refs.importModal; // ImportContractExcelModal (ejs-dialog)

      try {
        const res = await this.readAndValidateExcelForTemplate(file);

        // ✅ luôn mở modal, kể cả có lỗi
        modal.open({
          fileName: file.name,
          headers: res.headers,     // headerText (không gồm STT)
          keys: res.keys,           // fieldName (không gồm STT)
          previewRows: res.rows.slice(0, 200), // preview tối đa 200 dòng
          errors: res.errors
        });
      } catch (err) {
        // lỗi kỹ thuật (không đọc được file, sheet hỏng...)
        modal.open({
          fileName: file.name,
          headers: [],
          keys: [],
          previewRows: [],
          errors: [{ row: "-", messages: [err?.message || "Không đọc được file Excel"] }]
        });
      }
    },

    async readAndValidateExcelForTemplate(file) {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      if (!ws) throw new Error("Không đọc được sheet");

      /* =====================================================
       * 1) TÍNH depth + leafCols (GIỐNG HỆT EXPORT)
       * ===================================================== */
      const isGroup = (c) => Array.isArray(c?.columns) && c.columns.length > 0;

      const maxDepth = (cols, d = 1) =>
        Math.max(
          d,
          ...(cols || []).map((c) =>
            isGroup(c) ? maxDepth(c.columns, d + 1) : d
          )
        );

      const flatten = (cols, out = []) => {
        (cols || []).forEach((c) => {
          if (isGroup(c)) flatten(c.columns, out);
          else if (c.fieldName) out.push(c);
        });
        return out;
      };

      const depth = maxDepth(this.columns);      // = 2 trong case của bạn
      const leafCols = flatten(this.columns);

      const keys = leafCols.map((c) => c.fieldName);
      const headers = leafCols.map((c) => c.headerText || c.fieldName);

      /* =====================================================
       * 2) VALIDATE HEADER 2 TẦNG (GROUP + LEAF)
       * ===================================================== */
      const normalize = (s) =>
        String(s ?? "")
          .normalize("NFC")
          .trim()
          .replace(/\s+/g, " ")
          .replace(/\u00A0/g, " ");

      const expected = ["STT", ...headers];

      // đọc 2 dòng đầu (group header + leaf header)
      const headerAoA = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: { s: { r: 0, c: 0 }, e: { r: depth, c: expected.length + 5 } },
        defval: "",
        blankrows: false
      });

      const groupRow = headerAoA[0] || [];
      const leafRow = headerAoA[1] || [];

      // GHÉP HEADER THỰC
      const realHeader = expected.map((_, i) =>
        normalize(leafRow[i] || groupRow[i] || "")
      );

      const headerOk = expected.every(
        (h, i) => normalize(h) === realHeader[i]
      );

      if (!headerOk) {
        return {
          keys,
          headers,
          rows: [],
          errors: [{
            row: "-",
            messages: [
              "File không đúng template export.",
              "Header Excel có cấu trúc 2 tầng, không được sửa hoặc gộp ô.",
              "Vui lòng dùng đúng file 'Template_import_hop_dong.xlsx' do hệ thống Export."
            ]
          }]
        };
      }

      /* =====================================================
       * 3) ĐỌC DỮ LIỆU – BỎ QUA 2 DÒNG HEADER
       * ===================================================== */
      const dataStartRow = depth; // = 2 (0-based)

      const aoa = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: dataStartRow,
        defval: "",
        blankrows: false
      });

      const rows = aoa
        .filter(
          (r) =>
            Array.isArray(r) &&
            r.some((x) => String(x ?? "").trim() !== "")
        )
        .map((r, i) => {
          const obj = {
            __excelRow: dataStartRow + i + 1 // Excel row (1-based)
          };

          // +1 để bỏ cột STT
          keys.forEach((k, idx) => {
            obj[k] = r[idx + 1] ?? "";
          });

          return obj;
        });

      /* =====================================================
       * 4) VALIDATE TỪNG DÒNG (NGHIỆP VỤ)
       * ===================================================== */
      const errors = [];
      const isEmpty = (v) => String(v ?? "").trim() === "";

      rows.forEach((r) => {
        const msgs = [];

        // REQUIRED fields (tuỳ chỉnh thêm nếu cần)
        if (isEmpty(r.contract_no)) msgs.push("Thiếu Số hợp đồng");
        if (isEmpty(r.contract_name)) msgs.push("Thiếu Tên hợp đồng");
        if (isEmpty(r.customer_name)) msgs.push("Thiếu Khách hàng");

        // Numeric (ví dụ)
        // if (!isEmpty(r.contract_value) && isNaN(Number(r.contract_value)))
        //   msgs.push("Giá trị hợp đồng không hợp lệ");

        // Date (parse ở bước chuẩn hoá payload)
        // r.contract_sign_date, r.invoice_date, ...

        if (msgs.length) {
          errors.push({
            row: r.__excelRow,
            messages: msgs
          });
        }
      });

      /* =====================================================
       * 5) RETURN CHO MODAL PREVIEW
       * ===================================================== */
      return {
        keys,       // fieldName
        headers,    // headerText
        rows,       // data rows
        errors,     // validation errors
        depth       // số dòng header
      };
    }
    ,

    // ====== B) đọc excel (template header group) -> rows objects ======
    async readExcelFile(file) {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      if (!ws) throw new Error("Không đọc được sheet");

      // 1) Lấy cấu hình cột từ columns của bạn
      const buildLeafColsAndDepth = (columns) => {
        const isGroup = (c) => Array.isArray(c?.columns) && c.columns.length > 0;

        const maxDepth = (cols, d = 1) =>
          Math.max(
            d,
            ...(cols || []).map((c) => (isGroup(c) ? maxDepth(c.columns, d + 1) : d))
          );

        const flatten = (cols, out = []) => {
          (cols || []).forEach((c) => {
            if (isGroup(c)) flatten(c.columns, out);
            else if (c.fieldName) out.push(c);
          });
          return out;
        };

        return { depth: maxDepth(columns), leafCols: flatten(columns) };
      };

      const { depth, leafCols } = buildLeafColsAndDepth(this.columns);

      // 2) Header leaf (dòng cuối header) để đối chiếu
      //    Template export của mình có thêm STT ở cột 0 => khi import bỏ qua cột 0
      const headerRowIndex = depth - 1; // dòng header leaf
      const headerAoA = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: headerRowIndex,
        blankrows: false,
      });
      const headerRow = headerAoA?.[0] || [];

      // 3) Validate header: so sánh theo headerText
      //    cột 0 là STT
      const expectedHeaders = ["STT", ...leafCols.map((c) => c.headerText || c.fieldName)];
      const normalize = (s) => String(s ?? "").trim().replace(/\s+/g, " ");

      const ok =
        headerRow.length >= expectedHeaders.length &&
        expectedHeaders.every((h, idx) => normalize(headerRow[idx]) === normalize(h));

      if (!ok) {
        throw new Error(
          "File không đúng template. Vui lòng dùng file Export Template và không thay đổi tiêu đề cột."
        );
      }

      // 4) Đọc dữ liệu từ dòng sau header
      const dataStartRow = depth; // bắt đầu ngay sau header
      const aoa = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: dataStartRow,
        defval: "",
        blankrows: false,
      });

      // 5) map aoa -> objects theo fieldName
      //    index 0 = STT, dữ liệu thật bắt đầu từ cột 1
      const rows = aoa
        .filter((r) => Array.isArray(r) && r.some((x) => String(x ?? "").trim() !== ""))
        .map((r, i) => {
          const obj = {};
          leafCols.forEach((col, idx) => {
            obj[col.fieldName] = r[idx + 1] ?? ""; // +1 vì STT
          });
          obj.__excelRow = dataStartRow + i + 1; // dòng excel (1-based)
          return obj;
        });

      return { rows, meta: { depth, leafCols } };
    },

    // ====== C) validate + gọi API import ======
    async validateAndImport(rows) {
      // 1) validate từng dòng (bạn tùy chỉnh required fields)
      const errors = [];
      const valRows = [];

      const isEmpty = (v) => String(v ?? "").trim() === "";

      rows.forEach((r) => {
        const rowErrors = [];

        // ví dụ required
        if (isEmpty(r.contract_no)) rowErrors.push("Thiếu Số hợp đồng");
        if (isEmpty(r.contract_name)) rowErrors.push("Thiếu Tên hợp đồng");
        if (isEmpty(r.customer_name)) rowErrors.push("Thiếu Khách hàng");

        // date fields: bạn có thể parse nếu cần
        // r.contract_sign_date, r.contract_expiration_date, r.acceptance_sign_date, r.invoice_date ...

        // number fields
        // r.contract_value, r.revenue_value, r.acceptance_value, r.invoice_value ...

        if (rowErrors.length) {
          errors.push({ row: r.__excelRow, messages: rowErrors });
        } else {
          valRows.push(r);
        }
      });

      this.importErrors = errors;

      // 2) nếu tất cả lỗi thì dừng
      if (valRows.length === 0) {
        return { total: rows.length, success: 0, fail: rows.length };
      }

      // 3) gọi API import (khuyến nghị backend nhận list)
      // ví dụ:
      // const res = await api.post("/contract-management/import", valRows);

      // Tạm mock:
      const res = { successCount: valRows.length, failCount: rows.length - valRows.length };

      return {
        total: rows.length,
        success: res.successCount,
        fail: res.failCount,
      };
    },

    async handleConfirmImport({ rows, errors }) {
      const invalid = new Set((errors || []).map((e) => e.row));
      const validRows = (rows || []).filter((r) => !invalid.has(r.__excelRow));

      if (!validRows.length) {
        this.$toast?.error?.("Không có dòng hợp lệ để import");
        return;
      }

      try {
        this.$refs.importModal.setLoading(true);

        // ✅ TODO: chuẩn hoá payload trước khi gửi BE
        // - parse số (contract_value, revenue_value, acceptance_value, invoice_value...)
        // - parse ngày (dd/MM/yyyy) -> YYYY-MM-DD
        // - map dropdown text -> id (contract_type, revenue_type, ...)
        const payload = validRows.map((r) => ({
          ...r
        }));

        // ✅ TODO: gọi API import
        // await api.post("/revenue/contract-management/import", payload);

        this.$refs.importModal.close();
        this.$toast?.success?.(`Import thành công ${payload.length} dòng`);

        // reload grid
        this.searchContracts?.();
      } catch (err) {
        console.error(err);
        // lỗi API thì bạn có thể đẩy lỗi này lên modal luôn nếu muốn
        this.$toast?.error?.(err?.message || "Import thất bại");
      } finally {
        this.$refs.importModal.setLoading(false);
      }
    },

    importFile() {
      this.$refs.fileInput.value = null
      document.getElementById("file").click()
    },

    onChangeFile(event) {
      this.file = event.target.files[0]
      this.readFileExcel()
    },
    maxDepth(cols, d = 1) {
      return Math.max(
        d,
        ...(cols || []).map((c) => (this.isGroup(c) ? this.maxDepth(c.columns, d + 1) : d))
      );
    },
    isGroup(col) {
      return Array.isArray(col?.columns) && col.columns.length > 0;
    },
    getLeafColMap() {
      const leafCols = this.buildLeafCols(this.columns);
      const map = {};
      leafCols.forEach(c => {
        map[c.fieldName] = c.headerText || c.fieldName;
      });
      return map;
    },
    buildLeafCols(columns) {
      const leafCols = [];
      const walk = (cols) => {
        (cols || []).forEach((col) => {
          if (this.isGroup(col)) walk(col.columns);
          else leafCols.push(col);
        });
      };
      walk(columns);
      return leafCols;
    },
    rowIsEmpty(row) {
      return !row || row.every((v) => v == null || String(v).trim() === "");
    },
    readFileExcel() {
      this.danhsach_excel = [];

      try {
        this.loading(true);
        if (!this.checkfile()) return;

        const reader = new FileReader();

        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });

          // ===== LẤY SHEET ĐẦU =====
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          // ===== READ DATA (AOA) =====
          const data = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            raw: true, // lấy number/date serial thật
            defval: null
          });

          if (!data || data.length === 0) {
            this.$toast.error("File Excel không có dữ liệu");
            return;
          }

          // ===== 1) depth header + leafCols (khớp export) =====
          const depth = this.maxDepth(this.columns);
          const leafCols = this.buildLeafCols(this.columns);

          // Map fieldName -> headerText, và fieldName -> số cột Excel
          const colLabelMap = {};
          const colIndexMap = {};
          leafCols.forEach((c, idx) => {
            colLabelMap[c.fieldName] = c.headerText || c.fieldName;
            colIndexMap[c.fieldName] = idx + 2; // +2 vì cột 1 là STT, dữ liệu bắt đầu từ cột B
          });
          const labelOf = (f) => colLabelMap[f] || f;
          const colNoOf = (f) => colIndexMap[f] || "?";

          // ===== 2) Validate template =====
          const headerRow0 = data[0] || [];
          const expectedMinCols = 1 + leafCols.length; // STT + toàn bộ leaf

          const a1 = (headerRow0[0] || "").toString().trim().toUpperCase();
          if (a1 !== "STT") {
            this.$toast.error('File không đúng template: ô A1 phải là "STT"');
            return;
          }

          if (headerRow0.length < expectedMinCols) {
            this.$toast.error(
              `File không đúng template. Cần tối thiểu ${expectedMinCols} cột (STT + ${leafCols.length} cột dữ liệu).`
            );
            return;
          }

          // (Optional) check header dòng cuối của header (thường là header của leaf)
          const lastHeaderRow = data[depth - 1] || [];
          for (let i = 0; i < leafCols.length; i++) {
            const excelHeader = (lastHeaderRow[i + 1] || "").toString().trim(); // +1 vì STT
            const expectedHeader = (leafCols[i].headerText || leafCols[i].fieldName || "")
              .toString()
              .trim();

            if (excelHeader && expectedHeader && excelHeader !== expectedHeader) {
              this.$toast.error(
                `Sai template tại cột ${i + 2}: header đang là "${excelHeader}" nhưng template yêu cầu "${expectedHeader}".`
              );
              return;
            }
          }

          // ===== 3) Converter excel date serial -> JS Date =====
          const excelDateToJSDate = (serial) => {
            try {
              const d = XLSX.SSF.parse_date_code(serial);
              if (!d) return null;
              return new Date(d.y, d.m - 1, d.d);
            } catch {
              return null;
            }
          };

          // ===== 4) Helpers parse/format date =====
          const pad2 = (n) => String(n).padStart(2, "0");
          const toYMD = (dt) =>
            `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;

          const parseDateString = (s) => {
            const str = (s || "").toString().trim();
            if (!str) return null;

            // dd/MM/yyyy
            let m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (m) {
              const dd = parseInt(m[1], 10);
              const mm = parseInt(m[2], 10);
              const yyyy = parseInt(m[3], 10);
              const dt = new Date(yyyy, mm - 1, dd);
              if (
                dt.getFullYear() === yyyy &&
                dt.getMonth() === mm - 1 &&
                dt.getDate() === dd
              )
                return dt;
              return null;
            }

            // yyyy-MM-dd
            m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
            if (m) {
              const yyyy = parseInt(m[1], 10);
              const mm = parseInt(m[2], 10);
              const dd = parseInt(m[3], 10);
              const dt = new Date(yyyy, mm - 1, dd);
              if (
                dt.getFullYear() === yyyy &&
                dt.getMonth() === mm - 1 &&
                dt.getDate() === dd
              )
                return dt;
              return null;
            }

            return null;
          };

          const dateFields = [
            "contract_sign_date",
            "contract_expiration_date",
            "acceptance_sign_date",
            "invoice_date"
          ];

          const numberFields = [
            "contract_value",
            "revenue_value",
            "acceptance_value",
            "invoice_value"
          ];

          // ===== 5) Loop data: bắt đầu từ dòng depth =====
          let isError = false;

          for (let r = depth; r < data.length; r++) {
            const row = data[r];
            if (this.rowIsEmpty(row)) continue;

            // ===== 5.1) Map full object theo leafCols (bỏ STT) =====
            const item = {};
            leafCols.forEach((col, idx) => {
              item[col.fieldName] = row[idx + 1] ?? null; // +1 vì STT
            });

            // ===== 5.2) Validate + chuẩn hoá date fields (BÁO headerText) =====
            for (const f of dateFields) {
              let v = item[f];

              if (v === "" || v === null) {
                item[f] = null;
                continue;
              }

              // Excel date serial
              if (typeof v === "number") {
                const dt = excelDateToJSDate(v);
                if (!dt) {
                  this.$toast.error(
                    `Dòng ${r + 1}, cột ${colNoOf(f)} ("${labelOf(f)}"): ngày không hợp lệ`
                  );
                  isError = true;
                  break;
                }
                item[f] = toYMD(dt); // gửi BE an toàn cho DateTime?
                continue;
              }

              // String date
              const dt = parseDateString(v);
              if (!dt) {
                this.$toast.error(
                  `Dòng ${r + 1}, cột ${colNoOf(f)} ("${labelOf(
                    f
                  )}"): phải là ngày (dd/MM/yyyy hoặc yyyy-MM-dd) hoặc để trống`
                );
                isError = true;
                break;
              }
              item[f] = toYMD(dt);
            }
            if (isError) break;

            // ===== 5.3) Validate + chuẩn hoá number fields (BÁO headerText) =====
            for (const f of numberFields) {
              let v = item[f];

              if (v === "" || v === null) {
                item[f] = null;
                continue;
              }

              if (typeof v !== "number" || isNaN(v)) {
                this.$toast.error(
                  `Dòng ${r + 1}, cột ${colNoOf(f)} ("${labelOf(
                    f
                  )}"): phải là số hoặc để trống`
                );
                isError = true;
                break;
              }
            }
            if (isError) break;

            // ===== 5.4) Validate bắt buộc (tuỳ bạn chỉnh) =====
            const contract_no =
              item.contract_no != null ? item.contract_no.toString().trim() : "";
            if (!contract_no) {
              this.$toast.error(
                `Dòng ${r + 1}, cột ${colNoOf("contract_no")} ("${labelOf(
                  "contract_no"
                )}"): không được để trống`
              );
              isError = true;
              break;
            }

            // ===== 5.5) CHUẨN HOÁ PAYLOAD THEO BE DTO =====
            // 1) RowNumber (BE DTO dùng PascalCase)
            item.RowNumber = r + 1;

            // 2) Map field người dùng nhập text -> *_import (BE nhận *_import)
            const importTextFields = [
              "contract_type",
              "form_payment_selected",
              "form_contract_execution",
              "contract_payment_status",
              "revenue_type",
              "arr_serviceids"
            ];

            importTextFields.forEach((f) => {
              const v = item[f];
              item[`${f}_import`] =
                v === null || v === "" ? null : String(v).trim();
              delete item[f]; // xoá field gốc để tránh gửi nhầm
            });

            // 3) Trim các field text thường (để sạch dữ liệu)
            const trimFields = [
              "contract_no",
              "contract_name",
              "customer_name",
              "contract_execution_time",
              "test_payment_date",
              "full_name"
            ];
            trimFields.forEach((f) => {
              if (item[f] != null) item[f] = String(item[f]).trim();
            });

            // ===== 5.6) Push =====
            this.danhsach_excel.push(item);
          }

          if (!isError && this.danhsach_excel.length > 0) {
            this.read_data_file(this.danhsach_excel);
          } else if (!isError) {
            this.$toast.error("Không có dòng dữ liệu hợp lệ để import");
          }
        };

        reader.readAsBinaryString(this.file);
      } catch (error) {
        console.error(error);
        this.$toast.error("Có lỗi xảy ra khi đọc file Excel");
      } finally {
        this.loading(false);
      }
    },



    formatVND(field, data, column) {
      if (typeof data[field] !== 'number') return '';
      return new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 0
      }).format(data[field]);
    },

    async read_data_file(data = null) {
      // 0) Validate input
      if (!Array.isArray(data) || data.length === 0) {
        this.$toast.error("Không có dữ liệu để kiểm tra");
        return;
      }

      const request = {
        user_id: 0,
        items: data,
      };

      // 1) Call API
      let res = null;
      try {
        res = await API.CheckImportContratManagement(this, request);
      } catch (e) {
        console.error("CheckImportContratManagement error:", e);
        this.$toast.error("Gọi API kiểm tra import thất bại");
        return;
      }

      if (!res) {
        this.$toast.error("Không có dữ liệu trả về");
        return;
      }

      // 2) Parse payload
      let payload = res;
      try {
        payload = typeof res === "string" ? JSON.parse(res) : res;
      } catch (e) {
        console.error("Parse res error:", e);
        this.$toast.error("Dữ liệu trả về không hợp lệ (không parse được JSON)");
        return;
      }

      // 3) Normalize về checkResult (ImportCheckResponse)
      // Case A: DataRespond { success, message, data }
      // Case B: ImportCheckResponse { total, valid, invalid, is_valid, rows }
      let checkResult = null;

      if (payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "success")) {
        // ---- Case A
        if (!payload.success) {
          this.$toast.error(payload.message || "Kiểm tra import thất bại");
          return;
        }

        try {
          checkResult = typeof payload.data === "string" ? JSON.parse(payload.data) : payload.data;
        } catch (e) {
          console.error("Parse payload.data error:", e);
          this.$toast.error("Dữ liệu kiểm tra trả về không hợp lệ");
          return;
        }
      } else {
        // ---- Case B
        checkResult = payload;
      }

      // 4) Validate checkResult minimal shape
      if (!checkResult || typeof checkResult !== "object") {
        this.$toast.error("Dữ liệu kiểm tra không hợp lệ");
        return;
      }

      // Optional: ensure rows is array to avoid UI crash
      if (!Array.isArray(checkResult.rows)) checkResult.rows = [];

      // 5) Assign + open modal
      this.dataCheckImports = checkResult;
      this.importItems = data;              // data = items gửi lên API
      this.headerDepth = this.headerDepth || 1;
      await this.$nextTick();
      this.$refs.checkImportIndicatorUserScoreModal.showModal();
    },
    kiemTraDuLieu(columns) {
      if (!columns || columns.length < 4) {
        this.$toast.error(
          'File Excel phải gồm các cột: STT, Dịch vụ, Giá trị hợp đồng, Hợp đồng đã nghiệm thu'
        )
        return false
      }
      return true
    },
    checkfile() {
      if (!this.file) {
        this.$toast.error('Chưa chọn file Excel')
        return false
      }

      if (
        this.file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.$toast.error('File upload không đúng định dạng .xlsx')
        return false
      }

      return true
    },
  },

}
</script>

<style src="./ContractManagement.css" scoped></style>