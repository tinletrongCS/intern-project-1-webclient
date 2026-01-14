<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupRevenueDetail"
        :showCloseIcon="true"
        width="70%"
        height="75%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box" style="height: 100%; display: flex; flex-direction: column;">
            <div class="popup-body">
                <div class="box-form" style="height: 100%; display: flex; flex-direction: column;">
                        <div class="row">
                            <div class="col-sm-6 col-12">
                                <div class="form-group">
                                    <div class="form-label bold">Phân doanh thu theo kỳ <required-marker/></div>
                                    <div class="value">
                                        <select2 
                                            v-model='formData.revenue_type_id' 
                                            :options="classificationOptions"
                                            :disabled="isViewDetail"
                                            @select="onClassificationChange"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-12" v-if="formData.revenue_type_id == 2">
                                <div class="form-group">
                                    <div class="form-label bold">Kỳ thanh toán <required-marker/></div>
                                    <div class="value">
                                        <select2 
                                            v-model='formData.period_number' 
                                            :options="paymentPeriodOptions"
                                            :disabled="isViewDetail"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6 col-12">
                                <div class="form-group">
                                    <div class="form-label bold">Giá trị doanh thu chưa thuế (VND) <required-marker/></div>
                                    <div class="value">
                                        <input 
                                            type="text" 
                                            v-model="formattedAmount" 
                                            class="form-control" 
                                            placeholder="Nhập giá trị..."
                                            :disabled="isViewDetail"
                                            @input="calculateTotalValue"
                                            @keydown="allowOnlyNumbers"
                                            min="0"
                                        >
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-12">
                                <div class="form-group">
                                    <div class="form-label bold">Thuế (VND)</div>
                                    <div class="value d-flex">
                                        <div class="form-check" style="margin-left: 15px;">
                                            <input 
                                                type="checkbox"
                                                v-model="formData.vat_flg" class="form-check-input"
                                                :disabled="isViewDetail"
                                                @change="calculateTotalValue"
                                                style="margin-right: 8px; border: 2px solid #999999; border-radius: 3px;"
                                            >
                                        </div>
                                        <input 
                                            v-if="formData.vat_flg" type="text" 
                                            :value="formatVNDDisplay(formData.amount_vat)" 
                                            class="form-control"
                                            placeholder="0"
                                            readonly
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6 col-12">
                                <div class="form-group">
                                    <div class="form-label bold">Ngày bắt đầu <required-marker/></div>
                                    <div class="value">
                                        <ejs-datepicker
                                            v-model="formData.startDate"
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
                            <div class="col-sm-6 col-12">
                                <div class="form-group">
                                    <div class="form-label bold">Ngày kết thúc <required-marker/></div>
                                    <div class="value">
                                        <ejs-datepicker
                                            v-model="formData.endDate"
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
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <div class="form-label bold">Trích yếu <required-marker/></div>
                                    <div class="value">
                                        <textarea 
                                            v-model="formData.data_revenue_name" 
                                            class="form-control" 
                                            placeholder="Nhập trích yếu..."
                                            :disabled="isViewDetail"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- Action buttons -->
                    <div class="group-buttons text-right" v-if="!isViewDetail">
                        <button class="btn btn-second nocorner" style="min-width: 100px;" @click="saveRevenue">
                            <span class="icon one-save"></span>&nbsp;{{ isAdd ? 'Tạo mới' : 'Cập nhật' }}
                        </button>
                        <button class="btn btn-primary nocorner" style="min-width: 100px;" @click="hideModal">
                            <span class="icon fa fa-times"></span>&nbsp;Hủy
                        </button>&nbsp;
                    </div>
                    <div class="group-buttons text-right" v-else>
                        <button class="btn btn-primary nocorner" style="min-width: 100px;" @click="hideModal">
                            <span class="icon fa fa-times"></span>&nbsp;Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import moment from 'moment';
export default {
    name: "ContractRevenueDetailModal",
    props: {
        isAdd: {
            type: Boolean,
            default: false
        },
        isViewDetail: {
            type: Boolean,
            default: false
        },
        revenueData: {
            type: Object,
            default: () => ({})
        },
        contractInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            animationSettings: { effect: 'Zoom', duration: 300 },
            target: 'body',
            
            formData: {},

            classificationOptions: [
                { id: 1, text: 'Thu một lần' },
                { id: 2, text: 'Thu định kỳ' }
            ],

            paymentPeriodOptions: [
                { id: 1, text: 'Tháng' },
                { id: 3, text: 'Quý' },
                { id: 6, text: '6 tháng' },
                { id: 12, text: 'Năm' }
            ]
        }
    },
    computed: {
        // Tạo tiêu đề modal dựa trên trạng thái (thêm mới/chỉnh sửa/xem chi tiết)
        header() {
            if (this.isAdd) return 'Tạo mới doanh thu';
            if (this.isViewDetail) return 'Xem chi tiết doanh thu';
            return 'Chỉnh sửa doanh thu';
        },

        // Kiểm tra tính hợp lệ của form trước khi submit
        isFormValid() {
            const baseValidation = this.formData.revenue_type_id &&
                this.formData.amount > 0 &&
                this.formData.data_revenue_name &&
                this.formData.data_revenue_name.trim() !== '';

            if (this.formData.revenue_type_id == 2) {
                return baseValidation && this.formData.period_number;
            }
            return baseValidation;
        },

        formattedAmount: {
        get() {
            if (this.formData.amount == null || isNaN(this.formData.amount) || this.formData.amount === 0) {
                return '';
            }
            return new Intl.NumberFormat('vi-VN').format(this.formData.amount);
        },
        set(newValue) {
            const rawValue = newValue.replace(/[^\d]/g, '');
            this.formData.amount = rawValue ? Number(rawValue) : 0;
        }
    }
    },
    // watch: {
    //     // // Theo dõi thay đổi loại doanh thu để tự động tạo tên hạng mục
    //     // 'formData.revenue_type_id'() {
    //     //     this.generateDataRevenueName();
    //     // },
        
    //     // // Theo dõi thay đổi số kỳ thanh toán để tự động tạo tên hạng mục
    //     // 'formData.period_number'() {
    //     //     this.generateDataRevenueName();
    //     // },
    // },
    methods: {
        // Hiển thị modal chi tiết doanh thu
        showModal() {
            this.$refs.popupRevenueDetail.show();
        },

        // Ẩn modal chi tiết doanh thu
        hideModal() {
            this.$refs.popupRevenueDetail.hide();
        },

        // Xử lý khi modal được mở - khởi tạo dữ liệu form
        handleShowModal() {
            this.initFormData();
        },

        // Khởi tạo dữ liệu form dựa trên trạng thái thêm mới hay chỉnh sửa
        initFormData() {
            if (this.isAdd) {
                this.formData = {
                    revenue_type_id: null,
                    period_number: null,
                    startDate: new Date(),
                    endDate: new Date(),
                    amount: 0,
                    vat_flg: false,
                    amount_vat: 0,
                    amount_total: 0,
                    // contract_summary: '',
                    data_revenue_name: ''
                };
            } else {
                this.formData = {
                    revenue_type_id: this.revenueData.revenueTypeId,
                    period_number: this.revenueData.periodNumber,
                    startDate: new Date(this.revenueData.startDate),
                    endDate: new Date(this.revenueData.endDate),
                    amount: this.revenueData.amount,
                    vat_flg: this.revenueData.vatFlg,
                    amount_vat: this.revenueData.amountVat,
                    amount_total: this.revenueData.amountTotal,
                    // contract_summary: this.revenueData.contractSummary,
                    data_revenue_name: this.revenueData.dataRevenueName,
                };
            }
            // this.generateDataRevenueName();
        },

        // Tính toán tổng giá trị bao gồm thuế VAT
        calculateTotalValue() {
            const value = parseFloat(this.formData.amount) || 0;
            
            if (this.formData.vat_flg) {
                this.formData.amount_vat = Math.round(value * 0.1);
            } else {
                this.formData.amount_vat = 0;
            }
            this.formData.amount_total = value + this.formData.amount_vat;
        },

        // Xử lý khi thay đổi phân loại doanh thu
        onClassificationChange() {
            if (this.formData.revenue_type_id == 1) {
                this.formData.period_number = null;
            }
        },

        // Chỉ cho phép nhập số 0-9
        allowOnlyNumbers(event) {
            if (!/[0-9]/.test(event.key) && 
                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) &&
                !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
            }
        },

        // Định dạng hiển thị số tiền theo chuẩn VND
        formatVNDDisplay(value) {
            if (typeof value !== 'number') return '0';
            return new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
            }).format(value);
        },
        validateDates() {
            // Lấy các giá trị cần thiết
            const type = this.formData.revenue_type_id;
            const revenueStart = this.formData.startDate;
            const revenueEnd = this.formData.endDate;

            // Luôn kiểm tra ngày kết thúc không được nhỏ hơn ngày bắt đầu
            if (revenueEnd < revenueStart) {
                return { isValid: false, message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.' };
            }

            // RÀNG BUỘC CHO "THU MỘT LẦN"
            if (type === 1) {
                // Kiểm tra xem ngày bắt đầu và kết thúc có phải là cùng một ngày không
                const isSameDay = revenueStart.getFullYear() === revenueEnd.getFullYear() &&
                                revenueStart.getMonth() === revenueEnd.getMonth() &&
                                revenueStart.getDate() === revenueEnd.getDate();
                
                if (!isSameDay) {
                    return { isValid: false, message: 'Ngày bắt đầu và kết thúc phải là cùng một ngày.' };
                }
            } 
            // RÀNG BUỘC CHO "THU ĐỊNH KỲ"
            else if (type === 2) {
                if (!this.contractInfo || !this.contractInfo.effectiveDate || !this.contractInfo.expiryDate) {
                    return { isValid: true, message: '' };
                }

                const contractStart = new Date(this.contractInfo.effectiveDate);
                const contractEnd = new Date(this.contractInfo.expiryDate);
                const revenueStart = new Date(this.formData.startDate);
                const revenueEnd = new Date(this.formData.endDate);

                // Chuẩn hóa tất cả về 00:00:00 giờ địa phương để so sánh chỉ phần NGÀY
                contractStart.setHours(0, 0, 0, 0);
                contractEnd.setHours(0, 0, 0, 0);
                revenueStart.setHours(0, 0, 0, 0);
                revenueEnd.setHours(0, 0, 0, 0);

                if (revenueStart < contractStart || revenueEnd > contractEnd) {
                    const formattedStart = moment(contractStart).format('DD/MM/YYYY');
                    const formattedEnd = moment(contractEnd).format('DD/MM/YYYY');
                    return { 
                        isValid: false, 
                        message: `Ngày bắt đầu và kết thúc phải nằm trong khoảng hiệu lực của hợp đồng (${formattedStart} - ${formattedEnd}).` 
                    };
                }
            }

            // Nếu tất cả điều kiện đều hợp lệ
            return { isValid: true, message: '' };
        },
        // Tự động tạo tên hạng mục doanh thu dựa trên loại và kỳ thanh toán
        // generateDataRevenueName() {
        //     const type = this.formData.revenue_type_id;
        //     const period = this.formData.period_number;

        //     if (type === 1) {
        //         this.formData.data_revenue_name = "Doanh thu hợp đồng thu một lần";
        //         return;
        //     }

        //     if (type === 2) {
        //         switch (period) {
        //             case 1:
        //                 this.formData.data_revenue_name = "Doanh thu hợp đồng định kỳ 1 tháng";
        //                 break;
        //             case 2:
        //                 this.formData.data_revenue_name = "Doanh thu hợp đồng định kỳ theo quý";
        //                 break;
        //             case 3:
        //                 this.formData.data_revenue_name = "Doanh thu hợp đồng định kỳ 6 tháng";
        //                 break;
        //             case 4:
        //                 this.formData.data_revenue_name = "Doanh thu hợp đồng định kỳ hằng năm";
        //                 break;
        //             default:
        //                 this.formData.data_revenue_name = '';
        //                 break;
        //         }
        //         return;
        //     }
        //     this.formData.data_revenue_name = '';
        // },

        // Lưu dữ liệu doanh thu và gửi về component cha
        async saveRevenue() {
            if (this.formData.revenue_type_id == 1) {
                this.formData.period_number = 1;
            }
            if (!this.isFormValid) {
                this.$toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
                return;
            }
            // this.generateDataRevenueName();
            // Kiểm tra tính hợp lệ của ngày bắt đầu và kết thúc
            const dateValidation = this.validateDates();
            if (!dateValidation.isValid) {
                this.$toast.error(dateValidation.message);
                return;
            }
            const payload = {
                ...this.formData,
                year: new Date(this.formData.startDate).getFullYear(),
            };

            // Nếu là thêm mới, thêm thông tin hợp đồng và dự án từ prop
            if (this.isAdd) {
                payload.contract_id = this.contractInfo.id;
                payload.project_id = this.contractInfo.projectId;
            }

            // Gửi dữ liệu đã hoàn chỉnh lên cho component cha
            this.$emit('successRevenue', payload);
        }
    }
}
</script>

<style src="../Contract.css" scoped> </style>
