<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupReturnBriefing"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        id="return-briefing-dialog"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                   <div class="info-row" style="table-layout: fixed !important;">
                      <div class="key bold">Lý do trả lại <required-marker/></div>
                      <div class="value">
                        <div :id="editorId1" class="editor"></div>
                      </div>
                    </div>
                    <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                        <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
                            <span class="icon one-save"></span> Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import API from './API'
import '@/utils/ckeditor/ckeditor.js'
import { AxiosUploadPlugin } from '@/utils/ckeditor/AxiosUploadAdapter.js';
export default {
    name:'ReturnBriefingModal',
    props:{
      arrBriefingIds:{
        type: Array,
        default: () => [],
        validator: (val) => val.every(x => Number.isInteger(x))
      }
    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' },
          header:`<span class="fa fa-comments"></span>Trả lại`,
          input_noidung:''
        }
    },
    computed:{
        editorId1(){
            return `editor_return_1`
        },
    },
    methods:{
      showModal() {
          this.$refs["popupReturnBriefing"].show()
      },
      hideModal() {
          this.$refs["popupReturnBriefing"].hide()
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
        //khởi tạo giá trị
        if(this.data.comment){
            editor1.setData(this.data.comment)
        }

      },
      clear(){
        this.input_noidung=''
        if(document.querySelectorAll(".ck")){
            document.querySelectorAll(".ck").forEach(box => {
                box.remove();
            })
        }
      },
      async onSave(){

        const dataHtml = editor1.getData()

        // Loại bỏ các thẻ HTML để kiểm tra nội dung text thực
        const textContent = dataHtml.replace(/<[^>]*>/g, '').trim()

        if (!textContent) {
          this.$toast.error('Vui lòng nhập lý do trả lại!')
          return
        }

        let dataRequest={
          arrIds:JSON.stringify(this.arrBriefingIds),
          comment:dataHtml
        }
        let result=await API.ReturnBriefingSummary(this, dataRequest)
        if(result=='1'){
            this.$toast.success('Thành công!')
            this.$emit('successReturnBriefingSummary')
            this.hideModal()
        }else{
            this.$toast.error(result)
        }
      }
    }
}
</script>
<style>
#return-briefing-dialog .e-dlg-header-content .fa {
  font-size: 18px;
  margin-right: 10px;
}
.ck-editor__editable {
  min-height: 200px;
}
</style>