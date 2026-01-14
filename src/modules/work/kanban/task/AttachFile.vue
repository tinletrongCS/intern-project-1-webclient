<template>
  <div class="upload-box" @dragover.prevent @drop.prevent="handleDrop">
    <div class="upload-row">
      <p class="text">Kéo và thả tập tin tại đây</p>
      <button @click="openFilePicker">Tải tập tin lên</button>
    </div>
    <input type="file" ref="fileInput" @change="handleFileChange" class="hidden" :accept="acceptFileTypes" multiple />
  </div>
</template>

<script>
export default {
  name: 'AttachFile',
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      files: [],
      acceptFileTypes: '.doc,.docx,.pdf,.xlsx,.xls,.zip,.rar,.xml,.jpeg,.jpg,.png,.pptx'
    }
  },
  watch: {
    // Watch for changes in fileList prop to sync internal state
    fileList: {
      handler(newFileList) {
        // Reset input file when external file list changes
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
        
        // Sync internal files array if needed
        this.files = [];
      },
      immediate: true
    }
  },
  methods: {
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles = this.validateFiles(selectedFiles);
      this.files = validFiles;
      this.$emit('onSelectFiles', this.files);
      
      // Reset input after emitting to allow selecting same files again
      this.resetFileInput();
    },
    handleDrop(event) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      const validFiles = this.validateFiles(droppedFiles);
      this.files = validFiles;
      this.$emit('onSelectFiles', this.files);
      
      // Reset input after emitting
      this.resetFileInput();
    },
    resetFileInput() {
      // Reset file input to allow re-selecting same files
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      // Clear internal files array
      this.files = [];
    },
    // Public method to reset from parent component
    reset() {
      this.resetFileInput();
    },
    validateFiles(files) {
      const allowedExtensions = this.acceptFileTypes
        .split(',')
        .map(ext => ext.trim().toLowerCase());

      const invalidFiles = [];
      const validFiles = [];

      files.forEach(file => {
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        if (allowedExtensions.includes(fileExt)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        this.$toast.error(`Các tệp sau không hợp lệ:\n- ${invalidFiles.join('\n- ')}\n\n` +
          `Chỉ chấp nhận các định dạng: ${allowedExtensions.join(', ')}`
        )
      }

      return validFiles;
    }
  }
};
</script>

<style scoped>
.upload-box {
  border: 2px dashed #aaa;
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}
.upload-box .text {
  color: #999;
  margin-bottom: 10px;
}
.upload-box button {
  background-color: #0d6efd;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.upload-box button:hover {
  background-color: #0b5ed7;
}
.hidden {
  display: none;
}
.upload-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Khoảng cách giữa p và button */
  flex-wrap: wrap; /* Cho responsive nếu cần */
}

.upload-row .text {
  color: #999;
  margin: 0;
}
</style>
