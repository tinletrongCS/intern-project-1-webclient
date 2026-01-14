<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content assignment-kpi" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">

            <div class="col-sm-2 col-12">
              <div class="info-row">
                  <div class="key bold">Loại KPI</div>
                  <div class="value">
                      <select2 
                          v-model='kpi_type_selected'
                          :options="kpi_list"
                          @select="onChangeKPIType"
                      />
                  </div>
              </div>
            </div>
            <div class="col-sm-3 col-12">
              <div class="info-row">
                  <div class="key bold">Phòng ban</div>
                  <div class="value">
                      <select2
                          v-model='kpi_department_selected'
                          :options="kpi_department_list.map(e=>({id:e.department_id, text:e.department_name}))"
                          @select="onChangeKPIDepartment"
                      />
                  </div>
              </div>
            </div>
            <div class="col-sm-3 col-12" v-if="kpi_type_selected==1">
              <div class="info-row">
                  <div class="key bold">Vị trí công việc</div>
                  <div class="value">
                      <select2
                          v-model='kpi_personal_selected'
                          :options="kpi_personal_list.map(e=>({id:e.job_work_position_id, text:e.name}))"
                          @select="onChangeKPIPersonal"
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
            <div class="col-sm-2 col-12 col-button-search">
                <button class="btn btn-second" style="min-width: 100px;" @click="SearchText">
                  <span class="icon one-search"></span>Tìm kiếm
                </button>
            </div>
        </div>
        
      </div>
      <div class="box-form">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                  <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
                    <button class="btn btn-second" style="min-width: 100px;" @click="onClickAddNewAssignmentKPI">
                        <span class="icon fa fa-plus"></span>&nbsp;Giao KPI
                    </button>&nbsp;
                    <button class="btn btn-second" style="min-width: 100px;" @click="onClickUpdateAssignmentKPI">
                      <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                    </button>&nbsp;
                  </div>
              </div>
              <div class="info-row">
                <div class="value bold">
                  Danh sách thông tin KPI theo {{labelTypeSelect.toLowerCase()}}
                </div>
              </div>
            </div>
          </div>
          <KDataGrid
              ref="gridDs"
              :columns="columns"
              :dataSource="dataSources"
              :enable-paging-server="false"
              :allowPaging="true"
              :showFilter="true"
              :showColumnCheckbox="true"
              :enabledSelectFirstRow="false"
              :showSTT="false"
              :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
            />
        </div>
    </div>
    <!-- Modal -->
    <AddUpdateAssignmentKPIModal ref="addUpdateAssignmentKPIModal"
      :kpi_department_id="kpi_department_selected"
      :kpi_personal_id="kpi_personal_selected"
      :kpi_type="kpi_type_selected"
      :isAdd="isAddNew"
      :arrIds="arrIdselected"
      :period="monthNumber"
      @successAddUpdate="successAddUpdate"
    />

  </div>
</template>
<script>
import API from './API'
import AddUpdateAssignmentKPIModal from './AddUpdateAssignmentKPIModal.vue'
import moment from 'moment'
export default {
  name:'AssignmentKPI',
  components:{
    AddUpdateAssignmentKPIModal
  },
  data(){
    return {
      header: {
          title: "Giao chỉ số KPI phòng ban/Cá nhân",
          list: [
          ],
      },
      columns:[],
      dataSources:[],
      isAddNew:true,
      rowSelected:{},
      kpi_type_selected:2,
      kpi_list:[
        {
          id:2,
          text:'Phòng ban'
        },
        {
          id:1,
          text:'Cá nhân'
        },
      ],
      kpi_personal_selected:null,
      kpi_personal_list:[],
      kpi_department_selected:null,
      kpi_department_list:[],
      arrIdselected:[],
      month: moment(new Date()).format('MM/yyyy'),
    }
  },
  computed:{
    labelTypeSelect(){
      return this.kpi_type_selected==1?'Vị trí công việc':'Phòng ban'
    },
    monthNumber(){
      return Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
    }
  },
  methods:{
    SearchText(){
      this.initDataGrid()
    },
    onChangeKPIType(){
      // Bỏ "Tất cả" nếu đang có
      this.kpi_department_list = this.kpi_department_list.filter(x => x.department_id != 0);

      if (this.kpi_type_selected == 2) {
        // Thêm "Tất cả"
        this.kpi_department_list.unshift({
          department_id: 0,
          department_name: "Tất cả"
        });
        this.kpi_department_selected = 0;
      } else {
        // Chọn phần tử đầu tiên khi không có "Tất cả"
        if (this.kpi_department_list.length > 0) {
          this.kpi_department_selected = this.kpi_department_list[0].department_id;
        }
      }

      this.SearchText()
    },
    onChangeKPIPersonal(){
      this.SearchText()
    },
    onChangeKPIDepartment(){
      this.SearchText()
    },
    onClickAddNewAssignmentKPI(){
      this.isAddNew=true
      this.$refs.addUpdateAssignmentKPIModal.showModal()
    },
    onClickUpdateAssignmentKPI(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu điều chỉnh!')
        return
      }
      this.isAddNew=false
      this.arrIdselected=dsSlected.map(x=>x.assignment_kpi_id)
      this.$refs.addUpdateAssignmentKPIModal.showModal()
    },
    successAddUpdate(){
      this.initDataGrid()
    },
    async initDataGrid(){
      let numMonth=Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
      let request={
        kpi_type:this.kpi_type_selected,
        department_id:this.kpi_department_selected!=null?this.kpi_department_selected:0,
        work_position_id:this.kpi_personal_selected!=null?this.kpi_personal_selected:0,
        period:numMonth
      }

      this.dataSources=[]
      this.columns=[]
      let data=await API.GetAssignmentKpiList(this, request)
      if(data){
        data=JSON.parse(data)
        this.$nextTick(()=>{
          this.columns=data.columns
          this.dataSources=data.data
        })
      }
    },
    async loadPage(){
      let data=await API.GetJobWorkPositionAndDepartmentTTKDGP(this)
      if(data){
        var result=JSON.parse(data)
        this.kpi_personal_list=result.positions
        this.kpi_department_list= this.kpi_type_selected==1?result.departments.filter(x=>x.dep_type_id==3):[{
          department_id:0,
          department_name:'Tất cả'
        }].concat(result.departments.filter(x=>x.dep_type_id==3))
        
        if(this.kpi_personal_list.length>0){
          this.kpi_personal_selected=this.kpi_personal_list[0].job_work_position_id
        }
        if(this.kpi_department_list.length>0){
          this.kpi_department_selected=this.kpi_department_list[0].department_id
        }
      }
      this.initDataGrid()
    },
    onChangeMonth(event) {
      if (event && event.value) {
        this.month = moment(event.value).format('MM/yyyy');
      }
      this.initDataGrid()
    },
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
    }, 200)
  }
}
</script>
<style scoped>
/* @media (min-width: 576px) and (max-width: 768px) {
  .assignment-kpi .col-button-search{
    padding-top:29px !important;
  }
} */
</style>
<style>
.assignment-kpi .info-row {
    display: table;
    width: 100%;
    table-layout: fixed; /* Bắt buộc table-cell tuân theo width */
}

.assignment-kpi .info-row .key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: table-caption; /*Cho lên dòng trên*/
    padding-left: 6px;
}

.assignment-kpi .info-row .value {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden; /* quan trọng */
    width: auto;
}

.assignment-kpi .info-row .value .select2-container {
    width: 100% !important;
}

.assignment-kpi .info-row .value .select2-selection {
    width: 100% !important;
    overflow: hidden !important;
}

.assignment-kpi .info-row .value .select2-selection__rendered {
    display: block !important;
    width: 100% !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
 .assignment-kpi .col-button-search{
    padding-top:26px !important;
  }
 @media (min-width: 576px) and (max-width: 768px) {
  .assignment-kpi .col-button-search{
    padding-top:29px !important;
  }
} 
</style>