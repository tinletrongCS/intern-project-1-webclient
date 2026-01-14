<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupRevenue"
        :showCloseIcon="true"
        width="40%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body" style="padding:0">
                <div class="box-form" style="padding:0">
                    <!-- Nút thao tác -->
                    <div class="k" style="width:100%">
                        <div class="bd-form-button left">
                            <button class="btn btn-second" @click="showAddRevenueModal" style="min-width: 100px;">
                                <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
                            </button>&nbsp;
                            <button class="btn btn-second" @click="editSelectedRevenue" style="min-width: 100px;">
                                <span class="icon fa fa-edit"></span>&nbsp;Điều chỉnh
                            </button>&nbsp;
                            <button class="btn btn-second" @click="deleteSelectedRevenue" style="min-width: 100px;">
                                <span class="icon fa fa-trash"></span>&nbsp;Xóa
                            </button>&nbsp;
                            <button v-if="canCurrentUserApprove" class="btn btn-second" @click="approveSelectedRevenue" :disabled="!selectedRevenue || !selectedRevenue.pendingChange" style="min-width: 100px;">
                                <span class="icon fa fa-check"></span>&nbsp;Phê duyệt
                            </button>&nbsp;
                            <button v-if="canCurrentUserApprove" class="btn btn-second" @click="rejectSelectedRevenue" :disabled="!selectedRevenue || !selectedRevenue.pendingChange" style="min-width: 100px;">
                                <span class="icon fa fa-times"></span>&nbsp;Từ chối
                            </button>
                        </div>
                    </div>
                    <!-- Bảng dữ liệu -->
                   <div class="k" style="width:100%">
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
                                :enabledSelectFirstRow="false"
                                :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                                @rowSelected="onRevenueRowSelected"
                                @recordDoubleClick="onRevenueRecordDoubleClick"
                            />
                            
                            <!-- Thông báo các dòng cần phê duyệt -->
                            <div v-if="pendingChangeMessage" class="p-3 approval-notification">
                                <div class="mb-2">
                                    <i class="fa fa-bell mr-2"></i>{{ pendingChangeMessage }}
                                </div>
                                <ul>
                                    <li v-for="item in pendingChangeList" :key="item" class="mb-1">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- Tổng cộng -->
                            <div class="mt-3 p-3 bg-light border rounded">
                                <div class="row">
                                    <div class="col-10 text-right">
                                        <strong>Tổng doanh thu dự kiến:</strong>
                                    </div>
                                    <div class="col-2 text-right">
                                        <strong>{{ formatCurrency(totalRevenueAmount) }}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Modal thêm/sửa dự kiến doanh thu -->
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupRevenueDetail"
        :showCloseIcon="true"
        width="30%"
        :isModal='true'
        :target="target"
        :header="revenueModalHeader"
        :open="handleShowRevenueModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="form-label bold">Năm <required-marker/></label>
                                <input
                                    type="number"
                                    v-model="revenueForm.year"
                                    class="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="form-label bold">Giá trị doanh thu (VNĐ) <required-marker/></label>
                                <input
                                    type="text"
                                    v-model="revenueForm.displayAmount"
                                    @input="formatCurrencyInput"
                                    class="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="group-buttons text-right mb-3 mr-3">
                <button type="button" class="btn btn-second nocorner" @click="saveRevenue">
                    <span class="icon one-save"></span>&nbsp;Lưu
                </button>
                <button type="button" class="btn btn-primary nocorner" @click="hideRevenueModal">
                    <span class="icon fa fa-times"></span>&nbsp;Hủy
                </button>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import API from '../ProjectAPI';

export default {
    name: "ProjectRevenueModal",
    props: {
        projectData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            showValidation: false,
            isAddRevenue: false,
            selectedRevenue: null,
            
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
                    width: 300, 
                    textAlign: 'Right',
                    type: 'number',
                    format: { format: 'N0', useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 },
                    customAttributes: { 
                        locale: 'en-US'
                    }
                },
            ],
            
            revenues: [],
            canCurrentUserApprove: false,
            revenueForm: {
                id: null,
                year: new Date().getFullYear(),
                revenueAmount: null,
                displayAmount: '',
            }
        };
    },
    computed: {
        header() {
            return `Dự kiến doanh thu phát sinh theo năm - ${this.projectData.projectName || 'N/A'}`;
        },
        revenueModalHeader() {
            return this.isAddRevenue ? 'Thêm dự kiến doanh thu' : 'Chỉnh sửa dự kiến doanh thu';
        },
        totalRevenueAmount() {
            if (!this.revenues) return 0;
            return this.revenues.reduce((total, revenue) => total + (revenue.revenueAmount || 0), 0);
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
                    const oldValue = this.formatCurrency(row.oldAmount || 0);
                    const newValue = this.formatCurrency(row.newAmount || 0);
                    changes.push(`Doanh thu dự kiến: ${oldValue} → ${newValue}`);
                }
                
                // Nếu có thay đổi thì hiển thị, nếu không thì chỉ hiển thị năm hiện tại
                if (changes.length > 0) {
                    return `Dòng ${row.index}: ${changes.join(', ')}`;
                } else {
                    // Fallback case - hiển thị thay đổi amount nếu không có thay đổi nào khác
                    const oldValue = this.formatCurrency(row.oldAmount || 0);
                    const newValue = this.formatCurrency(row.newAmount || 0);
                    return `Năm ${row.year}: ${oldValue} → ${newValue}`;
                }
            });
        }
    },
    methods: {
        showModal() {
            this.$refs.popupRevenue.show();
        },
        
        hideModal() {
            this.$refs.popupRevenue.hide();
        },
        
        async handleShowModal() {
            this.selectedRevenue = null;
            await this.loadRevenues();
        },
        
        loading(show) {
            this.$root.showLoading(show);
        },
        
        async loadRevenues() {
            if (!this.projectData.id) {
                this.revenues = [];
                return;
            }
            this.loading(true);
            const response = await API.GetProjectRevenues(this, this.projectData.id);
            this.loading(false);

            if (response && response.revenueList) {
                let revenueData = response.revenueList;
                this.canCurrentUserApprove = response.canApprove || false;
                this.revenues = revenueData;
            } else {
                this.revenues = [];
                this.canCurrentUserApprove = false;
            }
        },
        
        formatCurrency(amount) {
            if (amount == null) return '0';
            return new Intl.NumberFormat('vi-VN').format(amount);
        },
        
        onRevenueRowSelected(args) {
            this.selectedRevenue = args.data;
        },
        
        onRevenueRecordDoubleClick(args) {
            this.selectedRevenue = args.rowData;
            this.editSelectedRevenue();
        },
        
        showAddRevenueModal() {
            this.isAddRevenue = true;
            this.clearRevenueForm();
            this.$refs.popupRevenueDetail.show();
        },
        
        hideRevenueModal() {
            this.$refs.popupRevenueDetail.hide();
        },
        
        editSelectedRevenue() {
            if (!this.selectedRevenue) {
                this.$toast.error('Vui lòng chọn một dự kiến doanh thu để chỉnh sửa');
                return;
            }
            
            this.isAddRevenue = false;
            this.revenueForm = {
                id: this.selectedRevenue.id,
                year: this.selectedRevenue.year,
                revenueAmount: this.selectedRevenue.revenueAmount,
                displayAmount: this.formatCurrency(this.selectedRevenue.revenueAmount),
            };
            
            this.$refs.popupRevenueDetail.show();
        },
        
        handleShowRevenueModal() {
            this.showValidation = false;
        },
        
        clearRevenueForm() {
            this.revenueForm = {
                id: null,
                year: new Date().getFullYear(),
                revenueAmount: null,
                displayAmount: '',
            };
            this.showValidation = false;
        },
        
        formatCurrencyInput(event) {
            let value = event.target.value.replace(/[^\d]/g, '');
            if (value) {
                const numberValue = parseInt(value, 10);
                this.revenueForm.revenueAmount = numberValue;
                this.revenueForm.displayAmount = this.formatCurrency(numberValue);
            } else {
                this.revenueForm.revenueAmount = null;
                this.revenueForm.displayAmount = '';
            }
        },
        
        async saveRevenue() {
            this.showValidation = true;
            
            if (this.revenueForm.year == null || this.revenueForm.revenueAmount == null) {
                this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
                return;
            }
            
            if (this.revenueForm.revenueAmount <= 0) {
                this.$toast.error('Giá trị doanh thu phải lớn hơn 0');
                return;
            }
            
            this.loading(true);
            let response;
            if (this.isAddRevenue) {
                const payload = {
                    project_id: this.projectData.id,
                    year: this.revenueForm.year,
                    amount: this.revenueForm.revenueAmount,
                };
                response = await API.AddProjectRevenue(this, payload);
            } else {
                const payload = {
                    revenue_projected_id: this.revenueForm.id,
                    year: this.revenueForm.year,
                    amount: this.revenueForm.revenueAmount,
                };
                response = await API.UpdateProjectRevenue(this, payload);
            }
            this.loading(false);
            
            if (response && response.success) {
                this.hideRevenueModal();
                await this.loadRevenues();
            } else {
                this.$toast.error(response.message || 'Có lỗi xảy ra.');
            }
        },
        
        async deleteSelectedRevenue() {
            if (!this.selectedRevenue) {
                this.$toast.error('Vui lòng chọn một dự kiến doanh thu để xóa');
                return;
            }
            
            await this.$confirm(`Bạn chắc chắn muốn xóa dự kiến doanh thu năm ${this.selectedRevenue.year}?`, 'Xác nhận')
            .then(async (result) => {
                if (result) {
                    this.loading(true);
                    const response = await API.DeleteProjectRevenue(this, this.selectedRevenue.id);
                    this.loading(false);

                    if (response && response.success) {
                        this.$toast.success(response.message);
                        this.selectedRevenue = null;
                        await this.loadRevenues();
                    } else {
                        this.$toast.error(response.message || 'Lỗi khi xóa.');
                    }
                }
            });
        },
        async approveSelectedRevenue() {
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
                        await this.loadRevenues(); // Tải lại dữ liệu để cập nhật bảng
                    }
                }
            });
        },

        async rejectSelectedRevenue() {
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
                        await this.loadRevenues(); // Tải lại dữ liệu để cập nhật bảng
                    }
                }
            });
        }
    }
}
</script>

<style src="../Project.css" scoped></style>