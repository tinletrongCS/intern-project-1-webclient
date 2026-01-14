<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupViewBscDetail" :showCloseIcon="true" width="80%"
    :isModal='true' :target="target" :header="header" id="add-update-management-bsc" class="add-update-management-bsc"
    :open="handleShowModal" :close="hideModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <KDataGrid ref="gridDsManagementBSC" :columns="columns" :dataSource="dataSources"
            :enable-paging-server="false" :allowPaging="true" :showFilter="false" :allowSorting="false"
            :showColumnCheckbox="false" :enabledSelectFirstRow="false" :selectionSettings="{ checkboxOnly: false }" />
          <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import API from './DashboardBscUserApi'
import { createApp } from "vue"
import moment from "moment";

const app = createApp()
export default {
  name: 'ViewTaskDetailModal',
  props: {
    month_request: {
      type: String,
      default: ''
    },
    user_id_request: {
      type: Number,
      default: 0
    },
    type_request: {
      type: String,
      default: ''
    }
  },
  components: {

  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: `<span class="icon one-notepad"></span>DANH SÁCH CÔNG VIỆC`,
      columns: [
        {
          fieldName: 'code',
          headerText: 'Mã công việc',
          allowFiltering: true
        },
        {
          fieldName: 'task_name',
          headerText: 'Nội dung công việc',
          allowFiltering: true
        },
        {
          fieldName: 'priority',
          headerText: 'Mức độ',
          allowFiltering: true
        },
        {
          fieldName: 'status_name',
          headerText: 'Tình trạng',
          allowFiltering: true
        },
        {
          fieldName: 'rating',
          headerText: 'Đánh giá chất lượng',
          allowFiltering: true
        },
        {
          fieldName: 'schedule_start',
          headerText: 'Ngày bắt đầu dự kiến',
          allowFiltering: true,
          valueAccessor: (field, data) => {
            return this.formatDate(data.schedule_start);
          }
        },
        {
          fieldName: 'schedule_end',
          headerText: 'Ngày kết thúc dự kiến',
          allowFiltering: true,
          valueAccessor: (field, data) => {
            return this.formatDate(data.schedule_end);
          }
        },
        {
          fieldName: 'actual_start',
          headerText: 'Ngày bắt đầu thực tế',
          allowFiltering: true,
          valueAccessor: (field, data) => {
            return this.formatDate(data.actual_start);
          }
        },
        {
          fieldName: 'actual_end',
          headerText: 'Ngày kết thúc thực tế',
          allowFiltering: true,
          valueAccessor: (field, data) => {
            return this.formatDate(data.actual_end);
          }
        },
        {
          fieldName: 'planned_duration_time',
          headerText: 'Giờ giao',
          allowFiltering: true
        },
        {
          fieldName: 'actual_execution_time',
          headerText: 'Giờ thực hiện',
          allowFiltering: true
        },
        {
          fieldName: 'u_ins_name',
          headerText: 'Người giao',
          allowFiltering: true
        },
        {
          fieldName: 'assignee_name',
          headerText: 'Người nhận',
          allowFiltering: true
        },
        {
          fieldName: 'nhom_cv',
          headerText: 'Nhóm công việc',
          allowFiltering: true
        },
        {
          fieldName: 'loai_cv',
          headerText: 'Loại công việc',
          allowFiltering: true
        },
        {
          fieldName: 'board_name',
          headerText: 'Bảng công việc',
          allowFiltering: true
        },
        {
          fieldName: 'step_name',
          headerText: 'Giai đoạn',
          allowFiltering: true
        }
      ],
      dataSources: [],
      selectedIds: [],
      monthViewTitle: '',
      typeMapping: {
        dung_han: "HOÀN THÀNH ĐÚNG HẠN",
        som_han: "HOÀN THÀNH SỚM HẠN",
        tre_han: "HOÀN THÀNH TRỄ HẠN",
        binh_thuong: "BÌNH THƯỜNG HOÀN THÀNH",
        quan_trong: "QUAN TRỌNG HOÀN THÀNH",
        rat_quan_trong: "RẤT QUAN TRỌNG HOÀN THÀNH"
      }
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

      return Math.round(total * 100) / 100
    },
    header() {
      return `<span class="icon one-notepad"></span>
    DANH SÁCH CÔNG VIỆC ${this.typeMapping[this.type_request]} THÁNG ${this.monthViewTitle}`;
    }
  },
  methods: {
    showModal() {
      this.$refs["popupViewBscDetail"].show()
    },
    hideModal() {
      this.dataSources = []
      this.$refs["popupViewBscDetail"].hide()
    },
    handleShowModal() {
      // this.clear()
      setTimeout(() => {
        this.monthViewTitle = this.formatMonthRequest(this.month_request)
        this.GetTaskDetailUserMonth()
      }, 200)
    },
    clear() {
      this.dataSources = []
    },
    async GetTaskDetailUserMonth() {
      try {
        if (this.user_id_request == 0) return this.$toast.error('Vui lòng chọn Nhân sự!');
        let response = await API.GetTaskDetailUserMonth(this.axios, {
          month: this.monthViewTitle,
          assignee_id: this.user_id_request,
          type: this.type_request
        })
        if (response.data.success) {
          if (response.data.data) {
            var data = JSON.parse(response.data.data);
            this.dataSources = data.concat([])
          }
          else {
            this.dataSources = []
          }
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    formatMonthRequest(value) {
      // Nếu đã đúng dạng "MM/YYYY" thì giữ nguyên
      const regex = /^\d{2}\/\d{4}$/;
      if (regex.test(value)) {
        return value;
      }

      // Nếu là dạng Date hoặc string date → convert
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        console.error("Giá trị không phải ngày hợp lệ:", value);
        return null;
      }

      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${month}/${year}`;
    },
    formatDate(value) {
      if (!value) return "";
      return moment(value).format("DD/MM/YYYY");
    }
  },
  watch: {
  },
  mounted() {
    // this.monthViewTitle = this.formatMonthRequest(this.month_request)
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