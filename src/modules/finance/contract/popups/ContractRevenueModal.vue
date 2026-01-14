<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupRevenue"
        :showCloseIcon="true"
        width="80%"
        height="85%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="h-100 d-flex flex-column">
            <div class="flex-grow-1 overflow-auto p-3">
                <div class="container-fluid">
                    <!-- Thông tin cơ bản -->
                    <div class="basic-info-section">
                        <div class="row">
                            <div class="col-sm-6 col-12">
                                <div class="info-row">
                                    <div class="key w150 bold">Tên dự án:</div>
                                    <div class="value">{{ contractData.project }}</div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-12">
                                <div class="info-row">
                                    <div class="key w150 bold">Số hợp đồng:</div>
                                    <div class="value">{{ contractData.contractNumber || 'N/A' }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6 col-12">
                                <div class="info-row">
                                    <div class="key w150 bold">Loại dự án:</div>
                                    <div class="value">{{ contractData.contractType || 'N/A' }}</div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-12">
                                <div class="info-row">
                                    <div class="key w150 bold">Tên khách hàng:</div>
                                    <div class="value">{{ contractData.customerName || 'N/A' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab system -->
                    <div class="card">
                        <div class="card-header p-0">
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button class="nav-link bold ml-2" :class="{ active: activeTab === 'contract-value' }" @click="switchTab('contract-value')" 
                                            type="button" role="tab">
                                        <i class="fa fa-money me-2"></i>
                                        Giá trị hợp đồng
                                    </button>
                                    <button class="nav-link bold" :class="{ active: activeTab === 'revenue-split' }" @click="switchTab('revenue-split')" 
                                            type="button" role="tab">
                                        <i class="fa fa-pie-chart me-2"></i>
                                        Phân chia doanh thu
                                    </button>
                                </div>
                            </nav>
                        </div>

                        <!-- Tab Content -->
                        <div class="card-body">
                            <!-- Tab Giá trị hợp đồng -->
                            <div v-if="activeTab === 'contract-value'" class="tab-pane">
                                <div class="info-row">
                                    <div class="group-buttons right">
                                      <button class="btn btn-second" style="min-width: 100px;" @click="showAddItemModal">
                                        <span class="icon fa fa-plus"></span>&nbsp;Thêm hạng mục
                                      </button>&nbsp;
                                      <button class="btn btn-second" style="min-width: 100px;" @click="editSelectedItem">
                                        <span class="icon fa fa-edit"></span>&nbsp;Điều chỉnh
                                      </button>&nbsp;
                                      <button class="btn btn-second" style="min-width: 100px;" @click="deleteSelectedItem">
                                        <span class="icon fa fa-trash"></span>&nbsp;Xóa
                                      </button>
                                    </div>
                                </div>
                                    
                                <!-- Bảng giá trị hợp đồng -->
                                <div class="border rounded p-3 bg-white">
                                    <div v-if="revenueItems.length === 0" class="text-center text-muted py-4">
                                        <i class="fa fa-info-circle"></i> Chưa có dữ liệu hạng mục
                                    </div>
                                    
                                    <div v-else>
                                        <KDataGrid
                                            ref="revenueGrid"
                                            :columns="revenueColumns"
                                            :dataSource="formattedRevenueItems"
                                            :enable-paging-server="false"
                                            :allowPaging="false"
                                            :showFilter="false"
                                            :showColumnCheckbox="true"
                                            :showSTT="true"
                                            :enabledSelectFirstRow="false"
                                            :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                                            @rowSelected="onRevenueRowSelected"
                                            @recordDoubleClick="onRevenueRecordDoubleClick"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Tab Phân chia doanh thu -->
                            <div v-else-if="activeTab === 'revenue-split'" class="tab-pane show active">
                                <div class="info-row">
                                    <div class="group-buttons right">
                                        <button class="btn btn-second" style="min-width: 100px;" @click="showAddRevenueSplitModal">
                                            <span class="icon fa fa-plus"></span>&nbsp;Tạo mới
                                        </button>&nbsp;
                                        <button class="btn btn-second" style="min-width: 100px;" @click="editSelectedRevenueSplit">
                                            <span class="icon fa fa-edit"></span>&nbsp;Điều chỉnh
                                        </button>&nbsp;
                                        <button class="btn btn-second" style="min-width: 100px;" @click="deleteSelectedRevenueSplit">
                                            <span class="icon fa fa-trash"></span>&nbsp;Xóa
                                        </button>
                                    </div>
                                </div>
                                    
                                    <!-- Bảng phân chia doanh thu -->
                                    <div class="border rounded p-3 bg-white">
                                        <div v-if="revenueSplitItems.length === 0" class="text-center text-muted py-4">
                                            <i class="fa fa-info-circle"></i> Chưa có dữ liệu phân chia doanh thu
                                        </div>
                                        
                                        <div v-else>
                                            <KDataGrid
                                                ref="revenueSplitGrid"
                                                :columns="revenueSplitColumns"
                                                :dataSource="formattedRevenueSplitItems"
                                                :enable-paging-server="false"
                                                :allowPaging="false"
                                                :showFilter="false"
                                                :showColumnCheckbox="true"
                                                :showSTT="true"
                                                :enabledSelectFirstRow="false"
                                                :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                                                @rowSelected="onRevenueSplitRowSelected"
                                                @recordDoubleClick="onRevenueSplitRecordDoubleClick"
                                            />
                                        </div>
                                    </div>
                            </div>
                            
                            <!-- Fallback nếu không có tab nào được chọn -->
                            <div v-else class="tab-pane">
                                <div class="text-center text-muted py-4">
                                    <i class="fa fa-info-circle"></i> Vui lòng chọn một tab để xem nội dung
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Modal thêm/sửa hạng mục -->
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddItem"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="itemModalHeader"
        :open="handleShowAddItemModal">
        <div class="h-100 d-flex flex-column">
            <div class="flex-grow-1 overflow-auto p-3">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Hạng mục <required-marker/></label>
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <select2 v-model="itemForm.categoryId" :options="categoryOptions" 
                                                 placeholder="Chọn hạng mục...">
                                        </select2>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary ms-2" 
                                            @click="showAddCategoryModal" title="Thêm hạng mục mới">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Giá trị (VNĐ) <required-marker/></label>
                                <input type="text" v-model="itemForm.value" class="form-control" 
                                       placeholder="Nhập giá trị..." 
                                       @input="formatCurrency">
                            </div>
                        </div>
                    </div>

                    <!-- Nút action -->
                    <div class="group-buttons text-right mb-3 mr-3">
                        <button @click="saveItem" class="btn btn-second nocorner">
                            <i class="one-save me-1"></i> {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
                        </button>
                        <button @click="hideAddItemModal" class="btn btn-primary nocorner">
                            <i class="fa fa-times me-1"></i> Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Modal thêm/sửa phân chia doanh thu -->
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddRevenueSplit"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="revenueSplitModalHeader"
        :open="handleShowAddRevenueSplitModal">
        <div class="h-100 d-flex flex-column">
            <div class="flex-grow-1 overflow-auto p-3">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Hạng mục <required-marker/></label>
                                <select2 v-model="revenueSplitForm.contractValueId" :options="contractValueOptions">
                                </select2>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Phần trăm doanh thu (%) <required-marker/></label>
                                <input type="number" v-model="revenueSplitForm.revenuePercent" class="form-control" 
                                       placeholder="Nhập phần trăm..." 
                                       min="0" max="100" step="0.01">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Đơn vị thực hiện <required-marker/></label>
                                <select2 v-model="revenueSplitForm.unitId" :options="unitOptions">
                                </select2>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Vai trò của đơn vị thực hiện <required-marker/></label>
                                <select2 v-model="revenueSplitForm.roleId" :options="roleOptions">
                                </select2>
                            </div>
                        </div>
                    </div>
                    <!-- Hiển thị tổng giá trị -->
                    <div class="row" v-if="calculatedTotalValue > 0">
                        <div class="col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-5">
                            Tổng giá trị: {{ formatVND(calculatedTotalValue) }}
                        </div>
                    </div>
                    <!-- Nút action -->
                    <div class="group-buttons text-right mb-3 mr-3">
                        <button @click="saveRevenueSplit" class="btn btn-second nocorner">
                            <i class="one-save me-1"></i> {{ isRevenueSplitEditMode ? 'Cập nhật' : 'Thêm mới' }}
                        </button>
                        <button @click="hideAddRevenueSplitModal" class="btn btn-primary nocorner">
                            <i class="fa fa-times me-1"></i> Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Modal thêm hạng mục dùng chung -->
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddCategory"
        :showCloseIcon="true"
        width="40%"
        :isModal='true'
        :target="target"
        :header="categoryModalHeader"
        :open="handleShowAddCategoryModal">
        <div class="h-100 d-flex flex-column">
            <div class="flex-grow-1 overflow-auto p-3">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3">
                                <label class="form-label bold">Tên hạng mục <required-marker/></label>
                                <input type="text" v-model="categoryForm.name" class="form-control" 
                                       placeholder="Nhập tên hạng mục..." 
                                       :class="{ 'is-invalid': showCategoryValidation && !categoryForm.name.trim() }">
                            </div>
                        </div>
                    </div>
                    <!-- Nút action -->
                    <div class="group-buttons right border-top pt-3">
                        <button @click="saveCategory" class="btn btn-primary">
                            <i class="one-save me-1"></i> Lưu thay đổi
                        </button>
                        <button @click="hideAddCategoryModal" class="btn btn-secondary">
                            <i class="fa fa-times me-1"></i> Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import API from '../API';

export default {
    name: 'ContractRevenueModal',
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
            activeTab: 'contract-value',
            
            // Tab 1: Giá trị hợp đồng
            revenueItems: [], 
            categories: [], 
            selectedRevenueItem: null,
            itemForm: { categoryId: null, value: '' },
            isEditMode: false,
            showValidation: false,
            categoryForm: { name: '' },
            showCategoryValidation: false,
            
            // Tab 2: Phân chia doanh thu
            revenueSplitItems: [],
            selectedRevenueSplitItem: null,
            revenueSplitForm: { contractValueId: null, unitId: null, roleId: null, revenuePercent: null },
            isRevenueSplitEditMode: false,
            showRevenueSplitValidation: false,

            // Dữ liệu giả cho dropdowns Đơn vị và Vai trò
            // TODO: Thay thế bằng lệnh gọi API để lấy dữ liệu thật
            unitOptions: [ {id: 1, text: 'Trung tâm CNTT'}, {id: 2, text: 'Phòng Kế hoạch'}, ],
            roleOptions: [ {id: 1, text: 'Thực hiện chính'}, {id: 2, text: 'Hỗ trợ'}, ],
            
            revenueColumns: [
                {
                    fieldName: 'categoryName',
                    headerText: 'Hạng mục',
                    width: '600'
                },
                {
                    fieldName: 'value',
                    headerText: 'Giá trị (VNĐ)',
                    textAlign: 'right',
                    width: '300',
                    type: 'number',
                    format: 'N0'
                }
            ],
            revenueSplitColumns: [
                {
                    fieldName: 'categoryName',
                    headerText: 'Hạng mục',
                    width: '250'
                },
                {
                    fieldName: 'unitId',
                    headerText: 'Đơn vị thực hiện', width: '200'
                },
                {
                    fieldName: 'roleId',
                    headerText: 'Vai trò',
                    width: '150'
                },
                {
                    fieldName: 'percent',
                    headerText: 'Phần trăm (%)',
                    textAlign: 'right',
                    width: '150'
                },
                {
                    fieldName: 'totalValue',
                    headerText: 'Tổng giá trị (VNĐ)',
                    textAlign: 'right',
                    width: '200',
                    type: 'number',
                    format: 'N0'
                }
            ]
        }
    },
    computed: {
        header() {
            return `<span class="icon fa fa-money"></span> Thông tin doanh thu - ${this.contractData.contractNumber}`
        },
        itemModalHeader() {
            return this.isEditMode ? `Điều chỉnh hạng mục` : `Thêm hạng mục`
        },
        revenueSplitModalHeader() {
            return this.isRevenueSplitEditMode ? `Điều chỉnh phân chia doanh thu` : `Thêm phân chia doanh thu`
        },
        categoryModalHeader() {
            return `Thêm hạng mục dùng chung`
        },
        categoryOptions() {
            return this.categories.map(cat => ({ id: cat.id, text: cat.text }));
        },
        contractValueOptions() {
            return this.revenueItems.map(item => ({ id: item.id, text: item.categoryName }));
        },
        calculatedTotalValue() {
            const selectedItem = this.revenueItems.find(item => item.id == this.revenueSplitForm.contractValueId);
            if (selectedItem && this.revenueSplitForm.revenuePercent) {
                return selectedItem.value * (this.revenueSplitForm.revenuePercent / 100);
            }
            return 0;
        },
        formattedRevenueItems() {
            return this.revenueItems;
        },
        formattedRevenueSplitItems() {
            return this.revenueSplitItems.map(item => {
                const unit = this.unitOptions.find(u => u.id === item.unitId);
                const role = this.roleOptions.find(r => r.id === item.roleId);
                return {
                    ...item,
                    unitId: unit ? unit.text : item.unitId,
                    roleId: role ? role.text : item.roleId
                }
            });
        }
    },
    methods: {
        // Hiển thị modal chính quản lý doanh thu hợp đồng
        showModal() { this.$refs["popupRevenue"].show(); },
        
        // Ẩn modal chính quản lý doanh thu hợp đồng
        hideModal() { this.$refs["popupRevenue"].hide(); },
        
        // Xử lý khi modal được mở - khởi tạo dữ liệu ban đầu
        async handleShowModal() {
            this.activeTab = 'contract-value';
            this.selectedRevenueItem = null;
            this.selectedRevenueSplitItem = null;
            await this.loadInitialData();
        },

        // Tải tất cả dữ liệu cần thiết khi mở modal
        async loadInitialData() {
            this.loading(true);
            await Promise.all([ 
                this.loadCategories(), 
                this.loadRevenueData() 
            ]);
            this.loading(false);
        },
        
        // Chuyển đổi giữa các tab và tải dữ liệu tương ứng
        async switchTab(tabName) {
            this.activeTab = tabName;
            if (tabName === 'revenue-split') {
                await this.loadRevenueSplitData();
            }
        },
        
        // Hiển thị/ẩn loading spinner toàn cục
        loading(show) {
            this.$root.showLoading(show);
        },
        
        // Định dạng số tiền theo chuẩn Việt Nam (VNĐ)
        formatVND(value) {
            return (typeof value !== 'number') ? '0' : new Intl.NumberFormat('vi-VN').format(value);
        },

        // === TAB 1: GIÁ TRỊ HỢP ĐỒNG ===
        
        // Hiển thị modal thêm mới hạng mục giá trị hợp đồng
        showAddItemModal() {
            this.isEditMode = false; this.clearItemForm(); this.$refs["popupAddItem"].show();
        },
        
        // Ẩn modal thêm/sửa hạng mục giá trị hợp đồng
        hideAddItemModal() {
            this.$refs["popupAddItem"].hide();
        },
        
        // Chỉnh sửa hạng mục đã chọn
        editSelectedItem() {
            const dsSelected = this.$refs.revenueGrid.grid.getSelectedRecords();

            if (dsSelected.length === 0) {
                this.$toast.error('Vui lòng chọn một hạng mục để điều chỉnh.');
                return;
            }

            if (dsSelected.length > 1) {
                this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!');
                return;
            }
            
            // Gán dữ liệu của dòng duy nhất được chọn
            this.selectedRevenueItem = dsSelected[0];
            
            this.isEditMode = true;
            this.itemForm = { 
                categoryId: this.selectedRevenueItem.categoryId, 
                value: this.selectedRevenueItem.value.toLocaleString('vi-VN') 
            }; 
            this.$refs["popupAddItem"].show();
        },
        
        // Xử lý khi chọn một dòng trong bảng giá trị hợp đồng
        onRevenueRowSelected(args) {
            this.selectedRevenueItem = args.data;
        },
        
        // Xử lý khi double click vào một dòng trong bảng giá trị hợp đồng
        onRevenueRecordDoubleClick(args) {
            if (args.rowData) { this.editSelectedItem(args.rowData); }
        },
        
        // Xóa dữ liệu form thêm/sửa hạng mục và reset trạng thái validation
        clearItemForm() {
            this.itemForm = { categoryId: null, value: '' }; this.showValidation = false;
        },
        
        // Định dạng input tiền tệ khi người dùng nhập
        formatCurrency(event) {
            let value = event.target.value.replace(/[^\d]/g, '');
            this.itemForm.value = value ? parseInt(value, 10).toLocaleString('vi-VN') : '';
        },
        
        // Tải dữ liệu giá trị hợp đồng từ API
        async loadRevenueData() {
            const jsonString = await API.getContractValues(this, this.contractData.id);
            if (jsonString && typeof jsonString === 'string') {
                this.revenueItems = JSON.parse(jsonString);
            } else {
                this.revenueItems = [];
            }
        },
        
        // Lưu hoặc cập nhật hạng mục giá trị hợp đồng
        async saveItem() {
            this.showValidation = true;
            if (!this.itemForm.categoryId || !this.itemForm.value.trim()) return this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
            
            const valueNumber = parseInt(this.itemForm.value.replace(/[^\d]/g, '')) || 0;
            let response;
            if (this.isEditMode) {
                response = await API.updateContractValue(this, {
                    contract_value_id: this.selectedRevenueItem.id, type_id: this.itemForm.categoryId, amount: valueNumber
                });
            } else {
                response = await API.addContractValue(this, {
                    contract_id: this.contractData.id, type_id: this.itemForm.categoryId, amount: valueNumber
                });
            }
            if (response && response.success) {
                this.hideAddItemModal(); await this.loadRevenueData();
            }
        },
        
        // Xóa hạng mục giá trị đã chọn sau khi xác nhận
        async deleteSelectedItem() {
            const selectedRecords = this.$refs.revenueGrid.grid.getSelectedRecords();
            if (selectedRecords.length === 0) {
                return this.$toast.error('Vui lòng chọn ít nhất một hạng mục để xóa.');
            }

            await this.$confirm('Xác nhận', `Bạn chắc chắn muốn xóa các hạng mục đã chọn?`)
            .then(async (result) => {
                if (result === 0) return;

                // Lấy danh sách ID từ các dòng đã chọn
                const idsToDelete = selectedRecords.map(item => item.id);
                const response = await API.deleteContractValue(this, idsToDelete);

                if (response && response.success) { 
                    this.selectedRevenueItem = null; 
                    await this.loadRevenueData(); 
                }
            });
        },
        
        // === HẠNG MỤC DÙNG CHUNG ===
        
        // Hiển thị modal thêm mới hạng mục dùng chung
        showAddCategoryModal() {
            this.clearCategoryForm(); this.$refs["popupAddCategory"].show();
        },
        
        // Ẩn modal thêm mới hạng mục dùng chung
        hideAddCategoryModal() {
            this.$refs["popupAddCategory"].hide();
        },
        
        // Xóa dữ liệu form thêm hạng mục và reset trạng thái validation
        clearCategoryForm() {
            this.categoryForm = { name: '' }; this.showCategoryValidation = false;
        },
        
        // Tải danh sách hạng mục hoạt động từ API
        async loadCategories() {
            this.categories = await API.getActiveItemContracts(this);
        },
        
        // Lưu hạng mục mới vào hệ thống
        async saveCategory() {
            this.showCategoryValidation = true;
            if (!this.categoryForm.name.trim()) return this.$toast.error('Vui lòng nhập tên hạng mục');
            const response = await API.addItemContract(this, { item_contract_name: this.categoryForm.name });
            if (response && response.success) {
                await this.loadCategories();
                this.itemForm.categoryId = response.data.id;
                this.hideAddCategoryModal();
            }
        },

        // === TAB 2: PHÂN CHIA DOANH THU ===
        
        // Hiển thị modal thêm mới phân chia doanh thu
        showAddRevenueSplitModal() {
            this.isRevenueSplitEditMode = false;
            this.clearRevenueSplitForm();
            this.$refs["popupAddRevenueSplit"].show();
        },
        
        // Ẩn modal thêm/sửa phân chia doanh thu
        hideAddRevenueSplitModal() {
            this.$refs["popupAddRevenueSplit"].hide();
        },
        
        // Chỉnh sửa phân chia doanh thu đã chọn
        editSelectedRevenueSplit() {
            const dsSelected = this.$refs.revenueSplitGrid.grid.getSelectedRecords();

            if (dsSelected.length === 0) {
                this.$toast.error('Vui lòng chọn một mục phân chia để điều chỉnh.');
                return;
            }

            if (dsSelected.length > 1) {
                this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!');
                return;
            }

            // Gán dữ liệu của dòng duy nhất được chọn
            this.selectedRevenueSplitItem = dsSelected[0];

            this.isRevenueSplitEditMode = true;
            this.revenueSplitForm = {
                contractValueId: this.selectedRevenueSplitItem.contractValueId,
                unitId: this.selectedRevenueSplitItem.unitId,
                roleId: this.selectedRevenueSplitItem.roleId,
                revenuePercent: this.selectedRevenueSplitItem.percent
            };
            this.$refs["popupAddRevenueSplit"].show();
        },
        
        // Xử lý khi chọn một dòng trong bảng phân chia doanh thu
        onRevenueSplitRowSelected(args) {
            this.selectedRevenueSplitItem = args.data;
        },
        
        // Xử lý khi double click vào một dòng trong bảng phân chia doanh thu
        onRevenueSplitRecordDoubleClick(args) {
            if (args.rowData) {
                this.editSelectedRevenueSplit(args.rowData);
            }
        },
        
        // Xóa dữ liệu form phân chia doanh thu và reset trạng thái validation
        clearRevenueSplitForm() {
            this.revenueSplitForm = { contractValueId: null, unitId: null, roleId: null, revenuePercent: null };
            this.showRevenueSplitValidation = false;
        },

        // Tải dữ liệu phân chia doanh thu từ API
        async loadRevenueSplitData() {
            const jsonString = await API.getRevenueSharing(this, this.contractData.id);
            if (jsonString && typeof jsonString === 'string') {
                this.revenueSplitItems = JSON.parse(jsonString);
            } else {
                this.revenueSplitItems = [];
            }
        },
        
        // Lưu hoặc cập nhật phân chia doanh thu
        async saveRevenueSplit() {
            this.showRevenueSplitValidation = true;
            if (!this.revenueSplitForm.contractValueId || !this.revenueSplitForm.unitId || !this.revenueSplitForm.roleId || !this.revenueSplitForm.revenuePercent) {
                return this.$toast.error('Vui lòng nhập đầy đủ thông tin vào các trường bắt buộc');
            }
            let response;
            if (this.isRevenueSplitEditMode) {
                const requestBody = {
                    revenue_sharing_contract_id: this.selectedRevenueSplitItem.id,
                    contract_value_id: this.revenueSplitForm.contractValueId,
                    unit_id: this.revenueSplitForm.unitId,
                    role_id: this.revenueSplitForm.roleId,
                    percent: this.revenueSplitForm.revenuePercent
                };
                response = await API.updateRevenueSharing(this, requestBody);
            } else {
                const requestBody = {
                    contract_id: this.contractData.id,
                    contract_value_id: this.revenueSplitForm.contractValueId,
                    unit_id: this.revenueSplitForm.unitId,
                    role_id: this.revenueSplitForm.roleId,
                    percent: this.revenueSplitForm.revenuePercent
                };
                response = await API.addRevenueSharing(this, requestBody);
            }
            if (response && response.success) { 
                this.hideAddRevenueSplitModal(); 
                await this.loadRevenueSplitData(); 
            }
        },
        
        // Xóa phân chia doanh thu đã chọn sau khi xác nhận
        async deleteSelectedRevenueSplit() {
            const selectedRecords = this.$refs.revenueSplitGrid.grid.getSelectedRecords();
            if (selectedRecords.length === 0) {
                return this.$toast.error('Vui lòng chọn ít nhất một mục phân chia để xóa.');
            }

            await this.$confirm('Xác nhận', `Bạn chắc chắn muốn xóa các mục phân chia đã chọn?`)
            .then(async (result) => {
                if (result === 0) return;

                const idsToDelete = selectedRecords.map(item => item.id);
                const response = await API.deleteRevenueSharing(this, idsToDelete);

                if (response && response.success) {
                    this.selectedRevenueSplitItem = null; 
                    await this.loadRevenueSplitData();
                }
            });
        }
    }
}
</script>

<style src="../Contract.css" scoped> </style>