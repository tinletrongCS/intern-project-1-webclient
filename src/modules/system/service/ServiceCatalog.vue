<template>
  <div class="service-catalog">
    <div class="box-form">
      <div class="info-row">
          <div class="key w120">Tên dịch vụ<required-marker/></div>
          <div class="value">
              <input type="text" ref="inputServiceName" :value="input_service_name" @change="e=>input_service_name=e.target.value" class="form-control">
          </div>
      </div>
    </div>
    <div class="box-form" style="overflow: visible !important;">
      <div class="info-row">
        <div class="group-buttons -bottom" style="margin-top: 0px !important;">
          <button  class="btn btn-second" style="min-width: 100px;" @click="addNewService">
            <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
          </button>
          <button  class="btn btn-second" style="min-width: 100px;" @click="updateService">
            <span class="icon one-edit"></span>&nbsp;Cập nhật
          </button>
          <button class="btn btn-second" style="min-width: 100px;" @click="deleteService">
            <span class="icon one-trash"></span>&nbsp;Xóa
          </button>
        </div>
      </div>
       <KDataGrid
            ref="gridDs"
            :columns="columns"
            :dataSource="dataSources"
            :enable-paging-server="false"
            :allowPaging="true"
            :showFilter="true"
            :showColumnCheckbox="false"
            :enabledSelectFirstRow="false"
            @onRowSelected="onRowSelected"
            :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
            
        />
    </div>

  </div>
</template>
<script>
import API from './API'
export default {
  name:'ServiceCatalog',
  props:{
    test:{
      type:String,
      default:'test'
    }
  },
  data(){
    return {
      input_service_name:'',
      columns:[
            {
                fieldName:'service_id',
                headerText:'ID',
                allowFiltering:true,
                width:'60'
            },
            {
                fieldName:'service_name',
                headerText:'Tên dịch vụ',
                allowFiltering:true
            }
        ],
        dataSources:[],
        rowSeleced:{}
    }
  },
  methods:{
    init(){
      this.clear()
      this.loadDataGrid()
    },
    clear(){
      this.input_service_name=''
      this.dataSources=[]
      this.rowSeleced={}
    },
    async loadDataGrid(){
      let data=await API.GetAllService(this)
      this.dataSources=data.concat([])
      this.rowSeleced = {}
      this.input_service_name=''
    },
    async addNewService(){
      if(this.input_service_name.trim()==''){
        this.$toast.error('Vui lòng nhập tên dịch vụ!')
        this.$refs.inputServiceName.focus()
        return
      }
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm dịch vụ '${this.input_service_name.trim()}'?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        service_name:this.input_service_name.trim(),
      }
      let result=await API.AddService(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Thêm mới dịch vụ thành công!')
          this.input_service_name=''
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    onRowSelected(row){
      this.rowSeleced = row
      this.input_service_name=this.rowSeleced.service_name;
    },
    async updateService(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length!=1){
        this.$toast.error('Vui lòng chọn dịch vụ cần điều chỉnh!')
        return
      }

      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        service_id:this.rowSeleced.service_id,
        service_name:this.input_service_name.trim(),
      }
      let result=await API.UpdateService(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Cập nhật dịch vụ thành công!')
          this.input_service_name=''
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    async deleteService(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length!=1){
        this.$toast.error('Vui lòng chọn dịch vụ cần xóa!')
        return
      }
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dịch vụ '${dsSlected[0].service_name}'?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        arrIds:JSON.stringify([dsSlected[0].service_id]),
      }
      let result=await API.DeleteService(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Xóa dịch vụ thành công!')
          this.input_service_name=''
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
  }
}
</script>
<style scoped>

</style>