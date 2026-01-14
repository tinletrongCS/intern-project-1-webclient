<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupCauHinhTTDL"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-sm-4 col-12">
                            <div class="info-row">
                                <div class="key w120">Chương trình</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_chuongtrinh">
                                        <select2 :settings="{ dropdownParent: $refs['ds_chuongtrinh'] }"
                                            v-model="chuongtrinh_selected" class="select2"
                                            :options="ds_chuongtrinh"
                                            @select="changeChuongTrinh"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 col-12">
                            <div class="info-row">
                                <div class="key w120">Name</div>
                                <div class="value">
                                    <input type="text" ref="inputName" :value="input_name" @change="e=>input_name=e.target.value" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 col-12">
                            <div class="info-row">
                                <div class="key w120">Value</div>
                                <div class="value">
                                    <input type="text" ref="inputValue" :value="input_value" @change="e=>input_value=e.target.value" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-form">
                    <KDataGrid
                        ref="gridDsTTDL"
                        :columns="columns"
                        :dataSource="dataSources"
                        :enable-paging-server="false"
                        :allowPaging="true"
                        :showFilter="true"
                        :allowSorting="false"
                        :showColumnCheckbox="true"
                        :enabledSelectFirstRow="true"
                        :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                        :commands="commands" 
                        :commandColumn="{headerText: 'Thao tác',cellCssClass: 'css1', show: true}"
                        @commandClicked="commandClicked"
                    />
                </div>


            </div>
            <!-- Modal edit value -->
            <ejs-dialog
                :allowDragging="true"
                :enableResize="false"
                :position="{X:'center', Y:'center'}"
                :visible="false"
                ref="popupEditData"
                :showCloseIcon="true"
                width="40%"
                :isModal='true'>
                <div class="modal-content popup-box">
                    <div class="popup-body">
                        <div class="box-form">
                            <div class="info-row">
                                <div class="key w120">Name</div>
                                <div class="value">
                                    <input type="text" readonly :value="objectUpdate.name" @change="e=>objectUpdate.name=e.target.value" class="form-control">
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w120">Value</div>
                                <div class="value">
                                    <input type="text" ref="inputValueUp" :value="objectUpdate.value" @change="e=>objectUpdate.value=e.target.value" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="group-buttons -bottom center">
                        <button
                            class="btn btn-outline-secondary nocorner"
                            @click="clickOK"
                            style="width: 120px"
                        >
                            <span></span>OK
                        </button>
                    </div>
                </div>
            </ejs-dialog>
        </div>
    </ejs-dialog>
</template>
<script>
import ActionTop from '@/components/Controls/ActionTop.vue'
import API from './API'
export default {
    name:'CauHinhThongTinDLModal',
    props:{
        id_ct:{
            type:String,
            default:''
        }
    },
    components:{
        ActionTop
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad">QUẢN LÝ THÔNG TIN DỮ LIỆU CHƯƠNG TRÌNH</span> `,
            actions:[
                {
                    id:'timkiem',
                    name:'Tìm kiếm',
                    active: true,
                    icon_class:'one-search'
                },
                {
                    id:'themmoi',
                    name:'Thêm chương trình',
                    active: true,
                    icon_class:'one-user-add'
                },
                {
                    id:'capnhat',
                    name:'Cập nhật',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'xoa',
                    name:'Xóa',
                    active: true,
                    icon_class:'fa fa-trash'
                },
            ],
            ds_chuongtrinh:[],
            chuongtrinh_selected:null,
            input_name:'',
            input_value:'',
            columns:[
                {
                    fieldName:'row_stt',
                    headerText:'STT',
                    allowFiltering:true,
                    width:'70'
                },
                {
                    fieldName:'name',
                    headerText:'Name',
                    allowFiltering:true,
                },
                {
                    fieldName:'value',
                    headerText:'Value',
                    allowFiltering:true,
                }
            ],
            dataSources:[],
            commands:[
                {
                    name: 'edit',
                    cssClass: 'btn btn-main -ap icon-pen',
                    width: 40,
                    text: '',
                    title: 'Sửa dữ liệu',
                },
                {
                    name: 'xoa_dulieu',
                    cssClass: 'btn btn-main -ap one-trash',
                    width: 40,
                    text: '',
                    title: 'Xóa dữ liệu',
                },
            ],
            objectUpdate:{
                name:'',
                value:''
            }

        }
    },
    methods:{
        showModal() {
            this.$refs["popupCauHinhTTDL"].show()
        },
        hideModal() {
            this.$refs["popupCauHinhTTDL"].hide()
        },
        onActionClick(action){
            if(action.id=='timkiem'){
                this.TimKiem()
            }else if(action.id=='themmoi'){
                this.ThemMoi()
            }else if(action.id=='capnhat'){
                this.CapNhat()
            }else if(action.id=='xoa'){
                this.Xoa()
            }
        },
        async TimKiem(){
            this.objectUpdate.name=''
            this.objectUpdate.value=''
            this.dataSources=await this.getDataProgram(this.chuongtrinh_selected, this.input_name.trim(), this.input_value.trim())
        },
        async ThemMoi(){
            if(this.input_name.trim()==''){
                this.$refs.inputName.focus()
                return
            }
            if(this.input_value.trim()==''){
                this.$refs.inputValue.focus()
                return
            }
            let rs=await this.addDataProgram(this.chuongtrinh_selected, {
                name:this.input_name.trim(),
                value:this.input_value.trim()
            })
            if(rs=='1'){
                this.$toast.success('Thêm thành công')
                this.input_name=''
                this.input_value=''
                this.TimKiem()
            }else{
                this.$toast.error(rs)
            }
        },
        async CapNhat(){
            if(this.objectUpdate.name==''||this.objectUpdate.value==''){
                this.$toast.error('Chọn thông tin cần cập nhập')
                return
            }
            let rs=await this.updateDataProgram(this.chuongtrinh_selected, {
                name:this.objectUpdate.name,
                value:this.objectUpdate.value
            })
            if(rs=='1'){
                this.$toast.success('Cập nhật thành công!')
                this.TimKiem()
            }else{
                this.$toast.error(rs)
            }
        },
        async Xoa(){
            let rowSelecteds=this.$refs.gridDsTTDL.getSelectedRecords()
            if(rowSelecteds.length==0){
                this.$toast.error('Hãy chọn dữ liệu cần xóa!')
                return
            }
            let ids=rowSelecteds.map(x=>x.name)
            let rs=await this.deleteDataProgram(this.chuongtrinh_selected, ids)
            if(rs=='1'){
                this.$toast.success('Xóa dữ liệu thành công!')
                this.TimKiem()
            }else{
                this.$toast.error(rs)
            }

        },
        changeChuongTrinh(){
            this.TimKiem()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        clear(){
            this.ds_chuongtrinh=[]
            this.chuongtrinh_selected=null
            this.input_name=''
            this.input_value=''
            this.objectUpdate.name=''
            this.objectUpdate.value=''
        },
        async initDuLieu(){
            this.ds_chuongtrinh=await this.getAllProgram()
            if(this.ds_chuongtrinh.length>0){
                this.chuongtrinh_selected=this.id_ct!=''?this.id_ct:this.ds_chuongtrinh[0].id
            }
            await this.TimKiem()
        },
        commandClicked(cmdName, rowData){
            console.log('commandClicked', cmdName)
            console.log('commandClicked', rowData)
            if(cmdName=='edit'){
                this.EditDL(rowData)
            }else if(cmdName=='xoa_dulieu'){
                this.XoaDL(rowData)
            }
        },
        async XoaDL(item){
            let rs=await this.deleteDataProgram(this.chuongtrinh_selected, [item.name])
            if(rs=='1'){
                this.$toast.success('Xóa dữ liệu thành công!')
                this.TimKiem()
            }else{
                this.$toast.error(rs)
            }
        },
        EditDL(item){
            this.objectUpdate.name=item.name
            this.objectUpdate.value=item.value

            this.$refs.popupEditData.show()
        },
        clickOK(){
            if(this.objectUpdate.value.trim()==''){
                this.$refs.inputValueUp.focus()
                return
            }
            this.$refs.popupEditData.hide()
            const index=this.dataSources.findIndex(x=>x.name==this.objectUpdate.name)
            if(index>-1){
                this.dataSources[index].value=this.objectUpdate.value
                this.dataSources=this.dataSources.concat([])
            }

        },
        async getAllProgram(){
            try{
                this.loading(true)
                let response = await API.getAllProgram(this.axios)
                this.loading(false)
                if(response && response.data && response.data.collection) {
                    return response.data.collection.map(x=>{
                        return {
                            id:x.id,
                            text:x.name
                        }
                    })
                }else{
                    return []
                }
            }catch(e){
                this.loading(false)
                return []
            }
        },
        async getDataProgram(id, name, value){
            try{
                this.loading(true)
                let response = await API.getDataProgram(this.axios, id, name, value)
                this.loading(false)
                if(response && response.data && response.data.result) {
                    return response.data.result.map((x, index)=>{
                        x.row_stt=index+1
                        return x
                    })
                }else{
                    return []
                }
            }catch(e){
                this.loading(false)
                return []
            }
        },
        async addDataProgram(id, data){
            try{
                this.loading(true)
                let response = await API.addDataProgram(this.axios, id, data)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code==1) {
                    return '1'
                }else{
                    return response.data.error_msg
                }
            }catch(e){
                this.loading(false)
                return 'Đã xảy ra lỗi, thêm không thành công'
            }
        },
        async updateDataProgram(id, data){
            try{
                this.loading(true)
                let response = await API.updateDataProgram(this.axios, id, data)
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
        async deleteDataProgram(id, data){
            try{
                this.loading(true)
                let response = await API.deleteDataProgram(this.axios, id, data)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code==1) {
                    return '1'
                }else{
                    return response.data.error_msg
                }
            }catch(e){
                this.loading(false)
                return 'Đã xảy ra lỗi, xóa không thành công'
            }
        },
    }
}
</script>