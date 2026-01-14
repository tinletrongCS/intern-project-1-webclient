<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupUpdateFormulaConfigKpi"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        id="update-formula-config-kpi"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <div class="info-row">
                      <div class="key w150 bold">Mã chỉ số</div>
                      <div class="value">
                          <input type="text" :value="input_kpi_code" @change="e=>input_kpi_code=e.target.value" readonly class="form-control">
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Tên chỉ số</div>
                      <div class="value">
                        <textarea ref="inputName" :value="input_kpi_name" @change="e=>input_kpi_name=e.target.value" readonly class="form-control" rows="3"></textarea>
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Phương thức tính</div>
                      <div class="value">
                          <select2 
                              v-model='calculation_type_selected'
                              :options="calculation_type_list"
                          />
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Schema<required-marker/></div>
                      <div class="value">
                        <input type="text" ref="inputSchema" :value="input_schema" @change="e=>input_schema=e.target.value" class="form-control" >
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Funciton<required-marker/></div>
                      <div class="value">
                        <input  type="text" ref="inputFunction" :value="input_function" @change="e=>input_function=e.target.value" class="form-control">
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w150 bold">Mô tả</div>
                      <div class="value">
                        <textarea ref="inputDescription" :value="input_description" @change="e=>input_description=e.target.value" class="form-control" rows="3"></textarea>
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
    name:'UpdateFormulaConfigKpiModal',
    props:{
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
          header:`<span class="icon one-notepad"></span>Điều chỉnh cấu hình công thức tính chỉ số`,
          input_kpi_code:'',
          input_kpi_name:'',
          input_schema:'',
          input_function:'',
          input_description:'',
          calculation_type_selected:'AUTO',
          calculation_type_list:[
            {
              id:'AUTO',
              text:'Tự động'
            },
            {
              id:'MANUAL',
              text:'Thủ công'
            },
          ]
        }
    },
    methods:{
        showModal() {
            this.$refs["popupUpdateFormulaConfigKpi"].show()
        },
        hideModal() {
            this.$refs["popupUpdateFormulaConfigKpi"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initPopup()
            },200)
        },
        async initPopup(){
          this.input_kpi_code=this.data.code
          this.input_kpi_name=this.data.name
          this.calculation_type_selected=this.data.calculation_type?this.data.calculation_type:'AUTO'
          this.input_schema=this.data.function_schema?this.data.function_schema:''
          this.input_function=this.data.function_name?this.data.function_name:''
          this.input_description=this.data.formula_description?this.data.formula_description:''
        },
        clear(){
          this.input_kpi_code=''
          this.input_kpi_name=''
          this.input_schema=''
          this.input_function=''
          this.input_description=''
          this.calculation_type_selected='AUTO'
        },
        async onSave(){
          if(this.input_schema.trim()==''){
            this.$toast.error('Vui lòng nhập Schema!')
            this.$refs.inputSchema.focus()
            return
          }
          
          if(this.input_function.trim()==''){
            this.$toast.error('Vui lòng nhập Function!')
            this.$refs.inputFunction.focus()
            return
          }

          let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn cập nhật?`)
          if(messConfirm==0) {
            return
          }

          let dataRequest={
            formula_config_kpi_id:this.data.formula_config_kpi_id,
            kpi_library_id:this.data.kpi_library_id,
            function_schema:this.input_schema.trim(),
            function_name:this.input_function.trim(),
            calculation_type:this.calculation_type_selected,
            description:this.input_description.trim()
          }

          let result=await API.UpdateFormulaConfigKpi(this, dataRequest)
          if(result=='1'){
              this.$toast.success('Cập nhật thành công!')
              this.$emit('successUpdate')
              this.hideModal()
          }else{
              this.$toast.error(result)
          }
        }
    },
    mounted() {
        
    }
}
</script>
<style>
.e-control.e-dialog.update-formula-config-kpi.e-popup-open .e-dlg-content{
  max-height: 85vh !important;
  overflow-y: auto;
}
</style>