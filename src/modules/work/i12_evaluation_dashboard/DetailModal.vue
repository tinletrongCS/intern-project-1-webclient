<template>
  <ejs-dialog
    ref="detailModal"
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="true"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    :showCloseIcon="true"
    width="60%"
    height="auto"
    :isModal="true"
    :target="target"
    :header="header"
  >
    <div class="modal-content">
      <div class="modal-body">
        <div class="info-group">
          <div class="info-row">
            <label class="info-label">Trung tâm:</label>
            <span class="info-value">{{ currentData.ten_trung_tam ?? '' }}</span>
          </div>
          <div class="info-row">
            <label class="info-label">Phòng ban:</label>
            <span class="info-value">{{ currentData.phongban ? currentData.phongban : '--' }}</span>
          </div>
          <div class="info-row">
            <label class="info-label">Nhân sự:</label>
            <span class="info-value">{{ currentData.nguoinhan && !currentData.is_total_row ? currentData.nguoinhan : '--' }}</span>
          </div>
          <div class="info-row">
            <label class="info-label">Tháng:</label>
            <span class="info-value">{{ currentMonth }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section mt-4" v-if="selectedColumn">
        <h5>{{ selectedColumn.label }}</h5>
        
        <KDataGrid
          :dataSource="allDetailData"
          :columns="gridColumns"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="true"
          :enabledSelectFirstRow="false"
          :allowSorting="true"
          :width="'100%'"
          :selectionSettings="{
            type: 'Single',
            mode: 'Row',
            enableToggle: false,
          }"
        />
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import { DETAIL_COLUMNS, mapTaskData } from "./ColumnConfig";
import KDataGrid from "@/components/controls/KDataGrid";

export default {
  name: "DetailModal",
  components: {
    KDataGrid,
  },
  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: "Chi tiết đánh giá",
      currentData: {},
      selectedColumn: null,
      currentMonth: "",
      DETAIL_COLUMNS,
    };
  },

  computed: {
    allDetailData() {
      let tasks = [];

      // Lấy danh sách task từ currentData
      if (this.currentData.tasks && Array.isArray(this.currentData.tasks)) {
        tasks = this.currentData.tasks;
      } else if (
        this.currentData.chi_tiet_task &&
        Array.isArray(this.currentData.chi_tiet_task)
      ) {
        tasks = this.currentData.chi_tiet_task;
      }

      // Transform tasks using mapTaskData from ColumnConfig
      return tasks.map((task) => ({
        id: task.task_id || Math.random(),
        ...mapTaskData(task),
      }));
    },

    gridColumns() {
      return DETAIL_COLUMNS.map(col => ({
        headerText: col.label,
        fieldName: col.key,  // Use key after mapping with mapTaskData
        width: this.getColumnWidth(col),
        textAlign: col.type !== undefined && col.type !== 'text' ? 'Center' : 'Left',
      }));
    },
  },

  methods: {
    /**
     * Mở modal với dữ liệu
     * @param {Object} data - Dữ liệu row
     * @param {Object} column - Cột được click (columnKey, label)
     * @param {String} month - Tháng hiện tại
     */
    showModal(data, column, month) {
      this.currentData = data;
      this.selectedColumn = column;
      this.currentMonth = month;
      this.header = `Chi tiết đánh giá - ${column.label}`;
      this.$refs.detailModal.show();
    },

    hideModal() {
      this.$refs.detailModal.hide();
    },

    /**
     * Lấy dữ liệu chi tiết dựa theo column được chọn
     */
    getDetailData() {
      return this.paginatedDetailData;
    },

    /**
     * Đi tới trang cụ thể
     */
    goToDetailPage(page) {
      if (page >= 1 && page <= this.totalDetailPages) {
        this.pageSettings.currentPage = page;
      }
    },

    /**
     * Thay đổi số bản ghi trên trang
     */
    onDetailPageSizeChange() {
      this.pageSettings.currentPage = 1; // Reset về trang đầu
    },

    /**
     * Lấy width của cột dựa theo config
     * Cột nội dung (noi_dung_task) được set rộng hơn
     */
    getColumnWidth(col) {
      // Cột nội dung được set rộng hơn
      if (col.key === 'noi_dung_task') {
        return col.width ? `${col.width * 2}` : '300';
      }
      // Các cột khác dùng width từ config
      return col.width ? `${col.width}` : '100';
    },
  },
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
  overflow-x: auto;
}

.modal-body {
  max-height: 500px;
  overflow-y: auto;
}

.info-group {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  min-width: 120px;
  color: #333;
}

.info-value {
  color: #666;
  flex: 1;
}

.detail-section {
  margin-bottom: 20px;
  overflow-x: auto;
}

.detail-section h5 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-weight: 700;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif, "-apple-system", "BlinkMacSystemFont";
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-color: #dee2e6;
  vertical-align: middle;
}

.table tbody td {
  border-color: #dee2e6;
  padding: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

/* Table wrapper with horizontal scroll */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.table-wrapper table {
  width: auto;
  margin-bottom: 0;
  table-layout: auto;
  min-width: 100%;
}

.table-wrapper table th,
.table-wrapper table td {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  white-space: normal;
  word-wrap: break-word;
}

.table-wrapper table th {
  background-color: #f8f9fa;
  font-weight: 600;
}
</style>
