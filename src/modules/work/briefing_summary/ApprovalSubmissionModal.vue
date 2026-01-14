<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupApprovalSubmission"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="header"
        id="approval-submission-dialog"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                   <div class="info-row">
                      <div class="key w160 bold">LĐ phụ trách phòng <required-marker/></div>
                      <div class="value">
                          <div class="select-custom" ref="ds_ld">
                            <select2 :settings="{ dropdownParent: $refs['ds_ld'] }"
                                v-model="nguoinhan_selected" class="select2"
                                :options="ds_nguoinhan.map(e=>({id:e.user_id, text:e.full_name}))"
                            >
                            </select2>
                        </div> 
                      </div>
                    </div>
                    <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                        <button class="btn btn-second nocorner" @click="approval" style="width: 180px">
                            <span class="icon fa fa-paper-plane"></span> Gửi
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
    name:'ApprovalSubmissionModal',
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
          header:`<span class="fa fa-users"></span>Trình Lãnh Đạo Phụ Trách`,
          nguoinhan_selected:0,
          ds_nguoinhan:[]
        }
    },
    methods:{
      showModal() {
          this.$refs["popupApprovalSubmission"].show()
      },
      hideModal() {
          this.$refs["popupApprovalSubmission"].hide()
      },
      handleShowModal(){
          this.clear()
          setTimeout(()=>{
              this.initPopup()
          },200)
      },
      async initPopup(){
        this.ds_nguoinhan=await API.GetDirectorUsers()
        this.ds_nguoinhan.unshift({
            user_id: 0,
            full_name: "Chọn"
        })
      },
      clear(){
        this.nguoinhan_selected=0
        this.ds_nguoinhan=[]
      },
      async approval(){
        if(!this.nguoinhan_selected){
          this.$toast.error('Vui lòng chọn LĐ phụ trách phòng!')
          return
        }
        //
        let dataRequest={
          approved_user_id:this.nguoinhan_selected,
          arrIds:JSON.stringify(this.arrBriefingIds)
        }
        let result=await API.ApprovalBriefingSummary(this, dataRequest)
        if(result=='1'){
            this.$toast.success('Trình LĐ phụ trách thành công!')
            this.$emit('successApprovalBriefingSummary')
            this.hideModal()
        }else{
            this.$toast.error(result)
        }
      }
    }
}
</script>
<style>
#approval-submission-dialog .e-dlg-header-content .fa {
  font-size: 18px;
  margin-right: 10px;
}
#approval-submission-dialog .e-dlg-content {
  overflow: visible !important;
}
</style>