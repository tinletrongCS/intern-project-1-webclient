<template>
    <div class="main-wrapper">
        <breadcrumb :header="header" />
        <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
        <div class="page-content">

            <div class="box-form">
                <div class="legend-title">Thông tin tìm kiếm</div>
                <div class="row">
                    <div class="col-sm-4 col-12">
                        <div class="info-row">
                            <div class="key w120">Đơn vị tạo</div>
                            <div class="value">
                                <div class="select-custom" ref="ds_donvi">
                                    <select2 :settings="{ dropdownParent: $refs['ds_donvi'] }"
                                        v-model="donvi_selected" class="select2"
                                        :options="ds_donvi"
                                        placeholder="Tất cả"
                                    >
                                    </select2>
                                </div> 
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="key w120">Tạo từ ngày</div>
                            <div class="value">
                                <div class="input-icon-right">
                                    <ejs-datepicker
                                        v-model="taotungay"
                                        format='dd/MM/yyyy'
                                        :showClearButton='false'
                                        locale="vi"
                                        @change="changeNgayTaoTu"
                                        :firstDayOfWeek="1"
                                        />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="col-sm-4 col-12">
                        <div class="info-row">
                            <div class="key w120">Trạng thái</div>
                            <div class="value">
                                <div class="select-custom" ref="ds_trangthai">
                                    <select2 :settings="{ dropdownParent: $refs['ds_trangthai'] }"
                                        v-model="trangthai_selected" class="select2"
                                        :options="ds_trangthai"
                                        placeholder="Tất cả"
                                    >
                                    </select2>
                                </div> 
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="key w120">Đến ngày</div>
                            <div class="value">
                                <div class="input-icon-right">
                                    <ejs-datepicker
                                        v-model="denngay"
                                        format='dd/MM/yyyy'
                                        :showClearButton='false'
                                        locale="vi"
                                        @change="changeDenNgay"
                                        :firstDayOfWeek="1"
                                        />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="col-sm-4 col-12">
                        <div class="info-row">
                            <div class="key w120">Từ khóa</div>
                            <div class="value">
                                <input type="text" ref="inputTuKhoa" :value="input_tukhoa" @change="e=>input_tukhoa=e.target.value" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-form">
                <div class="legend-title">
                    Danh sách chương trình
                </div>
                <KDataGrid
                    ref="gridDs"
                    :columns="columns"
                    :dataSource="dataSources"
                    :enable-paging-server="false"
                    :allowPaging="true"
                    :showFilter="true"
                    :allowSorting="false"
                    :showColumnCheckbox="true"
                    :enabledSelectFirstRow="true"
                    :allowTextWrap="true"
                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                    :commands="commands" 
                    :commandColumn="{headerText: '',cellCssClass: 'css1', show: true, width:'320'}"
                    @commandClicked="commandClicked"
                />
            </div>

        </div>
        <!-- Modal -->
        <ThemMoiChuongTrinhModal ref="themMoiChuongTrinhModal" @ok="refresh"/>
        <CauHinhThongTinDLModal ref="cauHinhThongTinDLModal" :id_ct="id_ct_selected"/>
        <ImportDuLieuModal ref="importDuLieuModal" :object="ctSelected"/>
        <SuaChuongTrinhModal ref="suaChuongTrinhModal" :chuongtrinh_id="id_ct_selected"/>
    </div>
</template>
<script>
import breadcrumb from '@/components/Controls/breadcrumb.vue'
import ActionTop from '@/components/Controls/ActionTop.vue'
import API from './API'
import moment from 'moment'
import ThemMoiChuongTrinhModal from './popups/ThemMoiChuongTrinhModal.vue'
import CauHinhThongTinDLModal from './popups/CauHinhThongTinDLModal.vue'
import ImportDuLieuModal from './popups/ImportDuLieuModal.vue'
import SuaChuongTrinhModal from './popups/SuaChuongTrinhModal.vue'
export default {
    name:'ProgramManagement',
    components:{
        breadcrumb, ActionTop, ThemMoiChuongTrinhModal, CauHinhThongTinDLModal,
        ImportDuLieuModal,SuaChuongTrinhModal
    },
    data(){
        return {
            header: {
                title: "Quản lý chương trình OB tự do",
                list: [
                ],
            },
            actions:[
                {
                    id:'timkiem',
                    name:'Tìm kiếm',
                    active: true,
                    icon_class:'one-search'
                },
                {
                    id:'themmoi_ct',
                    name:'Thêm chương trình',
                    active: true,
                    icon_class:'one-user-add'
                },
                {
                    id:'xoa_ct',
                    name:'Xóa',
                    active: true,
                    icon_class:'fa fa-trash'
                },
            ],
            donvi_selected:-1,
            ds_donvi:[],
            trangthai_selected:-1,
            ds_trangthai:[
                { id: -1, text: 'Tất cả' },
                { id: 0, text: 'Không sử dụng' },
                { id: 1, text: 'Sử dụng'},
                { id: 2, text: 'Đang hoạt động outbound' },
                { id: 3, text: 'Đã xóa' }
            ],
            input_tukhoa:'',
            taotungay:moment(new Date()).format('DD/MM/YYYY'),
            denngay:moment(new Date()).format('DD/MM/YYYY'),
            columns:[
                {
                    fieldName:'row_stt',
                    headerText:'STT',
                    allowFiltering:true,
                    width:'70'
                },
                {
                    fieldName:'name',
                    headerText:'Tên chương trình',
                    allowFiltering:true,
                },
                {
                    fieldName:'tg_th',
                    headerText:'Thời gian thực hiện',
                    allowFiltering:true,
                },
                {
                    fieldName:'ngay_th',
                    headerText:'Ngày thực hiện',
                    allowFiltering:true
                },
                {
                    fieldName:'dvi_created',
                    headerText:'Đơn vị tạo',
                    allowFiltering:true,
                },
                {
                    fieldName:'donvith',
                    headerText:'Đơn vị thực hiện',
                    allowFiltering:true,
                },
                {
                    fieldName:'createdDate',
                    headerText:'Ngày tạo',
                    allowFiltering:true,
                },
                {
                    fieldName:'status_name',
                    headerText:'Trạng thái',
                    allowFiltering:true,
                    textAlign:'center'
                },
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
                    name: 'cauhinhdl',
                    cssClass: 'btn btn-main -ap one-edit',
                    width: 40,
                    text: '',
                    title: 'Cấu hình thông tin dữ liệu',
                },
                {
                    name: 'import_dl',
                    cssClass: 'btn btn-main -ap one-file-excel',
                    width: 40,
                    text: '',
                    title: 'Import bổ sung dữ liệu',
                },

                {
                    name: 'phanviecdonvi',
                    cssClass: 'btn btn-main one-users',
                    width: 40,
                    text: '',
                    title: 'Phân việc đơn vị',
                },
                {
                    name: 'phanviecphongban',
                    cssClass: 'btn btn-main one-users',
                    width: 40,
                    text: '',
                    title: 'Phân việc phòng ban',
                },
                {
                    name: 'phanviecktv',
                    cssClass: 'btn btn-main one-users',
                    width: 40,
                    text: '',
                    title: 'Phân việc KTV',
                },

                {
                    name: 'xoa_dulieu',
                    cssClass: 'btn btn-main -ap one-trash',
                    width: 40,
                    text: '',
                    title: 'Xóa dữ liệu',
                },
            ],
            id_ct_selected:'',
            ctSelected:{}
        }
    },
    methods:{
        onActionClick(action){
            if(action.id=='timkiem'){
                this.TimKiem()
            }else if(action.id=='themmoi_ct'){
                this.$refs.themMoiChuongTrinhModal.showModal()
            }else if(action.id=='xoa_ct'){
                this.XoaCT()
            }
        },
        async initDuLieu(){
            this.ds_donvi.push({id:'-1', text:'Tất cả'})
            let ds_dvi=await this.getDsDonvi()
            this.ds_donvi=this.ds_donvi.concat(ds_dvi)
            // if(this.ds_donvi.length>0){
            //     this.donvi_selected=this.ds_donvi[0].id
            // }
            //console.log('test', this.$_root.token.getProperty('user_name'))
        },
        refresh(){
            this.TimKiem()
        },
        async TimKiem(){
            this.dataSources=await this.get_list_program({
                tungay:moment(this.taotungay, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                denngay:moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                txt:this.input_tukhoa.trim(),
                dvi:this.donvi_selected!=-1?this.donvi_selected:'',
                status:this.trangthai_selected!=-1?this.trangthai_selected:''
            })
        },
        async XoaCT(){
            //delOB
            let rowSelecteds=this.$refs.gridDs.getSelectedRecords()
            if(rowSelecteds.length==0){
                this.$toast.error('Hãy chọn chương trình cần xóa!')
                return
            }
            let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các chương trình được chọn này không?`)
            if(result==0) return
            let ids=rowSelecteds.map(x=>x.id)
            let rs=await this.delOB(ids)
            if(rs.code==1){
                this.$toast.success('Xóa thành công!')
                this.TimKiem()
            }else {
                this.$toast.error(rs.msg)
            }
        },
        changeNgayTaoTu(event){
            this.taotungay=moment(event.value).format('DD/MM/YYYY')
        },
        changeDenNgay(event){
            this.denngay=moment(event.value).format('DD/MM/YYYY')
        },
        commandClicked(cmdName, rowData){
            // console.log('commandClicked', cmdName)
            // console.log('commandClicked', rowData)
            if(cmdName=='edit'){
                this.Edit(rowData)
            }else if(cmdName=='cauhinhdl'){
                this.CauHinhDL(rowData)
            }else if(cmdName=='import_dl'){
                this.ImportDuLieu(rowData)
            }else if(cmdName=='phanviecdonvi'){
                this.$toast.error('Chức năng đang xây dựng và phát triển')
            }else if(cmdName=='phanviecphongban'){
                this.$toast.error('Chức năng đang xây dựng và phát triển')
            }else if(cmdName=='phanviecktv'){
                this.$toast.error('Chức năng đang xây dựng và phát triển')
            }else if(cmdName=='xoa_dulieu'){
                this.XoaDuLieu(rowData)
            }
        },
        async XoaDuLieu(item){
            let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thực hiện thao tác này?`)
            if(result==0) return
            let rs=await this.delOB([item.id])
            if(rs.code==1){
                this.$toast.success('Xóa thành công!')
                this.TimKiem()
            }else {
                this.$toast.error(rs.msg)
            }
        },
        CauHinhDL(item){
            this.id_ct_selected=item.id
            this.$refs.cauHinhThongTinDLModal.showModal()
        },
        ImportDuLieu(item){
            this.ctSelected=item
            this.$refs.importDuLieuModal.showModal()
        },
        Edit(item){
            this.id_ct_selected=item.id
            this.$refs.suaChuongTrinhModal.showModal()
        },
        async getDsDonvi(){
            try{
                this.loading(true)
                let response = await API.ds_don_vi(this.axios)
                this.loading(false)
                if(response && response.data && response.data.code && response.data.code == 200 && response.data.data) {
                    return response.data.data.data.map((x) => ({id: x.org_code, text: x.org_name}))
                }else{
                    return []
                }
            }catch(e){
                this.loading(false)
                return []
            }
        },
        async get_list_program(data){
            try{
                this.loading(true)
                let response = await API.get_list_program(this.axios, data)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code == '1'&&response.data.result) {
                    //return response.data.result
                    return response.data.result.map((x, index)=>{
                        x.row_stt=index+1
                        if(x.state==0){
                            x.status_name='Không sử dụng'
                        }else if(x.state==1){
                            x.status_name='Sử dụng'
                        }else if(x.state==2){
                            x.status_name='Đang hoạt động outbound'
                        }else if(x.state==3){
                            x.status_name='Đã xóa'
                        }
                        x.tg_th=this.getThoiGianTT(x)
                        x.ngay_th=this.getNgayTH(x)
                        x.createdDate=x.createdDate?moment(x.createdDate).format('DD/MM/YYYY HH:mm:ss'):''
                        x.dvi_created=this.getDonViTao(x)
                        return x
                    })
                }else{
                    this.$toast.error(response.data.error_msg)
                    return []
                }
            }catch(e){
                this.loading(false)
                return []
            }
        },
        getDonViTao(item){
            if(!item.orgCode||item.orgCode=='')return ''
            const dvi=this.ds_donvi.find(x=>x.id==item.orgCode)
            return dvi?dvi.text:''
        },
        getThoiGianTT(item){
            var result=''
            result+=`${this.getTimeFromNumber(item.dayAMFrom)}-${this.getTimeFromNumber(item.dayAMTo)};`
            result+=`${this.getTimeFromNumber(item.dayPMFrom)}-${this.getTimeFromNumber(item.dayPMTo)};`
            result+=`${this.getTimeFromNumber(item.dayNighFrom)}-${this.getTimeFromNumber(item.dayNighTo)}`
            return result
        },
        getNgayTH(item){
            if(item.actionDayType==1){
                return item.specifyDay?moment(item.specifyDay).format('DD/MM/YYYY'):''
            }else if(item.actionDayType==2){
                if(item.multiDay&&item.multiDay.length>0){
                    return item.multiDay.map(x=>x?moment(x).format('DD/MM/YYYY'):'').join(', ')
                }else{
                    return ''
                }
            }else if(item.actionDayType==3){
                return `Từ: ${item.actionDayFrom?moment(item.actionDayFrom).format('DD/MM/YYYY'):''} đến: ${item.actionDayTo?moment(item.actionDayTo).format('DD/MM/YYYY'):''}`
            }else if(item.actionDayType==4){
                //Chưa làm
            }
        },
        getTimeFromNumber(value){
            var time=value.toString()
            if(time.length==1){
                return moment(`00:0${time}`,'HH:mm').format('HH:mm')
            }if(time.length==2){
                return moment(`00:${time}`,'HH:mm').format('HH:mm')
            }else if(time.length==3){
                return moment(`0${time.substr(0, time.length-2)}:${time.substr(time.length-2, 2)}`,'HH:mm').format('HH:mm')
            }else if(time.length==4){
                return moment(`${time.substr(0, time.length-2)}:${time.substr(time.length-2, 2)}`,'HH:mm').format('HH:mm')
            }else{
                return null
            }
        },
        async delOB(data){
            try{
                this.loading(true)
                let response = await API.delOB(this.axios, data)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code == 1) {
                    return {
                        code:1,
                        msg:response.data.error_msg
                    }
                }else{
                    return {
                        code:0,
                        msg:response.data.error_msg
                    }
                }
            }catch(e){
                this.loading(false)
                return {
                    code:0,
                    msg:'Đã xảy ra lỗi, xóa không thành công!'
                }
            }
        },
        

        //
    },
    mounted(){
        setTimeout(()=>{
            this.initDuLieu()
        }, 500)
    }
}
</script>