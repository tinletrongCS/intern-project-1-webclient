<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupRevenueManagement"
        :showCloseIcon="true"
        width="95%"
        height="85%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box" style="height: 100%;">
            <div class="popup-body" style="flex: 1; overflow: hidden;">
                <div>
                    <!-- Section Actions -->
                    <div class="info-row" style="flex-shrink: 0;">
                        <div class="group-buttons right">
                            <button class="btn btn-second" style="min-width: 100px;" @click="addNewRevenue">
                                <span class="icon fa fa-plus"></span>&nbsp;Tạo mới
                            </button>&nbsp;
                            <button class="btn btn-second" style="min-width: 100px;" @click="editSelectedRevenue">
                                <span class="icon fa fa-edit"></span>&nbsp;Điều chỉnh
                            </button>&nbsp;
                            <button class="btn btn-second" style="min-width: 100px;" @click="deleteSelectedRevenue">
                                <span class="icon fa fa-trash"></span>&nbsp;Xóa
                            </button>&nbsp;
                        </div>
                    </div>

                    <!-- Revenue Grid -->
                    <div class="box-form">
                        <KDataGrid
                            v-if="gridReady"
                            ref="revenueGrid"
                            :columns="revenueColumns"
                            :dataSource="formattedRevenueData"
                            :enable-paging-server="false"
                            :allowPaging="true"
                            :showFilter="false"
                            :showSTT="true"
                            :showColumnCheckbox="true"
                            :enabledSelectFirstRow="false"
                            :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                            @rowSelected="handleSelectionChange"      
                            @rowDeselected="handleSelectionChange"
                            @recordDoubleClick="onRevenueRecordDoubleClick"
                            @dataBound="onGridDataBound"
                        />
                        
                        <!-- Fixed Total Row -->
                        <table class="table table-bordered mb-0">
                            <tbody>
                                <tr class="total-row">
                                    <td style="width: 740px; font-weight: bold; text-align: right;">Tổng</td>
                                    <td style="width: 130px; text-align: right; font-weight: bold;">{{ formatVNDDisplay(totalValue) }}</td>
                                    <td style="width: 130px; text-align: right; font-weight: bold;">{{ formatVNDDisplay(totalTax) }}</td>
                                    <td style="width: 175px; text-align: right; font-weight: bold;">{{ formatVNDDisplay(totalAmount) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Revenue Detail Modal -->
    <ContractRevenueDetailModal
        ref="revenueDetailModal"
        :isAdd="isAddNewRevenue"
        :isViewDetail="isViewDetail"
        :revenueData="selectedRevenueRow"
        :contractInfo="contractData"
        @successRevenue="handleRevenueSuccess"
    />
</template>

<script>
import moment from 'moment';
import ContractRevenueDetailModal from './DetailRevenueContractModal.vue'
import API from '../API';

export default {
    name: "ContractRevenueManagementModal",
    components: {
        ContractRevenueDetailModal
    },
    props: {
        contractData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            animationSettings: { effect: 'Zoom', duration: 300 },
            target: 'body',
            header: 'Thông tin doanh thu hợp đồng',
            gridReady: true,
            // Revenue data
            revenueDataSources: [],
            selectedRecords: [],
            selectedRevenueRow: {},
            isAddNewRevenue: false,
            isViewDetail: false,
            totalValue: 0,
            totalTax: 0,
            totalAmount: 0,
            revenueColumns: [
                {
                    fieldName: 'dataRevenueName',
                    headerText: 'Hạng mục doanh thu',
                    allowFiltering: true,
                    width: '250'
                },
                {
                    fieldName: 'revenueTypeId',
                    headerText: 'Phân loại',
                    allowFiltering: true,
                    width: '120',
                    textAlign: 'center',
                    valueAccessor: (field, data, column) => {
                        if (data.revenueTypeId == 1) return 'Thu một lần';
                        if (data.revenueTypeId == 2) return 'Thu định kỳ';
                        return '';
                    }
                },
                {
                    fieldName: 'periodNumber',
                    headerText: 'Số kỳ',
                    allowFiltering: false,
                    textAlign: 'center',
                    width: '100'
                },
                {
                    fieldName: 'startDate',
                    headerText: 'Bắt đầu',
                    allowFiltering: true,
                    width: '120',
                    textAlign: 'center',
                    type: 'date',
                    format: 'dd/MM/yyyy'
                },
                {
                    fieldName: 'endDate',
                    headerText: 'Kết thúc',
                    allowFiltering: true,
                    width: '120',
                    textAlign: 'center',
                    type: 'date',
                    format: 'dd/MM/yyyy'
                },
                {
                    fieldName: 'amount',
                    headerText: 'Giá trị (VND)',
                    allowFiltering: false,
                    width: '150',
                    textAlign: 'right',
                    valueAccessor: (field, data, column) => {
                        if (typeof data.amount !== 'number') return '';
                        return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(data.amount);
                    }
                },
                {
                    fieldName: 'amountVat',
                    headerText: 'Thuế (VND)',
                    allowFiltering: false,
                    width: '150',
                    textAlign: 'right',
                    valueAccessor: (field, data, column) => {
                        if (typeof data.amountVat !== 'number') return '';
                        return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(data.amountVat);
                    }
                },
                {
                    fieldName: 'amountTotal',
                    headerText: 'Tổng giá trị gồm thuế (VND)',
                    allowFiltering: false,
                    width: '200',
                    textAlign: 'right',
                    valueAccessor: (field, data, column) => {
                        if (typeof data.amountTotal !== 'number') return '';
                        return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(data.amountTotal);
                    }
                }
            ]
        }
    },
    computed: {
        // Xử lý và format dữ liệu doanh thu để hiển thị trên grid
        formattedRevenueData() {
            // Kiểm tra nếu không có dữ liệu thì trả về mảng rỗng
            if (!Array.isArray(this.revenueDataSources) || this.revenueDataSources.length === 0) {
                return [];
            }

            // Duyệt qua từng item và chuẩn hóa dữ liệu
            return this.revenueDataSources.map((item, index) => {
                const newItem = { ...item }; // Tạo bản sao của item

                if (newItem.startDate) {
                    const date = new Date(newItem.startDate);
                    // **LOẠI BỎ GIỜ, PHÚT, GIÂY**
                    date.setHours(0, 0, 0, 0); 
                    newItem.startDate = date;
                }
                if (newItem.endDate) {
                    const date = new Date(newItem.endDate);
                    // **LOẠI BỎ GIỜ, PHÚT, GIÂY**
                    date.setHours(0, 0, 0, 0);
                    newItem.endDate = date;
                }
                return newItem;
            });
        },
    },
    methods: {
        // Hiển thị modal quản lý doanh thu hợp đồng
        showModal() {
            this.$refs.popupRevenueManagement.show();
        },

        // Ẩn modal quản lý doanh thu hợp đồng
        hideModal() {
            this.$refs.popupRevenueManagement.hide();
        },

        // Xử lý khi modal được mở - tự động tải dữ liệu doanh thu
        async handleShowModal() {
            await this.loadRevenueData();
        },

        // Định dạng hiển thị số tiền theo chuẩn VND
        formatVNDDisplay(value) {
            if (typeof value !== 'number') return '';
            return new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
            }).format(value);
        },

        // Tính toán tổng tiền từ dữ liệu hiện tại trên grid
        calculateTotals() {
            this.$nextTick(() => {
                if (this.$refs.revenueGrid) {
                    const viewData = this.$refs.revenueGrid.grid.getCurrentViewRecords() || [];
                    this.totalValue = viewData.reduce((sum, item) => sum + (item.amount || 0), 0);
                    this.totalTax = viewData.reduce((sum, item) => sum + (item.amountVat || 0), 0);
                    this.totalAmount = viewData.reduce((sum, item) => sum + (item.amountTotal || 0), 0);
                }
            });
        },

        // Xử lý sự kiện khi grid hoàn thành một hành động
        onGridDataBound(args) {
            this.calculateTotals();
        },

        // Tải dữ liệu doanh thu từ API và gán vào datasource
        async loadRevenueData() {
            this.gridReady = false;
            var dataArray = await API.getContractRevenue(this, this.contractData.id);
            this.revenueDataSources = [].concat(dataArray);
            this.$nextTick(() => {
                this.gridReady = true;
            });
        },

        // Mở modal tạo mới doanh thu
        addNewRevenue() {
            this.isAddNewRevenue = true;
            this.isViewDetail = false;
            this.selectedRevenueRow = {};
            this.$refs.revenueDetailModal.showModal();
        },

        // Mở modal chỉnh sửa doanh thu đã chọn
        editSelectedRevenue() {
            const dsSelected = this.selectedRecords;

            if (dsSelected.length === 0) {
                this.$toast.error('Vui lòng chọn một dòng để chỉnh sửa');
                return;
            }

            if (dsSelected.length > 1) {
                this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!');
                return;
            }

            // Gán dữ liệu và mở modal
            this.selectedRevenueRow = dsSelected[0];
            this.isAddNewRevenue = false;
            this.isViewDetail = false;
            this.$refs.revenueDetailModal.showModal();
        },

        // Xóa doanh thu đã chọn sau khi xác nhận
        async deleteSelectedRevenue() {
            const selectedRecords = this.$refs.revenueGrid.getSelectedRecords();

            if (selectedRecords.length === 0) {
                this.$toast.error('Vui lòng chọn ít nhất 1 dòng cần xóa!');
                return;
            }

            // Hiển thị hộp thoại xác nhận
            await this.$confirm('Xác nhận', `Bạn chắc chắn muốn xóa ${selectedRecords.length} dòng đã chọn?`)
            .then(async (result) => {
                if (result == 0) return;

                // Lấy danh sách ID từ các dòng đã chọn
                const idsToDelete = selectedRecords.map(x => x.id);

                // Gọi API với danh sách ID
                const response = await API.deleteContractRevenue(this, idsToDelete);

                if (response && response.success) {
                    this.$toast.success('Xóa doanh thu thành công');
                    await this.loadRevenueData(); // Tải lại dữ liệu grid
                }
            });
        },

        handleSelectionChange() {
            this.$nextTick(() => {
                const records = this.$refs.revenueGrid.getSelectedRecords();
                // 1. Cập nhật mảng chứa tất cả các lựa chọn
                this.selectedRecords = records;

                // 2. Đồng bộ hóa đối tượng chứa lựa chọn đơn lẻ
                if (records.length === 1) {
                    this.selectedRevenueRow = records[0];
                } else {
                    this.selectedRevenueRow = {};
                }
            });
        },

        // Xử lý khi người dùng double click vào một dòng trên grid
        onRevenueRecordDoubleClick(args) {
            if (args.rowData) {
                this.selectedRevenueRow = args.rowData;
                this.viewRevenueDetail(args.rowData);
            }
        },

        // Mở modal xem chi tiết doanh thu
        viewRevenueDetail(rowData) {
            this.isAddNewRevenue = false;
            this.isViewDetail = true;
            this.selectedRevenueRow = rowData;
            this.$refs.revenueDetailModal.showModal();
        },

        // Xử lý khi modal chi tiết doanh thu trả về kết quả thành công
        async handleRevenueSuccess(revenueDataFromModal) {
            const requestBody = {
                data_revenue_name: revenueDataFromModal.data_revenue_name,
                contract_id: this.contractData.id,
                project_id: this.contractData.projectId,
                year: revenueDataFromModal.year,
                revenue_type_id: revenueDataFromModal.revenue_type_id,
                period_number: revenueDataFromModal.period_number,
                start_date: moment(revenueDataFromModal.startDate).format('YYYY-MM-DD'),
                end_date: moment(revenueDataFromModal.endDate).format('YYYY-MM-DD'),
                amount: revenueDataFromModal.amount,
                amount_vat: revenueDataFromModal.amount_vat,
                amount_total: revenueDataFromModal.amount_total,
                vat_flg: revenueDataFromModal.vat_flg,
                // contract_summary: revenueDataFromModal.contract_summary,
            };

            let response;
            if (this.isAddNewRevenue) {
                response = await API.addContractRevenue(this, requestBody);
            } else {
                // Nếu là chỉnh sửa, thêm ID của dòng đang chọn
                requestBody.contract_revenue_id = this.selectedRevenueRow.id;
                response = await API.updateContractRevenue(this, requestBody);
            }

            // Nếu API thực thi thành công, tải lại dữ liệu cho bảng
            if (response && response.success) {
                await this.loadRevenueData();
                this.$refs.revenueDetailModal.hideModal();
            }
        },
    }
}
</script>

<style src="../Contract.css" scoped> </style>
