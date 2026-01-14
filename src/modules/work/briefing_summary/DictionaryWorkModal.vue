<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupDictionaryWork"
        :showCloseIcon="true"
        width="70%"
        :isModal='true'
        :target="target"
        :header="header"
        id="dictionary-work-dialog"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <div class="info-row" style="table-layout: fixed !important;">
                    <div class="value" style="padding-left: 0px !important;">
                      <div :id="editorId1" class="editor"></div>
                    </div>
                  </div>
                  
                  <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                      <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
                          <span class="icon one-save"></span> Lưu thông tin
                      </button>
                  </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import API from './API'
import moment from 'moment'
import '@/utils/ckeditor/ckeditor.js'
import { AxiosUploadPlugin } from '@/utils/ckeditor/AxiosUploadAdapter.js';
export default {
    name:'DictionaryWorkModal',
    props:{
      isAdd:{
        type:Boolean,
        default:true
      },
      dictionary:{
        type:Object,
        default: () => ({
          id:1,
          code:'PLAN',
          name:'Kế hoạch công việc'
        }) 
      },
      data:{
        type:Object,
        default: () => ({}) 
      }
    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' }
        }
    },
    computed:{
      header(){
        return `<span class="icon one-notepad"></span>${this.dictionary.name}`
      },
      editorId1(){
          return 'editor_dictionary_'+this.dictionary.code+'_1'
      },
    },
    methods:{
      showModal() {
          this.$refs["popupDictionaryWork"].show()
      },
      hideModal() {
          this.$refs["popupDictionaryWork"].hide()
      },
      handleShowModal(){
          this.clear()
          setTimeout(()=>{
              this.initPopup()
          },200)
      },
      async initPopup(){
        window.editor1=await ClassicEditor.create(document.querySelector(`#${this.editorId1}`), {
          // Editor configuration.
          extraPlugins: [
            function(editor) {
              AxiosUploadPlugin(editor, 'work/Upload/ImageUpload');
            }
          ]
        })
        //Khởi tạo giá trị
        if(!this.isAdd){
          if(this.data.task_description){
            editor1.setData(this.data.task_description)
          }else{
            editor1.setData('')
          }
        }
      },
      clear(){
        if(document.querySelectorAll(".ck")){
            document.querySelectorAll(".ck").forEach(box => {
                box.remove();
            })
        }
      },
      onSave(){
        if(this.isAdd){
          this.addNewBriefingSummaryDetail()
        }else{
          this.updateBriefingSummaryDetail()
        }
      },
      async addNewBriefingSummaryDetail(){
        const dataDescriptionHtml = editor1.getData()
        let dataRequest={
          briefing_summary_id:this.data.briefing_summary_id,
          dictionary_id:this.dictionary.id,
          task_description:dataDescriptionHtml
        }
        let result=await API.CreateBriefingSummaryDetail(this, dataRequest)
        if(result=='1'){
            this.$toast.success('Tạo thành công!')
            this.$emit('successAddUpdateBriefingSummaryDetail')
            this.hideModal()
        }else{
            this.$toast.error(result)
        }
      },
      async updateBriefingSummaryDetail(){
        const dataDescriptionHtml = editor1.getData()
        let dataRequest={
          briefing_summary_detail_id:this.data.briefing_summary_detail_id,
          briefing_summary_id:this.data.briefing_summary_id,
          dictionary_id:this.dictionary.id,
          task_description:dataDescriptionHtml
        }
        let result=await API.UpdateBriefingSummaryDetail(this, dataRequest)
        if(result=='1'){
            this.$toast.success('Cập nhật thành công!')
            this.$emit('successAddUpdateBriefingSummaryDetail')
            this.hideModal()
        }else{
            this.$toast.error(result)
        }
      }
    }
}
</script>
<style>
#dictionary-work-dialog .e-dlg-header-content .fa {
  font-size: 18px;
  margin-right: 10px;
}
#dictionary-work-dialog .ck-editor__editable {
  min-height: 300px !important;
}
</style>