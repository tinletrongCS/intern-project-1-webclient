<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="true"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupProcessdomain"
    :showCloseIcon="true"
    width="40%"
    height="auto"
    :isModal="true"
    :target="target"
    :header="header"
    :open="handleShowModal"
    :close="handleCloseModal"
  >
    <div class="modal-content">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">
            <strong>Người dùng</strong>
            <required-marker />
          </label>
          <select2
            v-model="user_selected"
            :options="users"
            class="select2"
            :disabled="isViewMode || !is_add"
            placeholder="-- Chọn người dùng --"
          />
        </div>
        <!-- Khu vực -->
        <div class="form-group">
          <label class="form-label">
            <strong>Khu vực</strong>
            <required-marker />
          </label>
          <ejs-multiselect
            id="areaMultiSelect"
            ref="areaMultiSelect"
            :allowFiltering="true"
            :dataSource="departments"
            placeholder="Chọn khu vực"
            v-model="area_selects"
            :fields="{ value: 'id', text: 'text' }"
            :readonly="isViewMode"
            :maximumDisplayCount="0"
            @change="onAreaChange"
          >
          </ejs-multiselect>
        </div>
        <div class="form-group">
          <label for="" class="form-label">
            <strong>Lĩnh vực đăng ký</strong>
            <required-marker />
          </label>
          <ejs-multiselect
            id="multiselect"
            ref="userMultiSelect"
            :dataSource="domains"
            placeholder="Chọn"
            v-model="domain_selects"
            :fields="fields"
            :readonly="isViewMode"
            :maximumDisplayCount="0"
          >
          </ejs-multiselect>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions" v-if="!isViewMode">
          <button type="button" class="btn btn-primary" @click="onSave">
            <i class="fa fa-save"></i> Lưu
          </button>
          <button type="button" class="btn btn-secondary" @click="hideModal">
            <i class="fa fa-times"></i> Hủy
          </button>
        </div>

        <div class="form-actions" v-else>
          <button type="button" class="btn btn-secondary" @click="hideModal">
            <i class="fa fa-times"></i> Đóng
          </button>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import { RequestApi } from "../API";
export default {
  name: "AddUpdateConfigModal",
  props: {
    domainData: {
      type: Object,
      default: () => ({}),
    },
    viewMode: {
      type: Boolean,
      default: false,
    },
    domains: {
      type: Array,
      default: () => [],
    },
    departments: {
      type: Array,
      default: () => [],
    },
    is_add: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="fa fa-cogs"></span> THÔNG TIN CẤU HÌNH`,
      user_selected: null,
      domain_selects: [],
      area_selects: [],

      processingStatus: [
        { id: 1, name: "Hoàn thành" },
        // { id: 2, name: 'Đang xử lý' },
        // { id: 3, name: 'Tạm hoãn' },
        // { id: 4, name: 'Từ chối' }
      ],
      fields: {
        value: "domain_id",
        text: "domain_name",
      },
      isViewMode: false,
      users: [],
    };
  },

  computed: {
  },

  watch: {
    
    viewMode: {
      handler(newVal) {
        this.isViewMode = newVal;
        if (this.isViewMode) {
        }
        this.updateHeader();
      },
      immediate: true,
    },
  },

  async beforeMount() {
    // Load user data ngay khi component mount
    await this.loadUserData();
  },

  methods: {
    async showModal(data) {
      // Load user data trước khi set giá trị
      await this.loadUserData();
      
      // Show modal trước
      this.$refs["popupProcessdomain"].show();
      
      // Đợi DOM render
      await this.$nextTick();
      
      if (data) {
        
        // Set các giá trị khác trước
        this.area_selects = data.departments
          ? data.departments.map((d) => d.id)
          : [];
        this.domain_selects = data.domains ? data.domains.map((d) => d.id) : [];
        
        // Set user_selected cuối cùng và kiểm tra xem có tồn tại trong users không
        if (data.user_id) {
          const userExists = this.users.find(user => user.id === data.user_id.toString());
          if (userExists) {
            this.user_selected = data.user_id.toString();
          } else {
            this.user_selected = null;
          }
        } else {
          this.user_selected = null;
        }
      }
    },

    hideModal() {
      this.$refs["popupProcessdomain"].hide();
      this.resetForm();
    },
    handleShowModal() {},

    handleCloseModal() {},
    async loadUserData() {
      try {
        const response = await RequestApi.GetUserByTTKDGP();
        
        if (response.data) {
          this.users = JSON.parse(response.data)?.map((user) => ({
            id: user.user_id.toString(), // Đảm bảo id là string
            text: user.full_name,
          }));
        } else {
          this.users = [];
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        this.users = [];
        this.$toast.error("Không thể tải danh sách người dùng");
      }
    },

    resetForm() {
      this.user_selected = null;
      this.domain_selects = [];
      this.area_selects = [];
      this.isViewMode = false;
    },

    validateForm() {
      if (!this.user_selected) {
        this.$toast.warning("Vui lòng chọn người dùng");
        return false;
      }

      if (!this.area_selects.length) {
        this.$toast.warning("Vui lòng chọn khu vực");
        return false;
      }

      if (!this.domain_selects.length) {
        this.$toast.warning("Vui lòng chọn lĩnh vực");
        return false;
      }

      return true;
    },

    onSave() {
      if (!this.validateForm()) {
        return;
      }

      try {
        const request = {
          user_id: Number(this.user_selected),
          department_ids: this.area_selects,
          domain_ids: this.domain_selects,
        };

        this.$emit("saved", request);

        // Đóng modal sau khi save
        // this.hideModal();
      } catch (error) {
        console.error("Error saving process data:", error);
        alert("Có lỗi xảy ra khi lưu: " + (error.message || error));
      }
    },

    onAreaChange() {
    },

    updateHeader() {
      if (this.isViewMode) {
        this.header = `<span class="fa fa-eye"></span> XEM THÔNG TIN CẤU HÌNH`;
      } else {
        this.header = `<span class="fa fa-cogs"></span> THÔNG TIN CẤU HÌNH`;
      }
    },

    // Method để set chế độ view/edit từ bên ngoài
    setViewMode(isViewMode = true) {
      this.isViewMode = isViewMode;
      this.updateHeader();
    },

    // Method để reset và chuyển về chế độ tạo mới
    resetToCreateMode() {
      this.resetForm();
      this.setViewMode(false);
    },
  },
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
}
:deep(.e-input-group.e-control-wrapper.e-input-focus input){
  color: black;
}
.modal-body {
  /* max-height: 500px; */
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.text-danger {
  color: #dc3545;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #f8f9fa;
  opacity: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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
</style>
