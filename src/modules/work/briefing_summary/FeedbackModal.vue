<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupFeedback"
        :showCloseIcon="true"
        width="70%"
        :isModal='true'
        :target="target"
        :header="header"
        id="feedback-dialog"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                      <div class="col-sm-6 col-12">
                        <div class="legend-title" style="margin-bottom: 7px !important;">{{dictionary.name}}</div>
                        <div class="task-description-box" v-html="formatHtml(data.task_description)"></div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="legend-title" style="margin-bottom: 7px !important;">Góp ý</div>
                        <div class="info-row" style="table-layout: fixed !important;">
                          <div class="value" style="padding-left: 0px !important;">
                            <div :id="editorId1" class="editor"></div>
                          </div>
                        </div>
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
    name:'FeedbackModal',
    props:{
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
          animationSettings: { effect: 'Zoom' },
          input_noidung:''
        }
    },
    computed:{
        editorId1(){
            return `editor_feedback_${this.data.briefing_summary_id}`
        },
        header(){
          const label = 
            `Góp ý ${this.dictionary.name.toLowerCase()} ` + 
            (this.data.briefing_type === 1 
              ? this.data.unit_name 
              : `dự án ${this.data.project_name}`);
          return `<span class="fa fa-comments"></span>${label} `
        },
    },
    methods:{
      showModal() {
          this.$refs["popupFeedback"].show()
      },
      hideModal() {
          this.$refs["popupFeedback"].hide()
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
      formatHtml(html) {
        if (!html) return '';
        html = html.replace(
          /<oembed url="https:\/\/www\.youtube\.com\/watch\?v=([^"&]+)[^"]*"><\/oembed>/g,
          '<iframe src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'
        );
        return html;
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
        let dataRequest={
          briefing_summary_id:this.data.briefing_summary_id,
          briefing_summary_detail_id:this.data.briefing_summary_detail_id,
          comment:dataHtml
        }
        let result=await API.FeedbackBriefingSummaryDetail(this, dataRequest)
        if(result=='1'){
            this.$toast.success('Thành công!')
            this.$emit('successFeedbackBriefingSummary')
            this.hideModal()
        }else{
            this.$toast.error(result)
        }
      }
    }
}
</script>
<style>
#feedback-dialog .e-dlg-header-content .fa {
  font-size: 18px;
  margin-right: 10px;
}
#feedback-dialog .ck-editor__editable {
  min-height: 300px;
}
#feedback-dialog .task-description-box {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  height: 340px; /* cùng chiều cao với CKEditor */
  overflow-y: auto; /* cho phép scroll dọc */
  background-color: #fafafa; /* nhẹ nhàng, tách biệt */
  line-height: 1.6;
}
</style>