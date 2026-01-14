<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content management-kpi" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="value">
                        <input type="text" @keyup.enter="SearchText" v-model="input_search_name"  class="form-control"
                        placeholder="Tìm kiếm theo mã, tên danh mục" @input="onInput">
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
              <div class="info-row">
                  <div class="key w80 bold">Loại KPI</div>
                  <div class="value">
                      <select2 
                          v-model='kpi_type_selected'
                          :options="kpi_list"
                          @select="onChangeKPIType"
                      />
                  </div>
              </div>
            </div>
            <div class="col-sm-2 col-12">
              <div class="info-row">
                  <div class="key w120 bold">{{labelTypeSelect}}</div>
                  <div class="value">
                      <select2
                          v-if="kpi_type_selected==1"
                          v-model='kpi_personal_selected'
                          :options="kpi_personal_list.map(e=>({id:e.job_work_position_id, text:e.name}))"
                          @select="onChangeKPIPersonal"
                      />
                      <select2
                          v-else
                          v-model='kpi_department_selected'
                          :options="kpi_department_list.map(e=>({id:e.department_id, text:e.department_name}))"
                          @select="onChangeKPIDepartment"
                      />
                  </div>
              </div>
            </div>

            <div class="col-sm-2 col-12">
              <div class="info-row">
                  <div class="key w80 bold">Từ tháng</div>
                  <div class="value">
                      <ejs-datepicker 
                          class="form-control" 
                          placeholder="Chọn tháng"
                          :format="'MM/yyyy'" 
                          :start="'Year'" 
                          :enabled="true" 
                          :depth="'Year'" 
                          :showClearButton="false"
                          v-model="from_month" 
                          :allowEdit="false" 
                          @change="onChangeFromMonth($event)" />
                  </div>
              </div>
            </div>
            <div class="col-sm-2 col-12">
              <div class="info-row">
                  <div class="key w80 bold">Đến tháng</div>
                  <div class="value">
                      <ejs-datepicker 
                          class="form-control" 
                          placeholder="Chọn tháng"
                          :format="'MM/yyyy'" 
                          :start="'Year'" 
                          :enabled="true" 
                          :depth="'Year'" 
                          :showClearButton="false"
                          v-model="to_month" 
                          :allowEdit="false" 
                          @change="onChangeToMonth($event)" />
                  </div>
              </div>
            </div>


            <div class="col-sm-2 col-12">
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
                  <button class="btn btn-second" style="min-width: 100px;" @click="onClickAddNewManagementKPI">
                      <span class="icon fa fa-plus"></span>&nbsp;Lựa chọn
                  </button>&nbsp;
                  <button class="btn btn-second" style="min-width: 100px;" @click="onClickUpdateNewManagementKPI">
                      <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                  </button>&nbsp;
                  <button class="btn btn-second" style="min-width: 100px;" @click="onClickDeleteManagementKPI">
                      <span class="icon one-trash"></span>&nbsp;Xóa
                  </button>&nbsp;
                  </div>
              </div>
              <div class="info-row">
                <div class="value bold">
                  Danh sách thông tin KPI theo {{labelTypeSelect.toLowerCase()}}
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-6">
                Tổng tỷ lệ: {{totalRatio}}
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
    <AddUpdateManagementKPIModal ref="addUpdateManagementKPIModal"
      :kpi_personal_list="kpi_personal_list"
      :kpi_department_list="kpi_department_list"
      :kpi_department_id="kpi_department_selected"
      :kpi_personal_id="kpi_personal_selected"
      :kpi_type="kpi_type_selected"
      :isAdd="isAddNew"
      :arrIds="arrIdselected"
      :from_month_kpi="from_month"
      :to_month_kpi="to_month"
      @successAddUpdate="successAddUpdate"
    />

  </div>
</template>
<script>
import API from './API'
import AddUpdateManagementKPIModal from './AddUpdateManagementKPIModal.vue'
import moment from 'moment'
export default {
  name:'ManagementKPI',
  components:{
    AddUpdateManagementKPIModal
  },
  data(){
    return {
      header: {
          title: "Quản lý chỉ số KPI cá nhân/Phòng ban",
          list: [
          ],
      },
      columns:[
            {
                fieldName:'code',
                headerText:'Mã chỉ số',
                allowFiltering:true,
                width:'100'
            },
            {
                fieldName:'name',
                headerText:'Tên chỉ số',
                allowFiltering:true
            },
            {
                fieldName:'description',
                headerText:'Mô tả',
                allowFiltering:true
            },
            {
                fieldName:'measurement_method',
                headerText:'Công thức/Cách đo lường',
                allowFiltering:true,
                disableHtmlEncode:false
            },
            {
                fieldName:'formula',
                headerText:'Công thức đánh giá',
                allowFiltering:true,
                disableHtmlEncode:false
            },
            {
                fieldName:'period_from_display',
                headerText:'Từ tháng',
                allowFiltering:true
            },
            {
                fieldName:'period_to_display',
                headerText:'Đến tháng',
                allowFiltering:true
            },
            {
                fieldName:'cycle_name',
                headerText:'Chu kỳ',
                allowFiltering:true
            },
            {
                fieldName:'ratio',
                headerText:'Tỷ lệ',
                allowFiltering:true
            }
        ],
        dataSources:[],
        input_search_name:'',
        isAddNew:true,
        rowSelected:{},
        kpi_type_selected:1,
        kpi_list:[
          {
            id:1,
            text:'Cá nhân'
          },
          {
            id:2,
            text:'Phòng ban'
          },
        ],
        kpi_personal_selected:null,
        kpi_personal_list:[],
        kpi_department_selected:null,
        kpi_department_list:[],
        arrIdselected:[],
        typingTimer: null,
        from_month: moment().startOf('year').format('MM/yyyy'),
        to_month: moment().endOf('year').format('MM/yyyy')
    }
  },
  computed:{
    labelTypeSelect(){
      return this.kpi_type_selected==1?'Vị trí công việc':'Phòng ban'
    },
    totalRatio(){
      if(this.dataSources.length==0) return 0
      const total = this.dataSources.reduce((sum, item) => {
        return sum + (item.ratio || 0);
      }, 0)
      return total +'%'
    }
  },
  methods:{
    SearchText(){
      this.initDataGrid()
    },
    onChangeKPIType(){
      this.SearchText()
    },
    onChangeKPIPersonal(){
      this.SearchText()
    },
    onChangeKPIDepartment(){
      this.SearchText()
    },
    onChangeFromMonth(event) {
      if (event && event.value) {
        const newFrom = moment(event.value).format('MM/YYYY')
        const fromNum = Number(moment(newFrom, 'MM/YYYY').format('YYYYMM'))
        const toNum = Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))

        this.from_month = newFrom

        // Nếu from > to → tự động set to = from
        if (fromNum > toNum) {
          this.to_month = newFrom
        }
      }
      this.initDataGrid()
    },
    onChangeToMonth(event) {
      if (event && event.value) {
        const newTo = moment(event.value).format('MM/YYYY')
        const toNum = Number(moment(newTo, 'MM/YYYY').format('YYYYMM'))
        const fromNum = Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))

        this.to_month = newTo

        // Nếu to < from → tự động set from = to
        if (toNum < fromNum) {
          this.from_month = newTo
        }
      }
      this.initDataGrid()
    },
    onClickAddNewManagementKPI(){
      this.isAddNew=true
      this.$refs.addUpdateManagementKPIModal.showModal()
    },
    onClickUpdateNewManagementKPI(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu điều chỉnh!')
        return
      }
      this.isAddNew=false
      this.arrIdselected=dsSlected.map(x=>x.management_kpi_id)
      this.$refs.addUpdateManagementKPIModal.showModal()
    },
    async onClickDeleteManagementKPI(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu cần xóa!')
        return
      }
      let dsId=dsSlected.map(x=>x.management_kpi_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu đang chọn?`)
      if(result==0) return
      
      let data=await API.DeleteManagementKpi(this, {
        arrIds: JSON.stringify(dsId)
       }
      )
      if(data=='1'){
          this.$toast.success('Xóa thành công!')
          this.initDataGrid()
      }else{
          this.$toast.error(data)
      }
    },
    successAddUpdate(value){
      if(this.kpi_type_selected==1){
        this.kpi_personal_selected=value.value
      }else{
        this.kpi_department_selected=value.value
      }
      this.from_month=value.from_month
      this.to_month=value.to_month
      this.initDataGrid()
    },
    async initDataGrid(){
      let period_from=Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
      let period_to=Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))
      let request={
        kpi_type:this.kpi_type_selected,
        department_id:this.kpi_department_selected!=null?this.kpi_department_selected:0,
        work_position_id:this.kpi_personal_selected!=null?this.kpi_personal_selected:0,
        period_from:period_from,
        period_to:period_to,
        search_text:this.input_search_name!=null?this.input_search_name.trim():''
      }
      this.dataSources=[]
      let data=await API.GetManagementKpiList(this, request)
      if(data){
        data=JSON.parse(data)
        this.dataSources=data.concat([])
      }
    },
    async loadPage(){
      let data=await API.GetJobWorkPositionAndDepartmentTTKDGP(this)
      if(data){
        var result=JSON.parse(data)
        this.kpi_personal_list=result.positions
        this.kpi_department_list=result.departments.filter(x=>x.dep_type_id>2)
        if(this.kpi_personal_list.length>0){
          this.kpi_personal_selected=this.kpi_personal_list[0].job_work_position_id
        }
        if(this.kpi_department_list.length>0){
          this.kpi_department_selected=this.kpi_department_list[0].department_id
        }
      }
      this.initDataGrid()
    },
    onInput() {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.SearchText()
      }, 500) // 0.5s sau khi ngừng gõ
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
.management-kpi .info-row .key{
  display: table-cell !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>