<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w100 bold">Trung tâm</div>
                <div class="value">
                    <select2 
                        v-model='center_selected'
                        :options="center_list"
                        @select="onCenterChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w100 bold">Phòng ban</div>
                <div class="value">
                    <select2 
                        v-model='deparment_selected'
                        :options="department_list"
                        @select="onDeparmentChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w140 bold">Nhóm sản phẩm</div>
                <div class="value">
                    <select2 
                        v-model='group_selected'
                        :options="group_list"
                         @select="onGroupChange"
                    />
                </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
           <div class="info-row">
                <div class="key w60 bold">Năm</div>
                <div class="value">
                   <div class="select-custom">
                    <select v-model="yearRevenue" @change="handleYearChange"  class="form-control">
                      <option v-for="y in years" :key="y.value" :value="y.value">
                        {{ y.text }}
                      </option>
                    </select>
                   </div>
                </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">

          </div>
        </div>
      </div>
      <div class="box-form">
          <div class="info-row">
             <div class="group-buttons -bottom">
              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ExportExcel()">
                <span class="icon fa fa-file-excel-o"></span>&nbsp;Export Excel
              </button>&nbsp;
             </div>
          </div>

          <PlanBreakdownTable ref="planBreakdownTable"/>

      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import * as XLSX from 'xlsx-js-style';
import API from './API'
import PlanBreakdownTable from './PlanBreakdownTable.vue'
export default {
  name: "ReportRevenue",
  components:{
    PlanBreakdownTable
  },
  data() {
    return {
      header: {
        title: "BÁO CÁO THỐNG KÊ DOANH THU",
        list: [],
      },
      years: this.generateYears(),
      yearRevenue: Number(moment().format('YYYY')),
      
      center_selected:2,
      center_list:[
        {
           id:0,
           text:'Tất cả'
        }
      ],
      deparment_selected:0,
      department_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      group_selected:0,
      group_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      dataGrid:[]
    };
  },
  methods: {
    async onCenterChange(){
      this.department_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.group_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.deparment_selected=0
      this.group_selected=0
      var arrParentId=[this.center_selected]
      let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
      this.department_list=this.department_list.concat(rsDeparment.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))
      arrParentId=rsDeparment.map(x=>x.department_id)
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4)
      this.group_list=this.group_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))
      this.initDataGrid()

    },
    async onDeparmentChange(){
      this.group_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.group_selected=0
      var arrParentId=[]
      if(this.deparment_selected){
        arrParentId=[this.deparment_selected]
      }else{
        arrParentId=this.department_list.filter(x=>x.id!=0).map(x=>x.id)
      }
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4)
      this.group_list=this.group_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))

      this.initDataGrid()

    },
    onGroupChange(){
      this.initDataGrid()
    },
    generateYears() {
      const currentYear = new Date().getFullYear();
      const range = 2;
      const years = [];

      for (let i = currentYear - range; i <= currentYear + range; i++) {
        years.push({ value: i, text: i.toString() });
      }

      return years;
    },
    handleYearChange(event) {
      this.initDataGrid()
    },
    async pageLoad() {
      let dataUnit=await API.GetAllUnit(this)
      if(dataUnit){
        this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.department_list=this.department_list.concat(dataUnit.deparments.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.group_list=this.group_list.concat(dataUnit.groups.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        
        //Điều chỉnh default TTCNTT đầu tiên
        if(this.center_list.findIndex(x=>x.id==2)>-1){
          this.center_selected=2
          this.onCenterChange()
        }else if(this.center_list.length>0){
          this.center_selected=this.center_list[0].id
          this.initDataGrid()
        }
      }
    },
    async initDataGrid() {
      let fromDate = Number(moment(this.yearRevenue, 'YYYY').startOf('year').format('YYYYMM'))
      let toDate = Number(moment(this.yearRevenue, 'YYYY').endOf('year').format('YYYYMM'))
      let result=await API.GetReportRevenueUnitDetailWithMonth(this, this.center_selected, this.deparment_selected, this.group_selected,fromDate, toDate)
      if(result&&result!=''){
        var data=JSON.parse(result)
        if(data.length==0){
          this.dataGrid=[]
          this.$refs.planBreakdownTable.loadData(this.dataGrid, null)
          return
        }
        for (let i = 0; i < data.length; i++) {
          // Kiểm tra số tháng và các tháng cụ thể
          console.log(`Dept ${data[i].department_name} có ${data[i].revenue_months.length} tháng`);
          console.log(data[i].revenue_months.map(x => x.period_display));
          data[i].revenue_months.forEach((x, idx) => {
            console.log(`Tháng ${x.period_display}:`, x.actual_revenue, typeof x.actual_revenue);
          });

          data[i].total_actual_revenue=data[i].revenue_months.reduce((sum, x) => sum + (Number(x.actual_revenue) || 0), 0)
          data[i].total_planned_revenue=data[i].revenue_months.reduce((sum, x) => sum + (Number(x.planned_revenue) || 0), 0)
          if (data[i].total_planned_revenue > 0) {
            const percent = (data[i].total_actual_revenue / data[i].total_planned_revenue) * 100;
            data[i].percent = percent.toFixed(2) + '%';
          } else {
            data[i].percent = '0%';
          }
          //Tương tự children
          for (let j = 0; j < data[i].children.length; j++){
            data[i].children[j].total_actual_revenue=data[i].children[j].revenue_months.reduce((sum, x) => sum + x.actual_revenue, 0)
            data[i].children[j].total_planned_revenue=data[i].children[j].revenue_months.reduce((sum, x) => sum + x.planned_revenue, 0)
            if (data[i].children[j].total_planned_revenue > 0) {
              const percent = (data[i].children[j].total_actual_revenue / data[i].children[j].total_planned_revenue) * 100;
              data[i].children[j].percent = percent.toFixed(2) + '%';
            } else {
              data[i].children[j].percent = '0%';
            }
          }
        }
        //Check nếu chỉ chọn trung tâm-->Header sum->Trung tâm; Chọn phòng Header sum->Phòng
        var dataSum=null
        if(this.center_selected>0&&this.deparment_selected==0&&this.group_selected==0){
          //Trung tâm
          const center=this.center_list.find(x=>x.id==this.center_selected)
          dataSum={}
          dataSum.department_id=center.id
          dataSum.department_name=center.text
          dataSum.revenue_months=data[0].revenue_months.map(x => ({ ...x })); //clone
          for (let i = 0; i < dataSum.revenue_months.length; i++) {
            dataSum.revenue_months[i].planned_revenue=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].planned_revenue || 0), 0)
            dataSum.revenue_months[i].actual_revenue=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].actual_revenue || 0), 0)
            dataSum.revenue_months[i].actual_revenue_maintain=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].actual_revenue_maintain || 0), 0)
            dataSum.revenue_months[i].actual_revenue_new=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].actual_revenue_new || 0), 0)                                          
          }
          dataSum.total_actual_revenue=dataSum.revenue_months.reduce((sum, x) => sum + x.actual_revenue, 0)
          dataSum.total_planned_revenue=dataSum.revenue_months.reduce((sum, x) => sum + x.planned_revenue, 0)
          if (dataSum.total_planned_revenue > 0) {
            const percent = (dataSum.total_actual_revenue / dataSum.total_planned_revenue) * 100;
            dataSum.percent = percent.toFixed(2) + '%';
          } else {
            dataSum.percent = '0%';
          }

        }else if(this.deparment_selected>0&&this.group_selected==0){
          //Phòng
          const deparment=this.department_list.find(x=>x.id==this.deparment_selected)
          dataSum={}
          dataSum.department_id=deparment.id
          dataSum.department_name=deparment.text
          dataSum.revenue_months=data[0].revenue_months.map(x => ({ ...x })); //clone
          for (let i = 0; i < dataSum.revenue_months.length; i++) {
            dataSum.revenue_months[i].planned_revenue=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].planned_revenue || 0), 0)
            dataSum.revenue_months[i].actual_revenue=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].actual_revenue || 0), 0)
            dataSum.revenue_months[i].actual_revenue_maintain=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].actual_revenue_maintain || 0), 0)
            dataSum.revenue_months[i].actual_revenue_new=data.filter(x => x.revenue_months && x.revenue_months[i]).reduce((sum, x) => sum + (x.revenue_months[i].actual_revenue_new || 0), 0)                                          
          }
          dataSum.total_actual_revenue=dataSum.revenue_months.reduce((sum, x) => sum + x.actual_revenue, 0)
          dataSum.total_planned_revenue=dataSum.revenue_months.reduce((sum, x) => sum + x.planned_revenue, 0)
          if (dataSum.total_planned_revenue > 0) {
            const percent = (dataSum.total_actual_revenue / dataSum.total_planned_revenue) * 100;
            dataSum.percent = percent.toFixed(2) + '%';
          } else {
            dataSum.percent = '0%';
          }
        }
        //
        console.log('dataGrid',data)
        this.dataGrid=data
        this.$refs.planBreakdownTable.loadData(this.dataGrid, dataSum)

      }else{
        this.dataGrid=[]
        this.$refs.planBreakdownTable.loadData(this.dataGrid, null)
      }
    },
    borderAll() {
      return {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      };
    },
    ExportExcel() {
      if (this.dataGrid.length === 0) {
        this.$toast.error('Không có dữ liệu để xuất excel');
        return;
      }
      this.$refs.planBreakdownTable.ExportExcel()

      
    },
  },
  mounted() {
    setTimeout(()=>{
      this.pageLoad()
    }, 200)
  },
};
</script>
<style scoped>
::v-deep(.e-input-group.e-control-wrapper) {
  border-radius: 4px !important;
  border-color: #E0E0E0 !important;
}
</style>
