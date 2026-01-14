<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 35px !important;">
      <div class="box-form form-border-item">
        <div class="row">
          <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key bold w220">Đơn vị/Bộ phận/Nhóm sản phẩm</div>
              <div class="value">
                <select2 v-model="departmentId" :options="unit_list" @select="onSearch" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w80">Người nhận</div>
              <div class="value">
                <select2 v-model.number="assigneeId" :options="person_list" @select="onSearch" />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold w70">Tháng</div>
              <div class="value">
                <ejs-datepicker v-model="month" format='MM/yyyy' :showClearButton='false' :allowEdit="false" locale="vi"
                  @change="onSearch" :firstDayOfWeek="1" start="Year" depth="Year" />

                <!-- <ejs-datepicker v-model="month" format='MM/yyyy' :showClearButton='false' :allowEdit="false" locale="vi"
                  start="Year" depth="Year" @change="changeMonth" :firstDayOfWeek="1" /> -->
              </div>
            </div>
          </div>
          <div class="col-12">
            <div style="position: absolute; bottom: 0; right: 0;margin-bottom: 5px !important;">
              <button @click="onSearch" class="btn btn-second">
                <span class="-ap icon-search"></span> Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="box-form">
        <div class="info-row">
          <div class="group-buttons -bottom">
            <button class="btn btn-second" style="min-width: 100px;" @click="SendMail">
              <span class="icon fa fa-plus"></span>&nbsp;Gửi email
            </button>&nbsp;
            <!-- <button class="btn btn-second" style="min-width: 100px;" @click="updateNewLibraryBSC">
              <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click="deleteNewLibraryBSC">
              <span class="icon one-trash"></span>&nbsp;Xóa
            </button>&nbsp; -->
          </div>
        </div>

        <KDataGrid ref="starReportGrid" :columns="visibleColumns" :dataSource="dataSource" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :allowSorting="true" :showColumnCheckbox="true"
          :enabledSelectFirstRow="false" :allowTextWrap="true" :showSTT="true"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ReportAPI from './SendMailAmAPI.js'
export default {
  name: 'StarIndividualTaskReport',
  data() {
    return {
      header: {
        title: "Thống kê công việc tồn chưa đánh giá chất lượng của AM trong tháng",
        list: []
      },
      departmentId: 0,
      assigneeId: 0,
      month: moment().startOf('month').format('MM/YYYY'),
      to_date: moment().format('DD/MM/YYYY'),
      unit_list: [
        { id: 0, text: 'Tất cả' }
      ],
      person_list: [
        { id: 0, text: 'Tất cả' }
      ],
      columns: [
        //Đơn vị giao, bảng công việc, mức độ công việc
        { fieldName: 'fullName', headerText: 'Nhân viên', width: 120, allowSorting: true },
        { fieldName: 'unitname', headerText: 'Đơn vị', width: 200, allowSorting: true },
        { fieldName: 'boardName', headerText: 'Board', width: 160, allowSorting: true },
        { fieldName: 'taskCode', headerText: 'Mã task', width: 130, allowSorting: true },
        { fieldName: 'totalTasks', headerText: 'Số lượng task', width: 130, allowSorting: true },
        { fieldName: 'statusSendName', headerText: 'Trạng thái gửi email', width: 100, allowSorting: true }
      ],
      dataSource: []
    }
  },

  computed: {
    visibleColumns() {
      return this.columns;
    }
  },

  watch: {
    departmentId(newDepartmentId) {
      this.loadUsersForSelectedUnit(newDepartmentId);
    }
  },

  async mounted() {
    await this.loadInitialData();
  },

  methods: {
    async SendMail() {
      const dsSelected = this.$refs.starReportGrid.getSelectedRecords() || [];

      // Lấy userId từ các dòng đã chọn
      const userIds = dsSelected
        .map(x => Number(x.userId))
        .filter(x => Number.isFinite(x) && x > 0);

      if (userIds.length === 0) {
        this.$toast.warning("Bạn chưa chọn nhân viên nào (hoặc thiếu userId từ API).");
        return;
      }

      // Lấy fullName (unique) và nối bằng dấu phẩy
      const namesArr = Array.from(
        new Set(
          dsSelected
            .map(x => (x?.fullName ?? "").trim())
            .filter(Boolean)
        )
      );

      // Nếu tên quá dài thì rút gọn hiển thị
      const previewNames =
        namesArr.slice(0, 10).join(", ") +
        (namesArr.length > 10 ? `, ... (+${namesArr.length - 10})` : "");

      // Popup confirm
      const result = await this.$confirm(
        "Thông báo",
        `Bạn có muốn gửi email cho ${userIds.length} nhân viên: ${previewNames} không?`
      );
      if (result == 0) return;


      const payload = {
        month: moment(this.month, "MM/YYYY").format("MM/YYYY"),
        userIds: Array.from(new Set(userIds)), // unique userId
        forceResend: false
      };

      try {
        const res = await ReportAPI.SendRemindMailSelectedUsers(this, payload);

        // Nếu BE trả details theo userId => update lại statusSend trên grid
        // res.data.details: [{ userId, status: 'SENT'|'FAILED'|'SKIPPED', message... }]
        const details = res?.details || res?.data?.details || [];
        const map = new Map(details.map(d => [Number(d.userId), d.status]));

        this.dataSource = (this.dataSource || []).map(r => {
          const st = map.get(Number(r.userId));
          return st ? { ...r, statusSend: st } : r;
        });

        this.$toast.success("Đã gửi email cho các nhân viên đã chọn.");

        // load lại dữ liệu
        this.onSearch();
      } catch (e) {
        console.error(e);
        this.$toast.error("Gửi email thất bại.");
      }
    }
    ,
    loading(show) {
      this.$root.showLoading(show)
    },
    onSearch() {
      this.loadData()
    },
    async loadInitialData() {
      this.loading(true);
      try {
        const unitsResult = await ReportAPI.GetMyDepartmentTreeOutTTKDGP(this);
        this.unit_list = [{ id: 0, text: 'Tất cả' }, ...unitsResult];
        await this.loadUsersForSelectedUnit(0);
        await this.loadData();
      } catch (error) {
        this.$toast.error('Lỗi khi tải dữ liệu khởi tạo.');
      } finally {
        this.loading(false);
      }
    },
    async loadUsersForSelectedUnit(departmentId) {
      this.loading(true);
      this.assigneeId = 0;
      try {
        const usersResult = await ReportAPI.GetUsersByDepartment(this, departmentId);
        this.person_list = [{ id: 0, text: 'Tất cả' }, ...usersResult];
      } catch (error) {
        this.$toast.error('Lỗi khi tải danh sách người nhận.');
      } finally {
        this.loading(false);
      }
    },
    changeFromDate(event) {
      const newStart = moment(event.value);
      const end = moment(this.to_date, "DD/MM/YYYY");

      // Gán lại ngày bắt đầu
      this.from_date = newStart.format("DD/MM/YYYY");

      // Nếu ngày bắt đầu > ngày kết thúc, tự set lại ngày kết thúc = ngày bắt đầu
      if (end.isBefore(newStart)) {
        this.to_date = newStart.format("DD/MM/YYYY");
      }
    },

    changeToDate(event) {
      const newEnd = moment(event.value);
      const start = moment(this.from_date, "DD/MM/YYYY");

      // Gán lại ngày kết thúc
      this.to_date = newEnd.format("DD/MM/YYYY");

      // Nếu ngày kết thúc < ngày bắt đầu, tự set lại ngày bắt đầu = ngày kết thúc
      if (newEnd.isBefore(start)) {
        this.from_date = newEnd.format("DD/MM/YYYY");
      }
    },
    async loadData() {
      this.loading(true);
      try {
        const params = {
          departmentId: Number(this.departmentId) || 0,
          assigneeId: Number(this.assigneeId) || 0,   // ✅ 1 số, không mảng
          month: moment(this.month, "MM/YYYY").format("MM/YYYY"),
        };

        const result = await ReportAPI.GetRemindTasksForMonth(this, params);
        this.dataSource = result;
      } catch (error) {
        this.dataSource = [];
        this.$toast.error("Có lỗi xảy ra khi tải dữ liệu báo cáo 1-2 sao.");
      } finally {
        this.loading(false);
      }
    }

  }
}
</script>

<style scoped>
.w220 {
  width: 220px !important;
}
</style>
