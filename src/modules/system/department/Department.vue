<template>
 <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k main-form">
            <div class="k category-left-form">
                    <div class="k category-form-title">
                        <h4 class="k category-title">Quản lý phòng ban</h4>
                    </div>
                    <!-- insert menu -->
                    <div class="k category-body" >
                        <span class="k category-text-detail">Loại đơn vị<i class="warning-input">*</i></span>
                        <select2  class="select2" @select="onChangeInput(0)" v-model="department.dep_type_id" :options="listTypeDep.map(e=>({id:e.dep_type_id, text:e.name}))"></select2>
                        <span class="k category-text-detail">Đơn vị cha<i class="warning-input">*</i></span>
                        <select2  class="select2" @select="onChangeInput(1)" v-model="department.parent_id" :options="listParentDepartments.map(e=>({id:e.department_id, text:e.name}))"></select2>
                        <k-input :textInput='"Tên đơn vị"' :isImportain="true"  @modelData ='changeDataInputDepname' :dataInput='department.name'/>
                        <!-- <k-input :textInput='"Password"' :isImportain="true" @modelData ='changeDataInputPassword' :dataInput ='userInsert.password'/>
                        <k-input :textInput='"FullName"' :isImportain="true" @modelData ='changeDataInputFullName' :dataInput='userInsert.full_name'/> -->
                    </div>
                    <!--update-->
                    <div class="card-footer">
                        <button type="Submit" class="btn btn-primary" @click="insertDepartment()" v-show="isInsert"> 
                            <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="updateDepartment()">
                            <i class="fa fa-plus" aria-hidden="true"></i> Update
                        </button>
                        <button type="Submit" class="btn btn-primary" :disabled='isDisabled' @click="refreshForm()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> To insert
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="deleteDepartment()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> Delete
                        </button>
                    </div>
            </div>
            <div class="k category-right-form">
                <div class="k category-form-title">
                    <h4 class="k category-title">Danh sách phòng ban</h4>
                </div>
                <!-- ==================== -->
                <div class="k form-center bd-form-center">
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listParentDepartments"
                        :allowPaging="true"
                        :showFilter="true"
                        :showColumnCheckbox="false"
                        :enabledSelectFirstRow="false"
                        :allowSorting="true"
                        @onRowSelected="selectDepartment"
                        :commands="commands"
                    />
                    
                </div>
                <!-- ==================== -->
                <div class="k form-center">
                    <div class="k category-center-form">
                        <ul class="k tree-main" >
                            <li>
                                <!-- <summary>Viễn thông TP.HCM</summary> -->
                                <summary>Viễn thông Đồng Nai</summary>
                                <ul class="k tree">
                                    <li open v-for="(dep,index) in listDepartment" :key="index">
                                        <details>
                                            <summary @click="selectDepartment(dep)">{{ dep.name }}</summary>
                                            <ul>
                                                <li v-for="(dep_lv1,index1) in dep.child" :key="index1">
                                                    <details>
                                                        <summary class="tree-summary-second"  @click="selectDepartment(dep_lv1)" >{{ dep_lv1.name }}</summary>
                                                        <ul>
                                                            <li class="tree-summary-second-li" v-for="(dep_lv2,index2) in dep_lv1.child" :key="index2" @click="selectDepartment(dep_lv2)">{{ dep_lv2.name }}</li>
                                                        </ul>
                                                    </details>
                                                </li>
                                            </ul>
                                        </details>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- ==================== -->
            </div>
           
        </div>
 </div>
</template>

<script>
import Department from './DepartmentAPI.js';
export default {
    data() {
        return{
            header: {
                title: "Danh mục phòng ban",
                list: [
                ],
            },
            department:{
                name:"",
                parent_id:0,
                dep_type_id:0
            },
            listDepartment:[],
            listParentDepartments:[],
            listTypeDep:[],
            listTypeDepBK:[],
            isInsert:true,
            isDisabled : true,
            colums:[
                {
                    fieldName: "dep_type_id",
                    headerText: "ID",
                    width: 40,
                },
                {
                    fieldName: "name",
                    headerText: "Tên đơn vị",
                }
            ]
        }   
    },
    methods:{
        //select dep
        selectDepartment(data){
            this.department = data;
            this.isInsert= false;
            this.isDisabled= false;
        },
        //get type in local
        async getTypeOfDep(){
            try{
                this.listUsers = [];
				let response = await Department.getTypeOfDep(this.axios)
				if(response.data.success){
					this.listTypeDep=response.data.data;
                    if(this.listTypeDep.length>0){
                        this.department.dep_type_id = this.listTypeDep[0].dep_type_id;
                    }
                    this.loading(false);
                    this.listTypeDepBK = [].concat(this.listTypeDep);
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
        //get department
        async getDepartments(){
            try{
                this.listDepartment = [];
                this.listParentDepartments = [];
				let response = await Department.getDepartments(this.axios)
				if(response.data.success){
					this.binddingDepartment(response.data.data);
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
        //get department
        async getDepartmentForTables(){
            try{
                this.listDepartmentForTables = [];
				let response = await Department.getDepartmentForTables(this.axios)
				if(response.data.success){
					this.listDepartmentForTables = response.data.data;
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
        //bidding data
        binddingDepartment(data){
            this.listDepartment = [].concat(data);
            if(data.length>0){
                this.listParentDepartments = [].concat(data).filter(m=>m.dep_type_id<=3);
                data.forEach(element => {
                    if(element.child.length>0){
                    this.listParentDepartments =this.listParentDepartments.concat(element.child.filter(m=>m.dep_type_id<=3));
                }  
                });
            }
            else{
                this.department.parent_id = 0;
            }
            this.listParentDepartments.unshift({
                name:'Không có đơn vị cha',
                department_id: 0,
                dep_type_id : 1
            });
        },
        //change input
        changeDataInputDepname(data){
            this.department.name = data;
        },
        //insert department
        async insertDepartment(){
            try{
                if(this.department.name.length<1){
                    this.$toast.error("Vui lòng điền đầy đủ thông tin");
                    return;
                }
				let response = await Department.insertDepartment(this.axios,this.department)
				if(response.data.success){
                    this.listDepartment = [];
                    this.listParentDepartments = [];
					this.binddingDepartment(response.data.data);
                    this.loading(false);
                    this.refreshForm();
                    this.$toast.success(response.data.message);
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
         //update department
         async updateDepartment(){
            try{
                if(this.department.name.length<1){
                    this.$toast.error("Vui lòng điền đầy đủ thông tin");
                    return;
                }
				let response = await Department.updateDepartment(this.axios,this.department)
				if(response.data.success){
                    this.listDepartment = [];
                    this.listParentDepartments = [];
					this.binddingDepartment(response.data.data);
                    this.loading(false);
                    this.refreshForm();
                    this.$toast.success(response.data.message);
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
        //refresh from
        refreshForm(){
            this.department = {
                name:"",
                parent_id:1,
                dep_type_id:1
            }
            this.isInsert= true;
            this.isDisabled= true;
        },
        //chage unit 
        async onChangeInput(type){
            if(type == 0)
            { 
                this.listParentDepartments = [].concat(this.listDepartment).filter(m=>m.dep_type_id == this.department.dep_type_id-1);
                this.listDepartment.forEach(element => {
                    if(element.child.length>0){
                        this.listParentDepartments =this.listParentDepartments.concat(element.child.filter(m=>m.dep_type_id== this.department.dep_type_id -1));
                    }
                    if(this.listParentDepartments.length>0){
                        this.department.parent_id = element.department_id;
                    }
                    else{
                        this.listParentDepartments.push({
                            name:'Không có đơn vị cha',
                            department_id: 0,
                            dep_type_id : 1
                        });
                        this.department.parent_id = element.department_id;
                    }
                });
            }
            else
            {
                
            }
        },
        //delete
        async deleteDepartment(data){
            let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`);
            if(result==0) {
                this.loading(false);
                return;
            }
            let response = await Department.deleteDepartment(this.axios,this.department.department_id)
			if(response.data.success){
                this.$toast.success(response.data.message);
                this.binddingDepartment(response.data.data);
            }
            else{
                this.$toast.error(response.data.message);
            }
        },
    },
    created(){
        this.loading(true);
        this.getTypeOfDep();
        this.getDepartments();
        this.getDepartmentForTables();
    }
}
</script>
<style src="./Department.css" scoped></style>