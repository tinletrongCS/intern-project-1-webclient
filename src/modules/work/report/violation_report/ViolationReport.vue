<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content presale-book-monthly-report" style="top: 46px !important; bottom: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold">Phòng ban</div>
              <div class="value">
                <select2 v-model="department_selected" :options="unit_list" @select="onChangeDepartment" />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold">Nhóm</div>
              <div class="value">
                <select2 v-model="group_selected" :options="group_list" @select="onChangeGroup" />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold">Tháng</div>
              <div class="value">
                <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                  :enabled="true" :depth="'Year'" :showClearButton="false" v-model="month" :allowEdit="false"
                  @change="onChangeFromMonth($event)" />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12" style="padding-top: 26px !important;">
            <button class="btn btn-second" @click="onSearch" style="min-width: 100px;">
              <span class="icon one-search"></span>Tìm kiếm
            </button>
          </div>

        </div>

      </div>
      <div class="box-form">
        <div class="info-row" v-if="hasButtonPermission('exportExcelViolationReport')">
          <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
            <button class="btn btn-second" style="min-width: 100px;" @click="clickExportViolationReport">
              <span class="icon fa fa-file-excel-o"></span>&nbsp;Xuất Excel
            </button>&nbsp;
          </div>
        </div>
        <div class="info-row">
          <div class="value bold">
            DANH SÁCH THỐNG KÊ VI PHẠM THÁNG {{ month }}
          </div>
          <div>

          </div>
        </div>

        <KDataGrid ref="gridDs" v-show="isShowGrid" :columns="columns" :dataSource="dataSources"
          :enable-paging-server="false" :allowPaging="true" :showFilter="true" :showColumnCheckbox="false"
          :enabledSelectFirstRow="false" :showSTT="true" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />

      </div>

    </div>

  </div>
</template>
<script>
import API from './API'
import moment from 'moment'
import * as XLSX from 'xlsx-js-style'

// const DEFAULT_ALL_DEPARTMENT_ID = import.meta.env.MODE === 'production' ? 14 : 106
const DEFAULT_ALL_DEPARTMENT_ID = 0

export default {
  name: 'ViolationReport',
  components: {

  },
  data() {
    return {
      header: {
        title: "Báo cáo tổng hợp thống kê vi phạm theo tháng ",
        list: [
        ],
      },
      month: moment(new Date()).format('MM/YYYY'),
      user_selected: 0,
      user_list: [
        {
          id: 0,
          text: 'Tất cả'
        }
      ],
      unit_list: [
        {
          id: DEFAULT_ALL_DEPARTMENT_ID,
          text: 'Tất cả'
        }
      ],
      group_list: [
        {
          id: 0,
          text: 'Tất cả'
        }
      ],
      group_selected: 0,
      department_selected: DEFAULT_ALL_DEPARTMENT_ID,
      columns: [
        {
          fieldName: 'department',
          headerText: 'Phòng ban',
          allowFiltering: true,
          width: '160'
        },
        {
          fieldName: 'assignee_name',
          headerText: 'Nhân sự',
          allowFiltering: true,
          width: '160'
        },
        {
          fieldName: 'assignee_account',
          headerText: 'Tài khoản',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'task_code',
          headerText: 'Mã công việc',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'task_name',
          headerText: 'Tên công việc',
          allowFiltering: true,
          width: '220'
        },
        {
          fieldName: 'priority_level',
          headerText: 'Mức độ',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'status_task',
          headerText: 'Trạng thái',
          allowFiltering: true,
          width: '200'
        },
        {
          fieldName: 'plan_start_date',
          headerText: 'Ngày bắt đầu KH',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'plan_end_date',
          headerText: 'Ngày kết thúc KH',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'actual_start_date',
          headerText: 'Ngày bắt đầu TH',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'actual_end_date',
          headerText: 'Ngày kết thúc TH',
          allowFiltering: true,
          width: '140'
        },
        {
          fieldName: 'planned_hours',
          headerText: 'Giờ KH',
          allowFiltering: true,
          textAlign: 'right',
          width: '120'
        },
        {
          fieldName: 'actual_hours',
          headerText: 'Giờ TH',
          allowFiltering: true,
          textAlign: 'right',
          width: '120'
        },
        {
          fieldName: 'evaluation',
          headerText: 'Đánh giá',
          allowFiltering: true,
          width: '120'
        },
        {
          fieldName: 'status',
          headerText: 'Mã trạng thái',
          allowFiltering: true,
          width: '120'
        }
      ],
      dataSources: [],
      bsc_columns: [
        "phongban",
        "username",
        "full_name",

        "tongthoigian_giao",
        "tongthoigian_th",

        "hieu_suat",
        "hieu_suat_bsc",

        "tongdiem_dm",
        "tongdiem_clcvht",

        "chat_luong",
        "chatluong_cv_bsc",

        "tong_task",
        "sl_task_bth",
        "sl_task_qt",
        "sl_task_rat_qt",

        "bth_trehan",
        "qtrong_trehan",
        "ratqtrong_trehan",

        "bth_dunghan",
        "qtrong_dunghan",
        "ratqtrong_dunghan",

        "bth_somhan",
        "qtrong_somhan",
        "ratqtrong_somhan",

        "kqth_bth",
        "kqth_qt",
        "kqth_rqt",

        "tiendo",
        "tiendo_bsc",
        "bsc_tong"
      ]

    }
  },
  computed: {
    isShowGrid() {
      return this.columns.length > 0
    }
  },
  methods: {

    async loadPage() {
      const deptTree = await API.GetUnitByParentId(null, 3)

      const unitOptions = (deptTree || []).map(x => ({
        id: x.department_id,
        text: x.name
      }))

      this.unit_list = [
        { id: DEFAULT_ALL_DEPARTMENT_ID, text: 'Tất cả' },
        ...unitOptions
      ]

      this.department_selected = DEFAULT_ALL_DEPARTMENT_ID

      await this.loadGroupsByDepartment()
      await this.loadUsersByDepartment()
      this.loadDataReport()
    },

    async loadGroupsByDepartment() {
      // this.group_selected = DEFAULT_ALL_GROUP_ID ?? 0 // nếu bạn có hằng số, không thì dùng 0
      // this.group_list = [
      //   { id: (DEFAULT_ALL_GROUP_ID ?? 0), text: 'Tất cả' }
      // ]

      // Nếu chọn "Tất cả" thì thường không load nhóm con
      // (tuỳ nghiệp vụ, nếu bạn muốn vẫn load thì bỏ đoạn if này)
      // if (!this.department_selected || this.department_selected === DEFAULT_ALL_DEPARTMENT_ID) {
      //   return
      // }

      // Backend C# đang deserialize List<int> => truyền JSON array: [id]
      const arrParentId = encodeURIComponent(JSON.stringify([Number(this.department_selected)]))

      const groups = await API.GetUnitByParentId(arrParentId, 4)
      const groupOptions = (groups || []).map(x => ({
        id: x.department_id,
        text: x.name
      }))

      this.group_list = this.group_list.concat(groupOptions)
    },

    async loadUsersByDepartment() {
      this.user_selected = 0
      this.user_list = [
        {
          id: 0,
          text: 'Tất cả'
        }
      ]
      const result = await API.GetUsersByDepartment(this, this.department_selected)
      this.user_list = this.user_list.concat(result || [])
    },

    async clickExportViolationReport() {
      if (!this.hasButtonPermission('exportExcelViolationReport')) {
        this.$toast.error('Bạn không có quyền thực hiện chức năng này.');
        return;
      }

      let period = Number(moment(this.month, 'MM/YYYY').format('YYYYMM'));
      const columns = this.columns;
      const data = this.dataSources;
      if (!columns || columns.length == 0) return;

      // Tạo header Excel từ headerText trong columns
      const headerDisplay = columns.map(c => c.headerText);

      // Tạo mapping key theo fieldName
      const headerKeys = columns.map(c => c.fieldName);

      // Build data Excel
      const excelData = [
        headerDisplay,
        ...data.map(row => headerKeys.map(key => row[key]))
      ];

      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // STYLE HEADER
      headerDisplay.forEach((col, index) => {
        const cell = ws[XLSX.utils.encode_cell({ r: 0, c: index })];
        cell.s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          fill: { fgColor: { rgb: "D9E1F2" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      });

      // Auto width
      ws["!cols"] = headerDisplay.map(() => ({ wpx: 160 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Vi phạm tháng ${this.month.replace('/', '-')}`);
      XLSX.writeFile(wb, `baocao_vipham_${period}.xlsx`);
    },
    onSearch() {
      this.loadDataReport()
    },
    async loadDataReport() {
      const period = Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
      this.dataSources = []
      const phongBan =
        this.group_selected && Number(this.group_selected) !== 0
          ? Number(this.group_selected)
          : (this.department_selected ? Number(this.department_selected) : 0);

      const result = await API.GetViolationReportMonth(this, {
        period: period,
        phongBan: phongBan
      })
      if (result) {
        let parsed = result
        try {
          parsed = typeof result === 'string' ? JSON.parse(result) : result
        } catch (err) {
          // Giữ parsed là result nếu parse lỗi
        }

        const rows = Array.isArray(parsed?.data) ? parsed.data : []
        const cols = Array.isArray(parsed?.columns) ? parsed.columns : []

        this.$nextTick(() => {
          this.columns = cols.length ? cols : this.columns
          this.dataSources = rows
        })
      }
    },
    onChangeFromMonth(event) {
      if (event && event.value) {
        this.month = moment(event.value).format('MM/YYYY');
        this.loadDataReport(true)
      }
    },
    onChangeDepartment() {
      // this.loadUsersByDepartment()
      this.group_selected = 0;
      this.group_list = [
        {
          id: 0,
          text: 'Tất cả'
        }
      ]
      this.loadGroupsByDepartment()
      this.loadDataReport()
    },
    onChangeGroup(){
      this.loadDataReport()
    },
    onChangeUser() {
      // Chỉ lọc khi người dùng bấm tìm kiếm
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadPage()
      this.GetPermissionButtons()
    }, 200)
  }
}
</script>
<style>
.presale-book-monthly-report .info-row {
  display: table;
  width: 100%;
  table-layout: fixed;
  /* Bắt buộc table-cell tuân theo width */
}

.presale-book-monthly-report .info-row .key {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  display: table-caption;
  /*Cho lên dòng trên*/
}

.presale-book-monthly-report .info-row .value {
  display: table-cell;
  vertical-align: middle;
  overflow: hidden;
  /* quan trọng */
  width: auto;
  padding-left: 0px !important;
}

.presale-book-monthly-report .info-row .value .select2-container {
  width: 100% !important;
}

.presale-book-monthly-report.info-row .value .select2-selection {
  width: 100% !important;
  overflow: hidden !important;
}

.presale-book-monthly-report .info-row .value .select2-selection__rendered {
  display: block !important;
  width: 100% !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.presale-book-monthly-report .col-button-search {
  padding-top: 26px !important;
}

@media (min-width: 576px) and (max-width: 768px) {
  .presale-book-monthly-report .col-button-search {
    padding-top: 29px !important;
  }
}
</style>
