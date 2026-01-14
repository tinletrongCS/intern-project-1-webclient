<template>
    <div class="main-wrapper">
        <breadcrumb :header="header"/>
        
        <div class="page-content" style="top: 50px;">
            <div class="box-form">
                <div class="info-row">
                    <div class="key w80 bold">Đơn vị<required-marker/></div>
                    <div class="value">
                        <select2 
                            v-model='unit_selected'
                            :options="unit_list.map(e=>({id:e.department_id, text:e.department_name}))"
                            @select="changeUnit"
                        />
                    </div>
                </div>
            </div>
            <div class="box-move-select-table">
                
                <div class="box-col box-form">
                    <div class="legend-title">Dự án chưa gán</div>
                    <KDataGrid
                        :columns="columnsChuaGan"
                        :dataSource="dataSourcesChuaGan"
                        :showColumnCheckbox="true"
                        :enable-paging-server="false"
                        :allowPaging="true"
                        :showFilter="true"
                        ref="gridChuaGan"
                        :enabledSelectFirstRow="false"
                        :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                        panelDataHeight="360px"/>
                </div>
                <div class="actions">
                    <button class="btn btn-main" @click="addProject" >
                        <span class="-ap icon-plus3"></span>
                    </button>
                    <button class="btn btn-main" @click="removeProject">
                        <span class="-ap icon-minus3"></span>
                    </button>
                </div>
                <div class="box-col box-form">
                    <div class="legend-title">Dự án đã gán</div>
                    <KDataGrid
                        :columns="columnsGan"
                        :dataSource="dataSourcesGan"
                        :showColumnCheckbox="true"
                        :enable-paging-server="false"
                        :allowPaging="true"
                        :showFilter="true"
                        ref="gridDaGan"
                        :enabledSelectFirstRow="false"
                        :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                        panelDataHeight="360px"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import API from './API'
export default {
    name:'ProjectDepartmentBriefing',
    components:{},
    data(){
        return {
            header: {
                title: "Gán dự án cho phòng ban trong báo cáo giao ban",
                list: [
                    
                ],
            },
            columnsGan:[
                {
                    fieldName:'project_code',
                    headerText:'Mã dự án',
                    allowFiltering:true
                },
                {
                    fieldName:'project_name',
                    headerText:'Tên dự án',
                    allowFiltering:true
                },
            ],
            dataSourcesGan:[],
            columnsChuaGan:[
                {
                    fieldName:'project_code',
                    headerText:'Mã dự án',
                    allowFiltering:true
                },
                {
                    fieldName:'project_name',
                    headerText:'Tên dự án',
                    allowFiltering:true
                },
            ],
            dataSourcesChuaGan:[],

            unit_list:[],
            unit_selected:0
        }

    },
    methods:{
        async changeUnit(){
            if(this.unit_selected==0){
                this.dataSourcesChuaGan=[]
                this.dataSourcesGan=[]
                return
            }
            this.loadDataGrid()
        },
        async loadDataGrid(){
            let data=await API.GetProjectsAttachedByDepartment(this, this.unit_selected)
            if(data){
                var jsonData=JSON.parse(data)
                this.dataSourcesChuaGan=jsonData.not_attached.concat([])
                this.dataSourcesGan=jsonData.attached.concat([])
            }else{
                this.dataSourcesChuaGan=[]
                this.dataSourcesGan=[]
            }
        },
        async addProject(){
            let dataSelected = this.$refs.gridChuaGan.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần gán')
                return
            }
            let dataRequest={
                unit_id:this.unit_selected,
                arrIds:JSON.stringify(dataSelected.map(x=>x.project_id))
            }
            let result=await API.AddProjectDepartment(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Gán thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async removeProject(){
            let dataSelected = this.$refs.gridDaGan.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần gỡ')
                return
            }
            let dataRequest={
                unit_id:this.unit_selected,
                arrIds:JSON.stringify(dataSelected.map(x=>x.project_id))
            }
            let result=await API.RemoveProjectDepartment(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Gỡ thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async loadPage(){
            this.unit_list = await API.GetAllDepartmentBriefing(this)
            this.unit_list.unshift({
                department_id: 0,
                department_name: "Chọn"
            })
        }   
    },
    mounted(){
        setTimeout(() =>{
             this.loadPage()
        }, 500)
    },
}
</script>