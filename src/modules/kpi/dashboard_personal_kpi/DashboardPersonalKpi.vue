<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content dashboard-personal-kpi" style="top: 46px !important; bottom: 46px !important;">
      <div class="box-form">
        <div class="row">
            <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold">Phòng ban</div>
              <div class="value">
                <select2 
                  v-model="department_selected"
                  :options="unit_list"
                  @select="onSearch"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold">Người nhận</div>
              <div class="value">
                <select2 
                  v-model.number="user_selected"
                  :options="user_list"
                  @select="onSearch"
                />
              </div>
            </div>
          </div>
            <div class="col-sm-2 col-12">
              <div class="info-row">
                  <div class="key bold">Tháng</div>
                  <div class="value">
                      <ejs-datepicker 
                          class="form-control" 
                          placeholder="Chọn tháng"
                          :format="'MM/yyyy'" 
                          :start="'Year'" 
                          :enabled="true" 
                          :depth="'Year'" 
                          :showClearButton="false"
                          v-model="month" 
                          :allowEdit="false" 
                          @change="onChangeMonth($event)" />
                  </div>
              </div>
            </div>

        </div>
        
      </div>
      <div class="box-form">
          <KpiDashboardStats 
            ref="kpiDashboardStats"/>
      </div>
      <div class="box-form">
        <div class="info-row">
          <div class="value bold">
            Danh sách công việc
          </div>
        </div>
        <KDataGrid
          ref="gridDs"
          :columns="columns"
          :dataSource="dataSources"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="true"
          :showColumnCheckbox="false"
          :enabledSelectFirstRow="false"
          :showSTT="true"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
        />
      </div>

    </div>

  </div>
</template>
<script>
import API from './API'
import moment from 'moment'
import KpiDashboardStats from './KpiDashboardStats.vue'
export default {
  name:'DashboardPersonalKpi',
  components:{
    KpiDashboardStats
  },
  data(){
    return {
      header: {
          title: "DASHBOARD KPI CÁ NHÂN",
          list: [
          ],
      },
      user_selected:null,
      user_list:[],
      month: moment(new Date()).format('MM/yyyy'),
      unit_list:[],
      department_selected:null,
      dashboard:{
        total_plan_time:0,
        total_actual_time:0,
        total_project_on_schedule:0,
        total_project:0,
        total_task_late:0,
        total_incident_on_time:0,
        total_incident:0,
        total_bug_on_time:0,
        total_bug:0,
        total_task:0,
        total_task_on_time:0
      },
      columns:[
          {
              fieldName:'code',
              headerText:'Công việc',
              allowFiltering:true,
          },
          {
              fieldName:'name',
              headerText:'Mức độ',
              allowFiltering:true
          },
          {
              fieldName:'unit',
              headerText:'Hạn hoàn thành',
              allowFiltering:true
          },
          {
              fieldName:'description',
              headerText:'Trạng thái',
              allowFiltering:true
          },
          {
              fieldName:'measurement_method',
              headerText:'Tình trạng',
              allowFiltering:true
          },
          {
              fieldName:'formula',
              headerText:'Đánh giá chất lượng',
              allowFiltering:true
          }
      ],
      dataSources:[],
    }
  },
  computed:{
    monthNumber(){
      return Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
    }
  },
  methods:{
    async onSearch(){
      this.loadDashboard()
    },
    async loadDashboard(){
      if(!this.user_selected){
        return
      }
      // let numMonth=Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
      // let request={
      //   kpi_type:this.kpi_type_selected,
      //   department_id:this.kpi_department_selected!=null?this.kpi_department_selected:0,
      //   work_position_id:this.kpi_personal_selected!=null?this.kpi_personal_selected:0,
      //   period:numMonth
      // }

      // this.dataSources=[]
      // this.columns=[]
      // let data=await API.GetAssignmentKpiResultList(this, request)
      // if(data){
      //   data=JSON.parse(data)
      //   this.$nextTick(()=>{
      //     this.columns=data.columns
      //     this.dataSources=data.data
      //   })
      // }
    },
    async loadPage(){
      this.unit_list=await API.GetMyDepartmentTree(this)
      if(this.unit_list.length>0){
        this.department_selected=this.unit_list[0].id
        await this.loadUsersForSelectedUnit(this.department_selected)
        var userId=await this.$_root.token.getUserId()
        if(userId&&this.user_list.findIndex(x=>x.id==userId)>-1){
          this.user_selected=userId
        }
      }else{
        return
      }
      this.loadDashboard()
    },
    async loadUsersForSelectedUnit(departmentId) {
      this.user_selected=[]
      this.user_list=[]
      this.user_list = await API.GetUsersByDepartment(this, departmentId)
      if(this.user_list.length>0){
        this.user_selected=this.user_list[0].id
      }
    },
    onChangeMonth(event) {
      if (event && event.value) {
        this.month = moment(event.value).format('MM/yyyy');
      }
      this.loadDashboard()
    },
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
    }, 200)
  }
}
</script>
<style>
.dashboard-personal-kpi .info-row {
    display: table;
    width: 100%;
    table-layout: fixed; /* Bắt buộc table-cell tuân theo width */
}

.dashboard-personal-kpi .info-row .key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: table-caption; /*Cho lên dòng trên*/
}

.dashboard-personal-kpi .info-row .value {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden; /* quan trọng */
    width: auto;
    padding-left: 0px !important;
}

.dashboard-personal-kpi .info-row .value .select2-container {
    width: 100% !important;
}

.dashboard-personal-kpi .info-row .value .select2-selection {
    width: 100% !important;
    overflow: hidden !important;
}

.dashboard-personal-kpi .info-row .value .select2-selection__rendered {
    display: block !important;
    width: 100% !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
 .dashboard-personal-kpi .col-button-search{
    padding-top:26px !important;
  }
 @media (min-width: 576px) and (max-width: 768px) {
  .dashboard-personal-kpi .col-button-search{
    padding-top:29px !important;
  }
} 
</style>