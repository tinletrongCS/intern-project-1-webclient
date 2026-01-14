<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupTaoKichBan"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        :close="handleClose"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
            <div class="popup-body">
                <div class="row">
                    <div class="col-sm-2 col-12">
                        <span class="text">Chương trình</span>
                    </div>
                    <div class="col-sm-10 col-12">
                        <span class="text">{{CtName}}</span>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px !important;">
                    <div class="col-sm-2 col-12">
                        <span class="text">Kịch bản</span>
                    </div>
                    <div class="col-sm-10 col-12">
                        <div :id="editorId1" class="editor"></div>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px !important;">
                    <div class="col-sm-2 col-12">
                        <span class="text">Tình huống</span>
                    </div>
                    <div class="col-sm-10 col-12">
                        <div :id="editorId2" class="editor"></div>
                    </div>
                </div>
                
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import ActionTop from '@/components/Controls/ActionTop.vue'
import './ckeditor_build/ckeditor.js'
import API from './API'
export default {
    name:'TaoKichBanModal',
    props:{
        CtId:{
            type:String,
            default:''
        },
        CtName:{
            type:String,
            default:''
        },
        action:{
            type:String,
            default:'add'  //add, edit
        }
    },
    components:{
        ActionTop
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad">QUẢN LÝ KỊCH BẢN</span> `,
            actions:[
                {
                    id:'luu',
                    name:'Lưu',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'huy',
                    name:'Hủy',
                    active: true,
                    icon_class:'nc-icon-glyph ui-1_circle-remove'
                }
            ],
            
        }
    },
    computed:{
        editorId1(){
            return 'editor'+this.CtId+'1_'+this.action
        },
        editorId2(){
            return 'editor'+this.CtId+'2_'+this.action
        },
    },
    methods:{
        showModal() {
            this.$refs["popupTaoKichBan"].show()
        },
        hideModal() {
            this.$emit('ok')
            this.$refs["popupTaoKichBan"].hide()
        },
        handleClose(){
            this.$emit('ok')
        },
        onActionClick(action){
            if(action.id=='luu'){
                this.GhiLai()
                
            }else if(action.id=='huy'){
                this.hideModal()
            }
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        clear(){
            if(document.querySelectorAll(".ck")){
                document.querySelectorAll(".ck").forEach(box => {
                    box.remove();
                })
            }
        },
        async initDuLieu(){
            console.log('initDuLieu')
            window.editor1=await ClassicEditor.create(document.querySelector(`#${this.editorId1}`), {
                // Editor configuration.
            })
            window.editor2=await ClassicEditor.create(document.querySelector(`#${this.editorId2}`), {
                // Editor configuration.
            })
            await this.khoiTaoGiaTri()
        },
        async khoiTaoGiaTri(){
            let ct=await this.getProgramById(this.CtId)
            if(ct){
                //Kịch bản
                if(ct.obScript){
                    editor1.setData(ct.obScript)
                }
                //Tình huống
                if(ct.obSituation){
                    editor2.setData(ct.obSituation)
                }
            }
        },
        async GhiLai(){
            const dataKb = editor1.getData()
            const dataTh = editor2.getData()
            console.log('dataKb', dataKb)
            console.log('dataTh', dataTh)
            let formData = new FormData()
            formData.append('obScript', dataKb)
            formData.append('obSituation', dataTh)
            let rs=await this.addKBan(this.CtId, formData, { headers: { 'Content-Type': 'multipart/form-data'}})
            if(rs=='1'){
                this.$toast.success('Tạo thành công!')
            }else{
                this.$toast.error(rs)
            }
        },
        async getProgramById(id){
            try{
                this.loading(true)
                let response = await API.getProgramById(this.axios, id)
                this.loading(false)
                if(response && response.data && response.data&&response.data.id&&response.data.id==id) {
                    return response.data
                }else{
                    return null
                }
            }catch(e){
                this.loading(false)
                return null
            }
        },
        async addKBan(id, data, header){
            try{
                this.loading(true)
                let response = await API.addKBan(this.axios, id, data, header)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code==1) {
                    return '1'
                }else{
                    return response.data.error_msg
                }
            }catch(e){
                this.loading(false)
                return 'Đã xảy ra lỗi, thêm mới không thành công'
            }
        },

    }
}
</script>
<style>
.ck-editor__editable {
  min-height: 200px;
}
</style>