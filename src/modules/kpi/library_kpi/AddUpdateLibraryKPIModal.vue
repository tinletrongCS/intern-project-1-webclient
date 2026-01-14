<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddUpdateLibraryKPI"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        id="add-update-library-kpi"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <div class="row">
                    <div class="col-sm-6 col-12">
                      <div class="info-row">
                          <div class="key w150 bold">Mã chỉ số<required-marker/></div>
                          <div class="value">
                              <input type="text" :value="input_kpi_code" @change="e=>input_kpi_code=e.target.value" disabled class="form-control">
                          </div>
                      </div>
                    </div>
                    <div class="col-sm-6 col-12">
                      <div class="info-row">
                          <div class="key w150 bold">Đơn vị tính<required-marker/></div>
                          <div class="value">
                              <input type="text" ref="inputUnit" :value="input_kpi_unit" @change="e=>input_kpi_unit=e.target.value" class="form-control">
                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Danh mục chỉ số<required-marker/></div>
                      <div class="value">
                        <textarea ref="inputName" :value="input_kpi_name" @change="e=>input_kpi_name=e.target.value" class="form-control" rows="3"></textarea>
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Mô tả<required-marker/></div>
                      <div class="value">
                        <textarea ref="inputDesc" :value="input_description" @change="e=>input_description=e.target.value" class="form-control" rows="3"></textarea>
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Công thức/Cách đo lường<required-marker/></div>
                      <div class="value">
                        <textarea  ref="inputMeasurementMethod" :value="input_measurement_method" @change="e=>input_measurement_method=e.target.value" class="form-control" rows="3"></textarea>
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Công thức tính<required-marker/></div>
                      <div class="value">
                        <textarea  ref="inputFormula" :value="input_formula" @change="e=>input_formula=e.target.value" class="form-control" rows="3"></textarea>
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Nguồn dữ liệu<required-marker/></div>
                      <div class="value">
                        <textarea ref="inputDataSource" :value="input_data_source" @change="e=>input_data_source=e.target.value" class="form-control" rows="3"></textarea>
                      </div>
                  </div>
                  
                  <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                      <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
                          <span class="icon one-save"></span> Lưu thay đổi
                      </button>
                  </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import API from './API'
export default {
    name:'AddUpdateLibraryKPIModal',
    props:{
      isAdd:{
        type:Boolean,
        default:false
      },
      data:{
        type:Object,
        default: () => ({}) 
      }
    },
    components:{

    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' },
          header:`<span class="icon one-notepad"></span>THÔNG TIN DANH MỤC KPI`,
          input_kpi_code:'',
          input_kpi_unit:'',
          input_kpi_name:'',
          input_description:'',
          input_formula:'',
          input_data_source:'',
          input_measurement_method:''
        }
    },
    methods:{
        showModal() {
            this.$refs["popupAddUpdateLibraryKPI"].show()
        },
        hideModal() {
            this.$refs["popupAddUpdateLibraryKPI"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initPopup()
            },200)
        },
        async initPopup(){
          if(!this.isAdd){
            this.input_kpi_code=this.data.code
            this.input_kpi_unit=this.data.unit
            this.input_kpi_name=this.data.name
            this.input_description=this.data.description
            this.input_formula=this.data.formula
            this.input_data_source=this.data.data_source
            this.input_measurement_method=this.data.measurement_method
          }
        },
        clear(){
          this.input_kpi_code=''
          this.input_kpi_unit=''
          this.input_kpi_name=''
          this.input_description=''
          this.input_formula=''
          this.input_data_source=''
          this.input_measurement_method=''
        },
        async addKpiLibrary(){
          if(this.input_kpi_unit.trim()==''){
            this.$toast.error('Vui lòng nhập đơn vị!')
            this.$refs.inputUnit.focus()
            return
          }

          if(this.input_kpi_name.trim()==''){
            this.$toast.error('Vui lòng nhập danh mục chỉ số!')
            this.$refs.inputName.focus()
            return
          }
          if(this.input_description.trim()==''){
            this.$toast.error('Vui lòng nhập mô tả chỉ số!')
            this.$refs.inputDesc.focus()
            return
          }
          if(this.input_measurement_method.trim()==''){
            this.$toast.error('Vui lòng nhập công thức/cách đo lường!')
            this.$refs.inputMeasurementMethod.focus()
            return
          }
          if(this.input_formula.trim()==''){
            this.$toast.error('Vui lòng nhập công thức tính!')
            this.$refs.inputFormula.focus()
            return
          }
          if(this.input_data_source.trim()==''){
            this.$toast.error('Vui lòng nhập nguồn dữ liệu!')
            this.$refs.inputDataSource.focus()
            return
          }

          let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm danh mục KPI: '${this.input_kpi_name.trim()}'?`)
          if(messConfirm==0) {
            return
          }

          let dataRequest={
            code:this.input_kpi_code.trim(),
            unit:this.input_kpi_unit.trim(),
            name:this.input_kpi_name.trim(),
            description:this.input_description.trim(),
            formula:this.input_formula.trim(),
            data_source:this.input_data_source.trim(),
            measurement_method:this.input_measurement_method.trim()
          }
          let result=await API.AddKpiLibrary(this, dataRequest)
          if(result=='1'){
              this.$toast.success('Thêm mới thành công!')
              this.$emit('successAddUpdate')
              this.hideModal()
          }else{
              this.$toast.error(result)
          }
        },
        async updateKpiLibrary(){
          if(this.input_kpi_unit.trim()==''){
            this.$toast.error('Vui lòng nhập đơn vị!')
            this.$refs.inputUnit.focus()
            return
          }

          if(this.input_kpi_name.trim()==''){
            this.$toast.error('Vui lòng nhập danh mục chỉ số!')
            this.$refs.inputName.focus()
            return
          }
          if(this.input_description.trim()==''){
            this.$toast.error('Vui lòng nhập mô tả chỉ số!')
            this.$refs.inputDesc.focus()
            return
          }
           if(this.input_measurement_method.trim()==''){
            this.$toast.error('Vui lòng nhập công thức/cách đo lường!')
            this.$refs.inputMeasurementMethod.focus()
            return
          }
          if(this.input_formula.trim()==''){
            this.$toast.error('Vui lòng nhập công thức tính!')
            this.$refs.inputFormula.focus()
            return
          }
          if(this.input_data_source.trim()==''){
            this.$toast.error('Vui lòng nhập nguồn dữ liệu!')
            this.$refs.inputDataSource.focus()
            return
          }

          let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn cập nhật?`)
          if(messConfirm==0) {
            return
          }

          let dataRequest={
            kpi_library_id:this.data.kpi_library_id,
            code:this.input_kpi_code.trim(),
            unit:this.input_kpi_unit.trim(),
            name:this.input_kpi_name.trim(),
            description:this.input_description.trim(),
            formula:this.input_formula.trim(),
            data_source:this.input_data_source.trim(),
            measurement_method:this.input_measurement_method.trim()
          }
          let result=await API.UpdateKpiLibrary(this, dataRequest)
          if(result=='1'){
              this.$toast.success('Cập nhật thành công!')
              this.$emit('successAddUpdate')
              this.hideModal()
          }else{
              this.$toast.error(result)
          }
        },
        async onSave(){
          if(this.isAdd){
            this.addKpiLibrary()
          }else{
            this.updateKpiLibrary()
          }
        }
    },
    mounted() {
        
    }
}
</script>
<style>
/* #add-update-library-kpi .e-dlg-content {
  overflow: visible !important;
} */

/* @media (max-width: 768px) {
  #add-update-library-kpi{
    overflow-y: auto !important;
    max-height: 500px;
  }
} */
 :deep(.e-control.e-dialog.add-update-library-kpi.e-popup-open .e-dlg-content) {
  max-height: 85vh !important;
  overflow-y: auto;
}
</style>