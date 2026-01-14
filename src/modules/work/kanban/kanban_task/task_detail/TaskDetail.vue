<template>
    <ejs-dialog
        ref='dialogAssign'
        :allowDragging="true"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible='isModal'
        :showCloseIcon="true"
        width="40%"
        :header='titleModal'
        :isModal='true'
        :close = 'hideDialog'
        >
            <div class="modal-content popup-box">
                <div class="popup-body">
                    <div class="box-form col-lg-12 row">
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Mã</div>
                            <div class="value">
                                <input type="text"  disabled  class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120">Người giao:</div>
                            <div class="value">
                                <input type="text"  disabled  class="form-control"/>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Bảng làm việc:</div>
                                <div class="k value value-select">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Giai đoạn:</div>
                                <div class="k value value-select">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                        </div>

                        <div class="info-row col-lg-12">
                            <div class="key w120">Dự án:</div>
                            <div class="value">
                                <input type="text"  disabled  class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120">Người nhận:</div>
                            <div class="value">
                                <input type="text"  disabled  class="form-control"/>
                            </div>
                        </div>

                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Nhóm công việc:</div>
                                <div class="k value value-select">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Loại công việc:</div>
                                <div class="k value value-select">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Số giờ yêu cầu:</div>
                                <div class="k value value-select">
                                    <input type="text"   class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Số giờ thực hiện:</div>
                                <div class="k value value-select">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Ngày bắt đầu:</div>
                                <div class="k value value-select form-datetime ">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Hạn hoàn thành:</div>
                                <div class="k value value-select form-datetime ">
                                    <input type="text"  disabled  class="form-control"/>
                                </div>
                            </div>
                        </div>

                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Nội dung</div>
                            <div class="value">
                                <textarea type="text"  disabled  class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Link Jira</div>
                            <div class="value">
                                <input type="text"  disabled  class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Diễn giải:</div>
                            <div class="value">
                                <textarea type="text" disabled  class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12 bd-form-report">
                            <div class="k text-title left-form" :class="{'tab-selected': isReportTab }" @click="toggleTab(0)" >
                                BÁO CÁO
                            </div>
                            <div class="k text-title right-form" :class="{'tab-selected': !isReportTab }"  @click="toggleTab(1)" >
                                HOẠT ĐỘNG
                            </div>
                        </div>
                        <div class="k form-cmt-task" v-show="isReportTab">
                            <comment-task :comments= listTest />
                        </div>
                        <div class="k form-log-task" v-show="!isReportTab">
                            <log-task />
                        </div>

                    </div>
                </div>
            </div>
    </ejs-dialog>
</template>
<script>
import CommmentTask  from './comment/CommentTask.vue';
import LogTask from './log_task/LogTask.vue';
export default{
    data(){
        return{
            commentTask:{
                comment_id :0,
                user:"",
                time_comment:"",
                content:""
            },
            listTest:[
                {
                    comment_id : 1,
                    user:"khanhnv.hcm",
                    time_comment:"12/12/2022 08:11",
                    content:"Thời gian qua AT bận quá là bận ạ, nên không post bài đc như trước, hẹn thời gian tới, AT sẽ post trên kênh nhiều hơn nữa nhé ạ"
                },
                 {
                    comment_id : 1,
                    user:"khanhnv.hcm",
                    time_comment:"12/12/2022 08:11",
                    content:"Thời gian qua AT bận quá là bận ạ, nên không post bài đc như trước, hẹn thời gian tới, AT sẽ post trên kênh nhiều hơn nữa nhé ạ"
                }
            ],
            isReportTab:true
        }
    },
    props:{
        titleModal :{
            type:String,
            default:""
        },
        isModal :{
            type:Boolean,
            default:false
        },
        listUsers:{
            type:Array,
            default:[]
        }
    },
    methods:{
        hideDialog(){
            this.$emit('hideDialog');
        },
        editComment(data){
            this.commentTask =data;
        },
        toggleTab(type){
            switch(type){
                case 0:
                    this.isReportTab = true;
                    break;
                case 1:
                    this.isReportTab = false;
                    break;
            }
        }
    },
    components:{
        'comment-task': CommmentTask,
        'log-task':LogTask
    }
}
</script>
<style src="./TaskDetail.css" scoped></style>