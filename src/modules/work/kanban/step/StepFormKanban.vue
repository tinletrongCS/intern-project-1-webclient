<template>
  <div class="stepformkanban">
      <div class="column-header">
        <div class="title-wrap">
          <div class="title">{{ step.step_name ?? "" }}</div>
          <div class="count">{{numberTask}}</div>
        </div>

        <div v-if="(ownerBoardFlg||subOwnerBoardFlg)&&!boardClosed" class="menu-wrapper" ref="menuRef">
          <span class="task-menu" @click="toggleMenu">⋯</span>
          <Teleport to="body">
            <div class="dropdown-step" v-if="showMenu"
                :style="dropdownStyle">
              <div class="dropdown-item-step" @click="clickEdit">Chỉnh sửa</div>
              <div class="dropdown-item-step" @click="clickDelete">Xóa</div>
              <div class="dropdown-item-step" @click="clickDownloadImportTemplate">File mẫu Import</div>
              <div class="dropdown-item-step" @click="clickImportExcel">Import Excel</div>
            </div>
          </Teleport>
          
          <input ref="fileInput" :id="'file'+step.step_id" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
        </div>
      </div>

      <button v-if="!step.only_view&&!boardClosed" @click="onClickAddNewTask" class="add-task">+ (Tạo mới công việc)</button>

      <TaskCardKanban v-for="(task, index) in listTask" 
          :key="`${step.step_id}-${task.task_id}-${index}`"
          :task="task"
          :only_view="step.only_view"
          :boardClosed="boardClosed"
          draggable="true"
          @onClickTaskAction="onClickTaskAction"
          @onCheckTask="onCheckTask"
          @onDoingTask="onDoingTask"
          @showDetailTask="showDetailTask"
          @dragstart="dragStart($event,task)"/>

      <button class="add-task" 
        v-if="hasMoreTasks"
        @click="loadMore" >
        Xem thêm
      </button>

    <CheckImportDataResourceModal ref="CheckImportDataResourceModal"
      :dataCheckImports="dataCheckImports"
      @successImportData="successImportData"/>
  </div>
</template>
<script>
import moment from 'moment';
import * as XLSX from 'xlsx-js-style';
// import TaskCardKanban from './TaskCardKanban.vue'
import TaskCardKanban from '../kanban_task/TaskCardKanban.vue'
import CheckImportDataResourceModal from '../../effective_resource_management/CheckImportDataResourceModal.vue'
import API from './API'

export default {
  name:'StepFormKanban',
  props:{
    step:{
      type:Object,
      default: () => ({}) 
    },
    ownerBoardFlg:{
      type:Boolean,
      default:false
    },
    subOwnerBoardFlg:{
      type:Boolean,
      default:false
    },
    boardClosed:{
      type:Boolean,
      default:false
    }
  },
  components:{
    TaskCardKanban,
    CheckImportDataResourceModal
  },
  computed:{
    numberTask(){
      return this.step.tasks?this.step.tasks.length:0
    },
    listTask(){
      return this.step.tasks
        ? this.step.tasks.slice(0, this.pageSize)
        : [];
    },
    hasMoreTasks() {
      return this.step.tasks && this.step.tasks.length > this.pageSize;
    }
  },
  data(){
    return {
      showMenu:false,
      pageSize:30,
      dropdownStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px'
      },
      isNearRightEdge: false,
      file:null,
      dataCheckImports:[]
    }
  },
  methods:{
    toggleMenu(){
      this.showMenu=!this.showMenu;
      this.$nextTick(() => {
        if (this.showMenu) {
          const rect = this.$refs.menuRef.getBoundingClientRect();
          const dropdownWidth = 100;
          const spaceRight = window.innerWidth - rect.left;
          this.isNearRightEdge = spaceRight < dropdownWidth;

          this.dropdownStyle = {
            position: 'absolute',
            top: rect.bottom + 'px',
            left: this.isNearRightEdge 
                  ? rect.right - dropdownWidth + 'px' 
                  : rect.left + 'px',
            zIndex: 9999,
            maxWidth: 'max-content'
          };
        }
      });
    },
    handleClickOutside(event) {
        const dropdown = this.$refs.menuRef;
        if (dropdown && !dropdown.contains(event.target)) {
            this.showMenu = false;
        }
    },
    clickEdit(){
      this.showMenu=false
      this.$emit('clickEditStep',{
        step_id:this.step.step_id,
        step_name:this.step.step_name,
        position:this.step.position
      })
    },
    clickDelete(){
      this.showMenu=false
      this.$emit('clickDeleteStep',{
        step_id:this.step.step_id,
        step_name:this.step.step_name,
        position:this.step.position
      })
    },
    clickDownloadImportTemplate(){
      window.open("/static/files/MauFile_Import_Kanban_Task.xlsx")
    },
    clickImportExcel(){
      this.file=null
      this.dataCheckImports=[]
      this.$refs.fileInput.value=null
      document.getElementById("file"+this.step.step_id).click()
    },
    onChangeFile(event){
      this.file=event.target.files[0]
      this.readFileExcel()
    },
    readFileExcel() {
      var danhsach_excel = []
      let columns
      try {
        this.loading(true)
        if (!this.checkfile()) return

        const reader = new FileReader()
        reader.onload = (e) => {
          const wb = XLSX.read(e.target.result, { type: "binary" })
          const ws = wb.Sheets[wb.SheetNames[0]]
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

          columns = data[0]
          if (!this.kiemTraDuLieu(columns)) return

          let isError = false

          var boardtype_id = this.step.boardtype_id;
          var project_id = this.step.project_id;
          var board_id = this.step.board_id;
          var step_id = this.step.step_id;
          for (let i = 1; i < data.length; i++) {
            const row = data[i]

            // ==== Mapping theo file mẫu ====
            const work_code            = row[0]?.toString().trim() || null
            const work_name            = row[1]?.toString().trim() || null
            const parent_work_code     = row[2]?.toString().trim() || null
            const project_code         = row[3]?.toString().trim() || null
            const description          = row[4]?.toString().trim() || null

            const completion_rate      = row[5]?.toString().trim() || null
            const plan_duration_time   = row[6]?.toString().trim() || null
            const schedule_start_display  = row[7]?.toString().trim() || null
            const schedule_end_display    = row[8]?.toString().trim() || null

            const actual_duration_time = row[9]?.toString().trim() || null
            const actual_start_display         = row[10]?.toString().trim() || null
            const actual_end_display           = row[11]?.toString().trim() || null

            const progress_note        = row[12]?.toString().trim() || null

            const role_r_name          = row[13]?.toString().trim() || null
            const role_a_name          = row[14]?.toString().trim() || null
            const role_c_name          = row[15]?.toString().trim() || null
            const role_i_name          = row[16]?.toString().trim() || null

            const jira_url             = row[17]?.toString().trim() || null

            const schedule_start = schedule_start_display
                ? moment(schedule_start_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null
            const schedule_end = schedule_end_display
                ? moment(schedule_end_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null
            const actual_start = actual_start_display
                ? moment(actual_start_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null
            const actual_end = actual_end_display
                ? moment(actual_end_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null

            // ==== Validate dữ liệu tối thiểu ====
            if (!work_name) {
              this.$toast.error(`Dòng ${i + 1}: thiếu Nội dung công việc`); isError = true; break
            }
            if (boardtype_id == 1 && !project_id && !project_code) {
              this.$toast.error(`Dòng ${i + 1}: thiếu Mã dự án`); isError = true; break
            }
            if (!description) {
              this.$toast.error(`Dòng ${i + 1}: thiếu Mô tả giao phẩm`); isError = true; break
            }
            if (!plan_duration_time || isNaN(plan_duration_time)) {
              this.$toast.error(`Dòng ${i + 1}: Thời lượng dự kiến phải là số`); isError = true; break
            }
            if (schedule_start_display && !moment(schedule_start_display, 'DD/MM/YYYY', true).isValid()) {
              this.$toast.error(`Dòng ${i + 1}: Ngày bắt đầu dự kiến không đúng định dạng DD/MM/YYYY`); isError = true; break
            }
            if (schedule_end_display && !moment(schedule_end_display, 'DD/MM/YYYY', true).isValid()) {
              this.$toast.error(`Dòng ${i + 1}: Ngày kết thúc dự kiến không đúng định dạng DD/MM/YYYY`); isError = true; break
            }
            if (!progress_note || isNaN(progress_note) || Number(progress_note) <= 0) {
              this.$toast.error(`Dòng ${i + 1}: Số giờ yêu cầu phải > 0`); isError = true; break
            }
            // if (actual_start && !moment(actual_start, 'DD/MM/YYYY', true).isValid()) {
            //   this.$toast.error(`Dòng ${i + 1}: Ngày bắt đầu thực tế không đúng định dạng DD/MM/YYYY`); isError = true; break
            // }
            // if (actual_end && !moment(actual_end, 'DD/MM/YYYY', true).isValid()) {
            //   this.$toast.error(`Dòng ${i + 1}: Ngày kết thúc thực tế không đúng định dạng DD/MM/YYYY`); isError = true; break
            // }

            // ==== Push object JSON chuẩn ====
            danhsach_excel.push({
              work_code,
              parent_work_code,
              work_name,

              boardtype_id,
              board_id,
              step_id,
              project_id,
              project_code,
              
              description,

              completion_rate: completion_rate ? parseFloat(completion_rate) : 0,
              plan_duration_time: parseFloat(plan_duration_time),
              actual_duration_time: actual_duration_time ? parseFloat(actual_duration_time) : null,

              schedule_start_display: schedule_start_display,
              schedule_end_display: schedule_end_display,
              actual_start_display: actual_start_display,
              actual_end_display: actual_end_display,

              schedule_start: schedule_start,
              schedule_end: schedule_end,
              actual_start: actual_start,
              actual_end: actual_end,

              progress_note: progress_note ? parseFloat(progress_note) : null,

              role_r_name,
              role_a_name,
              role_c_name,
              role_i_name,

              jira_url
            })
          }

          if (danhsach_excel.length > 0 && !isError) {
            this.docfile_import_excel(danhsach_excel)
          }
        }
        reader.readAsBinaryString(this.file)
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi đọc file')
      } finally {
        this.loading(false)
      }
    },
    checkfile: function () {
      if (this.file == null) {
        this.$toast.error('Chưa chọn file excel')
        return false
      }
      if (this.file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        this.$toast.error('File upload không đúng định dạng')
        return false
      }
      return true
    },
    kiemTraDuLieu: function (columns) {
      if (!columns) {
        this.$toast.error('File có cấu trúc không hợp lệ!')
        return false
      }

      const requiredHeaders = [
        'Mã công việc',
        'Nội dung công việc',
        'Phụ thuộc',
        'Mã dự án',
        'Giao phẩm',
        'Hoàn thành (%)',
        'Thời lượng dự kiến',
        'Ngày bắt đầu dự kiến',
        'Ngày kết thúc dự kiến',
        'Thời lượng thực tế',
        'Ngày bắt đầu thực tế',
        'Ngày kết thúc thực tế',
        'Số giờ yêu cầu (đơn vị giờ)',
        'Vai trò R',
        'Vai trò A',
        'Vai trò C',
        'Vai trò I',
        'Link liên quan'
      ]

      if (columns.length !== requiredHeaders.length) {
        this.$toast.error(`File không có đủ ${requiredHeaders.length} cột yêu cầu!`)
        return false
      }

      return true
    },
    async docfile_import_excel(data){
      let result=await API.CheckImportData(this, data)
      if(Array.isArray(result)){
        this.dataCheckImports=result
        this.$refs.CheckImportDataResourceModal.showModal()
      }else{
        this.$msgBox.error("Thông báo",result)
      }
    },
    successImportData(){
      this.$emit('successImportData');
    },
    handleMoreStepClickOutside(event) {
      const dropdown = this.$refs.menuRef;
      if (dropdown && !dropdown.contains(event.target)) {
          this.showMenu = false;
      }
    },
    loadMore() {
      this.pageSize += 30;
    },
    dragStart(e,task){
      this.$emit('onDragStart',e,task);
    },
    onClickTaskAction(value){
      this.$emit("onClickTaskAction", value)
    },
    onCheckTask(task){
      this.$emit('onCheckTask',task)
    },
    onDoingTask(task){
      this.$emit('onDoingTask',task)
    },
    onClickAddNewTask(){
      this.$emit("onClickAddNewTask",this.step.step_id)
    },
    showDetailTask(task){
      this.$emit('showDetailTask',task)
    }
  },
  watch:{
    'step.tasks':function(newVal, oldVal) {
      this.pageSize=30
    }
  },
  mounted(){
      document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount(){
      document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>
<style scoped>
.stepformkanban {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 10px;
  width: 270px;
  min-width: 270px;
  display: flex;
  flex-direction: column;
  border: 1px dotted rgba(0, 123, 255, 0.5);
  /*Đảo lên đưa scroll bar lên đầu*/
  transform: scaleY(-1);
}

.stepformkanban .column-header {
  position: relative;
  display: flex;
  justify-content: center;  /* Căn giữa phần title-wrap */
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
  padding-right: 30px; /* chừa khoảng trống bên phải cho menu */
}

.stepformkanban .column-header .title-wrap {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  gap: 4px;
}

.stepformkanban .column-header .count {
  background: #007bff;
  color: #fff;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 14px;
}

.stepformkanban .column-header .title{
  align-items: center !important;
}

.stepformkanban .column-header .menu-wrapper {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.stepformkanban .column-header .task-menu {
  cursor: pointer;
  font-size: 18px;
  color: #888;
  padding: 4px;
  transition: color 0.2s ease;
}

/* .stepformkanban .column-header .task-menu:hover {
  background-color: white;
  border-radius: 4px;
} */

.stepformkanban .add-task {
  background: white;
  border: 1px solid #007bff;
  color: #007bff;
  border-radius: 4px;
  padding: 6px;
  margin-bottom: 10px;
  cursor: pointer;
}
.stepformkanban .add-task:hover {
  background: #007bff;
  color: white;
}
.dropdown-step {
  /* position: absolute; */
  right: 0;
  top: 120%;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  border-radius: 6px;
  z-index: 100;
  min-width: 100px;
}

.dropdown-item-step {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item-step:hover {
  background-color: #f2f2f2;
}
.stepformkanban .menu-wrapper {
  position: relative; /* Quan trọng để dropdown căn theo đây */
}

</style>