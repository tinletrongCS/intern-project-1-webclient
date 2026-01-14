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
                <select2 v-model='deparment_selected' :options="department_list"
                   />
              </div>
            </div>
          </div>

          <!-- <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Nhân sự</div>
              <div class="value">
                <select2 v-model='user_selected' :options="userList" @select="loadEmployeeBSC" :disabled="isStaff" />
              </div>
            </div>
          </div> -->

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Vị trí công việc</div>
              <div class="value">
                <select2 v-model='bsc_personal_selected'
                  :options="bsc_personal_list.map(e => ({ id: e.job_work_position_id, text: e.name }))"
                  @select="SearchText" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Tháng</div>
              <div class="value">
                <ejs-datepicker v-model="tu_thang" format="MM/yyyy" :showClearButton="false" :allowEdit="true"
                  :strict-mode="true" locale="vi" :firstDayOfWeek="1" start="Year" depth="Year"
                  @change="SearchText" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <button class="btn btn-second" style="min-width: 100px;" @click="SearchText">
              <span class="icon one-search"></span>Tìm kiếm
            </button>
          </div>
        </div>

      </div>
      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
                <button class="btn btn-second" style="min-width: 100px;" @click="onClickUpdateNewManagementBSC">
                  <span class="icon one-edit"></span>&nbsp;Cập nhật KQTH
                </button>&nbsp;
              </div>
            </div>

            <div class="info-row">
              <div class="value bold">
                Danh sách thông tin chỉ số BSC
              </div>
            </div>
          </div>
          <!-- <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-6">
            Tổng tỷ trọng: {{ totalRatio }}
          </div> -->
        </div>
        <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="true" :enabledSelectFirstRow="false"
          :showSTT="false" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>
    </div>

    <UpdateResultBSCModal ref="updateResultBSCModal" :bsc_personal_list_request="bsc_personal_list" :user_id="user_id_transfer"
      :from_month_kpi="tu_thang" :month="month_transfer" :isAdd="isAddNew" :arrIds="arrIdselected"
      :job_work_position_id="bsc_personal_selected" @successAddUpdate="successAddUpdate"
      :bsc_personal_id="user_id_transfer" :department_id_request="deparment_selected" :department_list_request="department_list" :bsc_name_request="bsc_name_request" 
      :bsc_type_request="bsc_type_request"/>
  </div>
</template>
<script>
import API from './UpdateResultBSCApi'
import UpdateResultBSCModal from './UpdateResultBSCModal.vue'
import moment from 'moment';
export default {
  name: 'BSCAssignUser',
  components: {
    UpdateResultBSCModal
  },
  data() {
    return {
      header: {
        title: "Cập nhật kết quả chỉ số BSC",
        list: [
        ],
      },
      // columns: [
      //   {
      //     fieldName: 'code',
      //     headerText: 'Mã chỉ số',
      //     allowFiltering: true,
      //     width: '100'
      //   },
      //   {
      //     fieldName: 'name',
      //     headerText: 'Tên chỉ số',
      //     allowFiltering: true
      //   },
      //   {
      //     fieldName: 'result',
      //     headerText: 'Kết quả thực hiện',
      //     allowFiltering: true
      //   }
      // ],
      department_list: [],
      deparment_selected: 0,
      infoAccountLogin: null,
      userList: [],
      tu_thang: moment().format('MM/YYYY'),
      user_selected: 0,
      bscList: [],
      isStaff: false,
      NhanVienJobPositionId: 10,
      user_id_transfer: 0,
      month_transfer: '',
      arrIdselected: [],
      bsc_personal_selected: null,
      bsc_personal_list: [],
      columns: [],
      dataSources: [],
      isAddNew:true,
    }
  },
  computed: {
    totalRatio() {
      if (this.bscList.length == 0) return 0
      const total = this.bscList.reduce((sum, item) => {
        return sum + (item.weight || 0);
      }, 0)
      return total + '%'
    }
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
    }
    ,
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
    // async loadUsersByDepartment() {
    //   const deptId = this.deparment_selected;
    //   if (!deptId) return;

    //   const data = await this.handleApiCall(
    //     () => API.getUsersByDepartment(this.axios, deptId),
    //     'Không có dữ liệu nhân sự',
    //     'Lỗi khi lấy danh sách nhân sự'
    //   );
    //   if (Array.isArray(data)) {
    //     this.userList = data;
    //     this.user_selected = this.userList.length > 0 ? this.userList[0].id : 0;
    //   }
    //   this.bscList = []
    // },
    async loadEmployeeBSC() {
      const userId = typeof this.user_selected === 'object'
        ? this.user_selected.id
        : this.user_selected;

      if (!userId) return this.$toast.error('Vui lòng chọn Nhân sự!');
      this.user_id_transfer = userId;
      // const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
      const month = this.convertMonthToInt(this.tu_thang);
      this.month_transfer = month.toString();

      this.loading?.(true);
      try {
        const res = await API.getDetailEmployee(this.axios, userId, month);
        if (res?.data?.success) {
          this.bscList = typeof res.data.data === 'string'
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
    formatWeight(field, data) {
      const val = data.weight
      if (val == null || val === '') return ''
      return `${val}%`
    },
    convertMonthToInt(val) {
      if (!val) return null;

      if (val instanceof Date) {
        const month = ("0" + (val.getMonth() + 1)).slice(-2);
        const year = val.getFullYear();
        return parseInt(`${year}${month}`);
      }

      if (typeof val === "string" && val.includes("/")) {
        const [month, year] = val.split("/");
        return parseInt(`${year}${month.padStart(2, "0")}`);
      }

      return null;
    },
    onClickUpdateNewManagementBSC() {
      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn dữ liệu cập nhật kết quả!')
        return
      }

      if (dsSlected.length > 1) {
        this.$toast.error('Vui lòng chỉ chọn 1 chỉ số BSC để cập nhật kết quả!')
        return
      }
      this.bsc_name_request = dsSlected[0]?.name
      this.bsc_type_request = dsSlected[0]?.bsc_type
      this.isAddNew = false
      this.arrIdselected = dsSlected.map(x => x.bsc_library_id)
      // this.$refs.updateResultBSCModal.showModal()
      this.$nextTick(() => {
        this.$refs.updateResultBSCModal.showModal();
      });
    },
    successAddUpdate(value) {
      // if (this.bsc_type_selected == 1) {
      //   this.bsc_personal_selected = value
      // }
      this.SearchText()
    },
    async loadPage() {
      let data = await API.GetJobWorkPositionAndDepartmentTTKDGP(this)
      if (data) {
        var result = JSON.parse(data)
        this.bsc_personal_list = result.positions
        if (this.bsc_personal_list.length > 0) {
          this.bsc_personal_selected = this.bsc_personal_list[0].job_work_position_id
        }
      }
      this.initDataGrid()
    },
    async initDataGrid() {
      let numMonth = Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
      let request = {
        department_id: this.deparment_selected != null ? this.deparment_selected : 0,
        work_position_id: this.bsc_personal_selected != null ? this.bsc_personal_selected : 0,
        period: numMonth
      }

      this.dataSources = []
      this.columns = []
      let data = await API.GetUpdateResultBSCList(this, request)
      if (data) {
        data = JSON.parse(data)
        this.$nextTick(() => {
          this.columns = data.columns
          this.dataSources = data.data
        })
      }
    },
    SearchText() {
      this.initDataGrid()
    },
  },
  async mounted() {

    await this.loadAccountInfo();
    // if(this.infoAccountLogin?.department_id){
    //   await getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
    // }
    await this.loadDepartments();
        this.loadPage()
    // await this.SearchText()
    this.isStaff = this.infoAccountLogin?.jobposition_id == this.NhanVienJobPositionId
    const loginDeptId = this.infoAccountLogin?.department_id;
    const loginUserId = this.infoAccountLogin?.user_id;
    if (loginDeptId) {
      this.deparment_selected = loginDeptId;
      // await this.loadUsersByDepartment();

      if (loginUserId && this.userList.some(u => u.id === loginUserId)) {
        this.user_selected = loginUserId;
        await this.SearchText();
      }
    }
  },
  beforeUnmount() {

  },
  watch: {

  }
}
</script>
<style>
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
</style>