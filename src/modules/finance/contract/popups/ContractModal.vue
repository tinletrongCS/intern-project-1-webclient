<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupContract"
        :showCloseIcon="true"
        width="70%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal"
        :close="hideModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Số hợp đồng <required-marker/></label>
                                <input type="text" v-model="contractNumber" class="form-control" :disabled="isViewDetail">
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Tên hợp đồng <required-marker/></label>
                                <input type="text" v-model="contractName" class="form-control" :disabled="isViewDetail">
                            </div>
                        </div>
                    </div>
                    <div v-if="isMedicalContract" class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Mã thuê bao</label>
                                <input type="text" v-model="subscriberCode" class="form-control" :disabled="isViewDetail">
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Dịch vụ <required-marker/></label>
                                <!-- <input type="text" v-model="service" class="form-control" :disabled="isViewDetail"> -->
                                <select2
                                    v-model='service'
                                    :options="service_list"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Hình thức hợp đồng <required-marker/></label>
                                <select2
                                    v-model='contractType'
                                    :options="contractTypes"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Tên khách hàng <required-marker/></label>
                                <!-- <select2
                                    v-model='customerId'
                                    :options="customer_list"
                                    :disabled="isViewDetail"
                                /> -->
                                <CustomerSelect ref="customerSelect" 
                                    v-model="khachhang_selected"
                                    :customerName="khachhang_selected.text"
                                    :disabled="isViewDetail"
                                    :isSelectAll="false"/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Ngày ký hợp đồng <required-marker/></label>
                                <ejs-datepicker
                                    v-model="signingDate"
                                    format="dd/MM/yyyy"
                                    :showClearButton="false"
                                    :allowEdit="true"
                                    :strict-mode="true"
                                    locale="vi"
                                    :firstDayOfWeek="1"
                                    :enabled="!isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Ngày bắt đầu hiệu lực <required-marker/></label>
                                <ejs-datepicker
                                    v-model="effectiveDate"
                                    format="dd/MM/yyyy"
                                    :showClearButton="false"
                                    :allowEdit="true"
                                    :strict-mode="true"
                                    locale="vi"
                                    :firstDayOfWeek="1"
                                    :enabled="!isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Ngày kết thúc hiệu lực <required-marker/></label>
                                <ejs-datepicker
                                    v-model="expiryDate"
                                    format="dd/MM/yyyy"
                                    :showClearButton="false"
                                    :allowEdit="true"
                                    :strict-mode="true"
                                    locale="vi"
                                    :firstDayOfWeek="1"
                                    :enabled="!isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Thời gian thực hiện <required-marker/></label>
                                <ejs-datepicker
                                    v-model="executionTime"
                                    format="dd/MM/yyyy"
                                    :showClearButton="false"
                                    :allowEdit="true"
                                    :strict-mode="true"
                                    locale="vi"
                                    :firstDayOfWeek="1"
                                    :enabled="!isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div v-if="isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Đơn vị ký hợp đồng <required-marker/></label>
                                <select2
                                    v-model="signingUnit"
                                    :options="unit_list"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div v-if="isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Số lượng <required-marker/></label>
                                <input type="text" v-model="quantity" class="form-control" :disabled="isViewDetail" @input="formatCurrency($event, 'quantity')">
                            </div>
                        </div>
                        <div v-if="isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Đơn giá (VNĐ) <required-marker/></label>
                                <input type="text" v-model="unitPrice" class="form-control" :disabled="isViewDetail" @input="formatCurrency($event, 'unitPrice')">
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Giá trị trước thuế</label>
                                <input type="text" v-model="valueBeforeTax" class="form-control" :disabled="isViewDetail" @input="formatCurrency($event, 'valueBeforeTax')">
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Giá trị sau thuế</label>
                                <input type="text" v-model="valueAfterTax" class="form-control" :disabled="isViewDetail" @input="formatCurrency($event, 'valueAfterTax')">
                            </div>
                        </div>
                        <div v-if="isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Người triển khai</label>
                                <select2
                                    v-model="userImplement"
                                    :options="user_list"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div v-if="isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Người hỗ trợ</label>
                                <select2
                                    v-model="userSupport"
                                    :options="user_list"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div v-if="!isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Dự án <required-marker/></label>
                                <select2
                                    v-model='project'
                                    :options="projects_for_modal"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Kỳ thanh toán <required-marker/></label>
                                <select2
                                    v-model='periodId'
                                    :options="paymentPeriods"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div v-if="isMedicalContract" class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Trạng thái hợp đồng</label>
                                <select2
                                    v-model="contractStatus"
                                    :options="statuses"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div v-if="isMedicalContract" class="col-sm-12 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Ghi chú</label>
                                <textarea :value="note" class="form-control" rows="5" 
                                    @change="e => note = e.target.value"
                                    :disabled="isViewDetail"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                       <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <div class="d-flex align-items-center pt-2" style="gap: 12px;">
                                    <label class="form-check-label mb-0 bold" for="reminderCheckbox">Nhắc hạn</label>
                                    <input
                                        type="checkbox"
                                        v-model="reminderEnabled"
                                        class="form-check-input"
                                        id="reminderCheckbox"
                                        :disabled="isViewDetail"
                                        style="position: relative; margin: 0;border: 2px solid #999999; border-radius: 3px;"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Tệp tin đính kèm <required-marker/></label>
                                
                                <!-- Hiển thị khi không có file -->
                                <div v-if="fileAttachments.length === 0 && filesToUpload.length === 0" class="no-files-placeholder">
                                    <i class="fa fa-file-o no-files-icon"></i>
                                    <p>Không có tệp tin đính kèm</p>
                                </div>
                                
                                <!-- Danh sách file đính kèm -->
                                <div v-if="fileAttachments.length > 0 || filesToUpload.length > 0" class="file-list-container">
                                    <div v-for="file in fileAttachments" :key="'old-' + file.id" class="file-item-display">
                                        <span class="icon one-file file-icon"></span>
                                        <div class="file-details">
                                            <div class="file-name">{{ file.fileName }}</div>
                                            <div v-if="file.fileSize != null && file.fileSize !== undefined" class="file-meta">Kích thước: {{ formatFileSize(file.fileSize) }}</div>
                                        </div>
                                        <button class="btn btn-second mr-1" @click="onDownloadFile(file)">
                                            <span class="icon one-download"></span> Tải xuống
                                        </button>
                                        <button v-if="!isViewDetail" class="btn btn-second" @click="onRemoveFile(file, false)">
                                            <span class="icon one-trash"></span> Xóa
                                        </button>
                                    </div>
                                    <div v-for="file in filesToUpload" :key="'new-' + file.name" class="file-item-display new-file">
                                        <span class="icon one-file-plus file-icon"></span>
                                        <div class="file-details">
                                            <div class="file-name">{{ file.name }}</div>
                                            <div class="file-meta">Kích thước: {{ formatFileSize(file.size) }}</div>
                                        </div>
                                        <button class="btn btn-second" @click="onRemoveFile(file, true)">
                                            <span class="icon one-trash"></span> Xóa
                                        </button>
                                    </div>
                                </div>

                                <div v-if="!isViewDetail"
                                    class="file-upload-area"
                                    :class="{ 'dragover': isDragOver }"
                                    @dragover.prevent="isDragOver = true"
                                    @dragleave.prevent="isDragOver = false"
                                    @drop.prevent="handleFileDrop"
                                    @click="triggerFileUpload">
                                    <input type="file" ref="fileInput" multiple @change="onSelectFiles" style="display:none;" />
                                    <div class="upload-icon-container">
                                        <i class="fa fa-cloud-upload upload-icon"></i>
                                    </div>
                                    <h4 class="upload-text">
                                        {{ isDragOver ? 'Thả tập tin ở đây...' : 'Kéo và thả hoặc ' }}
                                        <span v-if="!isDragOver" class="clickable-text">ấn vào để chọn tệp</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="group-buttons -bottom right modal-buttons">
                        <button v-if="!isViewDetail" @click="onSave" class="btn btn-second nocorner btn-save-contract">
                            <span class="icon one-save"></span> Lưu thay đổi
                        </button>
                         <button @click="hideModal" class="btn btn-primary nocorner">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import moment from 'moment'
import API from '../API.js'
import CustomerSelect from '@/modules/work/kanban/search/CustomerSelect.vue'

export default {
    name:'ContractModal',
    components: {
        CustomerSelect
    },
    props:{
      isAdd:{
        type:Boolean,
        default:false
      },
      isViewDetail:{
        type:Boolean,
        default:true
      },
      data:{
        type:Object,
        default: () => ({})
      },
      project_list: {
        type: Array,
        default: () => []
      },
      service_list: {
        type: Array,
        default: () => []
      },
      user_list: {
        type: Array,
        default: () => []
      },
      unit_list: {
        type: Array,
        default: () => []
      },
      customer_list: {
        type: Array,
        default: () => []
      },
      contract_type: {
          type: Number,
          default: null
      }
    },
    computed:{
      header(){
        if(this.isAdd){
          return `<span class="icon one-notepad"></span> Tạo mới hợp đồng`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh hợp đồng`
        }else{
          return `<span class="icon one-notepad"></span> Chi tiết hợp đồng`
        }
      },
      projects_for_modal() {
          return [{ id: null, text: 'Chọn dự án' }, ...this.project_list];
      },
      isMedicalContract() {
          return this.$route.path.includes('medicalcontract');
      }
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            currentDate: new Date(new Date().setHours(0,0,0,0)),

            // Dữ liệu form hợp đồng
            contractNumber: '',
            contractName: '',
            contractType: '',
            subscriberCode: '',
            service: null,
            signingDate: new Date(),
            signingUnit: null,
            effectiveDate: new Date(),
            expiryDate: new Date(),
            executionTime: new Date(),
            quantity: '',
            unitPrice: '',
            valueBeforeTax: '',
            valueAfterTax: '',
            userImplement: null,
            userSupport: null,
            project: null,
            khachhang_selected:{
                id: 0,
                selected:true,
                text:""
            },
            customerId: null,
            periodId: null,
            contractStatus: null,
            note: '',
            reminderEnabled: false,

            // Dữ liệu cho các lựa chọn
            contractTypes: [
                { id: 1, text: 'Mua trọn gói' },
                { id: 2, text: 'Thuê dịch vụ' },
                { id: 3, text: 'Khác' },
            ],
            paymentPeriods: [
                { id: null, text: 'Chọn kỳ thanh toán' },
                { id: 1, text: 'Tháng' },
                { id: 3, text: 'Quý' },
                { id: 6, text: '6 tháng' },
                { id: 12, text: 'Năm' }
            ],
            statuses: [
                { id: 1, text: 'Ký mới' },
                { id: 2, text: 'Duy trì' },
                { id: 3, text: 'Thanh lý' },
                { id: 4, text: 'Chào Giải pháp' },
            ],
            // Dữ liệu xử lý file
            fileAttachments: [],
            filesToUpload: [],
            filesToDelete: [],

            // Trạng thái giao diện
            isDragOver: false,
        }
    },
    methods:{
        // Hiển thị/ẩn loading spinner toàn cục
        loading(show) {
            this.$root.showLoading(show)
        },
        
        // Hiển thị modal hợp đồng
        showModal() {
            this.$refs["popupContract"].show()
        },
        
        // Ẩn modal hợp đồng
        hideModal() {
            this.clear()
            this.$refs["popupContract"].hide()
        },
        
        // Xử lý khi modal được mở
        handleShowModal(){
            this.clear();
            if(!this.isAdd){
                this.loadData();
            }
        },
        
        // Xóa tất cả dữ liệu form và reset về trạng thái ban đầu
        clear(){
            this.contractNumber = ''
            this.contractName = ''
            this.contractType = ''
            this.subscriberCode = ''
            this.service = null
            this.signingDate = new Date()
            this.signingUnit = null
            this.effectiveDate = new Date()
            this.expiryDate = new Date()
            this.executionTime = new Date()
            this.quantity = ''
            this.unitPrice = ''
            this.valueBeforeTax = ''
            this.valueAfterTax = ''
            this.userImplement = null
            this.userSupport = null
            this.project = null
            this.customerId = null
            this.khachhang_selected = {
                id: 0,
                selected:true,
                text:''
            }
            this.periodId = null
            this.contractStatus = null
            this.note = ''
            this.reminderEnabled = false
            this.fileAttachments = []
            this.filesToUpload = []
            this.filesToDelete = []
        },
        
        // Load dữ liệu hợp đồng vào form khi chỉnh sửa
        loadData(){
            if(this.data){
                this.contractNumber = this.data.contractNumber || ''
                this.contractName = this.data.contractName || ''
                this.contractType = this.data.contractTypeId || ''
                this.subscriberCode = this.data.subscriberCode || ''
                this.service = this.data.service || null
                this.signingDate = this.data.signingDate ? new Date(this.data.signingDate) : new Date()
                this.signingUnit = this.data.signingUnit || null
                this.effectiveDate = this.data.effectiveDate ? new Date(this.data.effectiveDate) : new Date()
                this.expiryDate = this.data.expiryDate ? new Date(this.data.expiryDate) : new Date()
                this.executionTime = this.data.executionTime ? new Date(this.data.executionTime) : new Date()
                this.quantity = this.data.quantity ? this.data.quantity.toLocaleString('de-DE') : ''
                this.unitPrice = this.data.unitPrice ? this.data.unitPrice.toLocaleString('de-DE') : ''
                this.valueBeforeTax = this.data.valueBeforeTax ? this.data.valueBeforeTax.toLocaleString('de-DE') : ''
                this.valueAfterTax = this.data.valueAfterTax ? this.data.valueAfterTax.toLocaleString('de-DE') : ''
                this.userImplement = this.data.userImplement || null
                this.userSupport = this.data.userSupport || null
                this.project = this.data.projectId || null
                this.khachhang_selected.id = this.data.customerId || null
                this.khachhang_selected.text = this.data.customerName || ''
                this.periodId = this.data.periodId || null
                this.contractStatus = this.data.contractStatus || null
                this.note = this.data.note || ''
                this.reminderEnabled = this.data.remindFlag || false
                this.fileAttachments = this.data.fileAttachments || []
            }
        },
        formatCurrency(event, model) {
            let value = event.target.value.replace(/[^\d]/g, '');
            this[model] = value ? parseInt(value, 10).toLocaleString('de-DE') : '';
        },
        triggerFileUpload() {
            if (this.isViewDetail) return;
            // Gọi trực tiếp click() trên ref của input
            this.$refs.fileInput.click();
        },
        handleFileDrop(event) {
            if (this.isViewDetail) return;
            this.isDragOver = false;
            this.addFilesToList(event.dataTransfer.files);
        },
        onSelectFiles(event) {
            this.addFilesToList(event.target.files);
            // Reset input để có thể chọn lại cùng file ngay sau đó
            this.$refs.fileInput.value = null;
        },
        addFilesToList(files) {
            if (!files || files.length === 0) return;
            const newFiles = Array.from(files).filter(file =>
                !this.filesToUpload.some(existingFile => existingFile.name === file.name) &&
                !this.fileAttachments.some(existingFile => existingFile.fileName === file.name)
            );
             if (newFiles.length !== files.length) {
                this.$toast.warning('Một hoặc nhiều file đã tồn tại và sẽ không được thêm vào.');
            }
            this.filesToUpload.push(...newFiles);
        },
        onRemoveFile(file, isNewFile) {
            if (isNewFile) {
                // Xóa file khỏi mảng các file mới chọn (chưa upload)
                this.filesToUpload = this.filesToUpload.filter(f => f.name !== file.name);
            } else {
                // Xử lý xóa file đã có trên server
                this.$confirm(`Bạn chắc chắn muốn xóa tập tin '${file.fileName}'? Thao tác này sẽ xóa vĩnh viễn file khỏi hệ thống khi bạn lưu thay đổi.`, 'Xác nhận',
                {
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Hủy',
                    type: 'warning'
                }).then(() => {
                    // Đánh dấu file này sẽ bị xóa khi nhấn "Lưu thay đổi"
                    this.filesToDelete.push(file.id);
                    // Xóa file khỏi danh sách hiển thị trên giao diện
                    this.fileAttachments = this.fileAttachments.filter(f => f.id !== file.id);
                    this.$toast.info(`'${file.fileName}' sẽ được xóa sau khi bạn lưu thay đổi.`);
                }).catch(()=>{
                    // Người dùng nhấn "Hủy", không làm gì cả
                });
            }
        },
        formatFileSize(bytes) {
            if (!bytes || bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        async onDownloadFile(file) {
            if (!file.id) {
                this.$toast.error("Không tìm thấy ID của file đính kèm.");
                return;
            }
            // Gọi đến hàm API mới, truyền vào ID và tên file
            await API.downloadContractAttachment(this, file.id, file.fileName);
        },
        async onSave(){
            if (!this.contractNumber.trim() ||
                !this.contractName.trim() ||
                !this.khachhang_selected.id ||
                !this.periodId ||
                (!this.isMedicalContract && !this.project) ||
                (this.isMedicalContract && (!this.service || !this.signingUnit || !this.quantity || !this.unitPrice)) ||
                !this.signingDate ||   
                !this.effectiveDate || 
                !this.expiryDate ||    
                !this.executionTime ||
                (this.fileAttachments.length === 0 && this.filesToUpload.length === 0)) {
                this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
                return;
            }
            if (this.expiryDate < this.effectiveDate) {
                this.$toast.error('Ngày kết thúc hiệu lực không được nhỏ hơn ngày bắt đầu hiệu lực.');
                return;
            }
            const formData = new FormData();
            formData.append('contract_id', this.isAdd ? 0 : this.data.id);
            formData.append('code', this.contractNumber);
            formData.append('name', this.contractName);
            formData.append('customer_id', this.khachhang_selected.id);
            if (this.subscriberCode) {
                formData.append('subscriber_code', this.subscriberCode);
            }
            if (this.service) {
                formData.append('service', this.service);
            }
            formData.append('sign_date', moment(this.signingDate).format('YYYY-MM-DD'));
            if (this.signingUnit) {
                formData.append('sign_unit', this.signingUnit);
            }
            formData.append('start_date', moment(this.effectiveDate).format('YYYY-MM-DD'));
            formData.append('end_date', moment(this.expiryDate).format('YYYY-MM-DD'));
            formData.append('active_date', moment(this.executionTime).format('YYYY-MM-DD'));
            formData.append('quantity', parseInt(String(this.quantity).replace(/[^\d]/g, '')) || 0);
            formData.append('unit_price', parseInt(String(this.unitPrice).replace(/[^\d]/g, '')) || 0);
            formData.append('amount', parseInt(String(this.valueBeforeTax).replace(/[^\d]/g, '')) || 0);
            formData.append('amount_vat', parseInt(String(this.valueAfterTax).replace(/[^\d]/g, '')) || 0);
            if (this.userImplement) {
                formData.append('user_implement', this.userImplement);
            }
            if (this.userSupport) {
                formData.append('user_support', this.userSupport);
            }
            formData.append('type', this.contractType);
            formData.append('contract_type', this.contract_type);
            formData.append('period_id', this.periodId);
            if (this.contractStatus) {
                formData.append('status', this.contractStatus);
            }
            formData.append('note', this.note);
            formData.append('remind_flg', this.reminderEnabled);
            if (this.project) {
                formData.append('project_id', this.project);
            }

            if (this.filesToDelete.length > 0) {
                formData.append('filesToDelete', JSON.stringify(this.filesToDelete));
            }

            for (const file of this.filesToUpload) {
                formData.append('files', file);
            }

            let response;
            if (this.isAdd) {
                response = await API.AddContract(this, formData);
            } else {
                response = await API.UpdateContract(this, formData);
            }

            if (response && response.success) {
                this.$emit('successContract');
                this.hideModal();
            }
        }
    }
}
</script>

<style src="../Contract.css" scoped> </style>