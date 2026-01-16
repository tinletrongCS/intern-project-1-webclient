<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />

    <div class="page-content" style="top:46px !important; bottom: 46px !important;">
       <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">

      <!-- ===== FILTER ===== -->
      <div class="report-header-left">
        <p>
          Theo dõi và thống kê số lượng các dịch vụ cần thẩm định của các nhân viên theo từng đơn vị kinh doanh.
        </p>
      </div>
      
      <div class="box-form filter-wrapper">
        <div class="row">
          

          <!-- Nhân sự -->
          <div class="col-md-3 col-12">
            <div class="info-row">
              <div class="key bold">Nhân sự</div>
              <div class="value">
                <select2
                  v-model="staff_selected"
                  :options="staff_list.map(e=>({id:e.user_id, text:e.display_name}))"
                  @select="onChangeStaff"
                />
              </div>
            </div>
          </div>
          <!-- Đơn vị-->
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w60">Đơn vị</div>
              <div class="value">
                <select2
                  v-model="unit_selected"
                  :options="unit_list"
                  @select="onChangeUnit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-form action-wrapper">
        <div class="row align-items-center">

          <!-- Bên phải -->
          <div class="col-md-6 col-12 btn-sm float-right action-buttons">
            <button class="btn btn-purple btn-sm" 
                    @click="onAppraisal">
              <span class="icon fa fa-check"></span> Thẩm định
            </button>
          </div>

        </div>
      </div>

      <!-- ===== TABLE ===== -->
      <CapabilityAppraisalTable
        ref="capabilityAppraisalTable"
        :dataSource="capabilityData"
        @selection-change="onSelectionChange"
        @click-view="openAppraisalPopup"
        :pageSize="10"
      />

    </div>
    <!-- Modal -->
    <UpdateCapabilityContractDialog ref="updateCapabilityContractDialog"
      :data="selectedRows"
      @successAddUpdate="successAddUpdate"
      :user_id="staff_selected"
    />
    <AppraisalEvaluationDialog
      ref="appraisalDialog"
      :data="appraisalList"
      :user_id="staff_selected"
      @success="successAppraisal"
    />
    <CheckImportIndicatorUserScoreModal
      ref="checkImportIndicatorUserScoreModal"
      :dataCheckImports="dataCheckImports"
      @successImportData="successImportData"
    />
  </div>
</template>

<script>
import StatisticsCard from './StatisticsCard.vue'
//import CapabilityTable from './CapabilityTable.vue'
import CapabilityAppraisalTable from './CapabilityAppraisalTable.vue'
import API from './API'
import UpdateCapabilityContractDialog from './UpdateCapabilityContractDialog.vue'
import AppraisalEvaluationDialog from './AppraisalEvaluationDialog.vue'
import * as XLSX from 'xlsx'
import CheckImportIndicatorUserScoreModal from './CheckImportIndicatorUserScoreModal.vue'
export default {
  name: 'AmCapability',
  components: {
    StatisticsCard,
    CapabilityAppraisalTable,
    UpdateCapabilityContractDialog,
    AppraisalEvaluationDialog,
    CheckImportIndicatorUserScoreModal
  },
  data() {
    return {
      header: {
        title: 'Thẩm định năng lực AM',
        list: []
      },

      unit_selected:0,
      staff_selected: null,
      service_list: [],
      staff_list: [],
      unit_list: [],

      /* ===== MOCK DATA 3 CẤP ===== */
      capabilityData: [],
      selectedRows:[],
      statistics:{
        total_point:0,
        pro_point:0,
        start_point:0,
        service_count:0

      },
      appraisalList:[],
      file:null,
      danhsach_excel:[],
      dataCheckImports:[]

    }
  },
  methods: {
    // 2. HÀM MỞ POPUP (Bổ sung để hết lỗi Vue Warn)
    openAppraisalPopup(row) {
      if (row && row.services && row.services.length > 0) {
        // Map ra danh sách ID để duyệt
        this.appraisalList = row.services.map(s => s.indicator_user_score_id);
        // Mở modal
        this.$refs.appraisalDialog.showModal();
      } else {
        this.$toast.warning("Không có dữ liệu để xem");
      }
    },
    onChangeUnit() {
      this.loadDataGrid()
    },
    onChangeService(val) {
      this.loadDataGrid()
      this.loadStatistics()
    },
    successAppraisal(){
      this.loadDataGrid()
      this.loadStatistics()
    },
    successImportData(){
      this.loadDataGrid()
      this.loadStatistics()
    },
    onChangeStaff(val) {
      this.loadDataGrid()
      this.loadStatistics()
    },
    onChangeStatus(){
      this.loadDataGrid()
    },
    onSelectionChange(rows) {
      this.selectedRows = [...rows].map(r => {
        return Object.assign(r, {
          customer_selected:{
            id: r.customer_id,
            selected:true,
            text:r.customer_name
          }
        })
      })
    },
    onUpdate(){
      if(!this.selectedRows||this.selectedRows.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu cần cập nhật')
        return
      }
      this.$refs.updateCapabilityContractDialog.showModal()
    },
    onAppraisal(){
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$toast.error('Vui lòng chọn dữ liệu cần cập nhật')
        return
      }

      const invalidRow = this.selectedRows.find(
        r => r.indicator_user_score_id == null
      )

      if (invalidRow) {
        this.$toast.error(
          `Dịch vụ "${invalidRow.service_name}" chưa được tạo đánh giá`
        )
        return
      }

      // 🔴 CHECK trạng thái: chỉ cho CHỜ THẨM ĐỊNH
      const invalidStatusRow = this.selectedRows.find(
        r => r.evaluation_status !== 1
      )

      if (invalidStatusRow) {
        this.$toast.warning(
          `Dịch vụ "${invalidStatusRow.service_name}" đang ở trạng thái "${invalidStatusRow.evaluation_status_name}", không thể thẩm định`
        )
        return
      }
      this.appraisalList=this.selectedRows.map(x=>x.indicator_user_score_id)

      // ✅ OK → mở dialog
      this.$refs.appraisalDialog.showModal()
    },

    async loadDataGrid() {
      var result = await API.GetAppraisalList(this, {
        departmentId: this.unit_selected || 0,
        userId: this.staff_selected
      })
      if (result){
        var parsedData = (typeof result == 'string') ? JSON.parse(result) : result
        this.capabilityData = Array.isArray(parsedData) ? parsedData : [];
      }
      else
      {
        this.capabilityData = [];
      }
    },
    async loadPage(){
      let result=await API.GetUsersByUserUnit(this)
      if(result){
        this.staff_list=JSON.parse(result)
      }
      var userId=this.$_root.token.getUserId()
      if(userId&&this.staff_list.findIndex(x=>x.user_id==userId)>-1){
        this
        .staff_selected=userId
      }
      var department = await API.GetDepartmentByRoot(this, 1)
      if(department){
        department=JSON.parse(department)
        this.unit_list=[
          { id: 0, text: 'Tất cả các đơn vị' },
          ...department.map(x=>({
            id: x.department_id,
            text: x.department_name
          }))
        ]
        this.unit_selected=0
      }

      this.loadDataGrid()
      this.loadStatistics()
    },
    async loadStatistics(){
      this.statistics={
        total_point:0,
        pro_point:0,
        start_point:0,
        service_count:0
      }
      var data = await API.GetAppraisalList(this, {
        departmentId: this.unit_selected || 0,
        userId:this.staff_selected
      })
      if(data){
        data=JSON.parse(data)
        this.statistics=Object.assign({},data)
  
      }
    },
    successAddUpdate(){
      this.loadDataGrid()
    },
    onChangeFile(event){
      this.file=event.target.files[0]
      this.readFileExcel()
    }
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
      this.GetPermissionButtons()
    }, 500)
  }
}
</script>

<style scoped>
.stats-wrapper {
  margin-bottom: 12px;
}

.filter-wrapper .btn {
  margin-left: 4px;
}

.capability-table th {
  background: #f5f7fa;
  text-align: center;
  font-size: 13px;
}

.capability-table td {
  font-size: 13px;
  vertical-align: middle;
}

.group-row td {
  background: #fafafa;
  font-weight: bold;
}

.tag {
  background: #e6f0ff;
  padding: 4px 10px;
  border-radius: 20px;
}

.money {
  background: #fff4cc;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
}

.btn-purple {
  background: #7b5cff;
  color: #fff;
}
.filter-wrapper .info-row {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.filter-wrapper .info-row .key {
  display: table-caption;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  padding-left: 6px;
  margin-bottom: 4px;
  font-size: 13px;
}

.filter-wrapper .info-row .value {
  display: table-cell;
}

/* Khoảng cách select2 */
.filter-wrapper .select2-container {
  width: 100% !important;
}

/* Button row */
.filter-wrapper .btn {
  margin-left: 6px;
}

/* Màu nút thẩm định */
.btn-purple {
  background: #7b5cff;
  color: #fff;
}
.action-buttons .btn {
  margin-left: 8px;   /* khoảng cách giữa các nút */
}
</style>
