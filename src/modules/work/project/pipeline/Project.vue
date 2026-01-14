<template>
     <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k main-form">
            <div class="k category-left-form">
                    <!-- insert menu -->
                    <div class="k category-body" id="fomrUser">
                        <k-input :textInput='"Tên dịch vụ"' :isImportain="true"   @modelData ='changeDataInputNamePj' :dataInput='ProjectInsert.project_name'/>
                        <!-- <k-input :textInput='"Ngày bắt đầu"' :typeInput="'date'" @modelData ='changeDataInputStartDay' :dataInput='ProjectInsert.start_day'/> -->
                        <span class="k category-text-detail">Ngày bắt đầu</span>
                        <ejs-datetimepicker :value="ProjectInsert.start_day" :format='dateFormat'></ejs-datetimepicker>
                        <!-- <k-input :textInput='"Ngày kết thúc"' :typeInput="'date'" @modelData ='changeDataInputEndDay' :dataInput ='ProjectInsert.end_day'/> -->
                        <span class="k category-text-detail">Ngày  kết thúc</span>
                        <ejs-datetimepicker :value="ProjectInsert.end_day" :format='dateFormat'></ejs-datetimepicker>

                        <span class="k category-text-detail" v-show="!isInsert">Trạng thái</span>
                        <select class="k category-select-tag" v-show="!isInsert" v-model='ProjectInsert.active'>
                            <option value=1 >Hoạt động</option>
                             <option value=0 >Khóa</option>
                        </select>
                    </div>
                    <!--update-->
                    <div class="card-footer">
                        <button type="Submit" class="btn btn-primary" @click="insertProject()" v-show="isInsert"> 
                            <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="updateProject()">
                            <i class="fa fa-plus" aria-hidden="true"></i> Update
                        </button>
                        <button type="Submit" class="btn btn-primary" :disabled='isDisabled' @click="refreshForm()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> To insert
                        </button>
                        <button type="Submit" class="btn btn-primary" v-show="!isInsert" @click="deleteProject()"> 
                            <i class="fa fa-refresh" aria-hidden="true" ></i> Delete
                        </button>
                    </div>
            </div>
            <div class="k category-right-form">
                <div class="k category-form-title">
                        <h4 class="k category-title">Danh sách dự án</h4>
                    </div>
                <div class="card">
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listProject"
                    :allowPaging="true"
                    :showFilter="true"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                    @onRowSelected="selectProject"
                    />
                </div>
                
            </div>
        </div>
     </div>
</template>

<script>
import ProjectApi from '../ProjectApi.js';
export default {
    components:{
        // KTable,
        // FormInput
    },
    data(){
        return{
            listProject:[],
            isInsert:true,
            isDisabled:false,
            ProjectInsert:{
                project_id: 0,
                project_name: "",
                active: 1,
                start_day: new Date(),
                end_day: new Date(),
            },
            ProjectUpdate:Object(),
            colums:
            [{
                fieldName: "project_id",
                headerText: "ID",
            },
            {
                fieldName: "project_name",
                headerText: "Tên dịch vụ",
                allowFilter: true
            },
            {
                fieldName: "active",
                headerText: "Trạng thái",
                allowFilter: true
            },
            {
                fieldName: "start_day",
                headerText: "Ngày bắt đầu",
                allowFilter: true
            },
            {
                fieldName: "end_day",
                headerText: "Ngày kết thúc",
                allowFilter: true
            },
            
            ],
            dateFormat:'dd/MM/yyyy',
            header: {
                title: "Quản lý dự án",
                list: [
                ],
            },
        }
    },
    methods:{
        /**
         * get the list menus 
         * create by khanh 22/08/2022
         */
        async getProjects(){
            try{
                this.listProject = [];
				let response = await ProjectApi.getProjects(this.axios)
				if(response.data.success){
					this.listProject=response.data.data;
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
        changeDataInputNamePj(input){
            this.ProjectInsert.project_name = input;
        },
        changeDataInputStartDay(input){
            this.ProjectInsert.start_day = input;
        },
        changeDataInputEndDay(input){
            this.ProjectInsert.end_day = input;
        },
        /**
         * insert the menu
         * create by khanh 22/08/2022
         */
        async insertProject(){
            try{
                if(this.ProjectInsert.project_name.trim() == ""){
                    this.$toast.error("Vòng lòng không để trống tên dự án");
                    return;
                }
                this.listProject= [];
				let response = await ProjectApi.insertProject(this.axios,this.ProjectInsert);
				if(response.data.success){
					this.listProject = response.data.data;
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
            this.ProjectInsert = {
                project_id: 0,
                project_name: "",
                active: 1,
                start_day: new Date(),
                end_day: new Date(),
            };
            this.isInsert = true;
        },
        /**
         * select the row of tables
         * create by khanh 23/08/2022
         */
        selectProject(data){
            this.ProjectInsert = Object.assign({},data);
            this.isInsert = false;
        },
        /**
         * update the Project
         * create by khanh 23/08/2022
         */
        async updateProject(){
            try{
                if(this.ProjectInsert.project_id == 0){
                    this.$toast.warning("Please select at least a row");
                    return;
                };
                if(this.ProjectInsert.project_name.trim() == ""){
                    this.$toast.error("Vòng lòng không để trống tên dự án");
                    return;
                }
                this.listProject = [];
				let response = await ProjectApi.updateProject(this.axios,this.ProjectInsert);
				if(response.data.success){
					this.listProject=response.data.data;
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
         * delete the Project
         * create by khanh 23/08/2022
         */
        async deleteProject(){
            
            if(this.ProjectInsert.project_id == 0){
                this.$toast.warning("Please select at least a row");
                return;
            };
            let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`)
            if(result==0) {
                return;
            }
            else{
                this.loading(true);
                this.listProject = [];
                var response = await ProjectApi.deleteProject(this.axios,this.ProjectInsert.project_id);
                if(response.data.success){
                    this.listProject = response.data.data;
                    this.$toast.success(response.data.message);
                    this.loading(false);
                    this.refreshForm();
                    this.loading(false);
                }
                else{
                    this.$toast.error(response.data.message)
                }
                this.loading(false);
                    
            }
            this.loading(false);
        }
    },
    mounted(){
        this.getProjects();
    },
    created(){
    }
}
</script>

<style src="./Project.css" scoped></style>