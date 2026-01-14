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
                <select2 
                  v-model="departmentId"
                  :options="unit_list"
                  @select="onSearch"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w80">Người nhận</div>
              <div class="value">
                <select2 
                  v-model.number="assigneeId"
                  :options="person_list"
                  @select="onSearch"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold w70">Từ ngày</div>
              <div class="value">
                <ejs-datepicker
                      v-model="from_date"
                      format='dd/MM/yyyy'
                      :showClearButton='false'
                      :allowEdit="false"
                      locale="vi"
                      @change="changeFromDate"
                      :firstDayOfWeek="1"
                  />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold w70">Đến ngày</div>
              <div class="value">
                <ejs-datepicker
                      v-model="to_date"
                      format='dd/MM/yyyy'
                      :showClearButton='false'
                      :allowEdit="false"
                      locale="vi"
                      @change="changeToDate"
                      :firstDayOfWeek="1"
                  />
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
        <KDataGrid
          ref="starReportGrid"
          :columns="visibleColumns"
          :dataSource="dataSource"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="true"
          :allowSorting="true"
          :showColumnCheckbox="false"
          :enabledSelectFirstRow="false"
          :allowTextWrap="true"
          :showSTT="true"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ReportAPI from '../IndividualWorkReportAPI.js'
export default {
  name: 'StarIndividualTaskReport',
  data() {
    return {
      header: {
        title: "Báo cáo các task 1-2 sao của cá nhân",
        list: []
      },
      departmentId: 0,
      assigneeId: 0,
      from_date:moment().startOf('month').format('DD/MM/YYYY'),
      to_date:moment().format('DD/MM/YYYY'),
      unit_list: [
        { id: 0, text: 'Tất cả' }
      ],
      person_list: [
        { id: 0, text: 'Tất cả' }
      ],
      columns: [
        //Đơn vị giao, bảng công việc, mức độ công việc
        { fieldName: 'taskCode', headerText: 'Mã Task', width: 120, allowSorting: true },
        { fieldName: 'taskName', headerText: 'Tên công việc', width: 220, allowSorting: true },
        { fieldName: 'workload', headerText: 'Khối lượng giao', width: 140, type: 'number', textAlign: 'Center', allowSorting: true },
        { fieldName: 'startDate', headerText: 'Ngày bắt đầu', width: 130, allowSorting: true },
        { fieldName: 'endDate', headerText: 'Ngày kết thúc', width: 130, allowSorting: true },
        { fieldName: 'rating', headerText: 'Rating', width: 100, type: 'number', textAlign: 'Center', allowSorting: true },
        { fieldName: 'reviewDate', headerText: 'Ngày đánh giá', width: 130, allowSorting: true },
        { fieldName: 'boardName', headerText: 'Bảng công việc', width: 180, allowSorting: true },
        { fieldName: 'taskPriority', headerText: 'Mức độ công việc', width: 140, allowSorting: true, textAlign: 'Center' },
        { fieldName: 'assignerName', headerText: 'Người giao', width: 160, allowSorting: true },
        { fieldName: 'assignUnit', headerText: 'Đơn vị giao', width: 180, allowSorting: true },
        { fieldName: 'assigneeName', headerText: 'Người nhận', width: 160, allowSorting: true }
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
    loading(show) {
      this.$root.showLoading(show)
    },
    onSearch(){
      this.loadData()
    },
    async loadInitialData() {
      this.loading(true);
      try {
        const unitsResult = await ReportAPI.GetMyDepartmentTree(this);
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
    async loadData(){
      this.loading(true);
      try {
        const params = {
          departmentId: this.departmentId,
          assigneeIDs: this.assigneeId === 0 ? JSON.stringify([]) : JSON.stringify([this.assigneeId]),
          fromDate: moment(this.from_date,'DD/MM/YYYY').format('YYYY-MM-DD'),
          toDate: moment(this.to_date,'DD/MM/YYYY').format('YYYY-MM-DD')
        };
        const result = await ReportAPI.SearchOneTwoStarTasks(this, params);
        // API trả về trực tiếp mảng dữ liệu
        this.dataSource = result;
      } catch (error) {
        this.dataSource = [];
        this.$toast.error('Có lỗi xảy ra khi tải dữ liệu báo cáo 1-2 sao.');
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
