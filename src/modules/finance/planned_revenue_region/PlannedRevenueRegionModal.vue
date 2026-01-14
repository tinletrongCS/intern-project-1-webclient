<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupPlannedRevenueRegion"
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
                            <div class="key w140 bold">Địa bàn<required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='region_selected'
                                    :options="region_list"
                                    :disabled="isViewDetail"
                                    @select="onRegionChange"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Trung tâm<required-marker/></div>
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
                  </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Phòng ban</div>
                            <div class="value">
                                <select2 
                                    v-model='department_selected'
                                    :options="department_list"
                                    :disabled="isViewDetail"
                                />
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Loại doanh thu<required-marker/></div>
                            <div class="value">
                                <select2 
                                    v-model='revenue_type_selected'
                                    :disabled="isViewDetail"
                                    :options="revenue_type_list"
                                    @select="changeLoaiDoanhThu"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Lĩnh vực<required-marker/></div>
                            <div style="display: flex !important;align-items: center !important;">
                                <div class="value"  style="flex: 1 !important;">
                                    <select2 
                                        v-model='field_selected'
                                        :options="field_list.map(e=>({id:e.field_revenue_id, text:e.display_field}))"
                                        @select="changeLinhVuc"
                                        :disabled="isViewDetail"
                                    />
                                </div>
                                <div v-if="isAdmin&&(this.isAdd||!this.isViewDetail)" class="value w30 custom-value-btn">
                                    <button @click="openFieldSubDialog" class="btn btn-second">
                                        <span class="-ap icon-plus"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Dịch vụ</div>
                            <div class="value">
                                <select2 
                                    v-model='service_selected'
                                    :disabled="isViewDetail"
                                    :options="service_list.map(e=>({id:e.service_id, text:e.service_name}))"
                                />
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Hạng mục<required-marker/></div>
                            <div style="display: flex !important;align-items: center !important;">
                                <div class="value" style="flex: 1 !important;">
                                    <select2 
                                        v-model='hangmuc_selected'
                                        :options="hangmuc_list.map(e=>({id:e.item_revenue_id, text:e.item_revenue_name}))"
                                        :disabled="isViewDetail"
                                    />
                                </div>
                                <div v-if="isAdmin&&(this.isAdd||!this.isViewDetail)" class="value w30 custom-value-btn">
                                    <button class="btn btn-second" @click="openSubDialog">
                                        <span class="-ap icon-plus"></span>
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Doanh thu<required-marker/></div>
                            <div class="value">
                                <input type="text" @blur="handleBlurInputDoanhThu" :value="formattedRevenue" @input="onInput" @keypress="onlyNumberKey" @change="changeInputDoanhThu" class="form-control">
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Từ tháng</div>
                            <div class="value">
                                <div class="input-icon-right">
                                    <ejs-datepicker
                                        v-model="tu_thang"
                                        format="MM/yyyy"
                                        :showClearButton="false"
                                        :allowEdit="true"
                                        :strict-mode="true"
                                        locale="vi"
                                        @change="changeThangBD"
                                        :firstDayOfWeek="1"
                                        :enabled="!isViewDetail"
                                        start="Year"
                                        depth="Year"
                                    />
                                </div>
                            </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-12">
                        <div class="info-row">
                            <div class="key w140 bold">Đến tháng</div>
                            <div class="value">
                                <div class="input-icon-right">
                                    <ejs-datepicker
                                        v-model="den_thang"
                                        format="MM/yyyy"
                                        :showClearButton="false"
                                        :allowEdit="true"
                                        :strict-mode="true"
                                        locale="vi"
                                        @change="changeThangKT"
                                        :firstDayOfWeek="1"
                                        :enabled="!isViewDetail"
                                        start="Year"
                                        depth="Year"
                                    />
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
                  

                <div class="info-row">
                    <div class="key w140 bold"></div>
                    <div class="value">
                        <RevenueTable ref="revenueTable"
                             @sumTotalRevenue="sumTotalRevenue"
                        />
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
                :open="onOpenFieldSubDialog"
                ref="subDialogField"
                :allowDragging="true"
                :visible="false"
                :position="{ X: 'center', Y: 'center' }"
                >
                <div class="popup-body">
                    <div class="box-form">
                        <div class="info-row">
                            <div class="key w100 bold">Mã lĩnh vực</div>
                            <div class="value">
                                <input type="text" :value="field_code" @change="e=>field_code=e.target.value" class="form-control">
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="key w100 bold">Tên lĩnh vực</div>
                            <div class="value">
                                <input type="text" :value="field_name" @change="e=>field_name=e.target.value" class="form-control">
                            </div>
                        </div>
                        <div  class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                            <button @click="onSubFieldDialogSave" class="btn btn-second nocorner" style="width: 120px">
                            <span class="icon one-save"></span> Lưu
                        </button>
                        </div>
                    </div>
                </div>
            </ejs-dialog>

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
import RevenueTable from './RevenueTable.vue'
export default {
    name:'PlannedRevenueRegionModal',
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
        RevenueTable
    },
    computed:{
      header(){
        if(this.isAdd){
          return `<span class="icon one-notepad"></span> Tạo mới doanh thu kế hoạch địa bàn`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh doanh thu kế hoạch địa bàn`
        }else{
          return `<span class="icon one-notepad"></span> Doanh thu kế hoạch địa bàn`
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
            region_selected:0,
            region_list:[
                {
                    id:0,
                    text:'Chọn'
                }
            ],
            center_selected:0,
            center_list:[
                 {
                    id:0,
                    text:'Chọn'
                }
            ],
            department_selected:0,
            department_list:[
                {
                    id:0,
                    text:'Chọn'
                }
            ],
            service_selected:null,
            service_list:[],
            input_doanhthu:'',
            hangmuc_list:[],
            hangmuc_selected:null,
            showSubDialog: false,
            subInputValue: '',
            isAdmin:false,
            revenue_type_list:[
                {
                    id:1,
                    text:'Doanh thu khách hàng'
                },
                {
                    id:2,
                    text:'Doanh thu phân chia'
                },
            ],
            revenue_type_selected:1,
            field_list:[
                {
                   field_revenue_id:0,
                   display_field:'Chọn'
                }
            ],
            field_selected:0,
            tu_thang:moment(new Date()).format('MM/YYYY'),
            den_thang:moment(new Date()).format('MM/YYYY'),
            dataSources:[],

            plannedRevenueRegion:{},
            isSaveAddNewSuccess:false,
            field_code:'',
            field_name:'',
            firstRevenue:''
        }
    },
    methods:{
        showModal() {
            this.$refs["popupPlannedRevenueRegion"].show()
        },
        hideModal() {
            this.$refs["popupPlannedRevenueRegion"].hide()
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
                this.region_list=this.region_list.concat(dataUnit.regions.map(x=>{
                        return {
                            id:x.department_id,
                            text:x.name
                        }
                    }))
                    this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
                        return {
                            id:x.department_id,
                            text:x.name
                        }
                    }))
                    this.department_list=this.department_list.concat(dataUnit.departments.map(x=>{
                        return {
                            id:x.department_id,
                            text:x.name
                        }
                    }))
            }

            this.service_list=await API.GetServiceAll(this)
            this.service_list.unshift({
                service_id: 0,
                service_name: "Chọn"
            })
            this.service_selected=0

            this.hangmuc_list=await API.GetItemRevenueAll(this)
            if(this.hangmuc_list.length>0){
                this.hangmuc_selected=this.hangmuc_list[0].item_revenue_id
            }

            let fields=await API.GetFieldRevenueAll(this)
            this.field_list=this.field_list.concat(fields)

            let checkAdmin=await API.CheckAdmin(this)
            this.isAdmin=checkAdmin=='1'
            // 
            const newDataSources = this.normalizeRevenueData(this.dataSources, this.tu_thang, this.den_thang)
            this.dataSources=newDataSources.concat([])
            var groupedData = this.groupRevenueData(this.dataSources)
            this.$refs.revenueTable.loadData(groupedData)

            if(this.isViewDetail||(!this.isAdd&&!this.isViewDetail)){
               
                Object.assign(this.plannedRevenueRegion, this.data)
                this.region_selected=this.plannedRevenueRegion.region_id
                this.center_selected=this.plannedRevenueRegion.center_id
                this.department_selected=this.plannedRevenueRegion.department_id
                this.service_selected=this.plannedRevenueRegion.service_id
                this.hangmuc_selected=this.plannedRevenueRegion.item_id
                this.revenue_type_selected=this.plannedRevenueRegion.revenue_type
                this.field_selected=this.plannedRevenueRegion.field_id
                
                this.input_doanhthu=this.plannedRevenueRegion.revenue?this.plannedRevenueRegion.revenue.toString():''
                this.firstRevenue=this.plannedRevenueRegion.revenue?this.plannedRevenueRegion.revenue.toString():''
                this.tu_thang=this.plannedRevenueRegion.from_period_display?this.plannedRevenueRegion.from_period_display:''
                this.den_thang=this.plannedRevenueRegion.to_period_display?this.plannedRevenueRegion.to_period_display:''


                let result = await API.GetPlannedRevenueRegionInfoById(this, this.data.planned_revenue_region_id)
                if(result){
                    if(result.plannedRevenueRegion){
                        Object.assign(this.plannedRevenueRegion, result.plannedRevenueRegion)
                        this.field_selected=this.plannedRevenueRegion.field_id
                    }
                    if(result.plannedRevenueRegionDetails){
                        let details=result.plannedRevenueRegionDetails.sort((a, b) => a.period - b.period)
                        this.dataSources=details.concat([])

                        groupedData = this.groupRevenueData(this.dataSources)
                        console.log('groupedData', groupedData)
                        this.$refs.revenueTable.loadData(groupedData)
                    }
                }else{
                    this.$toast.error("Đã xảy ra lỗi không load được thông tin")
                }
            }
        },
        clear(){
            this.region_selected=0
            this.region_list=[
                {
                    id:0,
                    text:'Chọn'
                }
            ]
            this.center_selected=0
            this.center_list=[
                 {
                    id:0,
                    text:'Chọn'
                }
            ]
            this.department_selected=0
            this.department_list=[
                {
                    id:0,
                    text:'Chọn'
                }
            ]
            this.service_selected=null
            this.service_list=[]
            this.input_doanhthu=''
            this.hangmuc_list=[]
            this.hangmuc_selected=null
            this.showSubDialog=false
            this.subInputValue=''
            this.isAdmin=false
            this.revenue_type_selected=1
            this.field_list=[
                {
                   field_revenue_id:0,
                   display_field:'Chọn'
                }
            ]
            this.field_selected=0
            this.tu_thang=moment(new Date()).format('MM/YYYY')
            this.den_thang=moment(new Date()).format('MM/YYYY')
            this.dataSources=[]
            this.plannedRevenueRegion={}
            this.isSaveAddNewSuccess=false
            this.firstRevenue=''
        },
        async onRegionChange(){
            this.center_list=[
                {
                    id:0,
                    text:'Chọn'
                }
            ]
            this.department_list=[
                {
                    id:0,
                    text:'Chọn'
                }
            ]
            this.center_selected=0
            this.department_selected=0
            var arrParentId=[this.region_selected]
            let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),2)
            this.center_list=this.center_list.concat(rsDeparment.map(x=>{
                return {
                    id:x.department_id,
                    text:x.name
                }
            }))
            arrParentId=rsDeparment.map(x=>x.department_id)
            let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
            this.department_list=this.department_list.concat(rsGroup.map(x=>{
                return {
                    id:x.department_id,
                    text:x.name
                }
            }))
        },
        async onCenterChange(){
            this.department_list=[
                {
                id:0,
                text:'Chọn'
                }
            ]
            this.department_selected=0
            var arrParentId=[]
            if(this.center_selected){
                arrParentId=[this.center_selected]
            }else{
                arrParentId=this.center_list.filter(x=>x.id!=0).map(x=>x.id)
            }
            let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
            this.department_list=this.department_list.concat(rsGroup.map(x=>{
                return {
                id:x.department_id,
                text:x.name
                }
            }))

        },
        normalizeRevenueData(dataSources, tu_thang, den_thang) {
            const from = moment(tu_thang, 'MM/YYYY');
            const to = moment(den_thang, 'MM/YYYY');

            const result = [];

            // Map với key dạng 'period-type', ví dụ: '202501-1'
            const dataSourceMap = {};
            dataSources.forEach(item => {
                const key = `${item.period}-${item.revenue_detail_type}`;
                dataSourceMap[key] = item;
            });

            let current = from.clone();
            while (current.isSameOrBefore(to, 'month')) {
                const period = parseInt(current.format('YYYYMM'));
                const period_display = current.format('MM/YYYY');

                // Duyệt 2 loại: 1 (PT mới) và 2 (Duy trì) và 3 (Khác)
                [1, 2, 3].forEach(type => {
                    const key = `${period}-${type}`;
                    if (dataSourceMap[key]) {
                        result.push({
                            ...dataSourceMap[key],
                            period_display,
                            revenue_detail_type_name: type === 1 ? 'PT mới' :type === 2?'Duy trì':'Khác'
                        });
                    } else {
                        result.push({
                            planned_revenue_region_detail_id: 0,
                            revenue: 0,
                            period,
                            period_display,
                            revenue_detail_type: type,
                            revenue_detail_type_name: type === 1 ? 'PT mới' :type === 2?'Duy trì':'Khác'
                        });
                    }
                });

                current.add(1, 'month');
            }

            // Sắp xếp theo period và revenue_detail_type
            result.sort((a, b) => {
                if (a.period === b.period) return a.revenue_detail_type - b.revenue_detail_type;
                return a.period - b.period;
            });

            return result;
        },
        groupRevenueData(data) {
            const grouped = [];

            data.forEach(item => {
                // Tìm xem nhóm đã tồn tại chưa
                let group = grouped.find(g =>
                    g.period === item.period &&
                    g.period_display === item.period_display
                );

                if (!group) {
                    group = {
                        period: item.period,
                        period_display: item.period_display,
                        details: []
                    };
                    grouped.push(group);
                }

                // Thêm phần chi tiết vào nhóm
                group.details.push({
                    period:item.period,
                    revenue: item.revenue,
                    revenue_detail_type: item.revenue_detail_type,
                    revenue_detail_type_name: item.revenue_detail_type_name,
                    planned_revenue_region_detail_id:item.planned_revenue_region_detail_id
                });
            });

            return grouped;
        },
        async addPlannedRevenueRegion(){
            //Check
            if(this.region_selected==0){
                this.$toast.error("Vui lòng chọn Địa bàn")
                return
            }
            if(this.center_selected==0){
                this.$toast.error("Vui lòng chọn Trung tâm")
                return
            }
            if(!this.input_doanhthu||this.input_doanhthu.trim()==''||this.input_doanhthu.trim()=='0'){
                this.$toast.error("Vui lòng nhập doanh thu")
                return
            }

            if(!this.field_selected||this.field_selected==0){
                this.$toast.error("Vui lòng chọn thông tin lĩnh vực")
                return
            }
            if(!this.hangmuc_selected||this.hangmuc_selected==0){
                this.$toast.error("Vui lòng chọn thông tin hạng mục")
                return
            }

            this.dataSources=this.$refs.revenueTable.flattenRevenueData()
            //Check doanh thu từng tháng tổng phải bằng doanh thu chung
            var totalRevenueMonth=this.dataSources.reduce((sum, x) => sum + (x.revenue || 0), 0)
            var totalRevenue=Number(this.input_doanhthu.trim())
            if(totalRevenueMonth!=totalRevenue){
                this.$toast.error(`Tổng doanh thu phân từng tháng phải bằng ${this.formatVNDNumber(this.input_doanhthu)}`);
                return
            }
            //
            var unit_id=null
            if(this.department_selected>0){
                unit_id=this.department_selected
            }else if(this.center_selected>0){
                unit_id=this.center_selected
            }else if(this.region_selected>0){
                unit_id=this.region_selected
            }
            let dataRequest={
                unit_id: unit_id, 
                item_id: this.hangmuc_selected,
                revenue: Number(this.input_doanhthu.trim()), 
                revenue_type:this.revenue_type_selected,
                field_id:this.field_selected,
                service_id:this.service_selected,
                from_period:Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM')),
                to_period:Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM')),
                planned_revenue_region_details:this.dataSources.map(x=>{
                    return {
                        planned_revenue_region_detail_id: x.planned_revenue_region_detail_id,
                        revenue: x.revenue,
                        period:x.period,
                        revenue_detail_type:x.revenue_detail_type
                    }
                }),
            }
            let result=await API.AddPlannedRevenueRegion(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successPlannedRevenueRegion')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async updatePlannedRevenueRegion(){
            if(this.region_selected==0||this.center_selected==0){
                this.$toast.error("Vui lòng chọn Địa bàn với Trung tâm")
                return
            }
            if(!this.input_doanhthu||this.input_doanhthu.trim()==''||this.input_doanhthu.trim()=='0'){
                this.$toast.error("Vui lòng nhập doanh thu")
                return
            }

            if(!this.field_selected||this.field_selected==0){
                this.$toast.error("Vui lòng chọn thông tin lĩnh vực")
                return
            }
            if(!this.hangmuc_selected||this.hangmuc_selected==0){
                this.$toast.error("Vui lòng chọn thông tin hạng mục")
                return
            }
            //Check doanh thu từng tháng tổng phải bằng doanh thu chung
            this.dataSources=this.$refs.revenueTable.flattenRevenueData()
            //Check doanh thu từng tháng tổng phải bằng doanh thu chung
            var totalRevenueMonth=this.dataSources.reduce((sum, x) => sum + (x.revenue || 0), 0)
            var totalRevenue=Number(this.input_doanhthu.trim())
           
            if(totalRevenueMonth!=totalRevenue){
                this.$toast.error(`Tổng doanh thu phân từng tháng phải bằng ${this.formatVNDNumber(this.input_doanhthu)}`);
                return
            }
            //
            var unit_id=null
            if(this.department_selected>0){
                unit_id=this.department_selected
            }else if(this.center_selected>0){
                unit_id=this.center_selected
            }else if(this.region_selected>0){
                unit_id=this.region_selected
            }
            let dataRequest={
                planned_revenue_region_id:this.plannedRevenueRegion.planned_revenue_region_id,
                unit_id: unit_id, 
                item_id: this.hangmuc_selected,
                revenue: Number(this.input_doanhthu.trim()), 
                revenue_type:this.revenue_type_selected,
                field_id:this.field_selected,
                service_id:this.service_selected,
                from_period:Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM')),
                to_period:Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM')),
                planned_revenue_region_details:this.dataSources.map(x=>{
                    return {
                        planned_revenue_region_detail_id: x.planned_revenue_region_detail_id,
                        revenue: x.revenue,
                        period:x.period,
                        revenue_detail_type:x.revenue_detail_type
                    }
                })
            }
            let result=await API.UpdatePlannedRevenueRegion(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successPlannedRevenueRegion')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        handleBlurInputDoanhThu(event){
            this.handleChiaDoanhThuThang()
        },
        formatVNDNumber(value) {
            if (value == null || value === '') return '0';

            // Làm sạch: bỏ dấu cách, dấu chấm ngăn cách (nếu có)
            const cleaned = value.toString().replace(/\./g, '').replace(/\s+/g, '');

            const num = Number(cleaned);

            if (isNaN(num)) return '0';

            return num.toLocaleString('vi-VN');
        },
        handleChiaDoanhThuThang(){
            // if(!this.isAdd&&this.input_doanhthu&&this.input_doanhthu==this.firstRevenue){
            //     return
            // }
            if(this.input_doanhthu&&this.input_doanhthu==this.firstRevenue){
                return
            }
            if(this.input_doanhthu&&Number(this.input_doanhthu)>0&&this.dataSources.length>0){
                let revenueTotal = Number(this.input_doanhthu);
                let count = this.dataSources.length;

                // Tính phần nguyên và phần dư
                let revenueMonth = Math.floor(revenueTotal / count);
                let remainder = revenueTotal % count;

                // Gán revenueMonth cho tất cả, rồi phân bổ phần dư cho những phần tử đầu
                this.dataSources = this.dataSources.map((x, index) => {
                    x.revenue = revenueMonth + (index < remainder ? 1 : 0);
                    return x;
                }).concat([]);

                const groupedData = this.groupRevenueData(this.dataSources);
                this.$refs.revenueTable.loadData(groupedData)
            }else if((this.input_doanhthu==''||Number(this.input_doanhthu)==0)&&this.dataSources.length>0){
                 this.dataSources=this.dataSources.map(x=>{
                    x.revenue=0
                    return x
                }).concat([])

                const groupedData = this.groupRevenueData(this.dataSources);
                this.$refs.revenueTable.loadData(groupedData)
            }
        },
        handleChiaDoanhThuThangV1(){
            if(this.input_doanhthu&&Number(this.input_doanhthu)>0&&this.dataSources.length>0){
                let revenueTotal = Number(this.input_doanhthu);
                let count = this.dataSources.length;

                // Tính phần nguyên và phần dư
                let revenueMonth = Math.floor(revenueTotal / count);
                let remainder = revenueTotal % count;

                // Gán revenueMonth cho tất cả, rồi phân bổ phần dư cho những phần tử đầu
                this.dataSources = this.dataSources.map((x, index) => {
                    x.revenue = revenueMonth + (index < remainder ? 1 : 0);
                    return x;
                }).concat([]);

                const groupedData = this.groupRevenueData(this.dataSources);
                this.$refs.revenueTable.loadData(groupedData)
            }else if((this.input_doanhthu==''||Number(this.input_doanhthu)==0)&&this.dataSources.length>0){
                 this.dataSources=this.dataSources.map(x=>{
                    x.revenue=0
                    return x
                }).concat([])

                const groupedData = this.groupRevenueData(this.dataSources);
                this.$refs.revenueTable.loadData(groupedData)
            }
        },
        changeLoaiDoanhThu(){
           // this.input_doanhthu=''
        },
        changeInputDoanhThu(){
            this.firstRevenue=''
        },
        changeLinhVuc(){

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
                this.handleChiaDoanhThuThang()
                return
            }

            if (charCode < 48 || charCode > 57) {
                event.preventDefault(); // chặn không cho nhập
            }
        },
        changeThangBD(event){
            this.tu_thang=moment(event.value).format('MM/YYYY')
            const newDataSources = this.normalizeRevenueData(this.dataSources, this.tu_thang, this.den_thang)
            this.dataSources=newDataSources.concat([])
            this.handleChiaDoanhThuThangV1()
            const groupedData = this.groupRevenueData(this.dataSources);
            this.$refs.revenueTable.loadData(groupedData)
        },
        changeThangKT(event){
            this.den_thang=moment(event.value).format('MM/YYYY')
            const newDataSources = this.normalizeRevenueData(this.dataSources, this.tu_thang, this.den_thang)
            this.dataSources=newDataSources.concat([])
            this.handleChiaDoanhThuThangV1()
            const groupedData = this.groupRevenueData(this.dataSources);
            this.$refs.revenueTable.loadData(groupedData)
        },
        async onSave(){
            if(this.isAdd){
                this.addPlannedRevenueRegion()
            }else{
                this.updatePlannedRevenueRegion()
            }
        },
        onOpenSubDialog() {
            this.subInputValue = '';
        },
        onOpenFieldSubDialog(){
            this.field_code=''
            this.field_name=''
        },
        sumTotalRevenue(value){
            this.input_doanhthu=value?value.toString():''
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
        async onSubFieldDialogSave(){
            if(!this.field_code||this.field_code.trim()==''){
                this.$toast.error('Vui lòng nhập giá trị mã lĩnh vực')
                return
            }
            if(!this.field_name||this.field_name.trim()==''){
                this.$toast.error('Vui lòng nhập giá trị tên lĩnh vực')
                return
            }
            let dataRequest={
                field_revenue_code:this.field_code.trim(),
                field_revenue_name:this.field_name.trim()
            }

            let result=await API.AddFieldRevenue(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$refs['subDialogField'].hide()
                var rsList=await API.GetFieldRevenueAll(this)
                this.field_list=[
                    {
                        field_revenue_id:0,
                        display_field:'Chọn'
                    }
                ].concat(rsList)
            }else{
                this.$toast.error(result)
            }
        },
        openSubDialog() {
            this.$refs['subDialog'].show()
        },
        openFieldSubDialog() {
            this.$refs['subDialogField'].show()
        }
    },
    watch:{
    },
    mounted() {
        window.addEventListener('beforeunload', this.handleBeforeUnload)
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload)
    },
}
</script>
<style scoped>
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #ccc;
}

.file-link {
  color: #007bff;
  text-decoration: none;
  flex-grow: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-delete {
  background: none;
  border: none;
  color: red;
  font-size: 14px;
  cursor: pointer;
}
.custom-value-btn{
    min-width: 40px !important;
    display: flex !important;
    justify-content: center !important;
}
</style>