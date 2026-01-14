<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content department-overview-kpi" style="top: 46px !important; bottom: 46px !important;">
      <div class="box-form">
        <div class="row">
            <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key bold">Phòng ban</div>
              <div class="value">
                <select2 
                  v-model="department_selected"
                  :options="unit_list"
                  @select="onChangeDepartment"
                />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div class="box-form">
        <div class="row">
          <div class="col-sm-4 col-12">
             <!-- KPI THEO NGÀY -->
            <div class="row">
              <div class="col-sm-9 col-12">
                <div class="info-row">
                  <div class="key bold">KPI theo Ngày</div>
                  <div class="value">
                    <ejs-datepicker 
                      class="form-control"
                      placeholder="Chọn ngày"
                      :format="'dd/MM/yyyy'"
                      :showClearButton="false"
                      v-model="date"
                      :allowEdit="false"
                      @change="onChangeDate($event)"
                    />
                  </div>
                </div>
              </div>

              <div class="col-sm-3 col-12 d-flex align-items-end" style="padding-bottom: 6px !important;">
                <button class="btn btn-sm btn-primary w-100" @click="loadDailyKpi(true)">
                  <i class="fa fa-refresh"></i> Tải lại
                </button>
              </div>

              <div class="col-12 mt-2 kpi-list">
                <div class="kpi-card">
                  <span class="kpi-label">Tổng công việc hoàn thành</span>
                  <span class="kpi-value">{{ daily_kpi.completed }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Tổng công việc được giao</span>
                  <span class="kpi-value">{{ daily_kpi.assigned }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Hoàn thành đúng hạn</span>
                  <span class="kpi-value">{{ daily_kpi.on_time }}</span>
                </div>

                <div class="kpi-card overdue">
                  <span class="kpi-label">Hoàn thành trễ hạn</span>
                  <span class="kpi-value">{{ daily_kpi.overdue }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-4 col-12">
            <!-- KPI THEO TUẦN -->
            <div class="row">
              <div class="col-sm-9 col-12">
                <div class="info-row">
                  <div class="key bold">KPI theo Tuần</div>
                  <div class="value">
                    <select2 
                        v-model='week_selected'
                        :options="weekList"
                        @select="loadWeekKpi(true)"
                      />
                  </div>
                </div>
              </div>

              <div class="col-sm-3 col-12 d-flex align-items-end" style="padding-bottom: 6px !important;">
                <button class="btn btn-sm btn-primary w-100" @click="loadWeekKpi(true)">
                  <i class="fa fa-refresh"></i> Tải lại
                </button>
              </div>

              <div class="col-12 mt-2 kpi-list">
                <div class="kpi-card">
                  <span class="kpi-label">Tổng công việc hoàn thành</span>
                  <span class="kpi-value">{{ week_kpi.completed }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Tổng công việc được giao</span>
                  <span class="kpi-value">{{ week_kpi.assigned }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Chưa hoàn thành</span>
                  <span class="kpi-value">{{ week_kpi.pending }}</span>
                </div>

                <div class="kpi-card overdue">
                  <span class="kpi-label">Chưa hoàn thành trễ hạn</span>
                  <span class="kpi-value">{{ week_kpi.pending_overdue }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Hoàn thành đúng hạn</span>
                  <span class="kpi-value">{{ week_kpi.on_time }}</span>
                </div>

                <div class="kpi-card overdue">
                  <span class="kpi-label">Hoàn thành trễ hạn</span>
                  <span class="kpi-value">{{ week_kpi.overdue }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Dự án đúng tiến độ</span>
                  <span class="kpi-value">{{ week_kpi.project_on_time }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Tổng số dự án</span>
                  <span class="kpi-value">{{ week_kpi.total_project }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-4 col-12">
            <!-- KPI THEO THÁNG -->
            <div class="row">
              <div class="col-sm-9 col-12">
                <div class="info-row">
                  <div class="key bold">KPI theo Tháng</div>
                  <div class="value">
                    <ejs-datepicker 
                      class="form-control"
                      placeholder="Chọn tháng"
                      :format="'MM/yyyy'"
                      :start="'Year'"
                      :depth="'Year'"
                      :showClearButton="false"
                      v-model="month"
                      :allowEdit="false"
                      @change="onChangeMonth($event)"
                    />
                  </div>
                </div>
              </div>

              <div class="col-sm-3 col-12 d-flex align-items-end" style="padding-bottom: 6px !important;">
                <button class="btn btn-sm btn-primary w-100" @click="loadMonthKpi(true)">
                  <i class="fa fa-refresh"></i> Tải lại
                </button>
              </div>

              <div class="col-12 mt-2 kpi-list">
                <div class="kpi-card">
                  <span class="kpi-label">Tổng công việc hoàn thành</span>
                  <span class="kpi-value">{{ month_kpi.completed }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Tổng công việc được giao</span>
                  <span class="kpi-value">{{ month_kpi.assigned }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Chưa hoàn thành</span>
                  <span class="kpi-value">{{ month_kpi.pending }}</span>
                </div>

                <div class="kpi-card overdue">
                  <span class="kpi-label">Chưa hoàn thành trễ hạn</span>
                  <span class="kpi-value">{{ month_kpi.pending_overdue }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Hoàn thành đúng hạn</span>
                  <span class="kpi-value">{{ month_kpi.on_time }}</span>
                </div>

                <div class="kpi-card overdue">
                  <span class="kpi-label">Hoàn thành trễ hạn</span>
                  <span class="kpi-value">{{ month_kpi.overdue }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Tổng số vi phạm quy định</span>
                  <span class="kpi-value">{{ month_kpi.process_rate }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Doanh thu thực hiện</span>
                  <span class="kpi-value">{{ month_kpi.actual_revenue.toLocaleString() }}</span>
                </div>

                <div class="kpi-card">
                  <span class="kpi-label">Doanh thu kế hoạch</span>
                  <span class="kpi-value">{{ month_kpi.planned_revenue.toLocaleString() }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      
      </div>

    </div>

  </div>
</template>
<script>
import API from './API'
import moment from 'moment'
export default {
  name:'DepartmentOverviewKpi',
  components:{

  },
  data(){
    return {
      header: {
          title: "KPI PHÒNG BAN",
          list: [
          ],
      },
      month: moment(new Date()).format('MM/yyyy'),
      unit_list:[],
      department_selected:null,

      date: moment(new Date()).format('DD/MM/YYYY'),

      week_selected: null,
      weekList: [],

      daily_kpi: { completed: 0, assigned: 0, on_time: 0, overdue: 0 },
      week_kpi: { completed: 0, assigned: 0, on_time: 0, overdue: 0, project_on_time: 0, total_project: 0 ,pending:0,  pending_overdue:0},
      month_kpi: { completed: 0, assigned: 0, on_time: 0, overdue: 0, process_rate: 0, actual_revenue: 0, planned_revenue: 0 ,pending:0,  pending_overdue:0},
      
    }
  },
  computed:{
    monthNumber(){
      return Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
    }
  },
  methods:{
    getWeeksForSelect2(year) {
      const weeks = [];
      
      // Ngày đầu năm
      let date = new Date(year, 0, 1);

      // Đưa về thứ Hai của tuần đầu tiên
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() - 1);
      }

      let week = 1;
      while (date.getFullYear() <= year || (date.getFullYear() === year + 1 && week <= 53)) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 6);

        // Format dd/MM/yyyy
        const fmt = d => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

        weeks.push({
          id: week,
          text: `Tuần ${week} (${fmt(start)} - ${fmt(end)})`,
          start: fmt(start),
          end: fmt(end)
        });

        // Sang tuần kế tiếp
        date.setDate(date.getDate() + 7);
        week++;
        if (date.getFullYear() > year + 1) break;
      }

      return weeks;
    },
    async loadPage(){
      const currentYear = new Date().getFullYear();
      this.weekList = this.getWeeksForSelect2(currentYear);

      // 🔹 Xác định tuần hiện tại
      const today = new Date();
      today.setHours(0, 0, 0, 0); // bỏ giờ phút giây để so đúng ngày

      const currentWeek = this.weekList.find(week => {
        const [sd, sm, sy] = week.start.split('/').map(Number);
        const [ed, em, ey] = week.end.split('/').map(Number);
        const startDate = new Date(sy, sm - 1, sd);
        const endDate = new Date(ey, em - 1, ed);
        endDate.setHours(23, 59, 59, 999);
        return today >= startDate && today <= endDate;
      });

      if (currentWeek) {
        this.week_selected = currentWeek.id;
      }

      this.unit_list=await API.GetMyDepartmentTree(this)
      if(this.unit_list.length>0){
        this.department_selected=this.unit_list[0].id
        this.loadDataKpi()
      }
    },
    async onChangeDepartment(){
      this.loadDataKpi()
    },
    async loadDataKpi(){
      if(!this.department_selected||this.unit_list.length==0){
        return
      }
      this.loading(true)
      await Promise.all([
        this.loadDailyKpi(false),
        this.loadWeekKpi(false),
        this.loadMonthKpi(false)
      ])
      this.loading(false)
    },
    async loadDailyKpi(isLoading){
      this.daily_kpi={ completed: 0, assigned: 0, on_time: 0, overdue: 0 }
      let period=Number(moment(this.date, 'DD/MM/YYYY').format('YYYYMMDD'))
      let request={
        period:period,
        departmentId:this.department_selected
      }
      var result=await API.GetDepartmentOverviewKpiDay(this, request, isLoading)
      if(result){
        result=JSON.parse(result)
        this.daily_kpi.completed=result.total_done_day
        this.daily_kpi.assigned=result.total_task_day
        this.daily_kpi.on_time=result.total_done_on_time_day
        this.daily_kpi.overdue=result.total_done_overdue_day
      }
    },
    async loadWeekKpi(isLoading){
      this.week_kpi={ completed: 0, assigned: 0, on_time: 0, overdue: 0, project_on_time: 0, total_project: 0 , pending:0,  pending_overdue:0}
      const selected = this.weekList.find(w => w.id == this.week_selected);
      if (!selected) {
        return
      }
      var start_date=moment(selected.start, 'DD/MM/YYYY').format('YYYYMMDD')
      var end_date=moment(selected.end, 'DD/MM/YYYY').format('YYYYMMDD')

      let request={
        periodFrom:start_date,
        periodTo:end_date,
        departmentId:this.department_selected
      }
      var result=await API.GetDepartmentOverviewKpiWeek(this, request, isLoading)
      if(result){
        result=JSON.parse(result)
        this.week_kpi.completed=result.total_done_week
        this.week_kpi.assigned=result.total_task_week
        this.week_kpi.on_time=result.total_done_on_time_week
        this.week_kpi.overdue=result.total_done_overdue_week
        this.week_kpi.project_on_time=result.total_project_on_time_week
        this.week_kpi.total_project=result.total_project_week
        this.week_kpi.pending=result.total_pending_week
        this.week_kpi.pending_overdue=result.total_pending_overdue_week
      }
    },
    async loadMonthKpi(isLoading){
      this.month_kpi={ completed: 0, assigned: 0, on_time: 0, overdue: 0, process_rate: 0, actual_revenue: 0, planned_revenue: 0 , pending:0,  pending_overdue:0}
      let period=Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
      let request={
        period:period,
        departmentId:this.department_selected
      }
      var result=await API.GetDepartmentOverviewKpiMonth(this, request, isLoading)
      if(result){
        result=JSON.parse(result)
        this.month_kpi.completed=result.total_done_month
        this.month_kpi.assigned=result.total_task_month
        this.month_kpi.on_time=result.total_done_on_time_month
        this.month_kpi.overdue=result.total_done_overdue_month
        this.month_kpi.process_rate=result.compliance_rate
        this.month_kpi.actual_revenue=result.actual_revenue
        this.month_kpi.planned_revenue=result.planned_revenue

        this.month_kpi.pending=result.total_pending_month
        this.month_kpi.pending_overdue=result.total_pending_overdue_month
      }
    },
    onChangeMonth(event) {
      if (event && event.value) {
        this.month = moment(event.value).format('MM/YYYY');
        this.loadMonthKpi(true)
      }
      
    },
    onChangeDate(event){
      if (event && event.value) {
        this.date = moment(event.value).format('DD/MM/YYYY');
        this.loadDailyKpi(true)
      }
    }
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
    }, 200)
  }
}
</script>
<style>
.department-overview-kpi .info-row {
    display: table;
    width: 100%;
    table-layout: fixed; /* Bắt buộc table-cell tuân theo width */
}

.department-overview-kpi .info-row .key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: table-caption; /*Cho lên dòng trên*/
}

.department-overview-kpi .info-row .value {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden; /* quan trọng */
    width: auto;
    padding-left: 0px !important;
}

.department-overview-kpi .info-row .value .select2-container {
    width: 100% !important;
}

.department-overview-kpi .info-row .value .select2-selection {
    width: 100% !important;
    overflow: hidden !important;
}

.department-overview-kpi .info-row .value .select2-selection__rendered {
    display: block !important;
    width: 100% !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
 .department-overview-kpi .col-button-search{
    padding-top:26px !important;
  }
 @media (min-width: 576px) and (max-width: 768px) {
  .department-overview-kpi .col-button-search{
    padding-top:29px !important;
  }
} 
/* makup */
.kpi-list .kpi-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
  font-size: 14px;
}

.kpi-card .kpi-label {
  font-weight: 600;
  color: #333;
}

.kpi-card .kpi-value {
  font-weight: 700;
  font-size: 16px;
  color: #0d6efd;
}

/* Màu đỏ cho KPI trễ hạn */
.kpi-card.overdue {
  border-left-color: #dc3545;
}

.kpi-card.overdue .kpi-value {
  color: #dc3545;
}
</style>