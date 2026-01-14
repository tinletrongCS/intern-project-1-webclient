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
                <select2 v-model='user_selected' :options="userList" @select="loadEmployeeBSC" :disabled="isStaff" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80">Tháng</div>
              <div class="value">
                <ejs-datepicker v-model="tu_thang" format="MM/yyyy" :showClearButton="false" :allowEdit="true"
                  :strict-mode="true" locale="vi" :firstDayOfWeek="1" start="Year" depth="Year"
                  @change="loadEmployeeBSC" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <button class="btn btn-second" style="min-width: 100px;" @click="loadEmployeeBSC">
              <span class="icon one-search"></span>Tìm kiếm
            </button>
          </div>
        </div>

      </div>
      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="value bold">
                Danh sách thông tin BSC
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-6">
            Tổng tỷ trọng: {{ totalRatio }}
          </div>
        </div>
        <KDataGrid ref="gridDs" :columns="columns" :dataSource="bscList" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="false" :enabledSelectFirstRow="false"
          :showSTT="false" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>
    </div>
  </div>
</template>
<script>
import API from './BSCAssignUserApi'
import moment from 'moment';
export default {
  name: 'BSCAssignUser',
  components: {

  },
  data() {
    return {
      header: {
        title: "Giao chỉ số BSC cá nhân",
        list: [
        ],
      },
      columns: [
        {
          fieldName: 'code',
          headerText: 'Mã chỉ số',
          allowFiltering: true,
          width: '100'
        },
        {
          fieldName: 'name',
          headerText: 'Tên chỉ số',
          allowFiltering: true
        },
        {
          fieldName: 'assign_target',
          headerText: 'Chỉ tiêu giao',
          allowFiltering: true
        },
        {
          fieldName: 'formula',
          headerText: 'Công thức đánh giá',
          allowFiltering: true,
          disableHtmlEncode: false
        },
        {
          fieldName: 'weight',
          headerText: 'Tỷ trọng',
          allowFiltering: true,
          valueAccessor: (field, data) => this.formatWeight(field, data)
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
      NhanVienJobPositionId: 10,
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

      // const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
      const month = this.convertMonthToInt(this.tu_thang);
      this.requestMonth = month;

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
  },
  async mounted() {
    await this.loadAccountInfo();
    // if(this.infoAccountLogin?.department_id){
    //   await getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
    // }
    await this.loadDepartments();
    this.isStaff = this.infoAccountLogin?.jobposition_id == this.NhanVienJobPositionId
    const loginDeptId = this.infoAccountLogin?.department_id;
    const loginUserId = this.infoAccountLogin?.user_id;
    if (loginDeptId) {
      this.deparment_selected = loginDeptId;
      await this.loadUsersByDepartment();

      if (loginUserId && this.userList.some(u => u.id === loginUserId)) {
        this.user_selected = loginUserId;
        await this.loadEmployeeBSC();
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