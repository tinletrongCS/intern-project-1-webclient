<template>
     <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k main-form">
            <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
            <div class="k left-form">
                <div class="k row-item">
                    <span class="k row-detail-item">
                        SLA:
                    </span>
                    <span class="k row-detail-item row-main-detail">
                        {{taskDetail.sla != null ? taskDetail.sla.toFixed(1):0 }} ngày
                    </span>
                </div>
                <div class="k row-item">
                    <span class="k row-detail-item">
                        Assignee:
                    </span>
                    <span class="k row-detail-item row-main-detail">
                        {{  taskDetail.full_name }}
                    </span>
                </div>
                <div class="k row-item">
                    <span class="k row-detail-item">
                        Trạng thái:
                    </span>
                    <span class="k row-detail-item row-main-detail" style="color: red;">
                        {{ taskDetail.progress_name  }}
                    </span>
                </div>
                <div class="k row-item">
                    <span class="k row-detail-item">
                        Comment
                    </span>
                    <span class="k row-detail-item row-main-detail">
                        {{ taskDetail.note  }}
                    </span>
                </div>
                <div class="k row-item">
                    <span class="k row-detail-item">
                        Tiến độ:
                    </span>
                    <span class="k row-detail-item">
                        <progress id="file" :value="taskDetail.progress_id" max="5">6</progress>
                    </span>
                </div>
                
            </div>
            <div class="k right-form">
                
                <div class="k row-item">
                    <span class="k row-detail-item-main">
                        Tên task:
                    </span>
                    <span class="k row-detail-item-main row-main-detail">
                        {{ taskDetail.task_name }}
                    </span>
                </div>
                <div class="k row-item">
                    <span class="k row-detail-item-main">
                       Dịch vụ:
                    </span>
                    <span class="k row-detail-item-main row-main-detail">
                        {{ taskDetail.project_name }}
                    </span>
                </div>
                <div class="k row-item">
                    <span class="k row-detail-item-main">
                        File yêu cầu:
                    </span>
                    <span class="k row-detail-item-main row-main-detail row-main-detail">
                        <a :href='link +"task/" + taskDetail.file_name' target="_blank">{{ taskDetail.file_name }}</a>
                    </span>
                </div>

                <div class="k form-resolve" v-for="(detail,index) in taskDetail.child" :key="index">
                    <div class="k row-item">
                        <span class="k row-detail-item-main">
                            <i class="fa fa-tasks" aria-hidden="true"></i>
                        Loại task:
                        </span>
                        <span class="k row-detail-item-main row-main-detail">
                            {{ detail.type_id == 3? "BA":detail.type_id = 4?"DEV":"TEST" }}
                        </span>
                    </div>
                    <div class="k row-item">
                        <span class="k row-detail-item-main">
                            <i class="fa fa-cubes" aria-hidden="true"></i>
                            Nội dung:
                        </span>
                        <span class="k row-detail-item-main row-main-detail">
                            {{ detail.content }}
                        </span>
                    </div>

                    <div class="k row-item">
                        <span class="k row-detail-item-main ">
                        <i class="fa fa-male" aria-hidden="true"></i>
                        Người thực hiện:
                        </span>
                        <span class="k row-detail-item-main row-main-detail">
                            {{ detail.full_name }}
                        </span>
                    </div>
                    <div class="k row-item">
                        <span class="k row-detail-item-main">
                            <i class="fa fa-calendar-o" aria-hidden="true"></i>
                        Thời gian bắt đầu:
                        </span>
                        <span class="k row-detail-item-main row-main-detail">
                            {{ detail.start_day != null ?formatDate(detail.start_day):"" }}
                        </span>
                        <span class="k row-detail-item-main">
                            <i class="fa fa-calendar-times-o" aria-hidden="true"></i>
                        Thời gian kết thúc:
                        </span>
                        <span class="k row-detail-item-main row-main-detail">
                            {{ detail.end_day != null ? formatDate(detail.end_day):"" }}
                        </span>
                    </div> 
                    <div class="k row-item">
                        <span class="k row-detail-item-main">
                            <i class="fa fa-files-o" aria-hidden="true"></i>
                        File đính kèm:
                        </span>
                        <span class="k row-detail-item-main row-main-detail">
                            <a :href='link +"task_resolve/" + detail.file_name' target="_blank">{{ detail.file_name }}</a>
                        </span>
                    </div>
                    <div class="k row-item">
                        <i class="fa fa-comments-o k " aria-hidden="true"></i>
                        <div class="k form-comment">
                            
                            <div class="k form-user-cmt">
                                <span class="k form-comment-content" v-for="(cmt,index) in detail.comments" :key="index"  >
                                    <i class="fa fa-user k avt-user-cmt" aria-hidden="true"></i>
                                    <span style="font-weight:600">{{ cmt.name_user }}</span>: {{ cmt.comment }} - {{ cmt.content }}
                                </span>
                            </div>

                            <!-- <span class="k row-main-detail">
                                <i class="fa fa-user-o k avt-user-cmt" aria-hidden="true"></i>
                                Nguyen Van Khanh:
                            </span>
                            
                            <span class="k row-detail-item-main">
                            </span>
                            <span class="k row-detail-item">
                                {{ detail.note }}
                            </span> -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- resolve -->
            <ejs-dialog
                    ref='dialogObj'
                    :allowDragging="true"
                    :enableResize="false"
                    :position="{X:'center', Y:'center'}"
                    :visible="false"
                    :showCloseIcon="true"
                    width="50%"
                    :header='titleModal'
                    :isModal='true'>
                    <div class="modal-content popup-box">
                        <div class="popup-body">
                            <div class="box-form col-lg-12 row">
                                <div class="info-row col-lg-12">
                                    <div class="key w120">Nội dung</div>
                                    <div class="value">
                                        <input type="text"  v-model="content" class="form-control"/>
                                    </div>
                                </div>
                                <div class="info-row col-lg-12">
                                    <div class="key w120">Giải trình</div>
                                    <div class="value">
                                        <textarea type="text"  v-model="comment" class="form-control"/>
                                    </div>
                                </div>
                                <div class="info-row col-lg-12">
                                    <div class="key w120">File đính kèm(nếu có)</div>
                                    <div class="value ">
                                        <div class="form-inport-file">
                                            <span class="text-select-file" @click="selectFile">Chọn file</span>
                                            <span class="file-name">{{ fileName }}</span>
                                            <input id="input-file" type="file" v-show="false"/>
                                            <span @click="deleteFile" class="bnt-delete-file"><i class="fa fa-times-circle-o" aria-hidden="true"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="info-row col-lg-12">
                                    <div class="key w120">Assign to:</div>
                                    <div class="value">
                                        <select2  class="select2"  v-model="taskDetail.user_assign" :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                        
                        <div class="group-buttons -bottom center">
                            <button
                                class="btn btn-outline-secondary nocorner"
                                @click="resolveTask"
                                style="width: 120px"
                            >
                            <span>{{ titleButton }}</span>
                            </button>
                        </div>
                    </div>
            </ejs-dialog>
            <!-- assign -->
            <ejs-dialog
                    ref='dialogAssign'
                    :allowDragging="true"
                    :enableResize="false"
                    :position="{X:'center', Y:'center'}"
                    :visible="false"
                    :showCloseIcon="true"
                    width="50%"
                    :header='titleModal'
                    :isModal='true'>
                    <div class="modal-content popup-box">
                        <div class="popup-body">
                            <div class="box-form col-lg-12 row">
                                <div class="info-row col-lg-12">
                                    <div class="key w120">Nội dung</div>
                                    <div class="value">
                                        <textarea type="text"  v-model="commentAssign" class="form-control"/>
                                    </div>
                                </div>
                                <div class="info-row col-lg-12">
                                    <div class="key w120">Assign to:</div>
                                    <div class="value">
                                        <select2  class="select2"  v-model="taskDetail.user_assign" :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="group-buttons -bottom center">
                            <button
                                class="btn btn-outline-secondary nocorner"
                                @click="assignTask"
                                style="width: 120px" >
                            <span>Assign</span>
                            </button>
                        </div>
                    </div>
            </ejs-dialog>
        </div>
    </div>
</template>
<script>
import ActionTop from '@/components/controls/ActionTop.vue';
import TaskDetailApi from './TaskDetailApi';
import WorkPlanApi from '../work_plan/WorkPlanApi';
import moment from 'moment';
const baseURL = import.meta.env.VNPT_API;
export default{
    components:{
        ActionTop
    },
    data(){
        return{
            actions:[
                {
                    id:'resolve',
                    name:'Resolve',
                    active: true,
                    icon_class:'icon fa fa-check'
                },
                {
                    id:'cancel',
                    name:'Close',
                    active: true,
                    icon_class:'icon nc-icon-glyph ui-1_circle-remove'
                },
                {
                    id:'assign',
                    name:'Assign',
                    active: true,
                    icon_class:'icon fa fa-plane'
                },
                {
                    id:'logwork',
                    name:'Log Work',
                    active: true,
                    icon_class:'icon fa fa-hand-o-right'
                },
                {
                    id:'return',
                    name:'Back',
                    active: true,
                    icon_class:'icon fa fa-chevron-circle-left'
                }
            ],
            task_id:0,
            taskDetail:{},
            fileObject:{},
            fileName:"Chưa có file được chọn",
            content:"",
            comment:"",
            link:"",
            titleModal:"Resolve task",
            titleButton:"Resolve",
            listUsers:[],
            header: {
                title: "Chi tiết công việc",
                list: [
                ],
            },
            commentAssign:""
        }
    },
    methods:{
        formatDate(date){
            return moment(date).format('DD/MM/YYYY');
        },
        async getTaskDetail(){
            try{
                this.listUsers = [];
				let response = await TaskDetailApi.getTaskDetail(this.axios,this.task_id);
				if(response.data.success){
                    this.bindingTaskDetail(response.data.data);
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        bindingTaskDetail(data){
            this.taskDetail=data;
            this.actions[0].active =  ((this.taskDetail.isPermission && this.taskDetail.progress_id ==2 || this.taskDetail.progress_id ==4))? true:false ;
            this.actions[1].active =  (this.taskDetail.isPermission && (this.taskDetail.progress_id ==2 || this.taskDetail.progress_id ==4))? true:false ;
            this.actions[2].active =  (this.taskDetail.isPermission)? true:false ;
            this.actions[3].active =  (this.taskDetail.isPermission && (this.taskDetail.progress_id ==1 || this.taskDetail.progress_id ==3))? true:false ;
        },
        onActionClick(action){
            if(action.id=='resolve'){
                this.$refs.dialogObj.show();
                this.titleModal = "Hoàn thành công việc";
                this. titleButton = "Cập nhật" ;
                this.taskDetail.progress_id = this.taskDetail.progress_id;
                //console.log('progress_id',this.taskDetail.progress_id)
            }
            if(action.id=='cancel'){
                this.$refs.dialogObj.show();
                this.titleModal = "Hủy bỏ yêu cầu";
                this. titleButton = "Cập nhật" ;
                this.taskDetail.progress_id = 7;
            }
            if(action.id=='logwork'){
                this.logWorkTask();
            }
            if(action.id=='return'){
                this.$router.go(-1);
            }
            if(action.id=='assign'){
                this.$refs.dialogAssign.show();
            }
        },
        selectFile(){
            var self= this;
            $('#input-file').click();
            $("#input-file").change(function (event) {
                self.readFile(event);
            });
        },
        readFile(event){
            var self= this;
            if(event.target.files[0]==null){
                   self.$toast.warning("Please select a image");
                return;
            }
            else{
                self.fileObject = event.target.files[0];
                self.fileName= event.target.files[0].name;
                
                var reader = new FileReader();
                reader.onload = function (e) {
                    self.imageAuto = e.target.result;
                    // $(".img-preview").css("background-image", "url(" + e.target.result + ")");
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        },
        deleteFile(){
            $('#input-file').val();
            this.fileObject = {};
            this.fileName = "Chưa có file được chọn";
        },
        async resolveTask(){
            try{
                var rq =  new FormData();
                rq.append("task_id",this.taskDetail.task_id);
                rq.append("content",this.content);
                rq.append("comment",this.comment);
                rq.append("file",this.fileObject);
                rq.append("progress_id",this.taskDetail.progress_id);
                // rq.append("user_assign",this.taskDetail.user_assign);
                // this.taskDetail = {};
				let response = await TaskDetailApi.resolveTask(this.axios,rq,{ headers: { 'Content-Type': 'multipart/form-data'}});
				if(response.data.success){
					this.bindingTaskDetail(response.data.data);
                    this.loading(false);
                    this.$refs.dialogObj.hide();
                    this.$toast.success(response.data.message);
                    this.content = "";
                    this.comment = "";
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async getUsers(){
            try{
                this.listUsers = [];
				let response = await WorkPlanApi.getUsers(this.axios)
				if(response.data.success){
					this.listUsers=response.data.data;
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async logWorkTask(){
            try{
                let result = await this.$confirm('Thông báo', "Bạn có muốn Log Work?");
                if (result==0) return;
                else{
                    let response = await TaskDetailApi.logWorkTask(this.axios,this.task_id)
                    if(response.data.success){
                        this.$toast.success(response.data.message);
                        this.loading(false);
                        this.getTaskDetail();
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async assignTask(){
            try{
                var rq = {
                    comment : this.commentAssign,
                    user_id : parseInt(this.taskDetail.user_assign),
                    task_id:  this.taskDetail.task_id
                };
                let response = await TaskDetailApi.assignTask(this.axios,rq)
                if(response.data.success){
                    this.$toast.success(response.data.message);
                    this.loading(false);
                    this.$refs.dialogObj.hide();
                    this.bindingTaskDetail(response.data.data);
                }
                else{
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
    },
    mounted(){
        this.task_id = this.$route.params.id;
        this.getTaskDetail();
        this.getUsers();
        this.link = baseURL.replace("/api","/");
    },
}
</script>
<style src="./TaskDetail.css" scoped></style>