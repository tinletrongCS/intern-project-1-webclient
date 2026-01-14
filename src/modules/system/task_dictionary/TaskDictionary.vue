<template>
  <div class="dictionary-group">
    <div class="box-form">
      <div class="info-row">
          <div class="key w120">Mã công việc<required-marker/></div>
          <div class="value">
              <input type="text" ref="inputCode" :value="input_dictionary_code" @change="e=>input_dictionary_code=e.target.value" class="form-control">
          </div>
      </div>
      <div class="info-row">
          <div class="key w120">Tên công việc<required-marker/></div>
          <div class="value">
              <input type="text" ref="inputName" :value="input_dictionary_name" @change="e=>input_dictionary_name=e.target.value" class="form-control">
          </div>
      </div>
      <div class="info-row">
          <div class="key w120">Nhóm công việc<required-marker/></div>
          <div class="value">
              <select2 
                  v-model='group_dictionary_selected'
                  :options="group_dictionary_list.map(e=>({id:e.dictionary_group_id, text:e.dictionary_group}))"
              />
          </div>
      </div>
      <div class="info-row">
        <div class="key w120">Mức độ</div>
        <div class="value">
            <input  type="text" class='form-control' placeholder="Bình thường" :value="input_complexity" @change="e=>input_complexity=e.target.value">
        </div>
      </div>
      <div class="info-row">
        <div class="key w120">Mô tả</div>
        <div class="value">
            <textarea  class='form-control' rows="2" :value="input_description" @change="e=>input_description=e.target.value"></textarea>
        </div>
      </div>
      <div class="info-row">
        <div class="key w120">Quota time</div>
        <div class="value">
            <input type="text" @keypress="isNumber($event)" class='form-control' :value="input_time_target" @change="e=>input_time_target=e.target.value">
        </div>
      </div>
      
    </div>
    <div class="box-form" style="overflow: visible !important;">
      <div class="info-row">
        <div class="group-buttons -bottom" style="margin-top: 0px !important;">
          <button  class="btn btn-second" style="min-width: 100px;" @click="addNewDictionary">
            <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
          </button>
          <button  class="btn btn-second" style="min-width: 100px;" @click="updateDictionary">
            <span class="icon one-edit"></span>&nbsp;Cập nhật
          </button>
          <button class="btn btn-second" style="min-width: 100px;" @click="deleteDictionary">
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
  name:'TaskDictionary',
  props:{
    test:{
      type:String,
      default:'test'
    }
  },
  data(){
    return {
      input_dictionary_name:'',
      input_dictionary_code:'',
      columns:[
            {
                fieldName:'jobtype_id',
                headerText:'ID',
                allowFiltering:true,
                width:'60'
            },
            {
                fieldName:'code',
                headerText:'Mã loại công việc',
                allowFiltering:true,
                width:'60'
            },
            {
                fieldName:'task_dictionary',
                headerText:'Tên công việc',
                allowFiltering:true
            },
            {
                fieldName:'dictionary_group',
                headerText:'Nhóm công việc',
                allowFiltering:true
            }
        ],
        dataSources:[],
        rowSeleced:{},
        group_dictionary_list:[
          {
            dictionary_group_id:0,
            dictionary_group:'Chọn',
            code:''
          }
        ],
        group_dictionary_selected:0,
        input_description:'',
        input_complexity:'',
        input_time_target:0
    }
  },
  methods:{
    async init(){
      this.clear()
      this.group_dictionary_list=[
        {
          dictionary_group_id:0,
          dictionary_group:'Chọn',
          code:''
        }
      ]
      this.group_dictionary_selected=0
      //Load combox
      var result=await API.GetAllTaskDictionaryGroups(this)
      this.group_dictionary_list=this.group_dictionary_list.concat(result)
      //
      this.loadDataGrid()
    },
    clear(){
      this.input_dictionary_name=''
      this.input_dictionary_code=''
      this.dataSources=[]
      
      this.rowSeleced={}
      this.input_description=''
      this.input_complexity=''
      this.input_time_target=0
    },
    async loadDataGrid(){
      this.dataSources=[]
      var data=await API.GetAllTaskDictionary(this)
      if(data){
        data=JSON.parse(data)
        this.dataSources=data.concat([])
      }
      this.rowSeleced = {}
      this.input_dictionary_name=''
      this.input_dictionary_code=''
      this.group_dictionary_selected=0
      this.input_description=''
      this.input_complexity=''
      this.input_time_target=0
    },
    isNumber(evt) {
      evt = evt || window.event;
      const charCode = evt.which || evt.keyCode;

      // Cho phép: phím số (0–9), dấu chấm (.), phím điều hướng
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) && // không phải 0–9
        charCode !== 46                     // không phải dấu .
      ) {
        evt.preventDefault();
      }

      // Không cho nhập quá 1 dấu chấm
      const input = evt.target.value;
      if (charCode === 46 && input.includes('.')) {
        evt.preventDefault();
      }
    },
    async addNewDictionary(){
      if(this.input_dictionary_code.trim()==''){
        this.$toast.error('Vui lòng nhập mã công việc!')
        return
      }
      if(this.input_dictionary_name.trim()==''){
        this.$toast.error('Vui lòng nhập tên công việc!')
        return
      }
      if(!this.group_dictionary_selected){
        this.$toast.error('Vui lòng chọn nhóm công việc!')
        return
      }

      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm loại công việc '${this.input_dictionary_name.trim()}'?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest = {
        task_dictionary: this.input_dictionary_name.trim(),
        complexity: this.input_complexity?.trim() || null,
        code: this.input_dictionary_code.trim(),
        description: this.input_description?.trim() || null,
        dictionary_group_id: this.group_dictionary_selected,
        quota: this.input_time_target != '' ? Number(this.input_time_target) : null
      }
      let result=await API.AddTaskDictionary(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Thêm mới loại công việc thành công!')
          this.clear()
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    async updateDictionary(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length!=1){
        this.$toast.error('Vui lòng chọn nhóm công việc cần điều chỉnh!')
        return
      }
      if(this.input_dictionary_code.trim()==''){
        this.$toast.error('Vui lòng nhập mã công việc!')
        return
      }
      if(this.input_dictionary_name.trim()==''){
        this.$toast.error('Vui lòng nhập tên công việc!')
        return
      }
      if(!this.group_dictionary_selected){
        this.$toast.error('Vui lòng chọn nhóm công việc!')
        return
      }

      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest = {
        jobtype_id: dsSlected[0].jobtype_id,
        task_dictionary: this.input_dictionary_name.trim(),
        complexity: this.input_complexity?.trim() || null,
        code: this.input_dictionary_code.trim(),
        description: this.input_description?.trim() || null,
        dictionary_group_id: this.group_dictionary_selected,
        quota: this.input_time_target != '' ? Number(this.input_time_target) : null
      }
      let result=await API.UpdateTaskDictionary(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Cập nhật loại công việc thành công!')
          this.clear()
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    async deleteDictionary(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length!=1){
        this.$toast.error('Vui lòng chọn loại công việc cần xóa!')
        return
      }
      let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa loại công việc '${dsSlected[0].task_dictionary}'?`)
      if(messConfirm==0) {
        return
      }
      let dataRequest={
        arrIds:JSON.stringify([dsSlected[0].jobtype_id]),
      }
      let result=await API.DeleteTaskDictionary(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Xóa loại công việc thành công!')
          this.clear()
          this.loadDataGrid()
      }else{
          this.$toast.error(result)
      }
    },
    onRowSelected(row){
      this.rowSeleced = row
      this.input_dictionary_code=this.rowSeleced.code?this.rowSeleced.code.toString():''
      this.input_dictionary_name=this.rowSeleced.task_dictionary?this.rowSeleced.task_dictionary.toString():''
      this.input_complexity = this.rowSeleced.complexity?this.rowSeleced.complexity.toString():''
      this.input_description = this.rowSeleced.description?this.rowSeleced.description.toString():''
      this.input_time_target=this.rowSeleced.quota?this.rowSeleced.quota:''
      this.group_dictionary_selected=this.rowSeleced.dictionary_group_id
    },
  }
}
</script>
<style scoped>

</style>