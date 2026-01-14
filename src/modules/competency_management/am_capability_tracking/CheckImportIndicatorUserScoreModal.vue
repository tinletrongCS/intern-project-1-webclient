<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupCheckImportIndicatorUserScore"
    :showCloseIcon="true"
    width="80%"
    :isModal="true"
    :target="target"
    :header="header"
    :open="handleShowModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <KDataGrid
          ref="gridCheckImport"
          :columns="columns"
          :dataSource="dataSources"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="false"
          :showColumnCheckbox="false"
          :enabledSelectFirstRow="false"
          :showSTT="true"
          @queryCellInfo="queryCellInfo"
        />

        <div class="group-buttons -bottom right" style="margin-top: 5px !important;">
          <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
            <span class="icon one-save"></span> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import API from './API'

export default {
  name: 'CheckImportIndicatorUserScoreModal',
  props: {
    dataCheckImports: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span> Kiểm tra dữ liệu chỉ tiêu`,
      columns: [
        {
          fieldName: 'status_name',
          headerText: 'Trạng thái',
          width: '120'
        },
        {
          fieldName: 'error_message',
          headerText: 'Lỗi'
        },
        {
          fieldName: 'service_name',
          headerText: 'Dịch vụ'
        },
        {
          fieldName: 'contract_value',
          headerText: 'Giá trị hợp đồng'
        },
        {
          fieldName: 'has_acceptance',
          headerText: 'Đã nghiệm thu',
          valueAccessor: this.formatAcceptance
        }
      ],
      dataSources: []
    }
  },
  methods: {
    // ===== PUBLIC METHODS =====
    showModal() {
      this.$refs.popupCheckImportIndicatorUserScore.show()
    },
    hideModal() {
      this.$refs.popupCheckImportIndicatorUserScore.hide()
    },

    handleShowModal() {
      this.clear()
      setTimeout(() => {
        this.initDataPopup()
      }, 200)
    },
    formatAcceptance(field, data, column) {
      return data[field] == true ? 'X' : ''
    },

    clear() {
      this.dataSources = []
    },

    initDataPopup() {
      this.dataSources = this.dataCheckImports
    },

    async onSave() {
      const rowErrors = this.dataSources.filter(x => x.is_error)
      if (rowErrors.length > 0) {
        this.$msgBox.error(
          'Thông báo',
          'Danh sách dữ liệu vẫn tồn tại lỗi, vui lòng kiểm tra lại!'
        )
        return
      }

      const confirm = await this.$confirm(
        'Thông báo',
        'Bạn có chắc chắn muốn import danh sách này không?'
      )
      if (confirm == 0) return

      const rs = await API.ImportIndicatorUserScore(this, this.dataSources)
      if (rs == '1') {
        this.$msgBox.success('Thông báo', 'Import thành công!')
        this.$emit('successImportData')
        this.hideModal()
      } else {
        this.$msgBox.error('Thông báo', rs)
      }
    },

    queryCellInfo(args) {
      const data = args.data
      if (args.column.field === 'status_name') {
        args.cell.style.fontWeight = '600'
        args.cell.style.color = data.is_update ? '#b26a00' : '#1b5e20'
      }
      if (args.column.field === 'error_message' && data.is_error) {
        args.cell.style.color = '#842029'
        args.cell.style.fontWeight = '600'
      }
    }
  }
}
</script>
