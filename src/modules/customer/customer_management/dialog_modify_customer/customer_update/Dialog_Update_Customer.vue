<template>
    <ejs-dialog
        ref='dialogUpdateCustomer'
        :allowDragging="true"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="isDialog"
        :showCloseIcon="true"
        width="50%"
        :header='"Cập nhật khách hàng"'
        :isModal='true'
        :open="handleShowModal"
        :close="closeDialog"
        >
        <div class="modal-content popup-box body-dialog">
            <div class="k form-dialog">
                <div class="k" style=" width:100%"> 
                    <div class="k col-lg-6 col-6 bd-it-form">
                        <div class="k bd-form-input">
                            <span class="k category-text-detail">Loại khách hàng:<i class="warning-input">*</i></span>
                            <select2 v-model="localCustomer.group_type_id" class="select2" :options="types.map(e=>({id:e.group_type_id, text:e.group_type_name}))"></select2>
                        </div>
                    </div>
                    <div class="k col-lg-6 col-6 bd-it-form">
                        <div class="k bd-form-input" v-if="localCustomer.group_type_id==1">
                            <k-input :textInput='"Tên khách hàng:"' :isImportain="true"  @modelData ='changeCustomerName' :dataInput ='localCustomer.customer_name'/>
                        </div>
                        <div style="display: flex; flex-direction: row;" v-if="localCustomer.group_type_id==2">
                            <div style="width: calc(100%/3);">
                                <div class="k bd-form-input">
                                    <k-input :textInput='"Họ:"' :isImportain="true"  @modelData ='changeCustomerLastName' :dataInput ='localCustomer.last_name'/>
                                </div>
                            </div>
                            <div style="width: calc(100%/3);">
                                <div class="k bd-form-input">
                                    <k-input :textInput='"Tên đệm:"' :isImportain="true"  @modelData ='changeCustomerMiddleName' :dataInput ='localCustomer.middle_name'/>
                                </div>
                            </div>
                            <div style="width: calc(100%/3);">
                                <div class="k bd-form-input">
                                    <k-input :textInput='"Tên:"' :isImportain="true"  @modelData ='changeCustomerFirstName' :dataInput ='localCustomer.first_name'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="k col-lg-6 col-6 bd-it-form">
                    <div class="k bd-form-input">
                        <k-input :textInput='"Mã nhận diện:"' :isImportain="false"  @modelData ='changeCustomerCode' :dataInput='localCustomer.code'/>
                    </div>
                </div>
                <div class="k col-lg-6 col-6 bd-it-form">
                    <div class="k bd-form-input">
                        <k-input :textInput='"Mã số thuế:"' :isImportain="false"  @modelData ='changeCustomerTaxCode' :dataInput='localCustomer.taxcode'/>
                    </div>
                </div>
                <div class="k" style=" width:100%"> 
                    <div class="k col-lg-6 col-6 bd-it-form" >
                        <div class="k bd-form-input">
                            <k-input :textInput='"SĐT liên hệ:"' :isImportain="false"  @modelData ='changeCustomerPhoneNumber' :dataInput='localCustomer.phone_number'/>
                        </div>
                    </div>
                    <div class="k col-lg-6 col-6 bd-it-form">
                        <div class="k bd-form-input">
                            <k-input :textInput='"Email:"' :isImportain="false"  @modelData ='changeCustomerEmail' :dataInput='localCustomer.email'/>
                        </div>
                    </div>
                </div>
                <div class="k" style=" width:100%"> 
                    <div class="k col-lg-6 col-6 bd-it-form" v-if="localCustomer.group_type_id==2">
                        <div class="k bd-form-input">
                            <span class="k category-text-detail">Ngày tháng năm sinh:<i class="warning-input">*</i></span>
                            <ejs-datepicker ref="fromDate" class="form-control bg-none bor0 fw6 text-red" placeholder="Chọn ngày"
                                :format="'dd/MM/yyyy'" :enabled="true" :showClearButton="false"
                                v-model="localCustomer.date_of_birth" :allowEdit="false" @change="changeBirthDay"/>
                        </div>
                    </div>
                    <div class="k col-lg-6 col-6 bd-it-form" v-if="localCustomer.group_type_id==2">
                        <div class="k bd-form-input">
                            <span class="k category-text-detail">Giới tính:<i class="warning-input">*</i></span>
                            <select2 v-model="localCustomer.gender"  class="select2" :options="listGender"></select2>
                        </div>
                    </div>
                </div>
                <div class="k" style=" width:100%"> 
                    <div class="k col-lg-6 col-6 bd-it-form">
                        <div class="k bd-form-input">
                            <k-input :textInput='"Địa chỉ:"' :isImportain="false"  @modelData ='changeCustomerAddress' :dataInput='localCustomer.address'/>
                        </div>
                    </div>
                    <div class="k col-lg-6 col-6 bd-it-form">
                        <div class="k bd-form-input">
                            <span class="k category-text-detail">Trạng thái:<i class="warning-input">*</i></span>
                            <select2 v-model="localCustomer.status_id" class="select2" :options="listStatus" @select="changeCustomerStatus"></select2>
                        </div>
                    </div>
                </div>
                <div class="k" style=" width:100%"> 
                    <div class="k col-lg-6 col-6 bd-it-form"  v-if="localCustomer.group_type_id==2">
                        <div class="k bd-form-input">
                            <span class="k category-text-detail">Tổ chức:</span>
                            <select2 v-model="localCustomer.person_detail.organization_id" class="select2" :options="listCustomerKHDN.map(e=>({id:e.customer_id, text:e.customer_name}))"></select2>
                        </div>
                    </div>
                    <div class="k col-lg-6 col-12 bd-it-form" v-if="localCustomer.group_type_id==2">
                        <div class="k bd-form-input" >
                            <k-input :textInput='"Chức vụ:"' :isImportain="false"  @modelData ='changeCustomerPosition' :dataInput='localCustomer.person_detail.current_position'/>
                        </div>
                    </div>
                </div>
                <div class="k col-lg-12 col-12 bd-it-form" v-if="localCustomer.group_type_id==1">
                    <div class="k bd-form-input" >
                        <span class="k category-text-detail">Cấp độ mối quan hệ:<i class="warning-input">*</i></span>
                        <select2 v-model="localCustomer.org_relationship.relationship_level"  class="select2" :options="listLevel"></select2>
                    </div>
                </div>
                <div class="k col-lg-12 col-12 bd-it-form" v-if="localCustomer.group_type_id==1">
                    <div class="k bd-form-input" >
                        <span class="k category-text-detail">Ghi chú cấp độ quan hệ:</span>
                        <textarea class='form-control text-relationship' rows="4" :value="localCustomer.org_relationship.notes" @change="e=>localCustomer.org_relationship.notes=e.target.value"/>
                    </div>
                </div>
                
                <div class="k form-button">
                    <button class="btn btn-outline-secondary button-update-account" @click="updateCustomer"  style="width: 120px">
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Cập nhật
                    </button>
                </div>
            </div>
        </div>
    </ejs-dialog>
    
    
</template>
<script>
import { createApp } from "vue";
import CustomerUpdateApi from '../../../CusomterApi.js';
import moment from "moment";

const app = createApp();
    export default{
        data(){
            return{
                editSettings: {
                    allowEditing: true,
                    mode:'Normal'
                },
                listCustomerCN: [],
                listCustomerKHDN: [],
                listGender: [{id: 1, text: 'Nam'},{id: 2, text: 'Nữ'},{id: 3, text: 'Khác'}],
                listStatus: [{id: 1, text: 'Đang hoạt động'},{id: 0, text: 'Dừng hoạt động'}],
                listLevel: [{id: 1, text: 'Giao dịch'}, {id: 2, text: 'Bạn bè'}, {id: 3, text: 'Tin tưởng'}, {id: 4, text: 'Đối tác'}],
                listPersonRelation: [{id: 1, text: 'Cha'}, {id: 2, text: 'Mẹ'}, {id: 3, text: 'Con'}, 
                    {id: 4, text: 'Anh'}, {id: 5, text: 'Chị'}, {id: 6, text: 'Họ hàng'}, 
                    {id: 7, text: 'Bạn học'}, {id: 8, text: 'Bạn xã hội'}, {id: 9, text: 'Khác - xem ghi chú'}],
                localCustomer: {}  // Shallow copy
            }
        },
        props:{
            dataSelected:{
                type:Object,
                default: () => {},
                required: true
            },
            isDialog:{
                type:Boolean,
                default:false,
                required: true
            },
            types:{
                type:Array,
                default:() => [],
                required: true
            },
        },
        computed:{},
        methods:{
            clearData() {
                this.localCustomer = {};
            },
            handleShowModal(){
                this.clearData();
                this.getListCustomer(1);
                this.getListCustomer(2);
                setTimeout(()=>{
                    this.localCustomer = this.dataSelected;
                    if (this.localCustomer.group_type_id == 2) {
                        this.localCustomer.date_of_birth = moment(this.localCustomer.date_of_birth).format('DD/MM/YYYY');
                    }
                },200)
            },
            closeDialog(){
                this.$emit('closeDialogUpdate');
            },
            
            disableEnterKey(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            },
            // get List Customer KHDN
            async getListCustomer(grouptype_id){
                try{
                    if (grouptype_id == 1) {
                        this.listCustomerKHDN = [];
                    } else if (grouptype_id == 2) {
                        this.listCustomerCN = [];
                    }
                    var input = {
                        grouptype_id: grouptype_id,
                        customer_id: 0
                    }
                    let response = await CustomerUpdateApi.getListCustomerForManagement(this.axios,input)
                    if(response.data.success){
                    if (response.data.data.length > 0) {
                        console.log(JSON.parse(response.data.data));
                        if (grouptype_id == 1) {
                            this.listCustomerKHDN = JSON.parse(response.data.data);
                        } else if (grouptype_id == 2) {
                            this.listCustomerCN = JSON.parse(response.data.data).filter(x => x.customer_id != this.localCustomer.customer_id);
                        }
                    }
                    this.loading(false);
                    }
                    else{
                    this.$toast.error(response.data.message);
                    this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
            validate(input) { 
                // ==== Regex định dạng ====
                const phoneRegex = /^[0-9]{10}$/;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const taxcodeRegex = /^\d{10}(-\d{3})?$/;

                // ==== Validate chung ====
                if (input.group_type_id == 1) {
                    if (!input.customer_name || input.customer_name.trim().length < 1) {
                        this.$toast.error("Tên khách hàng không được để trống");
                        return false;
                    }
                } else if (input.group_type_id == 2) {
                    if (!input.last_name || input.last_name.trim().length < 1) {
                        this.$toast.error("Họ không được để trống");
                        return false;
                    }

                    if (!input.middle_name || input.middle_name.trim().length < 1) {
                        this.$toast.error("Tên lót không được để trống");
                        return false;
                    }

                    if (!input.first_name || input.first_name.trim().length < 1) {
                        this.$toast.error("Tên không được để trống");
                        return false;
                    }
                }
                // if (!input.code || input.code.trim().length < 1) {
                //     this.$toast.error("Mã nhận diện không được để trống");
                //     return false;
                // }
                if (!input.group_type_id) {
                    this.$toast.error("Loại khách hàng không được để trống");
                    return false;
                }
                // if (!input.phone_number || input.phone_number.trim().length < 1) {
                //     this.$toast.error("SĐT liên hệ không được để trống");
                //     return false;
                // }
                // if (!phoneRegex.test(input.phone_number)) {
                //     this.$toast.error("Số điện thoại liên hệ phải đúng 10 chữ số");
                //     return false;
                // }
                // if (!input.taxcode || input.taxcode.trim().length < 1) {
                //     this.$toast.error("Mã số thuế không được để trống");
                //     return false;
                // }
                // if (!taxcodeRegex.test(input.taxcode)) {
                //     this.$toast.error("Mã số thuế không hợp lệ (10 số hoặc 10 số-3 số)");
                //     return false;
                // }
                // if (!input.email || input.email.trim().length < 1) {
                //     this.$toast.error("Email không được để trống");
                //     return false;
                // }
                // if (!emailRegex.test(input.email)) {
                //     this.$toast.error("Email không hợp lệ (phải chứa @ và .)");
                //     return false;
                // }
                // if (!input.address || input.address.trim().length < 1) {
                //     this.$toast.error("Địa chỉ không được để trống");
                //     return false;
                // }

                // ==== Validate riêng cho tổ chức ====
                if (input.group_type_id == 1) {
                    if (!input.org_relationship?.relationship_level) {
                        this.$toast.error("Cấp độ mối quan hệ không được để trống");
                        return false;
                    }
                    // Ghi chú có thể không bắt buộc => bỏ qua
                }

                // ==== Validate riêng cho cá nhân ====
                if (input.group_type_id == 2) {
                    if (!input.date_of_birth) {
                        this.$toast.error("Ngày tháng năm sinh không được để trống");
                        return false;
                    }
                    if (!input.gender) {
                        this.$toast.error("Giới tính không được để trống");
                        return false;
                    }
                    // Quê quán, mối quan hệ cá nhân, ghi chú có thể optional
                }

                return true;
            },
            //cập nhật lại KH
            async updateCustomer(){
                if (!this.validate(this.localCustomer)) return;
                if (this.localCustomer.group_type_id == 2) {
                    this.localCustomer.customer_name = this.localCustomer.last_name.trim() + ' ' + this.localCustomer.middle_name.trim() + ' ' + this.localCustomer.first_name.trim();
                    this.localCustomer.date_of_birth = moment(this.localCustomer.date_of_birth,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00')
                }
                
                var rq = {
                    customer: this.localCustomer,
                    customer_detail: this.localCustomer?.person_detail?.organization_id ? this.localCustomer?.person_detail : null,
                    person_relationship: this.localCustomer?.person_relationship?.personal_profile ? this.localCustomer?.person_relationship : null,
                    org_relationship: this.localCustomer?.org_relationship?.relationship_level ? this.localCustomer?.org_relationship : null
                };
                try{
                    let response = await CustomerUpdateApi.updateCustomer(this.axios,rq);
                    if(response.data.success){
                        this.$toast.success("Cập nhật thành công");
                        this.$refs.dialogUpdateCustomer.hide();
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
          
            // thay đổi input
            changeCustomerName(data){
                this.localCustomer.customer_name = data;
            },
            changeCustomerLastName(data){
                this.localCustomer.last_name = data;
            },
            changeCustomerMiddleName(data){
                this.localCustomer.middle_name = data;
            },
            changeCustomerFirstName(data){
                this.localCustomer.first_name = data;
            },
            changeCustomerCode(data){
                this.localCustomer.code = data;
            },
            changeCustomerPhoneNumber(data){
                this.localCustomer.phone_number = data;
            },
            changeCustomerTaxCode(data){
                this.localCustomer.taxcode = data;
            },
            changeCustomerEmail(data){
                this.localCustomer.email = data;
            },
            changeCustomerAddress(data){
                this.localCustomer.address = data;
            },
            changeCustomerStatus(){
                this.localCustomer.active = this.localCustomer.status_id == 1 ? true : false;
            },
            changeBirthDay(event){
                this.localCustomer.date_of_birth = moment(event.value).format('DD/MM/YYYY')
            },
            changeCustomerPosition(data){
                this.localCustomer.person_detail.current_position = data;
            },
            // gọi component để load lại data
            refeshData(data){
                this.$emit('refeshData', data);
            },
        },
        created(){
        },
        mounted() {},
        watch: {
            // dataSelected: {
            //     handler(newVal) {
            //         this.localCustomer = newVal; // hoặc dùng lodash cloneDeep
            //         console.log(this.localCustomer)
            //     },
            //     immediate: true,
            //     deep: true // nếu cần theo dõi object lồng nhau
            // }
        }
    }
</script>
<style src="./Dialog_Update_Customer.css" scoped></style>