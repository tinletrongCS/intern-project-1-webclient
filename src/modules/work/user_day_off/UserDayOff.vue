<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important">
      <div class="box-form">
        <div class="col-sm-2 col-12">
          <div class="info-row">
            <div class="key w80 bold">Tháng</div>
            <div class="value">
              <div class="input-icon-right" style="min-width: 120px; max-width: 120px;">
                <ejs-datepicker v-model="thang_nam" format="MM/yyyy" :showClearButton="false" :allowEdit="true"
                  :strict-mode="true" locale="vi" @change="changeThangNam" :firstDayOfWeek="1" start="Year"
                  depth="Year" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-form">
        <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx"
          style="display: none" class="form-control" />
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="group-buttons -bottom">
                <button class="btn btn-second" style="min-width: 100px" @click.prevent="updateUserDayOff()">
                  <span class="icon one-edit"></span>&nbsp;Cập nhật</button>&nbsp;
                <!-- <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteUserDayOff()">
                  <span class="icon one-trash"></span>&nbsp;Xóa
                </button>&nbsp; -->
                <button class="btn btn-second" style="min-width: 100px" @click.prevent="exportExcel()">
                  <span class="icon fa fa-file-excel-o"></span>&nbsp;Xuất file mẫu</button>&nbsp;

                <button class="btn btn-second" style="min-width: 100px" @click.prevent="importExcel()">
                  <span class="icon fa fa-upload"></span>&nbsp;Tải Excel</button>&nbsp;
              </div>
            </div>
          </div>
        </div>

        <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="false" :enabledSelectFirstRow="false"
          :showSTT="true" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>
    </div>
    <!-- Modal -->
    <UserDayOffDetailModal ref="UserDayOffDetailModal" :isAdd="isAddNew" :isViewDetail="isViewDetail"
      :data="rowSelected" @successUpdate="successUpdate" />

    <UserDayOffCheckImportModal ref="UserDayOffCheckImportModal" :dataCheckImports="dataCheckImports"
      :thang_nam_modal="thang_nam" @successImportData="successImportData" />
  </div>
</template>

<script>
import moment from 'moment'
import API from './API'
import * as XLSX from 'xlsx-js-style';
import UserDayOffDetailModal from './UserDayOffDetailModal.vue'
import UserDayOffCheckImportModal from './UserDayOffCheckImportModal.vue'
export default {
  components: {
    UserDayOffDetailModal,
    UserDayOffCheckImportModal
  },
  data() {
    return {
      header: {
        title: "Quản lý ngày công chuẩn",
        list: [
        ],
      },
      thang_nam: moment().format('MM/YYYY'),
      columns: [
        {
          fieldName: 'code',
          headerText: 'Mã nhân viên',
          allowFiltering: true,
        },
        {
          fieldName: 'full_name',
          headerText: 'Họ và tên',
          allowFiltering: true,
        },
        {
          fieldName: 'department_name',
          headerText: 'Bộ phận',
          allowFiltering: true,
        },
        {
          fieldName: 'total_paid_days',
          headerText: 'Ngày công chuẩn',
          allowFiltering: true
        },
        {
          fieldName: 'day_off_count',
          headerText: 'Ngày công thực tế',
          allowFiltering: true
        },
        {
          fieldName: 'email',
          headerText: 'Email',
          allowFiltering: true
        },
      ],
      dataSources: [],
      dataCheckImports: [],
      rowSelected: {},
      EXPECTED_HEADERS: [
        "STT",
        "Phòng ban",
        "Nhóm",
        "Mã nhân viên",
        "Nhân viên",
        "Ngày công chuẩn",
        "Ngày công thực tế"
      ]

    }
  },
  mounted() {
    setTimeout(() => {
      this.initDataGrid()
    }, 200)
  },
  methods: {
    updateUserDayOff() {

      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      if (dsSlected.length > 1) {
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }

      this.rowSelected = dsSlected[0]
      this.$refs.UserDayOffDetailModal.showModal()
    },
    async deleteUserDayOff() {
      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      if (dsSlected.length > 1) {
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu đang chọn?`)
      if (result == 0) return
      let day_off_id = dsSlected.map(x => x.day_off_id)
      console.log(day_off_id)
      let data = await API.DeleteUserDayOff(this, day_off_id)
      if (data == '1') {
        this.$toast.success('Xóa thành công!')
        this.initDataGrid()
      } else {
        this.$toast.error(data)
      }
    },
    changeThangNam(event) {
      this.thang_nam = moment(event.value).format('MM/YYYY')
      this.initDataGrid()
    },
    successImportData() {
      this.initDataGrid()
    },
    successUpdate() {
      this.initDataGrid()
    },
    async initDataGrid() {
      var data = await API.GetUserDayOff(this, this.thang_nam)
      if (data && data != '') {
        this.dataSources = data.data
        console.log('initDataGrid', this.dataSources)
      } else {
        this.dataSources = []
      }
    },
    importExcel() {
      this.$refs.fileInput.value = null
      document.getElementById("file").click()
    },
    onChangeFile(event) {
      this.file = event.target.files[0]
      this.readFileExcel()
    },
    readFileExcel() {
      this.danhsach_excel = [];
      try {
        this.loading(true);
        if (!this.checkfile()) return;

        const reader = new FileReader();

        reader.onload = async (e) => {
          const wb = XLSX.read(e.target.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];

          // Đọc từ dòng 1 (header) -> range: 0
          const data = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            range: 0,
            defval: ""       // cell trống trả về ""
          });

          if (!data || data.length === 0) {
            this.$toast.error("File rỗng hoặc không đọc được dữ liệu.");
            return;
          }

          const columns = data[0];
          if (!this.kiemTraDuLieu(columns)) return;

          let isError = false;

          // i = 1 => dòng Excel số 2
          for (let i = 1; i < data.length; i++) {
            const row = data[i] || [];

            // ==== Mapping theo file mẫu mới ====
            const stt = row[0]?.toString().trim() || null;           // STT (không bắt buộc)
            const department_name = row[1]?.toString().trim() || null;
            const group_name = row[2]?.toString().trim() || null;
            const user_code = row[3]?.toString().trim() || null;     // Mã nhân viên
            const user_name = row[4]?.toString().trim() || null;

            const total_paid_days = this.parseExcelNumber(row[5]);   // Ngày công chuẩn
            const actual_work_days = this.parseExcelNumber(row[6]);  // Ngày công thực tế

            // Dòng trống => kết thúc (chỉ cần check mã NV là đủ)
            if (!user_code && (total_paid_days === null) && (actual_work_days === null)) {
              break;
            }

            const excelRowNumber = i + 1; // vì header là dòng 1

            // ==== Validate tối thiểu ====
            if (!user_code) {
              this.$toast.error(`Dòng ${excelRowNumber}: thiếu "Mã nhân viên"`);
              isError = true; break;
            }

            if (total_paid_days === null) {
              this.$toast.error(`Dòng ${excelRowNumber}: "Ngày công chuẩn" phải là số`);
              isError = true; break;
            }

            if (actual_work_days === null) {
              this.$toast.error(`Dòng ${excelRowNumber}: "Ngày công thực tế" phải là số`);
              isError = true; break;
            }

            // ==== Push object gửi API (bạn giữ field nào BE cần) ====
            this.danhsach_excel.push({
              user_code,
              total_paid_days,     // ngày công chuẩn
              actual_work_days,    // ngày công thực tế
              // (tuỳ chọn) nếu BE cần để hiển thị đối chiếu:
              department_name,
              group_name,
              user_name,
              stt
            });
          }

          if (this.danhsach_excel.length > 0 && !isError) {
            console.log("✅ Dữ liệu gửi API:", this.danhsach_excel);
            this.docfile_import_excel(this.danhsach_excel);
          } else if (!isError) {
            this.$toast.error("Không có dữ liệu để import.");
          }
        };

        reader.readAsBinaryString(this.file);
      } catch (error) {
        this.$toast.error("Có lỗi xảy ra khi đọc file");
      } finally {
        this.loading(false);
      }
    }
    ,
    async docfile_import_excel(data) {
      let result = await API.CheckImportData(this, data, this.thang_nam)
      console.log('docfile_import_excel', result)
      if (Array.isArray(result)) {
        this.dataCheckImports = result
        this.$refs.UserDayOffCheckImportModal.showModal()
      } else {
        this.$msgBox.error("Thông báo", result)
      }
    },
    checkfile: function () {
      if (this.file == null) {
        this.$toast.error('Chưa chọn file excel')
        return false
      }
      if (this.file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.$toast.error('File upload không đúng định dạng')
        return false
      }
      return true
    },
    kiemTraDuLieu(columns) {
      if (!columns || columns.length < this.EXPECTED_HEADERS.length) {
        this.$toast.error("File không đúng định dạng (thiếu cột). Vui lòng dùng file mẫu.");
        return false;
      }

      for (let i = 0; i < this.EXPECTED_HEADERS.length; i++) {
        const col = (columns[i] ?? "").toString().trim();
        if (col !== this.EXPECTED_HEADERS[i]) {
          this.$toast.error(`Sai cột tại vị trí ${i + 1}. Mong đợi: "${this.EXPECTED_HEADERS[i]}", nhận: "${col}"`);
          return false;
        }
      }
      return true;
    }
    ,

    exportExcel() {
      const headerDisplay = [
        "STT",
        "Phòng ban",
        "Nhóm",
        "Mã nhân viên",
        "Nhân viên",
        "Ngày công chuẩn",
        "Ngày công thực tế"
      ];

      // Chỉ xuất header (không xuất dữ liệu)
      const excelData = [headerDisplay];

      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Style header
      headerDisplay.forEach((_, index) => {
        const cellAddr = XLSX.utils.encode_cell({ r: 0, c: index });
        const cell = ws[cellAddr];
        if (!cell) return;

        cell.s = {
          font: { bold: true },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
          },
          fill: { fgColor: { rgb: "BAE7FF" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      });

      ws["!cols"] = [
        { wpx: 60 },
        { wpx: 200 },
        { wpx: 200 },
        { wpx: 120 },
        { wpx: 180 },
        { wpx: 180 },
        { wpx: 140 },
        { wpx: 160 }
      ];

      // (Tuỳ chọn) Freeze hàng header để cuộn xuống vẫn thấy tiêu đề
      ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" };

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Quản lý ngày công chuẩn");

      XLSX.writeFile(wb, "Danh_sach_ngay_cong_chuan_nhan_vien.xlsx");
    },

    parseExcelNumber(val) {
      if (val === null || val === undefined || val === "") return null;

      // Nếu cell là number thì dùng luôn
      if (typeof val === "number") return val;

      // Chuẩn hoá chuỗi
      let s = val.toString().trim();

      // bỏ khoảng trắng
      s = s.replace(/\s+/g, "");

      // xử lý phân cách hàng nghìn/dấu phẩy thập phân kiểu VN
      // Ví dụ: "1.234,5" -> "1234.5"
      if (s.includes(",") && s.includes(".")) {
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        // nếu chỉ có "," thì coi như dấu thập phân
        s = s.replace(",", ".");
      }

      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    }


  }
}
</script>
<style src="./UserDayOff.css" scoped></style>