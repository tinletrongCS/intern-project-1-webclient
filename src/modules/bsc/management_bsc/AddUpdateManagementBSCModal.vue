<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupAddUpdateManagementBSC" :showCloseIcon="true"
    width="80%" :isModal='true' :target="target" :header="header" id="add-update-management-bsc"
    class="add-update-management-bsc" :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <div class="row">
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w120 bold">{{ labelTypeSelect }}</div>
                <div class="value">
                  <select2 v-if="bsc_type == 1" v-model='bsc_personal_selected' :disabled="!isAdd"
                    :options="bsc_personal_list.map(e => ({ id: e.job_work_position_id, text: e.name }))"
                    @select="onChangeBSCPersonal" />
                </div>
              </div>
            </div>
            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w80 bold">Từ tháng</div>
                <div class="value">
                  <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                    :enabled="isAdd" :depth="'Year'" :showClearButton="false" v-model="from_month" :allowEdit="false"
                    @change="onChangeFromMonth($event)" />
                </div>
              </div>
            </div>
            <div class="col-sm-3 col-12">
              <div class="info-row">
                <div class="key w80 bold">Đến tháng</div>
                <div class="value">
                  <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                    :enabled="isAdd" :depth="'Year'" :showClearButton="false" v-model="to_month" :allowEdit="false"
                    @change="onChangeToMonth($event)" />
                </div>
              </div>
            </div>
            <div class="col-sm-2 col-12">
            </div>
          </div>

          <KDataGrid ref="gridDsManagementBSC" :columns="columns" :dataSource="dataSources" @queryCellInfo="onCellInfo"
            :enable-paging-server="false" :allowPaging="false" :showFilter="false" :allowSorting="false"
            :showColumnCheckbox="isAdd" :enabledSelectFirstRow="false" :selectionSettings="{ checkboxOnly: true }" />
          <!-- <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th v-if="isAdd" style="width: 40px; text-align: center">
                  <input type="checkbox" @change="toggleSelectAll($event)" />
                </th>

                <th v-for="col in visibleColumns" :key="col.fieldName"
                  :style="{ width: col.width ? col.width + 'px' : null }">
                  {{ col.headerText }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in dataSources" :key="row.bsc_library_id">
                <td v-if="isAdd" style="text-align: center">
                  <input type="checkbox" :value="row.bsc_library_id" v-model="selectedIds" />
                </td>

                <td v-for="col in visibleColumns" :key="col.fieldName">
                  <span v-if="col.fieldName === 'formula'" v-html="row[col.fieldName]">
                  </span>

                  <input v-else-if="col.fieldName === 'weight'" type="number" class="form-control"
                    v-model.number="row.weight" min="0" max="100" step="0.01" />

                  <span v-else>
                    {{ row[col.fieldName] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table> -->

          <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
            <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
              <span class="icon one-save"></span> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import API from './ManagementBSCApi'
import { createApp } from "vue"
import moment from 'moment'
const app = createApp()
export default {
  name: 'AddUpdateManagementBSCModal',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    bsc_type: {
      type: Number,
      default: 1
    },
    bsc_personal_id: {
      type: Number,
      default: 0
    },
    bsc_personal_list: {
      type: Array,
      default: () => []
    },
    arrIds: {
      type: Object,
      default: () => []
    },
    from_month_kpi: {
      type: String,
      default: ''
    },
    to_month_kpi: {
      type: String,
      default: ''
    },
    totalWeight: {
      type: Number,
      default: 0
    },
  },
  components: {

  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span>DANH SÁCH BỘ CHỈ SỐ BSC`,
      bsc_personal_selected: null,
      columns: [
        {
          fieldName: 'bsc_library_id',
          headerText: 'ID',
          allowFiltering: true,
          width: '120',
          visible: false,
          isPrimaryKey: true
        },
        {
          fieldName: 'code',
          headerText: 'Mã chỉ số',
          allowFiltering: true,
          width: '120'
        },
        {
          fieldName: 'name',
          headerText: 'Tên chỉ số',
          allowFiltering: true
        },
        // {
        //   fieldName: 'description',
        //   headerText: 'Mô tả',
        //   allowFiltering: true
        // },
        // {
        //   fieldName: 'assign_target',
        //   headerText: 'Chỉ tiêu giao',
        //   allowFiltering: true
        // },
        // {
        //     fieldName:'unit',
        //     headerText:'Đơn vị tính',
        //     allowFiltering:true
        // },
        {
          fieldName: 'formula',
          headerText: 'Công thức đánh giá',
          allowFiltering: true,
          disableHtmlEncode: false
        },
        // {
        //   fieldName: 'cycle',
        //   headerText: 'Chu kỳ',
        //   allowFiltering: false,
        //   template: this.GetColumnTemplateInput(this, 'cycle', 'select'),
        // },
        {
          fieldName: 'weight',
          headerText: 'Tỷ trọng',
          allowFiltering: false,
          template: this.GetColumnTemplateInput(this, 'weight', 'text'),
        },
      ],
      dataSources: [],
      selectedBsc: [],
      from_month: moment().startOf('year').format('MM/yyyy'),
      to_month: moment().endOf('year').format('MM/yyyy'),
      selectedIds: []
    }
  },
  computed: {
    labelTypeSelect() {
      return this.bsc_type == 1 ? 'Vị trí công việc' : 'Phòng ban'
    },
    visibleColumns() {
      return this.columns.filter(c => c.visible !== false)
    }
  },
  methods: {

    showModal() {
      this.$refs["popupAddUpdateManagementBSC"].show()
    },
    hideModal() {
      this.$refs["popupAddUpdateManagementBSC"].hide()
    },
    handleShowModal() {
      this.clear()
      setTimeout(() => {
        this.initPopup()
      }, 200)
    },
    async initGrid() {
      let period_from = Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
      let period_to = Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))
      let dataRequest = {
        bsc_type: this.bsc_type,
        work_position_id: this.bsc_personal_selected != null ? this.bsc_personal_selected : 0,
        is_add: this.isAdd ? 1 : 2,
        arr_management_bsc_id: JSON.stringify(this.arrIds),
        from_month: period_from,
        to_month: period_to
      }
      this.dataSources = []
      var data = await API.GetManagementBSCListInsertUpdate(this, dataRequest)
      if (data) {
        data = JSON.parse(data)
        this.dataSources = data.concat([])
      }

    },
    async initPopup() {
      this.bsc_personal_selected = this.bsc_personal_id
      this.from_month = this.from_month_kpi
      this.to_month = this.to_month_kpi
      // await this.initGrid()
      this.initGrid()
    },
    clear() {
      this.bsc_personal_selected = null
      this.dataSources = []
      this.selectedBsc = []
    },
    onChangeBSCPersonal() {
      this.initGrid()
    },
    // onFieldChanged(data, field, value) {
    //   if (field == 'ratio') {
    //     const grid = this.$refs.gridDsManagementBSC.grid.ej2Instances;
    //     grid.setCellValue(data.bsc_library_id, 'ratio', value);
    //     data.ratio = value;
    //   }
    // },
    // onChangeSelect(data, field, value) {
    //   if (field == 'cycle') {
    //     const grid = this.$refs.gridDsManagementBSC.grid.ej2Instances;
    //     grid.setCellValue(data.bsc_library_id, 'cycle', value);
    //     data.cycle = value;
    //   }
    // },
    onFieldChanged(row, field, value) {
      if (field == 'weight') {
        row.weight = value; // cập nhật hiển thị trong grid
        const index = this.selectedBsc.findIndex(x => x.bsc_library_id === row.bsc_library_id);
        if (index === -1) {
          // chưa có → thêm mới
          this.selectedBsc.push({
            bsc_library_id: row.bsc_library_id,
            weight: row.weight ?? null,
            cycle: row.cycle ?? null
          });
        } else {
          // có rồi → update
          this.selectedBsc[index].weight = row.weight ?? null;
        }

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
            },
            convertFromInt(val) {
              if (!val) return null;

              const strVal = val.toString();

              if (strVal.length !== 6) return null; // không đúng định dạng yyyymm

              const year = strVal.substring(0, 4);
              const month = strVal.substring(4, 6);

              return `${month}/${year}`;
            }
          }
        });

        // Trả về tên component để Grid render
        return { template: GetColumnTemplateInput };
      };
    },
    async addManagementBSC() {
      let dsSlected = this.$refs.gridDsManagementBSC.getSelectedRecords();
      // let dsSlected = this.getSelectedRows();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn dữ liệu cần thêm mới!')
        return
      }
      let period_from = Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
      let period_to = Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))
      dsSlected = dsSlected.map(item => {
        const found = this.selectedBsc.find(x => x.bsc_library_id === item.bsc_library_id);
        return found ? { ...item, ...found } : item;
      });
      var dsData = dsSlected.map(x => {
        return {
          bsc_library_id: x.bsc_library_id,
          code: x.code,
          cycle: x.cycle,
          weight: x.weight,
          from_month: period_from,
          to_month: period_to,
          bsc_type: this.bsc_type,
          work_position_id: this.bsc_type == 1 ? this.bsc_personal_selected : 0,
          violate: x.violate
        }
      });
      // Kiểm tra dữ liệu hợp lệ
      let invalids = [];
      dsData.forEach(x => {
        if (x.violate === "CO") return;

        if (!x.weight || Number(x.weight) <= 0) {
          invalids.push(`BSC [${x.code}] chưa nhập tỷ trọng hoặc phải lớn hơn 0`);
        }
      });

      if (invalids.length > 0) {
        this.$toast.error(invalids.join('\n'));
        return;
      }
      //
      const inputWeight = dsData.reduce((sum, item) => {
        return sum + Number(item.weight || 0);
      }, 0);

      const finalWeight = inputWeight + Number(this.totalWeight || 0);

      if (finalWeight > 100) {
        this.$toast.error(
          `Tổng tỷ trọng hiện tại là ${this.totalWeight}%, cộng thêm ${inputWeight}% = ${finalWeight}%, vượt mức tối đa 100%.`
        );
        return;
      }
      //
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm dữ liệu đang chọn?`)
      if (messConfirm == 0) {
        return
      }
      let result = await API.AddManagementBSC(this, dsData)
      if (result == '1') {
        this.$toast.success('Thêm mới thành công!')
        this.$emit('successAddUpdate', {
          value: this.bsc_personal_selected,
          from_month: this.from_month,
          to_month: this.to_month
        })
        this.hideModal()
      } else {
        this.$toast.error(result)
      }

    },
    async updateManagementBSC() {
      let dsSlected = this.$refs.gridDsManagementBSC.getCurrentViewRecords();
      // let dsSlected = this.getSelectedRows();
      if (dsSlected.length == 0) {
        this.$toast.error('Không có dữ liệu điều chỉnh!')
        return
      }

      let period_from = Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
      let period_to = Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))

      dsSlected = dsSlected.map(item => {
        const found = this.selectedBsc.find(x => x.bsc_library_id === item.bsc_library_id);
        return found ? { ...item, ...found } : item;
      });
      var dsData = dsSlected.map(x => {
        return {
          management_bsc_id: x.management_bsc_id,
          bsc_library_id: x.bsc_library_id,
          code: x.code,
          cycle: x.cycle,
          weight: x.weight,
          from_month: period_from,
          to_month: period_to,
          bsc_type: this.bsc_type,
          work_position_id: this.bsc_type == 1 ? this.bsc_personal_selected : 0
        }
      });

      // Kiểm tra dữ liệu hợp lệ
      let invalids = [];
      dsData.forEach(x => {
        if (!x.weight || Number(x.weight) <= 0) {
          invalids.push(`BSC [${x.code}] chưa nhập tỷ trọng hoặc phải lớn hơn 0`);
        }
      });

      if (invalids.length > 0) {
        this.$toast.error(invalids.join('\n'));
        return;
      }
      //
      const inputWeight = dsData.reduce((sum, item) => {
        return sum + Number(item.weight || 0);
      }, 0);

      const finalWeight = inputWeight + Number(this.totalWeight || 0);

      if (finalWeight > 100) {
        this.$toast.error(
          `Tổng tỷ trọng hiện tại là ${finalWeight}%, vượt mức tối đa 100%.`
        );
        return;
      }
      //
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh dữ liệu?`)
      if (messConfirm == 0) {
        return
      }
      let result = await API.UpdateManagementBSC(this, dsData)
      if (result == '1') {
        this.$toast.success('Cập nhật dữ liệu thành công!')
        this.$emit('successAddUpdate', {
          value: this.bsc_personal_selected,
          from_month: this.from_month,
          to_month: this.to_month
        })
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async onSave() {
      if (this.isAdd) {
        this.addManagementBSC()
      } else {
        this.updateManagementBSC()
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
    convertFromInt(val) {
      if (!val) return null;

      const strVal = val.toString();

      if (strVal.length !== 6) return null; // không đúng định dạng yyyymm

      const year = strVal.substring(0, 4);
      const month = strVal.substring(4, 6);

      return `${month}/${year}`;
    },
    onChangeFromMonth(event) {
      if (event && event.value) {
        const newFrom = moment(event.value).format('MM/YYYY')
        const fromNum = Number(moment(newFrom, 'MM/YYYY').format('YYYYMM'))
        const toNum = Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))

        this.from_month = newFrom

        // Nếu from > to → tự động set to = from
        if (fromNum > toNum) {
          this.to_month = newFrom
        }
      }
      this.initGrid()
    },
    onChangeToMonth(event) {
      if (event && event.value) {
        const newTo = moment(event.value).format('MM/YYYY')
        const toNum = Number(moment(newTo, 'MM/YYYY').format('YYYYMM'))
        const fromNum = Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))

        this.to_month = newTo

        // Nếu to < from → tự động set from = to
        if (toNum < fromNum) {
          this.from_month = newTo
        }
      }
      this.initGrid()
    },
    toggleSelectAll(e) {
      const target = e.target; // HTMLInputElement
      const checked = target.checked;

      if (checked) {
        this.selectedIds = this.dataSources.map(x => x.bsc_library_id);
      } else {
        this.selectedIds = [];
      }
    },
    // Ví dụ: lấy danh sách dòng đã chọn
    getSelectedRows() {
      if (!this.isAdd) {
        this.selectedIds = this.dataSources.map(x => x.bsc_library_id);
      }
      return this.dataSources.filter(x =>
        this.selectedIds.includes(x.bsc_library_id)
      )
    },
    onCellInfo(args) {
      if (args.column.field === "weight" && args.data.violate === "CO") {
        args.cell.classList.add("hide-weight-input");
      }
    }
  },
  watch: {
    // 'bsc_personal_selected': {
    //   handler() {
    //     this.initGrid()
    //   },
    //   deep: true
    // },
    // 'from_month': {
    //   handler() {
    //     this.initGrid()
    //   },
    //   deep: true
    // },
    // 'to_month': {
    //   handler() {
    //     this.initGrid()
    //   },
    //   deep: true
    // },
  },
  mounted() {

  },
}
</script>
<style>
#add-update-management-bsc .e-dlg-content {
  overflow: visible !important;
}

.e-tooltip-wrap.hide-tooltip-for-bsc {
  display: none !important;
}

.hide-weight-input input {
  display: none !important;
}

</style>