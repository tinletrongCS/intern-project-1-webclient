<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupDetailWorkForAssigneeModal"
    :showCloseIcon="true" width="80%" :isModal='true' :target="target" :header="header" :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <KDataGrid ref="gridDetailWork" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="false" :enabledSelectFirstRow="false"
          :showSTT="true" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" @queryCellInfo="queryCellInfo" />
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import moment from 'moment'
import API from './API'
export default {
  name: 'DetailWorkForAssigneeModal',
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    header() {
      return this.data.assign_name ? `<span class="icon one-notepad"></span> Danh sách công việc giao cho ${this.data.assign_name}` : `<span class="icon one-notepad"></span> Danh sách công việc`
    }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      columns: [
        {
          fieldName: 'work_code',
          headerText: 'Mã',
          allowFiltering: true,
          width: "120"
        },
        {
          fieldName: 'task_name',
          headerText: 'Công việc',
          allowFiltering: true
        },
        {
          fieldName: 'reporter_name',
          headerText: 'Người giao',
          allowFiltering: true,
        },
        {
          fieldName: 'schedule_start',
          headerText: 'Ngày bắt đầu',
          allowFiltering: true
        },
        {
          fieldName: 'schedule_end',
          headerText: 'Ngày kết thúc',
          allowFiltering: true
        },
        {
          fieldName: 'actual_hours',
          headerText: 'Thời gian thực hiện',
          allowFiltering: true
        },
        {
          fieldName: 'assigned_hours',
          headerText: 'Thời gian giao',
          allowFiltering: true
        },
        {
          fieldName: 'status_work',
          headerText: 'Trạng thái',
          allowFiltering: true
        },
        {
          fieldName: 'step_name',
          headerText: 'Công đoạn',
          allowFiltering: true
        },
        {
          fieldName: 'board_name',
          headerText: 'Bảng',
          allowFiltering: true
        }

      ],
      dataSources: [],
    }
  },
  methods: {
    showModal() {
      this.$refs["popupDetailWorkForAssigneeModal"].show()
    },
    hideModal() {
      this.$refs["popupDetailWorkForAssigneeModal"].hide()
    },
    handleShowModal() {
      this.clear()
      setTimeout(() => {
        this.initDataPopup()
      }, 200)
    },
    clear() {
      this.dataSources = []
    },
    async initDataPopup() {
      //this.dataSources=this.dataCheckImports
      var dataRequest = {
        center_id: this.data.center_id,
        department_id: this.data.department_id,
        group_id: this.data.group_id,
        project_id: this.data.project_id,
        from_month: this.data.from_month,
        to_month: this.data.to_month,
        assignee_id: this.data.assignee_id
      }
      let rs = await API.GetResourceSummaryByUnitWithRangeMonthDetail(this, dataRequest)
      if (rs && rs != '') {
        this.dataSources = JSON.parse(rs)
      }

    },
    queryCellInfo(args) {
      const field = args.column.field;
      const data = args.data;
      //  Tô màu chữ cho từng ô theo logic riêng
      if (field === 'board_name' && data.board_id) {
        const vm = this;

        args.cell.style.cursor = 'pointer';
        args.cell.setAttribute('title', 'Nhấn để xem chi tiết công việc');
        args.cell.onclick = (evt) => {
          evt.stopPropagation();
          vm.openTaskDetail(data.board_id, data.task_id);
        };
      }
      else if (field === 'status_work') {
        if (data.status_work == "Đã thực hiện") {
          // Màu xanh đậm hơn
          args.cell.setAttribute(
            'style',
            'color: #1b5e20; font-weight: 600;'
          );
        } else {
          // Màu vàng nếu chưa thực hiện
          args.cell.setAttribute(
            'style',
            'color: #b26a00; font-weight: 600;'
          );
        }
      }
    },
    openTaskDetail(boardId, taskId) {
      if (!taskId) return
      // Mở tab mới với URL chi tiết công việc
      const route = this.$router.resolve({ name: 'kanban', query: { board_id: boardId, task_id: taskId } })// 
      window.open(route.href, '_blank')
    }
  }
}
</script>

<style>
.work-code-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.work-code-open-icon {
  display: inline-flex;
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}

/* .work-code-cell:hover .work-code-open-icon {
  display: inline-flex;
} */
</style>
