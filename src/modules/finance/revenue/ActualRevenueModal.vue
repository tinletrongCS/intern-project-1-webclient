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
        :open="handleShowModal"
        @close="handleCloseModal">
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
                            <div class="key w140 bold">Loại doanh thu</div>
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
                            <div class="key w140 bold">Hợp đồng</div>
                            <div class="value">
                                <select2 
                                    v-model='contract_selected'
                                    :options="contract_list.map(e=>({id:e.contract_id, text:e.name}))"
                                    @select="changeHopDong"
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
                            <div class="key w140 bold">Hạng mục</div>
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
                            <div class="key w140 bold">Doanh thu</div>
                            <div class="value">
                                <input type="text" :disabled="contract_selected!=0" @blur="handleBlurInputDoanhThu" :value="formattedRevenue" @input="onInput" @keypress="onlyNumberKey" class="form-control">
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
                    <div class="key w140 bold">File đính kèm</div>
                    <div class="value wp100">
                        <AttachFile v-if="!disabledFileAttack" ref="attachFile" 
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
                            v-if="!disabledFileAttack"
                            class="btn-delete"
                            title="Xóa file"
                            @click="onRemoveFile(file)"
                        >
                            ✕
                        </button>
                        </div>
                    </div>
                </div>

                <div class="info-row">
                    <div class="key w140 bold"></div>
                    <div class="value">
                        <!-- <KDataGrid
                            ref="gridDsDetail"
                            :columns="columns"
                            :dataSource="dataSources"
                            :enable-paging-server="false"
                            :allowPaging="false"
                            :showFilter="false"
                            :showColumnCheckbox="false"
                            :enabledSelectFirstRow="true"
                            :showSTT="false"
                             @queryCellInfo="queryCellInfo"
                             @rowDataBound="grid_rowDataBound"
                            :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                        /> -->
                        <RevenueTable ref="revenueTable"/>
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
import AttachFile from '../../work/kanban/task/AttachFile.vue';
import { createApp } from "vue"
const app = createApp()
import RevenueTable from './RevenueTable.vue'
export default {
    name:'ActualRevenueModal',
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
        AttachFile,
        RevenueTable
    },
    computed:{
      header(){
        if(this.isAdd){
          return `<span class="icon one-notepad"></span> Thêm mới doanh thu thực tế`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh doanh thu thực tế`
        }else{
          return `<span class="icon one-notepad"></span> Doanh thu thực tế`
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
            project_selected:null,
            project_list:[],
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
            contract_list:[
                {
                    contract_id:0,
                    code:'',
                    project_id:0,
                    name:'Chọn',
                    amount:0,
                    amount_vat:0,
                    customer_name:''
                }
            ],
            contract_selected:0,
            tu_thang:moment(new Date()).format('MM/YYYY'),
            den_thang:moment(new Date()).format('MM/YYYY'),
            columns:[
                {
                    fieldName:'period_display',
                    headerText:'Tháng',
                    allowFiltering:true,
                },
                {
                    fieldName:'revenue_detail_type_name',
                    headerText:'Loại',
                    allowFiltering:true,
                },
                {
                    fieldName:'period',
                    headerText:'Doanh thu',
                    allowFiltering:true,
                    template: this.columnTemplateInput(this) 
                },
            ],
            dataSources:[],
            disabledFileAttack:true,
            fileAttachments: [],

            actualRevenue:{},
            isSaveAddNewSuccess:false
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

            this.disabledFileAttack=this.isViewDetail

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

            let contracts=await API.GetContractAll(this)
            this.contract_list=this.contract_list.concat(contracts)

            let checkAdmin=await API.CheckAdmin(this)
            this.isAdmin=checkAdmin=='1'
            // 
            const newDataSources = this.normalizeRevenueData(this.dataSources, this.tu_thang, this.den_thang)
            this.dataSources=newDataSources.concat([])
            var groupedData = this.groupRevenueData(this.dataSources)
            this.$refs.revenueTable.loadData(groupedData)

            if(this.isViewDetail||(!this.isAdd&&!this.isViewDetail)){
               
                Object.assign(this.actualRevenue, this.data)
                this.center_selected=this.actualRevenue.center_id
                this.deparment_selected=this.actualRevenue.department_id
                this.group_selected=this.actualRevenue.group_id
                this.project_selected=this.actualRevenue.project_id
                this.hangmuc_selected=this.actualRevenue.item_id
                this.revenue_type_selected=this.actualRevenue.revenue_type
                
                this.input_doanhthu=this.actualRevenue.revenue?this.actualRevenue.revenue.toString():''
                this.tu_thang=this.actualRevenue.from_period_display?this.actualRevenue.from_period_display:''
                this.den_thang=this.actualRevenue.to_period_display?this.actualRevenue.to_period_display:''


                let result = await API.GetActualRevenueInfoById(this, this.data.actual_revenue_id)
                if(result){
                    if(result.actualRevenue){
                        Object.assign(this.actualRevenue, result.actualRevenue)
                        this.contract_selected=this.actualRevenue.contract_id
                    }
                    if(result.actualRevenueDetails){
                        let details=result.actualRevenueDetails.sort((a, b) => a.period - b.period)
                        this.dataSources=details.concat([])

                        groupedData = this.groupRevenueData(this.dataSources)
                        this.$refs.revenueTable.loadData(groupedData)
                    }
                    if(result.attachmentFiles){
                        this.fileAttachments=result.attachmentFiles.concat([])
                    }
                }else{
                    this.$toast.error("Đã xảy ra lỗi không load được thông tin")
                }

            }
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
            this.project_selected=null
            this.project_list=[]
            this.input_doanhthu=''
            this.hangmuc_list=[]
            this.hangmuc_selected=null
            this.showSubDialog=false
            this.subInputValue=''
            this.isAdmin=false
            this.revenue_type_selected=1
            this.contract_list=[
                {
                    contract_id:0,
                    code:'',
                    project_id:0,
                    name:'Chọn',
                    amount:0,
                    amount_vat:0,
                    customer_name:''
                }
            ]
            this.contract_selected=0
            this.tu_thang=moment(new Date()).format('MM/YYYY')
            this.den_thang=moment(new Date()).format('MM/YYYY')
            this.dataSources=[]
            this.disabledFileAttack=true
            this.fileAttachments=[]
            this.actualRevenue={}
            this.isSaveAddNewSuccess=false
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
        //Trường hợp thêm mới attach file không thêm mới check có file request y/c remove files
        async handleCloseModal(){
            if(this.isAdd&&!this.isSaveAddNewSuccess&&this.fileAttachments.length>0){
                let file_attachment_ids=JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
                await API.DeleteFileAttachments(this, file_attachment_ids)
            }
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

                // Duyệt 2 loại: 1 (PT mới) và 2 (Duy trì)
                [1, 2].forEach(type => {
                    const key = `${period}-${type}`;
                    if (dataSourceMap[key]) {
                        result.push({
                            ...dataSourceMap[key],
                            period_display,
                            revenue_detail_type_name: type === 1 ? 'PT mới' : 'Duy trì'
                        });
                    } else {
                        result.push({
                            actual_revenue_detail_id: 0,
                            revenue: 0,
                            period,
                            period_display,
                            revenue_detail_type: type,
                            revenue_detail_type_name: type === 1 ? 'PT mới' : 'Duy trì'
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
                    actual_revenue_detail_id:item.actual_revenue_detail_id
                });
            });

            return grouped;
        },
        async onSelectFiles(files){
            const formData = new FormData()
            files.forEach(file => formData.append('files', file))
            var ref_id=0
            if(!this.isAdd){
                ref_id=this.actualRevenue.actual_revenue_id
            }
            let result=await API.UploadFileCommon(this, formData, 'actual_revenue', ref_id)
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
            this.axios.get(`revenue/Upload/Download`, {
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
        async addActualRevenue(){
            //Check
            if(this.center_selected==0&&this.deparment_selected==0&&this.group_selected==0){
                this.$toast.error("Vui lòng chọn it nhất Trung tâm hoặc Phòng ban hoặc Nhóm sản phẩm")
                return
            }
            // if(!this.contract_selected){
            //     this.$toast.error("Vui lòng chọn thông tin hợp đồng")
            //     return
            // }
            if(!this.input_doanhthu||this.input_doanhthu.trim()==''||this.input_doanhthu.trim()=='0'){
                this.$toast.error("Vui lòng nhập doanh thu")
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
                contract_id:this.contract_selected,
                revenue_type:this.revenue_type_selected,
                from_period:Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM')),
                to_period:Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM')),
                actual_revenue_details:this.dataSources.map(x=>{
                    return {
                        actual_revenue_detail_id: x.actual_revenue_detail_id,
                        revenue: x.revenue,
                        period:x.period,
                        revenue_detail_type:x.revenue_detail_type
                    }
                }),
                list_file_attachment:JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
            }
            let result=await API.AddActualRevenue(this, dataRequest)
            if(result=='1'){
                this.isSaveAddNewSuccess=true
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successActualRevenue')
                this.hideModal()
            }else{
                this.$toast.error(result)
            }
        },
        async updateActualRevenue(){
            //Check
            if(this.center_selected==0&&this.deparment_selected==0&&this.group_selected==0){
                this.$toast.error("Vui lòng chọn it nhất Trung tâm hoặc Phòng ban hoặc Nhóm sản phẩm")
                return
            }
            // if(!this.contract_selected){
            //     this.$toast.error("Vui lòng chọn thông tin hợp đồng")
            //     return
            // }
            if(!this.input_doanhthu||this.input_doanhthu.trim()==''||this.input_doanhthu.trim()=='0'){
                this.$toast.error("Vui lòng nhập doanh thu")
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
            if(this.group_selected>0){
                unit_id=this.group_selected
            }else if(this.deparment_selected>0){
                unit_id=this.deparment_selected
            }else if(this.center_selected>0){
                unit_id=this.center_selected
            }
            let dataRequest={
                actual_revenue_id:this.actualRevenue.actual_revenue_id,
                project_id: this.project_selected,
                unit_id: unit_id, 
                item_id: this.hangmuc_selected,
                revenue: Number(this.input_doanhthu.trim()), 
                contract_id:this.contract_selected,
                revenue_type:this.revenue_type_selected,
                from_period:Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM')),
                to_period:Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM')),
                actual_revenue_details:this.dataSources.map(x=>{
                    return {
                        actual_revenue_detail_id: x.actual_revenue_detail_id,
                        revenue: x.revenue,
                        period:x.period,
                        revenue_detail_type:x.revenue_detail_type
                    }
                }),
                list_file_attachment:JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
            }
            let result=await API.UpdateActualRevenue(this, dataRequest)
            if(result=='1'){
                this.$toast.success('Lưu dữ liệu thành công!')
                this.$emit('successActualRevenue')
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
            if(this.isAdd&&this.input_doanhthu&&Number(this.input_doanhthu)>0&&this.dataSources.length>0){
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
            }else if(this.isAdd&&(this.input_doanhthu==''||Number(this.input_doanhthu)==0)&&this.dataSources.length>0){
                 this.dataSources=this.dataSources.map(x=>{
                    x.revenue=0
                    return x
                }).concat([])
                const groupedData = this.groupRevenueData(this.dataSources);
                this.$refs.revenueTable.loadData(groupedData)
            }
        },
        changeLoaiDoanhThu(){
            this.contract_selected=0
            this.input_doanhthu=''
            this.handleChiaDoanhThuThang()
        },
        changeHopDong(){
            const index=this.contract_list.findIndex(x=>x.contract_id==this.contract_selected)
            if(index>-1){
                const contract=this.contract_list[index]
                this.input_doanhthu=contract.amount?contract.amount.toString():'0'
                this.handleChiaDoanhThuThang()
            }
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
        onChangeInputDoanhThu(data, value){
            // Bỏ tất cả dấu chấm hoặc phẩy (tùy phân cách locale)
            const raw = value.replace(/[.,]/g, '');
            const index=this.dataSources.findIndex(x=>x.period==data.period&&x.revenue_detail_type==data.revenue_detail_type)
            if(index>-1){
                this.dataSources[index].revenue=Number(raw)
            }
            console.log('onChangeInputDoanhThu', this.dataSources)
        },
        columnTemplateInput(parent) {
            return function () {
                return {
                template: app.component("columnTemplateInput", {
                        template: `
                            <input type="text" class="form-control" :value="formattedRevenue" @input="onInput" @keypress="onlyNumberKey" @change="onChangeInputDoanhThu" :disabled="disabled">
                        `,
                        data() {
                            return {
                                parent: parent,
                                data: {}
                            }
                        },
                        computed: {
                            disabled(){
                                return this.parent.isViewDetail
                            },
                            // Hiển thị revenue có phân cách dấu chấm
                            formattedRevenue() {
                                if (this.data.revenue === null || this.data.revenue === undefined) return '';
                                return this.data.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            }
                        },
                        methods: {
                            onChangeInputDoanhThu(e) {
                                this.parent.onChangeInputDoanhThu(this.data, e.target.value)
                            },
                            onInput(event) {
                                // Lấy giá trị chuỗi nhập vào, bỏ dấu chấm
                                const rawValue = event.target.value.replace(/\./g, '');
                                
                                // Cập nhật số vào data
                                this.data.revenue = Number(rawValue);

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
                                    if (charCode < 48 || charCode > 57) {
                                    event.preventDefault(); // chặn không cho nhập
                                }
                            }
                        }
                    })
                }
            }
        },
        
        changeThangBD(event){
            this.tu_thang=moment(event.value).format('MM/YYYY')
            const newDataSources = this.normalizeRevenueData(this.dataSources, this.tu_thang, this.den_thang)
            this.dataSources=newDataSources.concat([])
            this.handleChiaDoanhThuThang()
            const groupedData = this.groupRevenueData(this.dataSources);
            this.$refs.revenueTable.loadData(groupedData)
        },
        changeThangKT(event){
            this.den_thang=moment(event.value).format('MM/YYYY')
            const newDataSources = this.normalizeRevenueData(this.dataSources, this.tu_thang, this.den_thang)
            this.dataSources=newDataSources.concat([])
            this.handleChiaDoanhThuThang()
            const groupedData = this.groupRevenueData(this.dataSources);
            this.$refs.revenueTable.loadData(groupedData)
        },
        async onSave(){
            if(this.isAdd){
                this.addActualRevenue()
            }else{
                this.updateActualRevenue()
            }
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
        },
        //Handle reload or exit page remove file server not save
        async handleBeforeUnload(event) {
           if(this.isAdd&&!this.isSaveAddNewSuccess&&this.fileAttachments.length>0){
                let file_attachment_ids=JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
                await API.DeleteFileAttachments(this, file_attachment_ids)
            }
        },
        queryCellInfo(args){
          const field = args.column.field
          const data = args.data
        },
        grid_rowDataBound(args) {
            
        },
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