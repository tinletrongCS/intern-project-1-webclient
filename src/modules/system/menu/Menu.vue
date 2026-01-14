<template>
     <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k main-form">
            <div class="k category-left-form">
                    <div class="k category-form-title">
                        <h4 class="k category-title">Quản lý quyền người dùng</h4>
                    </div>
                    <!-- insert menu -->
                    <div class="k category-body" id="fomrUser">
                        <div class="k" style="width:100%">
                            <span class="k category-text-detail">Loại quyền<i class="warning-input">*</i></span>
                            <select class="k category-select-tag" v-model='perInsert.permission_type_id' @change="changeTypePer">
                                <option value=1>Menu</option>
                                <option value=2>Button</option>
                            </select>
                        </div>
                        <div class="k" style="width:100%" v-if="perInsert.permission_type_id==1">
                            <span class="k category-text-detail">Menu cha<i class="warning-input">*</i></span>
                            <select2 v-model='perInsert.parent_id'  :options="listMenus.filter(e => e.parent_id == 0 || listMenus.some(p => p.parent_id == 0 && p.per_id == e.parent_id)).map(e=>({id:e.per_id, text:(e.per_name +'(perent_id:'+ e.parent_id+ ')')}))"></select2>
                        </div>
                        
                        <div class="k" style="width:100%"  v-if="perInsert.permission_type_id==2">
                            <span class="k category-text-detail">Menu hiển thị button<i class="warning-input">*</i></span>
                            <select2 v-model="perInsert.menu_id"  :options="listMenus.filter(e => e.parent_id != 0).map(e=>({id:e.per_id, text:(e.per_name +'(perent_id:'+ e.parent_id+ ')') }))"></select2>
                        </div>


                        <k-input :textInput='perInsert.permission_type_id==1?"Tên menu":"Tên quyền người dùng"' :isImportain="true"  @modelData ='changeDataInputPerName' :dataInput= 'perInsert.per_name'/>
                        <k-input :textInput='"Vị trí"' :typeInput="'number'" @modelData ='changeDataInputPos' :dataInput= 'perInsert.position'/>
                        <k-input :textInput='"Tên tiếng Anh"' :isImportain="true" @modelData ='changeDataInputNameEn' :dataInput ='perInsert.en_per'/>
                        <k-input :textInput='"Tên tiếng Việt"' :isImportain="true" @modelData = 'changeDataInputNameVn' :dataInput ='perInsert.vn_per'/>
                        <k-input v-show='perInsert.permission_type_id == 1' :textInput='"Đường dẫn"'  :isImportain="true" @modelData = 'changeDataInputNameLink' :dataInput ='perInsert.link'/>
                        <k-input :textInput='"Quyền"' :isImportain="true" @modelData = 'changeDataInputNamePolicy' :dataInput ='perInsert.policy'/>
                        <k-input :textInput='"Ghi chú"' @modelData = 'changeDataInputNameNote' :dataInput ='perInsert.note'/>
                        <k-input :textInput='"Icon"' @modelData = 'changeDataInputNameIcon' :dataInput ='perInsert.icon'/>
                        
                        <div class="k" style="width:100%"  v-if="perInsert.permission_type_id==1">
                            <span class="k category-text-detail">Dialog</span>
                            <input class="check"
                                v-model="perInsert.is_dialog"
                                type="checkbox"
                            />
                        </div>
                        
                    </div>
                    <!--update-->
                    <div class="card-footer">
                        <button type="Submit" class="btn btn-primary" @click="insertPermision()" v-show="isInsert"> 
                            <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="updatePermision()">
                            <i class="fa fa-plus" aria-hidden="true"></i> Update
                        </button>
                        <button type="Submit" class="btn btn-primary" :disabled='isDisabled' @click="refreshForm()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> Trả về form tạo mới
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="deletePermission()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> Delete
                        </button>
                    </div>
            </div>
            <div class="k category-right-form">
                <div class="k category-form-title">
                        <h4 class="k category-title">Danh sách quyền người dùng</h4>
                    </div>
                <div class="card">
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listMenus"
                    :allowPaging="true"
                    :showFilter="true"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                    @onRowSelected="selectPermission"
                    />
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import MenuApi from './PermissionApi';
export default {
    components:{
        // KTable,
        // FormInput
    },
    data(){
        return{
            listMenus:[],
            isInsert:true,
            isDisabled:false,
            perInsert:{
                link: "",
                per_name: "",
                policy: "",
                position: 0,
                parent_id:0,
                per_id:0,
                vn_per:'',
                en_per:'',
                icon:"",
                note:'',
                menu_id:0,
                permission_type_id:1 //menu
            },
            perUpdate:Object(),
            colums:[{
                fieldName: "per_name",
                headerText: "Tên quyền",
            },
            {
                fieldName: "policy",
                headerText: "Phân quyền",
                allowFilter: true
            },
            {
                fieldName: "link",
                headerText: "Link",
                allowFilter: true
            },
            {
                fieldName: "en_per",
                headerText: "Tên tiếng Anh",
                allowFilter: true
            },
             {
                fieldName: "vn_per",
                headerText: "Tên tiếng Việt",
                allowFilter: true
            },
            {
                fieldName: "position",
                headerText: "Vị trí",
                allowFilter: true
            }
            
            ],
            position:"Vị trí",
            header: {
                title: "Quản lý quyền người dùng",
                list: [
                ],
            }
        }
    },
    methods:{
        /**
         * get the list menus 
         * create by khanh 22/08/2022
         */
        async getListMenu(){
            try{
                this.listMenus = [];
				let response = await MenuApi.getMenuForManage(this.axios)
				if(response.data.success){
					this.listMenus=response.data.data;
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
         * ondata change input tag
         * create by khanh 23/08/2022
         * 6 mothods change input text from insert
         */
        changeDataInputPos(input){
            this.perInsert.position = input;
        },
        changeDataInputPerName(input){
            this.perInsert.per_name = input;
        },
        changeDataInputNameEn(input){
            this.perInsert.en_per = input;
            
        },
        changeDataInputNameVn(input){
            this.perInsert.vn_per = input;
        },
        changeDataInputNameLink(input){
            this.perInsert.link = input;
        },
        changeDataInputNamePolicy(input){
            this.perInsert.policy = input;
        },  
        changeDataInputNameNote(input){
            this.perInsert.note = input;
        },
        changeDataInputNameIcon(input){
            this.perInsert.icon = input;
        },
        /**
         * insert the menu
         * create by khanh 22/08/2022
         */
        async insertPermision(){
            try{
                if(this.perInsert.per_name.length<1){
                    this.$toast.error("Vui lòng nhập đầy đủ thông tin trường " + (this.perInsert.permission_type_id ==1?"Tên menu":"Tên quyền người dùng"))
                    return;
                }
                if(this.perInsert.policy.length<1){
                    this.$toast.error("Vui lòng nhập đầy đủ thông tin trường Quyền")
                    return;
                }
                if(this.perInsert.vn_per.length<1){
                    this.$toast.error("Vui lòng nhập đầy đủ thông tin trường Tên tiếng Việt")
                    return;
                }
                if(this.perInsert.en_per.length<1){
                    this.$toast.error("Vui lòng nhập đầy đủ thông tin trường Tên tiếng Anh")
                    return;
                }
                if(this.perInsert.link.length<1 && this.perInsert.permission_type_id == 1){
                    this.$toast.error("Vui lòng nhập đầy đủ thông tin trường Đường dẫn")
                    return;
                }
                if(this.perInsert.permission_type_id == 2 && this.perInsert.menu_id == 0){
                    this.$toast.error("Vui lòng chọn menu của button")
                    return;
                }
                // console.log('this.perInsert',this.perInsert);return;

                this.perInsert.permission_type_id = parseInt(this.perInsert.permission_type_id);
				let response = await MenuApi.insertPermission(this.axios,this.perInsert);
                this.listMenus= [];
				if(response.data.success){
					this.listMenus = response.data.data;
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
            this.perInsert = {
                link: "",
                per_name: "",
                policy: "",
                position: 0,
                parent_id:0,
                per_id:0,
                vn_per:'',
                en_per:'',
                icon:"",
                note:''
            };
            this.perInsert.parent_id = 0;
            this.isInsert = true;
        },
        /**
         * select the row of tables
         * create by khanh 23/08/2022
         */
        selectPermission(data){
            console.log('select',data)
            this.perInsert = Object.assign({},data);
            this.isInsert = false;
            // this.perInsert.position = this.perInsert.position.toString();
        },
        /**
         * update the permission
         * create by khanh 23/08/2022
         */
        async updatePermision(){
            try{
                this.perInsert.active = 1;
				let response = await MenuApi.updatePermision(this.axios,this.perInsert);
                this.listMenus = [];
				if(response.data.success){
					this.listMenus=response.data.data;
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
        async deletePermission(){
            
                if(this.perUpdate.per_id == 0){
                    this.$toast.warning("Please select at least a row");
                    return;
                };
                let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`)
                if(result==0) {
                    return;
                }
                else{
                    this.loading(true);
                    
                    var response = await MenuApi.deletePermission(this.axios,this.perInsert.per_id);
                    this.listMenus = [];
                    if(response.data.success){
                        this.listMenus = response.data.data;
                        this.$toast.success(response.data.message);
                        this.loading(false);
                        this.refreshForm();
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.getListMenu();
                    }
                    this.loading(false);
                        
                }
                this.loading(false);
				
        },
        changeTypePer(){
            this.perInsert.permission_type_id = parseInt(this.perInsert.permission_type_id);
            console.log(this.perInsert)
        }
    },
    mounted(){
        this.getListMenu();
        this.perInsert.perid =0;
    },
    created(){
    }
}
</script>

<style src="./Menu.css" scoped></style>