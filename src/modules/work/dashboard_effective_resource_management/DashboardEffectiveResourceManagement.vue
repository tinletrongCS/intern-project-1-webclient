  <template>
    <div class="main-wrapper">
      <breadcrumb :header="header" />
      <div class="page-content" style="top: 46px !important; ">
        <div class="box-form">
          <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
          <div class="row">
            <div class="col-sm-2 col-12">
              <div class="info-row">
                <div class="key w80 bold">Trung tâm</div>
                <div class="value">
                  <select2 
                    v-model='center_selected'
                    :options="center_list"
                    @select="onCenterChange"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-2 col-12">
              <div class="info-row">
                <div class="key w80 bold">Phòng ban</div>
                <div class="value">
                  <select2 
                    v-model='deparment_selected'
                    :options="department_list"
                    @select="onDeparmentChange"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-2 col-12">
              <div class="info-row">
                <div class="key w80 bold">Nhóm SP</div>
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
                <div class="key w60 bold">Dự án</div>
                <div class="value">
                  <select2 
                    v-model='project_selected'
                    :options="project_list.map(e=>({id:e.project_id, text:`${e.project_name} ${e.project_code ? '- ' + e.project_code : ''}`}))"
                    @select="onProjectChange"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w80 bold">Từ tháng</div>
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
                <div class="key w80 bold">Đến tháng</div>
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

        <div class="box-form">
          <div style="height:600px; overflow-y:auto;">
          <ejs-chart id="container" :key="chartKey" :title='title' :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis'
            :pointClick="onPointClick"
            :height="chartHeight"
          >
            <e-series-collection>
              <e-series 
                :dataSource='barData' 
                type='StackingBar' 
                xName='assign_name' 
                yName='actual_hours' 
                name='Đã thực hiện'
                :marker='marker'
                :columnWidth="0.8"
                :columnSpacing="0.3"
                fill="#00A9E8">
              </e-series>

              <e-series 
                :dataSource='barData' 
                type='StackingBar' 
                xName='assign_name' 
                yName='remaining_assigned_hours' 
                name='Đã giao'
                :marker='marker'
                :columnWidth="0.8"
                :columnSpacing="0.3"
                fill="#D9D9D9">
              </e-series>

              <e-series 
                :dataSource='barData' 
                type='StackingBar' 
                xName='assign_name' 
                yName='remaining_standard_hours' 
                name='Tiêu chuẩn'
                fill="#E97132"
                :marker='marker'
                :columnWidth="0.8"
                :columnSpacing="0.3"
                >
              </e-series>
              <e-series 
                :dataSource='barData'
                type='StackingBar'
                xName='assign_name'
                yName='over_assigned_hours'
                name='Vượt chuẩn'
                :marker='marker'
                fill="#FF4D4F"
                :columnWidth="0.8"
                :columnSpacing="0.3"
                >
              </e-series>
            </e-series-collection>
          </ejs-chart>
          </div>
        </div>
        
      </div>
      <!-- Modal -->
      <DetailWorkForAssigneeModal ref="detailWorkForAssigneeModal" :data="dataModal"/>

    </div>
  </template>
  <script>
  import moment from 'moment'
  import API from './API'
  import * as XLSX from 'xlsx-js-style';
  import { 
    ChartComponent as EjsChart,
    SeriesCollectionDirective,
    SeriesDirective,
    StackingBarSeries,
    Category,
    DataLabel
  } from "@syncfusion/ej2-vue-charts";
  import DetailWorkForAssigneeModal from './DetailWorkForAssigneeModal.vue'
  export default {
    name:'DashboardEffectiveResourceManagement',
    components:{
      "ejs-chart": EjsChart,
      "e-series-collection": SeriesCollectionDirective,
      "e-series": SeriesDirective,
      "e-series-datalabel": {},
      DetailWorkForAssigneeModal
    },
    provide: {
      chart: [StackingBarSeries, Category, DataLabel]
    },
    data(){
      return {
        header: {
            title: "Dashboard Quản lý hiệu quả nguồn lực",
            list: [
            ],
        },
        center_selected:0,
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
        project_list:[],
        project_selected:0,
        // tu_thang:moment().startOf('year').format('MM/YYYY'),
        // den_thang:moment().endOf('year').format('MM/YYYY'),
        tu_thang:moment(new Date()).format('MM/YYYY'),
        den_thang:moment(new Date()).format('MM/YYYY'),

        title: "Biểu đồ thống kê tiến độ thực hiện của từng cá nhân",
        primaryXAxis: {
          valueType: "Category",
          // title: "Nhân viên"
        },
        primaryYAxis: {
          minimum: 0,
          maximum: 230,
          // interval: 5,
          // title: "Số giờ dự kiến"
        },
        marker: {
          dataLabel: { visible: true, position: "Middle", font: { 
            fontWeight: "Bold", // hoặc "600"
          }}
        },
        barData: [],
        chartKey: 0,
        dataModal:{}
      }
    },
    computed:{
      chartHeight() {
        const rows = this.barData?.length || 0
        return `${Math.min(Math.max(rows * 45, 400), 2500)}px`
      }
    },
    methods:{
      changeThangBD(event){
        this.tu_thang=moment(event.value).format('MM/YYYY')
        this.initDataResourceSummary()
      },
      changeThangKT(event){
        this.den_thang=moment(event.value).format('MM/YYYY')
        this.initDataResourceSummary()
      },
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
        this.initDataResourceSummary()

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

        this.initDataResourceSummary()

      },
      onGroupChange(){
        this.initDataResourceSummary()
      },
      onProjectChange(){
        this.initDataResourceSummary()
      },
      onPointClick(args) {
        this.dataModal = {} 
        // Lấy index của point trong mảng dữ liệu
        const pointIndex = args.point.index
        // Lấy lại item gốc trong dataSource
        const item = args.series.dataSource[pointIndex]

        const fromDate = Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
        const toDate = Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'))
        const filter = {
          center_id: this.center_selected,
          department_id: this.deparment_selected,
          group_id: this.group_selected,
          project_id: this.project_selected,
          from_month: fromDate,
          to_month: toDate
        }
        this.dataModal = { ...filter, ...item }

        const modalRef = this.$refs.detailWorkForAssigneeModal
        if (modalRef && typeof modalRef.showModal === 'function') {
          modalRef.showModal()
        } else {
          console.warn('detailWorkForAssigneeModal ref is not available')
        }
      },
      async initDataResourceSummary(){
        let fromDate=Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
        let toDate=Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'))
        let dataRequest={
          center_id: this.center_selected,
          department_id: this.deparment_selected,
          group_id: this.group_selected,
          project_id: this.project_selected,
          from_month: fromDate,
          to_month: toDate,
        }
        this.barData = []
        var data = await API.GetResourceSummaryByUnitWithRangeMonth(this, dataRequest)
        if(data&&data!=''){
          var dataSources=JSON.parse(data);
          if (dataSources && dataSources.length > 0) {
            dataSources = dataSources.map(x => {
              const actual_hours = x.actual_hours || 0
              const assigned_hours = x.assigned_hours || 0
              const standard_hours = x.standard_hours || 0
              const round2 = (val) => Math.round((val + Number.EPSILON) * 100) / 100
              // phần vượt
              const over_assigned_hours = round2(Math.max(0, assigned_hours - standard_hours))

              // phần còn lại nhưng không vượt quá tiêu chuẩn
              const remaining_assigned_hours = round2(Math.max(
                0,
                Math.min(assigned_hours, standard_hours) - actual_hours
              ))

              // tiêu chuẩn còn dư (sau khi trừ actual + remaining)
              const remaining_standard_hours = round2(Math.max(
                0,
                standard_hours - (actual_hours + remaining_assigned_hours)
              ))

              return {
                ...x,
                remaining_assigned_hours,
                remaining_standard_hours,
                over_assigned_hours
              }
            })
            console.log('dataSources', dataSources)
            this.barData = dataSources
            this.barData = this.barData.map(item => ({
              ...item,
              actual_hours: item.actual_hours > 0 ? item.actual_hours : null,
              remaining_assigned_hours: item.remaining_assigned_hours > 0 ? item.remaining_assigned_hours : null,
              remaining_standard_hours: item.remaining_standard_hours > 0 ? item.remaining_standard_hours : null,
              over_assigned_hours: item.over_assigned_hours > 0 ? item.over_assigned_hours : null
            }))
            this.primaryYAxis.maximum = dataSources[0]['max_standard_hours'] + 20
            this.chartKey++
          }
        }else{
          this.barData=[]
        }
      },
      async initDuLieu(){
        this.project_list=await API.GetAllProject(this)
        this.project_list.unshift({
            project_id: 0,
            project_code: "",
            project_name: "Tất cả"
        })
        this.project_selected=0
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
          //
          const { center_id, department_id, group_id, project_id, from_date, to_date } = this.$route.query
          if (department_id && from_date && to_date) {
            // Có đủ 6 tham số
            this.center_selected=center_id
            this.deparment_selected=department_id
            this.group_selected=group_id
            this.project_selected=project_id
            this.tu_thang=moment(from_date, 'YYYYMM').format('MM/YYYY')
            this.den_thang=moment(to_date, 'YYYYMM').format('MM/YYYY')
            this.initDataResourceSummary()
          } else {
            // Thiếu ít nhất 1 tham số
            //Điều chỉnh default TTKD giải pháp số
            if(this.center_list.findIndex(x=>x.id==14)>-1){
              this.center_selected=14
              this.onCenterChange()
            }else{
              this.initDataResourceSummary()
            }
          }
        }

      }
    },
    mounted(){
      setTimeout(()=>{
        this.initDuLieu()
      }, 200)
    }
  }
  </script>
  <style scoped>
  ::v-deep(.e-input-group.e-control-wrapper) {
    border-radius: 4px !important;
    border-color: #E0E0E0 !important;
  }
  </style>
