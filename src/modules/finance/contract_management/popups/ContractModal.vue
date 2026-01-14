<template>
    <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
        :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupContract" :showCloseIcon="true" width="70%"
        id="contract-modal" :isModal='true' :target="target" :header="header" :open="handleShowModal"
        :close="hideModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="section-header section-header--under">
                                <span class="section-header__title">1. Thông tin hợp đồng</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Số hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Số hợp đồng <required-marker /></label>
                                <input type="text" v-model="contractNumber" class="form-control"
                                    :ref="el => setFieldRef('contractNumber', el)"
                                    :class="{ 'is-invalid blink': invalidFields.contractNumber }"
                                    :disabled="isViewDetail" placeholder="VD: HĐ-2025/001">
                            </div>
                        </div>

                        <!-- Tên hợp đồng -->
                        <div class="col-sm-8 col-12">
                            <div class="form-group">
                                <label class="form-label">Tên hợp đồng <required-marker /></label>
                                <input type="text" v-model="contractName" class="form-control" :disabled="isViewDetail"
                                    :class="{ 'is-invalid blink': invalidFields.contractName }"
                                    :ref="el => setFieldRef('contractName', el)" placeholder="Nhập tên hợp đồng">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Khách hàng-->
                        <div class="col-sm-8 col-12">
                            <div class="form-group">
                                <label class="form-label">Khách hàng <required-marker /></label>
                                <div class="select2-wrap" :ref="el => setFieldRef('customer_id', el)"
                                    :class="{ 'is-invalid blink': invalidFields.customer_id }">
                                    <CustomerSelect ref="customerSelect" v-model="khachhang_selected"
                                        :customerName="khachhang_selected.text" :disabled="isViewDetail"
                                        :isSelectAll="false" />
                                </div>
                            </div>
                        </div>

                        <!-- Nhân sự hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Nhân sự hợp đồng <required-marker /></label>
                                <div class="select2-wrap" :ref="el => setFieldRef('owner_user_id', el)"
                                    :class="{ 'is-invalid blink': invalidFields.owner_user_id }">
                                    <select2 v-model="owner_user_id" :options="user_TTKD_list" :disabled="isViewDetail"
                                        :settings="{ placeholder: 'Chọn nhân sự hợp đồng', allowClear: false, width: '100%' }" />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Loại hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Loại hợp đồng <required-marker /></label>
                                <div class="select2-wrap" :ref="el => setFieldRef('contract_type', el)"
                                    :class="{ 'is-invalid blink': invalidFields.contract_type }">
                                    <select2 v-model="contract_type" :options="type_contract_list"
                                        :disabled="isViewDetail"
                                        :settings="{ placeholder: 'Chọn loại hợp đồng', allowClear: false, width: '100%' }" />
                                </div>
                            </div>
                        </div>

                        <!-- Hình thức thực hiện hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Hình thức thực hiện hợp đồng <required-marker /></label>
                                <div class="select2-wrap" :ref="el => setFieldRef('form_contract_execution', el)"
                                    :class="{ 'is-invalid blink': invalidFields.form_contract_execution }">
                                    <select2 v-model="form_contract_execution" :options="form_contract_execution_list"
                                        :disabled="isViewDetail"
                                        :settings="{ placeholder: 'Chọn hình thức thực hiện hợp đồng', allowClear: false, width: '100%' }" />
                                </div>
                            </div>
                        </div>

                        <!-- Hình thức thanh toán -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Hình thức thanh toán <required-marker /></label>
                                <div class="select2-wrap" :ref="el => setFieldRef('form_payment_selected', el)"
                                    :class="{ 'is-invalid blink': invalidFields.form_payment_selected }">
                                    <select2 v-model="form_payment_selected" :options="form_payment_list"
                                        :disabled="isViewDetail"
                                        :settings="{ placeholder: 'Chọn hình thức thanh toán', allowClear: false, width: '100%' }" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Loại doanh thu -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Loại doanh thu <required-marker /></label>
                                <div class="select2-wrap" :ref="el => setFieldRef('type_revenue_selected', el)"
                                    :class="{ 'is-invalid blink': invalidFields.type_revenue_selected }">
                                    <select2 v-model="type_revenue_selected" :options="type_revenue"
                                        :disabled="isViewDetail"
                                        :settings="{ placeholder: 'Chọn loại doanh thu', allowClear: false, width: '100%' }" />
                                </div>
                            </div>
                        </div>

                        <!-- Giá trị hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Giá trị hợp đồng <required-marker /></label>
                                <input type="text" v-model="contract_value" class="form-control"
                                    :ref="el => setFieldRef('contractValue', el)"
                                    :class="{ 'is-invalid blink': invalidFields.contractValue }"
                                    :disabled="isViewDetail" @input="formatCurrency($event, 'contract_value')"
                                    placeholder="Nhập giá trị hợp đồng">
                            </div>
                        </div>

                        <!-- Giá trị doanh thu -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Giá trị doanh thu <required-marker /></label>
                                <input type="text" v-model="revenue_value" class="form-control" :disabled="isViewDetail"
                                    @input="formatCurrency($event, 'revenue_value')"
                                    :ref="el => setFieldRef('revenueValue', el)"
                                    :class="{ 'is-invalid blink': invalidFields.revenueValue }"
                                    placeholder="Nhập giá trị doanh thu">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="section-header section-header--under">
                                <!-- <i class="fa fa-calendar section-header__icon" aria-hidden="true"></i> -->
                                <span class="section-header__title">2. Mốc thời gian hợp đồng</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Ngày ký hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Ngày ký hợp đồng</label>
                                <ejs-datepicker v-model="contract_sign_date" format="dd/MM/yyyy"
                                    :showClearButton="false" :allowEdit="true" :strict-mode="true" locale="vi"
                                    :firstDayOfWeek="1" :enabled="!isViewDetail" placeholder="Chọn ngày ký hợp đồng"
                                    class="datepicker-contract" cssClass="datepicker-contract" />
                            </div>
                        </div>

                        <!-- Thời gian thực hiện hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Thời gian thực hiện hợp đồng</label>
                                <input type="text" v-model="contract_execution_time" class="form-control"
                                    :disabled="isViewDetail" placeholder="Nhập thời gian thực hiện hợp đồng">
                            </div>
                        </div>

                        <!-- Ngày hết hạn hợp đồng -->
                        <div class="col-sm-4 col-12">
                            <div class="form-group">
                                <label class="form-label">Ngày hết hạn hợp đồng</label>
                                <ejs-datepicker v-model="contract_expiration_date" format="dd/MM/yyyy"
                                    :showClearButton="false" :allowEdit="true" :strict-mode="true" locale="vi"
                                    :firstDayOfWeek="1" :enabled="!isViewDetail" class="datepicker-contract" cssClass="datepicker-contract"
                                    placeholder="Chọn ngày hết hạn hợp đồng" />
                            </div>
                        </div>

                        <!-- Danh sách các đợt nghiệm thu -->
                        <div class="col-sm-12 col-12">
                            <div class="form-group">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <label class="form-label mb-0">Ngày các đợt nghiệm thu và thanh toán</label>

                                    <button type="button" class="btn btn-link p-0" @click="addAcceptancePhase"
                                        :disabled="isViewDetail">
                                        <i class="fa fa-plus-circle me-1"></i> Thêm mới đợt
                                    </button>
                                </div>

                                <div v-for="(phase, idx) in acceptance_phases" :key="phase._key"
                                    class="border rounded p-2 mb-2">
                                    <div class="row align-items-center">
                                        <!-- Đợt -->
                                        <div class="col-sm-4 col-12">
                                            <label class="form-label">Đợt</label>
                                            <input type="text" v-model="phase.phase_name" class="form-control"
                                                :disabled="isViewDetail" placeholder="VD: Đợt 1" />
                                        </div>

                                        <!-- Ngày nghiệm thu -->
                                        <div class="col-sm-4 col-12">
                                            <label class="form-label">Ngày nghiệm thu</label>
                                            <ejs-datepicker v-model="phase.acceptance_date" format="dd/MM/yyyy"
                                                :showClearButton="false" :allowEdit="true" :strict-mode="true"
                                                locale="vi" :firstDayOfWeek="1" :enabled="!isViewDetail" class="datepicker-contract" cssClass="datepicker-contract"
                                                placeholder="Chọn ngày nghiệm thu" />
                                        </div>

                                        <!-- Giá trị nghiệm thu -->
                                        <div class="col-sm-3 col-12">
                                            <label class="form-label">Giá trị nghiệm thu</label>
                                            <input type="text" v-model="phase.acceptance_value" class="form-control"
                                                :disabled="isViewDetail" placeholder="Nhập giá trị nghiệm thu"
                                                @input="onPhaseCurrencyInput($event, phase, 'acceptance_value')" />
                                        </div>

                                        <!-- Xoá -->
                                        <div class="col-sm-1 col-12 d-flex justify-content-end mt-sm-4 mt-2">
                                            <button type="button" class="btn btn-outline-danger btn-sm" title="Xoá"
                                                @click="removeAcceptancePhase(idx)" :disabled="isViewDetail">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- empty state -->
                                <div v-if="acceptance_phases.length === 0" class="text-muted">
                                    Chưa có đợt nghiệm thu. Nhấn “Thêm mới đợt” để tạo.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="section-header section-header--under">
                                <!-- <i class="fa fa-calendar section-header__icon" aria-hidden="true"></i> -->
                                <span class="section-header__title">3. Nghiệm thu</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Ngày ký nghiệm thu -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Ngày ký nghiệm thu</label>
                                <ejs-datepicker v-model="acceptance_sign_date" format="dd/MM/yyyy"
                                    :showClearButton="false" :allowEdit="true" :strict-mode="true" locale="vi"
                                    :firstDayOfWeek="1" :enabled="!isViewDetail" class="datepicker-contract" cssClass="datepicker-contract"
                                    placeholder="Chọn ngày ký nghiệm thu" />
                            </div>
                        </div>


                        <!-- Giá trị nghiệm thu -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Giá trị nghiệm thu</label>
                                <input type="text" v-model="acceptance_value" class="form-control"
                                    :disabled="isViewDetail" @input="formatCurrency($event, 'acceptance_value')"
                                    placeholder="Nhập giá trị nghiệm thu">
                            </div>
                        </div>

                        <!-- Ngày xuất hoá đơn -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Ngày xuất hoá đơn</label>
                                <ejs-datepicker v-model="invoice_date" format="dd/MM/yyyy" :showClearButton="false"
                                    :allowEdit="true" :strict-mode="true" locale="vi" :firstDayOfWeek="1" class="datepicker-contract" cssClass="datepicker-contract"
                                    :enabled="!isViewDetail" placeholder="Chọn ngày xuất hoá đơn" />
                            </div>
                        </div>

                        <!-- Giá trị hoá đơn -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Giá trị hoá đơn</label>
                                <input type="text" v-model="invoice_value" class="form-control" :disabled="isViewDetail"
                                    @input="formatCurrency($event, 'invoice_value')" placeholder="Nhập giá trị hoá đơn">
                            </div>
                        </div>

                        <!-- Tình trạng thanh toán hợp đồng -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Tình trạng thanh toán hợp đồng
                                </label>
                                <select2 v-model="contract_payment_status" :options="status_payment_contract_list"
                                    :disabled="isViewDetail"
                                    :settings="{ placeholder: 'Chọn tình trạng thanh toán hợp đồng', allowClear: false, width: '100%' }" />
                            </div>
                        </div>

                        <!-- Sản phẩm dịch vụ -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Sản phẩm dịch vụ</label>
                                <Select2Multiple v-model="productServiceIds" :options="service_list" multiple />
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="form-group">
                                <label class="form-label">Tệp tin đính kèm </label>

                                <div v-if="fileAttachments.length === 0 && filesToUpload.length === 0"
                                    class="no-files-placeholder">
                                    <i class="fa fa-file-o no-files-icon"></i>
                                    <p>Không có tệp tin đính kèm</p>
                                </div>

                                <div v-if="fileAttachments.length > 0 || filesToUpload.length > 0"
                                    class="file-list-container">
                                    <div v-for="file in fileAttachments" :key="'old-' + file.id"
                                        class="file-item-display">
                                        <span class="icon one-file file-icon"></span>
                                        <div class="file-details">
                                            <div class="file-name">{{ file.fileName }}</div>
                                            <div v-if="file.fileSize != null && file.fileSize !== undefined"
                                                class="file-meta">Kích thước: {{ formatFileSize(file.fileSize) }}</div>
                                        </div>
                                        <button class="btn btn-second mr-1" @click="onDownloadFile(file)">
                                            <span class="icon one-download"></span> Tải xuống
                                        </button>
                                        <button v-if="!isViewDetail" class="btn btn-second"
                                            @click="onRemoveFile(file, false)">
                                            <span class="icon one-trash"></span> Xóa
                                        </button>
                                    </div>
                                    <div v-for="file in filesToUpload" :key="'new-' + file.name"
                                        class="file-item-display new-file">
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

                                <div v-if="!isViewDetail" class="file-upload-area" :class="{ 'dragover': isDragOver }"
                                    @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false"
                                    @drop.prevent="handleFileDrop" @click="triggerFileUpload">
                                    <input type="file" ref="fileInput" multiple @change="onSelectFiles"
                                        style="display:none;" />
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

                    <!-- <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="key w200 bold">Đính kèm file</div>
                            <div class="value wp100">
                                <AttachFile v-if="!disabledFileAttack" ref="attachFile"
                                    @onSelectFiles="onSelectFiles" />
                                <div v-for="(file, i) in fileAttachments" :key="i" class="file-item">
                                    <a @click.prevent="downloadFile(file)" class="file-link" style="cursor: pointer;">
                                        {{ file.fileName || file.file_name }}
                                    </a>
                                    <button v-if="!disabledFileAttack" class="btn-delete" title="Xóa file"
                                        @click="onRemoveFile(file)">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> -->

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
import Select2Multiple from '@/components/controls/Select2Multiple.vue'
import AttachFile from './AttachFile.vue';
export default {
    name: 'ContractModal',
    components: {
        CustomerSelect,
        Select2Multiple,
        AttachFile
    },
    props: {
        isAdd: {
            type: Boolean,
            default: false
        },
        isViewDetail: {
            type: Boolean,
            default: true
        },
        data: {
            type: Object,
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
    computed: {
        header() {
            if (this.isAdd) {
                return `<span class="icon one-notepad"></span> Thêm mới hợp đồng`
            } else if (!this.isAdd && !this.isViewDetail) {
                return `<span class="icon one-notepad"></span> Điều chỉnh hợp đồng`
            } else {
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
    data() {
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            currentDate: new Date(new Date().setHours(0, 0, 0, 0)),

            // Dữ liệu form hợp đồng
            contractNumber: '',
            contractName: '',
            khachhang_selected: {
                id: 0,
                selected: true,
                text: ""
            },
            owner_user_id: null,
            contract_type: '',
            form_contract_execution: null,
            form_payment_selected: null,
            type_revenue_selected: null,
            contract_value: '',
            revenue_value: '',
            contract_sign_date: null,
            contract_execution_time: null,
            contract_expiration_date: null,
            test_payment_date: null,
            acceptance_sign_date: null,
            invoice_date: null,
            contract_payment_status: null,
            acceptance_value: null,
            invoice_value: null,
            productServiceIds: [],


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
            user_TTKD_list: [],
            type_contract_list: [
                { id: 1, text: 'Trọn gói' },
                { id: 2, text: 'Đơn giá cố định' },
                { id: 3, text: 'Đơn giá điều chỉnh' },
            ],
            form_contract_execution_list: [
                { id: 1, text: 'Cung cấp SPDV 1 lần' },
                { id: 2, text: 'Thuê SPDV theo định kỳ' }
            ],
            form_payment_list: [
                { id: 1, text: 'Thanh toán 1 lần' },
                { id: 2, text: 'Thanh toán định kỳ' }
            ],
            type_revenue: [
                { id: 1, text: 'Doanh thu duy trì' },
                { id: 2, text: 'Doanh thu phát triển mới' }
            ],
            status_payment_contract_list: [
                { id: 1, text: 'Đã thanh toán' },
                { id: 2, text: 'Chưa thanh toán' }
            ],
            acceptance_phases: [],
            invalidFields: {
                contractNumber: false,
                contractName: false,
                customer_id: false,
                owner_user_id: false,
                contract_type: false,
                form_contract_execution: false,
                form_payment_selected: false,
                type_revenue_selected: false,
                contractValue: false,
                revenueValue: false,
            },
            fieldRefs: {}
        }
    },
    methods: {
        resetValidation() {
            Object.keys(this.invalidFields).forEach(k => (this.invalidFields[k] = false));
        },
        setFieldRef(key, el) {
            if (el) this.fieldRefs[key] = el;
        },

        scrollToField(key) {
            this.$nextTick(() => {
                const el = this.fieldRefs[key];
                if (!el) return;

                // el có thể là Vue component root hoặc div/input
                const dom = el.$el ? el.$el : el;
                dom.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // focus nếu là input
                setTimeout(() => {
                    const focusEl =
                        dom.matches?.('input,textarea,select') ? dom :
                            dom.querySelector?.('input,textarea,select,[tabindex]');

                    focusEl?.focus?.();
                }, 250);
            });
        },
        // Hiển thị/ẩn loading spinner toàn cục
        loading(show) {
            this.$root.showLoading(show)
        },

        // Hiển thị modal hợp đồng
        showModal() {
            this.$refs["popupContract"].show()
            this.loadUserTTKD()
            this.ensureAtLeastOnePhase()
            this.resetValidation();
        },

        // Ẩn modal hợp đồng
        hideModal() {
            this.clear()
            this.$refs["popupContract"].hide()
        },

        // Xử lý khi modal được mở
        handleShowModal() {
            this.clear();
            if (!this.isAdd) {
                this.loadData();
            }
        },

        // Xóa tất cả dữ liệu form và reset về trạng thái ban đầu
        clear() {
            // ===== Core info =====
            this.contractNumber = '';
            this.contractName = '';

            // ===== Customer =====
            this.khachhang_selected = { id: null, text: '' };

            // ===== Owner =====
            this.owner_user_id = null;

            // ===== Dropdowns =====
            this.contract_type = null;
            this.form_contract_execution = null;
            this.form_payment_selected = null;
            this.type_revenue_selected = null;

            // ===== Money (để '' để placeholder hiện) =====
            this.contract_value = '';
            this.revenue_value = '';
            this.acceptance_value = '';
            this.invoice_value = '';

            // ===== Dates (null để placeholder hiện) =====
            this.contract_sign_date = null;
            this.contract_expiration_date = null;
            this.acceptance_sign_date = null;
            this.invoice_date = null;

            // ===== Text / misc =====
            this.test_payment_date = '';
            this.contract_execution_time = '';

            // ===== Status / optional fields =====
            this.acceptance_status = 0;
            this.contract_payment_status = 0;
            this.product_service = '';
            this.note = '';
            this.source_contract_id = null;

            // ===== Active =====
            this.active = true;

            // ===== Files =====
            this.fileAttachments = [];
            this.filesToUpload = [];
            this.filesToDelete = [];

            // ===== Services =====
            this.productServiceIds = [];

            // ===== Phases: luôn có sẵn 1 đợt (theo yêu cầu trước) =====
            this.acceptance_phases = [{
                phase_id: null,
                phase_name: 'Đợt 1',
                acceptance_date: null,
                acceptance_value: '',
                active: true,
                _key: Math.random().toString(36).slice(2)
            }];
        },

        loadData() {
            if (!this.data) return;

            // ===== Core info =====
            this.contractNumber = this.data.contract_no || '';
            this.contractName = this.data.contract_name || '';

            // ===== Customer =====
            this.khachhang_selected = {
                id: this.data.customer_id || null,
                text: this.data.customer_name || ''
            };

            // ===== Owner / nhân sự =====
            this.owner_user_id = this.data.owner_user_id || null;

            // ===== Dropdowns =====
            this.contract_type = this.data.contract_type || null;
            this.form_contract_execution = this.data.form_contract_execution || null;
            this.form_payment_selected = this.data.form_payment_selected || null;
            this.type_revenue_selected = this.data.revenue_type || null;

            // ===== Money (format lại để bind input currency) =====
            this.contract_value = this.data.contract_value
                ? Number(this.data.contract_value).toLocaleString('vi-VN')
                : '';

            this.revenue_value = this.data.revenue_value
                ? Number(this.data.revenue_value).toLocaleString('vi-VN')
                : '';

            this.acceptance_value = this.data.acceptance_value
                ? Number(this.data.acceptance_value).toLocaleString('vi-VN')
                : '';

            this.invoice_value = this.data.invoice_value
                ? Number(this.data.invoice_value).toLocaleString('vi-VN')
                : '';

            // ===== Dates =====
            this.contract_sign_date = this.data.contract_sign_date
                ? new Date(this.data.contract_sign_date)
                : null;

            this.contract_expiration_date = this.data.contract_expiration_date
                ? new Date(this.data.contract_expiration_date)
                : null;

            this.test_payment_date = this.data.test_payment_date || null;

            this.acceptance_sign_date = this.data.acceptance_sign_date
                ? new Date(this.data.acceptance_sign_date)
                : null;

            this.acceptance_sign_date = this.data.acceptance_sign_date
                ? new Date(this.data.invoice_date)
                : null;

            // ===== Optional fields =====
            this.acceptance_status = this.data.acceptance_status ?? 0;
            this.contract_payment_status = this.data.contract_payment_status ?? 0;
            this.product_service = this.data.product_service || '';
            this.note = this.data.note || '';
            this.source_contract_id = this.data.source_contract_id || null;

            // ===== Active =====
            this.active = this.data.active !== undefined ? this.data.active : true;

            // ===== Files =====
            this.fileAttachments = this.data.fileAttachments || [];
            this.filesToDelete = [];
            this.filesToUpload = [];

            // hợp đồng
            this.contract_execution_time = this.data.contract_execution_time || null;
            this.productServiceIds = (this.data.arr_serviceids && this.data.arr_serviceids.length > 0) ? this.data.arr_serviceids : [];
            this.acceptance_phases = (this.data.acceptancePhases?.length > 0)
                ? this.data.acceptancePhases.map(phase => ({
                    ...phase,
                    acceptance_date: phase.acceptance_date
                        ? moment(phase.acceptance_date, 'YYYY-MM-DD').toDate()
                        : null,
                    _key: Math.random().toString(36).substr(2, 9)
                }))
                : [];

            // this.acceptance_phases = this.data.acceptancePhases || [];


        },
        // formatCurrency(event, model) {
        //     let value = event.target.value.replace(/[^\d]/g, '');
        //     this[model] = value ? parseInt(value, 10).toLocaleString('de-DE') : '';
        // },
        // formatCurrency(event, model) {
        //     // bỏ hết ký tự không phải số
        //     const raw = (event.target.value || '').replace(/\D/g, '');

        //     // nếu rỗng thì set rỗng
        //     if (!raw) {
        //         this[model] = '';
        //         return;
        //     }

        //     // format theo kiểu 1.000.000
        //     this[model] = Number(raw).toLocaleString('vi-VN'); // hoặc 'de-DE'
        // },
        formatCurrency(event, model, maxDigits = 15) {
            // bỏ hết ký tự không phải số
            let raw = (event.target.value || '').replace(/\D/g, '');

            // giới hạn số chữ số
            if (raw.length > maxDigits) {
                raw = raw.slice(0, maxDigits);
            }

            // nếu rỗng thì set rỗng
            if (!raw) {
                this[model] = '';
                event.target.value = '';
                return;
            }

            // ⚠️ Không dùng Number(raw) vì vượt 15-16 digits sẽ sai do giới hạn number JS
            // Format theo kiểu 1.000.000 (dùng regex để an toàn)
            const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

            this[model] = formatted;
            event.target.value = formatted; // đồng bộ lại input ngay lập tức
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
        // async onSelectFiles(files) {
        //     const formData = new FormData()
        //     files.forEach(file => formData.append('files', file))
        //     let result = await API.UploadFileTaskKanban(this, formData, this.taskId)
        //     if (Array.isArray(result)) {
        //         this.fileAttachments = this.fileAttachments.concat(result)
        //         console.log("quanva", this.fileAttachments)
        //     } else {
        //         this.$toast.error(result)
        //     }

        // },
        downloadFile(fileAttachment) {
            this.axios.get(`revenue/Upload/Download`, {
                params: { filePath: fileAttachment.filePath },
                responseType: 'blob',
            })
                .then((response) => {
                    // Tạo URL và trigger download
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileAttachment.fileName || fileAttachment.file_name);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.error("Download lỗi:", error);
                });
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
                    }).catch(() => {
                        // Người dùng nhấn "Hủy", không làm gì cả
                    });
            }
        },
        // async onRemoveFile(file) {
        //     let result = await API.DeleteFileAttachment(this, file.file_attachment_id)
        //     if (result == "1") {
        //         const index = this.fileAttachments.findIndex(x => x.file_attachment_id == file.file_attachment_id)
        //         if (index > -1) {
        //             this.fileAttachments.splice(index, 1)
        //         }
        //     } else {
        //         this.$toast.error(result)
        //     }
        // },
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
        // async onSave() {
        //     const toNumber = (val) => {
        //         if (val === null || val === undefined) return 0;
        //         const n = parseInt(String(val).replace(/[^\d]/g, ''), 10);
        //         return Number.isFinite(n) ? n : 0;
        //     };

        //     const toDate = (d) => (d ? moment(d).format('YYYY-MM-DD') : '');

        //     Object.keys(this.invalidFields).forEach(k => (this.invalidFields[k] = false));

        //     // validate theo thứ tự ưu tiên UX (field nào muốn user sửa trước thì để trước)
        //     const validations = [
        //         { key: 'contractNumber', ok: !!String(this.contractNumber || '').trim() },
        //         { key: 'contractName', ok: !!String(this.contractName || '').trim() },
        //         { key: 'contractValue', ok: !!String(this.contract_value || '').trim() },
        //         { key: 'revenueValue', ok: !!String(this.revenue_value || '').trim() },
        //         // ... add thêm field
        //     ];

        //     const firstInvalid = validations.find(v => !v.ok);

        //     if (firstInvalid) {
        //         validations.forEach(v => { if (!v.ok) this.invalidFields[v.key] = true; });

        //         this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
        //         this.scrollToField(firstInvalid.key);
        //         return;
        //     }

        //     if (this.contract_sign_date && this.contract_expiration_date) {
        //         const start = moment(this.contract_sign_date).startOf('day');
        //         const end = moment(this.contract_expiration_date).startOf('day');
        //         if (end.isBefore(start)) {
        //             this.$toast.error('Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng.');
        //             return;
        //         }
        //     }

        //     // ===== 3) Build FormData =====
        //     const formData = new FormData();

        //     // Nếu API Add không cần id thì có thể bỏ.
        //     // Nếu backend của bạn cần id cho update thì giữ theo chuẩn mới: contract_management_id
        //     if (!this.isAdd) {
        //         formData.append('contract_management_id', this.data?.contract_management_id || this.data?.id || 0);
        //     }

        //     // Core fields (theo request mới)
        //     formData.append('contract_no', String(this.contractNumber).trim());
        //     formData.append('contract_name', String(this.contractName).trim());

        //     formData.append('customer_id', this.khachhang_selected.id);
        //     // optional: nếu backend nhận customer_name
        //     formData.append('customer_name', this.khachhang_selected?.text || '');

        //     formData.append('owner_user_id', this.owner_user_id);

        //     // Dropdown mappings
        //     formData.append('contract_type', this.contract_type);
        //     formData.append('form_contract_execution', this.form_contract_execution);
        //     formData.append('form_payment_selected', this.form_payment_selected);
        //     formData.append('revenue_type', this.type_revenue_selected);

        //     // Money
        //     formData.append('contract_value', toNumber(this.contract_value));
        //     formData.append('revenue_value', toNumber(this.revenue_value));
        //     formData.append('acceptance_value', toNumber(this.acceptance_value));
        //     formData.append('invoice_value', toNumber(this.invoice_value));

        //     // Dates (map từ UI sang model mới)
        //     formData.append('contract_sign_date', toDate(this.contract_sign_date));
        //     formData.append('contract_expiration_date', toDate(this.contract_expiration_date));
        //     formData.append('acceptance_sign_date', toDate(this.acceptance_sign_date));
        //     formData.append('invoice_date', toDate(this.invoice_date));

        //     // Optional fields (nếu UI có / bạn muốn gửi)
        //     // acceptance_status: mặc định 0 nếu không chọn
        //     formData.append('acceptance_status', this.acceptance_status ?? 0);
        //     formData.append('contract_payment_status', this.contract_payment_status ?? 0);

        //     // product_service / note / source_contract_id nếu bạn có biến tương ứng
        //     if (this.product_service !== undefined) {
        //         formData.append('product_service', this.product_service || '');
        //     }
        //     if (this.note !== undefined) {
        //         formData.append('note', this.note || '');
        //     }
        //     if (this.source_contract_id !== undefined && this.source_contract_id !== null) {
        //         formData.append('source_contract_id', this.source_contract_id);
        //     }

        //     // active (optional)
        //     formData.append('active', true);

        //     // ===== 4) files =====
        //     if (this.filesToDelete?.length > 0) {
        //         formData.append('filesToDelete', JSON.stringify(this.filesToDelete));
        //     }

        //     for (const file of (this.filesToUpload || [])) {
        //         formData.append('files', file);
        //     }

        //     // hợp đồng
        //     formData.append('contract_execution_time', this.contract_execution_time);
        //     formData.append('test_payment_date', this.test_payment_date);

        //     //
        //     //const productServiceIds = this.productServiceIds ? JSON.stringify(this.productServiceIds) : '[]';
        //     // formData.append('arrServiceIds', productServiceIds);
        //     // đảm bảo productServiceIds là number[]
        //     const ids = (this.productServiceIds || []).map(x => Number(x));

        //     formData.append(
        //         'arrServiceIds',
        //         JSON.stringify(ids)
        //     );

        //     // ===== 4.5) phases (NEW) =====
        //     const phasesPayload = (this.acceptance_phases || []).map((p, idx) => ({
        //         phase_id: p.phase_id ?? null,
        //         phase_name: String(p.phase_name || `Đợt ${idx + 1}`).trim(),
        //         acceptance_date: p.acceptance_date ? moment(p.acceptance_date).format('YYYY-MM-DD') : null,
        //         acceptance_value: toNumber(p.acceptance_value)  // nếu p.acceptance_value đã là number thì vẫn ok
        //     }));

        //     // optional: validate phases
        //     for (const [i, p] of phasesPayload.entries()) {
        //         if (!p.phase_name) {
        //             this.$toast.error(`Tên đợt ở dòng ${i + 1} không được để trống`);
        //             return;
        //         }
        //         if (p.acceptance_value < 0) {
        //             this.$toast.error(`Giá trị nghiệm thu ở "${p.phase_name}" không hợp lệ`);
        //             return;
        //         }
        //     }

        //     formData.append('acceptance_phases_json', JSON.stringify(phasesPayload));
        //     // list_file_attachment:JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id)),
        //     formData.append('list_file_attachment', JSON.stringify(this.fileAttachments.map(x => x.file_attachment_id)));
        //     // ===== 5) call API =====
        //     let response;
        //     if (this.isAdd) {
        //         response = await API.AddContractManagement(this, formData);
        //     } else {
        //         response = await API.UpdateContractManagement(this, formData);
        //     }

        //     if (response && response.success) {
        //         this.$emit('successContract');
        //         this.hideModal();
        //     }
        // }
        async onSave() {
            const toNumber = (val) => {
                if (val === null || val === undefined) return 0;
                const n = parseInt(String(val).replace(/[^\d]/g, ''), 10);
                return Number.isFinite(n) ? n : 0;
            };
            const toDate = (d) => (d ? moment(d).format('YYYY-MM-DD') : '');

            // reset flags
            Object.keys(this.invalidFields).forEach(k => (this.invalidFields[k] = false));

            // ===== 1) Validate required fields (theo UX order) =====
            const validations = [
                {
                    key: 'contractNumber',
                    ok: !!String(this.contractNumber || '').trim(),
                    refKey: 'contractNumber',
                },
                {
                    key: 'contractName',
                    ok: !!String(this.contractName || '').trim(),
                    refKey: 'contractName',
                },
                {
                    key: 'customer_id',
                    ok: !!this.khachhang_selected?.id,
                    // bạn đã có CustomerSelect ref + mình gợi ý setFieldRef('customer', div)
                    refKey: 'customer', // ưu tiên div bọc để scroll ổn hơn
                },
                {
                    key: 'owner_user_id',
                    ok: !!this.owner_user_id,
                    refKey: 'owner_user_id',
                },
                {
                    key: 'contract_type',
                    ok: !!this.contract_type,
                    refKey: 'contract_type',
                },
                {
                    key: 'form_contract_execution',
                    ok: !!this.form_contract_execution,
                    refKey: 'form_contract_execution',
                },
                {
                    key: 'form_payment_selected',
                    ok: !!this.form_payment_selected,
                    refKey: 'form_payment_selected',
                },
                {
                    key: 'type_revenue_selected',
                    ok: !!this.type_revenue_selected,
                    refKey: 'type_revenue_selected',
                },
                {
                    key: 'contractValue',
                    ok: toNumber(this.contract_value) > 0, // thay vì trim string
                    refKey: 'contractValue',
                },
                {
                    key: 'revenueValue',
                    ok: toNumber(this.revenue_value) > 0,
                    refKey: 'revenueValue',
                },
            ];

            const firstInvalid = validations.find(v => !v.ok);

            if (firstInvalid) {
                validations.forEach(v => { if (!v.ok) this.invalidFields[v.key] = true; });

                this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
                this.scrollToField(firstInvalid.refKey || firstInvalid.key);
                return;
            }

            // ===== 2) Validate date logic =====
            if (this.contract_sign_date && this.contract_expiration_date) {
                const start = moment(this.contract_sign_date).startOf('day');
                const end = moment(this.contract_expiration_date).startOf('day');
                if (end.isBefore(start)) {
                    this.$toast.error('Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng.');
                    // nếu bạn có ref 2 field ngày thì scroll tới end_date
                    // this.scrollToField('contract_expiration_date');
                    return;
                }
            }

            // ===== 3) Validate phases (nếu có) =====
            const phasesPayload = (this.acceptance_phases || []).map((p, idx) => ({
                phase_id: p.phase_id ?? null,
                phase_name: String(p.phase_name || `Đợt ${idx + 1}`).trim(),
                acceptance_date: p.acceptance_date ? moment(p.acceptance_date).format('YYYY-MM-DD') : null,
                acceptance_value: toNumber(p.acceptance_value)
            }));

            for (const [i, p] of phasesPayload.entries()) {
                if (!p.phase_name) {
                    this.$toast.error(`Tên đợt ở dòng ${i + 1} không được để trống`);
                    return;
                }
                if (p.acceptance_value < 0) {
                    this.$toast.error(`Giá trị nghiệm thu ở "${p.phase_name}" không hợp lệ`);
                    return;
                }
            }

            // ===== 4) Build FormData =====
            const formData = new FormData();

            if (!this.isAdd) {
                formData.append('contract_management_id', this.data?.contract_management_id || this.data?.id || 0);
            }

            formData.append('contract_no', String(this.contractNumber).trim());
            formData.append('contract_name', String(this.contractName).trim());

            formData.append('customer_id', this.khachhang_selected.id);
            formData.append('customer_name', this.khachhang_selected?.text || '');

            formData.append('owner_user_id', this.owner_user_id);

            formData.append('contract_type', this.contract_type);
            formData.append('form_contract_execution', this.form_contract_execution);

            // ⚠️ lưu ý: bạn đang append key 'form_payment_selected'
            // Nếu backend muốn 'payment_method' hoặc 'form_payment' thì đổi đúng tên.
            formData.append('form_payment_selected', this.form_payment_selected);

            formData.append('revenue_type', this.type_revenue_selected);

            formData.append('contract_value', toNumber(this.contract_value));
            formData.append('revenue_value', toNumber(this.revenue_value));
            formData.append('acceptance_value', toNumber(this.acceptance_value));
            formData.append('invoice_value', toNumber(this.invoice_value));

            formData.append('contract_sign_date', toDate(this.contract_sign_date));
            formData.append('contract_expiration_date', toDate(this.contract_expiration_date));
            formData.append('acceptance_sign_date', toDate(this.acceptance_sign_date));
            formData.append('invoice_date', toDate(this.invoice_date));

            formData.append('acceptance_status', this.acceptance_status ?? 0);
            formData.append('contract_payment_status', this.contract_payment_status ?? 0);

            if (this.product_service !== undefined) formData.append('product_service', this.product_service || '');
            if (this.note !== undefined) formData.append('note', this.note || '');
            if (this.source_contract_id !== undefined && this.source_contract_id !== null) {
                formData.append('source_contract_id', this.source_contract_id);
            }

            formData.append('active', true);

            if (this.filesToDelete?.length > 0) {
                formData.append('filesToDelete', JSON.stringify(this.filesToDelete));
            }
            for (const file of (this.filesToUpload || [])) {
                formData.append('files', file);
            }

            formData.append('contract_execution_time', this.contract_execution_time ?? '');
            formData.append('test_payment_date', this.test_payment_date ?? '');

            const ids = (this.productServiceIds || []).map(x => Number(x)).filter(Number.isFinite);
            formData.append('arrServiceIds', JSON.stringify(ids));

            formData.append('acceptance_phases_json', JSON.stringify(phasesPayload));

            formData.append(
                'list_file_attachment',
                JSON.stringify((this.fileAttachments || []).map(x => x.file_attachment_id))
            );

            // ===== 5) Call API =====
            try {
                const response = this.isAdd
                    ? await API.AddContractManagement(this, formData)
                    : await API.UpdateContractManagement(this, formData);

                if (response?.success) {
                    this.$emit('successContract');
                    this.hideModal();
                    return;
                }

                // nếu API trả message
                this.$toast.error(response?.message || 'Lưu hợp đồng thất bại');
            } catch (err) {
                console.error(err);
                this.$toast.error('Có lỗi xảy ra khi lưu hợp đồng');
            }
        }

        ,
        async loadUserTTKD() {
            if(this.user_list.length > 0){
                this.user_TTKD_list = this.user_list.map(x => ({
                    id: x.user_id,
                    text: x.full_name
                }));
                return;
            }
            else{
                this.user_TTKD_list = []
            }
            // var result = await API.GetUsersByDepartmentRevenue(this)
            // if (result) {
            //     result = JSON.parse(result)
            //     this.user_TTKD_list = result.map(x => ({
            //         id: x.user_id,
            //         text: x.full_name
            //     }));
            // }
        },
        addAcceptancePhase() {
            const nextIndex = this.acceptance_phases.length + 1
            this.acceptance_phases.push({
                _key: crypto?.randomUUID?.() || `${Date.now()}_${Math.random()}`,
                phase_name: `Đợt ${nextIndex}`,
                acceptance_date: null,
                acceptance_value: 0
            })
        },

        removeAcceptancePhase(idx) {
            this.acceptance_phases.splice(idx, 1)
        },

        // "23.001.000" -> 23001000
        parseCurrency(str) {
            if (str === null || str === undefined) return 0
            const n = parseInt(String(str).replace(/[^\d]/g, ''), 10)
            return Number.isFinite(n) ? n : 0
        },

        ensureAtLeastOnePhase() {
            if (!this.acceptance_phases || this.acceptance_phases.length === 0) {
                this.addAcceptancePhase(); // tạo sẵn Đợt 1
            }
        },

        // onPhaseCurrencyInput(event, phase, key) {
        //     const raw = (event.target.value || '').replace(/\D/g, '');
        //     phase[key] = raw ? Number(raw).toLocaleString('vi-VN') : '';
        // },
        onPhaseCurrencyInput(event, phase, key, maxDigits = 15) {
            let raw = (event.target.value || '').replace(/\D/g, '');

            // giới hạn số chữ số
            if (raw.length > maxDigits) raw = raw.slice(0, maxDigits);

            if (!raw) {
                phase[key] = '';
                event.target.value = '';
                return;
            }

            // format 1.000.000 (không dùng Number để tránh sai số)
            const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

            phase[key] = formatted;
            event.target.value = formatted;
        },

    }
}
</script>

<style src="../ContractManagement.css" scoped></style>