<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />

    <div class="page-content" style="top:46px !important; bottom: 46px !important;">
      <div class="box-form action-wrapper">
        <div class="row align-items-end">

          <!-- Bên trái -->
          <div class="col-md-6 col-12">
            <div class="row filter-wrapper">

              <!-- Tìm kiếm -->
              <div class="col-md-5 col-12">
                <div class="info-row">
                  <div class="key bold">Tìm kiếm</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="search_text"
                      class="form-control"
                      placeholder="Tìm kiếm theo mã DA, tên KH, số hợp đồng"
                      @keyup.enter="SearchText"
                    />
                  </div>
                </div>
              </div>

              <!-- Tháng -->
              <div class="col-sm-3 col-12">
                <div class="info-row">
                  <div class="key bold">Kỳ dữ liệu</div>
                  <div class="value">
                    <ejs-datepicker
                      class="form-control"
                      placeholder="Chọn tháng"
                      :format="'MM/yyyy'"
                      :start="'Year'"
                      :depth="'Year'"
                      :showClearButton="false"
                      v-model="month"
                      :allowEdit="false"
                      @change="onChangeFromMonth"
                    />
                  </div>
                </div>
              </div>

              <div class="col-md-3 col-12">
                <div class="info-row">
                  <div class="key bold">Trạng thái</div>
                  <div class="value">
                    <select2
                      v-model="status_selected"
                      :options="status_list"
                      @select="onChangeStatus"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Bên phải -->
          <div class="col-md-6 col-12 text-right action-buttons" style="margin-bottom: 4px !important;">
            <button class="btn btn-success btn-sm" v-if="hasButtonPermission('AddContract123')" @click="onAdd">
              <span class="icon fa fa-plus"></span> Thêm mới
            </button>
            <button class="btn btn-outline-secondary btn-sm" v-if="hasButtonPermission('UpdateContract123')" @click="onUpdate">
              <span class="icon fa fa-edit"></span> Cập nhật
            </button>
            <button class="btn btn-danger btn-sm" v-if="hasButtonPermission('DeleteContract123')"  @click="onDelete">
              <span class="icon fa fa-trash"></span> Xoá
            </button>
            <button class="btn btn-primary btn-sm" v-if="hasButtonPermission('ExportExcelContract123')" @click="exportExcel">
              <span class="icon fa fa-download"></span> Xuất Excel
            </button>
          </div>

        </div>
      </div>

      <!-- ===== TABLE ===== -->
      <Contract447Table
        ref="contract447Table"
        :data="contractList"
        :pageSize="10"
        @selection-change="onSelectionChange"
        @onClickProject="onClickProject"
      />

    </div>

    <!-- Modal -->
    <!-- <AddUpdateProjectDialog
      ref="addUpdateProjectDialog"
      :isAdd="isAddNew"
      :data="rowSelected"
      @successAddUpdate="successAddUpdate"
    /> -->
    <ProjectCreateDialog447
      ref="projectCreateDialog447"
      :isAdd="isAddNew"
      :data="rowSelected"
      :isViewDetail="isViewDetail"
      @successAddUpdate="successAddUpdate"
    /> 

  </div>
</template>

<script>
import API from './API'
import * as XLSX from 'xlsx'
import moment from 'moment'
import Contract123Table from './Contract123Table.vue'
import AddUpdateProjectDialog from './ProjectCreateDialog.vue'
import ProjectCreateDialog447 from './ProjectCreateDialog447.vue'
import Contract447Table from './Contract447Table.vue'
export default {
  name: 'Contract123',
  components: {
    Contract123Table,
    AddUpdateProjectDialog,
    ProjectCreateDialog447,
    Contract447Table
  },
  data() {
    return {
      header: {
        title: 'Hợp đồng 123',
        list: []
      },

      search_text: '',
      status_selected:0,
      status_list: [
        {
          id: 0,
          text: 'Tất cả'
        },
        {
          id: 1,
          text: 'Chờ xác nhận'
        },
        {
          id: 2,
          text: 'Đã xác nhận dữ liệu'
        },
        {
          id: 3,
          text: 'Đã hoàn trả'
        },
        {
          id: 4,
          text: 'Đã kiểm tra dữ liệu'
        },
        {
          id: 5,
          text: 'Chưa xác nhận hệ số'
        },
        {
          id: 6,
          text: 'Đã xác nhận hệ số'
        }
      ],
     // Chờ xác nhận, Đã xác nhận dữ liệu, Đã hoàn trả, Đã kiểm tra dữ liệu, Chưa xác nhận hệ số, Đã xác nhận hệ số
      selectedRows:[],
      statistics:{
        total_point:0,
        pro_point:0,
        start_point:0,
        service_count:0

      },
      month: moment().format('MM/YYYY'),
      isAddNew:true,

      contractList: [],
      rowSelected:{},

      isViewDetail:false

    }
  },
  methods: {
    SearchText() {
      // call API reload table
      this.loadDataGrid()
      
    },
    onChangeService(val) {
      this.loadDataGrid()
      
    },
    successAppraisal(){
      this.loadDataGrid()
      
    },
    successImportData(){
      this.loadDataGrid()
    },
    onChangeFromMonth(){
      this.loadDataGrid()
    },
    onChangeStatus(){
      this.loadDataGrid()
    },
    async onDelete(){
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$toast.error('Vui lòng chọn dữ liệu cần xoá')
        return
      }


      const ids = this.selectedRows.map(x => x.project_123_id)

      const confirm = await this.$confirm(
        'Thông báo',
        `Bạn chắc chắn muốn xoá ${ids.length} bản ghi?`
      )
      if (confirm == 0) return

      const res = await API.DeleteContractProject123(this, {
        arrIds: JSON.stringify(ids)
      })

      if (res == '1') {
        this.$toast.success('Xoá thành công')
        this.loadDataGrid()
      } else {
        this.$toast.error(res)
      }
    },
    exportExcel(){
      if (!this.contractList || this.contractList.length === 0) {
        this.$toast.error('Không có dữ liệu để xuất Excel')
        return
      }

      this.$refs.contract447Table.exportExcel()
    },
    onAdd() {
      this.isAddNew = true
      this.rowSelected = {}
      this.isViewDetail=false
      this.$refs.projectCreateDialog447.showModal()
    },
    onClickProject(row){
      this.isAddNew = false
      this.rowSelected = row
      this.isViewDetail=true
      this.$refs.projectCreateDialog447.showModal()
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
    successAddUpdate(){
      this.loadDataGrid()
    },
    onSelectionChange(rows) {
      this.selectedRows = rows
      // ví dụ: rows.map(x => x.id)
    },
    onUpdate(){
      if(!this.selectedRows||this.selectedRows.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu cần cập nhật')
        return
      }
      if(!this.selectedRows||this.selectedRows.length>1){
        this.$toast.error('Vui lòng chọn 1 row dữ liệu để cập nhật')
        return
      }
      this.isAddNew = false
      this.isViewDetail=false
      this.rowSelected=this.selectedRows[0]
      this.$refs.projectCreateDialog447.showModal()
    },
    
    async loadDataGrid() {
      try {
        // reset selection
        this.selectedRows = []

        // ===== build period YYYYMM (INT) =====
        let period = null
        if (this.month) {
          period = Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
        }

        const data = await API.GetProject447List(this, {
          searchText: this.search_text ? this.search_text.trim() : '',
          period: period,
          status: this.status_selected ?? 0
        })

        if (data) {
          const list = JSON.parse(data)

          // gán trực tiếp cho Contract447Table
          this.contractList = list.map(x => ({
            ...x,

            // checkbox dùng cho table
            checked: false
          }))
        } else {
          this.contractList = []
        }
      } catch (err) {
        console.error(err)
        this.$toast.error('Không tải được danh sách dự án')
        this.contractList = []
      }
    },
    async loadPage(){
      this.loadDataGrid()
    },
    successAddUpdate(){
      this.loadDataGrid()
    },
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
