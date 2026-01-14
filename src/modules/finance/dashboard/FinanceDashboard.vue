<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;bottom: 10px!important; ">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
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
                        v-model='deparment_selected'
                        :options="department_list"
                        @select="onDeparmentChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w120 bold center">Nhóm sản phẩm</div>
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
                 <div class="legend-title">Biểu đồ doanh thu theo phòng</div>
                <ejs-chart
                    ref="deptChart"
                    :primaryXAxis="deptChartXAxis"
                    :primaryYAxis="deptChartYAxis"
                    :legendSettings="legendSettings"
                    :tooltip="tooltip"
                    :useGroupingSeparator="true"
                    locale="vi-VN"
                >
                    <e-series-collection>
                    <e-series
                        :dataSource="deptChartData"
                        type="Column"
                        xName="department"
                        yName="actual"
                        name="Thực tế"
                        :fill="chartColors.actual"
                    ></e-series>
                    <e-series
                        :dataSource="deptChartData"
                        type="Column"
                        xName="department"
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
  name: "FinanceDashboard",
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
        title: "DASHBOARD QUẢN LÝ DOANH THU",
        list: [],
      },
      tu_thang: new Date(new Date().getFullYear(), 0, 1),
      den_thang: new Date(new Date().getFullYear(), 11, 31),
      center_selected: 0,
      deparment_selected: 0,
      group_selected: 0,
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
      group_list: [
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
      deptChartData: [],
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
        
        const centerId = this.center_selected || 0;
        const departmentId = this.deparment_selected || 0;
        const groupId = this.group_selected || 0;

        const [monthData, deptData, totalData] = await Promise.all([
          API.GetDashboardRevenueMonth(this, centerId, departmentId, groupId, fromDate, toDate),
          API.GetDashboardRevenueDepartment(this, centerId, departmentId, groupId, fromDate, toDate),
          API.GetDashboardRevenueTotal(this, centerId, departmentId, groupId, fromDate, toDate)
        ]);

        if (monthData && Array.isArray(monthData)) {
          this.barChartData = monthData.map(item => ({
            month: this.formatPeriod(item.period),
            actual: item.actual_revenue,
            planned: item.planned_revenue//Math.max(0, item.planned_revenue - item.actual_revenue)
          }));
        } else {
          this.barChartData = [];
        }

        if (deptData && Array.isArray(deptData)) {
          this.deptChartData = deptData.map(item => ({
            department_id:item.department_id,
            department: item.department_name,
            actual: item.actual_revenue,
            planned: item.planned_revenue//Math.max(0, item.planned_revenue - item.actual_revenue)
          }));
        } else {
          this.deptChartData = [];
        }

        if (totalData && Array.isArray(totalData) && totalData.length > 0) {
          const revenues = totalData[0];
          this.pieChartData = [
              { 
                name: 'Thực tế', 
                value: revenues.actual_revenue, 
                text: `${this.formatCurrency(revenues.actual_revenue)}` 
              },
              { 
                name: 'Kế hoạch', 
                value: revenues.planned_revenue, 
                text: `${this.formatCurrency(revenues.planned_revenue)}`
              }
          ];
        } else {
          this.pieChartData = [];
        }
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi tải dữ liệu dashboard.');
        console.error('Error loading dashboard data:', error);
      } finally {
        this.loading(false);
      }
    },
    async onCenterChange(){
      this.loading(true);
      this.department_list=[ { id:0, text:'Tất cả' } ];
      this.group_list=[ { id:0, text:'Tất cả' } ];
      this.deparment_selected=0;
      this.group_selected=0;

      if (this.center_selected > 0) {
        var arrParentId=[this.center_selected];
        let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3);
        this.department_list=this.department_list.concat(rsDeparment.map(x=>({ id:x.department_id, text:x.name })));
        
        arrParentId=rsDeparment.map(x=>x.department_id);
        if (arrParentId.length > 0) {
          let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4);
          this.group_list=this.group_list.concat(rsGroup.map(x=>({ id:x.department_id, text:x.name })));
        }
      }
      
      this.loading(false);
      this.loadDashboardData();
    },
    async onDeparmentChange(){
      this.loading(true);
      this.group_list=[ { id:0, text:'Tất cả' } ];
      this.group_selected=0;
      
      var arrParentId=[];
      if(this.deparment_selected > 0){
        arrParentId=[this.deparment_selected];
      } else {
        arrParentId=this.department_list.filter(x=>x.id!=0).map(x=>x.id);
      }

      if (arrParentId.length > 0) {
        let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4);
        this.group_list=this.group_list.concat(rsGroup.map(x=>({ id:x.department_id, text:x.name })));
      }
      
      this.loading(false);
      this.loadDashboardData();
    },
    onGroupChange(){
      this.loadDashboardData();
    },
    onChartPointDepartmentClick(args){
      const { point, series } = args
      // Dữ liệu chi tiết:
      const index = point.index
      const seriesIndex = series.index
      const data = this.deptChartData[index]
      const fromDate = this.tu_thang ? parseInt(this.tu_thang.getFullYear().toString() + (this.tu_thang.getMonth() + 1).toString().padStart(2, '0')) : 0;
      const toDate = this.den_thang ? parseInt(this.den_thang.getFullYear().toString() + (this.den_thang.getMonth() + 1).toString().padStart(2, '0')) : 0;
      if(seriesIndex==0){
        //Thực tế
        this.$router.push({name:'revenue', query:{department_id:data.department_id, from_date: fromDate, to_date: toDate}});
      }else if(seriesIndex==1){
        //Kế hoạch
        this.$router.push({name:'plannedrevenue', query:{department_id:data.department_id, from_date: fromDate, to_date: toDate}});
      }
    },
    async initDuLieu(){
      try {
        this.loading(true);
        let dataUnit=await API.GetAllUnit(this);
        if(dataUnit){
          this.center_list=this.center_list.concat(dataUnit.centers.map(x=>({ id:x.department_id, text:x.name })));
          this.department_list=this.department_list.concat(dataUnit.deparments.map(x=>({ id:x.department_id, text:x.name })));
          this.group_list=this.group_list.concat(dataUnit.groups.map(x=>({ id:x.department_id, text:x.name })));

          //Điều chỉnh default TTCNTT đầu tiên
          if(this.center_list.findIndex(x=>x.id==2)>-1){
            this.center_selected=2
            this.onCenterChange()
          }else{
            this.loadDashboardData();
          }
        }
      } catch (error) {
        this.$toast.error('Không thể tải danh sách đơn vị.');
      } finally {
        this.loading(false);
      }
    }
  },
  mounted() {
    this.$refs.deptChart.ej2Instances.pointClick = this.onChartPointDepartmentClick;
    this.initDuLieu();
  },
};
</script>

<style src="./FinanceDashboard.css" scoped></style>
