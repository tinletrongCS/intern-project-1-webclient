<template>
    <div class="department-user-group">
        <div class="box-move-select-table">
            <div class="box-col box-form">
                <div class="info-row">
                    <div class="key w80 bold">Phòng ban</div>
                    <div class="value">
                        <select2 
                            v-model='department_selected'
                            :options="department_list.map(e=>({id:e.department_id, text:e.name}))"
                            @select="changeDepartment"
                        />
                    </div>
                </div>
                <KDataGrid
                    :columns="columnsDepartment"
                    :dataSource="dataSourcesDepartment"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="true"
                    ref="gridDepartment"
                    :enabledSelectFirstRow="false"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                    panelDataHeight="360px"/>
            </div>
            <div class="actions">
                <button class="btn btn-main" @click="addUserGroup" >
                    <span class="-ap icon-plus3"></span>
                </button>
                <button class="btn btn-main" @click="removeUserGroup">
                    <span class="-ap icon-minus3"></span>
                </button>
            </div>
            <div class="box-col box-form">
                <div class="info-row">
                    <div class="key w80 bold">Nhóm DA</div>
                    <div class="value">
                        <select2 
                            v-model='group_selected'
                            :options="group_list.map(e=>({id:e.department_id, text:e.name}))"
                            @select="changeGroup"
                        />
                    </div>
                </div>
                <KDataGrid
                    :columns="columnsGoup"
                    :dataSource="dataSourcesGroup"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="true"
                    ref="gridGroup"
                    :enabledSelectFirstRow="false"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                    panelDataHeight="360px"/>
            </div>
        </div>
    </div>
</template>
<script>
import API from './API'
export default {
    name:'DepartmentUserGroup',
    components:{},
    data(){
        return {
            header: {
                title: "Gán người dùng phòng ban vào nhóm",
                list: [
                    
                ],
            },
            columnsGoup:[
                {
                    fieldName:'username',
                    headerText:'Tài khoản',
                    allowFiltering:true
                },
                {
                    fieldName:'full_name',
                    headerText:'Tên người dùng',
                    allowFiltering:true
                },
                {
                    fieldName:'ma_nv',
                    headerText:'Mã nhân viên',
                    allowFiltering:true
                },
                {
                    fieldName:'vt_cv',
                    headerText:'Vị trí công việc',
                    allowFiltering:true
                }
            ],
            dataSourcesDepartment:[],
            columnsDepartment:[
                {
                    fieldName:'username',
                    headerText:'Tài khoản',
                    allowFiltering:true
                },
                {
                    fieldName:'full_name',
                    headerText:'Tên người dùng',
                    allowFiltering:true
                },
                {
                    fieldName:'ma_nv',
                    headerText:'Mã nhân viên',
                    allowFiltering:true
                },
                {
                    fieldName:'vt_cv',
                    headerText:'Vị trí công việc',
                    allowFiltering:true
                },
            ],
            dataSourcesGroup:[],

            department_list:[],
            department_selected:0,

            group_selected:0,
            group_list:[]

        }

    },
    methods:{
        init(){
            this.clear()
            this.loadPage()
        },
        clear(){
            this.dataSourcesGroup=[]
            this.dataSourcesDepartment=[]
            this.department_selected=0
            this.group_selected=0
            this.group_list=[]
            this.department_list=[]
        },
        async changeDepartment(){
            if(this.department_selected==0){
                this.dataSourcesGroup=[]
                this.dataSourcesDepartment=[]
                return
            }
            if(!this.department_selected){
                return
            }
            var groups=await API.GetUnitByParentId(this, JSON.stringify([this.department_selected]), 4)
            this.group_list=[{
                department_id: 0,
                name: "Chọn"
            }].concat(groups)
            this.group_selected=0

            //Lấy danh sách nhân sự phòng ban
            var result=await API.GetUsersByDepartment(this, this.department_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesDepartment=[].concat(result)
            }
        },
        async changeGroup(){
            this.dataSourcesGroup=[]
            if(!this.group_selected){
                return
            }
            //Lấy danh sách nhân sự nhóm
            var result=await API.GetUsersByDepartment(this, this.group_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesGroup=[].concat(result)
            }
        },
        async loadDataGrid(){
            this.dataSourcesGroup=[]
            this.dataSourcesDepartment=[]

            var result=await API.GetUsersByDepartment(this, this.department_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesDepartment=[].concat(result)
            }
            //Lấy danh sách nhân sự nhóm
            result=await API.GetUsersByDepartment(this, this.group_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesGroup=[].concat(result)
            }
        },
        async addUserGroup(){
            let dataSelected = this.$refs.gridDepartment.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần gán')
                return
            }
            if(!this.group_selected){
                this.$toast.error('Vui lòng chọn nhóm cần gán')
                return
            }
            let dataRequest={
                department_id:this.department_selected,
                group_id:this.group_selected,
                arrIds:JSON.stringify(dataSelected.map(x=>x.user_id))
            }
            let result=await API.AddDepartmentUserGroup(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Gán thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async removeUserGroup(){
            let dataSelected = this.$refs.gridGroup.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần gỡ')
                return
            }
            let dataRequest={
                department_id:this.department_selected,
                group_id:this.group_selected,
                arrIds:JSON.stringify(dataSelected.map(x=>x.user_id))
            }
            let result=await API.RemoveDepartmentUserGroup(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Gỡ thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async loadPage(){
            var departmentList=await API.GetUnitByParentId(this, JSON.stringify([0]), 3)
            this.department_list=[{
                department_id: 0,
                name: "Chọn"
            }].concat(departmentList)
            this.group_list=[{
                department_id: 0,
                name: "Chọn"
            }]
        }   
    },
    mounted(){
        // setTimeout(() =>{
        //      this.loadPage()
        // }, 500)
    },
}
</script>