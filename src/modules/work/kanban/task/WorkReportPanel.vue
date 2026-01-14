<template>
  <div class="work-report-panel">
    <div class="nav tabs tab-over custom-tabs">
        <a href="#tab1" data-toggle="tab" @click.prevent="changeTab(1)" :class="{active: currentTab==1}">BÁO CÁO</a>
        <a href="#tab2" data-toggle="tab" @click.prevent="changeTab(2)" :class="{active: currentTab==2}">HOẠT ĐỘNG</a>
    </div>
    <div class="tab-content customtab-content">
        <div class="tab-pane" :class="{active: currentTab==1}" id="tab1" >
            <div v-if="!boardClosed">
                <textarea class='form-control' :value="reportText" @change="e=>reportText=e.target.value" placeholder="Báo cáo công việc ..."></textarea>
              
                <!-- Drag & Drop khu vực -->
                <AttachFile ref="attachFileReport"
                    @onSelectFiles="onSelectFiles"
                />
                <div
                  v-for="(file, i) in fileAttachments"
                  :key="i"
                  class="file-item"
                >
                  <a @click.prevent="downloadFile(file)"  class="file-link" style="cursor: pointer;">
                    {{ file.file_name }}
                  </a>
                  <button
                    class="btn-delete"
                    title="Xóa file"
                    @click="onRemoveFile(file)"
                  >
                    ✕
                  </button>
                </div>
                <!-- Nút gửi -->
                <div class="info-row">
                  <div class="value wp100" @click="sendReport" style="margin-top: 10px !important;text-align: right !important;">
                    <button class="btn btn-second" style="width: 180px;margin-top: 10px !important;">
                        Gửi<span class="fa fa-send" style="margin-left: 7px;"></span>
                    </button>
                  </div>
                </div>
            </div>
            <!-- Danh sách file đã gửi -->
            <div class="sent-report" v-if="taskComments.length">
              <div v-for="(comment, i) in taskComments" :key="i" class="report-item">
                <div class="avatar">
                  {{comment.prefix_name}}
                </div>
                <div class="report-info">
                  <!-- <div class="title"><strong>{{comment.user_comment}} đã gửi một báo cáo</strong></div> -->
                  <div class="title">
                    <strong>{{ comment.user_comment }}</strong>
                    <strong 
                      :style="{
                        color: comment.comment_type == 2 
                          ? 'red' 
                          : comment.comment_type == 3 
                            ? 'green' 
                            : 'inherit'
                      }"
                    >
                      <span v-if="!comment.comment_type || comment.comment_type == 1">
                        đã gửi một báo cáo
                      </span>
                      <span v-else-if="comment.comment_type == 2">
                        đã gửi khiếu nại
                      </span>
                      <span v-else-if="comment.comment_type == 3">
                        đã kết thúc khiếu nại
                      </span>
                    </strong>
                  </div>
                  <div class="time">🗓 {{ comment.create_day }}</div>
                  <div class="text">{{ comment.comment }}</div>
                  <div class="file" v-for="(file, j) in comment.files" :key="j">
                    <a @click.prevent="downloadFile(file)"  class="file-link" style="cursor: pointer;">
                      {{ file.file_name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

        </div>
        <div class="tab-pane" :class="{active: currentTab==2}" id="tab2" >
            
            <div class="log-task">
              <div v-for="(log, i) in taskLogs" :key="i" class="log-task-item">
                <div class="avatar">
                  {{log.prefix_name}}
                </div>
                <div class="log-task-info">
                  <!-- Nội dung chi tiết -->
                  <div class="detail">
                    <span class="strong">{{ log.account_name }}&nbsp; </span>
                    <span v-if="log.type === 4 || log.type === 7">{{ log.des1 }}</span>

                    <template v-else>
                      <span>{{ log.des1_label }}</span>
                      <span class="strong strike">{{ log.des1 }}</span>
                      <span> thành </span>
                      <span class="strong">{{ log.des2 }}</span>
                    </template>
                  </div>

                  <div class="create-at">{{ log.create_day }}</div>

                </div>
              </div>
            </div>

        </div>

    </div>
  </div>
</template>
<script>
import AttachFile from './AttachFile.vue'
import API from './API'
import moment from 'moment';
export default {
  name:'WorkReportPanel',
  props: {
    taskId:{
      type:Number,
      default: 0
    },
    boardClosed:{
      type:Boolean,
      default:false
    }
  },
  components:{
    AttachFile
  },
  data() {
    return {
      reportText: '',
      currentTab:1,
      fileAttachments:[],
      baseUrl: import.meta.env.VNPT_API,
      taskComments:[],
      taskLogs:[]

    };
  },
  methods: {
    async initDuLieu(){
      this.clear()
      this.initReportTab()
      this.initActivityTab()
    },
    clear(){
      this.currentTab=1
      this.fileAttachments=[]
      this.reportText=''
      this.taskComments=[]
      this.taskLogs=[]
    },
    changeTab(tab){
      this.currentTab=tab
    },
    async initReportTab(){
      let result=await API.GetTaskComment(this,this.taskId)
      this.taskComments=result.map(x=>{
        x.create_day=moment(x.create_day).format('DD/MM/YYYY HH:mm')
        return x
      })

    },
    async initActivityTab(){
      this.taskLogs=await API.GetTaskLog(this, this.taskId)
    },
    async sendReport() {
      if(!this.reportText||this.reportText.trim()==''){
        return
      }
      var taskCommentRequest = {
        comment:this.reportText.trim(),
        task_id:this.taskId,
        file_attachment_ids:this.fileAttachments.map(x=>x.file_attachment_id)
      }
      let data=await API.AddTaskComment(this, taskCommentRequest)
      if(data=='1'){
          this.fileAttachments=[]
          this.reportText=''
          // load lại comment
          this.initReportTab()
          //
      }else{
          this.$toast.error(data)
      }
    },
    downloadFile(fileAttachment) {
      this.axios.get(`work/Upload/Download`, {
        params: { filePath: fileAttachment.file_path },
        responseType: 'blob',
      })
      .then((response) => {
        // Tạo URL và trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileAttachment.file_name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download lỗi:", error);
      });
    },
    async onRemoveFile(file) {
      let result=await API.DeleteFileAttachment(this, file.file_attachment_id)
      if(result=="1"){
        const index = this.fileAttachments.findIndex(x => x.file_attachment_id == file.file_attachment_id)
        if (index > -1) {
          this.fileAttachments.splice(index, 1)
        }
      }else{
        this.$toast.error(result)
      }
    },
    async onSelectFiles(files){
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      let result=await API.UploadFileTaskComment(this, formData, 0)
      if(Array.isArray(result)){
        this.fileAttachments=this.fileAttachments.concat(result)
      }else{
        this.$toast.error(result)
      }
    },
  }
};
</script>
<style scoped>
.work-report-panel{
  margin-top: 10px !important;
}
.customtab-content {
  border-radius: unset !important;
  border: unset !important;
  box-shadow:unset !important;
  padding: 16px 0px !important;
}
.custom-tabs{
  justify-content: space-between !important;
  /* margin-left: 12px !important;
  margin-right: 12px !important; */
}
.custom-tabs a{
  width:50% !important;
  border: 1px solid #E0E0E0 !important;
}
.custom-tabs a:last-child{
  border-radius: 0px 4px 4px 0px !important
}
.custom-tabs a:first-child {
    border-radius: 4px 0px 0px 4px !important
}
.custom-tabs a.active {
  border-bottom: 3px solid #E0E0E0 !important;
}
textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}

.upload-area {
  border: 2px dashed #aaa;
  background: #f2f2f2;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.upload-area span {
  color: #888;
}

.upload-area button {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.hidden {
  display: none;
}

.btn-send {
  background: green;
  color: white;
  padding: 6px 12px;
  border: none;
  float: right;
  margin-top: 5px;
  cursor: pointer;
}

.sent-report {
  margin-top: 20px;
}

.report-item {
  display: flex;
  margin-top: 10px;
}

.avatar {
  background: #7dc242;
  color: white;
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 7px;
  margin-top: 4px;
}

.report-info {
  flex: 1;
}

.log-task {
  margin-top: 20px;
}

.log-task-item {
  display: flex;
  margin-top: 10px;
}

.log-task-info {
  flex: 1;
}
.strong {
  font-weight: 600;
}
.detail {
  margin-top: 5px;
}
.strike {
  text-decoration: line-through;
}

.create-at {
  font-size: 0.85em;
  color: #888;
  margin-top: 3px;
}

.account-name {
  margin-bottom: 4px;
}

.time {
  font-size: 12px;
  color: gray;
}

.file a {
  color: #0d6efd;
  text-decoration: none;
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #ccc;
}
.file-link {
  color: #007bff;
  text-decoration: none;
  flex-grow: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-delete {
  background: none;
  border: none;
  color: red;
  font-size: 14px;
  cursor: pointer;
}
.text {
  white-space: pre-line;
}
</style>
