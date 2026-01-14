<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupQuanLyKhaoSat"
        :showCloseIcon="true"
        width="60%"
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
                                <div class="key w120">Loại chuyên mục</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_loaichuyenmuc">
                                        <select2 :settings="{ dropdownParent: $refs['ds_loaichuyenmuc'] }"
                                            v-model="loaichuyenmuc_selected" class="select2"
                                            :options="ds_loaichuyenmuc"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w120">Chuyên mục</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_chuyenmuc">
                                        <select2 :settings="{ dropdownParent: $refs['ds_chuyenmuc'] }"
                                            v-model="chuyenmuc_selected" class="select2"
                                            :options="ds_chuyenmuc"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 col-12">
                            <div class="info-row">
                                <div class="key w120">Từ ngày</div>
                                <div class="value">
                                    <div class="input-icon-right">
                                        <ejs-datepicker
                                            v-model="tungay"
                                            format='dd/MM/yyyy'
                                            :showClearButton='false'
                                            locale="vi"
                                            @change="changeTuNgay"
                                            :firstDayOfWeek="1"
                                            />
                                    </div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w120">Đối tượng</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_doituong">
                                        <select2 :settings="{ dropdownParent: $refs['ds_doituong'] }"
                                            v-model="doituong_selected" class="select2"
                                            :options="ds_doituong"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 col-12">
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
                    <KDataGrid
                        ref="gridDsKs"
                        :columns="columns"
                        :dataSource="dataSources"
                        :enable-paging-server="false"
                        :allowPaging="true"
                        :showFilter="true"
                        :allowSorting="false"
                        :showColumnCheckbox="false"
                        :enabledSelectFirstRow="true"
                        :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                    />
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
    name:'QuanLyKhaoSatModal',
    components:{
        ActionTop
    },
    data(){
        return{
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad">QUẢN LÝ KHẢO SÁT</span> `,
            actions:[
                {
                    id:'timkiem',
                    name:'Tìm kiếm',
                    active: true,
                    icon_class:'one-search'
                },
                {
                    id:'chapnhan',
                    name:'Chấp nhận',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'huybo',
                    name:'Hủy bỏ',
                    active: true,
                    icon_class:'nc-icon-glyph ui-1_circle-remove'
                }
            ],
            loaichuyenmuc_selected:null,
            ds_loaichuyenmuc:[],
            ds_chuyenmuc:[],
            chuyenmuc_selected:null,
            tungay:moment(new Date()).format('DD/MM/YYYY'),
            denngay:moment(new Date()).format('DD/MM/YYYY'),
            ds_doituong:[],
            doituong_selected:null,
            input_tukhoa:'',
            columns:[
                {
                    fieldName:'row_stt',
                    headerText:'STT',
                    allowFiltering:true,
                    width:'70'
                },
                {
                    fieldName:'name',
                    headerText:'Tiêu đề',
                    allowFiltering:true,
                },
                {
                    fieldName:'thoigianth',
                    headerText:'Ngày bắt đầu',
                    allowFiltering:true,
                },
                {
                    fieldName:'ngay_th',
                    headerText:'Ngày kết thúc',
                    allowFiltering:true,
                },
                {
                    fieldName:'donvitao',
                    headerText:'Chuyên mục',
                    allowFiltering:true,
                },
                {
                    fieldName:'donvith',
                    headerText:'Trạng thái',
                    allowFiltering:true,
                },
                {
                    fieldName:'ngaytao',
                    headerText:'Số câu hỏi',
                    allowFiltering:true,
                },
                {
                    fieldName:'status_name',
                    headerText:'Số người đăng ký tối đa',
                    allowFiltering:true,
                },
                {
                    fieldName:'status_name',
                    headerText:'Số câu hỏi giới hạn',
                    allowFiltering:true,
                },
                {
                    fieldName:'selected',
                    headerText:'Chọn',
                    allowFiltering:true,
                },
            ],
            dataSources:[],

        }
    },
    methods:{
        showModal() {
            this.$refs["popupQuanLyKhaoSat"].show()
        },
        hideModal() {
            this.$refs["popupQuanLyKhaoSat"].hide()
        },
        onActionClick(action){
            if(action.id=='chapnhan'){
                this.ChapNhan()
            }else if(action.id=='huybo'){
                this.hideModal()
            }else if(action.id=='timkiem'){
                this.TimKiem()
            }
        },
        TimKiem(){

        },
        ChapNhan(){
            //callback value

            //hide modal
            this.hideModal()

        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        clear(){

        },
        async initDuLieu(){

        },
        changeTuNgay(event){
            this.tungay=moment(event.value).format('DD/MM/YYYY')
        },
        changeDenNgay(event){
            this.denngay=moment(event.value).format('DD/MM/YYYY')
        }
    }
}
</script>