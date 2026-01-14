<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w100 bold">Viễn thông tỉnh</div>
                <div class="value">
                    <select2 
                        v-model='region_selected'
                        :options="region_list"
                        @select="onRegionChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w40 bold">Năm</div>
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
            <!-- <div class="info-row">
                <div class="key w100 bold">Trung tâm</div>
                <div class="value">
                    <select2 
                        v-model='center_selected'
                        :options="center_list"
                        @select="onCenterChange"
                    />
                </div>
            </div> -->
          </div>
          <div class="col-sm-3 col-12">
            <!-- <div class="info-row">
                <div class="key w140 bold">Phòng ban</div>
                <div class="value">
                    <select2 
                        v-model='department_selected'
                        :options="department_list"
                         @select="onDepartmentChange"
                    />
                </div>
            </div> -->
          </div>

          <div class="col-sm-2 col-12">
            <!-- <div class="info-row">
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
            </div> -->
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
          <RegionBreakdownTable ref="regionBreakdownTable" :year="yearRevenue"/>
      </div>
      
      <div class="box-form">
          <div class="info-row">
             <div class="group-buttons -bottom">
              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ExportMonthlyExcel()">
                <span class="icon fa fa-file-excel-o"></span>&nbsp;Export Excel Doanh thu tháng
              </button>&nbsp;
             </div>
          </div>
          <MonthlyPlanTable ref="monthlyPlanTable"/>
      </div>
      <div class="box-form">
          <div class="info-row">
             <div class="group-buttons -bottom">
              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ExportFieldRevenueExcel()">
                <span class="icon fa fa-file-excel-o"></span>&nbsp;Export Excel Doanh thu lĩnh vực
              </button>&nbsp;
             </div>
          </div>
          <FieldRevenueTable  ref="fieldRevenueTable" :year="yearRevenue"/>
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import API from './API'
import RegionBreakdownTable from './RegionBreakdownTable.vue'
import MonthlyPlanTable from './MonthlyPlanTable.vue'
import FieldRevenueTable from './FieldRevenueTable.vue'
export default {
  name: "RegionRevenueReport",
  components:{
    RegionBreakdownTable,
    MonthlyPlanTable,
    FieldRevenueTable
  },
  data() {
    return {
      header: {
        title: "BÁO CÁO THỐNG KÊ DOANH THU ĐỊA BÀN",
        list: [],
      },
      region_selected:0,
      region_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      center_selected:0,
      center_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      department_selected:0,
      department_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      years: this.generateYears(),
      yearRevenue: Number(moment().format('YYYY')),


      dataGrid:[],
      monthlyDataGrid:[],
      fieldRevenueGrid:[]
    };
  },
  methods: {
    async onRegionChange(){
      // this.center_list=[
      //   {
      //     id:0,
      //     text:'Tất cả'
      //   }
      // ]
      // this.department_list=[
      //   {
      //     id:0,
      //     text:'Tất cả'
      //   }
      // ]
      // this.center_selected=0
      // this.department_selected=0
      // var arrParentId=[this.region_selected]
      // let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),2)
      // this.center_list=this.center_list.concat(rsDeparment.map(x=>{
      //   return {
      //     id:x.department_id,
      //     text:x.name
      //   }
      // }))
      // arrParentId=rsDeparment.map(x=>x.department_id)
      // let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
      // this.department_list=this.department_list.concat(rsGroup.map(x=>{
      //   return {
      //     id:x.department_id,
      //     text:x.name
      //   }
      // }))
      this.initDataGrid()

    },
    async onCenterChange(){
      this.department_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.department_selected=0
      var arrParentId=[]
      if(this.center_selected){
        arrParentId=[this.center_selected]
      }else{
        arrParentId=this.center_list.filter(x=>x.id!=0).map(x=>x.id)
      }
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
      this.department_list=this.department_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))

      //this.initDataGrid()

    },
    onDepartmentChange(){
     // this.initDataGrid()
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
        this.region_list=this.region_list.concat(dataUnit.regions.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        // this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
        //   return {
        //     id:x.department_id,
        //     text:x.name
        //   }
        // }))
        // this.department_list=this.department_list.concat(dataUnit.departments.map(x=>{
        //   return {
        //     id:x.department_id,
        //     text:x.name
        //   }
        // }))
        if(this.region_list.findIndex(x=>x.id==1)>-1){
          this.region_selected=1
          this.onRegionChange()
        }else{
          this.initDataGrid()
        }
      }
    },
    async initDataGrid() {
      //1 Báo cáo doanh thu địa bàn kế hoạch sản xuất kinh doanh năm
      let result=await API.GetReportRevenueRegionTotalDetailWithField(this, this.region_selected, this.yearRevenue)
      if(result&&result!=''){
        var data=JSON.parse(result)
        console.log('initDataGrid', data)
        if(data.length==0){
          this.dataGrid=[]
          this.$refs.regionBreakdownTable.loadData(this.dataGrid, null)
          return
        }
        this.dataGrid=data
        this.$refs.regionBreakdownTable.loadData(this.dataGrid, null)
      }else{
        this.dataGrid=[]
        this.$refs.regionBreakdownTable.loadData(this.dataGrid, null)
      }

      //2 Dự kiến giao kế hoạch doanh thu khách hàng - dịch vụ nhóm b-c năm 2025
      let result2=await API.GetReportRevenueRegionPeriodDetailWithUnit(this, this.region_selected, this.yearRevenue)
       if(result2){
        var data_vtt=result2.data_vtt?JSON.parse(result2.data_vtt):[]
        var data_ttkd=result2.data_ttkd?JSON.parse(result2.data_ttkd):[]
        var fields=result2.fields?result2.fields:[]
        var dataCobi=[
          {
            department_id: result2.unit_vtt_id,
            department_name: "Viễn thông thành phố",
            children:data_vtt
          },
          {
            department_id: result2.unit_ttkd_id,
            department_name: "Trung tâm kinh doanh",
            children:data_ttkd
          }
        ]
        for (let i = 0; i < dataCobi.length; i++) {
          dataCobi[i].projected_maintain_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.projected_maintain_total || 0), 0);
          dataCobi[i].projected_new_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.projected_new_total || 0), 0);
          dataCobi[i].projected_other_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.projected_other_total || 0), 0);
          dataCobi[i].projected_planed_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.projected_planed_total || 0), 0);
          dataCobi[i].actual_cumulative_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.actual_cumulative_total || 0), 0);
          dataCobi[i].percent_actual_projected = dataCobi[i].projected_planed_total == 0 ? 0 : Math.round((dataCobi[i].actual_cumulative_total * 100.0 / dataCobi[i].projected_planed_total), 2) + '%';

          dataCobi[i].projected_data = this.sumRevenueByPeriod(dataCobi[i].children, "projected_data");
          dataCobi[i].actual_data = this.sumRevenueByPeriod(dataCobi[i].children, "actual_data");
        }
        //Header tổng
        var totalSummary = {
          department_id: null,
          department_name: "Địa bàn Hồ Chí Minh",
          children: dataCobi.flatMap(dep => dep.children)
        }

        totalSummary.projected_maintain_total =  totalSummary.children.reduce((sum, child) => sum + (child.projected_maintain_total || 0), 0);
        totalSummary.projected_new_total =  totalSummary.children.reduce((sum, child) => sum + (child.projected_new_total || 0), 0);
        totalSummary.projected_other_total =  totalSummary.children.reduce((sum, child) => sum + (child.projected_other_total || 0), 0);
        totalSummary.projected_planed_total =  totalSummary.children.reduce((sum, child) => sum + (child.projected_planed_total || 0), 0);
        totalSummary.actual_cumulative_total =  totalSummary.children.reduce((sum, child) => sum + (child.actual_cumulative_total || 0), 0);
        totalSummary.percent_actual_projected = totalSummary.projected_planed_total == 0 ? 0 : Math.round((totalSummary.actual_cumulative_total * 100.0 / totalSummary.projected_planed_total), 2) + '%';

        totalSummary.projected_data = this.sumRevenueByPeriod(totalSummary.children, "projected_data");
        totalSummary.actual_data = this.sumRevenueByPeriod(totalSummary.children, "actual_data");

        console.log('dataCobi', dataCobi)
        console.log('totalSummary', totalSummary)
        this.$refs.monthlyPlanTable.loadData(this.yearRevenue, dataCobi, totalSummary)
      }else{
        this.$refs.monthlyPlanTable.loadData(this.yearRevenue, [], null)
      }

      //3 Doanh thu kế hoạch theo lĩnh vực từng địa bàn
      let result3=await API.GetReportRevenueRegionFieldDetailWithUnit(this, this.region_selected, this.yearRevenue)
       if(result3){
        //filer bỏ mấy cái đơn vị 0 có giá trị luôn
        var data_vtt=result3.data_vtt?JSON.parse(result3.data_vtt):[]
        var data_ttkd=result3.data_ttkd?JSON.parse(result3.data_ttkd):[]
        var fields=result3.fields?result3.fields:[]
        var dataCobi=[
          {
            department_id: result3.unit_vtt_id,
            department_name: "Viễn thông thành phố",
            children:data_vtt
          },
          {
            department_id: result3.unit_ttkd_id,
            department_name: "Trung tâm kinh doanh",
            children:data_ttkd
          }
        ]
        for (let i = 0; i < dataCobi.length; i++) {
          dataCobi[i].planned_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.planned_total || 0), 0);
          dataCobi[i].actual_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.actual_total || 0), 0);
          dataCobi[i].actual_6m_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.actual_6m_total || 0), 0);
          dataCobi[i].actual_9m_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.actual_9m_total || 0), 0);
          dataCobi[i].projected_9m_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.projected_9m_total || 0), 0);
          dataCobi[i].projected_total =  dataCobi[i].children.reduce((sum, child) => sum + (child.projected_total || 0), 0);

          dataCobi[i].planned = this.sumRevenueByField(dataCobi[i].children, "planned")
          dataCobi[i].actual = this.sumRevenueByField(dataCobi[i].children, "actual")
          dataCobi[i].actual_6m = this.sumRevenueByField(dataCobi[i].children, "actual_6m")
          dataCobi[i].actual_9m = this.sumRevenueByField(dataCobi[i].children, "actual_9m")
          dataCobi[i].projected_9m = this.sumRevenueByField(dataCobi[i].children, "projected_9m")
          dataCobi[i].projected = this.sumRevenueByField(dataCobi[i].children, "projected")
        }
        //Lọc bỏ các đơn vị child giá trị hàng 0
        //.filter(r=>r.planned_total!=0&&r.actual_total!=0&&r.projected_total!=0)
        for (let i = 0; i < dataCobi.length; i++) {
          dataCobi[i].children=dataCobi[i].children.filter(r=>r.planned_total!=0||r.actual_total!=0||r.projected_total!=0)
        }

        //Header tổng
        var totalSummary = {
          department_id: null,
          department_name: "Địa bàn Hồ Chí Minh",
          children: dataCobi.flatMap(dep => dep.children)
        }

        totalSummary.planned = this.sumRevenueByField(totalSummary.children, "planned")
        totalSummary.actual = this.sumRevenueByField(totalSummary.children, "actual")
        totalSummary.actual_6m = this.sumRevenueByField(totalSummary.children, "actual_6m")
        totalSummary.actual_9m = this.sumRevenueByField(totalSummary.children, "actual_9m")
        totalSummary.projected_9m = this.sumRevenueByField(totalSummary.children, "projected_9m")
        totalSummary.projected = this.sumRevenueByField(totalSummary.children, "projected")
        // Tổng số đơn giản
        totalSummary.planned_total = totalSummary.planned.total_revenue
        totalSummary.actual_total = totalSummary.actual.total_revenue
        totalSummary.actual_6m_total = totalSummary.actual_6m.total_revenue
        totalSummary.actual_9m_total = totalSummary.actual_9m.total_revenue
        totalSummary.projected_9m_total = totalSummary.projected.projected_9m_total
        totalSummary.projected_total = totalSummary.projected.total_revenue

        this.$refs.fieldRevenueTable.loadData(dataCobi, totalSummary, fields)
      }else{
        this.$refs.fieldRevenueTable.loadData([],null, [])
      }

    },
    sumRevenueByField(children, key) {
      const fieldMap = new Map();
      let total = 0;

      for (const child of children) {
        const group = child[key];
        if (!group || !Array.isArray(group.fields)) continue;

        for (const field of group.fields) {
          total += field.revenue || 0;
          const existing = fieldMap.get(field.field_id);
          if (existing) {
            existing.revenue += field.revenue || 0;
          } else {
            fieldMap.set(field.field_id, {
              field_id: field.field_id,
              field_revenue_code: field.field_revenue_code,
              field_revenue_name: field.field_revenue_name,
              revenue: field.revenue || 0
            });
          }
        }
      }

      return {
        total_revenue: total,
        fields: Array.from(fieldMap.values())
      };
    },

    sumRevenueByPeriod(children, key) {
      const result = {};
      children.forEach(item => {
        if (item[key] && item[key].length > 0 && key == "projected_data") {
          item[key].forEach(entry => {
            const { month, projected_new, projected_maintain, projected_other } = entry;
            if (!result[month]) {
              result[month] = {
                month,
                projected_new: 0,
                projected_maintain: 0,
                projected_other: 0
              };
            }
            result[month].projected_new += projected_new;
            result[month].projected_maintain += projected_maintain;
            result[month].projected_other += projected_other;
            result[month].projected_total += projected_new + projected_maintain + projected_other;
          });
        } else if (item[key] && item[key].length > 0 && key == "actual_data") {
          item[key].forEach(entry => {
            const { month, actual_new, actual_maintain, actual_other } = entry;
            if (!result[month]) {
              result[month] = {
                month,
                actual_new: 0,
                actual_maintain: 0,
                actual_other: 0
              };
            }
            result[month].actual_new += actual_new;
            result[month].actual_maintain += actual_maintain;
            result[month].actual_other += actual_other;
          });
        }        
      });

      const data_total_array = Object.values(result);

      return data_total_array;
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
      this.$refs.regionBreakdownTable.ExportExcel()
    },
    ExportMonthlyExcel() {
      this.$refs.monthlyPlanTable.ExportExcel()
    },
    ExportFieldRevenueExcel() {
      this.$refs.fieldRevenueTable.ExportExcel()
    },
  },
  mounted() {
    setTimeout(()=>{
      this.pageLoad()
    }, 200)
  },
};
</script>
