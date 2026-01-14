<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupProjectCost"
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
                            <div class="key w180 bold">Dự án<required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='project_selected'
                                    :disabled="isViewDetail"
                                    :options="project_list.map(e=>({id:e.project_id, text:e.project_name}))"
                                    @select="onChangeProject"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Người chi<required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='member_selected'
                                    :disabled="isViewDetail"
                                    :options="member_list.map(e=>({id:e.userId, text:e.fullName}))"
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                   <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Số tiền chưa VAT (VNĐ)<required-marker/></div>
                            <div class="value">
                                <input
                                    type="text"
                                    :value="formattedCurrency" @input="onInput" @keypress="onlyNumberKey"
                                    :disabled="isViewDetail"
                                    class="form-control"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w180 bold">Phân loại chi phí<required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='cost_type_selected'
                                    :disabled="isViewDetail"
                                    :options="cost_type_list.map(e=>({id:e.cost_type_id, text:e.cost_type_name}))"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                    <div class="info-row">
                        <div class="key w180 bold">Ghi chú</div>
                        <div class="value wp100">
                            <textarea  ref="inputDescription" class='form-control' 
                                rows="3" :readonly="isViewDetail" 
                                :value="input_description" 
                                @change="e=>input_description=e.target.value"></textarea>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="key w180 bold">File đính kèm</div>
                        <div class="value wp100">
                            <AttachFile v-if="!isViewDetail" ref="attachFile" 
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
                                v-if="!isViewDetail"
                                class="btn-delete"
                                title="Xóa file"
                                @click="onRemoveFile(file)"
                            >
                                ✕
                            </button>
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
import AttachFile from '../../work/kanban/task/AttachFile.vue';
import API from './API'
export default {
    name:'ProjectCostModal',
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
        AttachFile
    },
    computed:{
      header(){
        if(this.isAdd){
          return `<span class="icon one-notepad"></span> Tạo mới chi phí dự án`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh chi phí dự án`
        }else{
          return `<span class="icon one-notepad"></span> Chi phí dự án`
        }
      },
      formattedCurrency() {
        if (this.input_cost_amount === null || this.input_cost_amount === undefined) return '';
        return this.input_cost_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },

            project_selected:null,
            project_list:[],
            member_selected:null,
            member_list:[],
            cost_type_selected:null,
            cost_type_list:[],
            fileAttachments: [],
            input_cost_amount:'',
            input_description:'',
            
            isAdmin:false
        }
    },
    methods:{
        showModal() {
            this.$refs["popupProjectCost"].show()
        },
        hideModal() {
            this.$refs["popupProjectCost"].hide()
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
                project_name: "Chọn"
            })
            this.project_selected=0

            this.member_list=[]
            this.member_list.unshift({
                userId: 0,
                fullName: "Chọn"
            })
            this.member_selected=0

            this.cost_type_list=await API.GetAllProjectCostType(this)
            if(this.cost_type_list.length>0){
                this.cost_type_selected=this.cost_type_list[0].cost_type_id
            }

            if(this.isViewDetail||(!this.isAdd&&!this.isViewDetail)){
                this.project_selected=this.data.project_id
                this.member_selected=this.data.user_id
                this.cost_type_selected=this.data.cost_type_id
                this.input_cost_amount=this.data.cost_amount?this.data.cost_amount.toString():''
                this.input_description=this.data.description
                if(this.data.file_urls){
                    this.fileAttachments=this.data.file_urls
                }

                if (this.data.project_id && this.data.project_id > 0) {
                    let data = await API.GetProjectMembers(this, this.project_selected)
                    if (data) this.member_list = data
                    this.member_list.unshift({
                        userId: 0,
                        fullName: "Chọn"
                    })
                }
            }

            let checkAdmin=await API.CheckAdmin(this)
            this.isAdmin=checkAdmin=='1'
        },
        clear(){
            this.project_selected=null
            this.project_list=[]
            this.member_selected=null
            this.member_list=[]
            this.cost_type_selected=null
            this.cost_type_list=[]
            this.fileAttachments=[]
            this.input_cost_amount=''
            this.input_description=''
            
            this.isAdmin=false
        },
        onInput(event) {
            // Lấy giá trị chuỗi nhập vào, bỏ dấu chấm
            const rawValue = event.target.value.replace(/\./g, '');
            
            // Cập nhật số vào data
            this.input_cost_amount= rawValue?rawValue.toString():'';

            // Định dạng lại có dấu chấm
            event.target.value = this.formattedCurrency;

            // (Optional) Đưa con trỏ về cuối sau khi format
            this.$nextTick(() => {
                const el = event.target;
                el.selectionStart = el.selectionEnd = el.value.length;
            });
        },
        onlyNumberKey(event) {
            const charCode = event.which ? event.which : event.keyCode;

            if (charCode === 13) {
                return
            }

            if (charCode < 48 || charCode > 57) {
                event.preventDefault(); // chặn không cho nhập
            }
        },
        async onChangeProject() {
            let data = await API.GetProjectMembers(this, this.project_selected)
            if (data) this.member_list = data
            this.member_list.unshift({
                userId: 0,
                fullName: "Chọn"
            })
            this.member_selected=0
        },
        async onSelectFiles(files){
            const formData = new FormData()
            files.forEach(file => formData.append('files', file))
            var ref_id=0
            if(!this.isAdd){
                ref_id=this.data.cost_id
            }
            let result=await API.UploadFileCommon(this, formData, 'project_cost', ref_id)
            if(Array.isArray(result)){
                this.fileAttachments=this.fileAttachments.concat(result)
            }else{
                this.$toast.error(result)
            }
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
        downloadFile(fileAttachment) {
            this.axios.get(`project/Upload/Download`, {
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
        async addProjectCost(){
            //Check
            if(!this.project_selected||this.project_selected<=0){
                this.$toast.error("Bạn chưa chọn dự án")
                return
            }
            if(!this.member_selected||this.member_selected<=0){
                this.$toast.error("Bạn chưa chọn người chi")
                return
            }
            if(!this.input_cost_amount||this.input_cost_amount==''||this.input_cost_amount=='0'){
                this.$toast.error("Bạn chưa nhập Số tiền chưa VAT (VNĐ)")
                return
            }
            if(!this.cost_type_selected||this.cost_type_selected<=0){
                this.$toast.error("Bạn chưa chọn phân loại chi phí")
                return
            }
            //
            let dataRequest={
                project_id: this.project_selected,
                user_id: this.member_selected,
                cost_type_id: this.cost_type_selected,
                cost_amount: Number(this.input_cost_amount.trim()), 
                description: this.input_description,
                file_urls:JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
            }
            let result=await API.AddProjectCost(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successProjectCost')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async updateProjectCost(){
            //Check
            if(!this.project_selected||this.project_selected<=0){
                this.$toast.error("Bạn chưa chọn dự án")
                return
            }
            if(!this.member_selected||this.member_selected<=0){
                this.$toast.error("Bạn chưa chọn người chi")
                return
            }
            if(!this.input_cost_amount||this.input_cost_amount==''||this.input_cost_amount=='0'){
                this.$toast.error("Bạn chưa nhập Số tiền chưa VAT (VNĐ)")
                return
            }
            if(!this.cost_type_selected||this.cost_type_selected<=0){
                this.$toast.error("Bạn chưa chọn phân loại chi phí")
                return
            }
            //
            let dataRequest={
                cost_id:this.data.cost_id,
                project_id: this.project_selected,
                user_id: this.member_selected,
                cost_type_id: this.cost_type_selected,
                cost_amount: Number(this.input_cost_amount.trim()),
                description: this.input_description,
                file_urls:JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
            }
            let result=await API.UpdateProjectCost(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successProjectCost')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async onSave(){
            if(this.isAdd){
                this.addProjectCost()
            }else{
                this.updateProjectCost()
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