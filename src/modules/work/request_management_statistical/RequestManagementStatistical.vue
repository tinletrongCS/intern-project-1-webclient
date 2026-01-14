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

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w80">Từ ngày</div>
              <div class="value">
                <ejs-datepicker v-model="tu_ngay" format="dd/MM/yyyy" :showClearButton="false" :allowEdit="true"
                  :strict-mode="true" locale="vi" :firstDayOfWeek="1" @change="onChangeDropdown" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w80">Đến ngày</div>
              <div class="value">
                <ejs-datepicker v-model="den_ngay" format="dd/MM/yyyy" :showClearButton="false" :allowEdit="true"
                  :strict-mode="true" locale="vi" :firstDayOfWeek="1" @change="onChangeDropdown" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <button class="btn btn-second" style="min-width: 100px;" @click="onSearch">
              <span class="icon one-search"></span>Tìm kiếm
            </button>
          </div>
        </div>

      </div>

      <div class="box-form">
        <div class="row support-wrapper">
          <!-- RIGHT TABLE -->
          <div class="col-md-12 col-12">
            <div class="support-table">
              <h4 class="table-title">Danh sách yêu cầu hỗ trợ trong ngày</h4>
              <KDataGrid ref="gridDsManagementBSC" :columns="columns" :dataSource="dataSources"
                :enable-paging-server="false" :allowPaging="false" :showFilter="false" :allowSorting="false"
                :showColumnCheckbox="false" :enabledSelectFirstRow="false" :selectionSettings="{ checkboxOnly: false }"
                @onRowSelected="selectDataCheckedIn" @queryCellInfo="onQueryCellInfo" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import API from './RequestManagementStatistical'
import moment from 'moment';
import ViewBscDetailModal from './ViewBscDetailModal.vue'
import ViewTaskDetailModal from './ViewTaskDetailModal.vue'
export default {
  name: 'RequestManagement',
  components: {
    ViewBscDetailModal,
    ViewTaskDetailModal
  },
  data() {
    return {
      header: {
        title: "Thống kê hỗ trợ khách hàng",
        list: [
        ],
      },
      columns: [
        {
          fieldName: 'stt',
          headerText: 'STT',
          allowFiltering: true,
          width: '70',
          textAlign: 'center'
        },
        {
          fieldName: 'customer_name',
          headerText: 'Khách hàng',
          allowFiltering: true
        },
        {
          fieldName: 'description',
          headerText: 'Yêu cầu',
          allowFiltering: true,
          // valueAccessor: (item, data) => {
          //   return this.getPriorityText(data);
          // },
          textAlign: 'left'
        },
        {
          fieldName: 'full_name',
          headerText: 'Nhân sự thực hiện',
          allowFiltering: true,
          // valueAccessor: (item, data) => {
          //   return this.getPriorityText(data);
          // },
          textAlign: 'left'
        },
        {
          fieldName: 'report_content',
          headerText: 'Kết quả',
          allowFiltering: true,
          disableHtmlEncode: true,
          // valueAccessor: (field, data) => {
          //   return data?.report_content
          //     ? data.report_content.replace(/\n/g, '<br/>')
          //     : '';
          // }

        },
        {
          fieldName: 'actual_execution_time',
          headerText: 'Thời gian',
          allowFiltering: true,
          // valueAccessor: (field, data) => this.getTaskStatusText(data?.status_id),
          textAlign: 'left',
          width: '100'
        }
      ],
      department_list: [],
      deparment_selected: 0,
      infoAccountLogin: null,
      userList: [],
      tu_thang: moment().format('MM/YYYY'),
      user_selected: 0,
      isStaff: false,
      monthSelect: '',
      typeSelect: '',
      dataSources: [],
      tu_ngay: new Date(),
      den_ngay: new Date(),
      customerName: '',
      requestContent: '',
      itemSelected: null,
      requestReport: '',
      activityLogs: [],
      textButtonAction: 'Tạm dừng'
    }
  },
  computed: {
  },

  methods: {
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
    },
    async onChangeDropdown() {
      try {
        this.loading(true);
        if (this.user_selected == 0) {
          this.loading(false);
          return;
        };
        await Promise.all([
          this.GetListRequestUser()
        ]);
      } catch (e) { } finally {
        this.loading(false);
      }
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
    },
    async onStart() {
      // 1️⃣ Validate
      if (!this.customerName || !this.requestContent) {
        this.$toast?.warning?.('Vui lòng nhập đầy đủ thông tin bắt buộc');
        return;
      }

      // 2️⃣ Build payload
      const payload = {
        customer_name: this.customerName,
        request_content: this.requestContent
      };

      // 3️⃣ Call API
      const res = await API.CreateRequestManagement(this, payload, true);

      // ❌ API báo nghiệp vụ không cho tạo
      if (res && res.success === false) {
        this.$toast?.warning?.(res.message || 'Không thể tạo công việc');
        return;
      }

      // ✅ Tạo thành công
      if (res && res.success === true) {
        this.$toast?.success?.('Đã tạo mới công việc thành công!');
        this.GetListRequestUser();
      }
    },

    async GetListRequestUser() {
      try {
        this.AverageQualityOfTreeMonth = [];
        const userId = typeof this.user_selected === 'object'
          ? this.user_selected.id
          : this.user_selected;

        if (!userId) return this.$toast.error('Vui lòng chọn Nhân sự!');
        const tuNgay = moment(this.tu_ngay).format('DD/MM/YYYY');
        const denNgay = moment(this.den_ngay).format('DD/MM/YYYY');
        let response = await API.GetListRequestUser(this.axios, {
          fromday: tuNgay,
          today: denNgay,
          assignee_id: userId,
        })
        if (response.data.success) {
          if (response.data.data) {
            // this.dataSources = response.data.data;
            this.dataSources = JSON.parse(response.data.data);

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

    onSearch() {
      this.GetListRequestUser()
      // this.onGetListTaskLog()
    },

    selectDataCheckedIn(data) {
      this.itemSelected = data;
      this.customerName = data?.customer_name || '';
      this.requestContent = data?.description || '';
    },

    async onPause() {
      if (!this.itemSelected) {
        this.$toast?.warning?.('Vui lòng chọn công việc để tạm dừng');
        return;
      }

      try {
        const response = await API.DoingTask(
          this.itemSelected.task_id
        );
        if (this.$toast) {
          this.$toast.success("Thực hiện yêu cầu thành công!");
          this.GetListRequestUser()
        } else {
          alert("Thực hiện yêu cầu thành công!");
        }
        // this.refreshRequestList();
      } catch (error) {
        if (this.$toast) {
          this.$toast.error(error.data.message || error);
        } else {
          alert(error.message || error);
        }
        return;
      }
    },

    async onReportDone() {
      if (!this.itemSelected) {
        this.$toast?.warning?.('Vui lòng chọn công việc để báo cáo hoàn thành');
        return;
      }

      // 1️⃣ Validate
      if (!this.requestReport) {
        this.$toast?.warning?.('Vui lòng nhập đầy đủ thông tin bắt buộc');
        return;
      }

      // 2️⃣ Build payload
      const payload = {
        request_content: this.requestReport,
        task_id: this.itemSelected.task_id
      };

      // 3️⃣ Call API
      const result = await API.ReportDoneTaskRequest(
        this,
        payload,
        true
      );

      if (result) {
        this.$toast?.success?.('Bắt đầu xử lý yêu cầu thành công');

        // 4️⃣ Sau này dùng tiếp:
        // this.startTime = new Date();
        // disable input
      }
    },

    // async onGetListTaskLog() {
    //   try {
    //     if (!this.itemSelected) return this.$toast.error('Vui lòng chọn công việc !');
    //     let response = await API.GetTaskLog(this, this.itemSelected.task_id)
    //     if (response.length > 0) {
    //       this.activityLogs = response;
    //     }
    //     else {
    //       this.activityLogs = []
    //       this.$toast.error(response.data.message);
    //     }
    //   } catch (e) {
    //     this.$toast.error(e.message);
    //   }
    // },

    onQueryCellInfo(args) {
      if (args.column.field === 'report_content') {
        let content = args.data?.report_content;

        if (content) {
          content = content.replace(/^\s*\n/, '');

          args.cell.textContent = content;
          args.cell.style.whiteSpace = 'pre-line';
          args.cell.style.lineHeight = '1.4';
        }
      }
    }


  },
  async mounted() {
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
        this.GetListRequestUser()
      }
    }
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

.row {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  flex-wrap: nowrap;
  overflow-x: hidden;
  align-items: stretch;
}

.required-title {
  color: red;
  /* position: absolute; */
  /* left: 1px; */
  font-style: italic;
}

.container-button {
  display: flex;
  justify-content: end;
  gap: 10px;
}

/* css mới */
/* FORM LEFT */
.support-form {
  border: 1px solid #ccc;
  padding: 12px;
  background: #fff;
  height: 100%;
}

.form-row {
  margin-bottom: 12px;
}

.form-row label {
  display: block;
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 1px solid #aaa;
  padding: 6px 8px;
  font-size: 14px;
  resize: none;
}

.form-row.inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* BUTTON */
.btn {
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 14px;
  cursor: pointer;
}

.btn-start {
  background: #dff0d8;
  border-color: #b2d8a7;
}

.btn-pause {
  background: #FFF3CD;
  border-color: #FFC107;
}

.btn-end {
  background: #e6f0ff;
  border-color: #b5ccf2;
}

.time-label {
  background: #fff4cc;
  border: 1px solid #e0c97f;
  padding: 4px 8px;
  font-size: 12px;
}

/* TABLE RIGHT */
.support-table {
  border: 1px solid #ccc;
  background: #fff;
  padding: 8px;
  height: 100%;
}

.table-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: left;
}

.support-table table {
  width: 100%;
  border-collapse: collapse;
}

.support-table th,
.support-table td {
  border: 1px solid #999;
  padding: 6px;
  font-size: 12px;
  text-align: center;
}

.support-table th {
  background: #f5f5f5;
}

.empty-row {
  height: 220px;
}

/* ACTIVITY HISTORY */
/* ACTIVITY HISTORY */
.activity-history {
  margin-top: 16px;
}

.activity-list {
  max-height: 260px;
  overflow-y: auto;
  padding-right: 4px;
  width: 100%;
}

/* ITEM */
.activity-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
}

/* AVATAR */
.activity-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #7ac943;
  /* xanh giống ảnh */
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* CONTENT */
.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
}

.activity-text strong {
  font-weight: 700;
}

.activity-time {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

/* EMPTY */
.activity-empty {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 12px 0;
}

input:focus {
  outline: none;
  border-color: #ccc;
  box-shadow: none;
}

textarea:focus {
  outline: none;
  border-color: #ccc;
  box-shadow: none;
}

.btn-second {
  background-color: #fff;
  border-color: #0176FF;
  color: #0176FF;
  font-weight: 600;
  padding: 5px 10px;
}
</style>