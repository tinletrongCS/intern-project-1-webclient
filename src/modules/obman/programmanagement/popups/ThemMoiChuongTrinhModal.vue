<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'top'}"
        :visible="false"
        ref="popupThemMoiCT"
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
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Loại chương trình</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_loaict">
                                        <select2 :settings="{ dropdownParent: $refs['ds_loaict'] }"
                                            v-model="loaict_selected" class="select2"
                                            :options="ds_loaict"
                                            :disabled="true"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w120">Mẫu chương trình</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_mau_ct">
                                        <select2 :settings="{ dropdownParent: $refs['ds_mau_ct'] }"
                                            v-model="mau_ct_selected" class="select2"
                                            :options="ds_mauct"
                                             :disabled="true"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w120">Kiểu chương trình<k-required-marker/></div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_loaict">
                                        <select2 :settings="{ dropdownParent: $refs['ds_loaict'] }"
                                            v-model="kieu_ct_selected" class="select2"
                                            :options="ds_kieu_ct"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w120">Nhóm chương trình</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_nhomct">
                                        <select2 :settings="{ dropdownParent: $refs['ds_nhomct'] }"
                                            v-model="nhom_ct_selected" class="select2"
                                            :options="ds_nhom_ct"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                        
                    </div>
                    <div class="row">
                        <div class="col-sm-2 col-12" style="padding-top: 4px !important;">
                            <span class="text" >Chọn chương trình</span>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w80">Cấp cha<k-required-marker/></div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_capcha">
                                        <select2 :settings="{ dropdownParent: $refs['ds_capcha'] }"
                                            v-model="capcha_selected" class="select2"
                                            :options="ds_capcha"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w80">Cấp con<k-required-marker/></div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_capcon">
                                        <select2 :settings="{ dropdownParent: $refs['ds_capcon'] }"
                                            v-model="capcon_selected" class="select2"
                                            :options="ds_capcon"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>

                            <div class="info-row">
                                <div class="key w80">Gói cước<k-required-marker/></div>
                                <div class="value">
                                    <input type="text" ref="inputGoiCuoc" readonly :value="input_goicuoc" @change="e=>input_goicuoc=e.target.value" class="form-control">
                                </div>
                                <div class="value w30">
                                    <button class="btn btn-second" @click="chonGoiCuoc">
                                        Chọn
                                    </button>
                                </div>
                            </div>

                            <div class="info-row">
                                <div class="key w80">Tên chương trình<k-required-marker/></div>
                                <div class="value">
                                    <input type="text" ref="inputTenChuongTrinh" :value="input_tenchuongtrinh" @change="e=>input_tenchuongtrinh=e.target.value" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 col-12">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-2 col-12" style="padding-top: 4px !important;">
                            <span class="text" >Thời gian thực hiện</span>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w80">Sáng</div>
                                <div class="value">
                                    <div class="row">
                                        <div class="col-sm-6 col-12">
                                            <ejs-timepicker v-model="timeSangTu"></ejs-timepicker>
                                        </div>
                                        <div class="col-sm-6 col-12">
                                             <ejs-timepicker v-model="timeSangDen"></ejs-timepicker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w80">Chiều</div>
                                <div class="value">
                                    <div class="row">
                                        <div class="col-sm-6 col-12">
                                            <ejs-timepicker v-model="timeChieuTu"></ejs-timepicker>
                                        </div>
                                        <div class="col-sm-6 col-12">
                                             <ejs-timepicker v-model="timeChieuDen"></ejs-timepicker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key w80">Tối</div>
                                <div class="value">
                                    <div class="row">
                                        <div class="col-sm-6 col-12">
                                            <ejs-timepicker v-model="timeToiTu"></ejs-timepicker>
                                        </div>
                                        <div class="col-sm-6 col-12">
                                            <ejs-timepicker v-model="timeToiDen"></ejs-timepicker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 col-12">
                        </div>
                    </div>

                    <div class="row">
                        
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Kiểu ngày thực hiện <k-required-marker/></div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_kieungay">
                                        <select2 :settings="{ dropdownParent: $refs['ds_kieungay'] }"
                                            v-model="kieu_ngay_selected" class="select2"
                                            :options="ds_kieungay"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            
                        </div>
                    </div>
                    
                    <div class="row" v-if="kieu_ngay_selected==1">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key"></div>
                                <div class="value">
                                    <div class="input-icon-right">
                                        <ejs-datepicker
                                            v-model="ngay_cuthe"
                                            format='dd/MM/yyyy'
                                            :showClearButton='false'
                                            locale="vi"
                                            @change="changeNgayCuThe"
                                            :firstDayOfWeek="1"
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>
                    <div class="row" v-else-if="kieu_ngay_selected==2">
                        <div class="col-sm-6 col-12">
                            <div class="info-row" v-for="(item, index) in ds_nhieu_ngay" :key="index">
                                <div class="key"></div>
                                <div class="value">
                                    <div class="input-icon-right">
                                        <ejs-datepicker
                                            v-model="ds_nhieu_ngay[index].value"
                                            format='dd/MM/yyyy'
                                            :showClearButton='false'
                                            locale="vi"
                                            @change="changeDaiNgay(index, $event)"
                                            :firstDayOfWeek="1"
                                        />
                                    </div>
                                </div>
                                <div class="value w30">
                                    <button class="btn btn-second" @click="removeDate(index)">
                                        <span class="-ap icon-trash"></span>
                                    </button>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="key"></div>
                                <div class="value">
                                    <button class="btn btn-second" @click="clickThemNgay">
                                        Thêm ngày
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>


                    </div>
                    <div class="row" v-else-if="kieu_ngay_selected==3">
                        <div class="col-sm-2 col-12" style="padding-top: 4px !important;">
                            <span class="text"></span>
                        </div>
                        <div class="col-sm-10 col-12">
                            <div class="row">
                                 <div class="col-sm-6 col-12">
                                    <div class="info-row">
                                        <div class="key">Từ ngày</div>
                                        <div class="value">
                                            <div class="input-icon-right">
                                                <ejs-datepicker
                                                    v-model="tu_ngay"
                                                    format='dd/MM/yyyy'
                                                    :showClearButton='false'
                                                    locale="vi"
                                                    @change="changeNgayTuNgay"
                                                    :firstDayOfWeek="1"
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                                 <div class="col-sm-6 col-12">
                                    <div class="info-row">
                                        <div class="key">Đến ngày</div>
                                        <div class="value">
                                            <div class="input-icon-right">
                                                <ejs-datepicker
                                                    v-model="den_ngay"
                                                    format='dd/MM/yyyy'
                                                    :showClearButton='false'
                                                    locale="vi"
                                                    @change="changeNgayDenNgay"
                                                    :firstDayOfWeek="1"
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div class="row" v-else-if="kieu_ngay_selected==4">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key"></div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_ngaycodinh">
                                        <select2 :settings="{ dropdownParent: $refs['ds_ngaycodinh'] }"
                                            v-model="ngay_codinh_selected" class="select2"
                                            :options="ds_ngaycodinh"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            
                        </div>
                    </div>

                    <!-- <div class="row" style="margin-top: 10px !important;">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Kịch bản <k-required-marker/></div>
                                <div class="value">
                                    <button class="btn btn-second" @click="clickTaoKichBan">
                                        Tạo kịch bản
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div> -->
                    <div class="row" style="margin-top: 10px !important;">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Kịch bản <k-required-marker/></div>
                                <div class="value" v-if="!statusEditKichBan">
                                    <button class="btn btn-second" @click="clickTaoKichBan">
                                        Tạo kịch bản
                                    </button>
                                </div>
                                <div class="value" v-if="statusEditKichBan" style="padding-top: 4px !important;">
                                    <span class="text bold">Đã tạo</span>
                                </div>
                                <div class="value" v-if="statusEditKichBan" >
                                    <button class="btn btn-second" @click="clickTaoKichBan">
                                        Sửa
                                    </button>
                                </div>
                                <div class="value" v-if="statusEditKichBan">
                                    <button class="btn btn-second" @click="clickXoaKichBan" >
                                        Xóa
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Kịch bản survey</div>
                                <div class="value">
                                    <button class="btn btn-second" @click="clickKichBanSurvey">
                                        Chọn
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Đối tượng khách hàng</div>
                                <div class="value">
                                    <input type="text" :value="input_doituongkh" @change="e=>input_doituongkh=e.target.value" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Quà tặng ưu đãi</div>
                                <div class="value">
                                    <input type="text" :value="input_quatang" @change="e=>input_quatang=e.target.value" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Trạng thái</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_trangthai">
                                        <select2 :settings="{ dropdownParent: $refs['ds_trangthai'] }"
                                            v-model="trangthai_selected" class="select2"
                                            :options="ds_trangthai"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Loại chọn số</div>
                                <div class="value">
                                    <div class="select-custom" ref="ds_loaiso">
                                        <select2 :settings="{ dropdownParent: $refs['ds_loaiso'] }"
                                            v-model="loaiso_selected" class="select2"
                                            :options="ds_loaiso"
                                        >
                                        </select2>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="key w120">Chọn nguồn dữ liệu</div>
                        <div class="value w120">
                            <button class="btn btn-second" @click="clickChooseFile">
                                Choose File
                            </button>
                            <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
                        </div>
                        <div class="value" style="padding-top: 5px!important;">
                             {{file_full_path}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="info-row">
                                <div class="key w120">Tỷ lệ lọc dữ liệu</div>
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
                        <div class="col-sm-6 col-12">
                        </div>
                    </div>


                </div>
    
            </div>
            <!-- Modal -->
            <ChonGoiCuocModal ref="chonGoiCuocModal" @accept="acceptChonGoiCuoc"/>
            <QuanLyKhaoSatModal ref="quanLyKhaoSatModal" />
            <TaoKichBanModal ref="taoKichBanModal" :CtId="chuongtrinhId" :CtName="tenChuongTrinh" @ok="successKB" :action="'add'"/>
        </div>
    </ejs-dialog>
</template>
<script>
import KRequiredMarker from '@/components/Controls/KRequiredMarker.vue'
import moment from 'moment'
import ActionTop from '@/components/Controls/ActionTop.vue'
import API from './API'
import ChonGoiCuocModal from './ChonGoiCuocModal.vue'
import QuanLyKhaoSatModal from './QuanLyKhaoSatModal.vue'
import TaoKichBanModal from './TaoKichBanModal.vue'
export default {
    name:'ThemMoiChuongTrinhModal',
    components:{
        KRequiredMarker,
        ActionTop,
        ChonGoiCuocModal,
        QuanLyKhaoSatModal,
        TaoKichBanModal
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad">THÊM CHƯƠNG TRÌNH OB TỰ DO</span> `,
            actions:[
                {
                    id:'ghilai',
                    name:'Ghi lại',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'ketthuc',
                    name:'Trở về',
                    active: true,
                    icon_class:'nc-icon-glyph ui-1_circle-remove'
                }
            ],
            loaict_selected:2,
            ds_loaict:[
                {
                    id:1,
                    text:'Cố định'
                },
                {
                    id:2,
                    text:'Không cố định'
                },
            ],
            mau_ct_selected:1,
            ds_mauct:[
                {
                    id:1,
                    text:'Không'
                }
            ],
            kieu_ct_selected:null,
            ds_kieu_ct:[],
            nhom_ct_selected:null,
            ds_nhom_ct:[],
            capcha_selected:null,
            ds_capcha:[],
            capcon_selected:null,
            ds_capcon:[],
            input_tenchuongtrinh:'',
            input_goicuoc:'',
            input_sang:'',
            input_chieu:'',
            input_toi:'',
            kieu_ngay_selected:3,
            ds_kieungay:[
                {
                    id:1,
                    text:'Một ngày cụ thể'
                },
                {
                    id:2,
                    text:'Nhiều ngày bất kỳ'
                },
                {
                    id:3,
                    text:'Khoảng thời gian'
                },
                {
                    id:4,
                    text:'Các ngày cố định'
                },
            ],
            ngay_cuthe:moment(new Date()).format('DD/MM/YYYY'),
            tu_ngay:moment(new Date()).format('DD/MM/YYYY'),
            den_ngay:moment(new Date()).format('DD/MM/YYYY'),
            ngay_codinh_selected:1,
            ds_ngaycodinh:[
                {
                    id:1,
                    text:'Đầu tháng'
                },
                {
                    id:15,
                    text:'Giữa tháng'
                },
                {
                    id:30,
                    text:'Cuối tháng'
                },
            ],
            ds_nhieu_ngay:[
                {
                    id:1,
                    value:moment(new Date()).format('DD/MM/YYYY')
                },
                {
                    id:2,
                    value:moment(new Date()).format('DD/MM/YYYY')
                }
            ],
            input_doituongkh:'',
            input_quatang:'',
            trangthai_selected:1,
            ds_trangthai:[
                { id: 0, text: 'Không sử dụng' },
                { id: 1, text: 'Sử dụng'},
                { id: 2, text: 'Đang hoạt động outbound' },
                { id: 3, text: 'Đã xóa' }
            ],
            loaiso_selected:0,
            ds_loaiso:[
                { id: 0, text: 'Không' },
                { id: 1, text: 'Sắp xếp theo TKC'},
            ],
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
            file_full_path:'',
            file:null,
            goicuocs:null,
            timeSangTu:new Date(),
            timeSangDen:new Date(),
            timeChieuTu:new Date(),
            timeChieuDen:new Date(),
            timeToiTu:new Date(),
            timeToiDen:new Date(),
            resultAddOB:null,
            statusEditKichBan:false
        }
    },
    computed:{
        chuongtrinhId(){
            return this.resultAddOB?this.resultAddOB.id:''
        },
        tenChuongTrinh(){
            return this.resultAddOB?this.resultAddOB.name:''
        }
    },
    methods:{
        showModal() {
            this.$refs["popupThemMoiCT"].show()
        },
        hideModal() {
            this.$refs["popupThemMoiCT"].hide()
            this.$emit('ok')
        },
        onActionClick(action){
            if(action.id=='ghilai'){
                this.GhiLai()
            }else if(action.id=='ketthuc'){
                this.hideModal()
            }
        },
        KiemTraDLNhap(){
            if(this.input_tenchuongtrinh.trim()==''){
                this.$toast.error('Hãy nhập tên chương trình!')
                this.$refs.inputTenChuongTrinh.focus()
                return false
            }
            if(this.kieu_ct_selected==null){
                this.$toast.error('Hãy chọn kiểu chương trình!')
                return false
            }
            if(this.capcha_selected==null){
                this.$toast.error('Hãy chọn cấp cha!')
                return false
            }
            if(this.capcon_selected==null){
                this.$toast.error('Hãy chọn cấp con!')
                return false
            }
            if(this.input_goicuoc.trim()==''){
                this.$toast.error('Hãy chọn gói cước!')
                return false
            }

            if(this.kieu_ngay_selected==1){
                if(!this.ngay_cuthe){
                    this.$toast.error('Hãy chọn ngày thực hiện!')
                    return false
                }
            }else if(this.kieu_ngay_selected==2){
                for(var i=0; i<this.ds_nhieu_ngay.length;i++){
                    if(!this.ds_nhieu_ngay[i].value){
                        this.$toast.error('Hãy chọn ngày thực hiện!')
                        return false
                    }
                }
            }else if(this.kieu_ngay_selected==3){
                if(!this.tu_ngay||!this.den_ngay){
                    this.$toast.error('Hãy chọn ngày thực hiện!')
                    return false
                }
            }else if(this.kieu_ngay_selected==4){

            }

            return true
        },
        async GhiLai(){
            if(!this.KiemTraDLNhap()){
                return
            }
            
            var objectCT={}
 
            objectCT.progKind=this.loaict_selected
            objectCT.progTemplateId=this.mau_ct_selected
            objectCT.progTypeId=this.kieu_ct_selected
            objectCT.progPackageId=this.nhom_ct_selected||""
            //objectCT.progPackageId=2
            objectCT.progNameGroupId=this.capcon_selected
            objectCT.packageName=this.input_goicuoc
            objectCT.name=this.input_tenchuongtrinh.trim()

            objectCT.dayAMFrom=Number(moment(this.timeSangTu).format('HHmm'))
            objectCT.dayAMTo=Number(moment(this.timeSangDen).format('HHmm'))
            objectCT.dayPMFrom=Number(moment(this.timeChieuTu).format('HHmm'))
            objectCT.dayPMTo=Number(moment(this.timeChieuDen).format('HHmm'))
            objectCT.dayNighFrom=Number(moment(this.timeToiTu).format('HHmm'))
            objectCT.dayNighTo=Number(moment(this.timeToiDen).format('HHmm'))
            objectCT.actionDayType=this.kieu_ngay_selected

            if(this.kieu_ngay_selected==1){
                objectCT.specifyDay=this.ngay_cuthe?moment(this.ngay_cuthe, 'DD/MM/YYYY').format('YYYY-MM-DD'):null
            }else if(this.kieu_ngay_selected==2){
                objectCT.multiDay=this.ds_nhieu_ngay.map(x=>x.value?moment(x.value, 'DD/MM/YYYY').format('DD/MM/YYYY'):null)
            }else if(this.kieu_ngay_selected==3){
                objectCT.actionDayFromS=this.tu_ngay?moment(this.tu_ngay, 'DD/MM/YYYY').format('YYYY-MM-DD'):null
                objectCT.actionDayToS=this.den_ngay?moment(this.den_ngay, 'DD/MM/YYYY').format('YYYY-MM-DD'):null
            }else if(this.kieu_ngay_selected==4){
                //Chưa làm
            }
            
            objectCT.state=this.trangthai_selected
            objectCT.gift=this.input_quatang.trim()
            objectCT.customerType=this.input_doituongkh.trim()
            objectCT.pickSMISOption=this.loaiso_selected
            objectCT.fillRatio=null
            objectCT.orgCode=await this.$_root.token.getOrgCode()
            let keys=Object.keys(objectCT)
            let formData = new FormData()
            if(this.file){
                formData.append('file', this.file)
                objectCT.fillRatio=this.tyle_selected
            }else{
                formData.append('file', null)
                objectCT.fillRatio=null
            }
            console.log('keys', keys)
            console.log('objectCT', objectCT)
            for(var i=0;i<keys.length;i++){
                formData.append(keys[i], objectCT[keys[i]])
            }

            let rs=await this.addOBProgram(formData, { headers: { 'Content-Type': 'multipart/form-data'}})
            if(rs=='1'){
                this.$toast.success('Thêm mới thành công!')
                this.actions[0].active=false
            }else{
                this.$toast.error(rs)
            }


        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        clear(){
            this.loaict_selected=2
            this.mau_ct_selected=1
            this.kieu_ct_selected=null
            this.nhom_ct_selected=null
            this.capcha_selected=null
            this.capcon_selected=null
            this.input_tenchuongtrinh=''
            this.input_goicuoc=''
            this.input_sang=''
            this.input_chieu=''
            this.input_toi=''
            this.kieu_ngay_selected=3
            this.ngay_cuthe=moment(new Date()).format('DD/MM/YYYY')
            this.tu_ngay=moment(new Date()).format('DD/MM/YYYY')
            this.den_ngay=moment(new Date()).format('DD/MM/YYYY')
            this.ngay_codinh_selected=1
            this.input_doituongkh=''
            this.input_quatang=''
            this.trangthai_selected=1
            this.loaiso_selected=0
            this.tyle_selected=10
            this.file_full_path=''
            this.file=null
            this.goicuocs=null
            this.timeSangTu=new Date()
            this.timeSangDen=new Date()
            this.timeChieuTu=new Date()
            this.timeChieuDen=new Date()
            this.timeToiTu=new Date()
            this.timeToiDen=new Date()
            this.actions[0].active=true
        },
        async initDuLieu(){
            this.ds_kieu_ct=await this.progType()
            if(this.ds_kieu_ct.length>0){
                this.kieu_ct_selected=this.ds_kieu_ct[0].id
            }
            this.ds_nhom_ct=await this.progPackage()
            if(this.ds_nhom_ct.length>0){
                this.nhom_ct_selected=this.ds_nhom_ct[0].id
            }
            this.ds_capcha=this.ds_capcon=await this.programGroupName()
            if(this.ds_capcha.length>0){
                this.capcha_selected=this.ds_capcha[0].id
                this.capcon_selected=this.ds_capcon[0].id
            }
        },
        chonGoiCuoc(){
            this.$refs.chonGoiCuocModal.showModal()
        },
        clickKichBanSurvey(){
            this.$refs.quanLyKhaoSatModal.showModal()
        },
        clickTaoKichBan(){
            if(!this.resultAddOB){
                this.$toast.error('Hãy tạo chương trình xong rùi thực hiện hiện thao tác')
                return
            }
            this.$refs.taoKichBanModal.showModal()
        },
        acceptChonGoiCuoc(data){
            this.goicuocs=data
            this.input_goicuoc=this.goicuocs.codes.join(',')
        },
        clickChooseFile(){
            this.$refs.fileInput.value=null
            document.getElementById("file").click()
        },
        changeNgayCuThe(event){
            if(!event.value){
                this.ngay_cuthe=null
                return
            }
            this.ngay_cuthe=moment(event.value).format('DD/MM/YYYY')
        },
        changeNgayTuNgay(event){
            if(!event.value){
                this.tu_ngay=null
                return
            }
            this.tu_ngay=moment(event.value).format('DD/MM/YYYY')
        },
        changeNgayDenNgay(event){
            if(!event.value){
                this.den_ngay=null
                return
            }
            this.den_ngay=moment(event.value).format('DD/MM/YYYY')
        },
        changeDaiNgay(index, event){
            if(!event.value){
                this.ds_nhieu_ngay[index].value=null
                return
            }
            this.ds_nhieu_ngay[index].value=moment(event.value).format('DD/MM/YYYY')
        },
        clickThemNgay(){
            let array=this.ds_nhieu_ngay.map(x=>x.id)
            this.ds_nhieu_ngay.push({
                id:Math.max(...array),
                value:moment(new Date()).format('DD/MM/YYYY')
            })
        },
        removeDate(index){
            this.ds_nhieu_ngay.splice(index, 1)
        },
        onChangeFile(event){
            this.file_full_path = event.target.value.split('\\').pop()
            this.file=event.target.files[0]
            //this.readFileExcel()
        },
        async clickXoaKichBan(){
            let formData = new FormData()
            formData.append('obScript', '')
            formData.append('obSituation', '')
            let rs=await this.addKBan(this.chuongtrinh.id, formData, { headers: { 'Content-Type': 'multipart/form-data'}})
            if(rs=='1'){
                this.$toast.success('Xóa thành công!')
                this.statusEditKichBan=false
            }else{
                this.$toast.error(rs)
            }
        },
        async successKB(){
            let ct=await this.getProgramById(this.chuongtrinhId)
            if(ct){
                if(!ct.obScript&&!ct.obSituation){
                    this.statusEditKichBan=false
                }else{
                    this.statusEditKichBan=true
                }
            }
        },
        async progType(){
            try{
                this.loading(true)
                let response = await API.progType(this.axios)
                this.loading(false)
                if(response && response.data && response.data.content) {
                    return response.data.content.map(x=>{
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
        async progPackage(){
            try{
                this.loading(true)
                let response = await API.progPackage(this.axios)
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
        async programGroupName(){
            try{
                this.loading(true)
                let response = await API.programGroupName(this.axios)
                this.loading(false)
                if(response && response.data && response.data.data&&response.data.data.content) {
                    return response.data.data.content.map(x=>{
                        return {
                            id:x.id,
                            text:x.name,
                            pid:x.parentId
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
        async addOBProgram(data, header){
            try{
                this.loading(true)
                let response = await API.addOBProgram(this.axios, data, header)
                this.loading(false)
                if(response && response.data && response.data.error_code && response.data.error_code==1) {
                    this.resultAddOB=response.data.result
                    return '1'
                }else{
                    return response.data.error_msg
                }
            }catch(e){
                this.loading(false)
                return 'Đã xảy ra lỗi, thêm mới không thành công'
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
    }
}
</script>