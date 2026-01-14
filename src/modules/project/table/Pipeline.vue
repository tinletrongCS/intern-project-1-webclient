<template>
  <div class="grid-ext pipeline-grid">
    <!-- Thanh scroll ngang ở trên -->
    <div class="top-scroll-wrapper" ref="topScroll">
      <div class="top-scroll-content" ref="topScrollContent"></div>
    </div>
    
    <!-- Bảng pipeline -->
    <div class="table-content pipeline-table-wrapper" ref="tableWrapper" @scroll="syncTopScroll">
      <table class="table table-result pipeline-table">
        <thead class="center">
          <tr>
            <th 
              class="w30 checkbox-column" 
              v-if="showColumnCheckbox"
              :class="{ 'freeze-left': columnCheckboxFreeze }"
            >
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
                :disabled="!hasData"
              />
            </th>
            <th class="w50 stt-column">STT</th>
            <!-- Checkbox column theo pattern KDataGrid -->
            <th class="w50 action-column" v-if="showActionColumn">Chức năng</th>
            <th 
              v-for="(column, index) in columns" 
              :key="`header-${index}`"
              :class="{ 
                'fixed-column': column.isFixed,
                'pipeline-step': column.isPipelineStep,
                'w40': column.width === 'w40'
              }"
              :style="{ width: column.width }"
            >
              {{ column.headerText }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, rowIndex) in dataItems" 
            :key="`row-${item.id || rowIndex}`"
            :class="{ 
              'highlight': isRowSelected(item) || rowSelected === rowIndex + 1 
            }"
            @click="onRowClick(rowIndex + 1, item)"
            @dblclick="doubleClickRow(rowIndex + 1, item)"
          >
            <!-- Checkbox column -->
            <td 
              class="w30 center checkbox-column" 
              v-if="showColumnCheckbox"
              :class="{ 
                'highlight1': isRowSelected(item) || rowSelected === rowIndex + 1,
                'freeze-left': columnCheckboxFreeze
              }"
            >
              <input 
                type="checkbox" 
                :checked="isRowSelected(item)"
                @click.stop="toggleSelection(item)"
                @change="onCheckboxChange(item)"
              />
            </td>
            <!-- Cột STT -->
            <td class="w20 center stt-column" :class="{ highlight1: isRowSelected(item) || rowSelected === rowIndex + 1 }">
              <span class="fa fa-play text-main" v-if="isRowSelected(item) || rowSelected === rowIndex + 1"></span>
              <span v-else>{{ rowIndex + 1 }}</span>
            </td>
            
            <!-- Cột chức năng -->
            <td class="w20 center action-column" :class="{ highlight1: isRowSelected(item) || rowSelected === rowIndex + 1 }" v-if="showActionColumn">
              <div class="dropdown-wrapper" :class="{ 'show': item.showDropdown }">
                <button 
                  class="dropdown-toggle-btn"
                  type="button"
                  @click.stop="toggleDropdown(item, rowIndex)"
                  @blur="hideDropdown(item)"
                >
                  <i class="fa fa-ellipsis-v"></i>
                </button>
                
                <ul class="dropdown-menu" v-if="item.showDropdown && hasActionHandlers">
                  <li v-if="hasViewDetail">
                    <a href="#" class="dropdown-item" @click.prevent="viewDetail(item)">
                      <i class="fa fa-eye"></i>
                      Xem chi tiết
                    </a>
                  </li>
                  <li v-if="hasEditItem">
                    <a href="#" class="dropdown-item" @click.prevent="editItem(item)">
                      <i class="fa fa-edit"></i>
                      Chỉnh sửa
                    </a>
                  </li>
                  <li v-if="hasDuplicateItem">
                    <a href="#" class="dropdown-item" @click.prevent="duplicateItem(item)">
                      <i class="fa fa-copy"></i>
                      Dự kiến doanh thu
                    </a>
                  </li>
                  <li v-if="hasMarkCompleted">
                    <a href="#" class="dropdown-item" @click.prevent="markAsCompleted(item)">
                      <i class="fa fa-check"></i>
                      Hoàn thành dự án
                    </a>
                  </li>
                  <li v-if="hasDeleteItem">
                    <a href="#" class="dropdown-item text-danger" @click.prevent="deleteItem(item)">
                      <i class="fa fa-trash"></i>
                      Xóa
                    </a>
                  </li>
                </ul>
              </div>
            </td>
            
            <td 
              v-for="(column, colIndex) in columns" 
              :key="`cell-${rowIndex}-${colIndex}`"
              :class="{ 
                'fixed-column': column.isFixed,
                'pipeline-step': column.isPipelineStep,
                'highlight1': isRowSelected(item) || rowSelected === rowIndex + 1,
                'w40': column.width === 'w40',
                'text-right': typeof getFieldValue(item, column.fieldName) === 'number',
                'limit-3-line-column': column.fieldName === 'projectName' || column.headerText === 'Dự án' || 
                                       column.fieldName === 'customerName' || column.headerText === 'Tên khách hàng'
              }"
            >
              <!-- Cột thông tin thông thường -->
              <div v-if="!column.isPipelineStep" class="cell-content">
                <div v-if="column.fieldName === 'projectName' || column.headerText === 'Dự án'">
                  <div v-if="item.is_completed || item.isCompleted || item.is_locked || item.isLocked" class="row no-gutters">
                    <div class="col-11">
                      <div 
                        :class="{
                          'limit-3-line-text': true
                        }">
                        {{ getFieldValue(item, column.fieldName) }}
                      </div>
                    </div>
                    <div class="col-1">
                      <div class="status-badges-container">
                        <span v-if="item.is_completed || item.isCompleted" 
                              class="status-badge status-completed"
                              title="Hoàn thành">
                          <i class="fa fa-check"></i>
                        </span>
                        <span v-if="item.is_locked || item.isLocked" 
                              class="status-badge status-locked"
                              title="Khóa">
                          <i class="fa fa-lock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else
                    :class="{
                      'limit-3-line-text': true
                    }">
                    {{ getFieldValue(item, column.fieldName) }}
                  </div>
                </div>
                
                <div v-else
                  :class="{
                    'limit-3-line-text': column.fieldName === 'customerName' || column.headerText === 'Tên khách hàng'
                  }">
                  {{ getFieldValue(item, column.fieldName) }}
                </div>
              </div>
              
              <!-- Cột pipeline step -->
              <div 
                v-else 
                class="pipeline-step-cell" 
                :class="getPipelineStepClass(item, column.fieldName)"
                @click.stop="openStepModal(item, column)"
              >
                <div v-if="getFieldValue(item, column.fieldName) && getFieldValue(item, column.fieldName).pendingData" class="pending-approval-label">
                    <i class="fa fa-clock-o"></i> Chờ PM phê duyệt
                </div>

                <div v-else>
                    <div v-if="getStepDate(item, column.fieldName)" class="step-date">
                        {{ formatDate(getStepDate(item, column.fieldName)) }}
                    </div>
                    
                    <div v-if="isOverdue(item, column.fieldName)" class="overdue-label">
                        Trễ hạn
                    </div>
                    <div v-else-if="isDueSoon(item, column.fieldName)" class="due-soon-label">
                        Sắp đến hạn
                    </div>
                    
                    <div v-if="!getStepDate(item, column.fieldName)" class="no-date-placeholder">
                        <i class="fa fa-plus"></i>
                    </div>
                </div>
              </div>
            </td>
          </tr>
          
          <!-- Empty row khi không có dữ liệu -->
          <tr v-if="!hasData" class="empty">
            <td :colspan="totalColumns" class="text-center">
              Không có bản ghi nào để hiển thị
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination using existing component -->
    <Pagination
      v-if="allowPaging && hasData"
      ref="pagination"
      :pageSize="pageSizeData"
      :pageIndex="pageIndexData"
      :totalRecords="getTotalRecords"
      @pageChanged="handlePageChanged"
    />

    <!-- Modal cho pipeline step -->
    <ejs-dialog
      ref="stepModal"
      :visible="false"
      :isModal="true"
      :showCloseIcon="false"
      width="30%"
      :header="''"
      :animationSettings="{ effect: 'Zoom' }"
      @close="closeModal"
    >
      <div class="h-100 d-flex flex-column">
        <!-- Custom Modal Header -->
        <div class="modal-header-custom border-bottom">
          <div class="modal-title-custom">
            <div class="step-name">{{ currentColumn ? currentColumn.headerText : '' }}</div>
            <div class="project-name">{{"Dự án: "}}{{ currentItem ? currentItem.projectName : '' }}</div>
          </div>
          <button type="button" class="btn-close-custom" @click="closeModal" aria-label="Close">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <!-- Tab Navigation - Tạm thời ẩn -->
        <!--
        <div class="tab-navigation">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item bold ml-2" role="presentation">
              <button 
                type="button"
                class="nav-link active"
                role="tab"
              >
                Thông tin chung
              </button>
            </li>
          </ul>
        </div>
        -->

        <!-- Tab Content -->
        <div class="flex-grow-1 overflow-auto p-3">
          <div class="container-fluid">
            <!-- Tab 1: Thông tin chung -->
            <div v-show="activeTab === 'general-info'" class="tab-content-panel">
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label class="form-label bold">Dự kiến hoàn thành</label>
                    <ejs-datepicker
                      v-model="modalData.date"
                      format="dd/MM/yyyy"
                      :showClearButton="true"
                      :allowEdit="true"
                      locale="vi"
                      :firstDayOfWeek="1"
                      placeholder="Ngày/Tháng/Năm"
                    />
                  </div>
                  <div v-if="modalData.statusId === 3" class="form-group">
                    <label class="form-label bold">Ngày hoàn thành</label>
                    <input
                      type="text"
                      :value="modalData.completionDate"
                      class="form-control"
                      disabled
                      placeholder="Backend tự động ghi nhận"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label bold">Trạng thái</label>
                    <select2
                      v-model="modalData.statusId" 
                      :options="statusOptions"
                      placeholder="Chưa thực hiện"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Phần báo cáo tạm thời bị ẩn -->
            <!-- 
            <div v-show="activeTab === 'report'" class="tab-content-panel">
              <div class="report-content">
                <KDataGrid
                  ref="reportGrid"
                  :columns="reportColumns"
                  :dataSource="reportData"
                  :allowPaging="true"
                  :showSTT="true"
                  :pageSize="reportPageSize"
                  :enablePagingServer="false"
                  :showColumnCheckbox="false"
                  :allowSelection="true"
                  :selectionSettings="{ type: 'Single' }"
                  :tableHeight="400"
                  @rowDoubleClicked="onReportRowDoubleClick"
                />
              </div>
            </div>
            -->
          </div>
        </div>

        <!-- Modal Footer Buttons -->
        <div class="modal-footer">
            <button v-if="isCurrentUserPm && hasPendingApproval" 
              type="button"
              @click="approveStep"
              class="btn btn-second">
              <i class="fa fa-check"></i> Phê duyệt
            </button>
            <button v-if="isCurrentUserPm && hasPendingApproval" 
              type="button"
              @click="rejectStep"
              class="btn btn-second">
              <i class="fa fa-times"></i> Từ chối
            </button>
            
            <button v-if="canSaveStep"
              type="button"
              @click="saveStepData"
              class="btn btn-second">
              <i class="fa fa-save"></i> Lưu
            </button>
            
            <button
              type="button"
              @click="closeModal"
              class="btn btn-second mr-4">
              Đóng
            </button>
        </div>
      </div>
    </ejs-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '../../../components/controls/Pagination'
import KDataGrid from '../../../components/controls/KDataGrid'

export default {
  name: 'Pipeline',
  components: {
    Pagination,
    KDataGrid
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    // Additional props for compatibility with other components
    dataSource: {
      type: Array,
      default: () => []
    },
    tableHeight: {
      type: Number,
      default: 0
    },
    panelDataHeight: {
      type: String,
      default: "auto"
    },
    rowSelectedIndex: {
      type: Number,
      default: -1
    },
    allowSelection: {
      type: Boolean,
      default: true
    },
    showDropArea: {
      type: Boolean,
      default: false
    },
    // Props for action column
    showActionColumn: {
      type: Boolean,
      default: true
    },
    showColumnCheckbox: {
      type: Boolean,
      default: false
    },
    columnCheckboxFreeze: {
      type: Boolean,
      default: false
    },
    // Props for selection settings
    selectionSettings: {
      type: Object,
      default: () => ({})
    },
    defaultColumnCheckboxChecked: {
      type: Boolean,
      default: false
    },
    // Pagination props
    allowPaging: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageIndex: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    enablePagingServer: {
      type: Boolean,
      default: true
    },
    hasUpdatePipelineStep: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      modalData: {
        statusId: null,
        date: null,
        completionDate: null 
      },
      isCurrentUserPm: false,
      isCurrentUserTpm: false,
      hasPendingApproval: false,
      pendingStepData: null,
      currentItem: null,
      currentColumn: null,
      modalTitle: '',
      rowSelected: this.rowSelectedIndex,
      selectedItemIds: new Set(),
      // Pagination data
      pageSizeData: this.pageSize,
      pageIndexData: this.pageIndex,
      // Tab management
      activeTab: 'general-info',
      // Report data
      // reportData: [],
      // reportPageSize: 10,
      // Report columns for KDataGrid
      // reportColumns: [
      //   { fieldName: 'reporter', headerText: 'Người báo cáo', width: '150' },
      //   { fieldName: 'content', headerText: 'Nội dung báo cáo', width: '250' },
      //   { fieldName: 'suggestion', headerText: 'Nội dung kiến nghị', width: '250' },
      //   { fieldName: 'attachmentDisplay', headerText: 'File đính kèm', width: '120', textAlign: 'Center' },
      //   { fieldName: 'createdDateDisplay', headerText: 'Thời gian', width: '150', textAlign: 'Center' }
      // ],
    }
  },
  computed: {
    hasData() {
      return !(this.dataItems == null || this.dataItems.length == 0)
    },
    canSaveStep() {
      if (!this.currentColumn) {
        return false;
      }
      // Lấy dữ liệu của bước pipeline hiện tại
      const stepData = this.getFieldValue(this.currentItem, this.currentColumn.fieldName) || {};
      const isNewStep = !stepData.statusId;
      // Trường hợp THÊM MỚI: Bất kỳ ai cũng có thể lưu
      if (isNewStep) {
        return true;
      }
      // Trường hợp CHỈNH SỬA:
      if (this.hasPendingApproval) {
        // Nếu ĐANG CHỜ DUYỆT: Chỉ TPM mới có quyền Lưu (để sửa lại yêu cầu)
        // PM sẽ thấy nút Phê duyệt/Từ chối thay vì nút Lưu
        return this.isCurrentUserTpm;
      } else {
        // Nếu KHÔNG chờ duyệt: Cả PM và TPM đều có quyền Lưu (để tạo yêu cầu mới)
        return this.isCurrentUserPm || this.isCurrentUserTpm;
      }
    },
    dataItems() {
      // Use dataSource if provided, otherwise use data prop
      let result = this.dataSource && this.dataSource.length > 0 ? this.dataSource : this.data
      
      // Ensure result is always an array
      if (!Array.isArray(result)) {
        result = []
      }
      
      // Apply pagination if enabled
      if (this.allowPaging && !this.enablePagingServer) {
        const startIndex = this.pageIndexData * this.pageSizeData
        const endIndex = startIndex + this.pageSizeData
        result = result.slice(startIndex, endIndex)
      }
      
      return result
    },
    
    totalColumns() {
      const checkboxColumnCount = this.showColumnCheckbox ? 1 : 0
      const actionColumnCount = this.showActionColumn ? 1 : 0
      return this.columns.length + 1 + checkboxColumnCount + actionColumnCount // +1 for STT
    },
    
    getHeight() {
      if (this.tableHeight > 0) {
        return this.tableHeight + 'px'
      }
      return this.panelDataHeight === "auto" ? "auto" : this.panelDataHeight
    },
    
    isAllSelected() {
        if (!this.hasData) return false;
        return this.dataItems.length === this.selectedItemIds.size;
    },
    
    // Selection options
    selectionOptions() {
      let result = this.selectionSettings;
      if (result == undefined || result == null) result = {};
      if (this.showColumnCheckbox) {
        if (result.type == "Single") {
          result.enableToggle = false;
        } else {
          result.type = "Multiple";
          result.enableToggle = false;
        }        
      } else {
        if (result.type == undefined) result.type = "Single";
        if (result.enableToggle == undefined) result.enableToggle = false;
      }
      return result;
    },
    
    isSelectionMultiple() {
      return this.selectionOptions.type == "Multiple";
    },
    // Check if action handlers are available
    hasActionHandlers() {
      return this.hasViewDetail || this.hasEditItem || this.hasDuplicateItem || this.hasMarkCompleted || this.hasDeleteItem
    },
    
    hasViewDetail() {
      return this.$listeners && this.$listeners['view-detail']
    },
    
    hasEditItem() {
      return this.$listeners && this.$listeners['edit-item']
    },
    
    hasDuplicateItem() {
      return this.$listeners && this.$listeners['duplicate-item']
    },
    
    hasMarkCompleted() {
      return this.$listeners && this.$listeners['mark-completed']
    },
    
    hasDeleteItem() {
      return this.$listeners && this.$listeners['delete-item']
    },
    
    // Pagination computed properties
    getTotalRecords() {
      if (this.allowPaging) {
        if (this.enablePagingServer) return this.totalRecords
        else return this.dataSource && this.dataSource.length > 0 ? this.dataSource.length : this.data.length
      }
      return 0
    },
    
    // Status options cho select2
    statusOptions() {
      return [
        { id: 1, text: 'Chưa thực hiện' },
        { id: 2, text: 'Đang thực hiện' },
        { id: 3, text: 'Hoàn thành' }
      ]
    }
  },
  methods: {

    // Selection methods
    isRowSelected(item) {
        return this.selectedItemIds.has(item.id);
    },

    toggleSelection(item) {
        if (this.isRowSelected(item)) {
            this.selectedItemIds.delete(item.id);
        } else {
            if (!this.isSelectionMultiple) {
                this.selectedItemIds.clear();
            }
            this.selectedItemIds.add(item.id);
        }
        this.$forceUpdate();
        this.emitSelectionChanged();
    },

    toggleSelectAll() {
        if (this.isAllSelected) {
            // Bỏ chọn tất cả
            this.selectedItemIds.clear();
        } else {
            // Chọn tất cả
            this.dataItems.forEach(item => this.selectedItemIds.add(item.id));
        }
        this.$forceUpdate();
        this.emitSelectionChanged();
    },
    
    emitSelectionChanged() {
        const selectedRecords = this.getSelectedRecords();
        this.$emit('selectedItemsChanged', selectedRecords.map(item => item.id));
        this.$emit('selectedRowChanged', selectedRecords.length > 0 ? selectedRecords[0] : null);
        this.$emit('onSelectedRow', selectedRecords);
    },
    
    // Method cho row click - tách riêng logic cho single/multiple selection
    onRowClick(rowIndex, item) {
        this.rowSelected = rowIndex;
        
        if (this.showColumnCheckbox) {
            // Nếu có checkbox thì chỉ emit row click, không thay đổi selection
            this.$emit('rowClicked', rowIndex - 1, item);
        } else {
            // Single selection mode
            this.selectedItemIds.clear();
            this.selectedItemIds.add(item.id);
            this.$forceUpdate();
            this.emitSelectionChanged();
            this.$emit('rowClicked', rowIndex - 1, item);
        }
    },
    
    // Method cho checkbox change
    onCheckboxChange(item) {
        // Logic đã xử lý trong toggleSelection, chỉ cần gọi
        // Method này để tương thích với pattern
    },

    getFieldValue(item, fieldPath) {
      const keys = fieldPath.split('.')
      let value = item
      for (const key of keys) {
        value = value?.[key]
      }
      return value || ''
    },
    
    getStepStatus(item, fieldPath) {
      const stepData = this.getFieldValue(item, fieldPath)
      return stepData?.status || null
    },
    
    getStepDate(item, fieldPath) {
      const stepData = this.getFieldValue(item, fieldPath)
      return stepData?.date || null
    },
    
    isOverdue(item, fieldPath) {
      const stepData = this.getFieldValue(item, fieldPath)
      return stepData?.isOverdue || false
    },
    
    isDueSoon(item, fieldPath) {
      const stepData = this.getFieldValue(item, fieldPath)
      const stepDate = stepData?.date
      const statusId = stepData?.statusId;
      if (!stepDate || statusId === 3) return false

      const today = moment().startOf('day');
      const dueDate = moment(stepDate, 'DD/MM/YYYY')
      const daysDiff = dueDate.diff(today, 'days')
      
      // Sắp đến hạn nếu còn 1-3 ngày
      return daysDiff >= 0 && daysDiff <= 3
    },

    openStepModal(item, column) {
      // Kiểm tra trạng thái của dự án
      if (item.is_completed === true) {
        this.$toast.error('Dự án đã hoàn thành, không thể thao tác.');
        return;
      }
      if (item.is_locked === true) {
        this.$toast.error('Dự án đang bị đóng, không thể thao tác.');
        return;
      }
      this.currentItem = item
      this.currentColumn = column
      this.activeTab = 'general-info' // Reset về tab đầu tiên

      this.isCurrentUserPm = item.isCurrentUserPm || false;
      this.isCurrentUserTpm = item.isCurrentUserTpm || false;
      
      const stepData = this.getFieldValue(item, column.fieldName) || {};
      this.hasPendingApproval = !!stepData.pendingData;
      
      if (this.hasPendingApproval && this.isCurrentUserPm) {
          this.modalData = {
              statusId: stepData.pendingData.proposedStatusId,
              date: stepData.pendingData.proposedDate ? moment(stepData.pendingData.proposedDate, 'DD/MM/YYYY').toDate() : null,
              completionDate: null
          };
      } else {
          this.modalData = {
              statusId: stepData.statusId || null,
              date: stepData.date ? moment(stepData.date, 'DD/MM/YYYY').toDate() : null,
              completionDate: stepData.completionDate || null
          };
      }
      this.$refs.stepModal.show()

      //Khởi tạo select2 sau khi modal hiển thị
      this.$nextTick(() => {
        this.initSelect2()
      })
    },
    
    closeModal() {
      // Destroy select2 trước khi đóng modal
      this.destroySelect2()
      
      this.$refs.stepModal.hide()
      this.currentItem = null
      this.currentColumn = null
      this.modalData = {
        status: null,
        date: null,
        completionDate: null
      }
      this.isCurrentUserPm = false;
      this.isCurrentUserTpm = false;
      this.hasPendingApproval = false;
    },
    
    saveStepData() {    
      if (this.modalData.statusId === null) {
        this.$toast.error('Vui lòng chọn trạng thái!');
        return;
      }
      
      // Tìm status text tương ứng với statusId đã chọn
      const selectedStatus = this.statusOptions.find(opt => opt.id === this.modalData.statusId);

      // Chuẩn bị dữ liệu để emit ra ngoài
      const stepDataToEmit = {
        statusId: this.modalData.statusId,
        status: selectedStatus ? selectedStatus.text.toLowerCase().replace(' ', '') : 'pending',
        date: this.modalData.date ? moment(this.modalData.date).format('DD/MM/YYYY') : null,
        isOverdue: this.modalData.date ? moment(this.modalData.date).isBefore(moment(), 'day') && this.modalData.statusId !== 3 : false
      };
      
      // Emit sự kiện để component cha gọi API
      this.$emit('step-updated', {
        item: this.currentItem,
        column: this.currentColumn,
        stepData: stepDataToEmit
      });
      
      this.closeModal();
    },
    approveStep() {
      this.$emit('step-approved', {
        projectId: this.currentItem.id,
        periodId: this.currentColumn.periodId
      });
      this.closeModal();
    },
    rejectStep() {
      this.$emit('step-rejected', {
        projectId: this.currentItem.id,
        periodId: this.currentColumn.periodId
      });
      this.closeModal();
    },
    getStepStatusId(item, fieldPath) {
      const stepData = this.getFieldValue(item, fieldPath);
      return stepData?.statusId || null;
    },

    getPipelineStepClass(item, fieldName) {
      const statusId = this.getStepStatusId(item, fieldName);
      const statusClassMap = {
        1: 'pending',
        2: 'ongoing',
        3: 'completed'
      };
      return `pipeline-step-${statusClassMap[statusId] || 'default'}`;
    },
    
    // Get CSS class for status indicator
    getStatusClass(item, fieldName) {
      const status = this.getStepStatus(item, fieldName);
      const statusClassMap = {
        1: 'pending',
        2: 'ongoing',
        3: 'completed'
      };
      const statusClass = statusClassMap[status] || null;
      return `status-icon status-${statusClass}`;
    },
    
    // Get status text for display
    getStatusText(status) {
      const statusMap = {
        1: 'Chưa thực hiện',
        2: 'Đang thực hiện', 
        3: 'Hoàn thành'
      };
      return statusMap[status] || 'Chưa xác định';
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      return moment(dateString, 'DD/MM/YYYY').format('DD/MM/YYYY')
    },
    
    initSelect2() {
      if (this.$refs.statusSelect) {
        $(this.$refs.statusSelect).select2({
          width: '100%',
          minimumResultsForSearch: Infinity, // Ẩn search box
          placeholder: 'Chọn trạng thái...'
        }).on('change', (e) => {
          this.modalData.status = e.target.value
        })
      }
    },
    
    destroySelect2() {
      if (this.$refs.statusSelect) {
        $(this.$refs.statusSelect).select2('destroy')
      }
    },
    
    // Row selection methods
    onSelectedRow(item) {
        if (this.showColumnCheckbox) {
            this.toggleSelection(item);
        } else {
            this.selectedItemIds.clear();
            this.selectedItemIds.add(item.id);
            this.$forceUpdate();
            this.emitSelectionChanged();
        }
    },
    
    doubleClickRow(rowIndex, item) {
      this.$emit('doubleClickRow', item)
      this.$emit('rowDoubleClicked', rowIndex - 1, item)
    },
    
  
    getSelectedRecords() {
      if (this.selectedItemIds.size === 0) return [];
      return this.dataItems.filter(item => this.selectedItemIds.has(item.id));
    },
    
    getSelectedValues(selectedRecords) {
      let result = [];
      if (selectedRecords != null) {
        for (let i = 0; i < selectedRecords.length; i++) {
          const item = selectedRecords[i];
          result.push(item.id || item); // Use id as key field
        }
      }
      return result;
    },
    
    selectRow(index, isToggle) {
      if (index < this.dataItems.length) {
        const item = this.dataItems[index];
        if (isToggle && this.isRowSelected(item)) {
          this.selectedItemIds.delete(item.id);
        } else {
          if (!this.isSelectionMultiple) {
            this.selectedItemIds.clear();
          }
          this.selectedItemIds.add(item.id);
        }
        this.$forceUpdate();
        this.emitSelectionChanged();
      }
    },
    
    selectRows(rowIndexes) {
      if (!this.isSelectionMultiple) {
        if (rowIndexes.length > 0) {
          this.selectRow(rowIndexes[0]);
        }
        return;
      }
      
      this.selectedItemIds.clear();
      rowIndexes.forEach(index => {
        if (index < this.dataItems.length) {
          const item = this.dataItems[index];
          this.selectedItemIds.add(item.id);
        }
      });
      this.$forceUpdate();
      this.emitSelectionChanged();
    },
    
    clearSelection() {
      this.selectedItemIds.clear();
      this.rowSelected = -1;
      this.$forceUpdate();
      this.emitSelectionChanged();
    },
    
    // Dropdown functions
    toggleDropdown(item, index) {
      // Ẩn tất cả dropdown khác
      this.dataItems.forEach(dataItem => {
        if (dataItem !== item) {
          this.$set(dataItem, 'showDropdown', false)
        }
      })
      
      // Toggle dropdown hiện tại
      this.$set(item, 'showDropdown', !item.showDropdown)
    },
    
    hideDropdown(item) {
      setTimeout(() => {
        this.$set(item, 'showDropdown', false)
      }, 150)
    },
    
    // Action functions
    viewDetail(item) {
      this.$set(item, 'showDropdown', false)
      this.$emit('view-detail', item)
    },
    
    editItem(item) {
      this.$set(item, 'showDropdown', false)
      this.$emit('edit-item', item)
    },
    
    duplicateItem(item) {
      this.$set(item, 'showDropdown', false)
      this.$emit('duplicate-item', item)
    },
    
    markAsCompleted(item) {
      this.$set(item, 'showDropdown', false)
      this.$emit('mark-completed', item)
    },
    
    deleteItem(item) {
      this.$set(item, 'showDropdown', false)
      if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
        this.$emit('delete-item', item)
      }
    },
    
    // Pagination method - sử dụng với component Pagination
    handlePageChanged(pageArgs) {
      this.pageIndexData = pageArgs.pageIndex
      this.pageSizeData = pageArgs.pageSize
      this.$emit('pageChanged', pageArgs)
    },
    
    // Tab management methods
    switchTab(tabName) {
      this.activeTab = tabName
      if (tabName === 'report') {
        this.loadReportData()
      }
    },
    
    // // Report methods
    // loadReportData() {
    //   // TODO: Load actual report data from API
    //   // For now, use mock data with proper formatting for KDataGrid
    //   const mockReports = [
    //     {
    //       id: 1,
    //       reporter: 'Nguyễn Văn A',
    //       content: 'Báo cáo tiến độ công việc tuần 1',
    //       suggestion: 'Cần tăng cường nhân lực cho giai đoạn tiếp theo',
    //       hasAttachment: true,
    //       createdDate: '2024-08-10T10:30:00'
    //     },
    //     {
    //       id: 2,
    //       reporter: 'Trần Thị B',
    //       content: 'Báo cáo vấn đề kỹ thuật',
    //       suggestion: 'Đề xuất thay đổi công nghệ',
    //       hasAttachment: false,
    //       createdDate: '2024-08-12T14:15:00'
    //     }
    //   ];
      
    //   // Format data for KDataGrid display
    //   this.reportData = mockReports.map(report => ({
    //     ...report,
    //     attachmentDisplay: report.hasAttachment ? 'Có' : '-',
    //     createdDateDisplay: this.formatDateTime(report.createdDate)
    //   }));
    // },
    
    // onReportRowDoubleClick(rowIndex, rowData) {
    //   // Handle double click on report row
    //   console.log('Report double clicked:', rowData);
    //   // TODO: Open report detail modal
    // },
    
    // formatDateTime(dateString) {
    //   if (!dateString) return ''
    //   return moment(dateString).format('DD/MM/YYYY HH:mm')
    // }

    // Top scroll methods
    syncTopScroll() {
      if (this.$refs.topScroll && this.$refs.tableWrapper) {
        this.$refs.topScroll.scrollLeft = this.$refs.tableWrapper.scrollLeft;
      }
    },

    initTopScroll() {
      if (this.$refs.topScrollContent && this.$refs.tableWrapper) {
        // Set width của top scroll content bằng scroll width của table
        const table = this.$refs.tableWrapper.querySelector('table');
        if (table) {
          this.$refs.topScrollContent.style.width = table.scrollWidth + 'px';
        }
      }
    },

    onTopScroll() {
      if (this.$refs.topScroll && this.$refs.tableWrapper) {
        this.$refs.tableWrapper.scrollLeft = this.$refs.topScroll.scrollLeft;
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initTopScroll();
      
      // Add event listener cho top scroll
      if (this.$refs.topScroll) {
        this.$refs.topScroll.addEventListener('scroll', this.onTopScroll);
      }
    });
  },

  beforeDestroy() {
    // Remove event listener
    if (this.$refs.topScroll) {
      this.$refs.topScroll.removeEventListener('scroll', this.onTopScroll);
    }
  },
  
  watch: {
    rowSelectedIndex(val) {
      this.rowSelected = val
    },
    
    dataSource: {
      handler(newVal) {
        if (newVal) {
          // Reset selection when data changes
          this.rowSelected = this.rowSelectedIndex;
          // Clear invalid selections
          const validIds = new Set(newVal.map(item => item.id));
          const currentSelection = Array.from(this.selectedItemIds);
          currentSelection.forEach(id => {
            if (!validIds.has(id)) {
              this.selectedItemIds.delete(id);
            }
          });
          
          // Update top scroll after data changes
          this.$nextTick(() => {
            this.initTopScroll();
          });
        }
      },
      deep: true
    },
    
    // Watch defaultColumnCheckboxChecked như KDataGrid
    defaultColumnCheckboxChecked: {
      handler(newVal) {
        if (newVal && this.hasData) {
          // Select all items when defaultColumnCheckboxChecked is true
          this.dataItems.forEach(item => this.selectedItemIds.add(item.id));
          this.$forceUpdate();
          this.emitSelectionChanged();
        }
      },
      immediate: true
    },
    
    // Watch pagination props
    pageIndex(newVal) {
      this.pageIndexData = newVal
    },
    
    pageSize(newVal) {
      this.pageSizeData = newVal
    }
  }
}
</script>

<style scoped>
.pending-approval-label {
    font-size: 11px;
    font-style: italic;
    color: #e67e22; /* Màu cam */
    font-weight: 600;
}
.pipeline-step-cell.pipeline-step-pending-approval {
    background-color: #f39c123b;
    border: 1px solid #f39c12;
}

.grid-ext.pipeline-grid {
  width: 100%;
  overflow: hidden;
}

/* Top scroll bar */
.top-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: #f8f9fa;
  border: 1px solid rgba(1, 1, 1, 0.2);
}

.top-scroll-content {
  height: 1px;
  background: transparent;
}

.table-content.pipeline-table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 70vh;
  border: 1px solid rgba(1, 1, 1, 0.2);
}

/* Chỉ ẩn thanh scroll ngang, giữ thanh scroll dọc */
.table-content.pipeline-table-wrapper::-webkit-scrollbar:horizontal {
  display: none;
}

.table.table-result.pipeline-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  table-layout: fixed;
  margin: 0;
  padding: 0;
}

.pipeline-table th,
.pipeline-table td {
  white-space: normal;
  word-wrap: break-word;
  position: relative;
  vertical-align: middle;
  margin: 0;
  padding: 6px 8px;
  border: 1px solid #ddd;
}
/* CSS chung cho các cột giới hạn 3 dòng text */
.pipeline-table td.limit-3-line-column {
  max-height: 72px; /* Khoảng 3 dòng text */
  overflow: hidden;
}

.limit-3-line-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 4.2em; /* 3 lines * 1.4 line-height */
}
.pipeline-table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #BAE7FF;
  font-weight: 600;
}

.pipeline-table .center {
  text-align: center;
}

.pipeline-table .text-right {
  text-align: right;
}

/* Row highlighting - sử dụng class highlight có sẵn */
.pipeline-table tbody tr:hover {
  background-color: #FFF9EB !important;
}

.pipeline-table tbody td.highlight1 {
  background-color: #F9E1A9 !important;
}

.pipeline-table .text-main {
  color: #007bff;
}

/* Column width classes - thêm class cho checkbox */
.w20 {
  width: 60px;
  min-width: 60px;
}

.w30 {
  width: 39px;
  min-width: 39px;
  max-width: 39px;
}

.w40 {
  width: 100px;
  min-width: 100px;
}

.w50 {
  width: 70px;
  min-width: 70px;
  max-width: 70px;
}

/* Sticky columns - thêm checkbox column */
.stt-column {
  /* position: sticky !important; */
  background-color: #f9f9f9 !important;
  z-index: 5 !important;
}

.checkbox-column {
  background-color: #f9f9f9 !important;
  z-index: 5 !important;
}

.checkbox-column.freeze-left {
  position: sticky !important;
  left: 70px !important;
}

.action-column {
  /* position: sticky !important; */
  left: 60px !important;
  background-color: #f9f9f9 !important;
  z-index: 5 !important;
}

/* Update action column left position khi có checkbox */
.pipeline-table .checkbox-column ~ .action-column {
  left: 109px !important; /* 70px (STT) + 39px (checkbox) */
}

.pipeline-table thead .stt-column,
.pipeline-table thead .checkbox-column,
.pipeline-table thead .action-column {
  background-color: #BAE7FF !important;
  z-index: 15 !important;
}

.fixed-column {
  /* position: sticky; */
  background-color: #f9f9f9;
  z-index: 5;
}

/* Status badges for project status */
.cell-content {
  width: 100%;
}

.cell-content .row {
  margin: 0;
  align-items: center;
}

.cell-content .col-8,
.cell-content .col-4 {
  padding: 0 2px;
}

.status-badges-container {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-locked {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.pipeline-table thead .fixed-column {
  background-color: #BAE7FF;
  z-index: 15;
}

/* Checkbox styling theo pattern KDataGrid */
.checkbox-column input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
}

.checkbox-column input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Empty row styles */
.pipeline-table tbody tr.empty td {
  padding: 20px;
  font-style: italic;
  color: #6c757d;
  text-align: center;
}

/* Pipeline specific styles */
.pipeline-step {
  min-width: 150px;
  width: 150px;
}

.pipeline-step-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  text-align: center;
  position: relative;
  min-height: 60px;
  min-width: 120px;
}

/* Pipeline step status colors */
.pipeline-step-cell.pipeline-step-pending {
  background-color: #6c757d4c;
  border: 1px solid #6c757d;
}

.pipeline-step-cell.pipeline-step-ongoing {
  background-color: #07eeff69;
  border: 1px solid #07eeff;
}

.pipeline-step-cell.pipeline-step-completed {
  background-color: #0178ff7e;
  border: 1px solid #0176FF;
}

/* Status indicator */
.step-status-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid;
  margin-bottom: 4px;
}

.step-date {
  font-size: 12px;
  font-weight: 600;
  color: #000000;
}

.no-date-placeholder {
  font-size: 16px;
  color: var(--color-main);
  transition: opacity 0.2s ease;
}

.pipeline-step-cell:hover .no-date-placeholder {
  opacity: 1;
  color: #495057;
}

.overdue-label {
  font-size: 10px;
  background-color: #dc3545;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.due-soon-label {
  font-size: 10px;
  background-color: #ffc107;
  color: #212529;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

/* Dropdown styles */
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  color: #6c757d;
  transition: all 0.2s ease;
}

.dropdown-toggle-btn:hover {
  background-color: #e9ecef;
  color: #495057;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 180px;
  animation: fadeIn 0.15s ease-in-out;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  list-style: none;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #495057;
  text-decoration: none;
  font-size: 13px;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #495057;
  text-decoration: none;
}

.dropdown-item.text-danger {
  color: #dc3545;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24;
}

.dropdown-item i {
  margin-right: 8px;
  width: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-modal-content {
  padding: 20px;
}

.modal-buttons {
  text-align: right;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.btn:hover {
  opacity: 0.9;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 15px;
}

/* Tab styling */
.tab-navigation {
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 0;
}

.nav-tabs {
  border-bottom: none;
}

.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  color: #495057;
  background-color: transparent;
  padding: 0.75rem 1rem;
  margin-bottom: -1px;
  text-decoration: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  outline: none;
}

.nav-tabs .nav-link:hover {
  border-color: #e9ecef #e9ecef #dee2e6;
  isolation: isolate;
  background-color: #f8f9fa;
}

.nav-tabs .nav-link:focus {
  outline: none;
  box-shadow: none;
}

.nav-tabs .nav-link.active {
  background-color: #fff;
  border-color: #8dbadd #8dbadd #fff;
  color: #035FCC;
}

/* Report table styling */
.report-content .table {
  margin-bottom: 0;
}

.report-content .table thead th {
  background-color: #f8f9fa;
  border-top: none;
  font-weight: 600;
  font-size: 0.875rem;
}

.report-content .table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Custom modal title styling */
.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  position: relative;
}

.modal-title-custom {
  line-height: 1.3;
  flex-grow: 1;
  padding-right: 2rem;
}

.modal-title-custom .step-name {
  font-size: 16px;
  font-weight: 600;
  color: #035FCC;
  margin-bottom: 4px;
}

.modal-title-custom .project-name {
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  font-style: italic;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 18px;
  color: #6c757d;
  padding: 0.25rem;
  transition: color 0.2s ease;
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 9999;
  cursor: pointer;
}

.btn-close-custom:hover {
  color: #495057;
}

/* Form styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.form-label.bold {
  font-weight: 600;
}

/* Modal content padding and layout */
.tab-content-panel {
  padding: 0;
}

.tab-content-panel .row {
  margin: 0;
}

.tab-content-panel .col-12 {
  padding: 0;
}
/* --- Bật sticky cho các cột cần thiết --- */
.pipeline-table th.stt-column, .pipeline-table td.stt-column,
.pipeline-table th.fixed-column, .pipeline-table td.fixed-column {
    position: sticky;
}

/* Cột STT (cột dính đầu tiên) */
.pipeline-table th.stt-column, .pipeline-table td.stt-column {
    left: 0px;
}

/* Cột Mã dự án (sau STT: 50px) - Dựa trên cấu hình trong Project.vue */
.pipeline-table th:nth-child(2), .pipeline-table td:nth-child(2) {
    left: 50px; /* Width của cột STT */
}

/* Cột Tên khách hàng (sau STT + Mã dự án: 50 + 150 = 200px) */
.pipeline-table th:nth-child(3), .pipeline-table td:nth-child(3) {
    left: 250px;
}

/* Cột Dự án (sau STT + Mã + Tên KH: 200 + 150 = 350px) */
.pipeline-table th:nth-child(4), .pipeline-table td:nth-child(4) {
    left: 400px;
}
</style>
