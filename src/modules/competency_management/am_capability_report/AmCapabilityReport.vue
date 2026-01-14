<template>
  <div class="main-wrapper am-capability-report">
    <breadcrumb :header="header" />

    <div class="page-content" style="top: 46px !important;">
      <div class="report-header">
        <div class="report-header-left">
          <p>
            Theo dõi chi tiết điểm tích lũy và tổng hợp hiệu suất dịch vụ
            của nhân viên theo từng đơn vị kinh doanh.
          </p>
        </div>

        <button class="btn btn-primary btn-sm" @click="exportExcel">
          <span class="icon fa fa-download"></span> Xuất báo cáo
        </button>
      </div>

      <!-- Bộ lọc -->
      <div class="box-form">
        <div class="row">

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w80">Tìm kiếm</div>
              <div class="value">
                <input
                  v-model="search_text"
                  type="text"
                  class="form-control"
                  @keydown.enter="onEnterSearch"
                  placeholder="Tìm kiếm nhân viên..."
                />
              </div>
            </div>
          </div>

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
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold w60">Tháng</div>
              <div class="value">
                <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                  :enabled="true" :depth="'Year'" :showClearButton="false" v-model="month" :allowEdit="false"
                  @change="onChangeFromMonth($event)" />
              </div>
            </div>
          </div>


        </div>
      </div>

      <!-- Table component -->
      <AmReportTable 
        ref="amReportTable"
        :data="mockData" 
        :pageSize="10" 
      />

    </div>

  </div>
</template>

<script>
import moment from 'moment'
import API from './API'
import AmReportTable from './AmReportTable.vue'
export default {
  name: 'AmCapabilityReport',
  components: {
    AmReportTable
  },
  data() {
    return {
      header: {
        title: 'Báo cáo năng lực AM',
        list: []
      },
      search_text: '',
      unit_selected:0,
      unit_list:[{ id: 0, text: 'Tất cả các đơn vị' }],
      month: moment(new Date()).format('MM/YYYY'),

      mockData: []

    }
  },
  methods: {
    onChangeUnit() {
      // gọi API filter
      this.loadDataGrid()
    },
    onEnterSearch(){
      this.loadDataGrid()
    },
    async loadDataGrid(){
      this.mockData=[]

      const period = this.month? Number(moment(this.month, 'MM/YYYY').format('YYYYMM')): Number(moment().format('YYYYMM'))

      var result = await API.GetAmCapabilityReport(this, {
        departmentId: this.unit_selected || 0,
        period: period,
        searchName: (this.search_text || '')
        .trim()
        .replace(/\s+/g, ' ')
      })
      if(result){
        result=JSON.parse(result)
        this.mockData = Array.isArray(result) ? result : []
      }else{
        this.mockData = []
      }
    },
    onChangeFromMonth(event){
      if (event && event.value) {
        this.month = moment(event.value).format('MM/YYYY');
        this.loadDataGrid()
      }
    },
    exportExcel(){
      this.$refs.amReportTable.exportExcel()
    },
    async loadPage(){
      //1 - Từ VNPT HCM
      var result = await API.GetDepartmentByRoot(this, 1)
      if(result){
        result=JSON.parse(result)
        this.unit_list=[
          { id: 0, text: 'Tất cả các đơn vị' },
          ...result.map(x=>({
            id: x.department_id,
            text: x.department_name
          }))
        ]
        this.unit_selected=0
      }
      this.loadDataGrid()
    }
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
    }, 500)
  }
}
</script>

<style scoped>
.am-capability-report .report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.am-capability-report .report-header-left h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.am-capability-report .report-header-left p {
  margin: 6px 0 0;
  font-size: 14px;
  color: #6b7280;
  max-width: 720px;
}
.am-capability-report .info-row {
    display: table;
    width: 100%;
    table-layout: fixed; /* Bắt buộc table-cell tuân theo width */
}

.am-capability-report .info-row .key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: table-caption; /*Cho lên dòng trên*/
    padding-left: 6px;
}

.am-capability-report .info-row .value {
    display: table-cell;
    vertical-align: middle;
    width: auto;
}

</style>
