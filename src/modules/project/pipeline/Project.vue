<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 45px !important; bottom: 40px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w90 bold">Tìm kiếm</div>
              <div class="value">
                <input
                  type="text"
                  v-model="search_query"
                  class="form-control"
                  placeholder="Nhập mã hoặc tên dự án..."
                  @input="searchProjects"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key w90 bold">Loại dự án</div>
              <div class="value">
                <ejs-multiselect 
                  id='projectTypeMultiSelect'
                  ref="projectTypeMultiSelect"
                  :dataSource="all_project_types" 
                  placeholder="Chọn loại dự án" 
                  v-model="project_types_selected" 
                  :fields='projectTypeFields' 
                  :allowFiltering="true" 
                  filterType="Contains"
                  mode="Box"
                  :maximumSelectionLength="10"
                  :overflowMode="'Wrap'"
                  :delimiterChar="'; '"
                  @change="onProjectTypeChange">
                </ejs-multiselect>
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w140 bold">Phòng ban phụ trách</div>
              <div class="value">
                <select2 v-model="department_selected" 
                  :options="department_list.map(e=>({id:e.department_id, text:e.department_name}))" 
                  @change="onDepartmentChange" 
                />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w120 bold">Trạng thái dự án</div>
              <div class="value">
                <select2 v-model="status_selected" :options="project_statuses" @change="onStatusChange" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-form">
        <div class="k" style="width:100%">
          <div class="group-buttons mb-3" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div class="button-group">
              <button v-if="hasButtonPermission('insertProject')" class="btn btn-second " style="min-width: 100px;" @click.prevent="ThemMoi()">
                <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
              </button>&nbsp;

              <button v-if="hasButtonPermission('updateProject')"  class="btn btn-second" style="min-width: 100px;" @click.prevent="editProject()">
                <span class="icon one-edit"></span>&nbsp;Điều chỉnh
              </button>&nbsp;
              
              <button v-if="hasButtonPermission('deleteProject')"  class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteProject()">
                <span class="icon one-trash"></span>&nbsp;Xóa
              </button>&nbsp;

              <button v-if="hasButtonPermission('membersOfProject')" class="btn btn-second" style="min-width: 100px;" @click.prevent="viewMembers()">
                <span class="icon fa fa-users"></span>&nbsp;Thành viên
              </button>&nbsp;

              <button v-if="hasButtonPermission('revenueOfProject')" c class="btn btn-second" style="min-width: 120px;" @click.prevent="viewRevenue()">
                <span class="icon fa fa-money"></span>&nbsp;Dự kiến doanh thu
              </button>&nbsp;

              <button v-if="hasButtonPermission('completeProject')" class="btn btn-second" style="min-width: 120px;" @click.prevent="completeProject()">
                <span class="icon fa fa-check-circle"></span>&nbsp;Hoàn thành dự án
              </button>&nbsp;

              <button  v-if="hasButtonPermission('approveProject')" class="btn btn-second" style="min-width: 100px;" @click.prevent="approveProject()">
                <span class="icon fa fa-check"></span>&nbsp;Phê duyệt
              </button>&nbsp;

              <button  v-if="hasButtonPermission('closeProject')" class="btn btn-second" style="min-width: 100px;" @click.prevent="closeProject()">
                  <span class="icon fa" :class="row_selected.is_locked ? 'fa-unlock' : 'fa-lock'"></span>
                  &nbsp;{{ toggleLockText }}
              </button>&nbsp;
            </div>
            
            <div class="k status-legend">
              <div class="status-item" >
                <span class="status-icon status-completed"></span>
                <span class="status-label">Hoàn thành</span>
              </div>
              <div class="status-item">
                <span class="status-icon status-ongoing"></span>
                <span class="status-label">Đang thực hiện</span>
              </div>
              <div class="status-item">
                <span class="status-icon status-pending"></span>
                <span class="status-label">Chưa thực hiện</span>
              </div>
            </div>
          </div>
        </div>
        
        <Pipeline
          ref="pipelineGrid"
          :columns="columns"
          :dataSource="filteredProjects"
          :panelDataHeight="'60vh'"
          :showActionColumn="false"
          :showColumnCheckbox="false"
          :selectionSettings="{ type: 'Single', enableToggle: false }"
          :defaultColumnCheckboxChecked="false"
          :allowPaging="true"
          :pageSize="100"
          :pageIndex="0"
          :enablePagingServer="false"
          :hasUpdatePipelineStep = hasUpdatePipelineStep
          @onSelectedRow="onRowSelected"
          @selectedItemsChanged="onSelectedItemsChanged"
          @selectedRowChanged="onSelectedRowChanged"
          @rowDoubleClicked="onRecordDoubleClick"
          @step-updated="handleStepUpdate"
          @step-approved="handleStepApprove"
          @step-rejected="handleStepReject"
        />
      </div>
    </div>
    <!-- Project Modal -->
    <ProjectModal
      ref="projectModal"
      :isAdd="is_add_new"
      :isViewDetail="is_view_detail"
      :data="row_selected" 
      :canApproveAmount="canUserApproveAmount"
      :projectTypesList="all_project_types"
      :customersList="all_customers"
      :customerTypesList="all_customer_types"
      :vnptUnitsList="all_vnpt_units"
      :promotionUnitsList="all_promotion_units"
      :developmentUnitsList="all_development_units"
      :usersList="all_users"
      :servicesList="all_services"
      @successProject="successProject"
    />
    
    <!-- Members Modal -->
    <ProjectMembersModal
      ref="membersModal"
      :projectData="row_selected"
      @successMembers="loadDetailData"
    />
    
    <!-- Revenue Modal -->
    <ProjectRevenueModal
      ref="revenueModal"
      :projectData="row_selected"
      @successRevenue="loadDetailData"
    />
  </div>
</template>

<script>
import moment from 'moment'
import Pipeline from '../table/Pipeline.vue'
import ProjectModal from './popups/ProjectModal.vue'
import ProjectMembersModal from './popups/ProjectMembersModal.vue'
import ProjectRevenueModal from './popups/ProjectRevenueModal.vue'
import API from './ProjectAPI'
export default {
  name: "ProjectPipeline",
  components: {
    Pipeline,
    ProjectModal,
    ProjectMembersModal,
    ProjectRevenueModal
  },
  data() {
    return {
      header: {
        title: "DỰ ÁN THEO PIPELINE",
        list: [],
      },
      // Dữ liệu tìm kiếm và lọc
      search_query: '',
      project_types_selected: [],
      status_selected: 1,
      projectTypeFields: {
        value: 'id',
        text: 'text'
      },
      
      // Trạng thái loading và selection
      is_loading: false,
      is_add_new: false,
      is_view_detail: true,
      row_selected: {}, // Single selected item
      
      // Dữ liệu danh sách
      data_sources: [],
      original_data_sources: [],
      detail_data_sources: [],
      all_project_types: [],
      all_customers: [],
      all_customer_types: [],
      all_vnpt_units: [],
      all_promotion_units: [],
      all_development_units: [],
      all_users: [],
      all_services: [],
      
      project_statuses: [
        { id: 0, text: "Tất cả" },
        { id: 1, text: "Đang hoạt động" },
        { id: 2, text: "Đã đóng" },
        { id: 3, text: "Đã hoàn thành" },
      ],
      columns: [
        {
          fieldName: "customerName",
          headerText: "Tên khách hàng",
          width: "200px",
          isFixed: true,
          isPipelineStep: false
        },
        {
          fieldName: "projectCode",
          headerText: "Mã dự án",
          width: "150px",
          isFixed: true,
          isPipelineStep: false
        },
        {
          fieldName: "projectName",
          headerText: "Dự án",
          width: "250px",
          isFixed: true,
          isPipelineStep: false
        },
        {
          fieldName: "pipeline.approach",
          headerText: "Tiếp cận, khảo sát, giới thiệu SPDV",
          width: "150px",
          isPipelineStep: true,
          periodId: 1
        },
        {
          fieldName: "pipeline.labSystem",
          headerText: "Xây dựng hệ thống thử nghiệm",
          width: "150px",
          isPipelineStep: true,
          periodId: 2
        },
        {
          fieldName: "pipeline.proposal",
          headerText: "CĐT lập đề án xin bố trí vốn",
          width: "150px",
          isPipelineStep: true,
          periodId: 3
        },
        {
          fieldName: "pipeline.detailedOutline",
          headerText: "CĐT xây dựng đề cương chi tiết",
          width: "150px",
          isPipelineStep: true,
          periodId: 4
        },
        {
          fieldName: "pipeline.biddingDocs",
          headerText: "CĐT phát hành HSMT",
          width: "150px",
          isPipelineStep: true,
          periodId: 5
        },
        {
          fieldName: "pipeline.bidding",
          headerText: "Tham dự thầu",
          width: "150px",
          isPipelineStep: true,
          periodId: 6
        },
        {
          fieldName: "pipeline.contract",
          headerText: "Ký kết hợp đồng",
          width: "150px",
          isPipelineStep: true,
          periodId: 7
        },
        {
          fieldName: "pipeline.implementation",
          headerText: "Triển khai dự án",
          width: "150px",
          isPipelineStep: true,
          periodId: 8
        },
        {
          fieldName: "pipeline.acceptance",
          headerText: "Nghiệm thu xuất hóa đơn",
          width: "150px",
          isPipelineStep: true,
          periodId: 9
        },
        {
          fieldName: "pipeline.support",
          headerText: "Hỗ trợ duy trì sử dụng",
          width: "150px",
          isPipelineStep: true,
          periodId: 10
        },
      ],
      canUserApproveAmount: false,
      department_selected:0,
      department_list:[
        {
          department_id:0,
          department_name:'Tất cả'
        }
      ]

    };
  },
  computed: {
    toggleLockText() {
      if (this.row_selected && this.row_selected.is_locked) {
        return "Mở khóa dự án";
      }
      return "Đóng dự án";
    },

    filteredProjects() {
      let filtered = [...this.original_data_sources];

      // Lọc theo tìm kiếm
      if (this.search_query && this.search_query.trim()) {
        const query = this.search_query.toLowerCase().trim();
        filtered = filtered.filter(project => {
          const projectCode = project.projectCode ? project.projectCode.toLowerCase() : '';
          const projectName = project.projectName ? project.projectName.toLowerCase() : '';
          const customerName = project.customerName ? project.customerName.toLowerCase() : '';
          
          return projectCode.includes(query) || 
                 projectName.includes(query) || 
                 customerName.includes(query);
        });
      }

      // Lọc theo loại dự án
      if (this.project_types_selected && this.project_types_selected.length > 0) {
        filtered = filtered.filter(project => this.project_types_selected.includes(project.projectTypeId));
      }

      // Lọc theo trạng thái dự án
      if (this.status_selected && this.status_selected > 0) {
        filtered = filtered.filter(project => {
          let currentStatusId;
          if (project.is_completed == true) {
            currentStatusId = 3; // Đã hoàn thành
          } else if (project.is_locked == true) {
            currentStatusId = 2; // Đã đóng
          } else {
            currentStatusId = 1; // Đang hoạt động
          }
          return currentStatusId == this.status_selected;
        });
      }
      if(this.department_selected&&this.department_selected>0){
        const dep = Number(this.department_selected)
        filtered = filtered.filter(project => {
          return Array.isArray(project.responsibleDepartments) 
            && project.responsibleDepartments.includes(dep);
        })
      }

      return filtered;
    },
    hasUpdatePipelineStep(){
      return this.hasButtonPermission('updatePipelineStep')
    }
  },
  methods: {
    loading(show) {
      this.$root.showLoading(show)
    },
    async loadPipelineData() {
      this.loading(true);
      const projectsData = await API.GetProjectPipeline(this);
      this.original_data_sources = projectsData || [];
      this.loading(false);
      
      // Force update filtered data after loading
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    async loadDetailData() {
      this.loading(true);
      const response = await API.GetProjectDetail(this);
      this.loading(false);

      if (response) {
          // Gán danh sách dự án vào detail_data_sources
          this.detail_data_sources = response.projectList || [];
          // Gán cờ phê duyệt vào biến mới
          this.canUserApproveAmount = response.canApprove || false;
      } else {
          this.detail_data_sources = [];
          this.canUserApproveAmount = false;
      }
    },

    async loadProjectTypes() {
      const projectTypesData = await API.GetActiveProjectTypes(this);
      this.all_project_types = projectTypesData || [];
      
      if (this.project_types_selected.length === 0 && this.all_project_types.length > 0) {
        const defaultIds = [1, 2];
        const availableIds = this.all_project_types.map(type => type.id);
        this.project_types_selected = defaultIds.filter(id => availableIds.includes(id));
      }
    },

    async loadCustomers() {
      const customersData = await API.GetActiveCustomers(this);
      this.all_customers = customersData || [];
    },

    async loadCustomerTypes() {
      const customerTypesData = await API.GetActiveCustomerTypes(this);
      this.all_customer_types = customerTypesData || [];
    },

    async loadVnptUnits() {
      const vnptUnitsData = await API.GetActiveVnptUnits(this);
      this.all_vnpt_units = vnptUnitsData || [];
    },

    async loadPromotionUnits() {
      const promotionUnitsData = await API.GetActivePromotionUnits(this);
      this.all_promotion_units = promotionUnitsData || [];
    },

    async loadDevelopmentUnits() {
      const developmentUnitsData = await API.GetActiveDevelopmentUnits(this);
      this.all_development_units = developmentUnitsData || [];
    },

    async loadUsers() {
      const usersData = await API.GetActiveUsers(this);
      this.all_users = usersData || [];
    },

    async loadServices() {
      const servicesData = await API.GetAllServices(this);
      this.all_services = servicesData || [];
    },

    ThemMoi() {
      this.is_add_new = true
      this.is_view_detail = false
      this.row_selected = {}
      this.$refs.projectModal.showModal()
    },
    async editProject() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.row_selected && (this.row_selected.is_locked === true)) {
        this.$toast.error('Dự án đang bị đóng, không thể điều chỉnh.');
        return;
      }
      const fullDetail = this.detail_data_sources.find(p => p.id === this.row_selected.id);
      if (fullDetail) {
          this.is_add_new = false;
          this.is_view_detail = false;
          this.row_selected = fullDetail;
          this.$refs.projectModal.showModal();
      } else {
          this.$toast.error("Không tìm thấy dữ liệu chi tiết cho dự án này.");
      }
    },

    async deleteProject() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.row_selected && (this.row_selected.is_locked === true)) {
        this.$toast.error('Dự án đang bị đóng, không thể xóa.');
        return;
      }
      const confirmMessage = `Bạn chắc chắn muốn xóa dự án "${this.row_selected.projectName || this.row_selected.projectCode}"?`;
      const result = await this.$confirm(confirmMessage, 'Xác nhận xóa dự án');
      if (!result) return;
      
      const response = await API.DeleteProject(this, this.row_selected.id);
      if (response && response.success) {
        this.$toast.success('Xóa dự án thành công!');
        await this.loadDetailData();
        await this.loadPipelineData();
        this.row_selected = {};
      } else {
        this.$toast.error(response.message);
      }
    },

    viewDetail(rowData) {
      const fullDetail = this.detail_data_sources.find(p => p.id === rowData.id);
       if (fullDetail) {
          this.is_add_new = false;
          this.is_view_detail = true;
          // Truyền dữ liệu chi tiết vào modal
          this.row_selected = fullDetail;
          this.$refs.projectModal.showModal();
       } else {
          this.$toast.error("Không tìm thấy dữ liệu chi tiết cho dự án này.");
      }
    },

    onRowSelected(selectedRecords) {
      // Single selection mode - chỉ lấy record đầu tiên
      if (Array.isArray(selectedRecords) && selectedRecords.length > 0) {
        this.row_selected = selectedRecords[0];
      } else if (selectedRecords && !Array.isArray(selectedRecords)) {
        this.row_selected = selectedRecords;
      } else {
        this.row_selected = {};
      }
    },

    onSelectedItemsChanged(selectedIds) {
      console.log('Selected items changed:', selectedIds);
    },

    onSelectedRowChanged(selectedRow) {
      if (selectedRow) {
        this.row_selected = selectedRow;
      }
    },

    onRecordDoubleClick(rowIndex, item) {
      if (item) {
        this.viewDetail(item);
      }
    },

    async successProject() {
      await this.loadDetailData();
      await this.loadPipelineData();
    },

    onProjectTypeChange() {
      this.row_selected = {};
      this.$forceUpdate();
    },

    onStatusChange(option) {
      if (option && option.id !== undefined) {
        this.status_selected = option.id;
        this.row_selected = {};
      }
    },
    onDepartmentChange(){

    },
    searchProjects() {
      this.row_selected = {};
      this.$forceUpdate();
    },

    // Clear all filters
    clearFilters() {
      this.search_query = '';
      this.project_types_selected = [];
      this.status_selected = 0;
      this.row_selected = {};
    },

    // Refresh data and clear filters
    async refreshData() {
      this.clearFilters();
      await this.loadPipelineData();
      await this.loadDetailData();
    },

    // Pipeline step update handler
    async handleStepUpdate(eventData) {
      // Map fieldName từ frontend sang period_id của backend
      const periodIdMapping = {
        "pipeline.approach": 1,
        "pipeline.labSystem": 2,
        "pipeline.proposal": 3,
        "pipeline.detailedOutline": 4,
        "pipeline.biddingDocs": 5,
        "pipeline.bidding": 6,
        "pipeline.contract": 7,
        "pipeline.implementation": 8,
        "pipeline.acceptance": 9,
        "pipeline.support": 10
      };
      
      const periodId = periodIdMapping[eventData.column.fieldName];
      
      if (!periodId) {
        this.$toast.error('Lỗi: Không xác định được bước pipeline.');
        return;
      }
      
      // Chuẩn bị payload để gửi lên backend
      // Dữ liệu `statusId` đã là số (1, 2, 3) từ Pipeline.vue gửi lên
      const payload = {
        project_id: eventData.item.id,
        period_id: periodId,
        due_date: eventData.stepData.date ? moment(eventData.stepData.date, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') : null,
        status: eventData.stepData.statusId 
      };
      
      this.loading(true);
      const response = await API.UpdatePipelineStep(this, payload);
      this.loading(false);

      if (response && response.success) {
        await this.loadDetailData();
        await this.loadPipelineData();
      }
    },
    // Xử lý sự kiện phê duyệt
    async handleStepApprove(eventData) {
      this.loading(true);
      const response = await API.ApprovePipelineStep(this, eventData.projectId, eventData.periodId);
      this.loading(false);

      if (response && response.success) {
        this.$toast.success(response.message);
        await this.loadPipelineData();
      } else if (response) {
        this.$toast.error(response.message);
      }
    },

    // Xử lý sự kiện từ chối
    async handleStepReject(eventData) {
      const confirm = await this.$confirm('Bạn có chắc chắn muốn từ chối thay đổi này không?', 'Xác nhận');
      if (!confirm) return;

      this.loading(true);
      const response = await API.RejectPipelineStep(this, eventData.projectId, eventData.periodId);
      this.loading(false);

      if (response && response.success) {
        this.$toast.success(response.message);
        await this.loadPipelineData();
      } else if (response) {
        this.$toast.error(response.message);
      }
    },
    // Thành viên dự án
    viewMembers() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.row_selected.is_locked == true) {
        this.$toast.error('Dự án đang bị đóng, không thể xem thành viên.');
        return;
      }
      
      this.$refs.membersModal.showModal();
    },

    // Dự kiến doanh thu
    viewRevenue() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.row_selected.is_locked == true) {
        this.$toast.error('Dự án đang bị đóng, không thể xem doanh thu.');
        return;
      }
      
      this.$refs.revenueModal.showModal();
    },
    checkActionPermission() {
      if (!this.row_selected || !this.row_selected.id) {
        this.$toast.error('Vui lòng chọn một dự án để thực hiện thao tác.');
        return false;
      }
      return true;
    },
    async completeProject() {
      if (!this.checkActionPermission()){
        return;
      }
      const result = await this.$confirm(`Bạn chắc chắn muốn đánh dấu dự án là hoàn thành?`, 'Một khi hoàn thành, dự án sẽ không được chỉnh sửa hoặc thực hiện bất kỳ thao tác nào');
      if (!result) return;
      
      const response = await API.CompleteProject(this, this.row_selected.id);
      if (response && response.success) {
        await this.loadDetailData();
        await this.loadPipelineData();
      }
    },
    async approveProject() {
      if (!this.checkActionPermission()){
        return;
      }
      const result = await this.$confirm(`Bạn chắc chắn muốn phê duyệt dự án?`, 'Sau khi phê duyệt, dự án sẽ được bắt đầu thực hiện');
      if (!result) return;
      
      const response = await API.ApproveProject(this, this.row_selected.id);
      if (response && response.success){
        await this.loadDetailData();
        await this.loadPipelineData();
      }
    },
    async closeProject() {
      if (!this.checkActionPermission()) {
        return;
      }
      const actionText = (this.row_selected.is_locked ?? false) ? "mở khóa" : "đóng";
      const result = await this.$confirm(`Bạn chắc chắn muốn ${actionText} dự án?`, 'Xác nhận');
      if (!result) return;

      const response = await API.ToggleLockProject(this, this.row_selected.id);
      if (response && response.success) {
        const selectedId = this.row_selected.id;
        await this.loadDetailData();
        await this.loadPipelineData();
        const updatedProject = this.original_data_sources.find(p => p.id === selectedId);
        if (updatedProject) {
          this.row_selected = updatedProject;
        } else {
          this.row_selected = {};
        }
      }
    },
    async GetDepartmentTTKDGP(){
      let data=await API.GetDepartmentTTKDGP(this)
      if(data){
        data=JSON.parse(data)
        this.department_list=this.department_list.concat(data.filter(x=>x.dep_type_id==3))
      }
    }
  },
  async created() {
    // Kiểm tra nếu có query parameters từ Dashboard
    if (this.$route.query.search) {
      this.search_query = this.$route.query.search;
    }
    await Promise.all([
      this.loadPipelineData(),
      this.loadDetailData(),
      this.loadProjectTypes(),
      this.GetDepartmentTTKDGP(),
      // this.loadCustomers(),
      this.loadCustomerTypes(),
      this.loadVnptUnits(),
      this.loadPromotionUnits(),
      this.loadDevelopmentUnits(),
      this.loadUsers(),
      this.loadServices(),
      this.GetPermissionButtons()
    ]);
  },
};
</script>

<style src="./Project.css" scoped></style>