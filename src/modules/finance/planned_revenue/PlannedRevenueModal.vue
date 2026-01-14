<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupPlannedRevenue"
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
                            <div class="key w140 bold">Trung tâm</div>
                            <div class="value">
                                <select2 
                                    v-model='center_selected'
                                    :options="center_list"
                                    :disabled="isViewDetail"
                                    @select="onCenterChange"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Phòng ban</div>
                            <div class="value">
                                <select2 
                                    v-model='deparment_selected'
                                    :options="department_list"
                                    :disabled="isViewDetail"
                                    @select="onDeparmentChange"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Nhóm sản phẩm</div>
                            <div class="value">
                                <select2 
                                    v-model='group_selected'
                                    :options="group_list"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Dự án</div>
                            <div class="value">
                                <select2 
                                    v-model='project_selected'
                                    :disabled="isViewDetail"
                                    :options="project_list.map(e=>({id:e.project_id, text:e.project_name}))"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                   <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Doanh thu</div>
                            <div class="value">
                                <input type="text" :disabled="isViewDetail" :value="formattedRevenue" @input="onInput" @keypress="onlyNumberKey" class="form-control">
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Tháng</div>
                            <div class="value">
                                <ejs-datepicker
                                    v-model="thang"
                                    format="MM/yyyy"
                                    :showClearButton="false"
                                    :allowEdit="true"
                                    :strict-mode="true"
                                    locale="vi"
                                    @change="changeThang"
                                    :firstDayOfWeek="1"
                                    :enabled="!isViewDetail"
                                    start="Year"
                                    depth="Year"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row" >
                            <div class="key w140 bold">Hạng mục</div>
                            <div style="display: flex !important;align-items: center !important;">
                                <div class="value"  style="flex: 1 !important;">
                                    <select2 
                                        v-model='hangmuc_selected'
                                        :options="hangmuc_list.map(e=>({id:e.item_revenue_id, text:e.item_revenue_name}))"
                                        :disabled="isViewDetail"
                                    />
                                </div>
                                <div v-if="isAdmin" class="value w30 custom-value-btn">
                                    <button class="btn btn-second" @click="openSubDialog">
                                        <span class="-ap icon-plus"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        
                      </div>
                  </div>

                  <div v-if="!isViewDetail" class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                      <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
                          <span class="icon one-save"></span> Lưu thay đổi
                      </button>
                  </div>
                </div>
            </div>
            <!-- Modal -->
            <ejs-dialog
                :isModal="true"
                :target="target"
                width="400px"
                :header="'Nhập thông tin'"
                :showCloseIcon="true"
                :open="onOpenSubDialog"
                ref="subDialog"
                :allowDragging="true"
                :visible="false"
                :position="{ X: 'center', Y: 'center' }"
                >
                <div class="popup-body">
                    <div class="box-form">
                        <div class="info-row">
                            <div class="value">
                                <input type="text" ref="subInputValue" :value="subInputValue" @change="e=>subInputValue=e.target.value" class="form-control">
                            </div>
                        </div>
                        <div  class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                            <button @click="onSubDialogSave" class="btn btn-second nocorner" style="width: 120px">
                            <span class="icon one-save"></span> Lưu
                        </button>
                        </div>
                    </div>
                </div>
            </ejs-dialog>
        </div>
    </ejs-dialog>
</template>
<script>
import moment from 'moment'
import API from './API'
export default {
    name:'PlannedRevenueModal',
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
          return `<span class="icon one-notepad"></span> Tạo mới doanh thu kế hoạch`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh doanh thu kế hoạch`
        }else{
          return `<span class="icon one-notepad"></span> Doanh thu kế hoạch`
        }
      },
      formattedRevenue() {
        if (this.input_doanhthu === null || this.input_doanhthu === undefined) return '';
        return this.input_doanhthu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },

            center_selected:0,
            center_list:[
                {
                    id:0,
                    text:'Tất cả'
                }
            ],
            deparment_selected:0,
            department_list:[
                 {
                    id:0,
                    text:'Tất cả'
                }
            ],
            group_selected:0,
            group_list:[
                {
                    id:0,
                    text:'Tất cả'
                }
            ],
            thang:moment(new Date()).format('MM/YYYY'),
            project_selected:null,
            project_list:[],
            input_doanhthu:'',
            hangmuc_list:[],
            hangmuc_selected:null,
            showSubDialog: false,
            subInputValue: '',
            isAdmin:false
        }
    },
    methods:{
        showModal() {
            this.$refs["popupPlannedRevenue"].show()
        },
        hideModal() {
            this.$refs["popupPlannedRevenue"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        async initDuLieu(){
            let dataUnit=await API.GetAllUnit(this)
            if(dataUnit){
                this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
                return {
                    id:x.department_id,
                    text:x.name
                }
                }))
                this.department_list=this.department_list.concat(dataUnit.deparments.map(x=>{
                return {
                    id:x.department_id,
                    text:x.name
                }
                }))
                this.group_list=this.group_list.concat(dataUnit.groups.map(x=>{
                return {
                    id:x.department_id,
                    text:x.name
                }
                }))
            }
            this.project_list=await API.GetAllProject(this)
            this.project_list.unshift({
                project_id: 0,
                project_name: "Chọn"
            })
            this.project_selected=0

            this.hangmuc_list=await API.GetItemRevenueAll(this)
            if(this.hangmuc_list.length>0){
                this.hangmuc_selected=this.hangmuc_list[0].item_revenue_id
            }

            if(this.isViewDetail||(!this.isAdd&&!this.isViewDetail)){
                this.center_selected=this.data.center_id
                this.deparment_selected=this.data.department_id
                this.group_selected=this.data.group_id
                this.project_selected=this.data.project_id
                this.hangmuc_selected=this.data.item_id
                this.input_doanhthu=this.data.revenue?this.data.revenue.toString():''
                this.thang=this.data.period_display?this.data.period_display:''
            }

            let checkAdmin=await API.CheckAdmin(this)
            this.isAdmin=checkAdmin=='1'
        },
        clear(){
            this.center_selected=0
            this.center_list=[
                {
                    id:0,
                    text:'Tất cả'
                }
            ]
            this.deparment_selected=0
            this.department_list=[
                 {
                    id:0,
                    text:'Tất cả'
                }
            ]
            this.group_selected=0
            this.group_list=[
                {
                    id:0,
                    text:'Tất cả'
                }
            ]
            this.thang=moment(new Date()).format('MM/YYYY')
            this.project_selected=null
            this.project_list=[]
            this.input_doanhthu=''
            this.hangmuc_list=[]
            this.hangmuc_selected=null
            this.showSubDialog=false
            this.subInputValue=''
            this.isAdmin=false
        },
        onInput(event) {
            // Lấy giá trị chuỗi nhập vào, bỏ dấu chấm
            const rawValue = event.target.value.replace(/\./g, '');
            
            // Cập nhật số vào data
            this.input_doanhthu= rawValue?rawValue.toString():'';

            // Định dạng lại có dấu chấm
            event.target.value = this.formattedRevenue;

            // (Optional) Đưa con trỏ về cuối sau khi format
            this.$nextTick(() => {
                const el = event.target;
                el.selectionStart = el.selectionEnd = el.value.length;
            });
        },
        onlyNumberKey(event) {
            const charCode = event.which ? event.which : event.keyCode;

            if (charCode === 13) {
                //this.handleChiaDoanhThuThang()
                return
            }

            if (charCode < 48 || charCode > 57) {
                event.preventDefault(); // chặn không cho nhập
            }
        },
        async onCenterChange(){
            this.department_list=[
                {
                id:0,
                text:'Tất cả'
                }
            ]
            this.group_list=[
                {
                id:0,
                text:'Tất cả'
                }
            ]
            this.deparment_selected=0
            this.group_selected=0
            var arrParentId=[this.center_selected]
            let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
            this.department_list=this.department_list.concat(rsDeparment.map(x=>{
                return {
                id:x.department_id,
                text:x.name
                }
            }))
            arrParentId=rsDeparment.map(x=>x.department_id)
            let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4)
            this.group_list=this.group_list.concat(rsGroup.map(x=>{
                return {
                id:x.department_id,
                text:x.name
                }
            }))
        },
        async onDeparmentChange(){
            this.group_list=[
                {
                id:0,
                text:'Tất cả'
                }
            ]
            this.group_selected=0
            var arrParentId=[]
            if(this.deparment_selected){
                arrParentId=[this.deparment_selected]
            }else{
                arrParentId=this.department_list.filter(x=>x.id!=0).map(x=>x.id)
            }
            let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4)
            this.group_list=this.group_list.concat(rsGroup.map(x=>{
                return {
                id:x.department_id,
                text:x.name
                }
            }))

        },
        async addPlannedRevenue(){
            //Check
            if(!this.input_doanhthu||this.input_doanhthu==''||this.input_doanhthu=='0'){
                this.$toast.error("Vui lòng nhập doanh thu")
                return
            }
            if(this.center_selected==0&&this.deparment_selected==0&&this.group_selected==0){
                this.$toast.error("Vui lòng chọn it nhất Trung tâm hoặc Phòng ban hoặc Nhóm sản phẩm")
                return
            }
            //
            var unit_id=null
            if(this.group_selected>0){
                unit_id=this.group_selected
            }else if(this.deparment_selected>0){
                unit_id=this.deparment_selected
            }else if(this.center_selected>0){
                unit_id=this.center_selected
            }
            let dataRequest={
                project_id: this.project_selected,
                unit_id: unit_id, 
                item_id: this.hangmuc_selected,
                revenue: Number(this.input_doanhthu.trim()), 
                period: Number(moment(this.thang, 'MM/YYYY').format('YYYYMM')),
            }
            let result=await API.AddPlannedRevenue(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successPlannedRevenue')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async updatePlannedRevenue(){
            //Check
            if(!this.input_doanhthu||this.input_doanhthu==''||this.input_doanhthu=='0'){
                this.$toast.error("Vui lòng nhập doanh thu")
                return
            }
            if(this.center_selected==0&&this.deparment_selected==0&&this.group_selected==0){
                this.$toast.error("Vui lòng chọn it nhất Trung tâm hoặc Phòng ban hoặc Nhóm sản phẩm")
                return
            }
            //
            var unit_id=null
            if(this.group_selected>0){
                unit_id=this.group_selected
            }else if(this.deparment_selected>0){
                unit_id=this.deparment_selected
            }else if(this.center_selected>0){
                unit_id=this.center_selected
            }
            let dataRequest={
                planned_revenue_id:this.data.planned_revenue_id,
                project_id: this.project_selected,
                unit_id: unit_id, 
                item_id: this.hangmuc_selected,
                revenue: Number(this.input_doanhthu.trim()), 
                period: Number(moment(this.thang, 'MM/YYYY').format('YYYYMM')),
            }
            let result=await API.UpdatePlannedRevenue(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successPlannedRevenue')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async onSave(){
            if(this.isAdd){
                this.addPlannedRevenue()
            }else{
                this.updatePlannedRevenue()
            }
        },
        changeThang(event){
          this.thang=moment(event.value).format('MM/YYYY')
        },
        onOpenSubDialog() {
            this.subInputValue = '';
        },
        async onSubDialogSave() {
            if(!this.subInputValue||this.subInputValue.trim()==''){
                this.$toast.error('Vui lòng nhập giá trị')
                this.$refs.subInputValue.focus()
                return
            }
            let dataRequest={
                item_revenue_name:this.subInputValue.trim()
            }
            let result=await API.AddItemRevenue(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$refs['subDialog'].hide()
                this.hangmuc_list=await API.GetItemRevenueAll(this)
            }else{
                this.$toast.error(result)
            }
        },
        openSubDialog() {
            this.$refs['subDialog'].show()
        }
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