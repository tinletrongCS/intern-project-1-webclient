<template>
  <div class="main-wrapper">
    <div class="document-page">
      <!-- HERO -->
      <div class="document-hero">
        <div class="document-title">Hướng dẫn sử dụng công cụ</div>
        <div class="document-subtitle">
          Quản lý các tài liệu và file hướng dẫn trong hệ thống
        </div>
      </div>

      <!-- CARD -->
      <div class="document-card">
        <!-- TOOLBAR -->
        <div class="document-toolbar">
          <div class="search-box">
            <span class="icon fa fa-search"></span>
            <input v-model="keyword" type="text" class="search-input" placeholder="Tìm kiếm tài liệu..." />
          </div>

          <div class="toolbar-actions">
            <button v-if="canCreate" class="btn primary" @click="openCreate">
              <span class="icon fa fa-plus"></span>
              Thêm mới
            </button>

            <button v-if="canUpdate" class="btn" @click="openEdit">
              <span class="icon one-edit"></span>
              Điều chỉnh
            </button>

            <button v-if="canDelete" class="btn danger" @click="onDelete">
              <span class="icon one-trash"></span>
              Xóa
            </button>
          </div>
        </div>

        <!-- GRID -->
        <KDataGrid ref="grid" :columns="columns" :dataSource="filteredDocuments" dataKeyField="document_id"
          :allowPaging="true" :pageSize="pageSize" :showFilter="false" :showColumnCheckbox="true"
          :enabledSelectFirstRow="false" />

        <div class="document-footer">
          Hiển thị {{ footerRange }} / {{ filteredDocuments.length }}
        </div>
      </div>
    </div>

    <!-- ================= SYNCFUSION DIALOG ================= -->
    <ejs-dialog ref="docDialog" :visible="showDialog" :isModal="true" :showCloseIcon="true" :allowDragging="true"
      :closeOnEscape="true" width="50%" :position="{ X: 'center', Y: 'center' }" :target="'.main-wrapper'"
      cssClass="doc-sf-dialog" :header="dialogTitle" @close="closeDialog" @overlayClick="closeDialog">
      <div class="doc-form">
        <div class="doc-form-row">
          <label class="doc-label">
            Tên tài liệu (<span style="color:red">*</span>)
          </label>
          <div class="doc-control">
            <input v-model="form.document_name" type="text" class="doc-input" placeholder="Nhập tên tài liệu" />
          </div>
        </div>

        <div class="doc-form-row">
          <label class="doc-label">
            File tải lên (<span style="color:red">*</span>)
          </label>
          <div class="doc-control">
            <label class="file-picker">
              <input type="file" class="file-hidden" multiple @change="onFilePicked" />
              <span class="file-btn">
                <i class="fa fa-upload"></i>
                Chọn file
              </span>
              <span class="file-meta">
                <template v-if="form.files.length">
                  Đã chọn {{ form.files.length }} file
                </template>
                <template v-else>
                  {{ isEdit ? "Giữ file cũ nếu không chọn file mới" : "Chưa chọn file" }}
                </template>
              </span>
            </label>

            <div v-if="fileChips.length" class="file-chip-list">
              <div v-for="file in fileChips" :key="file.key" class="file-chip"
                :class="{ 'file-chip-existing': file.isExisting }">
                <i :class="file.icon"></i>
                <template v-if="file.isExisting">
                  <a href="javascript:void(0)" class="file-chip-name file-chip-link"
                    @click.prevent="downloadSingleFile(file.path, file.name)">
                    {{ file.name }}
                  </a>
                </template>
                <template v-else>
                  <span class="file-chip-name">{{ file.name }}</span>
                </template>
                <span>- {{ file.sizeLabel }}</span>
                <button v-if="file.isExisting" type="button" class="file-chip-remove"
                  @click="removeExistingFile(file.existingIndex)">
                  <i class="fa fa-times"></i>
                </button>
                <button v-else type="button" class="file-chip-remove" @click="removeFile(file.newIndex)">
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <div class="doc-dialog-footer">
        <button class="btn" @click="closeDialog">Hủy</button>
        <button class="btn primary" :disabled="!canSubmit" @click="submitDialog">
          <span class="icon fa fa-save"></span>
          Lưu
        </button>
      </div>
    </ejs-dialog>
  </div>
</template>

<script>
import DocumentApi from "./API";
import { DialogComponent } from "@syncfusion/ej2-vue-popups";

export default {
  name: "SystemDocument",
  components: { "ejs-dialog": DialogComponent },

  data() {
    return {
      keyword: "",
      pageSize: 5,
      documents: [],
      columns: [],

      showDialog: false,
      dialogMode: "create",
      form: {
        document_id: null,
        document_name: "",
        files: [],
        existingFiles: [],
      },
    };
  },

  computed: {
    canCreate() {
      return this.hasButtonPermission("AddDocumentPolicy");
    },
    canUpdate() {
      return this.hasButtonPermission("EditDocumentPolicy");
    },
    canDelete() {
      return this.hasButtonPermission("DeleteDocumentPolicy");
    },

    isEdit() {
      return this.dialogMode === "edit";
    },

    dialogTitle() {
      return this.isEdit ? "Cập nhật tài liệu" : "Thêm tài liệu";
    },

    canSubmit() {
      if (!this.form.document_name.trim()) return false;
      if (this.dialogMode === "create") return this.form.files.length > 0;
      return true;
    },

    fileChips() {
      const existing = this.isEdit
        ? (this.form.existingFiles || []).map((f, idx) => ({
          key: `existing-${idx}-${f.url || f.name}`,
          id: f.id,
          name: f.name,
          sizeLabel: f.sizeLabel || this.formatFileSize(f.size || 0),
          icon: f.icon || this.getFileIconClass(f.name),
          url: f.url || this.buildDownloadUrl(f.path),
          path: f.path,
          existingIndex: idx,
          isExisting: true,
        }))
        : [];

      const newlyAdded = (this.form.files || []).map((f, idx) => ({
        key: `new-${idx}-${f.name}`,
        name: f.name,
        sizeLabel: this.formatFileSize(f.size),
        icon: this.getFileIconClass(f.name),
        newIndex: idx,
        isExisting: false,
      }));

      return [...existing, ...newlyAdded];
    },

    filteredDocuments() {
      const kw = (this.keyword || "").toLowerCase().trim();
      if (!kw) return this.documents;
      return this.documents.filter((d) =>
        `${d.document_name} ${d.fileText || ""}`
          .toLowerCase()
          .includes(kw)
      );
    },

    footerRange() {
      if (!this.filteredDocuments.length) return "0-0";
      return `1-${Math.min(this.pageSize, this.filteredDocuments.length)}`;
    },
  },

  created() {
    this.GetPermissionButtons();
    this.loadDocuments();
    this.columns = this.buildColumns();
  },

  mounted() {
    document.addEventListener("click", this.onDocClick);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.onDocClick);
  },

  methods: {
    normalizeList(payload) {
      if (Array.isArray(payload)) return payload;
      if (typeof payload === "string") {
        try {
          const parsed = JSON.parse(payload);
          return this.normalizeList(parsed);
        } catch (err) {
          console.warn("Failed to parse payload string", err, payload);
          return [];
        }
      }
      if (payload && typeof payload === "object") {
        if (Array.isArray(payload.data)) return payload.data;
        if (Array.isArray(payload.items)) return payload.items;
        if (payload.data) return this.normalizeList(payload.data);
      }
      return [];
    },

    async loadDocuments() {
      try {
        const res = await DocumentApi.getDocuments();

        console.log("API response:", res);

        // Handle nested data structure
        const payload = res?.data ?? res;
        const list = this.normalizeList(payload);

        console.log("Extracted list:", list);

        this.documents = list.map((x, idx) => {
          const rawFiles = Array.isArray(x.files)
            ? x.files
            : x.files
              ? [x.files]
              : Array.isArray(x.file)
                ? x.file
                : x.file
                  ? [x.file]
                  : [];

          const files = rawFiles.map((f, i) => {
            const name = f.file_name || f.fileName || `File ${i + 1}`;
            const size = f.file_size || f.fileSize || 0;
            const path = f.file_path || f.filePath || "";
            const id = f.file_attachment_id || f.fileAttachmentId || f.id;
            return {
              id,
              name,
              sizeLabel: this.formatFileSize(size),
              icon: this.getFileIconClass(name),
              path,
              url: this.buildDownloadUrl(path),
            };
          });

          const row = {
            document_id: x.document_id ?? idx,
            document_name: x.document_name,
            files,
            fileText: files.map((f) => f.name).join(", "),
            uploadedBy: x.uploaded_by || "",
            uploadedAtLabel: this.formatDateTime(
              x.update_day || x.create_day
            ),
          };

          console.log("Mapped row:", row);
          return row;
        });

        console.log("Final documents:", this.documents);
      } catch (error) {
        console.error("Error loading documents:", error);
        this.$toast?.error?.("Không thể tải danh sách tài liệu");
      }
    },

    buildColumns() {
      return [

        {
          fieldName: "document_name",
          headerText: "Nội dung",
          width: 420,
          allowFiltering: false,

          disableHtmlEncode: false,

          valueAccessor: (field, rowData, column) => {
            if (!rowData) return "";

            return `
          <div class="doc-name-cell">
            <div class="doc-name">${rowData.document_name || ""}</div>

            <div class="doc-meta">
              

              ${rowData.uploadedAtLabel ? `
                <span  >
                  Cập nhật : ${rowData.uploadedAtLabel}
                  ${rowData.uploadedBy ? `
                <span >
                  bởi ${rowData.uploadedBy}
                </span>
              ` : ""}
                </span>
              ` : ""}
              
            </div>
          </div>
        `;
          },
        },

        {
          fieldName: "files",
          headerText: "File",
          width: 360,
          allowFiltering: false,

          disableHtmlEncode: false,

          valueAccessor: (field, rowData) => {
            if (!rowData?.files?.length) return "-";

            return `
            <div class="doc-file-wrapper">
              <div class="doc-file-list">
            ${rowData.files
                .map(
                  (f) => `
                  <div class="doc-file-row">
                    <a href="javascript:void(0)" class="doc-file doc-file-link" title="Tải xuống"
                      data-path="${f.path || ""}" data-name="${f.name || ""}">
                      <i class="${f.icon}"></i>

                      <div class="doc-file-meta">
                        <span class="doc-file-name">${f.name}</span>
                         
                      </div>
                    </a>
                  </div>
                `
                )
                .join("")}
            ${rowData.files.length > 1
                ? `<button class="doc-download-all" data-doc-id="${rowData.document_id}" data-doc-name="${encodeURIComponent(
                  rowData.document_name || "document"
                )}">
                    <i class="fa fa-download"></i> Tải tất cả
                  </button>`
                : ""}
          </div>
          </div>
        `;
          },
        },
      ];
    },

    openCreate() {
      this.dialogMode = "create";
      this.form = {
        document_id: null,
        document_name: "",
        files: [],
        existingFiles: [],
      };
      this.showDialog = true;
    },

    openEdit() {
      const selected = this.getSelected();
      if (selected.length !== 1)
        return this.$toast.warning("Chọn 1 tài liệu");

      const doc = selected[0];
      this.dialogMode = "edit";
      this.form = {
        document_id: doc.document_id,
        document_name: doc.document_name,
        files: [],
        existingFiles: Array.isArray(doc.files) ? doc.files : [],
      };
      this.showDialog = true;
    },

    closeDialog() {
      this.showDialog = false;
    },

    onFilePicked(e) {
      this.form.files.push(...Array.from(e.target.files));
      e.target.value = "";
    },

    downloadAllExisting() {
      (this.form.existingFiles || []).forEach((f) => {
        const url = this.buildDownloadUrl(f.path);
        if (!url || url === "#") return;
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.download = f.name || "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },

    removeExistingFile(i) {
      this.form.existingFiles.splice(i, 1);
    },

    removeFile(i) {
      this.form.files.splice(i, 1);
    },

    formatFileSize(bytes) {
      return bytes ? (bytes / 1024).toFixed(1) + " KB" : "";
    },

    formatDateTime(v) {
      if (!v) return "";
      const d = new Date(v);
      if (isNaN(d)) return "";
      return `${d.getDate().toString().padStart(2, "0")}/${(
        d.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    },

    getFileIconClass(name = "") {
      const ext = name.split(".").pop().toLowerCase();
      if (["png", "jpg", "jpeg"].includes(ext)) return "fa fa-file-image-o";
      if (["xlsx", "xls"].includes(ext)) return "fa fa-file-excel-o";
      if (ext === "pdf") return "fa fa-file-pdf-o";
      return "fa fa-file";
    },

    buildDownloadUrl(path) {
      if (!path) return "#";
      return `/work/Upload/Download?filePath=${encodeURIComponent(
        path
      )}`;
    },

    onDocClick(e) {
      const btn = e.target.closest(".doc-download-all");
      if (btn) {
        const docId = btn.getAttribute("data-doc-id");
        const docName = decodeURIComponent(
          btn.getAttribute("data-doc-name") || "document"
        );
        if (!docId) return;
        this.downloadDocumentZip(docId, docName);
        return;
      }

      const fileLink = e.target.closest(".doc-file-link");
      if (fileLink) {
        e.preventDefault();
        const path = fileLink.getAttribute("data-path");
        const name = fileLink.getAttribute("data-name");
        if (!path) return;
        this.downloadSingleFile(path, name);
      }
    },

    async downloadDocumentZip(docId, docName = "document") {
      try {
        const response = await DocumentApi.downloadDocumentZip(docId);
        const blob = response?.data;
        if (!blob) return;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${docName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download zip error", error);
        this.$toast?.error?.("Không tải được gói tài liệu");
      }
    },

    async downloadSingleFile(path, name = "") {
      try {
        const response = await DocumentApi.downloadFile(path);
        const blob = response?.data;
        if (!blob) return;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name || path.split("/").pop() || "file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download file error", error);
        this.$toast?.error?.("Không tải được file");
      }
    },

    async submitDialog() {
      try {
        if (this.dialogMode === "create") {
          await DocumentApi.createDocument({
            document_name: this.form.document_name,
            document_files: this.form.files,
          });
          this.$toast?.success?.("Thêm tài liệu thành công");
        } else {
          const keepFilePaths = (this.form.existingFiles || [])
            .map((f) => f.path)
            .filter(Boolean);
          const keepFileIds = (this.form.existingFiles || [])
            .map((f) => f.id)
            .filter((v) => v !== undefined && v !== null);

          await DocumentApi.updateDocument({
            document_id: this.form.document_id,
            document_name: this.form.document_name,
            document_files: this.form.files,
            keepFilePaths,
            keepFileIds,
          });
          this.$toast?.success?.("Cập nhật tài liệu thành công");
        }
        this.showDialog = false;
        this.loadDocuments();
      } catch (error) {
        console.error("Error saving document:", error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Lỗi khi lưu tài liệu";
        this.$toast?.error?.(message);
      }
    },

    async onDelete() {
      const selected = this.getSelected();
      if (!selected.length) {
        this.$toast?.warning?.("Chọn tài liệu cần xóa");
        return;
      }

      let confirmed = false;
      try {
        if (this.$confirm) {
          const result = await this.$confirm(
            "Xác nhận",
            `Bạn chắc chắn muốn xóa ${selected.length} tài liệu?`
          );
          confirmed = result !== 0 && result !== false;
        } else {
          confirmed = window.confirm(
            `Bạn chắc chắn muốn xóa ${selected.length} tài liệu?`
          );
        }
      } catch (err) {
        console.error("Confirm dialog error:", err);
      }

      if (!confirmed) return;

      try {
        await DocumentApi.deleteDocuments(
          selected.map((x) => x.document_id)
        );
        this.$toast?.success?.("Xóa tài liệu thành công");
        this.loadDocuments();
      } catch (error) {
        console.error("Error deleting documents:", error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Lỗi khi xóa tài liệu";
        this.$toast?.error?.(message);
      }
    },

    getSelected() {
      return this.$refs.grid?.getSelectedRecords?.() || [];
    },
  },
};
</script>



<style scoped>
/* ====== Page ====== */
.document-page {
  padding: 16px;
  background: #ffffff;
  min-height: 100%;
}

.document-hero {
  margin-bottom: 16px;
}

.document-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.document-subtitle {
  margin-top: 6px;
  color: #4b5563;
  font-size: 14px;
}

.document-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.05);
}

.document-toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.search-box {
  flex: 1 1 280px;
  max-width: 800px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
}

.search-box .icon {
  color: #9ca3af;
}

.search-input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 14px;
  color: #111827;
}

/* ====== Buttons ====== */
.toolbar-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 24px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
}

.btn .icon {
  font-size: 14px;
}

.btn:hover {
  background: #f3f4f6;
}

.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.btn.primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn.danger {
  border-color: #ef4444;
  color: #ef4444;
}

.btn.danger:hover {
  background: #fee2e2;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.document-footer {
  margin-top: 10px;
  color: #6b7280;
  font-size: 13px;
}

:deep(.doc-file-list) {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

:deep(.doc-file-row) {
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.doc-file) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

:deep(.doc-file:hover) {
  text-decoration: underline;
}

:deep(.doc-file-meta) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

:deep(.doc-file-name) {
  white-space: nowrap;
}

:deep(.doc-file-size) {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

:deep(.doc-name-cell) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.doc-name) {
  font-weight: 800;
  color: #111827;
}

:deep(.doc-meta) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;
}

:deep(.doc-meta-item) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 10px;
}

:deep(.doc-download-btn) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  width: fit-content;
  padding: 6px 10px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

:deep(.doc-download-btn:hover) {
  background: #1d4ed8;
}

:deep(.doc-download-all) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  width: fit-content;
  padding: 6px 10px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

:deep(.doc-download-all:hover) {
  background: #1d4ed8;
}

/* ====== Syncfusion Dialog Styling ======
   NOTE: Syncfusion DOM nằm ngoài scope, nên dùng () để style */
.doc-sf-dialog.e-dialog {
  border-radius: 14px;
  overflow: hidden;
  min-height: 300px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 24px 60px rgba(17, 24, 39, 0.18);
}

.doc-sf-dialog .e-dlg-header-content {
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border-bottom: 1px solid #eef2f7;
  padding: 14px 18px;
}

.doc-sf-dialog .e-dlg-header {
  font-weight: 800;
  font-size: 16px;
  color: #111827;
}

.doc-sf-dialog .e-dlg-closeicon-btn {
  border-radius: 10px;
}

.doc-sf-dialog .e-dlg-closeicon-btn:hover {
  background: #f3f4f6;
}

.doc-sf-dialog .e-dlg-content {
  padding: 16px 18px;
  background: #ffffff;
}

.doc-sf-dialog .e-footer-content {
  padding: 12px 18px;
  border-top: 1px solid #eef2f7;
  background: #ffffff;
}

/* ====== Form in dialog ====== */
.doc-form {
  display: grid;
  gap: 14px;
  padding: 16px 20px
}

.doc-form-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: start;
}

.doc-label {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  padding-top: 10px;
}

.doc-control {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doc-input {
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.doc-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ====== File picker ====== */
.file-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
}

.file-picker:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.file-hidden {
  display: none;
}

.file-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
}

.file-meta {
  color: #374151;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 10px;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  max-width: 100%;
}

.file-chip-name {
  font-size: 13px;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-chip-existing {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.file-chip-link {
  color: #1f2937;
  text-decoration: none;
}

.file-chip-link:hover {
  text-decoration: underline;
}

.file-chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: #e5e7eb;
  color: #111827;
  cursor: pointer;
}

.file-chip-remove:hover {
  background: #d1d5db;
}

.download-all-row {
  margin-top: 8px;
}

.download-all-btn {
  gap: 8px;
}

.doc-hint {
  font-size: 12px;
  color: #6b7280;
}

.doc-hint.danger {
  color: #ef4444;
}

/* Footer template */
.doc-dialog-footer {
  margin: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.doc-file-wrapper {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
