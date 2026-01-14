<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupImportDuLieu"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="modal-content popup-box">
                <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
                <div class="popup-body">
                    <div class="box-form">
                        <span class="bold">IMPORT BỔ SUNG DỮ LIỆU: CHƯƠNG TRÌNH {{ten_chuongtrinh.toUpperCase()}}</span><br>
                        <span class="red bold">Tổng số thuê bao: {{tongsotb}}, Tổng số đã phân việc: {{tongsopv}}, Tổng số thuê bao đã thực hiện OutBound:{{thuchienob}}</span><br>
                        
                        <div class="info-row">
                            <div class="key w160">Chọn nguồn dữ liệu</div>
                            <div class="value">
                                <div class="row">
                                    <div class="col-sm-3 col-12">
                                        <button class="btn btn-second" @click="clickChooseFile">
                                            Choose File
                                        </button>
                                        <input ref="fileInput1" id="file1" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
                                    </div>
                                    <div class="col-sm-6 col-12" style="padding-top: 5px !important;">
                                        <span>{{file_full_path}}</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="key w160">Tỷ lệ lọc dữ liệu</div>
                            <div class="value">
                                <div class="select-custom" ref="ds_tyle">
                                    <select2 :settings="{ dropdownParent: $refs['ds_tyle'] }"
                                        v-model="tyle_selected" class="select2"
                                        :options="ds_tyle"
                                    >
                                    </select2>
                                </div> 
                            </div>
                        </div>


                    </div>
                    

                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import ActionTop from '@/components/Controls/ActionTop.vue'
import API from './API'
import moment from 'moment'
export default {
    name:'ImportDuLieuModal',
    props:{
        object:{
            type:Object,
            default:()=>{}
        }
    },
    components:{
        ActionTop
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad"></span> `,
            actions:[
                {
                    id:'ghilai',
                    name:'Ghi lại',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'trove',
                    name:'Trở về',
                    active: true,
                    icon_class:'one-back1'
                }
            ],
            ten_chuongtrinh:'',
            tongsotb:0,
            tongsopv:0,
            thuchienob:0,
            file_full_path:'',
            file:null,
            tyle_selected:10,
            ds_tyle:[
                { id: 10, text: '10%' },
                { id: 20, text: '20%' },
                { id: 30, text: '30%' },
                { id: 40, text: '40%' },
                { id: 50, text: '50%' },
                { id: 60, text: '60%' },
                { id: 70, text: '70%' },
                { id: 80, text: '80%' },
                { id: 90, text: '90%' },
                { id: 100, text: '100%' },
            ],

        }
    },
    methods:{
        showModal() {
            this.$refs["popupImportDuLieu"].show()
        },
        hideModal() {
            this.$refs["popupImportDuLieu"].hide()
        },
        onActionClick(action){
            if(action.id=='ghilai'){
                this.CapNhat()
            }else if(action.id=='trove'){
                this.hideModal()
            }
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        async CapNhat(){
            if(this.file_full_path==''){
                this.$toast.error('Chưa chon file cập nhật!')
                return
            }
            // let dsFiles=event.target.files
            // let formData = new FormData();
            // let sohinh = 0;
            // for(var file of dsFiles) {
            //     formData.append('files', file);
            //     sohinh++;
            // }
            var objectCT={}
            Object.assign(objectCT, this.object)
            objectCT.fillRatio=this.tyle_selected

            
            let formData = new FormData()
            if(this.file){
                formData.append('file', this.file)
                objectCT.fillRatio=this.tyle_selected
            }else{
                formData.append('file', null)
                objectCT.fillRatio=null
            }
            if(objectCT.actionDayFrom){
                objectCT.actionDayFromS=moment(objectCT.actionDayFrom).format('YYYY-MM-DD')
            }
            if(objectCT.actionDayTo){
                objectCT.actionDayToS=moment(objectCT.actionDayToS).format('YYYY-MM-DD')
            }
            let keys=Object.keys(objectCT)
            console.log('keys', keys)
            console.log('objectCT', objectCT)
            for(var i=0;i<keys.length;i++){
                if(keys[i]=='id'||keys[i]=='createdDate'||
                keys[i]=='createdUser'||keys[i]=='modifiedDate'||keys[i]=='modifiedUser'||keys[i]=='progFileInfo'||
                keys[i]=='templateConfig'||keys[i]=='permission'||keys[i]=='tg_th'||keys[i]=='ngay_th'||keys[i]=='dvi_created'||keys[i]=='actionDayFrom'||
                keys[i]=='actionDayTo')continue
                
                if(objectCT[keys[i]]==null)continue

                if(keys[i]=='progFileInfo'||keys[i]=='templateConfig'||keys[i]=='multiDay'){
                    //formData.append(keys[i], JSON.stringify(objectCT[keys[i]]))
                    formData.append(keys[i],null)
                    continue
                }
                formData.append(keys[i], objectCT[keys[i]])
            }

            console.log('formData', formData)
            let rs=await this.editOBProgram(this.object.id, formData, { headers: { 'Content-Type': 'multipart/form-data'}})
            if(rs=='1'){
                this.$toast.success('Import thành công!')
            }else{
                this.$toast.error(rs)
            }

        },
        onChangeFile(event){
            this.file_full_path = event.target.value.split('\\').pop()
            this.file=event.target.files[0]
            console.log('onChangeFile file_full_path', this.file_full_path)
            //this.readFileExcel()
        },
        clickChooseFile(){
            this.$refs.fileInput1.value=null
            document.getElementById("file1").click()
        },
        clear(){
            this.file_full_path=''
            this.file=null
            this.ten_chuongtrinh=''
            this.tongsotb=0
            this.tongsopv=0
            this.thuchienob=0
        },
        async initDuLieu(){
            console.log('initDuLieu', this.object)
            this.ten_chuongtrinh=this.object.name?this.object.name.toString():''
            if(this.object.progFileInfo.length>0){
                this.file_full_path=this.object.progFileInfo[0].originName
            }
            
        },
        async editOBProgram(id, data, header){
            try{
                this.loading(true)
                let response = await API.editOBProgram(this.axios, id, data, header)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code==1) {
                    return '1'
                }else{
                    return response.data.error_msg
                }
            }catch(e){
                this.loading(false)
                return 'Đã xảy ra lỗi, cập nhật không thành công'
            }
        },
    }
}
</script>