<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content management-bsc" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="value">
                <input type="text" @keyup.enter="SearchText" v-model="input_search_name" class="form-control"
                  placeholder="Tìm kiếm theo mã, tên danh mục" @input="onInput">
              </div>
            </div>
          </div>
          <div :class="['col-12', colClass]">
            <div class="info-row container-dropdown">
              <div class="key w120">{{ labelTypeSelect }}</div>
              <div class="value">
                <select2 v-if="bsc_type_selected == 1" v-model='bsc_personal_selected'
                  :options="bsc_personal_list.map(e => ({ id: e.job_work_position_id, text: e.name }))"
                  @select="onChangeBSCPersonal" />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w80 bold">Từ tháng</div>
              <div class="value">
                <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                  :enabled="true" :depth="'Year'" :showClearButton="false" v-model="from_month" :allowEdit="false"
                  @change="onChangeFromMonth($event)" />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w80 bold">Đến tháng</div>
              <div class="value">
                <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                  :enabled="true" :depth="'Year'" :showClearButton="false" v-model="to_month" :allowEdit="false"
                  @change="onChangeToMonth($event)" />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
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
                <button class="btn btn-second" style="min-width: 100px;" @click="onClickAddNewManagementBSC">
                  <span class="icon fa fa-plus"></span>&nbsp;Lựa chọn
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click="onClickUpdateNewManagementBSC">
                  <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click="onClickDeleteManagementBSC">
                  <span class="icon one-trash"></span>&nbsp;Xóa
                </button>&nbsp;
              </div>
            </div>
            <div class="info-row">
              <div class="value bold">
                Danh sách thông tin BSC theo {{ labelTypeSelect.toLowerCase() }}
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-6">
            Tổng tỷ trọng: {{ totalRatio }}
          </div>
        </div>
        <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="true" :enabledSelectFirstRow="false"
          :showSTT="false" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>
    </div>
    <!-- Modal -->
    <AddUpdateManagementBSCModal ref="addUpdateManagementBSCModal" :bsc_personal_list="bsc_personal_list"
      :bsc_personal_id="bsc_personal_selected" :bsc_type="bsc_type_selected" :isAdd="isAddNew" :arrIds="arrIdselected"
      :from_month_kpi="from_month" :to_month_kpi="to_month" @successAddUpdate="successAddUpdate" :totalWeight="totalWeightRemaining"/>

  </div>
</template>
<script>
import API from './ManagementBSCApi'
import AddUpdateManagementBSCModal from './AddUpdateManagementBSCModal.vue'
import moment from 'moment'
export default {
  name: 'ManagementBSC',
  components: {
    AddUpdateManagementBSCModal
  },
  data() {
    return {
      header: {
        title: "Quản lý chỉ số BSC cá nhân",
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
          fieldName: 'description',
          headerText: 'Mô tả',
          allowFiltering: true
        },
        {
          fieldName: 'formula',
          headerText: 'Công thức đánh giá',
          allowFiltering: true,
          disableHtmlEncode: false
        },
        // {
        //   fieldName: 'cycle_name',
        //   headerText: 'Chu kỳ',
        //   allowFiltering: true
        // },
        {
          fieldName: 'weight',
          headerText: 'Tỷ trọng',
          allowFiltering: true,
          valueAccessor: (field, data) => this.formatWeight(field, data)
        },
        {
          fieldName: 'from_month',
          headerText: 'Từ tháng',
          allowFiltering: true,
          valueAccessor: (field, data) => this.convertFromInt(data.from_month)
        },
        {
          fieldName: 'to_month',
          headerText: 'Đến tháng',
          allowFiltering: true,
          valueAccessor: (field, data) => this.convertFromInt(data.to_month)
        }
      ],
      dataSources: [],
      input_search_name: '',
      isAddNew: true,
      rowSelected: {},
      bsc_type_selected: 1,
      bsc_list: [
        {
          id: 1,
          text: 'Cá nhân'
        }
      ],
      bsc_personal_selected: null,
      bsc_personal_list: [],
      arrIdselected: [],
      typingTimer: null,
      screenWidth: window.innerWidth,
      from_month: moment().startOf('year').format('MM/yyyy'),
      to_month: moment().endOf('year').format('MM/yyyy'),
      totalWeight: 0,
      totalWeightRemaining : 0
    }
  },
  computed: {
    labelTypeSelect() {
      return this.bsc_type_selected == 1 ? 'Vị trí công việc' : 'Phòng ban'
    },
    totalRatio() {
      if (this.dataSources.length == 0) return 0
      const total = this.dataSources.reduce((sum, item) => {
        return sum + (item.weight || 0);
      }, 0)
      this.totalWeight = total
      return total + '%'
    },
    colClass() {
      if (this.screenWidth >= 576 && this.screenWidth < 768) return 'col-sm-5'
      if (this.screenWidth >= 768 && this.screenWidth < 992) return 'col-sm-5'
      return 'col-sm-3'
    }
  },
  methods: {
    SearchText() {
      this.initDataGrid()
    },
    onChangeBSCPersonal() {
      this.SearchText()
    },
    onClickAddNewManagementBSC() {
      this.isAddNew = true
      this.$refs.addUpdateManagementBSCModal.showModal()
    },
    onClickUpdateNewManagementBSC() {
      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn dữ liệu điều chỉnh!')
        return
      }
      this.isAddNew = false
      this.arrIdselected = dsSlected.map(x => x.management_bsc_id)

      const selectedWeightOld = dsSlected.reduce((sum, x) => {
        return sum + Number(x.weight || 0);
      }, 0);
      // this.totalWeight = Number(this.totalWeight) - selectedWeightOld;
      this.totalWeightRemaining = Number(this.totalWeight) - selectedWeightOld;
      this.$refs.addUpdateManagementBSCModal.showModal()
    },
    async onClickDeleteManagementBSC() {
      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn dữ liệu cần xóa!')
        return
      }
      let dsId = dsSlected.map(x => x.management_bsc_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu đang chọn?`)
      if (result == 0) return

      let data = await API.DeleteManagementBSC(this, {
        arrIds: JSON.stringify(dsId)
      }
      )
      if (data == '1') {
        this.$toast.success('Xóa thành công!')
        this.initDataGrid()
      } else {
        this.$toast.error(data)
      }
    },
    successAddUpdate(value) {
      if (this.bsc_type_selected == 1) {
        this.bsc_personal_selected = value?.value
      }
      this.from_month=value.from_month
      this.to_month=value.to_month
      this.initDataGrid()
    },
    async initDataGrid() {
      let period_from=Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
      let period_to=Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))
      let request = {
        bsc_type: this.bsc_type_selected,
        work_position_id: this.bsc_personal_selected != null ? this.bsc_personal_selected : 0,
        search_text: this.input_search_name != null ? this.input_search_name.trim() : '',
        from_month:period_from,
        to_month:period_to,
      }
      this.dataSources = []
      let data = await API.GetManagementBSCList(this, request)
      if (data) {
        data = JSON.parse(data)
        this.dataSources = data.concat([])
      }
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
    onInput() {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.SearchText()
      }, 500) // 0.5s sau khi ngừng gõ
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth
    },
    formatWeight(field, data) {
      const val = data.weight
      if (val == null || val === '') return ''
      return `${val}%`
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
      this.initDataGrid()
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
      this.initDataGrid()
    },
  },
  mounted() {
    setTimeout(() => {
      this.loadPage()
    }, 200)

    window.addEventListener('resize', this.updateScreenWidth)
    setTimeout(() => {
      this.loadPage()
    }, 200)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenWidth)
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