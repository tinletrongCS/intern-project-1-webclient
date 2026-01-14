<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupViewBscDetail" :showCloseIcon="true" width="50%"
    :isModal='true' :target="target" :header="header" id="add-update-management-bsc" class="add-update-management-bsc"
    :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <span class="sum-bsc">Tổng BSC: {{ totalBSC }}</span>
          <KDataGrid ref="gridDsManagementBSC" :columns="columns" :dataSource="data_detail"
            :enable-paging-server="false" :allowPaging="false" :showFilter="false" :allowSorting="false"
            :showColumnCheckbox="false" :enabledSelectFirstRow="false" :selectionSettings="{ checkboxOnly: false }"
            @queryCellInfo="onQueryCellInfo" />
          <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
// import API from './DashboardBscUserApi'
import { createApp } from "vue"
const app = createApp()
export default {
  name: 'ViewBscDetailModal',
  props: {
    month_request: {
      type: String,
      default: ''
    },
    user_id_request: {
      type: Number,
      default: 0
    },
    data_detail: {
      type: Array,
      default: []
    }
  },
  components: {

  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span>CHI TIẾT KẾT QUẢ CHỈ SỐ BSC CÁ NHÂN THÁNG` + this.month_request,
      columns: [
        {
          fieldName: 'stt',
          headerText: 'STT',
          allowFiltering: true,
          width: '70'
        },
        {
          fieldName: 'field_name',
          headerText: 'Chỉ số',
          allowFiltering: true,
          width: '120'
        },
        {
          fieldName: 'result',
          headerText: 'Kết quả thực hiện',
          allowFiltering: true,
          valueAccessor: this.resultValueAccessor,
        }
      ],
      dataSources: [],
      selectedIds: []
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => c.visible !== false)
    },
    totalBSC() {
      if (this.data_detail.length == 0) return 0

      const total = this.data_detail.reduce((sum, item) => {
        return sum + (Number(item.result) || 0)
      }, 0)

      return Math.round(total * 10000) / 10000
    },
    header() {
      return `<span class="icon one-notepad"></span>CHI TIẾT KẾT QUẢ CHỈ SỐ BSC CÁ NHÂN THÁNG ${this.month_request}`;
    }

  },
  methods: {
    showModal() {
      this.$refs["popupViewBscDetail"].show()
    },
    hideModal() {
      this.$refs["popupViewBscDetail"].hide()
    },
    handleShowModal() {
      // this.clear()
      // setTimeout(() => {
      //   this.initPopup()
      // }, 200)
    },
    clear() {
      this.data_detail = []
    },
    onQueryCellInfo(args) {
      if (args.column.field === 'result') {
        const val = Number(args.data.result);
        if (!isNaN(val) && val < 0) {
          args.cell.style.color = 'red';
          args.cell.style.fontWeight = '600';
        }
      }
    }
  },
  watch: {
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

.sum-bsc {
  display: flex;
  justify-content: right;
  font-weight: 700;
}
</style>