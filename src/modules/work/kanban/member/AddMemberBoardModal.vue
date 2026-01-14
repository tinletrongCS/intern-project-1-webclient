<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'top'}"
        :visible="false"
        ref="popupAddMemberBoard"
        :showCloseIcon="true"
        width="70%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="info-row">
                        <div class="key w120">Thành viên</div>
                        <div class="value">
                            <ejs-multiselect 
                                id='multiselect'
                                ref="userMultiSelect"
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
    name:'AddMemberBoardModal',
    props:{
        boardId:{
            type:Number,
            default:0
        },
    },
    components:{

    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad"></span> Thông tin thành viên`,
            fields: {
                value: 'UserId',
                text: 'DisplayName'
            },
            memberList:[],
            memberSelects:[]

        }
    },
    methods:{
        showModal() {
            this.$refs["popupAddMemberBoard"].show()
        },
        hideModal() {
            this.$refs["popupAddMemberBoard"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        async initDuLieu(){
            if(this.boardId){
                this.memberList=await API.GetAllUser();
                if(this.memberList.length>0){
                    //Thành viên trong board trừ Owner vs SubOwner -->typerole 3 member
                    let data=await API.GetOnlyMemberByBoard(this, this.boardId)
                    this.memberSelects=data.map(x=>x.UserId);
                }
            }
        },
        clear(){
            this.memberList=[]
            this.memberSelects=[]
        },
        async onSave(){
            if(this.memberSelects.length==0){
                this.$toast.error("Vui lòng chọn thành viên")
                return
            }
            let dataRequest={
                UserIds:this.memberSelects,
                BoardId:this.boardId
            }
            let result=await API.UpdateMembers(this, dataRequest);
            if(result=='1'){
                this.$toast.success("Lưu thông tin thành công");
                this.$emit("addMemberSuccess")
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        }
    },
    mounted() {
        // Truy cập MultiSelect instance
        const instance = this.$refs.userMultiSelect.ej2Instances;

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