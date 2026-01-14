<template>
  <div class="kpi-stats">
    <div class="row text-center">
      <!-- Row 1 -->
      <div class="col-sm-4 col-12 mb-3">
        <div class="stats-wrapper">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_plan_time}}</div>
                <div class="text-muted small bold">Tổng thời gian giao</div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_actual_time}}</div>
                <div class="text-muted small bold">Tổng thời gian thực hiện</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4 col-12 mb-3">
        <div class="stats-wrapper">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_project_on_schedule}}</div>
                <div class="text-muted small bold">Tổng dự án đúng tiến độ</div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_project}}</div>
                <div class="text-muted small bold">Tổng dự án</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4 col-12 mb-3">
        <div class="stats-wrapper p-3">
          <div class="display-4 font-weight-bold">{{dashboard.total_task_late}}</div>
          <div class="text-muted small bold">Tổng số công việc trễ hạn</div>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="col-sm-4 col-12 mb-3">
        <div class="stats-wrapper">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_incident_on_time}}</div>
                <div class="text-muted small bold">Tổng số xử lý sự cố đúng hạn</div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_incident}}</div>
                <div class="text-muted small bold">Tổng số giao xử lý sự cố</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4 col-12 mb-3">
        <div class="stats-wrapper">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_bug_on_time}}</div>
                <div class="text-muted small bold">Tổng số BUG đúng hạn</div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_bug}}</div>
                <div class="text-muted small bold">Tổng số BUG giao</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4 col-12 mb-3">
        <div class="stats-wrapper">
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_task}}</div>
                <div class="text-muted small bold">Tổng công việc giao</div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="p-3">
                <div class="display-4 font-weight-bold">{{dashboard.total_task_on_time}}</div>
                <div class="text-muted small bold">Tổng công việc hoàn thành đúng hạn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "KpiDashboardStats",
  props: {
    data: { type: Object}
  },
  data(){
    return {
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
      }
    }
  }

}
</script>

<style scoped>
.stats-box {
  border: 1px solid #cfe8ff !important;
  background: #ffffff;
  border-radius: 6px;
  transition: 0.2s;
}
.stats-box:hover {
  background: #f7fbff;
}
.stats-box .display-4 {
  font-size: 32px;
}
.stats-wrapper {
  border: 1px solid #cfe8ff;
  background: #ffffff;
  border-radius: 6px;
  transition: 0.2s;
}

.stats-wrapper:hover {
  background: #f7fbff;
}
</style>