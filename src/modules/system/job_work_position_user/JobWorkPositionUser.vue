<template>
    <div class="department-user-group">
        <div class="box-move-select-table">
            <div class="box-col box-form">
                <div class="info-row">
                    <div class="key w80 bold">Đơn vị</div>
                    <div class="value">
                        <select2 
                            v-model='unit_selected'
                            :options="unit_list"
                            @select="changeUnit"
                        />
                    </div>
                </div>
                <KDataGrid
                    :columns="columns"
                    :dataSource="dataSources"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="true"
                    ref="gridDs"
                    :enabledSelectFirstRow="false"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                    panelDataHeight="360px"/>
            </div>
            <div class="actions">
                <button class="btn btn-main" @click="addUserJobWorkPosition" >
                    <span class="-ap icon-plus3"></span>
                </button>
                <button class="btn btn-main" @click="removeUserJobWorkPosition">
                    <span class="-ap icon-minus3"></span>
                </button>
            </div>
            <div class="box-col box-form">
                <div class="info-row">
                    <div class="key w120 bold">Vị trí công việc</div>
                    <div class="value">
                        <select2 
                            v-model='work_position_selected'
                            :options="work_position_list.map(e=>({id:e.job_work_position_id, text:e.name}))"
                            @select="changeWorkPosition"
                        />
                    </div>
                </div>
                <KDataGrid
                    :columns="columns"
                    :dataSource="dataSourcesGan"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="true"
                    ref="gridDsUserPos"
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
    name:'JobWorkPositionUser',
    components:{},
    data(){
        return {
            header: {
                title: "Gán người dùng phòng ban vào nhóm",
                list: [
                    
                ],
            },
            columns:[
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
            ],
            dataSources:[],
            dataSourcesGan:[],

            unit_list:[],
            unit_selected:0,

            work_position_selected:0,
            work_position_list:[]

        }

    },
    methods:{
        init(){
            this.clear()
            this.loadPage()
        },
        clear(){
            this.dataSourcesGan=[]
            this.dataSources=[]
            this.unit_selected=0
            this.work_position_selected=0
            this.work_position_list=[]
            this.unit_list=[]
        },
        async changeUnit(){
            if(this.unit_selected==0){
                this.dataSourcesGan=[]
                this.dataSources=[]
                return
            }
            if(!this.unit_selected){
                return
            }

            //Lấy danh sách nhân sự phòng ban
            var result=await API.GetUsersByDepartment(this, this.unit_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSources=[].concat(result)
            }

            if(!this.work_position_selected){
                return
            }
            result = await API.GetUsersByJobWorkPositions(this, this.unit_selected, this.work_position_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesGan=[].concat(result)
            }
        },
        async changeWorkPosition(){
            this.dataSourcesGan=[]
            if(!this.work_position_selected){
                return
            }
            var result = await API.GetUsersByJobWorkPositions(this, this.unit_selected, this.work_position_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesGan=[].concat(result)
            }
        },
        async loadDataGrid(){
            this.dataSourcesGan=[]
            this.dataSources=[]

            var result=await API.GetUsersByDepartment(this, this.unit_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSources=[].concat(result)
            }

            result = await API.GetUsersByJobWorkPositions(this, this.unit_selected, this.work_position_selected)
            if(result){
                result=JSON.parse(result)
                this.dataSourcesGan=[].concat(result)
            }
        },
        async addUserJobWorkPosition(){
            let dataSelected = this.$refs.gridDs.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần gán')
                return
            }
            if(!this.work_position_selected){
                this.$toast.error('Vui lòng vị trí cần gán')
                return
            }
            let dataRequest={
                department_id:this.unit_selected,
                job_work_position_id:this.work_position_selected,
                arrIds:JSON.stringify(dataSelected.map(x=>x.user_id))
            }
            let result=await API.AddJobWorkPosition(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Gán thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async removeUserJobWorkPosition(){
            let dataSelected = this.$refs.gridDsUserPos.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần gỡ')
                return
            }
            let dataRequest={
                department_id:this.unit_selected,
                job_work_position_id:this.work_position_selected,
                arrIds:JSON.stringify(dataSelected.map(x=>x.user_id))
            }
            let result=await API.RemoveJobWorkPosition(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Gỡ thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async loadPage(){
            var departmentList=await API.GetMyDepartmentTree(this)
            this.unit_list=[{
                id: 0,
                text: "Chọn"
            }].concat(departmentList)

            var workPositionList=await API.GetJobWorkPositions(this)

            this.work_position_list=[{
                job_work_position_id: 0,
                name: "Chọn"
            }].concat(workPositionList)
        }   
    },
    mounted(){
        // setTimeout(() =>{
        //      this.loadPage()
        // }, 500)
    },
}
</script>