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
            <div class="box-form">
                <div class="info-row">
                    <div class="group-buttons -bottom" style="margin-top: 0px !important;">
                        <button @click="onClickAddNewDepartmentBiefing" class="btn btn-second" style="min-width: 100px;">
                            <span class="icon"></span>&nbsp;Thêm mới
                        </button>
                        <button @click="onClickRemoveDepartmentBiefing" class="btn btn-second" style="min-width: 100px;">
                            <span class="icon"></span>&nbsp;Xóa
                        </button>
                    </div>
                </div>
                <KDataGrid
                    :columns="columns"
                    :dataSource="dataSources"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="true"
                    :showFilter="true"
                    ref="gridDs"
                    :enabledSelectFirstRow="false"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick'}"/>
            </div>
        </div>
    </div>
</template>
<script>
import API from './API'
export default {
    name:'DepartmentBriefing',
    components:{},
    data(){
        return {
            header: {
                title: "Khai báo phòng ban báo cáo giao ban",
                list: [
                    
                ],
            },
            columns:[
                {
                    fieldName:'department_id',
                    headerText:'ID',
                    allowFiltering:true
                },
                {
                    fieldName:'department_name',
                    headerText:'Phòng ban',
                    allowFiltering:true
                },
            ],
            dataSources:[],
            unit_list:[],
            unit_selected:0
        }

    },
    methods:{
        async loadPage(){
            this.unit_list=await API.GetAllDepartment(this)
            this.unit_list.unshift({
                department_id:0,
                department_name:'Chọn'
            })
            this.loadDataGrid()
        },
        async loadDataGrid(){
            var data = await API.GetAllDepartmentBriefing(this)
            this.dataSources = data.concat([])
        },
        async onClickAddNewDepartmentBiefing(){
            if(!this.unit_selected){
                this.$toast.error('Vui lòng phòng ban cần thêm mới!');
                return
            }
            let dataRequest={
                department_id:this.unit_selected,
            }
            let result=await API.AddDepartmentBriefing(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Thêm thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async onClickRemoveDepartmentBiefing(){
            let dataSelected = this.$refs.gridDs.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu cần xóa')
                return
            }
            let dataRequest={
                arrIds:JSON.stringify(dataSelected.map(x=>x.department_id))
            }
            let result=await API.RemoveDepartmentBriefing(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Xóa thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        }
        
    },
    mounted(){
        setTimeout(() =>{
             this.loadPage()
        }, 500)
    },
}
</script>