<template>
    <div class="info-row col-lg-12 bd-form-cmt-report">
        <div class="k row-report">
            <!-- <i class="fa fa-user icon-user-report k" aria-hidden="true"></i> -->
            <div class="k avt-report-cmt"></div>
            <textarea class="k input-report-text" placeholder="Báo cáo..." name="" id="" v-model="commentTask.content"/>
            <button class="bnt-sent-comment"><i class="fa fa-paper-plane-o icon-sent-cmt" aria-hidden="true"></i>Gửi</button>
        </div>
        <div class="k row-report" v-for="(cmt,index) in comments" :key='index'>
            <div class="k avt-report"></div>
            <div class="k form-detail-report" >
                <div class="k form-title-body-report">
                    {{cmt.user}}
                     đã gửi một thông báo
                </div>
                <div class="k form-time-body-report">
                    <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
                    {{cmt.time_comment}}
                    <span class="btn-edit-comment" title="Edit" @click="editComment(cmt)"><i class="fa fa-pencil" aria-hidden="true"></i></span>
                    <span class="btn-delete-comment" title="Delete" @click="deleteComment(cmt)"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                </div>
                <div class="k form-content-body-report">
                    {{cmt.content}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            commentTask:{
                comment_id :0,
                user:"",
                time_comment:"",
                content:""
            }
        }
    },
    props:{
        comments :{
            type:Object,
            default:{}
        },
    },
    methods:{
        editComment(data){
            this.commentTask= data;
        },
        async deleteComment(cmt){
            let result = await this.$confirm('Thông báo', `Bạn có chắc muốn xóa?`);
            if(result==0) {
            }
        }
    }
}
</script>
<style src="./CommentTask.css" scoped></style>