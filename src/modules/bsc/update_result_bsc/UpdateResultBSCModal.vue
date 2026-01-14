<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupUpdateResultBSC" :showCloseIcon="true"
    width="80%" :isModal='true' :target="target" :header="header" id="update-result-bsc"
    class="add-update-management-bsc" :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <div class="row">

            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w80">Đơn vị</div>
                <div class="value">
                  <select2 v-model='deparment_selected' :options="department_list" :disabled="!isAdd" />
                </div>
              </div>
            </div>

            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w120">Vị trí công việc</div>
                <div class="value">
                  <select2 v-model='bsc_personal_selected'
                    :options="bsc_personal_list.map(e => ({ id: e.job_work_position_id, text: e.name }))"
                    :disabled="!isAdd" @select="onChangeBSCPersonal" />
                </div>
              </div>
            </div>

            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w80 bold">Tháng</div>
                <div class="value">
                  <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                    :disabled="!isAdd" :enabled="isAdd" :depth="'Year'" :showClearButton="false" v-model="from_month"
                    :allowEdit="false" @change="onChangeFromMonth($event)" />
                </div>
              </div>
            </div>
            <div class="col-sm-2 col-12">
            </div>

            <div class="col-sm-12 col-12 btn-container" v-if="bsc_type_request === 3">
              <button class="btn btn-second" style="min-width: 100px;" @click="exportExcel">
                <span class="icon one-download"></span>&nbsp;Xuất Excel
              </button>&nbsp;
              <button class="btn btn-second" style="min-width: 100px;" @click="importExcel">
                <span class="icon one-upload"></span>&nbsp;Tải Excel
              </button>
              <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx"
                style="display: none" class="form-control" />
            </div>
          </div>

          <!-- <KDataGrid ref="gridDsManagementBSC" :columns="columns" :dataSource="dataSources"
            :enable-paging-server="false" :allowPaging="false" :showFilter="false" :allowSorting="false"
            :showColumnCheckbox="isAdd" :enabledSelectFirstRow="false" :selectionSettings="{ checkboxOnly: true }" /> -->

          <div class="bsc-table-wrapper">
            <table class="bsc-table">
              <thead>
                <tr>
                  <th style="width:40px;text-align:center">
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                  </th>

                  <th>STT</th>
                  <!-- <th>Phòng ban</th>
                  <th>Nhóm</th> -->
                  <th>Mã nhân viên</th>
                  <th>Nhân viên</th>
                  <!-- <th>Vị trí công việc</th> -->
                  <th class="col-formula">Cách đo lường</th>

                  <th class="col-dyn">{{ dynamicHeaderCol1 }}</th>

                  <th class="col-dyn" v-if="showSecondDynamicCol">
                    {{ dynamicHeaderCol2 }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in dataSources" :key="row.stt + '_' + row.user_id">
                  <!-- Checkbox -->
                  <td style="text-align:center">
                    <input type="checkbox" v-model="row.selected" />
                  </td>

                  <!-- STT -->
                  <td>{{ row.stt }}</td>

                  <!-- Phòng ban -->
                  <!-- <td>{{ row.department_name }}</td> -->

                  <!-- Nhóm -->
                  <!-- <td>{{ row.group_name }}</td> -->

                  <!-- Mã NV -->
                  <td>{{ row.employee_code }}</td>

                  <!-- Nhân viên -->
                  <td>{{ row.user_name }}</td>

                  <!-- Vị trí -->
                  <!-- <td>{{ row.work_position_name }}</td> -->

                  <!-- Cách đo lường -->
                  <td class="calculation-col col-formula" @mouseenter="showTooltip($event, row.calculation_formula)" :title="row.calculation_formula"
                    @mouseleave="hideTooltip">
                    {{ row.calculation_formula }}
                  </td>

                  <!-- CỘT ĐỘNG 1 -->
                  <td class="col-dyn">
                    <!-- BSC TYPE = 3 (Doanh thu giao) -->
                    <template v-if="row.bsc_type === 3">
                      <input class="input-cell" type="text" :value="formatMoney(row.target_revenue)"
                        @input="row.target_revenue = parseMoney($event.target.value)" @keypress="allowNumberOnly" />
                    </template>

                    <!-- Các loại khác -->
                    <template v-else-if="BSC_TYPE_CONFIG[row.bsc_type]?.col1">
                      <input v-model="row[BSC_TYPE_CONFIG[row.bsc_type].col1.field]" class="input-cell" type="text"
                        @keypress="allowNumberOnly" />
                    </template>
                  </td>

                  <!-- CỘT ĐỘNG 2 -->
                  <td class="col-dyn" v-if="showSecondDynamicCol">
                    <!-- BSC TYPE = 3 (Doanh thu thực hiện) -->
                    <template v-if="row.bsc_type === 3">
                      <input class="input-cell" type="text" :value="formatMoney(row.actual_revenue)"
                        @input="row.actual_revenue = parseMoney($event.target.value)" @keypress="allowNumberOnly" />
                    </template>

                    <!-- Các loại khác -->
                    <template v-else-if="BSC_TYPE_CONFIG[row.bsc_type]?.col2">
                      <input v-model="row[BSC_TYPE_CONFIG[row.bsc_type].col2.field]" class="input-cell" type="text"
                        @keypress="allowNumberOnly" />
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
            <button @click="updateResultBSC" class="btn btn-second nocorner" style="width: 180px">
              <span class="icon one-save"></span> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import API from './UpdateResultBSCApi'
import { createApp } from "vue"
import moment from 'moment'
import * as XLSX from 'xlsx-js-style'
import { saveAs } from 'file-saver';

const app = createApp()
export default {
  name: 'UpdateResultBSCModal',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    bsc_name_request: {
      type: String,
      default: ''
    },
    bsc_type_request: {
      type: Number,
      default: 0
    },
    bsc_personal_id: {
      type: Number,
      default: 0
    },
    bsc_personal_list_request: {
      type: Array,
      default: () => []
    },
    arrIds: {
      type: Array,
      default: () => []
    },
    user_id: {
      type: Number,
      default: 0
    },
    month: {
      type: String,
      default: 0
    },
    from_month_kpi: {
      type: String,
      default: ''
    },
    department_id_request: {
      type: Number,
      default: 0
    },
    department_list_request: {
      type: Array,
      default: () => []
    },
    job_work_position_id: {
      type: Number,
      default: 0
    }
  },
  components: {

  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span>DANH SÁCH BỘ CHỈ SỐ BSC`,
      bsc_personal_selected: null,
      dataSources: [],
      selectedBsc: [],
      from_month: moment().startOf('year').format('MM/yyyy'),
      localMonth: this.month,
      columns: [],
      selectedKpis: [],
      deparment_selected: 0,
      department_list: 0,
      bsc_personal_list: [],
      selectAll: false,
      tooltip: {
        visible: false,
        text: "",
        top: 0,
        left: 0
      },
      BSC_TYPE_CONFIG: {
        1: {
          col1: { field: 'violate', label: 'Số lần vi phạm' },
          col2: null
        },
        2: {
          col1: { field: 'violate', label: 'Số lần vi phạm' },
          col2: { field: 'ratio', label: 'Tỷ lệ (%)' }
        },
        3: {
          col1: { field: 'target_revenue', label: 'Doanh thu giao' },
          col2: { field: 'actual_revenue', label: 'Doanh thu thực hiện' }
        }
      }

    }
  },
  computed: {
    header() {
      const name = this.bsc_name_request?.trim();
      const upperName = name ? name.toUpperCase() : '';

      return `
      <span class="icon one-notepad"></span>
      DANH SÁCH BỘ CHỈ SỐ BSC${upperName ? ' - ' + upperName : ''}
    `;
    },
    hasType2() {
      return this.dataSources.some(r => r.bsc_type == 2);
    },
    bscMode() {
      if (!this.dataSources || this.dataSources.length === 0) return null;

      // Ưu tiên doanh thu
      if (this.dataSources.some(r => r.bsc_type === 3)) {
        return 3;
      }

      // Có loại 2
      if (this.dataSources.some(r => r.bsc_type === 2)) {
        return 2;
      }

      // Mặc định
      return 1;
    },

    dynamicHeaderCol1() {
      switch (this.bscMode) {
        case 3:
          return 'Doanh thu giao';
        case 2:
        case 1:
        default:
          return 'Số lần vi phạm';
      }
    },

    dynamicHeaderCol2() {
      switch (this.bscMode) {
        case 3:
          return 'Doanh thu thực hiện';
        case 2:
          return 'Tỷ lệ (%)';
        case 1:
        default:
          return ''; // type 1 không cần cột 2
      }
    },

    showSecondDynamicCol() {
      return this.bscMode === 2 || this.bscMode === 3;
    }
  },
  methods: {
    showModal() {
      this.$refs["popupUpdateResultBSC"].show()
      this.$nextTick(() => {
        this.handleShowModal()
        this.bsc_personal_selected = this.job_work_position_id
        this.bsc_personal_list = this.bsc_personal_list_request

        this.deparment_selected = this.department_id_request,
          this.department_list = this.department_list_request
      })
    },
    hideModal() {
      this.$refs["popupUpdateResultBSC"].hide()
    },
    handleShowModal() {
      this.clear()
      // setTimeout(() => {
      //   this.initPopup()
      // }, 200)
      this.$nextTick(() => {
        setTimeout(() => {
          this.initPopup()
          this.from_month = this.from_month_kpi

        }, 10)
      })
    },

    async initGrid() {
      const resp = await API.GetUpdateResultBSCListUpdate(this, {
        department_id: this.department_id_request,
        work_position_id: this.job_work_position_id,
        period: this.localMonth,
        arr_assignment_kpi_id: JSON.stringify(this.arrIds)
      });

      if (!resp) return;

      const result = JSON.parse(resp);

      this.dataSources = (result.data || []).map((r, i) => ({
        ...r,
        stt: i + 1,
        selected: false
      }));
    }
    ,
    async initPopup() {
      this.bsc_personal_selected = this.job_work_position_id
      this.initGrid()
    },
    clear() {
      this.bsc_personal_selected = null
      this.dataSources = []
      this.selectedBsc = []
      this.selectedKpis = []
    },
    onChangeBSCPersonal() {
      this.initGrid()
    },
    onFieldChanged(row, field, value) {
      // cập nhật giá trị trong row
      row[field] = value;
      // tìm index trong selectedKpis dựa trên kpi_library_id
      const index = this.selectedKpis.findIndex(x => x.bsc_library_id === row.bsc_library_id);
      // nếu chưa có, thêm mới
      if (index == -1) {
        this.selectedKpis.push({
          bsc_library_id: row.bsc_library_id,
          [field]: value ?? null
        });
      } else {
        // đã có → update giá trị
        this.selectedKpis[index][field] = value ?? null;
      }
    },

    onChangeSelect(row, field, value) {
      if (field == 'cycle') {
        row.cycle = value;
        const index = this.selectedBsc.findIndex(x => x.bsc_library_id === row.bsc_library_id);
        if (index === -1) {
          this.selectedBsc.push({
            bsc_library_id: row.bsc_library_id,
            weight: row.weight ?? null,
            cycle: row.cycle ?? null
          });
        } else {
          this.selectedBsc[index].cycle = row.cycle ?? null;
        }
      }
    },
    GetColumnTemplateInput(parent, field, type, isAdd) {
      return function () {
        // Tạo tên component duy nhất tránh đè
        var GetColumnTemplateInput = app.component("GetColumnTemplateInput", {
          template: `
                <div v-if="inputType == 'text'">
                  <input type="text"
                    class="form-control text-end"
                    :value="data[field]"
                    @keypress="isNumber($event)"
                    @change="onChangeText" />
                </div>

                <div v-else-if="inputType == 'select'">
                  <select2 :z-index="2000"
                    class="select2"
                    v-model="selectValue"
                    :options="selectItems"
                    @select="onChangeSelect" />
                </div>
              `,
          data() {
            return {
              parent: parent,
              data: {},
              field: field,
              inputType: type,
              currentMonth: new Date(),
              isAdd: isAdd
            };
          },
          computed: {
            selectValue: {
              get() {
                return this.data[this.field] ?? 0;
              },
              set(value) {
                this.data[this.field] = value;
              }
            },
            selectItems() {
              // có thể custom theo field hoặc dùng chung
              if (this.field == 'cycle') {
                return [
                  { id: 0, text: 'Chọn' },
                  { id: 1, text: 'Ngày' },
                  { id: 2, text: 'Tuần' },
                  { id: 3, text: 'Tháng' },
                ];
              }
              return [];
            },
            dateValue: {
              get() {
                return this.data[this.field] || null;
              },
              set(value) {
                this.data[this.field] = value;
              }
            },
          },
          mounted() {
            // Chỉ gán giá trị mặc định cho trường kiểu date
            if (this.inputType === 'date') {
              if (!this.data[this.field]) {
                this.data[this.field] = this.currentMonth;
              }
              this.$nextTick(() => {
                this.onChangeDate({ value: this.currentMonth });
              });
            }
          },
          methods: {
            // xử lý thay đổi input text
            onChangeText(e) {
              const value = e.target.value;
              // có thể báo ngược ra parent nếu cần
              this.parent.onFieldChanged(this.data, this.field, value);
            },
            // xử lý chọn select2
            onChangeSelect(e) {
              this.parent.onChangeSelect(this.data, this.field, e.id)
            },
            isNumber(evt) {
              evt = evt || window.event;
              const charCode = evt.which || evt.keyCode;

              // Cho phép: phím số (0–9), dấu chấm (.), phím điều hướng
              if (
                charCode > 31 &&
                (charCode < 48 || charCode > 57) && // không phải 0–9
                charCode !== 46                     // không phải dấu .
              ) {
                evt.preventDefault();
              }

              // Không cho nhập quá 1 dấu chấm
              const input = evt.target.value;
              if (charCode === 46 && input.includes('.')) {
                evt.preventDefault();
              }
            }
          },
          watch: {
          }
        });

        // Trả về tên component để Grid render
        return { template: GetColumnTemplateInput };
      };
    },
    async updateManagementBSC() {
      let dsSlected = this.$refs.gridDsManagementBSC.getCurrentViewRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Không có dữ liệu điều chỉnh!')
        return
      }
      dsSlected = dsSlected.map(item => {
        const found = this.selectedBsc.find(x => x.bsc_assign_user_id === item.bsc_assign_user_id);
        return found ? { ...item, ...found } : item;
      });
      var dsData = dsSlected.map(x => {
        return {
          bsc_assign_user_id: x.bsc_assign_user_id,
          result: x.result
        }
      });

      // Kiểm tra dữ liệu hợp lệ
      let invalids = [];
      dsData.forEach(x => {
        // if (!x.weight || Number(x.weight) <= 0) {
        //   invalids.push(`BSC [${x.code}] chưa nhập tỷ trọng hoặc phải lớn hơn 0`);
        // }
      });

      if (invalids.length > 0) {
        this.$toast.error(invalids.join('\n'));
        return;
      }
      //
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh dữ liệu?`)
      if (messConfirm == 0) {
        return
      }
      let result = await API.UpdateResultBSC(this, dsData)
      if (result == '1') {
        this.$toast.success('Cập nhật dữ liệu thành công!')
        this.$emit('successAddUpdate', this.bsc_personal_selected)
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async onSave() {
      if (this.isAdd) {
      } else {
        this.updateManagementBSC()
      }
    },
    onChangeFromMonth(event) {
      if (event && event.value) {
        const newFrom = moment(event.value).format('MM/YYYY')
        // this.month = newFrom
        this.localMonth = newFrom ? this.convertMonthToInt(newFrom) : ''
        this.initGrid()
      }
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
    sanitizeValue(v) {
      if (v === undefined || v === null) return null;

      if (typeof v === "string") {
        const trimmed = v.trim();
        if (trimmed === "") return null; // chuỗi rỗng → null

        const num = Number(trimmed);
        if (isNaN(num)) return null;     // không convert được → null

        return num; // convert thành số
      }

      // Nếu là số hợp lệ
      if (typeof v === "number" && !isNaN(v)) return v;

      return null;
    },

    async updateResultBSC() {
      // 1. Lấy các dòng được chọn
      let dsSelected = this.dataSources.filter(r => r.selected);

      if (dsSelected.length === 0) {
        this.$toast.error('Không có dữ liệu điều chỉnh!');
        return;
      }

      // 2. Build payload mới (VERTICAL MODE)
      const dsData = dsSelected.map(row => {

        // Payload user (1 row = 1 user)
        let userPayload = {
          user_id: row.user_id,
          department_id: this.kpi_department_id
        };

        // === PHÂN NHÁNH THEO BSC TYPE ===
        switch (row.bsc_type) {

          // 🔹 1. Độ hài lòng khách hàng
          case 1:
            userPayload.target_value = this.sanitizeValue(row.violate);
            userPayload.target_weight = null;
            break;

          // 🔹 2. Chấp hành quy định
          case 2:
            userPayload.target_value = this.sanitizeValue(row.violate);
            userPayload.target_weight = this.sanitizeValue(row.ratio);
            break;

          // 🔹 3. Doanh thu
          case 3:
            userPayload.target_assign = this.sanitizeValue(row.target_revenue);
            userPayload.target_actual = this.sanitizeValue(row.actual_revenue);
            break;
        }

        return {
          assignment_kpi_id: row.assignment_kpi_id,
          bsc_library_id: row.bsc_library_id,
          code: row.code,
          period: this.localMonth,
          work_position_id: this.job_work_position_id,
          departments: [],
          users: [userPayload],
          is_revenue: row.bsc_type === 3
        };
      });

      // 3. Confirm
      let messConfirm = await this.$confirm(
        'Thông báo',
        'Bạn chắc chắn muốn điều chỉnh dữ liệu?'
      );
      if (messConfirm === 0) return;

      // 4. Call API
      let result = await API.UpdateResultBSC(this, dsData);

      if (result === '1') {
        this.$toast.success('Cập nhật dữ liệu thành công!');
        this.$emit('successAddUpdate');
        this.hideModal();
      } else {
        this.$toast.error(result);
      }
    }
    ,

    toggleSelectAll() {
      this.dataSources.forEach(row => row.selected = this.selectAll);
    },

    allowNumberOnly(event) {
      const char = String.fromCharCode(event.keyCode);

      if (!/^\d$/.test(char)) {
        event.preventDefault();
      }
    },

    normalizeNumber(row, field) {
      row[field] = row[field]
        ?.toString()
        .replace(/[^0-9]/g, ""); // Chỉ giữ số
    },

    showTooltip(event, text) {
      const rect = event.target.getBoundingClientRect();

      this.tooltip.text = text;

      // vì dùng position: fixed nên dùng luôn tọa độ theo viewport
      this.tooltip.top = rect.bottom + 6;   // 6px bên dưới ô
      this.tooltip.left = rect.left;       // canh trái theo ô

      this.tooltip.visible = true;
    },
    hideTooltip() {
      this.tooltip.visible = false;
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
      try {
        this.loading(true)
        if (!this.file) return

        const reader = new FileReader()

        reader.onload = (e) => {
          const wb = XLSX.read(e.target.result, { type: "binary" })
          const ws = wb.Sheets[wb.SheetNames[0]]

          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

          if (!data || data.length <= 1) {
            this.$toast.error("File Excel không có dữ liệu")
            return
          }

          const result = []
          const conflictRows = []

          for (let i = 1; i < data.length; i++) {
            const row = data[i]

            if (!row || row.every(cell => !cell)) break

            const item = {
              department_name: row[1]?.toString().trim() || null,
              group_name: row[2]?.toString().trim() || null,
              employee_code: row[3]?.toString().trim() || null,
              user_name: row[4]?.toString().trim() || null,
              work_position_name: row[5]?.toString().trim() || null,
              target_revenue: row[6] ? Number(row[6]) : 0,
              actual_revenue: row[7] ? Number(row[7]) : 0
            }

            if (!item.employee_code) {
              this.$toast.error(`Dòng ${i + 1}: Thiếu Mã nhân viên`)
              return
            }

            if (isNaN(item.target_revenue) || isNaN(item.actual_revenue)) {
              this.$toast.error(`Dòng ${i + 1}: Doanh thu phải là số`)
              return
            }

            const compareResult = this.compareWithDataSources(item)

            if (!compareResult.matched) {
              conflictRows.push({
                rowIndex: i + 1, // index trong sheet (có header)
                employee_code: item.employee_code,
                user_name: item.user_name,
                diffFields: compareResult.diffFields,
                importItem: item   // 👈 GIỮ LẠI DỮ LIỆU IMPORT
              })
            }


            result.push(item)
          }

          if (conflictRows.length > 0) {
            const detailMessage = this.buildConflictMessage(conflictRows);

            this.$toast.error(
              `❌ Có ${conflictRows.length} dòng không hợp lệ:\n${detailMessage}`,
              { timeout: 7000 }
            );

            return
          }

          if (result.length === 0) {
            this.$toast.warning("Không có dữ liệu hợp lệ để import")
            return
          }

          this.mergeImportToDataSources(result)

          this.$toast.success(`Import thành công ${result.length} dòng dữ liệu`)
        }

        reader.readAsBinaryString(this.file)
      } catch (error) {
        console.error(error)
        this.$toast.error("Có lỗi xảy ra khi đọc file Excel")
      } finally {
        this.loading(false)
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

    kiemTraDuLieu: function (columns) {
      if (!columns) {
        this.$toast.error('File có cấu trúc không hợp lệ!')
        return false
      }

      const requiredHeaders = [
        'STT',
        'Mã nhân viên',
        'Họ và tên',
        'Đơn vị',
        'Phòng ban',
        'Bộ phận',
        'Công chuẩn',
        'Ngày trực tiếp làm việc được hưởng lương',
        'email',
      ]

      if (columns.length !== requiredHeaders.length) {
        this.$toast.error(`File không có đủ ${requiredHeaders.length} cột yêu cầu!`)
        return false
      }

      return true
    },

    async docfile_import_excel(data) {
      let result = await API.CheckImportData(this, data, this.thang_nam)
      if (Array.isArray(result)) {
        this.dataCheckImports = result
        this.$refs.UserDayOffCheckImportModal.showModal()
      } else {
        this.$msgBox.error("Thông báo", result)
      }
    },

    exportExcel() {
      const headerDisplay = [
        "STT",
        "Phòng ban",
        "Nhóm",
        "Mã nhân viên",
        "Nhân viên",
        "Vị trí công việc",
        "Doanh thu giao",
        "Doanh thu thực hiện"
      ];

      const headerKeys = [
        "stt",
        "department_name",
        "group_name",
        "employee_code",
        "user_name",
        "work_position_name",
        "target_revenue",
        "actual_revenue"
      ];
      const excelData = [
        headerDisplay,
        ...this.dataSources.map((item, index) =>
          headerKeys.map(key =>
            key === "stt" ? index + 1 : item[key]
          )
        )
      ];

      const ws = XLSX.utils.aoa_to_sheet(excelData);

      headerDisplay.forEach((_, index) => {
        const cell = ws[XLSX.utils.encode_cell({ r: 0, c: index })];
        cell.s = {
          font: { bold: true },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
          },
          fill: {
            fgColor: { rgb: "BAE7FF" } // KHÔNG #
          },
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

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cập nhật kết quả chỉ số doanh");

      XLSX.writeFile(
        wb,
        `Danh_sach_nhan_vien_cap_nhat_ket_qua_chi_so_doanh_thu.xlsx`
      );
    },

    mergeImportToDataSources(result) {
      const IMPORT_FIELDS = [
        'department_name',
        'group_name',
        'user_name',
        'work_position_name',
        'target_revenue',
        'actual_revenue'
      ];

      // Clone để tránh side-effect
      const updatedDataSources = [...this.dataSources];

      result.forEach(importItem => {
        // tìm theo Mã nhân viên
        const index = updatedDataSources.findIndex(
          ds => ds.employee_code === importItem.employee_code
        );

        if (index !== -1) {
          // ✅ ĐÃ TỒN TẠI → chỉ update field có trong IMPORT_FIELDS
          IMPORT_FIELDS.forEach(field => {
            if (importItem[field] !== undefined && importItem[field] !== null) {
              updatedDataSources[index][field] = importItem[field];
            }
          });
        } else {
          // ⚠️ CHƯA TỒN TẠI
          // 👉 Nếu bạn muốn thêm mới thì bật đoạn này
          // updatedDataSources.push(importItem);
        }
      });

      // Gán lại để Vue reactive update
      this.dataSources = updatedDataSources;
    },

    compareWithDataSources(importItem) {
      const COMPARE_FIELDS = [
        'department_name',
        'group_name',
        'employee_code',
        'user_name',
        'work_position_name'
      ];

      const currentItem = this.dataSources.find(
        ds => ds.employee_code === importItem.employee_code
      );

      if (!currentItem) {
        return {
          matched: false,
          diffFields: []
        };
      }

      const diffFields = [];

      COMPARE_FIELDS.forEach(field => {
        const oldVal = (currentItem[field] ?? '').toString().trim();
        const newVal = (importItem[field] ?? '').toString().trim();

        if (oldVal !== newVal) {
          diffFields.push({
            field,
            oldValue: oldVal,
            newValue: newVal
          });
        }
      });

      return {
        matched: diffFields.length === 0,
        diffFields
      };
    },
    buildConflictMessage(conflictRows) {
      const maxShow = 5;
      const rows = conflictRows.slice(0, maxShow);

      const messages = rows.map(row => {
        const displayRowIndex = row.rowIndex - 1;

        const empCodeDiff = Array.isArray(row.diffFields)
          ? row.diffFields.find(f => f.field === 'employee_code')
          : null;

        const invalidCode = empCodeDiff?.newValue || row.importItem?.employee_code || '';

        return `Dòng ${displayRowIndex} – ${row.employee_code || 'N/A'} – ${row.user_name || ''
          } có mã nhân viên là ${invalidCode} không hợp lệ`;
      });

      const more =
        conflictRows.length > maxShow
          ? `\n… và ${conflictRows.length - maxShow} dòng khác`
          : '';

      return messages.join('\n') + more;
    },
    formatMoney(value) {
      if (value === null || value === undefined || value === '') return '';
      return Number(value).toLocaleString('vi-VN');
    },

    parseMoney(value) {
      if (!value) return null;
      return Number(value.toString().replace(/\./g, ''));
    },

    allowNumberOnly(e) {
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    }

  },
  mounted() {
  }
}
</script>
<style scoped>
:deep(.e-control.e-dialog.update-result-bsc.e-popup-open .e-dlg-content) {
  /* max-height: 65vh !important;
  overflow-y: auto; */
}

#add-update-management-bsc .e-dlg-content {
  overflow: visible !important;
}

.e-tooltip-wrap.hide-tooltip-for-bsc {
  display: none !important;
}

.bsc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.col-formula {
  width: 480px;
}

.col-dyn {
  width: 150px;
}

.bsc-table th,
.bsc-table td {
  border: 1px solid #ddd;
  padding: 8px;
  white-space: nowrap;
}

.bsc-table th.user-header {
  text-align: center;
  vertical-align: middle;
  background: #f6f6f6;
  font-weight: bold;
}

.hide-cell {
  visibility: hidden;
  padding: 0 !important;
  border: none !important;
}

.input-cell {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.bsc-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.bsc-table-wrapper {
  width: 100%;
  overflow-x: auto;
  /* overflow-y: hidden; */
  height: 45vh;
  overflow-y: auto;
}

.center-header {
  text-align: center !important;
}

.bsc-table th {
  background-color: #BAE7FF !important;
}

.bsc-table th.user-header {
  background-color: #BAE7FF !important;
}

.center-header {
  background-color: #BAE7FF !important;
}

.bsc-table th {
  background-color: #BAE7FF !important;
  border: 1px solid #91D5FF !important;
}

.calculation-col {
  max-width: 220px;
  /* chỉnh theo ý bạn */
  width: 220px;
  white-space: nowrap;
  /* không xuống dòng */
  overflow: hidden;
  text-overflow: ellipsis;
  /* hiển thị ... */
  cursor: pointer;
  position: relative;
}

.calculation-col:hover::after {
  content: attr(data-fulltext);
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 4px;
  background: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  z-index: 9999;

  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);

  font-size: 13px;
}

.bsc-table td {
  position: relative;
}

.custom-tooltip {
  position: fixed;
  background: #FDF7ED;
  color: black;
  padding: 6px 10px;
  border-radius: 4px;
  max-width: 500px;
  white-space: pre-wrap;

  z-index: 99999999 !important;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  font-size: 13px;
  pointer-events: none;
}

.col-hint {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.btn-container {
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
}

/* Ẩn icon xổ xuống */
:deep(.select2-container--default .select2-selection--single .select2-selection__arrow) {
  display: none !important;
}

/* Bỏ khoảng trống bên phải do arrow để lại */
:deep(.select2-container--default .select2-selection--single .select2-selection__rendered) {
  padding-right: 8px !important;
}

</style>