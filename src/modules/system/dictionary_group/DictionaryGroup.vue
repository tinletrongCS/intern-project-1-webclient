<template>
  <div class="dictionary-group">
    <div class="box-form">
      <div class="info-row">
          <div class="key w160">Mã nhóm công việc<required-marker/></div>
          <div class="value">
              <input type="text" ref="inputCode" :value="input_dictionary_group_code" @change="e=>input_dictionary_group_code=e.target.value" class="form-control">
          </div>
      </div>
      <div class="info-row">
          <div class="key w160">Tên nhóm công việc<required-marker/></div>
          <div class="value">
              <input type="text" ref="inputName" :value="input_dictionary_group_name" @change="e=>input_dictionary_group_name=e.target.value" class="form-control">
          </div>
      </div>
    </div>
    <div class="box-form" style="overflow: visible !important;">
      <div class="info-row">
        <div class="group-buttons -bottom" style="margin-top: 0px !important;">
          <button  class="btn btn-second" style="min-width: 100px;" @click="addNewDictionaryGroup">
            <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
          </button>
          <button  class="btn btn-second" style="min-width: 100px;" @click="updateDictionaryGroup">
            <span class="icon one-edit"></span>&nbsp;Cập nhật
          </button>
          <button class="btn btn-second" style="min-width: 100px;" @click="deleteDictionaryGroup">
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
  name:'DictionaryGroup',
  props:{
    test:{
      type:String,
      default:'test'
    }
  },
  data(){
    return {
      input_dictionary_group_name:'',
      input_dictionary_group_code:'',
      columns:[
            {
                fieldName:'dictionary_group_id',
                headerText:'ID',
                allowFiltering:true,
                width:'60'
            },
            {
                fieldName:'code',
                headerText:'Mã',
                allowFiltering:true,
                width:'60'
            },
            {
                fieldName:'dictionary_group',
                headerText:'Tên nhóm công việc',
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
      this.input_dictionary_group_name=''
      this.input_dictionary_group_code=''
      this.dataSources=[]
      this.rowSeleced={}
    },
    async loadDataGrid(){
      let data=await API.GetAllTaskDictionaryGroups(this)
      this.dataSources=data.concat([])
      this.rowSeleced = {}
      this.input_dictionary_group_name=''
      this.input_dictionary_group_code=''
    },
    async addNewDictionaryGroup(){
      if(this.input_dictionary_group_code.trim()==''){
        this.$toast.error('Vui lòng nhập mã nhóm công việc!')
        this.$refs.inputCode.focus()
        return
      }
      if(this.input_dictionary_group_name.trim()==''){
        this.$toast.error('Vui lòng nhập tên công việc!')
        this.$refs.inputName.focus()
        return
      }
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm nhóm công việc '${this.input_dictionary_group_name.trim()}'?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        code:this.input_dictionary_group_code.trim(),
        dictionary_group:this.input_dictionary_group_name.trim(),
      }
      let result=await API.AddTaskDictionaryGroup(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Thêm mới nhóm công việc thành công!')
          this.clear()
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    async updateDictionaryGroup(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length!=1){
        this.$toast.error('Vui lòng chọn nhóm công việc cần điều chỉnh!')
        return
      }
      if(this.input_dictionary_group_code.trim()==''){
        this.$toast.error('Vui lòng nhập mã nhóm công việc!')
        this.$refs.inputCode.focus()
        return
      }
      if(this.input_dictionary_group_name.trim()==''){
        this.$toast.error('Vui lòng nhập tên công việc!')
        this.$refs.inputName.focus()
        return
      }
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        dictionary_group_id:this.rowSeleced.dictionary_group_id,
        code:this.input_dictionary_group_code.trim(),
        dictionary_group:this.input_dictionary_group_name.trim()
      }
      let result=await API.UpdateTaskDictionaryGroup(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Cập nhật nhóm công việc thành công!')
          this.clear()
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    async deleteDictionaryGroup(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length!=1){
        this.$toast.error('Vui lòng chọn nhóm công việc cần xóa!')
        return
      }
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa nhóm công việc '${dsSlected[0].dictionary_group}'?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        arrIds:JSON.stringify([dsSlected[0].dictionary_group_id]),
      }
      let result=await API.DeleteTaskDictionaryGroup(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Xóa nhóm công việc thành công!')
          this.clear()
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    onRowSelected(row){
      this.rowSeleced = row
      this.input_dictionary_group_code=this.rowSeleced.code;
      this.input_dictionary_group_name=this.rowSeleced.dictionary_group;
    },
  }
}
</script>
<style scoped>

</style>