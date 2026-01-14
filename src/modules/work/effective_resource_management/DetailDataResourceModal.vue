<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupDataResourceDetail"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Mã công việc</div>
                            <div style="display: flex !important;align-items: center !important;">
                                <div class="value" style="flex: 1 !important;">
                                    <input type="text" disabled :value="input_ma" @change="e=>input_ma=e.target.value" class="form-control">
                                </div>
                                <div class="value w30 custom-value-btn" style="margin-left: 5px !important;">
                                    <button class="btn btn-second" @click="copyToClipboard(input_ma)">
                                    <span class="-ap icon-documents"></span>
                                </button>
                                </div>
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Dự án <required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='project_selected'
                                    :disabled="isViewDetail"
                                    :options="project_list.map(e=>({id:e.project_id, text:`${e.project_name} ${e.project_code ? '- ' + e.project_code : ''}`}))"
                                    @select="onProjectChange"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6 col-12">
                    <div class="info-row">
                        <div class="key w180 bold">Bảng làm việc<required-marker/></div>
                        <div class="value wp100">
                            <div class="select-custom" ref="ds_board">
                                <select2 :settings="{ dropdownParent: $refs['ds_board'] }"
                                    v-model="board_selected" class="select2"
                                    :options="board_list.map(e=>({id:e.board_id, text:e.board_name}))"
                                    @select="onBoardChange"
                                >
                                </select2>
                            </div> 
                        </div>
                    </div>
                    </div>
                    <div class="col-sm-6 col-12">
                    <div class="info-row">
                        <div class="key w180 bold">Giai đoạn<required-marker/></div>
                        <div class="value wp100">
                            <div class="select-custom" ref="ds_giaidoan">
                                <select2 :settings="{ dropdownParent: $refs['ds_giaidoan'] }"
                                    v-model="step_selected" class="select2"
                                    :options="step_list.map(e=>({id:e.step_id, text:e.step_name}))"
                                >
                                </select2>
                            </div> 
                        </div>
                    </div>
                    </div>
                </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Vai trò R <required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='role_r_selected'
                                    :disabled="isViewDetail"
                                    :options="user_list.map(e => ({id: e.user_id, text: e.full_name}))"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Vai trò A <required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='role_a_selected'
                                    :disabled="isViewDetail"
                                    :options="user_list.map(e => ({id: e.user_id, text: e.full_name}))"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Vai trò C </div>
                            <div class="value">
                                <select2 
                                    v-model='role_c_selected'
                                    :disabled="isViewDetail"
                                    :options="user_list.map(e => ({id: e.user_id, text: e.full_name}))"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Vai trò I </div>
                            <div class="value">
                                <select2 
                                    v-model='role_i_selected'
                                    :disabled="isViewDetail"
                                    :options="user_list.map(e => ({id: e.user_id, text: e.full_name}))"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Ngày bắt đầu dự kiến<required-marker/></div>
                            <div class="value wp100">
                                <div class="input-icon-right">
                                    <ejs-datepicker
                                        v-model="ngay_batdau"
                                        format='dd/MM/yyyy'
                                        :showClearButton='false'
                                        :allowEdit="true"
                                        :strict-mode="true"
                                        :enabled="!isViewDetail"
                                        locale="vi"
                                        @change="changeNgayBD"
                                        :firstDayOfWeek="1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Ngày kết thúc dự kiến<required-marker/></div>
                            <div class="value wp100">
                                <div class="input-icon-right">
                                    <ejs-datepicker
                                        v-model="ngay_ketthuc"
                                        format='dd/MM/yyyy'
                                        :showClearButton='false'
                                        locale="vi"
                                        :enabled="!isViewDetail"
                                        :allowEdit="true"
                                        :strict-mode="true"
                                        @change="changeNgayKT"
                                        :firstDayOfWeek="1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Thời lượng dự kiến<required-marker/></div>
                            <div class="value">
                                <input
                                    type="number"
                                    :value="input_sogioyc" @change="e=>input_sogioyc=e.target.value"
                                    :min="0"
                                    :max="100"
                                    :step="0.25"
                                    :disabled="isViewDetail"
                                    class="form-control"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Số giờ yêu cầu (h) <required-marker/></div>
                            <div class="value">
                                <input
                                    type="number"
                                    :value="input_sogiotieuchuan" @change="e=>input_sogiotieuchuan=e.target.value"
                                    :min="0"
                                    :max="100"
                                    :step="0.25"
                                    :disabled="isViewDetail"
                                    class="form-control"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-sm-12 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Nội dung<required-marker/></div>
                            <div class="value wp100">
                                <textarea  ref="inputNoiDung" class='form-control' rows="3" :readonly="isViewDetail" :value="input_noidung" @change="e=>input_noidung=e.target.value"></textarea>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Mô tả giao phẩm<required-marker/></div>
                            <div class="value wp100">
                                <textarea  ref="inputMota" class='form-control' rows="3" :readonly="isViewDetail" :value="input_mota" @change="e=>input_mota=e.target.value"></textarea>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div v-if="!isViewDetail" class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
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
import moment from 'moment'
import API from './API'
export default {
    name:'DetailDataResourceModal',
    props:{
      isAdd:{
        type:Boolean,
        default:false
      },
      isViewDetail:{
        type:Boolean,
        default:true
      },
      data:{
        type:Object,
        default: () => ({})
      }
    },
    components:{

    },
    computed:{
      header(){
        if(this.isAdd){
          return `<span class="icon one-notepad"></span> Tạo mới nguồn lực`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh nguồn lực`
        }else{
          return `<span class="icon one-notepad"></span> Thông tin nguồn lực`
        }
      },
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },

            user_list:[],
            project_list:[],
            project_selected:null,
            board_list:[],
            board_selected:null,
            step_list:[],
            step_selected:null,
            role_r_selected:0,
            role_a_selected:0,
            role_c_selected:0,
            role_i_selected:0,
            input_ma:'',
            input_noidung:'',
            input_mota:'',
            input_sogiotieuchuan:'',
            input_sogioyc:'',
            input_sogiothuchien:'',
            ngay_batdau:moment(new Date()).format('DD/MM/YYYY'),
            ngay_ketthuc:moment(new Date()).format('DD/MM/YYYY'),
            ngay_batdau_tt:moment(new Date()).format('DD/MM/YYYY'),
            ngay_ketthuc_tt:moment(new Date()).format('DD/MM/YYYY'),
            isAdmin:false
        }
    },
    methods:{
        showModal() {
            this.$refs["popupDataResourceDetail"].show()
        },
        hideModal() {
            this.$refs["popupDataResourceDetail"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        async initDuLieu(){
            this.project_list=await API.GetAllProject(this)
            this.project_list.unshift({
                project_id: 0,
                project_code: "",
                project_name: "Chọn"
            })
            this.project_selected=0

            if(this.isViewDetail||(!this.isAdd&&!this.isViewDetail)){
                this.project_selected=this.data.project_id
                this.role_r_selected=this.data.role_r_id
                this.role_a_selected=this.data.role_a_id
                this.role_c_selected=this.data.role_c_id??0
                this.role_i_selected=this.data.role_i_id??0
                this.input_ma=this.data.work_code
                this.input_noidung=this.data.work_name
                this.input_mota=this.data.description
                this.input_sogiotieuchuan=this.data.progress_note
                this.input_sogioyc=this.data.plan_duration_time
                this.ngay_batdau=this.data.schedule_start_display
                this.ngay_ketthuc=this.data.schedule_end_display
                await this.initStepByTask()
                await this.initBoard()
                await this.initStep()
                await this.initUser()
                
            }

            let checkAdmin=await API.CheckAdmin(this)
            this.isAdmin=checkAdmin=='1'
        },
        async initStepByTask(){
            var step_init=await API.GetBoardByTaskCode(this, this.input_ma)
            if(step_init){
                this.board_selected=step_init.board_id
                this.step_selected=step_init.step_id
            }
        },
        async initBoard(){
            this.board_list=await API.GetBoardByProject(this, this.project_selected)
            if(this.board_list.length==1){
                this.board_selected=this.board_selected && this.board_selected > 0 ? this.board_selected : this.board_list[0].board_id
            }
            this.board_list.unshift({
                board_id:0,
                board_name:'Chọn'
            })
        },
        async initStep(){
            this.step_list=await API.GetStepByBoardID(this, this.board_selected)
            if(this.step_list.length==1){
                this.step_selected=this.step_selected && this.step_selected > 0 ? this.step_selected : this.step_list[0].step_id
            }
            this.step_list.unshift({
                step_id:0,
                step_name:'Chọn'
            })
        },
        async initUser(){
            let data=await API.GetUserMemberByBoardId(this, this.board_selected)

            if(data){
                this.user_list=data.slice()
            }
            this.user_list.unshift({
                user_id:0,
                full_name:"Chọn"
            })
        },
        clear(){
            this.board_selected=0
            this.board_list=[
                {
                    board_id:0,
                    board_name:'Chọn'
                }
            ]
            this.step_selected=0
            this.step_list=[
                {
                    step_id:0,
                    step_name:'Chọn'
                }
            ]
            this.project_list=[]
            this.project_selected=null
            this.user_list=[
                {
                    user_id:0,
                    full_name:"Chọn"
                }
            ]
            this.role_a_selected=0
            this.role_r_selected=0
            this.role_c_selected=0
            this.role_i_selected=0
            
            this.input_ma=''
            this.input_noidung=''
            this.input_mota=''
            this.input_sogiotieuchuan=''
            this.input_sogioyc=''
            this.input_sogiothuchien=''
            this.ngay_batdau=moment(new Date()).format('DD/MM/YYYY')
            this.ngay_ketthuc=moment(new Date()).format('DD/MM/YYYY')
            
            this.isAdmin=false
        },
        async onProjectChange(){
            this.board_selected=0
            this.step_selected=0
            await this.initBoard()
            if (this.board_selected > 0) {
                this.initStep()
                this.initUser()
            }
        },
        onBoardChange(){
            this.step_selected=0
            this.role_r_selected=0
            this.role_a_selected=0
            this.role_c_selected=0
            this.role_i_selected=0
            this.initStep()
            this.initUser()
        },
        changeNgayBD(event){
            this.ngay_batdau=moment(event.value).format('DD/MM/YYYY')
        },
        changeNgayKT(event){
            this.ngay_ketthuc=moment(event.value).format('DD/MM/YYYY')
        },
        copyToClipboard(value){
            if (!value || value == '') return;
            var result = value.toString().split('-');
            const textarea = document.createElement('textarea');
            textarea.value = result[0];
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.$toast.success('Copied!')
        },
        validate(){
            if(!this.project_selected||this.project_selected==0){
                this.$toast.error("Bạn chưa chọn Dự án")
                return false
            }
            if(!this.board_selected||this.board_selected==0){
                this.$toast.error("Bạn chưa chọn Bảng làm việc")
                return false
            }
            if(!this.step_selected||this.step_selected==0){
                this.$toast.error("Bạn chưa chọn Giai đoạn")
                return false
            }
            if(!this.input_noidung||this.input_noidung.trim()==''){
                this.$toast.error("Bạn chưa nhập nội dung công việc")
                return false
            }
            if(!this.input_mota||this.input_mota.trim()==''){
                this.$toast.error("Bạn chưa nhập Mô tả giao phẩm")
                return false
            }
            if(!this.role_r_selected||this.role_r_selected==0){
                this.$toast.error("Bạn chưa chọn Vai trò R")
                return false
            }
            if(!this.role_a_selected||this.role_a_selected==0){
                this.$toast.error("Bạn chưa chọn Vai trò A")
                return false
            }
            if(!this.input_sogioyc||this.input_sogioyc==0){
                this.$toast.error("Bạn chưa nhập Thời lượng dự kiến")
                return false
            }
            var value = Number(this.input_sogioyc);
            if (!value || value <= 0) {
                this.$toast.error("Bạn chưa nhập Thời lượng dự kiến");
                return false;
            }
            if(!this.input_sogiotieuchuan||this.input_sogiotieuchuan==0){
                this.$toast.error("Bạn chưa nhập Số giờ yêu cầu")
                return false
            }
            var value1 = Number(this.input_sogiotieuchuan);
            if (!value1 || value1 <= 0) {
                this.$toast.error("Số giờ yêu cầu phải lớn hơn 0");
                return false;
            }

            return true
        },
        async addDataResource(){
            //Check
            if (!this.validate()) return;
            //
            let dataRequest={
                project_id:this.project_selected,
                work_code:'',
                work_name:this.input_noidung,
                description:this.input_mota,
                role_r_id:this.role_r_selected,
                role_a_id:this.role_a_selected,
                role_c_id:this.role_c_selected,
                role_i_id:this.role_i_selected,
                progress_note:this.input_sogiotieuchuan,
                plan_duration_time:this.input_sogioyc,
                schedule_start: moment(this.ngay_batdau,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
                schedule_end: moment(this.ngay_ketthuc,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
            }
            let result=await API.AddDataResource(this, this.step_selected, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successDataResource')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async updateDataResource(){
            
            //Check
            if (!this.validate()) return;
            //
            let dataRequest={
                resource_id:this.data.resource_id,
                project_id:this.project_selected,
                work_code:this.input_ma,
                work_name:this.input_noidung,
                description:this.input_mota,
                role_r_id:this.role_r_selected,
                role_a_id:this.role_a_selected,
                role_c_id:this.role_c_selected,
                role_i_id:this.role_i_selected,
                progress_note:this.input_sogiotieuchuan,
                plan_duration_time:this.input_sogioyc,
                schedule_start: moment(this.ngay_batdau,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
                schedule_end: moment(this.ngay_ketthuc,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
            }
            let result=await API.UpdateDataResource(this, this.step_selected, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successDataResource')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async onSave(){
            if(this.isAdd){
                this.addDataResource()
            }else{
                this.updateDataResource()
            }
        },
    }
}
</script>
<style scoped>
.custom-value-btn{
    min-width: 40px !important;
    display: flex !important;
    justify-content: center !important;
}
</style>