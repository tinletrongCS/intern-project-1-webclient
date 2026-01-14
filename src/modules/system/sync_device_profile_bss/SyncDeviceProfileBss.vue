<template>
    <div class="sync_device_profile_bss">
        <div class="box-move-select-table">
            <div class="box-col box-form">
                <div class="legend-title">Loại hình TB chưa đồng bộ</div>
                <KDataGrid
                    :columns="columnsChuaDB"
                    :dataSource="dataSourcesChuaDB"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="true"
                    ref="gridChuaDB"
                    :enabledSelectFirstRow="false"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                    panelDataHeight="360px"/>
            </div>
            <div class="actions">
                <button class="btn btn-main" @click="syncDeviceProfileBss" >
                    <span class="-ap icon-sync"></span>
                </button>
                <button class="btn btn-main" @click="removeSyncDeviceProfileBss">
                    <span class="-ap icon-minus3"></span>
                </button>
            </div>
            <div class="box-col box-form">
                <div class="legend-title">Loại hình TB đã đồng bộ</div>
                <KDataGrid
                    :columns="columnsDB"
                    :dataSource="dataSourcesDB"
                    :showColumnCheckbox="true"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="true"
                    ref="gridDaDB"
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
    name:'SyncDeviceProfileBss',
    components:{},
    data(){
        return {
            header: {
                title: "Đồng bộ loại hình thuê bao từ OneBss",
                list: [
                    
                ],
            },
            columnsDB:[
                {
                    fieldName:'device_profile_code',
                    headerText:'Mã LHTB',
                    allowFiltering:true
                },
                {
                    fieldName:'device_profile_name',
                    headerText:'Tên LHTB',
                    allowFiltering:true
                },
                {
                    fieldName:'service_code',
                    headerText:'Mã dịch vụ',
                    allowFiltering:true
                },
                {
                    fieldName:'service_name',
                    headerText:'Tên dịch vụ',
                    allowFiltering:true
                },
            ],
            dataSourcesDB:[],
            columnsChuaDB:[
                {
                    fieldName:'device_profile_code',
                    headerText:'Mã LHTB',
                    allowFiltering:true
                },
                {
                    fieldName:'device_profile_name',
                    headerText:'Tên LHTB',
                    allowFiltering:true
                },
                {
                    fieldName:'service_code',
                    headerText:'Mã dịch vụ',
                    allowFiltering:true
                },
                {
                    fieldName:'service_name',
                    headerText:'Tên dịch vụ',
                    allowFiltering:true
                },
            ],
            dataSourcesChuaDB:[]
        }

    },
    methods:{
        async init(){
            this.clear()
            this.loadDataGrid()
        },
        clear(){
            this.dataSourcesDB=[]
            this.dataSourcesChuaDB=[]
        },
        async loadDataGrid(){
            this.dataSourcesDB=[]
            this.dataSourcesChuaDB=[]
            let data=await API.GetDeviceProfileBssSync(this)
            if(data){
                this.dataSourcesDB=data.synced.concat([])
                this.dataSourcesChuaDB=data.not_synced.concat([])
            }
        },
        async syncDeviceProfileBss(){
            let dataSelected = this.$refs.gridChuaDB.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu đồng bộ')
                return
            }
             let confirm = await this.$confirm('Thông báo', `Bạn có chắc muốn đồng bộ dữ liệu được chọn?`)
            if(confirm==0) return
            //
            let result=await API.SyncDeviceProfileBss(this, dataSelected)
            if(result=='1'){
                this.$toast.success('Đồng bộ thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }
        },
        async removeSyncDeviceProfileBss(){
            let dataSelected = this.$refs.gridDaDB.grid.getSelectedRecords()
            if(dataSelected.length==0){
                this.$toast.error('Vui lòng chọn dữ liệu đồng bộ cần xóa')
                return
            }
            let confirm = await this.$confirm('Thông báo', `Bạn có chắc muốn xóa các dữ liệu được chọn?`)
            if(confirm==0) return
            //
            let result=await API.RemoveSyncDeviceProfileBss(this, dataSelected)
            if(result=='1'){
                this.$toast.success('Xóa dữ liệu đồng bộ thành công!')
                this.loadDataGrid()
            }else{
                this.$toast.error(result)
            }

        },
        
    }
}
</script>