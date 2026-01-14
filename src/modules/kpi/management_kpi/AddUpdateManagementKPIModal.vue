<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddUpdateManagementKPI"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        id="add-update-management-kpi"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <div class="row">
                    <div class="col-sm-4 col-12">
                      <div class="info-row">
                          <div class="key bold w120">{{labelTypeSelect}}</div>
                          <div class="value">
                              <select2
                                  v-if="kpi_type==1"
                                  v-model='kpi_personal_selected'
                                  :disabled="!isAdd"
                                  :options="kpi_personal_list.map(e=>({id:e.job_work_position_id, text:e.name}))"
                                  @select="onChangeKPIPersonal"
                              />
                              <select2
                                  v-else
                                  v-model='kpi_department_selected'
                                  :disabled="!isAdd"
                                  :options="kpi_department_list.map(e=>({id:e.department_id, text:e.department_name}))"
                                  @select="onChangeKPIDepartment"
                              />
                          </div>
                      </div>
                    </div>
                    
                    <div class="col-sm-3 col-12">
                      <div class="info-row">
                          <div class="key w80 bold">Từ tháng</div>
                          <div class="value">
                              <ejs-datepicker 
                                  class="form-control" 
                                  placeholder="Chọn tháng"
                                  :format="'MM/yyyy'" 
                                  :start="'Year'" 
                                  :enabled="isAdd" 
                                  :depth="'Year'" 
                                  :showClearButton="false"
                                  v-model="from_month" 
                                  :allowEdit="false" 
                                  @change="onChangeFromMonth($event)" />
                          </div>
                      </div>
                    </div>
                    <div class="col-sm-3 col-12">
                      <div class="info-row">
                          <div class="key w80 bold">Đến tháng</div>
                          <div class="value">
                              <ejs-datepicker 
                                  class="form-control" 
                                  placeholder="Chọn tháng"
                                  :format="'MM/yyyy'" 
                                  :start="'Year'" 
                                  :enabled="isAdd" 
                                  :depth="'Year'" 
                                  :showClearButton="false"
                                  v-model="to_month" 
                                  :allowEdit="false" 
                                  @change="onChangeToMonth($event)" />
                          </div>
                      </div>
                    </div>
                    <div class="col-sm-2 col-12">
                    </div>
                  </div>
                  
                  <KDataGrid
                    ref="gridDsManagementKPI"
                    :columns="columns"
                    :dataSource="dataSources"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="false"
                    :allowSorting="false"
                    :showColumnCheckbox="isAdd"
                    :enabledSelectFirstRow="false"
                    :selectionSettings="{ checkboxOnly: true }"
                  />
                  <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                      <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
                          <span class="icon one-save"></span> Lưu thay đổi
                      </button>
                  </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import API from './API'
import { createApp } from "vue"
import moment from 'moment'
const app = createApp()
export default {
    name:'AddUpdateManagementKPIModal',
    props:{
      isAdd:{
        type:Boolean,
        default:false
      },
      kpi_type:{
        type:Number,
        default:1
      },
      kpi_personal_id:{
        type:Number,
        default:0
      },
      kpi_department_id:{
        type:Number,
        default:0
      },
      kpi_personal_list:{
        type:Array,
        default:()=>[]
      },
      kpi_department_list:{
        type:Array,
        default:()=>[]
      },
      from_month_kpi:{
        type:String,
        default:''
      },
      to_month_kpi:{
        type:String,
        default:''
      },
      arrIds:{
        type:Object,
        default:()=>[]
      }
    },
    components:{

    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' },
          header:`<span class="icon one-notepad"></span>DANH SÁCH BỘ CHỈ SỐ KPI`,
          kpi_personal_selected:null,
          kpi_department_selected:null,
          columns:[
              {
                  fieldName:'kpi_library_id',
                  headerText:'ID',
                  allowFiltering:true,
                  width:'120',
                  visible:false,
                  isPrimaryKey:true
              },
              {
                  fieldName:'code',
                  headerText:'Mã chỉ số',
                  allowFiltering:true,
                  width:'120'
              },
              {
                  fieldName:'name',
                  headerText:'Tên chỉ số',
                  allowFiltering:true
              },
              {
                  fieldName:'description',
                  headerText:'Mô tả',
                  allowFiltering:true
              },
              {
                  fieldName:'measurement_method',
                  headerText:'Công thức/Cách đo lường',
                  allowFiltering:true,
                  disableHtmlEncode:false
              },
              {
                  fieldName:'formula',
                  headerText:'Công thức đánh giá',
                  allowFiltering:true,
                  disableHtmlEncode:false
              },
              {
                  fieldName:'period_from_display',
                  headerText:'Từ tháng',
                  allowFiltering:true
              },
              {
                  fieldName:'period_to_display',
                  headerText:'Đến tháng',
                  allowFiltering:true
              },
              {
                fieldName: 'cycle',
                headerText: 'Chu kỳ',
                allowFiltering: false,
                template: this.GetColumnTemplateInput(this, 'cycle', 'select'),
              },
              {
                fieldName: 'ratio',
                headerText: 'Tỷ lệ',
                allowFiltering: false,
                template: this.GetColumnTemplateInput(this, 'ratio', 'text'),
              },
          ],
          dataSources:[],
          selectedKpis:[],
          from_month: moment().startOf('year').format('MM/yyyy'),
          to_month: moment().endOf('year').format('MM/yyyy')
        }
    },
    computed:{
      labelTypeSelect(){
        return this.kpi_type==1?'Vị trí công việc':'Phòng ban'
      },
    },
    methods:{
        showModal() {
            this.$refs["popupAddUpdateManagementKPI"].show()
        },
        hideModal() {
            this.$refs["popupAddUpdateManagementKPI"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initPopup()
            },200)
        },
        async initGrid(){
          let period_from=Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
          let period_to=Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))
          let dataRequest={
            kpi_type:this.kpi_type,
            department_id:this.kpi_department_selected!=null?this.kpi_department_selected:0,
            work_position_id:this.kpi_personal_selected!=null?this.kpi_personal_selected:0,
            is_add:this.isAdd?1:2,
            arr_management_kpi_id:JSON.stringify(this.arrIds),
            period_from:period_from,
            period_to:period_to
          }
          this.dataSources=[]
          var data=await API.GetManagementKpiListInsertUpdate(this,dataRequest)
          if(data){
            data=JSON.parse(data)
            this.dataSources=data.concat([])
          }

        },
        async initPopup(){
          this.kpi_personal_selected=this.kpi_personal_id
          this.kpi_department_selected=this.kpi_department_id

          this.from_month =  this.from_month_kpi
          this.to_month =  this.to_month_kpi

          this.initGrid()
        },
        clear(){
          this.kpi_personal_selected=null
          this.kpi_department_selected=null
          this.dataSources=[]
          this.selectedKpis=[]
        },
        onChangeKPIPersonal(){
          this.initGrid()
        },
        onChangeKPIDepartment(){
          this.initGrid()
        },
        onFieldChanged(row, field, value) {
          if (field == 'ratio') {
            // bỏ khúc này tác động grid bị refesh
            // const grid = this.$refs.gridDsManagementKPI.grid.ej2Instances;
            // grid.setCellValue(data.kpi_library_id, 'ratio', value);
            // data.ratio = value;

            row.ratio = value; // cập nhật hiển thị trong grid
            const index = this.selectedKpis.findIndex(x => x.kpi_library_id === row.kpi_library_id);
            if (index === -1) {
              // chưa có → thêm mới
              this.selectedKpis.push({
                kpi_library_id: row.kpi_library_id,
                ratio: row.ratio ?? null,
                cycle: row.cycle ?? null
              });
            } else {
              // có rồi → update
              this.selectedKpis[index].ratio = row.ratio ?? null;
            }

          }
        },
        onChangeSelect(row, field, value) {
          if (field == 'cycle') {
            // bỏ khúc này tác động grid bị refesh
            // const grid = this.$refs.gridDsManagementKPI.grid.ej2Instances;
            // grid.setCellValue(data.kpi_library_id, 'cycle', value);
            // data.cycle = value;
            row.cycle = value;
            const index = this.selectedKpis.findIndex(x => x.kpi_library_id === row.kpi_library_id);
            if (index === -1) {
              this.selectedKpis.push({
                kpi_library_id: row.kpi_library_id,
                ratio: row.ratio ?? null,
                cycle: row.cycle ?? null
              });
            } else {
              this.selectedKpis[index].cycle = row.cycle ?? null;
            }
          }
        },
        GetColumnTemplateInput(parent, field, type) {
          return function () {
            // Tạo tên component duy nhất tránh đè
            var GetColumnTemplateInput=app.component("GetColumnTemplateInput", {
              template: `
                <div v-if="inputType == 'text'">
                  <input type="text"
                    class="form-control text-end"
                    :value="data[field]"
                    @keypress="isNumber($event)"
                    @change="onChangeText" />
                </div>

                <div v-else-if="inputType == 'select'">
                  <select2 :z-index="2000"
                    class="select2"
                    v-model="selectValue"
                    :options="selectItems"
                    @select="onChangeSelect" />
                </div>
              `,
              data() {
                return {
                  parent: parent,
                  data: {},
                  field: field,
                  inputType: type,
                };
              },
              computed: {
                selectValue:{
                  get() {
                    return this.data[this.field] ?? 0;
                  },
                  set(value) {
                    this.data[this.field] = value;
                  }
                },
                selectItems() {
                  // có thể custom theo field hoặc dùng chung
                  if (this.field == 'cycle') {
                    return [
                      { id: 0, text: 'Chọn' },
                      { id: 1, text: 'Ngày' },
                      { id: 2, text: 'Tuần' },
                      { id: 3, text: 'Tháng' },
                    ];
                  }
                  return [];
                },
              },
              methods: {
                // xử lý thay đổi input text
                onChangeText(e) {
                  const value = e.target.value;
                  // có thể báo ngược ra parent nếu cần
                  this.parent.onFieldChanged(this.data, this.field, value);
                },
                // xử lý chọn select2
                onChangeSelect(e) {
                  this.parent.onChangeSelect(this.data, this.field, e.id)
                },
                isNumber(evt) {
                  evt = evt || window.event;
                  const charCode = evt.which || evt.keyCode;

                  // Cho phép: phím số (0–9), dấu chấm (.), phím điều hướng
                  if (
                    charCode > 31 &&
                    (charCode < 48 || charCode > 57) && // không phải 0–9
                    charCode !== 46                     // không phải dấu .
                  ) {
                    evt.preventDefault();
                  }

                  // Không cho nhập quá 1 dấu chấm
                  const input = evt.target.value;
                  if (charCode === 46 && input.includes('.')) {
                    evt.preventDefault();
                  }
                }
              },
            });

            // Trả về tên component để Grid render
            return { template: GetColumnTemplateInput };
          };
        },
        onChangeFromMonth(event) {
          if (event && event.value) {
            const newFrom = moment(event.value).format('MM/YYYY')
            const fromNum = Number(moment(newFrom, 'MM/YYYY').format('YYYYMM'))
            const toNum = Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))

            this.from_month = newFrom

            // Nếu from > to → tự động set to = from
            if (fromNum > toNum) {
              this.to_month = newFrom
        }
          }
          this.initGrid()
        },
        onChangeToMonth(event) {
          if (event && event.value) {
            const newTo = moment(event.value).format('MM/YYYY')
            const toNum = Number(moment(newTo, 'MM/YYYY').format('YYYYMM'))
            const fromNum = Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))

            this.to_month = newTo

            // Nếu to < from → tự động set from = to
            if (toNum < fromNum) {
              this.from_month = newTo
            }
          }
          this.initGrid()
        },
        async addManagementKpi(){
          let dsSlected=this.$refs.gridDsManagementKPI.getSelectedRecords();
          if(dsSlected.length==0){
            this.$toast.error('Vui lòng chọn dữ liệu cần thêm mới!')
            return
          }
          let period_from=Number(moment(this.from_month, 'MM/YYYY').format('YYYYMM'))
          let period_to=Number(moment(this.to_month, 'MM/YYYY').format('YYYYMM'))
          // Ghép giá trị cycle/ratio từ selectedKpis vào record được chọn
          dsSlected = dsSlected.map(item => {
            const found = this.selectedKpis.find(x => x.kpi_library_id === item.kpi_library_id);
            return found ? { ...item, ...found } : item;
          });
          console.log('dsSlected',dsSlected )
          var dsData = dsSlected.map(x=> {
            return {
              kpi_library_id:x.kpi_library_id,
              code:x.code,
              cycle:x.cycle,
              ratio:x.ratio,
              period_from:period_from,
              period_to:period_to,
              //
              kpi_type:this.kpi_type,
              work_position_id:this.kpi_type==1?this.kpi_personal_selected:0,
              department_id:this.kpi_type==2?this.kpi_department_selected:0
            }
          });
          // Kiểm tra dữ liệu hợp lệ
          let invalids = [];

          dsData.forEach(x => {
            if (!x.cycle || x.cycle == 0) {
              invalids.push(`KPI [${x.code}] chưa chọn chu kỳ`);
            }
            if (!x.ratio || Number(x.ratio) <= 0) {
              invalids.push(`KPI [${x.code}] chưa nhập tỷ lệ hoặc phải lớn hơn 0`);
            }
          });

          if (invalids.length > 0) {
            this.$toast.error(invalids.join('\n'));
            return;
          }
          //
          let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn thêm dữ liệu đang chọn?`)
          if(messConfirm==0) {
            return
          }
          let result=await API.AddManagementKpi(this, dsData)
          if(result=='1'){
              this.$toast.success('Thêm mới thành công!')
              this.$emit('successAddUpdate',{
                value:this.kpi_type==1?this.kpi_personal_selected:this.kpi_department_selected,
                from_month:this.from_month,
                to_month:this.to_month
              })
              this.hideModal()
          }else{
              this.$toast.error(result)
          }

        },
        async updateManagementKpi(){
          
          let dsSlected=this.$refs.gridDsManagementKPI.getCurrentViewRecords();
          if(dsSlected.length==0){
            this.$toast.error('Không có dữ liệu điều chỉnh!')
            return
          }
          // Ghép giá trị cycle/ratio từ selectedKpis vào record được chọn
          dsSlected = dsSlected.map(item => {
            const found = this.selectedKpis.find(x => x.kpi_library_id === item.kpi_library_id);
            return found ? { ...item, ...found } : item;
          });
          
          var dsData = dsSlected.map(x=> {
            return {
              management_kpi_id:x.management_kpi_id,
              kpi_library_id:x.kpi_library_id,
              code:x.code,
              cycle:x.cycle,
              ratio:x.ratio,
              //
              kpi_type:this.kpi_type,
              work_position_id:this.kpi_type==1?this.kpi_personal_selected:0,
              department_id:this.kpi_type==2?this.kpi_department_selected:0
            }
          });

          // Kiểm tra dữ liệu hợp lệ
          let invalids = [];

          dsData.forEach(x => {
            if (!x.cycle || x.cycle == 0) {
              invalids.push(`KPI [${x.code}] chưa chọn chu kỳ`);
            }
            if (!x.ratio || Number(x.ratio) <= 0) {
              invalids.push(`KPI [${x.code}] chưa nhập tỷ lệ hoặc phải lớn hơn 0`);
            }
          });

          if (invalids.length > 0) {
            this.$toast.error(invalids.join('\n'));
            return;
          }
          //
          let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh dữ liệu?`)
          if(messConfirm==0) {
            return
          }
          let result=await API.UpdateManagementKpi(this, dsData)
          if(result=='1'){
              this.$toast.success('Cập nhật dữ liệu thành công!')
              this.$emit('successAddUpdate',{
                value:this.kpi_type==1?this.kpi_personal_selected:this.kpi_department_selected,
                from_month:this.from_month,
                to_month:this.to_month
              })
              this.hideModal()
          }else{
              this.$toast.error(result)
          }
        },
        async onSave(){
          if(this.isAdd){
           this.addManagementKpi()
          }else{
            this.updateManagementKpi()
          }
        }
    },
    mounted() {
        
    }
}
</script>
<style>
#add-update-management-kpi .e-dlg-content {
  overflow: visible !important;
}
</style>