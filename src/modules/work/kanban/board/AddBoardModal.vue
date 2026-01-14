<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddBoard"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="header"
        id="add-board-dialog"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <div class="info-row">
                      <div class="key w120">Tên bảng<required-marker  v-if="!viewFlg"/></div>
                      <div class="value">
                          <input type="text" ref="inputBoardName" :value="input_board_name" @change="e=>input_board_name=e.target.value" :disabled="disabled" class="form-control">
                      </div>
                  </div>
                  <div class="info-row" v-if="viewFlg">
                      <div class="key w120">Chủ bảng</div>
                      <div class="value">
                          <input type="text" :value="input_owner_name" @change="e=>input_owner_name=e.target.value" disabled class="form-control">
                      </div>
                  </div>
                  <div class="info-row">
                      <div class="key w120">Loại bảng<required-marker  v-if="!viewFlg"/></div>
                      <div class="value wp100">
                          <select2 
                              v-model='board_type_selected'
                              :options="board_type_list.map(e=>({id:e.boardtype_id, text:e.type_name}))"
                              :disabled="disabled"
                          />
                      </div>
                  </div>
                  <div class="info-row">
                    <div class="key w120">Dự án <required-marker v-if="(board_type_selected == 1)&&!viewFlg"/></div>
                    <div class="value wp100">
                      <div class="select-custom" ref="project_list">
                        <select2 :settings="{ dropdownParent: $refs['project_list'] }"
                            v-model="project_selected" class="select2"
                            :disabled="(board_type_selected != 1)||disabled"
                            :options="project_list.map(e=>({id:e.project_id, text:e.project_name}))"
                        >
                        </select2>
                    </div>
                    </div>
                  </div>
                  <div class="info-row">
                      <div class="key w120">Telegram ID</div>
                      <div class="value">
                          <input type="text" :value="input_telegram_id" :disabled="disabled" @change="e=>input_telegram_id=e.target.value" class="form-control">
                      </div>
                  </div>
                  <div class="info-row" v-if="viewFlg">
                      <div class="key w120">Trạng thái</div>
                      <div class="value">
                          <input type="text" 
                          :value="input_status" 
                          @change="e=>input_status=e.target.value" disabled class="form-control"
                          :class="{'status-board-closed': data.is_closed, 'status-board-active': !data.is_closed}"
                          >
                      </div>
                  </div>
                  <div class="info-row-custom" v-if="ownerBoardFlg||!viewFlg">
                    <div>Thành viên trong bảng được phép thêm thành viên mới</div>
                    <div>
                      <Ostoggle v-model="isOn" @change="onToggleChanged" />
                    </div>
                  </div>
                  <div class="info-row-custom" v-if="ownerBoardFlg||!viewFlg">
                    <div>Hạn chế quyền xem chi tiết công việc</div>
                    <div>
                      <Ostoggle v-model="isOnRestrictViewTask" @change="onToggleRestrictViewTaskDetailChanged" />
                    </div>
                  </div>
                  <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;" v-if="!viewFlg">
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
import Ostoggle from '../../../../components/controls/Ostoggle.vue'
export default {
    name:'AddBoardModal',
    props:{
      viewFlg:{
        type:Boolean,
        default:false
      },
      data:{
        type:Object,
        default: () => ({}) 
      }
    },
    components:{
      Ostoggle
    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' },
          header:`<span class="icon one-notepad"></span>THÔNG TIN BẢNG`,
          input_board_name:'',
          board_type_selected:null,
          board_type_list:[],
          project_selected:0,
          project_list:[],
          input_telegram_id:'',
          disabled:false,
          input_owner_name:'',
          isOn:false,
          ownerBoardFlg:false,
          input_status:'',
          isOnRestrictViewTask:false
        }
    },
    methods:{
        showModal() {
            this.$refs["popupAddBoard"].show()
        },
        hideModal() {
            this.$refs["popupAddBoard"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initPopup()
            },200)
        },
        async initPopup(){
          this.disabled=this.viewFlg
          this.board_type_list=await API.GetBoardTypes(this)
          if(this.board_type_list.length>0){
          this.board_type_selected=this.board_type_list[0].boardtype_id
          }

          this.project_list=await API.GetAllProject(this)
          this.project_list.unshift({
            project_id:0,
            project_name:'Chọn'
          })
          this.project_selected=0

          if(this.viewFlg&&this.data){
            this.board_type_selected=this.data.boardtype_id?this.data.boardtype_id:null
            this.input_board_name=this.data.board_name?this.data.board_name:''
            this.input_telegram_id=this.data.telegram_id?this.data.telegram_id.toString():''
            this.project_selected=this.data.project_id?this.data.project_id:null
            this.isOn=this.data.can_add_member!=null?this.data.can_add_member:false
            this.isOnRestrictViewTask=this.data.is_task_detail_restricted!=null?this.data.is_task_detail_restricted:false
            this.input_status=this.data.is_closed?'Đang đóng':'Đang hoạt động'

            this.input_owner_name=await API.GetOwnerNameByBoardId(this, this.data.board_id)

            let rs=await API.CheckSubOwnerOrOwner(this, this.data.board_id)
            this.ownerBoardFlg=rs.isOwner
          }
        },
        async onToggleChanged(val) {
          //Chế độ view là chủ board bật cho cập nhật
          if(this.viewFlg&&this.ownerBoardFlg){
            var can_add_member=val
            let request={
              board_id:this.data.board_id,
              can_add_member:can_add_member?1:0
            }
            let result=await API.UpdateCanAddMemberBoard(this, request)
            if(result=='1'){
              this.$toast.success('Thành công!')
              this.$emit('successToggleChanged')
            }else{
              this.isOn=!can_add_member
              this.$toast.error(result)
            }
          }
        },
        async onToggleRestrictViewTaskDetailChanged(val){
          //Chế độ view là chủ board bật cho cập nhật
          if(this.viewFlg&&this.ownerBoardFlg){
            var is_task_detail_restricted=val
            let request={
              board_id:this.data.board_id,
              is_task_detail_restricted:is_task_detail_restricted?1:0
            }
            let result=await API.UpdateTaskDetailRestrictedBoard(this, request)
            if(result=='1'){
              this.$toast.success('Thành công!')
              this.$emit('successToggleRestrictViewTaskDetailChanged')
            }else{
              this.isOn=!can_add_member
              this.$toast.error(result)
            }
          }
        },
        clear(){
          this.input_board_name=''
          this.board_type_selected=null
          this.board_type_list=[]
          this.project_selected=0
          this.project_list=[]
          this.input_telegram_id=''
          this.disabled=false
          this.isOn=false
          this.ownerBoardFlg=false
          this.input_status=''
          this.input_owner_name=''
          this.isOnRestrictViewTask=false
        },
        async onSave(){
          if(this.input_board_name.trim()==''){
            this.$toast.error("Vui lòng nhập tên bảng")
            this.$refs.inputBoardName.focus()
            return
          }
          if(this.board_type_selected==1&&this.project_selected==0){
            this.$toast.error("Đối với board dự án, bạn phải chọn dự án cho board")
            return
          }
          
          var rq = {
            board_name : this.input_board_name.trim(),
            telegram_id : this.input_telegram_id.trim(),
            listUsers : [],
            boardtype_id : this.board_type_selected,
            project_id: this.project_selected?this.project_selected:null,
            can_add_member:this.isOn?1:0,
            is_task_detail_restricted:this.isOnRestrictViewTask?1:0,
            is_director:true
          }
          let rs = await API.InsertBoard(this,rq)
          if ((typeof rs === 'number')&&rs > 0) {
            this.$emit('insertBoardSuccess', rs)
            this.hideModal()
          } else{
            this.$toast.error(rs)
          }

        }
    },
    mounted() {
        
    }
}
</script>
<style>
#add-board-dialog .e-dlg-content {
  overflow: visible !important;
}
#add-board-dialog .info-row-custom {
  display: flex;
  justify-content: space-between; 
  align-items: center;
}
#add-board-dialog  .status-board-closed {
  color: #dc3545;
}

#add-board-dialog  .status-board-active {
  color: #28a745;
}
</style>