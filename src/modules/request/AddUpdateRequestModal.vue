<template>
  <ejs-dialog
    ref="popupRequest"
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'top' }"
    :visible="false"
    :showCloseIcon="true"
    :isModal="true"
    :target="target"
    :header="header"
    :open="handleShowModal"
    @close="handleCloseModal"
    cssClass="task-kanban-dialog"
    width="55%"
  >
    <!-- Import template từ file HTML riêng -->
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <!-- Row 1: Mã yêu cầu & Dịch vụ -->
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w200 bold">Mã yêu cầu</div>
                <div class="input-group">
                  <div class="value flex-1">
                    <input
                      type="text"
                      disabled
                      v-model="input_ma"
                      class="form-control"
                      placeholder="Mã yêu cầu sẽ được tự động tạo"
                    />
                  </div>
                  <div class="value custom-value-btn btn-copy">
                    <button
                      class="btn btn-second"
                      style="padding: 5px 10px"
                      @click="copyToClipboard(input_ma)"
                      title="Copy mã yêu cầu"
                    >
                      <span class="-ap icon-documents"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w200 bold">
                  Lĩnh vực
                  <required-marker v-if="boardType == 1" />
                </div>
                <div class="value wp100">
                  <div class="select-custom" ref="ds_duan">
                    <select2
                      v-model="service_selected"
                      class="select2"
                      :options="mappeddomains"
                      :disabled="isFormControlDisabled"
                      placeholder="Chọn lĩnh vực"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Row 2: Đơn vị yêu cầu & Hạn mong muốn -->
          <div class="row">
            <div class="col-sm-12 col-12">
              <div class="info-row">
                <div class="key w200 bold">
                  Hạn mong muốn
                  <required-marker v-if="boardType == 1" />
                </div>
                <div class="value wp100">
                  <ejs-datepicker
                    :format="'dd/MM/yyyy'"
                    v-model="han_mongmuon"
                    :enableTimePicker="true"
                    :disabled="isFormControlDisabled"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Nội dung yêu cầu -->
          <div class="info-row">
            <div class="key w200 bold">
              Nội dung yêu cầu
              <required-marker />
            </div>
            <div class="value wp100">
              <textarea
                ref="inputNoiDung"
                v-model="input_noidung"
                :readonly="isFormControlDisabled"
                class="form-control"
                rows="3"
                placeholder="Nhập nội dung chi tiết yêu cầu..."
              ></textarea>
              <p class="text-end mb-0" style="font-style: italic;">{{ input_noidung.length }}/500 kí tự</p>
            </div>
          </div>

          <!-- Mô tả giao phẩm -->
          <div class="info-row">
            <div class="key w200 bold">
              Mô tả giao phẩm công việc
              <required-marker />
            </div>
            <div class="value wp100">
              <textarea
                ref="inputMoTaGP"
                v-model="input_mota"
                :readonly="isFormControlDisabled"
                class="form-control"
                rows="4"
                placeholder="Mô tả chi tiết về giao phẩm cần được thực hiện..."
              ></textarea>
              <p class="text-end mb-0" style="font-style: italic;">{{ input_mota.length }}/500 kí tự</p>
            </div>
          </div>

          <!-- File đính kèm -->
          <div class="info-row">
            <div class="key w200 bold">Đính kèm file</div>
            <div class="value wp100">
              <AttachFile
                v-if="!disabledFileAttachment || !shouldShowWorkReport"
                ref="attachFile"
                :fileList="fileAttachments"
                @onSelectFiles="onSelectFiles"
              />

              <!-- Danh sách file đã đính kèm -->
              <div class="file-list" v-if="fileAttachments.length > 0">
                <div
                  v-for="(file, i) in fileAttachments"
                  :key="i"
                  class="file-item"
                >
                  <div class="file-info">
                    <i class="fa fa-file-o file-icon"></i>
                    <a
                      @click.prevent="downloadFile(file)"
                      class="file-link"
                      :title="file.file_name"
                    >
                      {{ file.file_name }}
                    </a>
                    <span class="file-size" v-if="file.file_size">
                      ({{ formatFileSize(file.file_size) }})
                    </span>
                  </div>
                  <button
                    v-if="!disabledFileAttachment"
                    class="btn-delete"
                    title="Xóa file"
                    @click="onRemoveFile(file)"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Work Report Panel -->
          <div class="info-row" v-if="shouldShowWorkReport">
            <div class="key w200 bold">Báo cáo công việc</div>
            <div class="value wp100">
              <WorkReportPanel
                :taskId="currentTaskId || taskId || 0"
                ref="workReportPanel"
              />
            </div>
          </div>

          <!-- Action buttons -->
          <div class="info-row" v-if="!isViewMode && !isFormControlDisabled">
            <div class="form-actions">
              <button
                class="btn btn-secondary"
                @click="hideModal"
                type="button"
              >
                <i class="fa fa-times"></i>
                Hủy
              </button>
              <button
                class="btn btn-primary"
                @click="onSaveTask"
                type="button"
                :disabled="isSaving"
              >
                <i class="fa fa-save"></i>
                {{ editMode ? "Cập nhật yêu cầu" : "Lưu thông tin" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
import AttachFile from "@/modules/work/kanban/task/AttachFile.vue";
import WorkReportPanel from "@/modules/work/kanban/task/WorkReportPanel.vue";
import { RequestApi } from "./API.js";
import moment from "moment/moment.js";

export default {
  name: "AddUpdateRequestModal",
  components: {
    AttachFile,
    WorkReportPanel,
  },
  props: {
    departments: {
      type: Array,
      default: () => [],
    },
    domains: {
      type: Array,
      default: () => [],
    },
    boardType: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    viewFlg: {
      type: Boolean,
      default: false,
    },
    reportFlg: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: [String, Number],
      default: null,
    },
    boardClosed: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="icon one-notepad"></span> THÔNG TIN YÊU CẦU`,

      // Form data
      input_ma: "",
      input_noidung: "",
      input_mota: "",

      // Select data
      service_selected: null,
      ds_duan: [],

      // Hạn mong muốn
      han_mongmuon: new Date(),

      // File attachments
      fileAttachments: [],
      disabledFileAttack: false,

      // Flags
      cloneChildFlg: false,
      duplicateChildFlg: false,

      // Modal mode control
      isViewMode: false,
      editMode: false,
      addMode: false,
      isFormDisabled: false,
      isSaving: false,

      // Current task ID for WorkReportPanel
      currentTaskId: 0,
      dataLoadFromAPI: {},
      // Current request ID for edit mode
      currentRequestId: null,
    };
  },
  computed: {
    // Debug domains mapping
    mappeddomains() {
      const mapped = this.domains.map((e) => ({
        id: e.domain_id,
        text: e.domain_name,
      }));
      return mapped;
    },

    // Current modal mode for easier checking
    currentMode() {
      if (this.addMode) return "add";
      if (this.isViewMode) return "view";
      if (this.editMode) return "edit";
      return "unknown";
    },

    // Check if WorkReportPanel should be visible
    shouldShowWorkReport() {
      return this.isViewMode && (this.currentTaskId || this.taskId);
    },

    // Kiểm soát trạng thái disable cho các form controls
    isFormControlDisabled() {
      return (
        this.disabled ||
        this.isViewMode ||
        this.isFormDisabled ||
        this.boardClosed
      );
    },

    // Kiểm soát trạng thái disable cho file attachment
    disabledFileAttachment() {
      return this.isFormControlDisabled || this.disabledFileAttack;
    },
  },

  watch: {
    service_selected: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          RequestApi.GetInfoService(newVal).then((result) => {
            this.ds_donvi_thuchien =
              result.data.departments.map((_) => ({
                id: _.department_id,
                text: _.name,
              })) || [];
            this.donvi_thuchien_selected = null;
            this.ds_am_thuchien = [];
            this.am_thuchien_selected = null;
          });
        } else if (!newVal) {
          // Nếu không chọn dịch vụ thì clear đơn vị và AM
          this.ds_donvi_thuchien = [];
          this.donvi_thuchien_selected = null;
          this.ds_am_thuchien = [];
          this.am_thuchien_selected = null;
        }
      },
      immediate: false,
    },
  },
  mounted() {},

  methods: {
    showModal() {
      this.$refs["popupRequest"].show();
    },

    hideModal() {
      this.$refs["popupRequest"].hide();
    },

    handleShowModal() {},

    handleCloseModal() {
      this.resetForm();
    },

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        // You can add toast notification here
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    },

    async onSaveTask() {
      // Prevent multiple submissions
      if (this.isSaving) return;

      // Validate required fields
      if(!this.service_selected) {
        this.$toast.error("Vui lòng chọn lĩnh vực");
        return;
      }
      if (!this.input_noidung.trim()) {
        this.$toast.error("Vui lòng nhập nội dung yêu cầu");
        return;
      }
      if (this.input_noidung.length > 500) {
        this.$toast.error("Nội dung yêu cầu không được vượt quá 500 ký tự");
        return;
      }

      if (!this.input_mota.trim()) {
        this.$toast.error("Vui lòng nhập mô tả giao phẩm");
        return;
      }
      if (this.input_mota.length > 500) {
        this.$toast.error("Mô tả giao phẩm không được vượt quá 500 ký tự");
        return;
      }

      this.isSaving = true;

      try {
        // Collect complete form data
        const formData = {
          // Basic info
          ma: this.input_ma,
          noidung: this.input_noidung,
          mota: this.input_mota,

          // Service/Project
          domain_id: this.service_selected,
          donvi_thuchien_id: this.donvi_thuchien_selected,

          // Deadline
          han_mongmuon: this.han_mongmuon,

          // Files
          files: this.fileAttachments,

          // Meta info
          boardType: this.boardType,
        };

        // Kiểm tra chế độ để gọi API phù hợp
        if (this.editMode && this.currentRequestId) {
          // Map dữ liệu theo format API như createDataRequest
          const mappedData = this.createUpdateDataRequest(formData);

          const response = await RequestApi.UpdateRequest(mappedData);
          if (!response.success) {
            throw new Error(response.message || "Cập nhật yêu cầu thất bại");
          }

          if (this.$toast) {
            this.$toast.success("Cập nhật yêu cầu thành công!");
          } else {
            alert("Cập nhật yêu cầu thành công!");
          }

          // Đóng modal sau khi cập nhật thành công
          this.hideModal();

          // Emit event để parent component biết đã update
          this.$emit("updated", response);
        } else {
          // Map dữ liệu theo format API
          const mappedData = this.createNewDataRequest(formData);
          this.$emit("saved", mappedData);
        }
      } catch (error) {
        if (this.$toast) {
          this.$toast.error(error?.data?.message || error?.message || error);
        } else {
          alert(error.message || error);
        }
      } finally {
        this.isSaving = false;
      }
    },

    // Reset form data
    resetForm() {
      this.input_ma = "";
      this.input_noidung = "";
      this.input_mota = "";
      this.service_selected = null;

      this.donvi_thuchien_selected = null;
      this.am_thuchien_selected = null;
      this.han_mongmuon = new Date();
      this.fileAttachments = [];
      this.ds_am_thuchien = [];
      this.currentTaskId = 0; // Reset task ID
      this.currentRequestId = null; // Reset request ID
      this.isViewMode = false; // Reset view mode
      this.editMode = false; // Reset edit mode
      this.addMode = false; // Reset add mode
      this.isSaving = false;
      
      // Reset AttachFile component
      if (this.$refs.attachFile && this.$refs.attachFile.reset) {
        this.$refs.attachFile.reset();
      }
    },

    // Map dữ liệu cho UpdateRequest API theo TaskRequest model
    createUpdateDataRequest(requestData) {
      let scheduleEnd = null;

      if (requestData.han_mongmuon) {
        const date = new Date(requestData.han_mongmuon);
        scheduleEnd = moment(date, "DD/MM/YYYY").format("YYYY-MM-DDT00:00:00");
      }

      return {
        task_id: this.currentTaskId || 0,
        project_id: null,
        type_id: null,
        code: requestData.ma || "",
        task_name: requestData.noidung || "",
        status_id: this.dataLoadFromAPI.status_id, // Default to "Chưa bắt đầu"

        planned_duration_time: this.dataLoadFromAPI.planned_duration_time || 1, // Default 1 hour

        schedule_start: this.dataLoadFromAPI.schedule_start,
        schedule_end: scheduleEnd,

        description: requestData.mota || "",
        jiraurl: null,

        step_id: this.dataLoadFromAPI.step_id || null,
        jobtype_id: this.dataLoadFromAPI.jobtype_id || null,

        task_creator: null, // Backend sẽ set
        domain_id: requestData.domain_id || null,
        customer_id: null,

        running_flag: 1,

        priority: this.dataLoadFromAPI.priority || null,
        percent_presale: null,
        onebss_code: null,
        // Lists for bulk operations
        list_duplicate_assignee: null,
        list_file_attachment: JSON.stringify(
          this.fileAttachments.map((x) => x.file_attachment_id)
        ),
      };
    },

    // Map dữ liệu cho AddRequest API theo TaskRequest model
    createNewDataRequest(requestData) {
      // Format dates
      let scheduleStart = null;
      let scheduleEnd = null;

      if (requestData.han_mongmuon) {
        const date = new Date(requestData.han_mongmuon);
        // scheduleStart = date.toISOString();
        scheduleEnd = moment(date, "DD/MM/YYYY").format("YYYY-MM-DDT00:00:00");
      }

      return {
        task_id: 0, // 0 cho task mới
        project_id: null,
        type_id: null,
        code: "", // Sẽ được generate bởi backend
        task_name: requestData.noidung || "",
        status_id: 1, // Default to "Chưa bắt đầu"

        actual_execution_time: 0,
        planned_duration_time: 1, // Default 1 hour

        schedule_start: scheduleStart,
        schedule_end: scheduleEnd,

        description: requestData.mota || "",
        jiraurl: null,

        step_id: null,
        jobtype_id: null,

        task_creator: null, // Backend sẽ set từ current user
        domain_id: requestData.domain_id || null,
        customer_id: null,

        running_flag: 1,

        priority: null,
        percent_presale: null,
        onebss_code: null,

        // Lists for bulk operations
        list_duplicate_assignee: null,
        list_file_attachment: JSON.stringify(
          this.fileAttachments.map((x) => x.file_attachment_id)
        ),
      };
    },

    // Convert file attachments to string list for API
    getFileAttachmentList(files) {
      if (!files || files.length === 0) {
        return null;
      }

      // Convert file objects to ID string list (comma-separated)
      const fileIds = files
        .filter((file) => file.id) // Only files with ID
        .map((file) => file.id)
        .join(",");

      return fileIds || null;
    },

    async onSelectFiles(files) {
      this.$root.showLoading(true);
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        var ref_id = 0;
        if (!this.isAdd) {
          ref_id = this.dataLoadFromAPI.task_id;
        }
        let result = await RequestApi.UploadFileCommon(
          formData,
          "task",
          ref_id ?? 0
        );
        if (Array.isArray(result)) {
          this.fileAttachments = this.fileAttachments.concat(result);
        } else {
          this.$toast.error(result);
        }
        this.$root.showLoading(false);
      } catch (error) {
      }
    },

    async onRemoveFile(file) {
      this.$root.showLoading(true);
      try {
        let result = await RequestApi.DeleteFileAttachment(
          this,
          file.file_attachment_id
        );
        if (result == "1") {
          const index = this.fileAttachments.findIndex(
            (x) => x.file_attachment_id == file.file_attachment_id
          );
          if (index > -1) {
            this.fileAttachments.splice(index, 1);
          }
          
          // Reset AttachFile component after removing file
          if (this.$refs.attachFile && this.$refs.attachFile.reset) {
            this.$refs.attachFile.reset();
          }
        } else {
          this.$toast.error(result);
        }
      } catch (error) {
        this.$root.showLoading(false);
      }
    },

    downloadFile(fileAttachment) {
      this.axios
        .get(`work/Task/Download`, {
          params: { filePath: fileAttachment.file_path },
          responseType: "blob",
        })
        .then((response) => {
          // Tạo URL và trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileAttachment.file_name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Download lỗi:", error);
        });
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    // Load dữ liệu request từ API để hiển thị chi tiết
    async loadRequestData(requestId) {
      try {
        // Gọi API GetRequestInfo
        const response = await RequestApi.GetRequestInfo(requestId);

        if (response && response.data) {
          const data = response.data;
          this.dataLoadFromAPI = data;
          this.input_ma = data.code || "";
          this.input_noidung = data.task_name || "";
          this.input_mota = data.description || "";
          this.service_selected = data.domain_id || null;
          this.han_mongmuon = data.schedule_end || "";
          this.fileAttachments = []; // Reset files, will be loaded separately if needed
          if (data.file_attachments) {
            this.fileAttachments = data.file_attachments;
          }
          // Set current task ID for WorkReportPanel
          this.currentTaskId = data.task_id || data.request_id || requestId;

          // Set current request ID for edit mode
          this.currentRequestId = data.id || requestId;

          // Wait for DOM update before calling initDuLieu
          await this.$nextTick();

          // Check if WorkReportPanel ref exists before calling method
          if (
            this.$refs.workReportPanel &&
            this.$refs.workReportPanel.initDuLieu
          ) {
            await this.$refs.workReportPanel.initDuLieu();
          }
        }
      } catch (error) {
        console.error("Error loading request data:", error);
        this.$toast?.error("Không thể tải thông tin yêu cầu");
      }
    },

    // Set chế độ hiển thị modal (view/edit/add)
    setViewMode(isViewMode = true) {
      this.isViewMode = isViewMode;
      this.editMode = !isViewMode; // editMode is opposite of isViewMode when not adding
      this.addMode = false; // Reset add mode when setting view mode

      if (isViewMode) {
        // Disable all form controls trong chế độ xem
        this.isFormDisabled = true;
      } else {
        // Enable form controls trong chế độ edit
        this.isFormDisabled = false;
      }
    },

    // Set chế độ thêm mới
    setAddMode() {
      this.isViewMode = false;
      this.editMode = false;
      this.addMode = true;
      this.isFormDisabled = false;
    },

    // Reset form và chuyển về chế độ tạo mới
    resetToCreateMode() {
      this.resetForm();
      this.setAddMode();
    },
  },
};
</script>
<style scoped>
/* Modal Layout */
.modal-content {
  height: 100%;
}

.popup-body {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.box-form {
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
}

/* Form Rows */
.row {
  display: flex;
  margin-bottom: 20px;
}

.row .col-sm-6 {
  flex: 1;
}

/* Info Row */
.info-row {
  display: flex;
  flex-direction: column;
}

.info-row .key {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.info-row .value:not(.btn-copy) {
  flex: 1;
}

.info-row .value {
  padding-left: 0;
}

/* Input Group */
.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flex-1 {
  flex: 1;
}

.w30 {
  width: 30px;
}

.w200 {
  min-width: 200px;
}

.wp100 {
  width: 100%;
}

/* Form Controls */
.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-second {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* File List */
.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.file-icon {
  color: #6c757d;
}

.file-link {
  color: #007bff;
  text-decoration: none;
  flex: 1;
  cursor: pointer;
}

.file-link:hover {
  text-decoration: underline;
}

.file-size {
  color: #6c757d;
  font-size: 12px;
}

.btn-delete {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
}

.btn-delete:hover {
  background-color: #f5c6cb;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 20px;
}

/* Select2 Styling */
.select2 {
  width: 100% !important;
}

.select-custom {
  width: 100%;
}

/* Required Marker */
.required-marker {
  color: #dc3545;
  margin-left: 3px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    gap: 10px;
  }
  .e-popup.e-popup-open.e-dialog {
    width: 90% !important;
  }
  .popup-body {
    padding: 15px;
  }

  .box-form {
    gap: 15px;
  }
}
</style>
