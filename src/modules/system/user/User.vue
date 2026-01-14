<template>
     <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="page-content" style="top: 46px !important; bottom: 46px !important; padding: 6px !important;">
            <div class="row">
                 <div class="col-sm-3 col-12">
                    <div class="box-form">
                        <div class="legend-title">Thông tin tài khoản</div>

                        <span class="k category-text-detail">Nhóm quyền<i class="warning-input">*</i></span>
                        <select2  class="select2"  v-model="userInsert.role_id" :options="listRoles.map(e=>({id:e.role_id, text:e.role_name}))"></select2>

                        <k-input :textInput='"Username"' :isImportain="true"  @modelData ='changeDataInputUserName' :dataInput='userInsert.username'/>
                        <k-input :textInput='"Password"' :isImportain="true" @modelData ='changeDataInputPassword' :dataInput='userInsert.password'/>
                        <k-input :textInput='"Telegram Account"' :isImportain="false" @modelData ='changeDataInputTelegram' :dataInput ='userInsert.telegram_id'/>
                        <k-input :textInput='"Telegram Chat ID"' :isImportain="false" @modelData ='changeDataInputTelegramChatId' :dataInput ='userInsert.telegram_chat_id'/>
                        <span class="k category-text-detail">Tin chuông thông báo<i class="warning-input">*</i></span>
                        <select2  class="select2"  v-model="userInsert.show_notify" :options="listShowNotify"></select2>

                        <span class="k category-text-detail">Trạng thái<i class="warning-input">*</i></span>
                        <select2  class="select2"  v-model="status_selected" :options="listStatus"></select2>

                        <div class="info-row">
                            <div class="group-buttons center -bottom">
                                <button type="Submit" class="btn btn-second" style="min-width: 80px;" @click="insertUser()" v-show="isInsert" v-if="hasButtonPermission('inserUser')"> 
                                    <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
                                </button>
                                <button type="Submit" class="btn btn-second" style="min-width: 80px;" v-show="!isInsert" @click="updateUser()">
                                    <i class="fa fa-pencil" aria-hidden="true"></i> Update
                                </button>
                                <button type="Submit" class="btn btn-second" style="min-width: 80px;" :disabled='isDisabled' @click="refreshForm()"> 
                                    <i class="fa fa-refresh" aria-hidden="true" ></i> To insert
                                </button>
                                <button type="Submit" class="btn btn-second" style="min-width: 80px;" v-show="!isInsert" @click="deleteUser()"> 
                                    <i class="fa fa-refresh" aria-hidden="true" ></i> Delete
                                </button>
                            </div>
                        </div>

                    </div>
                    
                 </div>
                 <div class="col-sm-9 col-12">
                    <div class="box-form">
                        <div class="legend-title">Danh sách tài khoản</div>
                        <KDataGrid  
                            :columns ="colums"  
                            :allowFilter="true"  
                            :enable-paging-server="false" 
                            :dataSource = "listUsers"
                            :allowPaging="true"
                            :showFilter="true"
                            :showColumnCheckbox="false"
                            :enabledSelectFirstRow="false"
                            :allowSorting="true"
                            @onRowSelected="selectUser"
                            :commands="commands"
                            :commandColumn="{headerText: 'Chức năng',cellCssClass: 'css1', show: true, firstColumn:false, width:'130'}"
                            @commandClicked="commandClicked"
                        />
                    </div>
                    
                    
                 </div>
            </div>
        </div>
        <!-- <div class="k main-form">
            <div class="k category-left-form">
                    <div class="k category-form-title">
                        <h4 class="k category-title">Quản lý tài khoản</h4>
                    </div>
               
                    <div class="k category-body" >
                        <span class="k category-text-detail">Nhóm quyền<i class="warning-input">*</i></span>
                        <select2  class="select2"  v-model="userInsert.role_id" :options="listRoles.map(e=>({id:e.role_id, text:e.role_name}))"></select2>
                        <k-input :textInput='"Username"' :isImportain="true"  @modelData ='changeDataInputUserName' :dataInput='userInsert.username'/>
                        <k-input :textInput='"Password"' :isImportain="true" @modelData ='changeDataInputPassword' :dataInput='userInsert.password'/>
                        <k-input :textInput='"Telegram_ID"' :isImportain="false" @modelData ='changeDataInputTelegram' :dataInput ='userInsert.telegram_id'/>
                        <span class="k category-text-detail">Tin chuông thông báo<i class="warning-input">*</i></span>
                        <select2  class="select2"  v-model="userInsert.show_notify" :options="listShowNotify"></select2>
                    </div>
             
                    <div class="card-footer">
                        <button type="Submit" class="btn btn-primary" @click="insertUser()" v-show="isInsert" v-if="hasButtonPermission('inserUser')"> 
                            <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="updateUser()">
                            <i class="fa fa-pencil" aria-hidden="true"></i> Update
                        </button>
                        <button type="Submit" class="btn btn-primary" :disabled='isDisabled' @click="refreshForm()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> To insert
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="deleteUser()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> Delete
                        </button>
                    </div>
            </div>
            <div class="k category-right-form">
                <div class="k category-form-title">
                        <h4 class="k category-title">Danh sách tài khoản</h4>
                    </div>
                <div class="card">
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listUsers"
                        :allowPaging="true"
                        :showFilter="true"
                        :showColumnCheckbox="false"
                        :enabledSelectFirstRow="false"
                        :allowSorting="true"
                        @onRowSelected="selectUser"
                        :commands="commands"
                        :commandColumn="{headerText: 'Chức năng',cellCssClass: 'css1', show: true, firstColumn:false, width:'130'}"
                        @commandClicked="commandClicked"
                    />
                </div>
                
            </div>
        </div> -->
        <ejs-dialog
                ref='dialogObj'
                :allowDragging="true"
                :enableResize="false"
                :position="{X:'center', Y:'center'}"
                :visible="false"
                :showCloseIcon="true"
                width="40%"
                :header='"Cập nhật người dùng"'
                :isModal='true'>
                <div class="modal-content popup-box body-dialog">
                    <AccountCpn  @closeDialogUpdateAccount="closeDialogUpdateAccount" ref="account_ref"/>
                </div>
        </ejs-dialog>

    </div>
</template>

<script>
import UserApi from './UserApi.js';
import AccountCpn from './dialog/Account.vue';
export default {
    components:{
        // KTable,
        // FormInput
        AccountCpn
    },
    data(){
        return{
            listUsers:[],
            listRoles:[],
            isInsert:true,
            isDisabled:false,
            userInsert:{},
            // perUpdate:Object(),
            listShowNotify: [
                {
                    id: 1,
                    text: "Hiện thông báo"
                },
                {
                    id: 2,
                    text: "Ẩn thông báo"
                }
            ],
            listStatus:[
                {
                    id:1,
                    text:'Đang hoạt động'
                },
                {
                    id:2,
                    text:'Dừng hoạt động'
                },
            ],
            status_selected:1,
            colums:[
            {
                fieldName: "user_id",
                headerText: "ID",
                width:100
            },
            {
                fieldName: "username",
                headerText: "Username",
            },
            {
                fieldName: "role_id",
                headerText: "Nhóm quyền",
                allowFilter: true
            },
            {
                fieldName: "status_name",
                headerText: "Trạng thái",
                allowFilter: true
            }
            
            ],
            header: {
                title: "Quản lý người dùng",
                list: [
                ],
            },
            commands:[
                {
                    name: 'addAccount',
                    cssClass: 'btn btn-main -ap one-file-detail',
                    width: 40,
                    text: '',
                    title: 'Chi tiết',
                },
            ],
            user_id :0
        }
    },
    methods:{
        /**
         * get the list menus 
         * create by khanh 22/08/2022
         */
        async getListUsers(){
            try{
                this.listUsers = [];
				let response = await UserApi.getListUsers(this.axios)
				if(response.data.success){
					this.listUsers=response.data.data.map(x=>{
                        x.status_name=x.status==1?'Đang hoạt động':'Dừng hoạt động'
                        return x
                    });
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
         /**
         * get the list roles 
         * create by khanh 12/05/2024
         */
        async getRoles(){
            try{
                this.listUsers = [];
				let response = await UserApi.getRoles(this.axios)
				if(response.data.success){
					this.listRoles=response.data.data;
                   // this.loading(false);
                    if(response.data.data.length >0){
                        this.userInsert.role_id = response.data.data[0].role_id;
                    }
				}
				else{
					this.$toast.error(response.data.message);
                   // this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                //this.loading(false);
			}
        },
        /**
         * ondata change input tag
         * create by khanh 23/08/2022
         * 6 mothods change input text from insert
         */
        changeDataInputPassword(input){
            this.userInsert.password = input;
            console.log('input',input)
        },
        changeDataInputFullName(input){
            this.userInsert.full_name = input;
        },
        changeDataInputUserName(input){
            this.userInsert.username = input;
        },
        changeDataInputTelegram(input){
            this.userInsert.telegram_id = input;
        },
        changeDataInputTelegramChatId(input){
            this.userInsert.telegram_chat_id = input;
        },
        
        /**
         * insert the menu
         * create by khanh 22/08/2022
         */
        async insertUser(){
            try{
                if(this.userInsert.role_id == null || this.userInsert.role_id ==0 ){
                    this.$toast.warning("Vui lòng chọn nhóm quyền");
                    return;
                }
                if(this.userInsert.username == null || this.userInsert.username.length < 6){
                    this.$toast.warning("Username không được để trống và ít nhất 6 kí tự");
                    return;
                }
                if(this.userInsert.password == null || this.userInsert.password.length < 6){
                    this.$toast.warning("Password không được để trống và ít nhất 6 kí tự");
                    return;
                }
                if(!this.status_selected){
                    this.$toast.warning("Trạng thái hoạt động bắt buộc phải chọn");
                    return;
                }
                this.userInsert.status=this.status_selected
				let response = await UserApi.insertUser(this.axios,this.userInsert);
				if(response.data.success){
					this.listUsers=response.data.data.map(x=>{
                        x.status_name=x.status==1?'Đang hoạt động':'Dừng hoạt động'
                        return x
                    });
                    this.refreshForm();
                    this.$toast.success(response.data.message);
				}
				else{
					this.$toast.error(response.data.message)
				}
			}catch(e){
				this.$toast.error(e.message);
			}
        },
        /**
         * reset form 
         * create by khanh 23/08/2022
         */
        refreshForm(){
            this.userInsert = {};
            this.userInsert.role_id = this.listRoles.length>0 ? this.listRoles[0].role_id :0;
            this.isInsert = true;
        },
        /**
         * select the row of tables
         * create by khanh 23/08/2022
         */
         selectUser(data){
            this.userInsert = Object.assign({},data);
            this.isInsert = false;
            this.userInsert.password = "";

            this.status_selected=this.userInsert.status;
            // this.perInsert.position = this.perInsert.position.toString();
        },
        /**
         * update the permission
         * create by khanh 23/08/2022
         */
        async updateUser(){
            try{
                //
                this.userInsert.status=this.status_selected
                //
				let response = await UserApi.updateUser(this.axios,this.userInsert);
                this.listUsers = [];
				if(response.data.success){
					this.listUsers=response.data.data.map(x=>{
                        x.status_name=x.status==1?'Đang hoạt động':'Dừng hoạt động'
                        return x
                    });
                    this.$toast.success(response.data.message);
                    this.refreshForm();
				}
				else{
					this.$toast.error(response.data.message)
				}
			}catch(e){
				this.$toast.error(e.message);
			}
        },
         /**
         * delete the permission
         * create by khanh 23/08/2022
         */
        async deleteUser(){
            if(this.userInsert.user_id == 0){
                this.$toast.warning("Please select at least a row");
                return;
            };
            try{
                let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`)
                if(result==0) {
                    this.loading(false);
                    return;
                }
                else{
                    this.loading(true);
                    var response = await UserApi.deleteUser(this.axios,this.userInsert.user_id);
                    this.listUsers = [];
                    if(response.data.success){
                        this.listUsers=response.data.data.map(x=>{
                            x.status_name=x.status==1?'Đang hoạt động':'Dừng hoạt động'
                            return x
                        });
                        this.$toast.success(response.data.message);
                        this.loading(false);
                        this.refreshForm();
                    }
                    else{
                        this.$toast.error(response.data.message);
                    }
                    this.loading(false);   
                }
                this.loading(false);	
            }
            catch(e){
                this.$toast.error(e.message);
                this.loading(false);	
            }
        },
        /*
        Sự kiện thêm mới người dùng
        User-Account
        */
        async commandClicked(cmdName, rowData){
          if(cmdName=='addAccount'){
            // this.user_id = rowData.user_id;
            this.$refs.account_ref.getAccountByUser(rowData.user_id);
            this.$refs.dialogObj.show();
          }
        },
        closeDialogUpdateAccount(){
            this.$refs.dialogObj.hide();
        }
    },
    mounted(){
        this.loading(true)
        this.getListUsers();
        this.getRoles();
        this.userInsert.user_id =0;
        this.GetPermissionButtons();
    },
    created(){
        
    }
}
</script>

<style src="./User.css" scoped></style>