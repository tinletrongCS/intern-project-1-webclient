<template>
    <div class="k body-input-account">
        <div class="k row-bd-input">
            <div class="k bd-form-input">
                <k-input :textInput='"Họ và tên đệm"' :isImportain="true"  @modelData ='changeDataInputLastName' :dataInput='account.last_name'/>
            </div>
            <div class="k bd-form-input">
                <k-input :textInput='"Tên"' :isImportain="true"  @modelData ='changeDataInputFirstName' :dataInput='account.first_name'/>
            </div>
        </div>
        <div class="k row-bd-input">
            <div class="k bd-form-input">
                <span class="k category-text-detail">Ngày sinh<i class="warning-input">*</i></span>
                <div class="value">
                    <!-- <ejs-datetimepicker 
                        v-model="account.birthday" 
                        :value="account.birthday"  
                        @change="onChangeBirthDay($event)" 
                        format='"dd/MM/yyyy"'>
                    </ejs-datetimepicker> -->
                    <ejs-datepicker
                        v-model="account.birthday" 
                        class="form-control"
                        :showClearButton="false" 
                        :allowEdit="false"
                        :strict-mode="true" 
                        locale="vi"
                        @change="onChangeBirthDay($event)" 
                        placeholder="Chọn ngày sinh"
                        :format="'dd/MM/yyyy'">
                    </ejs-datepicker>
                </div>
            </div>
            <div class="k bd-form-input">
                <k-input :textInput='"Email"' :isImportain="true"  @modelData ='changeDataInputEmail' :dataInput='account.email'/>
            </div>
        </div>
        <div class="k row-bd-input">
            <div class="k bd-form-input">
                <span class="k category-text-detail">Nơi ở(Tỉnh)<i class="warning-input">*</i></span>
                <select2  class="select2" @select="onChangeProvince"   v-model="account.province_id" :options="listProvinces.map(e=>({id:e.province_id, text:e.full_name}))"></select2>
            </div>
            <div class="k bd-form-input">
                <span class="k category-text-detail">Nơi ở(Xã/Phường/Đặc khu)<i class="warning-input">*</i></span>
                <select2  class="select2"  v-model="account.ward_id" :options="listWards.map(e=>({id:e.ward_id, text:e.full_name}))"></select2>
            </div>
        </div>
        <div class="k row-bd-input">
             <div class="k bd-form-input">
                <k-input :textInput='"SĐT"' :typeInput = "'Number'" :isImportain="false"  @modelData ='changeDataInputPhone' :dataInput='account.phone'/>
            </div>
            <div class="k bd-form-input">
                <k-input :textInput='"Số nhà/Đường"' :isImportain="false"  @modelData ='changeDataInputStress' :dataInput='account.address'/>
            </div>
        </div>
        <div class="k row-bd-input">
           
            <div class="k bd-form-input">
                <span class="k category-text-detail">Giới tính<i class="warning-input">*</i></span>
                <select2  class="select2"  v-model="account.gender" :options="genders.map(e=>({id:e.id, text:e.text}))"></select2>
            </div>
            <div class="k bd-form-input">
                <span class="k category-text-detail">Chức danh công việc<i class="warning-input">*</i></span>
                <select2  class="select2"  v-model="account.jobposition_id" :options="listJobPositions.map(e=>({id:e.jobposition_id, text:e.jobposition_name}))"></select2>
            </div>
        </div>
        <div class="k row-bd-input">
            <div class="k bd-form-input" style="width: 100%;">
                <span class="k category-text-detail">Đơn vị<i class="warning-input">*</i></span>
                <select2  class="select2"  v-model="account.department_id" :options="listDepartments.map(e=>({id:e.department_id, text:e.name}))"></select2>
            </div>
        </div>
        <div class="group-buttons -bottom center">
            <button class="btn btn-outline-secondary button-update-account" @click="insertAccount"  style="width: 120px">
            Cập nhật
            </button>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import AccountApi from './AccountApi.js';
    export default{
        data(){
            return{
                account:{
                    birthday:moment().format('DD/MM/YYYY') ,
                    gender:0,
                    first_name:"",
                    last_name:"",
                    phone:"",
                    address:"",
                    email:"",
                    department_id:0,
                    province_id:0,
                    ward_id:0
                },
                listProvinces:[],
                listDisctricts:[],
                listWards:[],
                genders:[{id:1,text:"Nữ"},{id:0,text:"Nam"}],
                listDepartments:[],
                listJobPositions:[]
            }
        },
        methods:{
            changeDataInputFirstName(data){
                this.account.first_name = data;
            },
            changeDataInputLastName(data){
                this.account.last_name = data;
            },
            changeDataInputEmail(data){
                this.account.email = data;
            },
            changeDataInputStress(data){
                this.account.address = data;
            },
            changeDataInputPhone(data){
                this.account.phone = data;
            },
            //get provinces
            async getProvinces(){
                try{
                    this.listUsers = [];
                    let response = await AccountApi.getProvinces(this.axios)
                    if(response.data.success){
                        this.listProvinces=response.data.data;
                        this.loading(false);
                        if(response.data.data.length>0){
                            this.getWards(response.data.data[0].province_id,0);
                            this.account.province_id = response.data.data[0].province_id;
                        }
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
            //change the provinces
            onChangeProvince(){
                this.getWards(this.account.province_id);
            },
            //get wards
            async getWards(province_id){
                try{
                    if(province_id == null){
                        return;
                    }
                    this.listUsers = [];
                    let response = await AccountApi.getWards(this.axios,province_id)
                    if(response.data.success){
                        this.listWards=response.data.data;
                        this.loading(false);
                        if(response.data.data.length>0){
                            this.account.ward_id = response.data.data[0].ward_id;
                        }
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
            // change birthday
            onChangeBirthDay(event){
                if (event && event.value) {
                this.account.birthday = moment(event.value).format('DD/MM/yyyy');
            }
            },
            //get department
            async getDepartments(){
                try{
                    let response = await AccountApi.getDepartmentForAccount(this.axios);
                    if(response.data.success){
                        this.listDepartments  = response.data.data;
                        this.loading(false);
                        if(this.listDepartments.length>0){
                            this.account.department_id = response.data.data[0].department_id;
                        }
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
            //get job possiton
            async getJobPositions(){
                try{
                    this.listJobPositions = [];
                    let response = await AccountApi.getJobPositions(this.axios);
                    if(response.data.success){
                        this.listJobPositions  = response.data.data;
                        this.loading(false);
                        if(this.listJobPositions.length>0){
                            this.account.jobposition_id = response.data.data[0].jobposition_id;
                        }
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
            //insert the account
            async insertAccount(){
                try{
                    
                    if(!this.checkInput(this.account.first_name) || !this.checkInput(this.account.last_name) ||  !this.checkInput(this.account.email) || !this.account.jobposition_id || !this.account.department_id)
                    {
                        this.$toast.error("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc");
                        return;
                    }
                    this.account.jobposition_id = parseInt(this.account.jobposition_id);
                    this.account.province_id = parseInt(this.account.province_id);
                    this.account.ward_id = parseInt(this.account.ward_id);
                    var acc = Object.assign({}, this.account);
                    
                    acc.department_id = parseInt(this.account.department_id);
                    this.account.birthday =  this.account.birthday.toString();
                    
                    this.account ={};
                    let response = await AccountApi.insertAccount(this.axios,acc);
                    if(response.data.success){
                        this.account  = response.data.data;
                        this.loading(false);
                        // if(this.listJobPositions.length>0){
                        //     this.account.jobposition_id = response.data.data.jobposition_id;
                        // }
                        this.$toast.success(response.data.message);
                        this.$emit('closeDialogUpdateAccount');
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                        this.account = Object.assign({}, acc);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                    this.account.birthday = moment().format('DD/MM/yyyy');
                }
            },
            checkInput(input){
                if(input.length<1){
                    return false;
                }
                return true;
            },
            //get the account by the user_id
            async getAccountByUser(user_id){
                try{
                    this.account.user_id  = user_id;
                    let response = await AccountApi.getAccountByUser(this.axios,user_id);
                    // this.account = {};
                    if(response.data.success ){
                        if(response.data.data != null){
                            await this.getWards(response.data.data.province_id);
                            this.account = Object.assign({}, response.data.data);
                        }
                        else{
                            this.account= {
                                birthday:moment().format('DD/MM/YYYY') ,
                                gender:0,
                                first_name:"",
                                last_name:"",
                                phone:"",
                                address:"",
                                email:"",
                                department_id:0,
                                province_id:0,
                                ward_id:0
                            };
                        }
                        this.loading(false);
                    }
                    else{
                        // this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
        },
        
        created(){
            this.getProvinces();
            this.getDepartments();
            this.getJobPositions();
            // this.account.user_id = this.userID;
            
        },
        mounted(){
            
        },
        props:{
            userID:{
                type:Number,
                default:0,
                required: true
            }
        },

    }
</script>
<style src="./Account.css" scoped></style>