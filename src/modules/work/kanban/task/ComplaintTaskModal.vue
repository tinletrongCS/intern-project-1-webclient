<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupComplaintTask"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="info-row">
                        <div class="key w120 bold">Nội dung<required-marker/></div>
                        <div class="value wp100">
                            <textarea  ref="inputNoiDung" class='form-control' rows="2" :value="input_noidung" @change="e=>input_noidung=e.target.value"></textarea>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="key w120 bold">Người xử lý<required-marker/></div>
                        <div class="value">
                            <ejs-multiselect 
                                id='multiselectComplaintTask'
                                ref="userMultiSelectComplaintTask"
                                :dataSource="memberList" 
                                placeholder="Chọn" 
                                v-model="memberSelects" 
                                :fields='fields' 
                                :allowFiltering="true" 
                                :maximumDisplayCount="0"
                                filterType="Contains">
                            </ejs-multiselect>
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
export default {
    name:'ComplaintTaskModal',
    props:{
        boardId:{
            type:Number,
            default:0
        },
        taskId:{
            type:Number,
            default:0
        }
    },
    components:{

    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad"></span> THÔNG TIN KHIẾU NẠI`,
            fields: {
                value: 'user_id',
                text: 'full_name'
            },
            memberList:[],
            memberSelects:[],
            input_noidung:''

        }
    },
    methods:{
        showModal() {
            this.$refs["popupComplaintTask"].show()
        },
        hideModal() {
            this.$refs["popupComplaintTask"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        async initDuLieu(){
            if(this.boardId){
                this.memberList=await API.GetUserMemberByBoardId(this, this.boardId)
            }
        },
        clear(){
            this.memberList=[]
            this.memberSelects=[]
            this.input_noidung=''
        },
        async onSave(){
            if(this.input_noidung.trim()==''){
                this.$toast.error("Vui lòng nhập thông tin khiếu nại")
                this.$refs.inputNoiDung.focus()
                return
            }
            if(this.memberSelects.length==0){
                this.$toast.error("Vui lòng chọn người xử lý")
                return
            }
            let rs = await this.$confirm('Xác nhận', 'Bạn có chắc chắn muốn gửi khiếu nại?');
            if(rs==0) return

            let dataRequest={
                task_id:this.taskId,
                complaint_content:this.input_noidung.trim(),
                complaint_user:JSON.stringify(this.memberSelects)
            }
            let result=await API.ComplaintTask(this, dataRequest);
            if(result=='1'){
                this.$toast.success("Lưu thông tin thành công");
                this.$emit("complaintSuccess")
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        }
    },
    mounted() {
        // Truy cập MultiSelect instance
        const instance = this.$refs.userMultiSelectComplaintTask.ej2Instances;

        // Ghi đè hàm updateDelimView để vô hiệu hóa collapse
        instance.updateDelimView = function () {
            // Không làm gì cả -> giữ nguyên chip view
        };
    }
}
</script>
<style>
.e-multiselect.e-box .e-chips-collection {
  max-height: 80px; /* Chiều cao tối đa */
  overflow-y: auto; /* Bật scroll */
}
</style>