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
      :user_id="popup_user_id"
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
import CapabilityAppraisalTable from './CapabilityAppraisalTable.vue'
import API from './API'
import AppraisalEvaluationDialog from './AppraisalEvaluationDialog.vue'
export default {
  name: 'AmCapability',
  components: {
    CapabilityAppraisalTable,
    AppraisalEvaluationDialog,
  },
  data() {
    return {
      header: {
        title: 'Thẩm định năng lực AM',
        list: []
      },
      popup_user_id: 0,

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
    async openAppraisalPopup(row) {
      this.popup_user_id = row.user_id;

      let res = await API.GetIndicatorTreeByUser(this, {
        userId: row.user_id,
        statusId: 1, 
        serviceId: 0,
        searchText: ''
      });

      if (res) {
        let data = (typeof res === 'string') ? JSON.parse(res) : res;
        let listIds = [];

        // --- HÀM ĐỆ QUY LẤY ID ---
        const findIdsRecursive = (nodes) => {
           if (!nodes || !Array.isArray(nodes)) return;

           nodes.forEach(node => {
              // 1. Nếu node này là dịch vụ (có ID) -> Lấy luôn
              if (node.indicator_user_score_id) {
                 listIds.push(node.indicator_user_score_id);
              }

              // 2. Nếu node này là Nhóm (có con) -> Đào tiếp vào trong
              if (node.children && node.children.length > 0) {
                 findIdsRecursive(node.children);
              }
           });
        }


        findIdsRecursive(data);

        console.log("Danh sách ID cuối cùng:", listIds); 

        if (listIds.length === 0) {
          this.$toast.warning("Nhân sự này không còn dịch vụ nào chờ thẩm định.");
          return;
        }

        this.appraisalList = listIds;
        if (this.$refs.appraisalDialog) {
          this.$refs.appraisalDialog.showModal(); 
        }
      }
    },

    // Click chọn đổi đơn vị 
    async onChangeUnit() {
      // Khi đổi đơn vị thì reset lại danh sách nhân sự 
      // lấy hết nhân sự của đơn vị vừa mới bấm chọn 
      let result = await API.GetUsersByUserUnit(this, {
        departmentId: this.unit_selected
      });

      let users = [];
      if (result) {
        users = JSON.parse(result)
      }

      this.staff_list = [
        {user_id: 0, display_name: 'Tất cả nhân sự'},
        ...users
      ]

      // Reset lại về 0 
      this.staff_selected = 0;
      this.loadDataGrid()
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
    onAppraisal() {
      // 1. Kiểm tra xem đã chọn dòng (nhân viên) nào chưa
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$toast.error('Vui lòng chọn nhân sự để thẩm định');
        return;
      }

      // 2. Chỉ cho phép chọn 1 nhân viên (vì Popup thiết kế để hiển thị cây chi tiết của 1 người)
      if (this.selectedRows.length > 1) {
        this.$toast.info('Vui lòng chỉ chọn 1 nhân sự mỗi lần để xem chi tiết');
        return;
      }

      // 3. Lấy dòng nhân viên được chọn
      const selectedUser = this.selectedRows[0];

      // 4. Gọi lại hàm openAppraisalPopup để tái sử dụng logic tải dữ liệu và mở bảng
      this.openAppraisalPopup(selectedUser);
    },

    async loadDataGrid() {
      var result = await API.GetAppraisalList(this, {
        departmentId: this.unit_selected || 0,
        userId: this.staff_selected || 0
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
      // 1. Load danh sách đơn vị 
      var department = await API.GetDepartmentByRoot(this, 1)
      if(department){
        department=JSON.parse(department)
        this.unit_list=[
          { id: 0, text: 'Tất cả các đơn vị' },
          ...department.map(x=>({
            id: x.department_id,
            text: x.department_name
          }))
        ];
        this.unit_selected = 0;
      }
      
      // 2. Load danh sách nhân sự 
      let result = await API.GetUsersByUserUnit(this, {departmentId: 0});

      let users = [];
      if (result) {
        users = JSON.parse(result);
      }

      this.staff_list = [
        {user_id: 0, display_name: 'Tất cả nhân sự'},
        ...users 
      ]
      this.staff_selected = 0;
      
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
