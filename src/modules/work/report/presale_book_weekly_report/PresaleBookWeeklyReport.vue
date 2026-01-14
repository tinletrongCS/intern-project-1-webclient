<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />

    <div class="page-content presale-book-monthly-report" style="top: 46px !important; bottom: 46px !important;">
      <!-- ================= FILTER ================= -->
      <div class="box-form">
        <div class="row filter-row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key">Phòng ban</div>
              <div class="value">
                <select2 v-model="departmentSelected" :options="departmentOptions" @select="onChangeDepartment" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key">Nhân sự</div>
              <div class="value">
                <select2 v-model="userSelected" :options="userOptions" @select="onChangeUser" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key">Từ ngày</div>
              <div class="value">
                <ejs-datepicker class="date-picker" v-model="fromDate" format="dd/MM/yyyy" :max="maxDate"
                  :allowEdit="false" :showClearButton="false" :firstDayOfWeek="1" @change="onChangeFromDate" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key">Đến ngày</div>
              <div class="value">
                <ejs-datepicker class="date-picker" v-model="toDate" format="dd/MM/yyyy" :max="maxDate"
                  :allowEdit="false" :showClearButton="false" :firstDayOfWeek="1" @change="onChangeToDate" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-6">
            <div class="info-row info-row-button">
              <div class="key">&nbsp;</div>
              <div class="value">
                <button class="btn btn-second w-100" @click="onSearch">
                  <span class="icon one-search"></span>Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= GRID ================= -->
      <div class="box-form grid-wrapper">
        <div class="export-btn" v-if="hasButtonPermission('exportExcelBookPsWeekly')">
          <button class="btn btn-second" @click="clickExportReportBookPs">
            <span class="icon fa fa-file-excel-o"></span>&nbsp;Xuất Excel
          </button>
        </div>

        <div class="info-row">
          <div class="value bold">
            DANH SÁCH TỔNG HỢP DỮ LIỆU BOOK PS
            ({{ formatDate(fromDate) }} - {{ formatDate(toDate) }})
          </div>
        </div>
 
        <div class="grid-scroll-wrapper">
          <KDataGrid v-show="summaryColumns.length" :key="gridKey" :columns="summaryColumns" :dataSource="summaryData"
            :enable-paging-server="false" :allowPaging="true" :pageSettings="{
              pageSize: 10,
              pageCount: 5,
              pageSizes: [10, 20, 50, 100]
            }" :showFilter="true" :showSTT="true" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "./API";
import moment from "moment";
import * as XLSX from "xlsx-js-style";

export default {
  name: "PresaleBookWeeklyReport",

  data() {
    return {
      header: { title: "Báo cáo Book PS theo tuần", list: [] },

      fromDate: moment().startOf("month").toDate(),
      toDate: moment().toDate(),
      maxDate: new Date(),

      departmentSelected: 0,
      departmentOptions: [{ id: 0, text: "Tất cả" }],

      userSelected: 0,
      userOptions: [{ id: 0, text: "Tất cả" }],

      summaryColumns: [],
      summaryData: [],
      gridKey: 0,
    };
  },

  methods: {
    formatDate(d) {
      return d ? moment(d).format("DD/MM/YYYY") : "";
    },

    async clickExportReportBookPs() {
      if (!this.hasButtonPermission("exportExcelBookPsWeekly")) {
        this.$toast.error("Bạn không có quyền thực hiện chức năng này.");
        return;
      }

      // Excel sheet names: max 31 chars, cannot contain : \ / ? * [ ]
      function sanitizeSheetName(name) {
        if (!name) return "Sheet1";

        return name
          .replace(/[\\/:*?\[\]]/g, "-")  
          .substring(0, 31);              
      }

      const buildSheet = (cols, rows) => {
        const headerDisplay = cols.map((c) => c.headerText);
        const headerKeys = cols.map((c) => c.fieldName);

        const excelData = [
          headerDisplay,
          ...rows.map((row) => headerKeys.map((key) => row[key])),
        ];

        const ws = XLSX.utils.aoa_to_sheet(excelData);

        headerDisplay.forEach((_, index) => {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c: index })];
          if (cell) {
            cell.s = {
              font: { bold: true },
              alignment: { horizontal: "center", vertical: "center", wrapText: true },
              fill: { fgColor: { rgb: "D9E1F2" } },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
            };
          }
        });

        ws["!cols"] = headerDisplay.map(() => ({ wpx: 160 }));
        return ws;
      };

      const payload = {
        fromDate: Number(moment(this.fromDate).format("YYYYMMDD")),
        toDate: Number(moment(this.toDate).format("YYYYMMDD")),
        phongBan: this.departmentSelected || 0,
        assigneeId: this.userSelected || 0,
      };

      let result = await API.GetBookPsReportRange(this, payload);
      if (!result) return;

      const parsed = typeof result === "string" ? JSON.parse(result) : result;
      const columns = parsed?.columns || [];
      const data = parsed?.data || [];
      const detailColumns = parsed?.detailColumns || [];
      const detailData = parsed?.detailData || [];

      if (!columns.length && !detailColumns.length) {
        this.$toast.warning("Không có dữ liệu để xuất Excel.");
        return;
      }

      const wb = XLSX.utils.book_new();
      if (columns.length) {
        const summarySheet = buildSheet(columns, data);
        const sheetName = sanitizeSheetName("Tổng hợp");
        XLSX.utils.book_append_sheet(wb, summarySheet, sheetName);
      }

      if (detailColumns.length) {
        const detailSheet = buildSheet(detailColumns, detailData);
        const sheetName = sanitizeSheetName("Chi tiết");
        XLSX.utils.book_append_sheet(wb, detailSheet, sheetName);
      }

      XLSX.writeFile(wb, `DanhSachCVBooking_Presale_${payload.fromDate}_${payload.toDate}.xlsx`);
    },

    async loadPage() {
      await this.loadDepartments();
      await this.loadUsersByDepartment();
      await this.loadDataReport();
    },

    async loadDepartments() {
      const units = (await API.GetMyDepartmentTree(this)) || [];
      this.departmentOptions = [{ id: 0, text: "Tất cả" }, ...units];
    },

    async loadUsersByDepartment() {
      this.userSelected = 0;
      const users = await API.GetUsersByDepartment(this, this.departmentSelected);
      this.userOptions = [{ id: 0, text: "Tất cả" }, ...(users || [])];
    },

    onChangeDepartment() {
      this.loadUsersByDepartment().then(this.loadDataReport);
    },

    onChangeUser() {
      this.loadDataReport();
    },

    onChangeFromDate(args) {
      if (!args?.value) return;
      this.fromDate = args.value;
      if (moment(this.toDate).isBefore(args.value)) {
        this.toDate = args.value;
      }
      this.loadDataReport();
    },

    onChangeToDate(args) {
      if (!args?.value) return;
      this.toDate = args.value;
      if (moment(args.value).isBefore(this.fromDate)) {
        this.fromDate = args.value;
      }
      this.loadDataReport();
    },

    onSearch() {
      this.loadDataReport();
    },

    async loadDataReport() {
      this.summaryColumns = [];
      this.summaryData = [];
      this.gridKey++;

      const payload = {
        fromDate: Number(moment(this.fromDate).format("YYYYMMDD")),
        toDate: Number(moment(this.toDate).format("YYYYMMDD")),
        phongBan: this.departmentSelected || 0,
        assigneeId: this.userSelected || 0,
      };

      const result = await API.GetBookPsReportRange(this, payload);
      const parsed = typeof result === "string" ? JSON.parse(result) : result;

      this.summaryColumns = parsed?.columns || [];
      this.summaryData = parsed?.data || [];
      this.gridKey++;
    },
  },

  mounted() {
    this.loadPage();
    this.GetPermissionButtons();
  },
};
</script>
<style scoped>
/* ================= FILTER ================= */
.presale-book-monthly-report .filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}

.presale-book-monthly-report .info-row {
  display: flex;
  flex-direction: column;
}

.presale-book-monthly-report .info-row .key {
  font-weight: bold;
  min-height: 32px;
}

/* ================= GRID SCROLL ================= */

/* wrapper scroll ngang */
.grid-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  position: relative;
}

/* grid chiếm đủ chiều rộng */
.grid-scroll-wrapper .e-grid {
  min-width: 1200px;
}

/* header + body dùng cùng scroll */
.presale-book-monthly-report .e-grid .e-headercontent,
.presale-book-monthly-report .e-grid .e-content {
  overflow-x: hidden !important;
}

/* HEADER AUTO HEIGHT */
.presale-book-monthly-report .e-grid .e-headercell {
  height: auto !important;
  padding: 8px 6px !important;
}

.presale-book-monthly-report .e-grid .e-headertext {
  white-space: normal !important;
  word-break: break-word !important;
  line-height: 1.4;
  text-align: center;
}

/* ================= EXPORT BUTTON ================= */

.export-btn {
  position: relative;
  z-index: 20;
  margin-bottom: 10px;
}

/* tránh grid overlay đè */
.presale-book-monthly-report .e-grid {
  position: relative;
  z-index: 1;
}

/* ================= OTHER ================= */
.date-picker {
  width: 100%;
}
</style>
