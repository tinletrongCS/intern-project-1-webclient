<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />

    <div class="page-content" style="top:46px !important; bottom: 46px !important;">
       <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
      <!-- ===== STATISTIC ===== -->
      <div class="stats-wrapper">
        <div class="row">
          <div class="col-md-3 col-sm-6 col-12">
            <StatisticsCard label="Tổng điểm đánh giá" :value="statistics.total_point" icon="👥" color="blue" />
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <StatisticsCard label="Chuyên nghiệp" :value="statistics.pro_point" icon="⭐" color="green" />
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <StatisticsCard label="Khởi đầu" :value="statistics.start_point" icon="🌱" color="yellow" />
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <StatisticsCard label="Dịch vụ" :value="statistics.service_count" icon="📄" color="purple" />
          </div>
        </div>
      </div>

      <!-- ===== FILTER ===== -->
      
      <div class="box-form filter-wrapper">
        <div class="row">

          <!-- Tìm kiếm -->
          <div class="col-md-3 col-12">
            <div class="info-row">
              <div class="key bold">Tìm kiếm</div>
              <div class="value">
                <input
                  type="text"
                  v-model="search_text"
                  class="form-control"
                  placeholder="Tìm kiếm theo yêu cầu"
                  @keyup.enter="SearchText"
                />
              </div>
            </div>
          </div>

          <!-- Dịch vụ -->
          <div class="col-md-3 col-12">
            <div class="info-row">
              <div class="key bold">Dịch vụ</div>
              <div class="value">
                <select2
                  v-model="service_selected"
                  :options="service_list"
                  @select="onChangeService"
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
      <div class="box-form action-wrapper">
        <div class="row align-items-center">

          <!-- Bên trái -->
          <div class="col-md-6 col-12">
            <button class="btn btn-outline-secondary btn-sm" @click="onUpdate">
              <span class="icon fa fa-edit"></span> Cập nhật
            </button>
          </div>

          <!-- Bên phải -->
          <div class="col-md-6 col-12 text-right action-buttons">
            <button class="btn btn-success btn-sm" v-if="hasButtonPermission('ImportExcelAmCapabilityTracking')" @click="importFile">
              <span class="icon fa fa-upload"></span> Import Excel
            </button>
            <button class="btn btn-primary btn-sm" v-if="hasButtonPermission('ExportExcelAmCapabilityTracking')" @click="exportExcelAmCapabilityTracking">
              <span class="icon fa fa-download"></span> Xuất Excel
            </button>
            <button class="btn btn-purple btn-sm" v-if="hasButtonPermission('AppraisalExcelAmCapabilityTracking')" @click="onAppraisal">
              <span class="icon fa fa-check"></span> Thẩm định
            </button>
          </div>

        </div>
      </div>

      <!-- ===== TABLE ===== -->
      <CapabilityTable
        ref="capabilityTable"
        :dataSource="capabilityData"
        @selection-change="onSelectionChange"
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
import CapabilityTable from './CapabilityTable.vue'
import API from './API'
import UpdateCapabilityContractDialog from './UpdateCapabilityContractDialog.vue'
import AppraisalEvaluationDialog from './AppraisalEvaluationDialog.vue'
import * as XLSX from 'xlsx'
import CheckImportIndicatorUserScoreModal from './CheckImportIndicatorUserScoreModal.vue'
export default {
  name: 'AmCapability',
  components: {
    StatisticsCard,
    CapabilityTable,
    UpdateCapabilityContractDialog,
    AppraisalEvaluationDialog,
    CheckImportIndicatorUserScoreModal
  },
  data() {
    return {
      header: {
        title: 'Theo dõi năng lực AM',
        list: []
      },

      search_text: '',
      service_selected: 0,
      staff_selected: null,
      status_selected:-1,
      status_list:[
        {
          id:-1,
          text:'Tất cả'
        },
        {
          id:0,
          text:'Chưa tạo'
        },
        {
          id:1,
          text:'Chờ thẩm định'
        },
        {
          id:2,
          text:'Đã thẩm định'
        },
        {
          id:3,
          text:'Từ chối'
        },
      ],

      service_list: [],
      staff_list: [],

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
    SearchText() {
      // call API reload table
      this.loadDataGrid()
      this.loadStatistics()
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
    importFile(){
      this.$refs.fileInput.value=null
      document.getElementById("file").click()
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

      // 🔴 CHECK indicator_user_score_id
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
    async loadDataGrid(){
      this.selectedRows=[]
      this.capabilityData=[]
      var data = await API.GetIndicatorTreeByUser(this, {
        serviceId: this.service_selected,
        userId:this.staff_selected,
        statusId:this.status_selected,
        searchText:this.search_text?this.search_text.trim():''
      })
      if(data){
        data=JSON.parse(data)
        this.capabilityData =  data.concat([])
      }
    },
    async loadPage(){
      var data = await API.GetServiceOneBss(this)
      if(data){
        data=JSON.parse(data)
        this.service_list = [
        { id: 0, text: 'Tất cả' },
          ...data.map(x => ({
            id: x.device_profile_id,
            text: x.device_profile_name
          }))
        ]
      }
      let result=await API.GetUsersByUserUnit(this)
      if(result){
        this.staff_list=this.staff_list.concat(JSON.parse(result))
      }
      var userId=this.$_root.token.getUserId()
      if(userId&&this.staff_list.findIndex(x=>x.user_id==userId)>-1){
        this.staff_selected=userId
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
      var data = await API.GetIndicatorUserStatistics(this, {
        serviceId: this.service_selected,
        userId:this.staff_selected,
        searchText:this.search_text?this.search_text.trim():''
      })
      if(data){
        data=JSON.parse(data)
        this.statistics=Object.assign({},data)
        // this.capabilityData =  data.concat([])
      }
    },
    exportExcelAmCapabilityTracking(){
      this.$refs.capabilityTable.exportExcel()
    },
    successAddUpdate(){
      this.loadDataGrid()
    },
    onChangeFile(event){
      this.file=event.target.files[0]
      this.readFileExcel()
    },
    readFileExcel() {
      this.danhsach_excel = []

      try {
        this.loading(true)

        if (!this.checkfile()) return

        const reader = new FileReader()
        reader.onload = (e) => {
          const bstr = e.target.result
          const wb = XLSX.read(bstr, { type: 'binary' })

          // ===== LẤY SHEET ĐẦU =====
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]

          // ===== READ DATA =====
          const data = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            raw: true,      // LẤY NUMBER THẬT
            defval: null
          })

          if (!data || data.length <= 1) {
            this.$toast.error('File Excel không có dữ liệu')
            return
          }

          const columns = data[0]
          if (!this.kiemTraDuLieu(columns)) return

          let isError = false

          // ===== LOOP DATA =====
          for (let i = 1; i < data.length; i++) {
            const row = data[i]
            if (!row || row.every(v => v == null || v == '')) continue

            // ===== DỊCH VỤ =====
            const service_name = row[1] != null ? row[1].toString().trim() : null
            if (!service_name) {
              this.$toast.error(`Dòng ${i + 1}: Dịch vụ không được để trống`)
              isError = true
              break
            }

            // ===== GIÁ TRỊ HỢP ĐỒNG =====
            let contract_value = row[2]
            if (contract_value !== null && contract_value != '') {
              if (typeof contract_value !== 'number' || isNaN(contract_value)) {
                this.$toast.error(`Dòng ${i + 1}: Giá trị hợp đồng phải là số hoặc để trống`)
                isError = true
                break
              }
            } else {
              contract_value = null
            }

            // ===== HỢP ĐỒNG NGHIỆM THU =====
            let acceptance_raw = row[3]
            let acceptance_str = acceptance_raw != null
              ? acceptance_raw.toString().trim()
              : ''

            if (acceptance_str !== '' && acceptance_str.toUpperCase() != 'X') {
              this.$toast.error(
                `Dòng ${i + 1}: Cột "Hợp đồng đã nghiệm thu" chỉ được nhập X hoặc để trống`
              )
              isError = true
              break
            }

            const has_acceptance = acceptance_str.toUpperCase() == 'X'

            // ===== PUSH DATA =====
            this.danhsach_excel.push({
              service_name,
              contract_value,
              has_acceptance
            })
          }

          if (!isError && this.danhsach_excel.length > 0) {
            console.log('IMPORT DATA:', this.danhsach_excel)
            this.read_data_file(this.danhsach_excel)
          }
        }

        reader.readAsBinaryString(this.file)

      } catch (error) {
        console.error(error)
        this.$toast.error('Có lỗi xảy ra khi đọc file Excel')
      } finally {
        this.loading(false)
      }
    },
    async read_data_file(data = null) {
      if (!Array.isArray(data) || data.length === 0) {
        this.$toast.error('Không có dữ liệu để kiểm tra')
        return
      }

      const request = {
        user_id: 0,   // ⚠️ đảm bảo biến này tồn tại
        items: data
      }
      var result = await API.CheckImportIndicatorUserScore(this, request)
      if(result){
        result=JSON.parse(result)
        this.dataCheckImports = result
        this.$refs.checkImportIndicatorUserScoreModal.showModal()
      }else {
        this.$toast.error('Không có dữ liệu trả về')
      }
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
