<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddUpdateBriefingSummary"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        id="add-update-briefing-summary-dialog"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                          <div class="key w180 bold">Vai trò R</div>
                          <div class="value">
                              <div class="select-custom" ref="ds_ld">
                                <select2 :settings="{ dropdownParent: $refs['ds_ld'] }"
                                    v-model="user_r_selected" class="select2"
                                    :options="user_list.map(e=>({id:e.user_id, text:e.full_name}))"
                                >
                                </select2>
                            </div> 
                          </div>
                        </div>
                        <div class="info-row">
                          <div class="key w180 bold">Vai trò C</div>
                          <div class="value">
                              <div class="select-custom" ref="ds_ld">
                                <select2 :settings="{ dropdownParent: $refs['ds_ld'] }"
                                    v-model="user_c_selected" class="select2"
                                    :options="user_list.map(e=>({id:e.user_id, text:e.full_name}))"
                                >
                                </select2>
                            </div> 
                          </div>
                        </div>

                      </div>
                      <div class="col-sm-6 col-12">

                        <div class="info-row">
                          <div class="key w180 bold">Vai trò A <required-marker/></div>
                          <div class="value">
                              <div class="select-custom" ref="ds_ld">
                                <select2 :settings="{ dropdownParent: $refs['ds_ld'] }"
                                    v-model="user_a_selected" class="select2"
                                    :options="user_list.map(e=>({id:e.user_id, text:e.full_name}))"
                                >
                                </select2>
                            </div> 
                          </div>
                        </div>

                        <div class="info-row">
                          <div class="key w180 bold">Vai trò I</div>
                          <div class="value">
                              <div class="select-custom" ref="ds_ld">
                                <select2 :settings="{ dropdownParent: $refs['ds_ld'] }"
                                    v-model="user_i_selected" class="select2"
                                    :options="user_list.map(e=>({id:e.user_id, text:e.full_name}))"
                                >
                                </select2>
                            </div> 
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                        <button class="btn btn-second nocorner" @click="onSave" style="width: 180px">
                            <span class="icon one-save"></span> {{labelButtonSave}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import moment from 'moment'
import API from './API'
export default {
    name:'UpdateBriefingSummaryModal',
    props:{
      data:{
        type:Object,
        default: () => ({}) 
      }
    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' },
          user_list:[],
          user_r_selected:0,
          user_a_selected:0,
          user_c_selected:0,
          user_i_selected:0
        }
    },
    computed:{
      header(){
        return `<span class="icon one-notepad"></span> THÔNG TIN BÁO CÁO GIAO BAN CÔNG VIỆC`
      },
      labelButtonSave(){
        return 'Cập nhật'
      }
    },
    methods:{
      showModal() {
          this.$refs["popupAddUpdateBriefingSummary"].show()
      },
      hideModal() {
          this.$refs["popupAddUpdateBriefingSummary"].hide()
      },
      handleShowModal(){
          this.clear()
          setTimeout(()=>{
              this.initPopup()
          },200)
      },
      async initPopup(){
        var users=await API.GetAllUser()
        this.user_list=users.map(x=>{
          return {
            user_id:x.UserId,
            full_name:x.DisplayName??''
          }
        })
        this.user_list.unshift({
            user_id: 0,
            full_name: "Chọn"
        })

        var userId=this.$_root.token.getUserId()
        this.user_a_selected=userId
        

        //Update hiển thị thông tin lên điều chỉnh
        this.user_r_selected=this.data.user_r_id??0
        this.user_a_selected=this.data.user_a_id??0
        this.user_c_selected=this.data.user_c_id??0
        this.user_i_selected=this.data.user_i_id??0
      },
      clear(){
        this.user_r_selected=0
        this.user_a_selected=0
        this.user_c_selected=0
        this.user_i_selected=0
      },
      onSave(){
        this.updateBriefingSummary()
      },
      
      async updateBriefingSummary(){
        if(!this.user_a_selected){
          this.$toast.error('Vui lòng chọn vai trò A!');
          return
        }
        let dataRequest={
          briefing_summary_id:this.data.briefing_summary_id,
          user_r_id:this.user_r_selected,
          user_a_id:this.user_a_selected,
          user_c_id:this.user_c_selected,
          user_i_id:this.user_i_selected
        }
        let result=await API.UpdateBriefingSummary(this, dataRequest)
        if(result=='1'){
            this.$toast.success('Điều chỉnh báo cáo thành công!')
            this.$emit('successUpdateBriefingSummary')
            this.hideModal()
        }else{
            this.$toast.error(result)
        }
      }
    }
}
</script>
<style>
#add-update-briefing-summary-dialog .e-dlg-header-content .fa {
  font-size: 18px;
  margin-right: 10px;
}
#add-update-briefing-summary-dialog .e-dlg-content {
  overflow: visible !important;
}
</style>