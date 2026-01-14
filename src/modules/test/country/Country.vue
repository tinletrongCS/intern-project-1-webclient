<template>
    <div class="main-wrapper">
        <breadcrumb :header="header" />
        <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
        <div class="page-content">
            <div class="box-form">
                <div class="legend-title">
                    Thông tin

                </div>
                <div class="row">
                    <div class="col-sm-3 col-12">
                        <div class="info-row">
                            <div class="key w90">Code</div>
                            <div class="value">
                                <input type="text" ref="inputCode" :value="input_code" @change="e=>input_code=e.target.value" class="form-control" >
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 col-12">
                        <div class="info-row">
                            <div class="key w90">Name</div>
                            <div class="value">
                                <input type="text" ref="inputName" :value="input_name" @change="e=>input_name=e.target.value" class="form-control" >
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-12">
                        
                    </div>
                </div>

            </div>
            <div class="box-form">
                <div class="legend-title">
                    Danh sách
                </div>
                <KDataGrid
                    ref="gridDs"
                    :columns="columns"
                    :dataSource="dataSources"
                    :enable-paging-server="false"
                    :allowPaging="true"
                    :showFilter="true"
                    :allowSorting="false"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="true"
                    :allowTextWrap="true"
                     @onRowSelected="onSelectedRow"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                />
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/Controls/breadcrumb.vue'
import ActionTop from '@/components/Controls/ActionTop.vue'
import API from './API'
export default {
    name:'Country',
    components:{
        breadcrumb, ActionTop
    },
    data(){
        return {
            header: {
                title: "Nhập thông tin quốc gia",
                list: [
                ],
            },
            actions:[
                {
                    id:'danhsach',
                    name:'Danh sách',
                    active: true,
                    icon_class:'one-file-search'
                },
                {
                    id:'nhapmoi',
                    name:'Nhập mới',
                    active: true,
                    icon_class:'one-file-plus'
                },
                {
                    id:'ghilai',
                    name:'Ghi lại',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'huy',
                    name:'Huỷ',
                    active: true,
                    icon_class:'nc-icon-glyph ui-1_circle-remove'
                },
                {
                    id:'xoa',
                    name:'Xoá',
                    active: true,
                    icon_class:'one-trash'
                },
            ],
            columns:[
                {
                    fieldName:'country_code',
                    headerText:'Code',
                    allowFiltering:true,
                    width:'70'
                },
                {
                    fieldName:'country_name',
                    headerText:'Name',
                    allowFiltering:true,
                },
            ],
            dataSources:[],
            input_code:'',
            input_name:'',
            id:''

        }
    },
    methods:{
        onActionClick(action){
            if(action.id=='danhsach'){
                this.DanhSach()
            }else if(action.id=='nhapmoi'){
                this.setActiveActions(1)
            }else if(action.id=='ghilai'){
                this.GhiLai()
            }else if(action.id=='huy'){
                this.setActiveActions(2)
            }else if(action.id=='xoa'){
                this.Xoa()
            }
        },
        setActiveActions(kieu){
            for(let i=0;i<this.actions.length;i++){
                if(this.actions[i].id!='danhsach'){
                    this.actions[i].active=false
                }
            }
            if(kieu==-1){//bắt đầu
                this.actions[this.actions.findIndex(x=>x.id=='ghilai')].active=true
                this.actions[this.actions.findIndex(x=>x.id=='huy')].active=true
            }else if(kieu==0){//bắt đầu
                this.actions[this.actions.findIndex(x=>x.id=='nhapmoi')].active=true
                this.clear()
            }else if(kieu==1){//thêm mới
                this.actions[this.actions.findIndex(x=>x.id=='ghilai')].active=true
                this.actions[this.actions.findIndex(x=>x.id=='huy')].active=true
                this.clear()

            }else if(kieu==2){//Huỷ
                this.actions[this.actions.findIndex(x=>x.id=='nhapmoi')].active=true
                this.actions[this.actions.findIndex(x=>x.id=='xoa')].active=true
                this.clear()
            }else if(kieu==3){//edit
                this.actions[this.actions.findIndex(x=>x.id=='nhapmoi')].active=true
                this.actions[this.actions.findIndex(x=>x.id=='ghilai')].active=true
                this.actions[this.actions.findIndex(x=>x.id=='huy')].active=true
                this.actions[this.actions.findIndex(x=>x.id=='xoa')].active=true
            }
        },
        clear(){
            this.input_code=''
            this.input_name=''
            this.id=''
        },
        async DanhSach(){
            this.dataSources=await API.getDsCountry(this)
        },
        async GhiLai(){
            let isInsert=this.actions[this.actions.findIndex(x=>x.id=='nhapmoi')].active?false:true
            if(isInsert){
                if(this.input_code.trim()==''){
                    this.$toast.error('Hãy nhập Code')
                    this.$refs.inputCode.focus()
                    return
                }
                if(this.input_name.trim()==''){
                    this.$toast.error('Hãy nhập Name')
                    this.$refs.inputName.focus()
                    return
                }
                let rs=await API.insertCountry(this, {
                    country_code:this.input_code.trim(),
                    country_name:this.input_name.trim()
                })
                if(rs=='1'){
                    this.$toast.success('Thêm mới thành công')
                    this.DanhSach()
                }else{
                    this.$toast.error(rs)
                }
            }else{
                if(this.input_code.trim()==''){
                    this.$toast.error('Hãy nhập Code')
                    this.$refs.inputCode.focus()
                    return
                }
                if(this.input_name.trim()==''){
                    this.$toast.error('Hãy nhập Name')
                    this.$refs.inputName.focus()
                    return
                }
                let rs=await API.updateCountry(this, {
                    id:this.id,
                    country_code:this.input_code.trim(),
                    country_name:this.input_name.trim()
                })
                if(rs=='1'){
                    this.$toast.success('Cập thành công')
                    this.DanhSach()
                }else{
                    this.$toast.error(rs)
                }
            }
        },
        async Xoa(){
            if(this.id=='')return
            let rs=await API.deleteCountry(this, this.id)
            if(rs=='1'){
                this.$toast.success('Xóa thành công!')
                this.DanhSach()
            }else{
                this.$toast.error('Xóa không thành công!')
            }
        },
        onSelectedRow(item){
            this.input_code=item.country_code
            this.input_name=item.country_name
            this.id=item.id
            this.setActiveActions(3)
        },
        async intDuLieu(){
            this.setActiveActions(-1)
        }
    },
    mounted(){
        setTimeout(()=>{
            this.intDuLieu()
        }, 500)
    }
}
</script>