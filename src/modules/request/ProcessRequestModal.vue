<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="true"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupProcessRequest"
    :showCloseIcon="true"
    width="50%"
    height="auto"
    :isModal="true"
    :target="target"
    :header="header"
    :open="handleShowModal"
    :close="handleCloseModal"
  >
    <div class="modal-content">
      <div class="modal-body">
        <!-- Nội dung yêu cầu -->
        <div class="form-group">
          <label class="form-label">
            <strong>Nội dung yêu cầu</strong>
          </label>
          <input
            v-model="formData.noiDungYeuCau"
            type="text"
            class="form-control"
            placeholder="Nội dung yêu cầu..."
            readonly
          />
        </div>

        <!-- Xử lý -->
        <div class="form-group">
          <label class="form-label">
            <strong>Xử lý</strong>
            <required-marker />
          </label>
          <select2
            v-if="!isViewMode"
            v-model="formData.xuLy"
            :options="processingStatusOptions"
            class="select2"
            placeholder="-- Chọn trạng thái xử lý --"
          />
          <input
            v-else
            type="text"
            :value="getStatusName(formData.xuLy)"
            class="form-control"
            readonly
          />
        </div>

        <!-- Phản hồi -->
        <div class="form-group">
          <label class="form-label">
            <strong>Phản hồi</strong>
            <required-marker />
          </label>
          <textarea
            v-model="formData.phanHoi"
            class="form-control"
            rows="4"
            placeholder="Nhập phản hồi..."
            :disabled="isViewMode"
          ></textarea>
          <p class="text-end" style="font-style: italic;">{{ formData.phanHoi.length }}/500 kí tự</p>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions" v-if="!isViewMode">
          <button type="button" class="btn btn-primary" @click="onSave">
            <i class="fa fa-save"></i> Xử lý
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
export default {
  name: "ProcessRequestModal",
  props: {
    requestData: {
      type: Object,
      default: () => ({})
    },
    viewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="fa fa-cogs"></span> XỬ LÝ YÊU CẦU`,
      
      formData: {
        noiDungYeuCau: '',
        xuLy: '',
        phanHoi: ''
      },
      
      processingStatus: [
        { id: 1, name: 'Hoàn thành' },
        // { id: 2, name: 'Đang xử lý' },
        // { id: 3, name: 'Tạm hoãn' },
        // { id: 4, name: 'Từ chối' }
      ],
      
      isViewMode: false
    };
  },
  
  computed: {
    // Format data cho Select2 component
    processingStatusOptions() {
      return this.processingStatus.map(status => ({
        id: status.id,
        text: status.name
      }));
    }
  },
  
  watch: {
    requestData: {
      handler(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          this.loadRequestData(newVal);
        }
      },
      deep: true,
      immediate: true
    },
    
    viewMode: {
      handler(newVal) {
        this.isViewMode = newVal;
        this.updateHeader();
      },
      immediate: true
    }
  },

  methods: {
    showModal() {
      this.$refs["popupProcessRequest"].show();
    },

    hideModal() {
      this.$refs["popupProcessRequest"].hide();
    },

    handleShowModal() {
    },

    handleCloseModal() {
    },

    loadRequestData(data) {
      // Load dữ liệu từ request vào form
      this.formData = {
        noiDungYeuCau: data.content || data.noiDungYeuCau || '',
        xuLy: data.xuLy || '',
        phanHoi: data.phanHoi || ''
      };
      
      console.log("Loaded request data:", this.formData);
    },

    resetForm() {
      this.formData = {
        noiDungYeuCau: '',
        xuLy: '',
        phanHoi: ''
      };
    },

    validateForm() {
      if (!this.formData.noiDungYeuCau.trim()) {
        this.$toast.warning("Nội dung yêu cầu không được để trống");
        return false;
      }
      
      if (!this.formData.xuLy) {
        this.$toast.warning("Vui lòng chọn trạng thái xử lý");
        return false;
      }
      
      return true;
    },

    onSave() {
      if (!this.validateForm()) {
        return;
      }

      try {
        // Tìm tên trạng thái từ ID
        const selectedStatus = this.processingStatus.find(
          status => status.id == this.formData.xuLy
        );
        
        // Emit sự kiện save với data
        const saveData = {
          ...this.requestData,
          ...this.formData,
          xuLyStatusId: this.formData.xuLy,
          xuLyStatusName: selectedStatus ? selectedStatus.name : ''
        };
        
        this.$emit('saved', saveData);
        
      } catch (error) {
        console.error("Error saving process data:", error);
        alert("Có lỗi xảy ra khi lưu: " + (error.message || error));
      }
    },

    updateHeader() {
      if (this.isViewMode) {
        this.header = `<span class="fa fa-eye"></span> XEM XỬ LÝ YÊU CẦU`;
      } else {
        this.header = `<span class="fa fa-cogs"></span> XỬ LÝ YÊU CẦU`;
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

    // Method để lấy tên trạng thái từ ID
    getStatusName(statusId) {
      const status = this.processingStatus.find(s => s.id == statusId);
      return status ? status.name : '';
    }
  }
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
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

.btn-secondary:hover {
  background-color: #545b62;
}

.btn i {
  font-size: 14px;
}
</style>