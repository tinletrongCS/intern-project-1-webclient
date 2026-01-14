<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupUpdateAssignmentKPIResult"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        id="update-assignment-kpi-result"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                  <KDataGrid
                    ref="gridDsAssignmentKPIResult"
                    :columns="columns"
                    :dataSource="dataSources"
                    :enable-paging-server="false"
                    :allowPaging="false"
                    :showFilter="false"
                    :allowSorting="false"
                    :showColumnCheckbox="false"
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
const app = createApp()
export default {
    name:'UpdateAssignmentKPIResultModal',
    props:{
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
      arrIds:{
        type:Object,
        default:()=>[]
      },
      period:{
        type:Number,
        default:202511
      }

    },
    components:{

    },
    data(){
        return {
          target: '.main-wrapper',
          animationSettings: { effect: 'Zoom' },
          columns:[],
          dataSources:[],
          selectedKpis:[]
        }
    },
    computed:{
      labelTypeSelect(){
        return this.kpi_type==1?'Vị trí công việc':'Phòng ban'
      },
      header() {
        return `<span class="icon one-notepad"></span>Cập nhật kết quả chỉ số KPI theo ${this.labelTypeSelect.toLowerCase()}`;
      }
    },
    methods:{
        showModal() {
            this.$refs["popupUpdateAssignmentKPIResult"].show()
        },
        hideModal() {
            this.$refs["popupUpdateAssignmentKPIResult"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initPopup()
            },200)
        },
        async initGrid(){
          let dataRequest={
            kpi_type:this.kpi_type,
            department_id:this.kpi_department_id!=null?this.kpi_department_id:0,
            work_position_id:this.kpi_personal_id!=null?this.kpi_personal_id:0,
            period:this.period,
            arr_assignment_kpi_id:JSON.stringify(this.arrIds)
          }
          this.dataSources=[]
          this.columns=[]
          var data=await API.GetAssignmentKpiResultListUpdate(this,dataRequest)
          if(data){
            data=JSON.parse(data)
            this.$nextTick(()=>{
              this.columns = data.columns.map(col => {
                // Nếu không phải code/name mới thêm template
                if (col.fieldName != 'kpi_library_id'&&col.fieldName != 'code' && col.fieldName != 'name') {
                  return {
                    ...col,
                    template: this.GetColumnTemplateInput(this, col.fieldName, 'text')
                  }
                }
                return col; // giữ nguyên 2 cột đầu
              })
              this.dataSources=data.data
            })
          }

        },
        async initPopup(){
          this.initGrid()
        },
        clear(){
          this.columns=[]
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
          // cập nhật giá trị trong row
          row[field] = value;
          // tìm index trong selectedKpis dựa trên kpi_library_id
          const index = this.selectedKpis.findIndex(x => x.kpi_library_id === row.kpi_library_id);
          // nếu chưa có, thêm mới
          if (index == -1) {
            this.selectedKpis.push({
              kpi_library_id: row.kpi_library_id,
              [field]: value ?? null
            });
          } else {
            // đã có → update giá trị
            this.selectedKpis[index][field] = value ?? null;
          }
        },
        onChangeSelect(row, field, value) {
          // cập nhật giá trị trong row
          row[field] = value
          // tìm index trong selectedKpis dựa trên kpi_library_id
          const index = this.selectedKpis.findIndex(x => x.kpi_library_id == row.kpi_library_id)
          // nếu chưa có, thêm mới
          if (index == -1) {
            this.selectedKpis.push({
              kpi_library_id: row.kpi_library_id,
              [field]: value ?? null
            })
          } else {
            // đã có → update giá trị
            this.selectedKpis[index][field] = value ?? null
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
                    @change="onChangeText" 
                    @copy.prevent
                    @paste.prevent
                    @cut.prevent/>
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
        async updateAssignmentKpi(){
          
          let dsSlected=this.$refs.gridDsAssignmentKPIResult.getCurrentViewRecords();
          if(dsSlected.length==0){
            this.$toast.error('Khôn có dữ liệu điều chỉnh!')
            return
          }
          // Ghép giá trị cycle/ratio từ selectedKpis vào record được chọn
          dsSlected = dsSlected.map(item => {
            const found = this.selectedKpis.find(x => x.kpi_library_id == item.kpi_library_id);
            return found ? { ...item, ...found } : item;
          });
          const dsData = dsSlected.map(x => {
            if (this.kpi_type == 2) {
              // KPI phòng ban → departments
              const departments = Object.keys(x)
                .filter(k => k.startsWith('department_'))
                .map(depKey => ({
                  department_id: parseInt(depKey.split('_')[1], 10),
                  actual_value: x[depKey]?Number(x[depKey]):null
                }));
              return {
                assignment_kpi_id:x.assignment_kpi_id,
                kpi_library_id: x.kpi_library_id,
                code: x.code,
                kpi_type: this.kpi_type,
                period:this.period,
                work_position_id:null,
                departments,
                users: []
              };
            } else if (this.kpi_type == 1) {
              // KPI cá nhân → users
              const users = Object.keys(x)
                .filter(k => k.startsWith('user_'))
                .map(userKey => ({
                  user_id: parseInt(userKey.split('_')[1], 10),
                  actual_value: x[userKey]?Number(x[userKey]):null,
                  department_id:this.kpi_department_id
                }));
              return {
                assignment_kpi_id:x.assignment_kpi_id,
                kpi_library_id: x.kpi_library_id,
                code: x.code,
                kpi_type: this.kpi_type,
                period:this.period,
                work_position_id:this.kpi_personal_id,
                departments: [],
                users
              };
            }
          });
          
          let messConfirm = await this.$confirm('Thông báo', `Bạn chắc chắn muốn điều chỉnh dữ liệu?`)
          if(messConfirm==0) {
            return
          }
          let result=await API.UpdateAssignmentKpiResult(this, dsData)
          if(result=='1'){
              this.$toast.success('Cập nhật dữ liệu thành công!')
              this.$emit('successAddUpdate')
              this.hideModal()
          }else{
              this.$toast.error(result)
          }
        },
        async onSave(){
          this.updateAssignmentKpi()
        }
    },
    mounted() {
        
    }
}
</script>
<style>
#update-assignment-kpi-result .e-dlg-content {
  overflow: visible !important;
}
</style>