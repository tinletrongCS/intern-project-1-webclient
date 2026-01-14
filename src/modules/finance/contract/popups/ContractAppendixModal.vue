<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAppendix"
        :showCloseIcon="true"
        width="80%"
        height="85%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box" style="height: 100%; display: flex; flex-direction: column;">
            <div class="popup-body" style="flex: 1;">
                <div class="box-form" style="height: 100%; display: flex; flex-direction: column;">
                    <!-- Khu vực hiển thị danh sách phụ lục -->
                          <div class="info-row" style="flex-shrink: 0;">
                                <div class="group-buttons right">
                                    <button class="btn btn-second" style="min-width: 100px;" @click="showCreateModal">
                                        <span class="icon fa fa-plus"></span>&nbsp;Tạo mới
                                    </button>
                                </div>
                        </div>
                        
                        <!-- Danh sách phụ lục -->
                        <div v-if="appendixList.length > 0" class="file-list-container">
                            <div v-for="appendix in appendixList" :key="'appendix-' + appendix.id" class="file-item-display">                                <div class="file-details">
                                    <div class="file-name">{{ appendix.name }}</div>
                                    <div class="file-meta">File: {{ appendix.fileName }}</div>
                                    <div class="file-meta">Định dạng: <span class="text-uppercase">{{ getFileExtension(appendix.fileName) }}</span></div>
                                    <div v-if="appendix.size != null" class="file-meta">Kích thước: {{ formatFileSize(appendix.size) }}</div>
                                </div>
                                <button class="btn btn-second mr-1" @click="downloadAppendix(appendix)">
                                    <span class="icon one-download"></span> Tải xuống
                                </button>
                                <button class="btn btn-second" @click="deleteAppendix(appendix)">
                                    <span class="icon one-trash"></span> Xóa
                                </button>
                            </div>
                        </div>
                        
                        <!-- Hiển thị khi không có phụ lục -->
                        <div v-else class="no-files-placeholder" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0;">
                            <i class="fa fa-file-o no-files-icon"></i>
                            <p>Chưa có phụ lục hợp đồng nào</p>
                        </div>
                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Modal tạo mới phụ lục -->
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupCreateAppendix"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        header="<span class='icon fa fa-plus'></span> Tạo mới phụ lục hợp đồng"
        :open="handleShowCreateModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <!-- Form tạo mới phụ lục -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label class="form-label bold">Tên phụ lục <required-marker/></label>
                                <input type="text" v-model="newAppendix.name" class="form-control" 
                                       placeholder="Nhập tên phụ lục..." 
                                       :class="{ 'is-invalid': showValidation && !newAppendix.name.trim() }">
                            </div>
                        </div>
                    </div>

                    <!-- Khu vực tải tập tin -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label class="form-label bold">Tập tin đính kèm <required-marker/></label>

                                <!-- Hiển thị khi không có file -->
                                <div v-if="!selectedFile" class="file-upload-area" 
                                     :class="{ 'border-danger': showValidation && !selectedFile, 'dragover': isDragOver }"
                                     @click="triggerFileInput"
                                     @drop="handleDrop"
                                     @dragover.prevent="isDragOver = true"
                                     @dragleave.prevent="isDragOver = false"
                                     @dragenter.prevent
                                     style="min-height: 150px; cursor: pointer; transition: all 0.3s ease;">
                                    <div class="upload-icon-container">
                                        <i class="fa fa-cloud-upload upload-icon"></i>
                                    </div>
                                    <h4 class="upload-text">
                                        {{ isDragOver ? 'Thả tập tin ở đây...' : 'Kéo và thả hoặc ' }}
                                        <span v-if="!isDragOver" class="clickable-text">ấn vào để chọn tệp</span>
                                    </h4>
                                </div>
                                
                                <!-- Hiển thị khi đã có file - thu gọn -->
                                <div v-if="selectedFile" class="file-list-container">
                                    <div class="file-item-display">
                                        <span class="icon one-file-plus file-icon"></span>
                                        <div class="file-details">
                                            <div class="file-name">{{ selectedFile.name }}</div>
                                            <div class="file-meta">Kích thước: {{ formatFileSize(selectedFile.size) }}</div>
                                        </div>
                                        <button @click.stop="removeSelectedFile" class="btn btn-sm btn-outline-danger btn-delete-file">
                                            <span class="icon one-trash"></span> Xóa
                                        </button>
                                    </div>
                                </div>
                                
                                <input type="file" ref="fileInput" @change="handleFileSelect" 
                                       accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" style="display: none">
                            </div>
                        </div>
                    </div>

                    <!-- Nút action -->
                    <div class="group-buttons -bottom right" style="margin-top: 20px;">
                        <button class="btn btn-second" style="min-width: 120px;" @click="saveAppendix">
                            <span class="icon one-save"></span>&nbsp;Lưu phụ lục
                        </button>
                        <button class="btn btn-second" style="min-width: 100px;" @click="hideCreateModal">
                            <span class="icon fa fa-times"></span>&nbsp;Hủy
                        </button>&nbsp;
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import moment from 'moment'
import AppendixAPI from '../API.js'

export default {
    name: 'ContractAppendixModal',
    props: {
        contractData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            appendixList: [],
            newAppendix: {
                name: '',
            },
            selectedFile: null,
            isDragOver: false,
            showValidation: false,
            showPreviewModal: false,
            previewFileName: '',
            previewFilePath: '',
            previewFileType: ''
        }
    },
    computed: {
        header() {
            if (this.contractData.contractName) {
                return `<span class="icon fa fa-file-text"></span> Phụ lục hợp đồng - ${this.contractData.contractName}`
            }
            return `<span class="icon fa fa-file-text"></span> Phụ lục hợp đồng`
        }
    },
    methods: {
        // Tải danh sách phụ lục từ API
        async loadAppendixList() {
            this.loading(true);
            const response = await AppendixAPI.getAppendices(this, this.contractData.id);
            this.loading(false);
            if (response && response.success) {
                this.appendixList = response.data;
            } else {
                this.appendixList = [];
            }
        },
        
        // Lưu phụ lục mới với file đính kèm
        async saveAppendix() {
            this.showValidation = true;
            if (!this.newAppendix.name.trim() || !this.selectedFile) {
                this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
                return;
            }
            
            const formData = new FormData();
            formData.append('contract_id', this.contractData.id);
            formData.append('contract_appendices_name', this.newAppendix.name);
            formData.append('file', this.selectedFile);

            const response = await AppendixAPI.addAppendix(this, formData);
            if (response && response.success) {
                this.$toast.success('Đã tạo phụ lục thành công!');
                this.hideCreateModal();
                await this.loadAppendixList(); // Tải lại danh sách
            }
        },
        
        // Xóa phụ lục sau khi xác nhận
        async deleteAppendix(appendix) {
            await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa phụ lục '${appendix.name}'?`)
                .then(async (result) => {
                    if (result === 0) return;
                    const response = await AppendixAPI.deleteAppendix(this, appendix.id);
                    if (response && response.success) {
                        this.$toast.success(`Đã xóa phụ lục '${appendix.name}' thành công`);
                        await this.loadAppendixList();
                    }
                });
        },
        
        // Tải file phụ lục về máy tính
        async downloadAppendix(appendix) {
            await AppendixAPI.downloadFileByPath(this, appendix.filePath, appendix.fileName);
        },
                
        // Hiển thị/ẩn loading spinner toàn cục
        loading(show) {
            this.$root.showLoading(show);
        },
        
        // Hiển thị modal chính quản lý phụ lục
        showModal() {
            this.$refs["popupAppendix"].show();
        },
        
        // Ẩn modal chính quản lý phụ lục
        hideModal() {
            this.$refs["popupAppendix"].hide();
        },
        
        // Xử lý khi modal chính được mở
        async handleShowModal() {
            await this.loadAppendixList();
        },
        
        // Hiển thị modal tạo mới phụ lục
        showCreateModal() {
            this.$refs["popupCreateAppendix"].show();
        },
        
        // Ẩn modal tạo mới phụ lục
        hideCreateModal() {
            this.$refs["popupCreateAppendix"].hide();
        },
        
        // Xử lý khi modal tạo mới được mở
        handleShowCreateModal() {
            this.clearCreateForm();
        },
        
        // Lấy extension của file từ tên file
        getFileExtension(fileName) {
            if (!fileName) return '';
            return fileName.split('.').pop();
        },
        
        // Kích hoạt input file ẩn
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        
        // Xử lý khi chọn file từ input
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) this.validateAndSetFile(file);
        },
        
        // Xử lý khi thả file vào khu vực drag & drop
        handleDrop(event) {
            event.preventDefault();
            this.isDragOver = false;
            const files = event.dataTransfer.files;
            if (files.length > 0) this.validateAndSetFile(files[0]);
        },
        
        // Validate và set file được chọn
        validateAndSetFile(file) {
            if (file.size > 10 * 1024 * 1024) {
                this.$toast.error('Kích thước tập tin không được vượt quá 10MB');
                return;
            }
            const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                this.$toast.error('Định dạng tập tin không được hỗ trợ');
                return;
            }
            this.selectedFile = file;
        },
        
        // Xóa file đã chọn
        removeSelectedFile() {
            this.selectedFile = null;
            this.$refs.fileInput.value = '';
        },
        
        // Xóa form tạo mới và reset trạng thái
        clearCreateForm() {
            this.newAppendix = { name: ''};
            this.selectedFile = null;
            this.showValidation = false;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        
        // Định dạng kích thước file từ bytes sang đơn vị dễ đọc
        formatFileSize(bytes) {
            if (bytes == null || bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        },
        
        // Định dạng ngày giờ theo chuẩn Việt Nam
        formatDate(date) {
            if (!date) return ''
            return moment(date).format('DD/MM/YYYY HH:mm')
        }
    }
}
</script>

<style src="../Contract.css" scoped> </style>
