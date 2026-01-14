<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content management-bsc" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Đơn vị</div>
              <div class="value">
                <select2 v-model='deparment_selected' :options="department_list" @select="loadUsersByDepartment"
                  :disabled="isStaff" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Nhân sự</div>
              <div class="value">
                <select2 v-model='user_selected' :options="userList" @select="onChangeDropdown" :disabled="isStaff" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Tháng</div>
              <div class="value">
                <ejs-datepicker v-model="tu_thang" format="MM/yyyy" :showClearButton="false" :allowEdit="true"
                  :strict-mode="true" locale="vi" :firstDayOfWeek="1" start="Year" depth="Year"
                  @change="onChangeDropdown" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <!-- <button class="btn btn-second" style="min-width: 100px;" @click="loadEmployeeBSC">
              <span class="icon one-search"></span>Tìm kiếm
            </button> -->
          </div>
        </div>

      </div>

      <div class="box-form">
        <div class="dashboard-wrapper">
          <div class="container-bsc">
            <div class="row">
              <div class="col-4">
                <!-- Donut -->
                <div class="card">
                  <div class="row align-center donut-container">
                    <div class="col-7 donut-wrapper" ref="donutContainer">
                      <div class="donut-center">
                        <ejs-accumulationchart id="donutChart" :tooltip='tooltip' :legendSettings="{ visible: false }"
                          ref="donutChart" :pointRender="onPointRender" style="width: 240px; height: 240px;">
                          <e-accumulation-series-collection>
                            <e-accumulation-series type="Pie" :dataSource="[
                              { x: 'Hoàn thành', y: completionPercent },
                              { x: 'Còn lại', y: 100 - completionPercent }
                            ]" xName="x" yName="y" innerRadius="70%" radius="100%"
                              :dataLabel="{ visible: false }"></e-accumulation-series>
                          </e-accumulation-series-collection>

                          <!-- Center text -->
                          <e-accumulation-annotations>
                            <e-accumulation-annotation
                              :content="`<div style='font-size: 22px; font-weight:600;'>${completionPercent}%</div>`"
                              region="Series" x="50%" y="50%" />
                          </e-accumulation-annotations>
                        </ejs-accumulationchart>
                      </div>

                    </div>
                    <div class="col-5 statistical-container">
                      <div class="ratio-text">{{ bscDetail?.cong_viec_hoan_thanh }}/{{ bscDetail?.tong_cong_viec }}
                      </div>
                      <div class="label-donut">Hoàn thành<br>công việc</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-8">
                <!-- KPI 3 -->
                <div class="card kpi-3">
                  <div class="row center">
                    <div class="col-4 pointer" @click="ViewTaskDetail('dung_han')">
                      <div class="bsc-value">{{ bscDetail?.cong_viec_hoan_thanh_dung_han }}</div>
                      <div class="bsc-label">Hoàn thành đúng hạn</div>
                    </div>

                    <div class="col-4 pointer" @click="ViewTaskDetail('som_han')">
                      <div class="bsc-value">{{ bscDetail?.cong_viec_hoan_thanh_som_han }}</div>
                      <div class="bsc-label">Hoàn thành sớm hạn</div>
                    </div>

                    <div class="col-4 pointer" @click="ViewTaskDetail('tre_han')">
                      <div class="bsc-value">{{ bscDetail?.cong_viec_hoan_thanh_tre_han }}</div>
                      <div class="bsc-label">Hoàn thành trễ hạn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2 -->
            <div class="row">
              <div class="col-4">
                <div class="card center">
                  <div class="bsc-value big">{{ bscDetail?.tong_thoi_gian_giao }}</div>
                  <div class="bsc-label">Tổng thời gian giao</div>
                </div>
              </div>

              <div class="col-4">
                <div class="card center">
                  <div class="bsc-value big">{{ bscDetail?.tong_thoi_gian_thuc_hien }}</div>
                  <div class="bsc-label">Tổng thời gian thực hiện</div>
                </div>
              </div>

              <div class="col-4">
                <div class="card center">
                  <div class="bsc-value big">{{ bscDetail?.tong_danh_gia_chat_luong }}</div>
                  <div class="bsc-label">Tổng đánh giá chất lượng</div>
                </div>
              </div>
            </div>

            <!-- Row 3 -->
            <div class="row">
              <div class="col-4">
                <!-- Severity -->
                <div class="card">
                  <div class="row">
                    <div class="col-12 prioty-container">
                      <div class="level-item pointer" @click="ViewTaskDetail('binh_thuong')">
                        <div class="bsc-value big">{{ bscDetail?.tong_cong_viec_binh_thuong_hoan_thanh }}</div>
                        <div class="bsc-label">Công việc bình thường hoàn thành</div>
                      </div>

                      <div class="level-item pointer" @click="ViewTaskDetail('quan_trong')">
                        <div class="bsc-value big">{{ bscDetail?.tong_cong_viec_quan_trong_hoan_thanh }}</div>
                        <div class="bsc-label">Công việc quan trọng hoàn thành</div>
                      </div>

                      <div class="level-item pointer" @click="ViewTaskDetail('rat_quan_trong')">
                        <div class="bsc-value big">{{ bscDetail?.tong_cong_viec_rat_quan_trong_hoan_thanh }}</div>
                        <div class="bsc-label">Công việc rất quan trọng hoàn thành</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-8">
                <!-- Chart -->
                <div class="card">
                  <h4 class="chart-title">BSC 3 tháng liền kề</h4>
                  <ejs-chart id="bscThreeMonthChart" :primaryXAxis="primaryXAxis" :primaryYAxis="primaryYAxis"
                    :pointClick="onPointClick" ref="bscChart" :pointRender="pointRender" :tooltip="{ enable: true }" :tooltipRender="tooltipRender"
                    :legendSettings="legendSettings">
                    <e-series-collection>
                      <e-series type="Column" :dataSource="AverageQualityOfTreeMonth" xName="x" yName="y"
                        :marker="marker" columnWidthInPixel="50">
                      </e-series>
                    </e-series-collection>
                  </ejs-chart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="value bold" style="font-size: 18px; font-weight: 700;">
                Danh sách công việc
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-6">
            <!-- Tổng tỷ trọng: {{ totalRatio }} -->
          </div>
        </div>
        <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="false" :enabledSelectFirstRow="false"
          :showSTT="false" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>
    </div>

    <!-- Modal -->
    <ViewBscDetailModal ref="viewBscDetailModal" :month_request="monthSelect" :user_id_request="user_selected"
      :data_detail="dataDetail" />

    <ViewTaskDetailModal ref="viewTaskDetailModal" :month_request="monthSelect" :user_id_request="user_selected"
      :type_request="typeSelect" />
  </div>
</template>
<script>
import API from './DashboardBscUserApi'
import moment from 'moment';
import ViewBscDetailModal from './ViewBscDetailModal.vue'
import ViewTaskDetailModal from './ViewTaskDetailModal.vue'
const primaryXAxis = {
  valueType: 'Category',
  majorGridLines: { width: 0 },
  visible: true
};
const primaryYAxis = {
  majorGridLines: { width: 0 },
  minimum: 0,
  maximum: 2,
  interval: 1,
  visible: true
};
export default {
  name: 'BSCAssignUser',
  components: {
    ViewBscDetailModal,
    ViewTaskDetailModal
  },
  data() {
    return {
      header: {
        title: "Dashboard BSC cá nhân",
        list: [
        ],
      },
      columns: [
        {
          fieldName: 'row_stt',
          headerText: 'STT',
          allowFiltering: true,
          width: '70'
        },
        {
          fieldName: 'task_name',
          headerText: 'Công việc',
          allowFiltering: true
        },
        {
          fieldName: 'priority',
          headerText: 'Mức độ',
          allowFiltering: true,
          valueAccessor: (item, data) => {
            return this.getPriorityText(data);
          },
          textAlign: 'left'
        },
        {
          fieldName: 'schedule_end',
          headerText: 'Hạn hoàn thành',
          allowFiltering: true,
          disableHtmlEncode: false,
          valueAccessor: (item, data) => {
            return data?.schedule_end
              ? moment(data?.schedule_end).format('DD/MM/YYYY')
              : '';
          }

        },
        {
          fieldName: 'status_id',
          headerText: 'Trạng thái',
          allowFiltering: true,
          valueAccessor: (field, data) => this.getTaskStatusText(data?.status_id),
          textAlign: 'left'
        },
        {
          fieldName: 'rating',
          headerText: 'Đánh giá chất lượng',
          allowFiltering: true
        }
      ],
      department_list: [],
      deparment_selected: 0,
      infoAccountLogin: null,
      userList: [],
      tu_thang: moment().format('MM/YYYY'),
      user_selected: 0,
      bscList: [],
      isStaff: false,
      // NhanVienJobPositionId: 10,
      bscDetail: null,
      dataSources: [],
      mucDoList: [
        { id: -1, text: "Tất cả" },
        { id: 1, text: "Bình thường" },
        { id: 2, text: "Quan trọng" },
        { id: 3, text: "Rất quan trọng" },
      ],
      AverageQualityOfTreeMonth: [],
      primaryXAxis: primaryXAxis,
      primaryYAxis: primaryYAxis,
      marker: {
        dataLabel: {
          visible: true,
          position: 'Outer',
          font: {
            fontWeight: '600',
            size: '14px',
            color: '#000'
          }
        }
      },
      dataDetail: [],
      monthSelect: '',
      typeSelect: '',
      // LevelJobPositionEnum: {
      //   NHAN_VIEN: 7,
      //   GD_TRUNG_TAM : 3,
      //   GD_PHONG : 4
      // }
  }
},
computed: {
  totalRatio() {
    if (this.bscList.length == 0) return 0
    const total = this.bscList.reduce((sum, item) => {
      return sum + (item.weight || 0)
    }, 0)
    return total + '%'
  },

  completionPercent() {
    const done = this.bscDetail?.cong_viec_hoan_thanh ?? 0
    const total = this.bscDetail?.tong_cong_viec ?? 0

    if (!total) return 0
    return Math.round((done / total) * 100)
  }
},

methods: {
    // async getDepartmentByDepartmentIdLogin(departmentId) {
    //   try {
    //     const res = await API.getDepartmentByDepartmentIdLogin(this.axios, departmentId);

    //     if (res?.data?.message === "Success") {
    //       const rawData = res.data.data;

    //       const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    //       const filtered = data.filter(d => d.dep_type_id == 3);

    //       this.department_list = filtered.map(d => ({
    //         id: d.department_id ?? d.id,
    //         text: d.department_name ?? d.name ?? d.text ?? "---",
    //       }));

    //     } else {
    //       console.warn("API không trả về thành công:", res?.data);
    //     }
    //   } catch (error) {
    //     console.error("Lỗi khi gọi API getDepartmentByDepartmentIdLogin:", error);
    //   }
    // }
    // ,
    async loadDepartments() {
    try {
      const res = await API.GetMyDepartmentTree(this);

      const data =
        res?.data?.data ||
        res?.data ||
        (Array.isArray(res) ? res : []);

      if (Array.isArray(data) && data.length > 0) {
        this.department_list = data.map(d => ({
          id: d.department_id ?? d.id,
          text: d.name ?? d.text ?? '---',
        }));

        // this.departments.unshift({ id: -1, text: 'Tất cả' });
      } else {
        this.departments = [];
        this.$toast?.warning?.('Không có dữ liệu phòng ban.');
      }
    } catch (error) {
      console.error('Không thể tải danh sách phòng ban:', error);
      this.$toast?.error?.('Lỗi khi tải danh sách phòng ban.');
    }
  },
    async loadAccountInfo() {
    const userId = this.$_root.token.getUserId();
    const data = await this.handleApiCall(
      () => API.getAccountByUser(this.axios, userId),
      'Không có dữ liệu tài khoản',
      'Không thể tải thông tin tài khoản'
    );
    if (data) {
      this.infoAccountLogin = data;
      // if (this.infoAccountLogin?.department_id) {
      //   await this.getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
      // }
    }
  },
    async handleApiCall(apiFunc, successMsg, errorMsg) {
    try {
      const res = await apiFunc();
      if (res?.data?.success) return res.data.data;
      this.$toast?.warning?.(res?.data?.message || successMsg || 'Không có dữ liệu');
    } catch (err) {
      console.error(errorMsg, err);
      this.$toast?.error?.(errorMsg || 'Lỗi kết nối máy chủ');
    }
    return null;
  },
    async loadUsersByDepartment() {
    const deptId = this.deparment_selected;
    if (!deptId) return;

    const data = await this.handleApiCall(
      () => API.getUsersByDepartment(this.axios, deptId),
      'Không có dữ liệu nhân sự',
      'Lỗi khi lấy danh sách nhân sự'
    );
    if (Array.isArray(data)) {
      this.userList = data;
      this.user_selected = this.userList.length > 0 ? this.userList[0].id : 0;
    }
    this.bscList = []
  },
    async loadEmployeeBSC() {
    const userId = typeof this.user_selected === 'object'
      ? this.user_selected.id
      : this.user_selected;

    if (!userId) return this.$toast.error('Vui lòng chọn Nhân sự!');

    const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
    this.requestMonth = month;

    this.loading?.(true);
    try {
      const res = await API.getBSCDetailUserMonth(this.axios, userId, month);
      if (res?.data?.success) {
        // this.bscList = typeof res.data.data === 'string'
        //   ? JSON.parse(res.data.data)
        //   : res.data.data;
        this.bscDetail = typeof res.data.data === 'string'
          ? JSON.parse(res.data.data)
          : res.data.data;
      } else {
        this.$toast?.error?.(res?.data?.message || 'Không nhận được dữ liệu');
      }
    } catch (err) {
      console.error(err);
      this.$toast?.error?.('Lỗi khi lấy dữ liệu BSC nhân viên');
    } finally {
      this.loading?.(false);
    }
  },
  onPointRender(args) {
    if (args.point.x === 'Hoàn thành') {
      args.fill = '#0B5777'
      args.border.color = '#0B5777'
    }
    if (args.point.x === 'Còn lại') {
      args.fill = '#D7D7D7'
      args.border.color = '#D7D7D7'
    }
  },
    async GetListTaskTableBsc() {
    try {
      const userId = typeof this.user_selected === 'object'
        ? this.user_selected.id
        : this.user_selected;

      if (!userId) return this.$toast.error('Vui lòng chọn Nhân sự!');
      const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
      let response = await API.GetListTaskTableBsc(this.axios, {
        month: month,
        assignee_id: userId,
      })
      if (response.data.success) {
        if (response.data.data && response.data.data.length > 0) {
          var data = JSON.parse(response.data.data);
          this.dataSources = data.concat([])
        }
        else {
          this.dataSources = []
        }
      } else {
        this.$toast.error(response.data.message);
      }
    } catch (e) {
      this.$toast.error(e.message);
    }
  },
    async GetBscUserOfTreeMonth() {
    try {
      this.AverageQualityOfTreeMonth = [];
      const userId = typeof this.user_selected === 'object'
        ? this.user_selected.id
        : this.user_selected;

      if (!userId) return this.$toast.error('Vui lòng chọn Nhân sự!');
      const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
      let response = await API.GetBscUserOfTreeMonth(this.axios, {
        month: month,
        assignee_id: userId,
      })
      if (response.data.success) {
        if (response.data.data) {
          var data = JSON.parse(response.data.data);
          this.AverageQualityOfTreeMonth = data && data.length > 0 ? data.map(r => ({ x: r.month_code, y: r.bsc, detail: r.details })) : [];
        }
      } else {
        this.$toast.error(response.data.message);
      }
    } catch (e) {
      this.$toast.error(e.message);
    }
  },
  getPriorityText(data) {
    const item = this.mucDoList.find(x => x.id == data?.priority);
    return item ? item.text : "";
  },
  getTaskStatusText(statusId) {
    const statusMap = {
      0: "Tạo mới",
      2: "Đang thực hiện",
      3: "Hoàn thành",
      10: "Chờ đánh giá",
    };
    return statusMap[statusId] || `Trạng thái ${statusId}`;
  },
  pointRender(args) {
    const defaultPalette = [
      "#00bdae", "#404041", "#357cd2", "#e56590", "#f8b883",
      "#70ad47", "#dd8abd", "#7f84e8", "#7bb4eb", "#ea7a57"
    ];

    if (!this.dynamicColors) {
      const numExtra = 100;
      this.dynamicColors = this.generateDistinctColors(numExtra);
    }

    if (args.point.index < defaultPalette.length) {
      args.fill = defaultPalette[args.point.index];
    } else {
      const colorIndex = args.point.index - defaultPalette.length;
      args.fill = this.dynamicColors[colorIndex % this.dynamicColors.length];
    }
  },
  tooltipRender(args) {
    if (args.text) {
      const y = Number(args.point.y);
      args.text = y.toFixed(4);   // làm tròn 4 số
    }
  },
  generateDistinctColors(count) {
    const result = new Set();
    while (result.size < count) {
      result.add(this.getRandomColor());
    }
    return Array.from(result);
  },
  getRandomColor() {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(180 + Math.random() * 75);

    return `rgb(${r}, ${g}, ${b})`;
  },
    async onChangeDropdown() {
    try {
      this.loading(true);
      if (this.user_selected == 0) {
        this.loading(false);
        return;
      };
      await Promise.all([
        this.loadEmployeeBSC(),
        this.GetListTaskTableBsc(),
        this.GetBscUserOfTreeMonth()
      ]);
    } catch (e) { } finally {
      this.loading(false);
    }
  },
  onResize() {
    const chart = this.$refs.donutChart?.ej2Instances;
    if (chart) {
      chart.refresh();
    }
  },
  refreshDonut() {
    const chart = this.$refs.donutChart?.ej2Instances;
    if (!chart) return;

    const width = this.$refs.donutContainer.clientWidth;

    chart.width = width + 'px';
    chart.height = width + 'px';

    chart.refresh();
  },
  onPointClick(args) {
    const index = args.point.index;
    const data = this.AverageQualityOfTreeMonth[index];
    this.dataDetail = data?.detail

    const point = args.point;

    // Lấy giá trị X và Y
    const xValue = point.x;
    this.monthSelect = xValue ? xValue : ''
    this.$refs.viewBscDetailModal.showModal()
  },
  ViewTaskDetail(typeRequest) {
    this.typeSelect = typeRequest
    this.monthSelect = this.tu_thang
    this.$refs.viewTaskDetailModal.showModal()
  },
  async CheckManagerAdmin() {
    const userId = this.$_root.token.getUserId();
    const data = await this.handleApiCall(
      () => API.CheckManagerAdmin(this.axios, userId),
      'Không có dữ liệu tài khoản',
      'Không thể tải thông tin tài khoản'
    );
    this.isStaff = data == 'True' ? false : true
    // if (data) {
    //   // this.infoAccountLogin = data;
    //   // if (this.infoAccountLogin?.department_id) {
    //   //   await this.getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
    //   // }
    // }
  }
},
  async mounted() {
  window.addEventListener('resize', this.onResize);
  await this.loadAccountInfo();
  // if(this.infoAccountLogin?.department_id){
  //   await getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
  // }
  await this.loadDepartments();
  // this.isStaff = this.infoAccountLogin?.level_job == this.LevelJobPositionEnum.NHAN_VIEN
  await this.CheckManagerAdmin()
  const loginDeptId = this.infoAccountLogin?.department_id;
  const loginUserId = this.infoAccountLogin?.user_id;
  if (loginDeptId) {
    this.deparment_selected = loginDeptId;
    await this.loadUsersByDepartment();

    if (loginUserId && this.userList.some(u => u.id === loginUserId)) {
      this.user_selected = loginUserId;
      await Promise.all([
        this.loadEmployeeBSC(),
        this.GetListTaskTableBsc(),
        this.GetBscUserOfTreeMonth()
      ]);
    }
  }
  setTimeout(() => {
    const chart = this.$refs.bscChart?.ej2Instances;
    if (chart) chart.refresh();
  }, 200);
  // const container = this.$refs.donutContainer;

  // this.resizeObserver = new ResizeObserver(() => {
  //   this.refreshDonut();
  // });

  // this.resizeObserver.observe(container);

  // Render lần đầu
  // setTimeout(() => this.refreshDonut(), 200);
},
beforeUnmount() {

},
watch: {

}
}
</script>
<style scoped>
@media (min-width: 576px) and (max-width: 768px) {
  .container-dropdown {
    display: flex !important;
  }

  .select2-container.select2-container--default.select2-container--open {
    width: auto !important;
    min-width: unset !important;
  }
}

.management-bsc .info-row .key {
  display: table-cell !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container-bsc {
  width: 100%;
  padding: 10px;
  overflow-x: auto;
  overflow-y: auto;
}

.row {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  flex-wrap: nowrap;
  overflow-x: hidden;
  align-items: stretch;
}

/* COL */
.col-4 {
  width: 33.33%;
  padding: 12px;
}

.col-8 {
  width: 66.66%;
  padding: 12px;
}

.col-6 {
  width: 50%;
  padding: 10px;
}

.col-12 {
  width: 100%;
  padding: 10px;
}

.col-4,
.col-6,
.col-8,
.col-12 {
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  min-height: 140px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  width: 100%;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.center {
  text-align: center;
}

.donut-chart {
  --value: 75;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: conic-gradient(#0b5777 calc(var(--value) * 1%), #e5e7eb 0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.donut-inner {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
}

.bsc-value {
  font-size: 45px;
  font-weight: 700;
}

.bsc-value.big {
  font-size: 45px;
}

.bsc-value.medium {
  font-size: 30px;
}

.bsc-label {
  font-size: 16px;
  /* color: #666; */
  line-height: 1.4;
}

.level-item {
  margin-bottom: 14px;
  text-align: center;
}


.chart-title {
  text-align: center;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
}

.chart-row {
  display: flex;
  justify-content: space-around;
  align-items: end;
  height: 220px;
}

.chart-col {
  text-align: center;
}

.chart-bar {
  width: 36px;
  background: #2563eb;
  border-radius: 4px 4px 0 0;
  margin: 0 auto;
}

.chart-value {
  font-size: 14px;
  margin-top: 4px;
  white-space: pre-line;
}

.chart-month {
  font-size: 14px;
  margin-top: 6px;
  color: #444;
}

.ratio-text,
.bsc-value {
  font-size: 45px;
  font-weight: 700;
}

.label-donut,
.bsc-label {
  font-size: 26px;
  font-weight: 700;
}

.prioty-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.donut-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.donut-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.donut-container {
  padding: 12px;
}

.statistical-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>