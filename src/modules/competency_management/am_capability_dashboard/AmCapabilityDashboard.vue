<template>
  <div class="main-wrapper am-capability-dashboard">
    <breadcrumb :header="header" />

    <div class="page-content" style="top: 46px !important;">

      <!-- ===== FILTER ===== -->
      <div class="box-form">
        <div class="row">

          <!-- Tháng -->
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold">Tháng</div>
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
                  @change="onChangeFromMonth"
                />
              </div>
            </div>
          </div>

          <!-- Đơn vị -->
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold">Đơn vị</div>
              <div class="value">
                <select2
                  v-model="unit_selected"
                  :options="unit_list"
                  @select="onChangeUnit"
                />
              </div>
            </div>
          </div>

          <!-- Nhân sự -->
          <div class="col-md-3 col-12">
            <div class="info-row">
              <div class="key bold">Nhân sự</div>
              <div class="value">
                <select2
                  v-model="staff_selected"
                  :options="staff_list.map(e => ({ id: e.user_id, text: e.display_name }))"
                  @select="onChangeStaff"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ===== DASHBOARD ===== -->
      <div class="am-dashboard mt-3">

        <!-- ===== KPI CARDS ===== -->
        <div class="row g-3">
          <div class="col-md-3 col-6" style="padding-right: 9px !important;padding-left: 9px !important;">
            <div class="card kpi-card kpi-primary">
              <div class="kpi-header">
                <div>
                  <div class="kpi-title">Tổng giá trị hợp đồng</div>
                  <div class="kpi-value">{{ dashboardKpi.total_contract_value.toLocaleString('vi-VN') }}</div>
                </div>
                <div class="kpi-icon">
                  <i class="fa fa-bar-chart"></i>
                </div>
              </div>
              <!-- <div class="kpi-sub text-success">+2.1% so với tháng trước</div> -->
            </div>
          </div>

          <div class="col-md-3 col-6" style="padding-right: 9px !important;padding-left: 9px !important;">
            <div class="card kpi-card kpi-info">
              <div class="kpi-header">
                <div>
                  <div class="kpi-title">Tổng điểm tích lũy</div>
                  <div class="kpi-value">{{ dashboardKpi.total_point.toLocaleString('vi-VN') }}</div>
                </div>
                <div class="kpi-icon">
                  <i class="fa fa-star"></i>
                </div>
              </div>
              <!-- <div class="kpi-sub text-muted">Không thay đổi</div> -->
            </div>
          </div>

          <div class="col-md-3 col-6" style="padding-right: 9px !important;padding-left: 9px !important;">
            <div class="card kpi-card kpi-warning">
              <div class="kpi-header">
                <div>
                  <div class="kpi-title">Chờ thẩm định</div>
                  <div class="kpi-value">{{ dashboardKpi.pending_acceptance }}</div>
                </div>
                <div class="kpi-icon">
                  <i class="fa fa-clock-o"></i>
                </div>
              </div>
              <!-- <div class="kpi-sub text-success">+2 so với tuần trước</div> -->
            </div>
          </div>

          <div class="col-md-3 col-6" style="padding-right: 9px !important;padding-left: 9px !important;">
            <div class="card kpi-card kpi-danger">
              <div class="kpi-header">
                <div>
                  <div class="kpi-title">Tổng dịch vụ đã thực hiện</div>
                  <div class="kpi-value">{{ dashboardKpi.service_total }}</div>
                </div>
                <div class="kpi-icon">
                  <i class="fa fa-cogs"></i>
                </div>
              </div>
              <!-- <div class="kpi-sub text-danger">-1.2% so với mục tiêu</div> -->
            </div>
          </div>
        </div>

        <!-- ===== CONTENT ===== -->
        <div class="row g-3 mt-2">

          <!-- Đánh giá gần đây -->
          <div class="col-md-8 col-12" style="padding-right: 9px !important;padding-left: 9px !important;">
            <div class="card p-3">
              <div class="card-header-custom">
                <div class="card-title-group">
                  <span class="card-icon text-primary">
                    <i class="fa fa-history"></i>
                  </span>
                  <span class="card-title-text">
                    Đánh giá gần đây
                  </span>
                </div>
              </div>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>TÊN AM</th>
                    <th>MẢNG DỊCH VỤ</th>
                    <th>NGÀY</th>
                    <th class="text-end">ĐIỂM SỐ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in recentPagedData"
                    :key="index"
                  >
                    <td>{{ row.user_name }}</td>
                    <td>{{ row.service_name }}</td>
                    <td>{{ row.evaluation_day }}</td>
                    <td class="text-end fw-bold text-success">
                      {{ row.score.toLocaleString('vi-VN') }}
                    </td>
                  </tr>

                  <!-- Empty -->
                  <tr v-if="recentEvaluations.length === 0">
                    <td colspan="4" class="text-center text-muted">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Pagination -->
              <div
                class="d-flex justify-content-between align-items-center mt-2"
                v-if="recentEvaluations.length > 0"
              >
                <span class="text-muted" style="font-size:13px">
                  Hiển thị
                  {{ (recentPage - 1) * recentPageSize + 1 }}
                  –
                  {{
                    Math.min(
                      recentPage * recentPageSize,
                      recentEvaluations.length
                    )
                  }}
                  / {{ recentEvaluations.length }}
                </span>

                <div class="pager">
                  <button
                    :disabled="recentPage === 1"
                    @click="recentPage--"
                  >
                    ‹
                  </button>

                  <button
                    v-for="p in recentTotalPages"
                    :key="p"
                    :class="{ active: p === recentPage }"
                    @click="recentPage = p"
                  >
                    {{ p }}
                  </button>

                  <button
                    :disabled="recentPage === recentTotalPages"
                    @click="recentPage++"
                  >
                    ›
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Top / Bottom -->
         <div
            class="col-md-4 col-12"
            style="padding-right: 9px !important; padding-left: 9px !important;"
          >

            <!-- ===== TOP 5 ===== -->
            <div class="card p-3 mb-3">

              <!-- Header -->
              <div class="card-header-custom">
                <div class="card-title-group">
                  <span class="card-icon text-success">
                    <i class="fa fa-trophy"></i>
                  </span>
                  <span class="card-title-text">
                    Top 5 Nhân sự xuất sắc
                  </span>
                </div>
              </div>

              <!-- List -->
              <div
                class="rank-item"
                v-for="(row, index) in topUsers"
                :key="row.user_id"
              >
                <span class="rank">{{ index + 1 }}</span>

                <!-- Avatar -->
                <div class="user-tags">
                  <img
                    v-if="!row.loadImageError && hasAvatar(row)"
                    :src="getAvatarUrl(row)"
                    :title="row.name"
                    class="avatar-image"
                    @error="row.loadImageError = true"
                  />
                  <span
                    v-else
                    class="initial"
                    :title="row.name"
                  >
                    {{ row.prefix_name }}
                  </span>
                </div>

                <!-- Name -->
                <span class="user-name">
                  {{ row.name }}
                </span>

                <!-- Score -->
                <span class="score text-success fw-bold">
                  {{ row.score }}
                </span>
              </div>
            </div>

            <!-- ===== BOTTOM 5 ===== -->
            <div class="card p-3">

              <!-- Header -->
              <div class="card-header-custom danger">
                <div class="card-title-group">
                  <span class="card-icon text-danger">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                  <span class="card-title-text text-danger">
                    Bottom 5 (Cần cải thiện)
                  </span>
                </div>
              </div>

              <!-- List -->
              <div
                class="rank-item danger"
                v-for="(row, index) in bottomUsers"
                :key="row.user_id"
              >
                <span class="rank">{{ index + 1 }}</span>

                <!-- Avatar -->
                <div class="user-tags">
                  <img
                    v-if="!row.loadImageError && hasAvatar(row)"
                    :src="getAvatarUrl(row)"
                    :title="row.name"
                    class="avatar-image"
                    @error="row.loadImageError = true"
                  />
                  <span
                    v-else
                    class="initial"
                    :title="row.name"
                  >
                    {{ row.prefix_name }}
                  </span>
                </div>

                <!-- Name -->
                <span class="user-name">
                  {{ row.name }}
                </span>

                <!-- Score -->
                <span class="score fw-bold">
                  {{ row.score }}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import API from './API'

export default {
  name: 'AmCapabilityDashboard',
  data () {
    return {
      header: {
        title: 'Dashboard năng lực AM',
        list: []
      },
      month: moment().format('MM/YYYY'),
      unit_selected: 0,
      unit_list: [{ id: 0, text: 'Tất cả các đơn vị' }],
      staff_selected: 0,
      staff_list: [],

      /* ===== KPI ===== */
      dashboardKpi: {
        total_contract_value: 0,
        total_point: 0,
        pending_acceptance: 0,
        service_total: 0
      },

      /* ===== RECENT ===== */
      recentEvaluations: [],
      /* ===== pagination recent ===== */
      recentPage: 1,
      recentPageSize: 5,
      /* ===== TOP / BOTTOM ===== */
      topUsers: [
        {
          user_id: 1,
          name: 'Sarah Jenkins',
          avatar: '',
          prefix_name: 'J',
          score: 9.9
        },
        {
          user_id: 2,
          name: 'Michael Chen',
          avatar: '',
          prefix_name: 'C',
          score: 9.8
        }
      ],
      bottomUsers: [
        {
          user_id: 10,
          name: 'Tom Hardy',
          avatar: '',
          prefix_name: 'H',
          score: 6.0
        }
      ]
    }
  },
  computed: {
    recentTotalPages () {
      return Math.ceil(
        (this.recentEvaluations?.length || 0) / this.recentPageSize
      )
    },
    recentPagedData () {
      const start = (this.recentPage - 1) * this.recentPageSize
      return this.recentEvaluations.slice(
        start,
        start + this.recentPageSize
      )
    }
  },
  methods: {
    async onChangeUnit () {
      this.staff_list = []
      this.staff_selected = 0
      const departmentId = this.unit_selected || 1
      const result = await API.GetUsersByDepartment(this, departmentId)
      if (result) {
        this.staff_list = JSON.parse(result)
      }
      this.staff_list.unshift({ user_id: 0, display_name: 'Tất cả' })
      this.loadDashboard()
    },
    onChangeStaff () {
      this.loadDashboard()
    },
    onChangeFromMonth () {
      this.loadDashboard()
    },
    async loadDashboard () {
      // TODO: bind API dashboard
      
      await Promise.all([
        this.loadDashboardKpi(),
        this.loadDashboardRecent(),
        this.loadDashboardTopBottom()
      ])

    },
    async loadDashboardKpi(){
      const params = this.buildDashboardParams()
      //DashboardStatistic
      this.dashboardKpi={
        total_contract_value: 0,
        total_point: 0,
        pending_acceptance: 0,
        service_total: 0
      }
      const res = await API.GetAmDashboardStatistic(this, params)
      if (res) {
        this.dashboardKpi = JSON.parse(res)
      }
    },
    async loadDashboardRecent () {
      const params = this.buildDashboardParams()
      this.recentEvaluations = []
      const res = await API.GetAmDashboardRecent(this, params)
      if (res) {
        this.recentEvaluations = JSON.parse(res)
      }
    },
    async loadDashboardTopBottom(){
      const period = this.month
        ? Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
        : Number(moment().format('YYYYMM'))
      this.topUsers=[]
      this.bottomUsers=[]
      /* ===== TOP / BOTTOM ===== */
      const rankRes = await API.GetAmDashboardTopBottom(this, {
        period
      })

      if (rankRes) {
        const data = JSON.parse(rankRes)
        this.topUsers = data.top || []
        this.bottomUsers = data.bottom || []
      }
    },
    buildDashboardParams () {
      return {
        period: this.month
          ? Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
          : Number(moment().format('YYYYMM')),

        departmentId: this.unit_selected || 0,
        userId: this.staff_selected || 0
      }
    },
    async loadPage () {
      const res = await API.GetDepartmentByRoot(this, 1)
      if (res) {
        const data = JSON.parse(res)
        this.unit_list = [
          { id: 0, text: 'Tất cả các đơn vị' },
          ...data.map(x => ({ id: x.department_id, text: x.department_name }))
        ]
      }
      await this.onChangeUnit()
    },
    hasAvatar(row) {
      return row.avatar && row.avatar.trim() !== ''
    },
    getAvatarUrl(row) {
      return `${import.meta.env.VNPT_API}/user/Account/ImageView/${row.avatar}`
    }
  },
  mounted () {
    this.loadPage()
  }
}
</script>

<style scoped>
/* ===== FILTER ===== */
.info-row {
  display: table;
  width: 100%;
}
.info-row .key {
  display: table-caption;
  font-weight: 600;
  padding-left: 6px;
}
.info-row .value {
  display: table-cell;
}

/* ===== DASHBOARD ===== */
.am-dashboard .card {
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  box-shadow: 0px 4px 4px rgba(177, 177, 177, 0.15);
}

/* KPI */
.kpi-card {
  padding: 16px;
}
.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-title {
  font-size: 15px;
  font-weight: 500;
  color: #475569;
}
.kpi-value {
  font-size: 26px;
  font-weight: 700;
}
.kpi-sub {
  font-size: 13px;
  margin-top: 6px;
}
.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-primary .kpi-icon { background: #e0e7ff; color: #2563eb; }
.kpi-info .kpi-icon { background: #e0f2fe; color: #0284c7; }
.kpi-warning .kpi-icon { background: #fef3c7; color: #d97706; }
.kpi-danger .kpi-icon { background: #fee2e2; color: #dc2626; }

/* Rank */
.rank-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.card-header-custom {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  /* border-bottom: 1px solid #e5e7eb; */
  margin-bottom: 6px;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.card-title-text {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.card-header-custom.danger {
  border-bottom-color: #fecaca;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
}

.rank-item .rank {
  width: 20px;
  text-align: right;
  font-weight: 600;
}

.user-tags {
  display: flex;
  align-items: center;
}

.avatar-image {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  box-shadow: none;
}

.initial {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  flex: 1;
  padding-left: 4px;
}

.rank-item .score {
  min-width: 36px;
  text-align: right;
}

.rank-item.danger {
  color: #dc2626;
}

.pager button {
  margin-left: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.pager button.active {
  background: #2563eb;
  color: #fff;
}

.pager button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
