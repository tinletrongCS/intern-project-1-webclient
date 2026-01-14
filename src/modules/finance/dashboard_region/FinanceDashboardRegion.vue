<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;bottom: 10px!important; ">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w60 bold center">Địa bàn</div>
                <div class="value">
                    <select2 
                        v-model='region_selected'
                        :options="region_list"
                        @select="onRegionChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w80 bold center">Trung tâm</div>
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
                <div class="key w80 bold center">Phòng ban</div>
                <div class="value">
                    <select2 
                        v-model='department_selected'
                        :options="department_list"
                         @select="onDepartmentChange"
                    />
                </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
           <div class="info-row">
                <div class="key w80 bold center">Từ tháng</div>
                <div class="value">
                    <div class="input-icon-right">
                        <ejs-datepicker
                            v-model="tu_thang"
                            format="MM/yyyy"
                            :showClearButton="false"
                            :allowEdit="true"
                            :strict-mode="true"
                            locale="vi"
                            @change="changeThangBD"
                            :firstDayOfWeek="1"
                            start="Year"
                            depth="Year"
                        />
                    </div>
                </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
           <div class="info-row">
                <div class="key w80 bold center">Đến tháng</div>
                <div class="value">
                    <div class="input-icon-right">
                        <ejs-datepicker
                            v-model="den_thang"
                            format="MM/yyyy"
                            :showClearButton="false"
                            :allowEdit="true"
                            :strict-mode="true"
                            locale="vi"
                            @change="changeThangKT"
                            :firstDayOfWeek="1"
                            start="Year"
                            depth="Year"
                        />
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>

      <div class="row">
        <div class="col-md-6 col-12">
             <div class="box-form">
                 <div class="legend-title">Biểu đồ luỹ kế doanh thu</div>
                <ejs-accumulationchart
                    id="pie-chart"
                    :legendSettings="legendSettings"
                    :tooltip="tooltipPie"
                    :enableSmartLabels="true"
                    :useGroupingSeparator="true"
                    locale="vi-VN"
                >
                    <e-accumulation-series-collection>
                    <e-accumulation-series
                        :dataSource="pieChartData"
                        xName="name"
                        yName="value"
                        type="Pie"
                        :dataLabel="pieDataLabel"
                        innerRadius="40%"
                        :palettes="[chartColors.pieActual, chartColors.piePlanned]"
                    >
                    </e-accumulation-series>
                    </e-accumulation-series-collection>
                </ejs-accumulationchart>
            </div>
        </div>

        <div class="col-md-6 col-12">
            <div class="box-form">
                 <div class="legend-title">Biểu đồ doanh thu theo trung tâm</div>
                <ejs-chart
                    :primaryXAxis="deptChartXAxis"
                    :primaryYAxis="deptChartYAxis"
                    :legendSettings="legendSettings"
                    :tooltip="tooltip"
                    :useGroupingSeparator="true"
                    locale="vi-VN"
                >
                    <e-series-collection>
                    <e-series
                        :dataSource="centerChartData"
                        type="Column"
                        xName="center"
                        yName="actual"
                        name="Thực tế"
                        :fill="chartColors.actual"
                    ></e-series>
                    <e-series
                        :dataSource="centerChartData"
                        type="Column"
                        xName="center"
                        yName="planned"
                        name="Kế hoạch"
                        :fill="chartColors.planned"
                    ></e-series>
                    </e-series-collection>
                </ejs-chart>
            </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-12 col-12">
            <div class="box-form">
                <div class="legend-title">Biểu đồ doanh thu theo tháng</div>
                <ejs-chart
                    :primaryXAxis="barChartXAxis"
                    :primaryYAxis="barChartYAxis"
                    :legendSettings="legendSettings"
                    :tooltip="tooltip"
                    :useGroupingSeparator="true"
                    locale="vi-VN"
                >
                    <e-series-collection>
                    <e-series
                        :dataSource="barChartData"
                        type="Column"
                        xName="month"
                        yName="actual"
                        name="Thực tế"
                        :fill="chartColors.actual"
                    ></e-series>
                    <e-series
                        :dataSource="barChartData"
                        type="Column"
                        xName="month"
                        yName="planned"
                        name="Kế hoạch"
                        :fill="chartColors.planned"
                    ></e-series>
                    </e-series-collection>
                </ejs-chart>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from './API'
export default {
  name: "FinanceDashboardRegion",
  data() {
    return {
      // Chart colors
      chartColors: {
        actual: '#1C75BC',
        planned: '#FF6B6B',
        pieActual: '#1C75BC',
        piePlanned: '#FF6B6B'
      },
      header: {
        title: "DASHBOARD QUẢN LÝ DOANH THU ĐỊA BÀN",
        list: [],
      },
      tu_thang: new Date(new Date().getFullYear(), 0, 1),
      den_thang: new Date(new Date().getFullYear(), 11, 31),
      region_selected: 0,
      center_selected: 0,
      department_selected: 0,
      region_list: [
        {
          id: 0,
          text: 'Tất cả'
        }
      ],
      center_list: [
        {
          id: 0,
          text: 'Tất cả'
        }
      ],
      department_list: [
        {
          id: 0,
          text: 'Tất cả'
        }
      ],
      // Dữ liệu cho Biểu đồ doanh thu theo tháng
      barChartData: [],
      barChartXAxis: {
        valueType: "Category"
      },
      barChartYAxis: {
        labelFormat: 'n0'
      },
      // Dữ liệu cho Biểu đồ doanh thu theo phòng ban
      centerChartData: [],
      deptChartXAxis: { valueType: "Category" },
      deptChartYAxis: { 
        labelFormat: 'n0' 
      },

      
      // Dữ liệu cho biểu đồ tròn
      pieChartData: [],
      pieDataLabel: {
        visible: true,
        position: 'Outside',
        name: 'text',
        font: {
            fontWeight: '600',
            color: '#333333'
        },
        connectorStyle: {
            length: '20px',
            type: 'Line'
        }
      },
      legendSettings: {
          visible: true,
          position: 'Bottom'
      },
      tooltip: {
          enable: true,
      },
      tooltipPie: {
          enable: true,
      }
    };
  },
  methods: {
    changeThangBD(args) {
      this.loadDashboardData();
    },
    changeThangKT(args) {
      this.loadDashboardData();
    },
    
    formatPeriod(period) {
      // const year = Math.floor(period / 100);
      const month = period % 100;
      return `Tháng ${month.toString().padStart(2, '0')}`;
    },
    
    formatCurrency(value) {
      if (value === null || value === undefined) return '0';
      // This function already correctly formats the number for Vietnamese currency.
      return new Intl.NumberFormat('vi-VN').format(value);
    },
    
    async loadDashboardData() {
      try {
        this.loading(true);
        const fromDate = this.tu_thang ? parseInt(this.tu_thang.getFullYear().toString() + (this.tu_thang.getMonth() + 1).toString().padStart(2, '0')) : 0;
        const toDate = this.den_thang ? parseInt(this.den_thang.getFullYear().toString() + (this.den_thang.getMonth() + 1).toString().padStart(2, '0')) : 0;
        
        const regionId = this.region_selected || 0;
        const centerId = this.center_selected || 0;
        const departmentId = this.department_selected || 0;

        var [monthData, centerData, totalData] = await Promise.all([
          API.GetDashboardRevenueRegionMonth(this, regionId, centerId, departmentId, fromDate, toDate),
          API.GetDashboardRevenueRegionCenter(this, regionId, centerId, departmentId, fromDate, toDate),
          API.GetDashboardRevenueRegionTotal(this, regionId, centerId, departmentId, fromDate, toDate)
        ])

        if(monthData)monthData=JSON.parse(monthData)
        if(centerData)centerData=JSON.parse(centerData)
        if(totalData)totalData=JSON.parse(totalData)
        

        if (monthData && Array.isArray(monthData)) {
          this.barChartData = monthData.map(item => ({
            month: this.formatPeriod(item.period),
            actual: item.actual_revenue_region,
            planned: item.planned_revenue_region//Math.max(0, item.planned_revenue - item.actual_revenue)
          }));
        } else {
          this.barChartData = [];
        }

        if (centerData && Array.isArray(centerData)) {
          this.centerChartData = centerData.map(item => ({
            center: item.department_name,
            actual: item.actual_revenue_region,
            planned: item.planned_revenue_region//Math.max(0, item.planned_revenue - item.actual_revenue)
          }));
        } else {
          this.centerChartData = [];
        }

        if (totalData && Array.isArray(totalData) && totalData.length > 0) {
          const revenues = totalData[0];
          this.pieChartData = [
              { 
                name: 'Thực tế', 
                value: revenues.actual_revenue_region, 
                text: `${this.formatCurrency(revenues.actual_revenue_region)}` 
              },
              { 
                name: 'Kế hoạch', 
                value: revenues.planned_revenue_region, 
                text: `${this.formatCurrency(revenues.planned_revenue_region)}`
              }
          ];
        } else {
          this.pieChartData = [];
        }
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi tải dữ liệu dashboard.');
      } finally {
        this.loading(false);
      }
    },
    async onRegionChange(){
      this.loading(true);
      this.center_list=[ { id:0, text:'Tất cả' } ];
      this.department_list=[ { id:0, text:'Tất cả' } ];
      this.center_selected=0;
      this.department_selected=0;

      if (this.region_selected > 0) {
        var arrParentId=[this.region_selected];
        let rsCenter=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),2);
        this.center_list=this.center_list.concat(rsCenter.map(x=>({ id:x.department_id, text:x.name })));
        
        arrParentId=rsCenter.map(x=>x.department_id);
        if (arrParentId.length > 0) {
          let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3);
          this.department_list=this.department_list.concat(rsGroup.map(x=>({ id:x.department_id, text:x.name })));
        }
      }
      
      this.loading(false);
      this.loadDashboardData();
    },
    async onCenterChange(){
      this.loading(true);
      this.department_list=[ { id:0, text:'Tất cả' } ];
      this.department_selected=0;
      
      var arrParentId=[];
      if(this.center_selected > 0){
        arrParentId=[this.center_selected];
      } else {
        arrParentId=this.center_list.filter(x=>x.id!=0).map(x=>x.id);
      }

      if (arrParentId.length > 0) {
        let rsDepartment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3);
        this.department_list=this.department_list.concat(rsDepartment.map(x=>({ id:x.department_id, text:x.name })));
      }
      
      this.loading(false);
      this.loadDashboardData();
    },
    onDepartmentChange(){
      this.loadDashboardData();
    },
    async loadPage(){
      let dataUnit=await API.GetAllUnit(this)
      if(dataUnit){
        this.region_list=this.region_list.concat(dataUnit.regions.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.department_list=this.department_list.concat(dataUnit.departments.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        
        //Điều chỉnh default TTCNTT đầu tiên
        if(this.region_list.findIndex(x=>x.id==1)>-1){
          this.region_selected=1
          this.onRegionChange()
        }else{
          this.loadDashboardData()
        }
      }
    }
  },
  mounted() {
    this.loadPage();
  },
};
</script>

<style src="./FinanceDashboardRegion.css" scoped></style>
