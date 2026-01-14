<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupProject"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal"
        :close="clear">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <h5 class="text-primary bold mb-3">
                                A. Thông tin chung
                            </h5>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Tên dự án <required-marker/></label>
                                <input
                                    type="text"
                                    v-model="projectName"
                                    class="form-control"
                                    :class="{ 'is-invalid': showValidation && !projectName.trim() }"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Mã dự án <required-marker/></label>
                                <input
                                    type="text"
                                    v-model="projectCode"
                                    class="form-control"
                                    :class="{ 'is-invalid': showValidation && !projectCode.trim() }"
                                    :disabled="true"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Loại dự án <required-marker/></label>
                                <select2 
                                    v-model="projectTypeId" 
                                    :options="projectTypes"
                                    :class="{ 'is-invalid': showValidation && !projectTypeId }"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Tên khách hàng <required-marker/></label>
                                <!-- <select2 
                                    v-model="customerId" 
                                    :options="customers"
                                    :class="{ 'is-invalid': showValidation && !customerId }"
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
                                <label class="form-label bold">Phân loại khách hàng <required-marker/></label>
                                <select2 
                                    v-model="customerTypeId" 
                                    :options="customerTypes"
                                    :class="{ 'is-invalid': showValidation && !customerTypeId }"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Đơn vị ký hợp đồng của VNPT</label>
                                <select2 
                                    v-model="vnptUnitId" 
                                    :options="vnptUnits"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Đơn vị chủ trì xúc tiến</label>
                                <select2 
                                    v-model="promotionUnitId" 
                                    :options="promotionUnits"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Đơn vị phát triển, cung cấp giải pháp</label>
                                <select2 
                                    v-model="developmentUnitId" 
                                    :options="developmentUnits"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Dự kiến quy mô hợp đồng chưa VAT (VND) <required-marker/></label>
                                <input
                                    type="text"
                                    v-model="estimatedValueBeforeVAT"
                                    class="form-control"
                                    @input="formatCurrency($event, 'estimatedValueBeforeVAT')"
                                    :class="{ 'is-invalid': showValidation && !estimatedValueBeforeVAT.trim() }"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Giá trị hợp đồng thực tế chưa VAT (VND)</label>
                                <input
                                    type="text"
                                    v-model="actualValueBeforeVAT"
                                    class="form-control"
                                    @input="formatCurrency($event, 'actualValueBeforeVAT')"
                                    :disabled="true"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Thời gian bắt đầu</label>
                                <ejs-datepicker
                                    v-model="startDate"
                                    :format="'dd/MM/yyyy'"
                                    :showClearButton="false"
                                    :allowEdit="true"
                                    :enabled="!isViewDetail"
                                    locale="vi"
                                    :firstDayOfWeek="1"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Thời gian kết thúc</label>
                                <ejs-datepicker
                                    v-model="endDate"
                                    :format="'dd/MM/yyyy'"
                                    :showClearButton="sassFalse"
                                    :allowEdit="true"
                                    :enabled="!isViewDetail"
                                    locale="vi"
                                    :firstDayOfWeek="1"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div v-if="!isViewDetail" class="form-group">
                                <label class="form-label bold">Nhân sự vai trò PM <required-marker/></label>
                                <select2 
                                    v-model="projectManagerId" 
                                    :options="projectManagers"
                                    :class="{ 'is-invalid': showValidation && !projectManagerId }"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div v-if="!isViewDetail" class="form-group">
                                <label class="form-label bold">Nhân sự vai trò TPM <required-marker/></label>
                                <select2 
                                    v-model="technicalProjectManagerId" 
                                    :options="technicalProjectManagers"
                                    :class="{ 'is-invalid': showValidation && !technicalProjectManagerId }"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div v-if="!isViewDetail" class="form-group">
                                <!-- <label class="form-label bold">Nhân sự vai trò Pdm <required-marker/></label>
                                <select2 
                                    v-model="pdmId" 
                                    :options="pdms"
                                    :class="{ 'is-invalid': showValidation && !pdmId }"
                                    :disabled="isViewDetail"
                                /> -->
                                <label class="form-label bold">Nhân sự vai trò Pdm</label>
                                <select2 
                                    v-model="pdmId" 
                                    :options="pdms"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div v-if="!isViewDetail" class="form-group">
                                <!-- <label class="form-label bold">Nhân sự vai trò LD DVBH <required-marker/></label>
                                <select2 
                                    v-model="leaderId" 
                                    :options="leaders"
                                    :class="{ 'is-invalid': showValidation && !leaderId }"
                                    :disabled="isViewDetail"
                                /> -->
                                <label class="form-label bold">Nhân sự vai trò LD DVBH</label>
                                <select2 
                                    v-model="leaderId" 
                                    :options="leaders"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Từ khóa liên quan</label>
                                <input
                                    type="text"
                                    v-model="keywords"
                                    class="form-control"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Link liên kết liên quan</label>
                                <input
                                    type="text"
                                    v-model="relatedLink"
                                    class="form-control"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Sản phẩm dịch vụ</label>
                                <!-- <select2 
                                    v-model="productServiceId" 
                                    :options="productServices"
                                    :disabled="isViewDetail"
                                /> -->
                                <Select2Multiple
                                    v-model="productServiceIds"
                                    :options="productServices"
                                    multiple
                                />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Thông tin khác</label>
                                <textarea
                                    v-model="additionalInfo"
                                    class="form-control"
                                    rows="1"
                                    :disabled="isViewDetail"
                                    placeholder="Nhập thông tin bổ sung về dự án..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                          <div class="form-group">
                            <div class="d-flex align-items-center pt-2" style="gap: 12px;">
                                <label class="form-label mb-0 bold">Có PoC</label>
                                <input
                                  type="checkbox"
                                  v-model="hasPoC"
                                  class="form-check-input"
                                  id="pocCheck"
                                  :disabled="isViewDetail"
                                  style="position: relative; margin: 0; border: 2px solid #999999; border-radius: 3px;"
                                  />
                            </div>
                          </div>
                        </div>
                        <div v-if="isViewDetail && isApprovalNeeded" class="col-sm-6 col-12 approval-notification p-3 mb-2">
                            <div class="form-label"><i class="fa fa-bell mr-2"></i>Dự kiến quy mô hợp đồng chưa VAT (Chờ duyệt)</div>
                            <div class="value mb-2">Giá trị hiện tại: {{ formatCurrencyDisplay(data.estimatedValueBeforeVAT) }}</div>
                            <div class="value bold">Giá trị đề xuất: {{ formatCurrencyDisplay(data.pendingInvestmentAmount) }}</div>
                            <div v-if="canApproveAmount" class="info-row mt-2">
                                <div class="value right mt-2">
                                    <button class="btn btn-primary" @click="approveAmountChange">
                                        <i class="fa fa-check"></i> Phê duyệt
                                    </button>
                                    <button class="btn btn-second ml-2" @click="rejectAmountChange">
                                        <i class="fa fa-times"></i> Từ chối
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Hiển thị Project Members và Revenue khi xem chi tiết -->
                    <div v-if="isViewDetail && data && data.id" class="row">
                        <!-- Thành viên -->
                        <div class="mb-4">
                            <h5 class="text-primary bold mb-3">
                                B. Thành viên
                            </h5>
                            <div class="border rounded bg-white">
                                <KDataGrid
                                    ref="membersGrid"
                                    :columns="memberColumns"
                                    :dataSource="members"
                                    :enable-paging-server="false"
                                    :allowPaging="true"
                                    :showFilter="false"
                                    :showColumnCheckbox="false"
                                    :showSTT="true"
                                    :enabledSelectFirstRow="false"
                                />
                            </div>
                        </div>

                        <!-- Dự kiến doanh thu theo năm -->
                        <div class="mb-4">
                            <h5 class="text-primary bold mb-3">
                                C. Dự kiến doanh thu theo năm
                            </h5>
                            <div class="border rounded bg-white">
                                <KDataGrid
                                    ref="revenuesGrid"
                                    :columns="revenueColumns"
                                    :dataSource="revenues"
                                    :enable-paging-server="false"
                                    :allowPaging="true"
                                    :showFilter="false"
                                    :showColumnCheckbox="false"
                                    :showSTT="true"
                                    :isDisable="true"
                                    :enabledSelectFirstRow="false"
                                />
                            </div>
                            
                            <!-- Thông báo các dòng cần phê duyệt -->
                            <div v-if="pendingChangeMessage" class="approval-notification p-3 mt-2">
                                <div class="mb-2">
                                    <i class="fa fa-bell mr-2"></i>{{ pendingChangeMessage }}
                                </div>
                                <ul>
                                    <li v-for="(item, index) in pendingChangeList" :key="index" class="mb-2 d-flex justify-content-between align-items-center value bold">
                                        <span>{{ item }}</span>
                                        <div v-if="canCurrentUserApprove" class="ml-3">
                                            <button 
                                                class="btn btn-primary mr-2" 
                                                @click="selectedRevenue = pendingChangeRows[index].revenue; approveSelectedRevenue()"
                                                style="min-width: 80px;"
                                            >
                                                <span class="icon fa fa-check"></span>&nbsp;Phê duyệt
                                            </button>
                                            <button 
                                                class="btn btn-second" 
                                                @click="selectedRevenue = pendingChangeRows[index].revenue; rejectSelectedRevenue()"
                                                style="min-width: 80px;"
                                            >
                                                <span class="icon fa fa-times"></span>&nbsp;Từ chối
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="mb-4">
                            <h5 class="text-primary bold mb-3">
                                D. Lịch sử thay đổi
                            </h5>
                            <div class="border rounded bg-white">
                                <KDataGrid
                                    ref="logsGrid"
                                    :columns="logColumns"
                                    :dataSource="projectLogs"
                                    :enable-paging-server="false"
                                    :allowPaging="true"
                                    :showFilter="false"
                                    :showColumnCheckbox="false"
                                    :showSTT="true"
                                    :enabledSelectFirstRow="false"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="group-buttons -bottom right mt-5">
                        <button v-if="!isViewDetail" @click="onSave" class="btn btn-second nocorner">
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
import API from '../ProjectAPI.js'
import CustomerSelect from '@/modules/work/kanban/search/CustomerSelect.vue'
import { sassFalse } from 'sass'
import Select2Multiple from '@/components/controls/Select2Multiple.vue'
export default {
    name: 'ProjectModal',
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
        projectTypesList: { type: Array, default: () => [] },
        customersList: { type: Array, default: () => [] },
        customerTypesList: { type: Array, default: () => [] },
        vnptUnitsList: { type: Array, default: () => [] },
        promotionUnitsList: { type: Array, default: () => [] },
        developmentUnitsList: { type: Array, default: () => [] },
        usersList: { type: Array, default: () => [] },
        servicesList: { type: Array, default: () => [] },
        canApproveAmount: {
            type: Boolean,
            default: false
        },
    },
    components: {
        CustomerSelect,
        Select2Multiple
    },
    computed: {
        header() {
            if (this.isAdd) {
                return `<span class="icon fa fa-plus"></span> THÔNG TIN DỰ ÁN`
            } else if (!this.isAdd && !this.isViewDetail) {
                return `<span class="icon one-edit"></span> Điều chỉnh dự án`
            } else {
                return `<span class="icon fa fa-eye"></span> Chi tiết dự án`
            }
        },
        isApprovalNeeded() {
            return this.data && this.data.pendingInvestmentAmount != null;
        },
        projectTypes() { return [{ id: 0, text: 'Chọn' }, ...this.projectTypesList]; },
        customers() { return [{ id: null, text: 'Chọn khách hàng' }, ...this.customersList]; },
        customerTypes() { return [{ id: 0, text: 'Chọn' }, ...this.customerTypesList]; },
        vnptUnits() { return [{ id: 0, text: 'Chọn' }, ...this.vnptUnitsList]; },
        promotionUnits() { return [{ id: 0, text: 'Chọn' }, ...this.promotionUnitsList]; },
        developmentUnits() { return [{ id: 0, text: 'Chọn' }, ...this.developmentUnitsList]; },
        projectManagers() { return [{ id: 0, text: 'Chọn' }, ...this.usersList]; },
        technicalProjectManagers() { return [{ id: 0, text: 'Chọn' }, ...this.usersList]; },
        leaders() { return [{ id: 0, text: 'Chọn' }, ...this.usersList]; },
        pdms() { return [{ id: 0, text: 'Chọn' }, ...this.usersList]; },
        productServices() { 
            const services = [{ id: null, text: 'Chọn' }, ...this.servicesList];
            console.log('ProductServices computed:', services);
            return services;
        },
        pendingChangeRows() {
            if (!this.revenues) return [];
            
            const pendingRows = [];
            this.revenues.forEach((revenue, index) => {
                if (revenue.pendingChange) {
                    pendingRows.push({
                        index: index + 1,
                        year: revenue.year || revenue.pendingChange.proposedYear,
                        oldYear: revenue.pendingChange.originalYear,
                        newYear: revenue.pendingChange.proposedYear,
                        oldAmount: revenue.pendingChange.originalAmount,
                        newAmount: revenue.pendingChange.proposedAmount,
                        revenue: revenue // Thêm reference đến revenue object
                    });
                }
            });
            return pendingRows;
        },
        pendingChangeMessage() {
            const count = this.pendingChangeRows.length;
            if (count === 0) return '';
            
            return `Đang có ${count} dòng cần phê duyệt:`;
        },
        pendingChangeList() {
            return this.pendingChangeRows.map(row => {
                const changes = [];
                
                // Kiểm tra thay đổi năm
                if (row.oldYear !== row.newYear) {
                    changes.push(`Năm: ${row.oldYear} → ${row.newYear}`);
                }
                
                // Kiểm tra thay đổi amount
                if (row.oldAmount !== row.newAmount) {
                    const oldValue = this.formatCurrencyDisplay(row.oldAmount || 0);
                    const newValue = this.formatCurrencyDisplay(row.newAmount || 0);
                    changes.push(`Doanh thu dự kiến: ${oldValue} → ${newValue}`);
                }
                
                // Nếu có thay đổi thì hiển thị, nếu không thì chỉ hiển thị năm hiện tại
                if (changes.length > 0) {
                    return `Dòng ${row.index}: ${changes.join(', ')}`;
                } else {
                    // Fallback case - hiển thị thay đổi amount nếu không có thay đổi nào khác
                    const oldValue = this.formatCurrencyDisplay(row.oldAmount || 0);
                    const newValue = this.formatCurrencyDisplay(row.newAmount || 0);
                    return `Năm ${row.year}: ${oldValue} → ${newValue}`;
                }
            });
        }
    },
    data() {
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            showValidation: false,

            // Dữ liệu form dự án
            projectName: '',
            projectCode: '',
            projectTypeId: null,
            khachhang_selected:{
                id: 0,
                selected:true,
                text:""
            },
            customerId: null,
            customerTypeId: 0,
            vnptUnitId: 0,
            promotionUnitId: 0,
            developmentUnitId: 0,
            productServiceId: 0,
            productServiceIds:[],
            estimatedValueBeforeVAT: '',
            actualValueBeforeVAT: '',
            startDate: null,
            endDate: null,

            projectManagerId: 0,
            technicalProjectManagerId: 0,
            leaderId: 0,
            pdmId: 0,

            relatedLink: '',
            keywords: '',
            hasPoC: false,
            additionalInfo: '',

            // Dữ liệu members và revenues cho hiển thị
            members: [],
            revenues: [],
            canCurrentUserApprove: false,
            selectedRevenue: null,
            
            // Columns definition cho KDataGrid
            memberColumns: [
                { fieldName: 'fullName', headerText: 'Họ tên', width: '300' },
                { fieldName: 'roleName', headerText: 'Vai trò', width: '200' }
            ],
            revenueColumns: [
                {
                    fieldName: 'year',
                    headerText: 'Năm',
                    width: 100,
                    textAlign: 'Center'
                },
                { 
                    fieldName: 'revenueAmount', 
                    headerText: 'Doanh thu dự kiến (VNĐ)', 
                    width: 400, 
                    textAlign: 'Right',
                    type: 'number',
                    format: { format: 'N0', useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }
                }
            ],
            projectLogs: [],
            logColumns: [
                {
                    fieldName: 'fullName',
                    headerText: 'Người chỉnh sửa',
                    width: '150'
                },
                {
                    fieldName: 'actionType',
                    headerText: 'Hành động',
                    width: '200'
                },
                {
                    fieldName: 'changeColumn',
                    headerText: 'Cột',
                    width: '300'
                },
                {
                    fieldName: 'oldValue',
                    headerText: 'Nội dung cũ',
                    width: '350'
                },
                {
                    fieldName: 'newValue',
                    headerText: 'Nội dung mới',
                    width: '350'
                },
                {
                    fieldName: 'changeTime',
                    headerText: 'Thời gian',
                    width: '150',
                    textAlign: 'Center',
                    type: 'dateTime',
                    format: 'dd/MM/yyyy HH:mm:ss'
                }
            ],
        }
    },
    methods: {
        // Hiển thị/ẩn loading spinner toàn cục
        loading(show) {
            this.$root.showLoading(show)
        },
        
        // Hiển thị modal dự án
        showModal() {
            this.$refs["popupProject"].show()
        },
        
        // Ẩn modal dự án
        hideModal() {
            this.$refs["popupProject"].hide()
        },
        
        // Xử lý khi modal được mở
        handleShowModal() {
            this.clear();
            if (!this.isAdd) {
                this.loadData();
                // Load members và revenues khi xem chi tiết
                if (this.isViewDetail && this.data && this.data.id) {
                    this.loadMembersRevenuesLogs();
                }
            }
        },
        
        // Xóa tất cả dữ liệu form và reset về trạng thái ban đầu
        clear() {
            this.projectName = ''
            this.projectCode = ''
            this.projectTypeId = 0
            this.customerId = null
            this.khachhang_selected = {
                id: 0,
                selected:true,
                text:""
            }
            this.customerTypeId = 0
            this.vnptUnitId = 0
            this.promotionUnitId = 0
            this.developmentUnitId = 0
            this.productServiceId = 0
            this.estimatedValueBeforeVAT = ''
            this.actualValueBeforeVAT = ''
            this.startDate = null
            this.endDate = null

            this.projectManagerId = 0
            this.technicalProjectManagerId = 0
            this.leaderId = 0
            this.pdmId = 0

            this.relatedLink = ''
            this.keywords = ''
            this.hasPoC = false
            this.additionalInfo = ''
            this.showValidation = false
            this.members = []
            this.revenues = []
            this.canCurrentUserApprove = false
            this.selectedRevenue = null
            this.productServiceIds=[]
        },
        
        // Load dữ liệu dự án vào form khi chỉnh sửa
        loadData() {
            if (this.data) {
                this.projectName = this.data.projectName || ''
                this.projectCode = this.data.projectCode || ''
                this.projectTypeId = this.data.projectTypeId || 0
                this.khachhang_selected.id = this.data.customerId || null
                this.khachhang_selected.text = this.data.customerName || ''
                this.customerTypeId = this.data.customerTypeId || 0
                this.vnptUnitId = this.data.vnptUnitId || 0
                this.promotionUnitId = this.data.promotionUnitId || 0
                this.developmentUnitId = this.data.developmentUnitId || 0
                this.productServiceId = this.data.productServiceId || 0
                this.estimatedValueBeforeVAT = this.data.estimatedValueBeforeVAT ? this.data.estimatedValueBeforeVAT.toLocaleString('vi-VN') : ''
                this.actualValueBeforeVAT = this.data.actualValueBeforeVAT ? this.data.actualValueBeforeVAT.toLocaleString('vi-VN') : ''
                this.startDate = this.data.startDate ? new Date(this.data.startDate) : null
                this.endDate = this.data.endDate ? new Date(this.data.endDate) : null
                this.projectManagerId = this.data.projectManagerId || 0
                this.technicalProjectManagerId = this.data.technicalProjectManagerId || 0
                this.leaderId = this.data.leaderId || 0
                this.pdmId = this.data.pdmId || 0
                this.relatedLink = this.data.relatedLink || ''
                this.keywords = this.data.keywords || ''
                this.hasPoC = this.data.hasPoC || false
                this.additionalInfo = this.data.additionalInfo || ''
                // Đơn vị
                this.vnptUnitId = this.data.vnptUnitId || 0;
                this.promotionUnitId = this.data.promotionUnitId || 0;
                this.developmentUnitId = (this.data.developmentUnitIds && this.data.developmentUnitIds.length > 0) ? this.data.developmentUnitIds[0] : null;

                // Sản phẩm dịch vụ
                this.productServiceId = (this.data.productServiceIds && this.data.productServiceIds.length > 0) ? this.data.productServiceIds[0] : null;
                this.productServiceIds=(this.data.productServiceIds && this.data.productServiceIds.length > 0) ? this.data.productServiceIds : [];
                // Nhân sự
                this.projectManagerId = this.data.projectManagerId || 0
                this.technicalProjectManagerId = this.data.technicalProjectManagerId || 0
                this.leaderId = this.data.leaderId || 0
                this.pdmId = this.data.pdmId || 0
            }
        },

        // Định dạng số tiền VND
        formatCurrency(event, model) {
            let value = event.target.value.replace(/[^\d]/g, '');
            this[model] = value ? Number(value).toLocaleString('vi-VN') : '';
        },

        // Định dạng số tiền để hiển thị
        formatCurrencyDisplay(amount) {
            if (amount == null || amount === 0) return '0 VNĐ';
            return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
        },

        // Lưu dữ liệu dự án
        async onSave() {
            // Validation
            this.showValidation = true;
            
            if (!this.projectName.trim() ||
                !this.projectCode.trim() ||
                !this.projectTypeId ||
                !this.khachhang_selected.id ||
                !this.customerTypeId ||
                !this.projectManagerId ||
                !this.technicalProjectManagerId ||
                // !this.leaderId ||
                // !this.pdmId ||
                !this.estimatedValueBeforeVAT.trim()) {
                this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
                return;
            }

            if (this.endDate && this.startDate && this.endDate < this.startDate) {
                this.$toast.error('Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu.');
                return;
            }

            // Tạo object dữ liệu để lưu
            const projectData = {
                id: this.isAdd ? 0 : this.data.id,
                project_name: this.projectName,
                project_code: this.projectCode,
                project_type_id: this.projectTypeId,
                customer_id: this.khachhang_selected.id,
                customer_type_id: this.customerTypeId,
                vnpt_unit_id: this.vnptUnitId,
                promotion_unit_id: this.promotionUnitId,
                development_unit_id: this.developmentUnitId,
                product_service_id: this.productServiceId,
                estimated_value_before_vat: Number(String(this.estimatedValueBeforeVAT).replace(/[^\d]/g, '')) || 0,
                // actualValueBeforeVAT
                start_date: this.startDate ? moment(this.startDate).format('YYYY-MM-DD') : null,
                end_date: this.endDate ? moment(this.endDate).format('YYYY-MM-DD') : null,
                project_manager_id: this.projectManagerId,
                technical_project_manager_id: this.technicalProjectManagerId,
                leader_id: this.leaderId,
                pdm_id: this.pdmId,
                related_link: this.relatedLink,
                keywords: this.keywords,
                has_poc: this.hasPoC,
                additional_info: this.additionalInfo,
                
                arrServiceIds:this.productServiceIds?JSON.stringify(this.productServiceIds):'[]'
            };

            try {
                this.loading(true);
                
                let response;
                if (this.isAdd) {
                    response = await API.AddProject(this, projectData);
                } else {
                    response = await API.UpdateProject(this, projectData);
                }

                if (response && response.success) {
                    this.$emit('successProject', projectData);
                    this.hideModal();
                }
                
                this.loading(false);
            } catch (error) {
                this.loading(false);
                this.$toast.error('Có lỗi xảy ra, vui lòng thử lại!');
                console.error('Error saving project:', error);
            }
        },
        // Load members, revenues và logs data khi xem chi tiết dự án
        async loadMembersRevenuesLogs() {
            if (!this.data || !this.data.id) return;
        
            this.loading(true);
            try {
                const [membersData, revenuesData, logsData] = await Promise.all([
                    API.GetProjectMembers(this, this.data.id),
                    API.GetProjectRevenues(this, this.data.id),
                    API.GetProjectLogs(this, this.data.id)
                ]);
                
                this.members = membersData || [];
                this.revenues = revenuesData.revenueList || [];
                this.canCurrentUserApprove = revenuesData.canApprove || false; 
                if (logsData) {
                    // Dùng .map() để xử lý dữ liệu trước khi gán
                    this.projectLogs = logsData.map(log => {
                        // Tạo một bản sao của log để không thay đổi dữ liệu gốc
                        const formattedLog = { ...log };

                        // Thay thế dấu ',' bằng '.' trong oldValue
                        if (formattedLog.oldValue && typeof formattedLog.oldValue === 'string') {
                            formattedLog.oldValue = formattedLog.oldValue.replace(/,/g, '.');
                        }
                        
                        // Thay thế dấu ',' bằng '.' trong newValue
                        if (formattedLog.newValue && typeof formattedLog.newValue === 'string') {
                            formattedLog.newValue = formattedLog.newValue.replace(/,/g, '.');
                        }

                        return formattedLog || [];
                    });
                } else {
                    this.projectLogs = [];
                }
            } catch (error) {
                console.error('Error loading project details:', error);
                this.members = [];
                this.revenues = [];
                this.projectLogs = [];
            } finally {
                this.loading(false);
            }
        },

        async approveAmountChange() {
            if (!this.isApprovalNeeded) return;

            const confirmMessage = `Bạn chắc chắn muốn phê duyệt giá trị mới là ${this.formatCurrencyDisplay(this.data.pendingInvestmentAmount)}?`;
            await this.$confirm(confirmMessage, 'Xác nhận phê duyệt')
            .then(async (result) => {
                if (result) {
                    this.loading(true);
                    const response = await API.ApproveInvestmentAmount(this, this.data.id);
                    this.loading(false);
                    if (response && response.success) {
                        this.$emit('successProject');
                        this.hideModal();
                    }
                }
            });
        },

        async rejectAmountChange() {
            if (!this.isApprovalNeeded) return;

             await this.$confirm(`Bạn chắc chắn muốn từ chối yêu cầu thay đổi giá trị này?`, 'Xác nhận từ chối')
            .then(async (result) => {
                if (result) {
                    this.loading(true);
                    const response = await API.RejectInvestmentAmount(this, this.data.id);
                    this.loading(false);
                    if (response && response.success) {
                        this.$emit('successProject');
                        this.hideModal();
                    }
                }
            });
        },

        selectPendingRevenue(pendingRow) {
            this.selectedRevenue = pendingRow.revenue;
        },

        async approveSelectedRevenue() {
            if (!this.selectedRevenue || !this.selectedRevenue.pendingChange) {
                this.$toast.error('Vui lòng chọn một doanh thu có thay đổi cần phê duyệt');
                return;
            }

            await this.$confirm(`Bạn có chắc chắn muốn phê duyệt thay đổi cho doanh thu năm ${this.selectedRevenue.year}?`, 'Xác nhận')
            .then(async (result) => {
                if (result) {
                    this.loading(true);
                    // Lấy approvalId từ object pendingChange
                    const approvalId = this.selectedRevenue.pendingChange.approvalId;
                    const response = await API.ApproveProjectRevenue(this, approvalId);
                    this.loading(false);

                    if (response && response.success) {
                        this.selectedRevenue = null;
                        await this.loadMembersRevenuesLogs(); // Tải lại dữ liệu để cập nhật
                        this.$emit('successProject'); // Thông báo cập nhật cho parent component
                    }
                }
            });
        },

        async rejectSelectedRevenue() {
            if (!this.selectedRevenue || !this.selectedRevenue.pendingChange) {
                this.$toast.error('Vui lòng chọn một doanh thu có thay đổi cần phê duyệt');
                return;
            }

            await this.$confirm(`Bạn có chắc chắn muốn từ chối thay đổi cho doanh thu năm ${this.selectedRevenue.year}?`, 'Xác nhận')
            .then(async (result) => {
                if (result) {
                    this.loading(true);
                    // Lấy approvalId từ object pendingChange
                    const approvalId = this.selectedRevenue.pendingChange.approvalId;
                    const response = await API.RejectProjectRevenue(this, approvalId);
                    this.loading(false);

                    if (response && response.success) {
                        this.selectedRevenue = null;
                        await this.loadMembersRevenuesLogs(); // Tải lại dữ liệu để cập nhật
                        this.$emit('successProject'); // Thông báo cập nhật cho parent component
                    }
                }
            });
        },

        async generateAndSetProjectCode(customerTypeId) {
            this.loading(true);
            const response = await API.GenerateProjectCode(this, customerTypeId);
            this.loading(false);
            if (response && response.projectCode) {
                this.projectCode = response.projectCode;
            } else {
                this.projectCode = '';
                this.$toast.error('Không thể tự động tạo mã dự án.');
            }
        },
    },
    watch: {
        // Theo dõi sự thay đổi của Phân loại khách hàng
        customerTypeId(newVal) {
            // Chỉ sinh mã khi ở chế độ Thêm mới và đã chọn một loại khách hàng
            if (this.isAdd && newVal) {
                this.generateAndSetProjectCode(newVal);
            }
        }
    }
}
</script>

<style src="../Project.css" scoped></style>
