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
    // 2. HÀM MỞ POPUP (Bổ sung để hết lỗi Vue Warn)
  //   async openAppraisalPopup(row) {
  //   // 1. Lưu User ID vào biến riêng cho Popup
  //   this.popup_user_id = row.user_id;

  //   // 2. Gọi API lấy chi tiết các dịch vụ của User này
  //   // (Tận dụng hàm GetIndicatorTreeByUser có sẵn để lấy danh sách)
  //   let res = await API.GetIndicatorTreeByUser(this, {
  //     userId: row.user_id,
  //     statusId: 1, // 1 = Chỉ lấy trạng thái Chờ thẩm định
  //     serviceId: 0,
  //     searchText: ''
  //   });

  //   if (res) {
  //     let data = (typeof res === 'string') ? JSON.parse(res) : res;
  //     let listIds = [];

  //     // 3. Xử lý dữ liệu trả về để lấy ra mảng các ID (indicator_user_score_id)
  //     // Vì API trả về dạng Cây hoặc List, ta duyệt để gom hết ID lại
  //     if (Array.isArray(data)) {
  //       data.forEach(group => {
  //         // Trường hợp 1: Dữ liệu phân cấp (có children)
  //         if (group.children && group.children.length > 0) {
  //           group.children.forEach(child => {
  //             if(child.indicator_user_score_id) listIds.push(child.indicator_user_score_id);
  //           });
  //         }
  //         // Trường hợp 2: Dữ liệu phẳng (không có children)
  //         else if (group.indicator_user_score_id) {
  //           listIds.push(group.indicator_user_score_id);
  //         }
  //       });
  //     }

  //     // 4. Kiểm tra nếu không có gì để thẩm định
  //     if (listIds.length === 0) {
  //       this.$toast.warning("Nhân sự này không còn dịch vụ nào chờ thẩm định.");
  //       return;
  //     }

  //     // 5. Gán danh sách ID vào biến data truyền xuống Dialog
  //     this.appraisalList = listIds;

  //     // 6. Mở Dialog (Dialog sẽ tự load chi tiết dựa trên list ID này)
  //     if (this.$refs.appraisalDialog) {
  //       // Gọi showModal không cần tham số vì đã truyền props ở trên
  //       this.$refs.appraisalDialog.showModal(); 
  //     }
  //   }
  // },
    async openAppraisalPopup(row) {
      // 1. Lưu User ID
      this.popup_user_id = row.user_id;

      // 2. Gọi API
      let res = await API.GetIndicatorTreeByUser(this, {
        userId: row.user_id,
        statusId: 1, 
        serviceId: 0,
        searchText: ''
      });

      if (res) {
        let data = (typeof res === 'string') ? JSON.parse(res) : res;
        let listIds = [];

        // --- HÀM ĐỆ QUY LẤY ID (SỬA ĐOẠN NÀY) ---
        // Hàm này sẽ tự động đào sâu vào tất cả các cấp con/cháu để tìm ID
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

        // Bắt đầu tìm từ dữ liệu gốc
        findIdsRecursive(data);
        // ----------------------------------------

        console.log("Danh sách ID cuối cùng:", listIds); 

        // 4. Kiểm tra
        if (listIds.length === 0) {
          this.$toast.warning("Nhân sự này không còn dịch vụ nào chờ thẩm định.");
          return;
        }

        // 5. Mở Dialog
        this.appraisalList = listIds;
        if (this.$refs.appraisalDialog) {
          this.$refs.appraisalDialog.showModal(); 
        }
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
    onAppraisal() {
      // 1. Kiểm tra xem đã chọn dòng (nhân viên) nào chưa
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$toast.warning('Vui lòng chọn nhân sự để thẩm định');
        return;
      }

      // 2. Chỉ cho phép chọn 1 nhân viên (vì Popup thiết kế để hiển thị cây chi tiết của 1 người)
      if (this.selectedRows.length > 1) {
        this.$toast.warning('Vui lòng chỉ chọn 1 nhân sự mỗi lần để xem chi tiết');
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
