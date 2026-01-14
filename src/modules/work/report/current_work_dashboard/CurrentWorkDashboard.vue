<template>
  <div class="k current-work-dashboard main-wrapper main-form">
    <breadcrumb :header="header" />
    <div class="k boarder-all-tab">
      <div style="padding: 8px 5px !important;padding: 16px 10px 16px 10px !important;">
        <div class="row search-box">
            <div class="col-sm-3 col-12">
                <div class="info-row">
                    <div class="key w120">Tìm kiếm</div>
                    <div class="input-row">
                        <div class="value">
                            <input type="text" @keyup.enter="onSearch" placeholder="Tìm kiếm theo mã, nội dung công việc" :value="input_timkiem" @change="e=>input_timkiem=e.target.value" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="key w120">Người giao nhận</div>
                    <div class="value wp100">
                        <select2 
                            v-model='nguoi_giao_nhan_selected'
                            :options="ds_user.map(e=>({id:e.user_id, text:e.display_name}))"
                            @select="onSearch"
                        />
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="key w120 bold">Từ ngày</div>
                    <div class="value wp100">
                        <div class="input-icon-right">
                            <ejs-datepicker
                                v-model="ngay_batdau"
                                format='dd/MM/yyyy'
                                :showClearButton='false'
                                :allowEdit="true"
                                :strict-mode="true"
                                locale="vi"
                                @change="changeNgayBD"
                                :firstDayOfWeek="1"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="key w120 bold">Đến ngày</div>
                    <div class="value wp100">
                        <div class="input-icon-right">
                            <ejs-datepicker
                                v-model="ngay_ketthuc"
                                format='dd/MM/yyyy'
                                :showClearButton='false'
                                locale="vi"
                                :allowEdit="true"
                                :strict-mode="true"
                                @change="changeNgayKT"
                                :firstDayOfWeek="1"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
              <div class="form-search-task" >
                <button @click="onSearch" class="btn btn-second">
                  <span class="-ap icon-search"></span> Tìm kiếm
                </button>
              </div>
            </div>
            
            
        </div>
      </div>

      <div class="k column-task-wrapper-row">
        <!-- Nhóm 1: Việc tôi giao -->
        <div class="k column-group">
          <div  class="k border-head-center-tab">
            <div class="k group-header">VIỆC TÔI GIAO</div>
          </div>
          
          <div class="k column-task-scroll">
            <div class="k column-task">
              <ColumnWorkForm
                v-for="(item, index) in dsWorkCreator"
                :key="'assign-' + index"
                :data="item"
                @onClickTaskAction="onClickTaskAction"
                @onCheckTask="onCheckTask"
                @onDoingTask="onDoingTask"
                @showDetailTask="showDetailTask"
              />
            </div>
          </div>
        </div>

        <!-- Nhóm 2: Việc tôi được giao -->
        <div class="k column-group">
          <div  class="k border-head-center-tab">
            <div class="k group-header">VIỆC TÔI ĐƯỢC GIAO</div>
          </div>
          <div class="k column-task-scroll">
            <div class="k column-task">
              <ColumnWorkForm
                v-for="(item, index) in dsWorkAssign"
                :key="'creator-' + index"
                :data="item"
                @onClickTaskAction="onClickTaskAction"
                @onCheckTask="onCheckTask"
                @onDoingTask="onDoingTask"
                @showDetailTask="showDetailTask"
              />
            </div>
          </div>
        </div>
      </div>



    </div>
    <!-- Modal -->
    <RatingTaskModal ref="ratingTaskModal"
        :task="taskRating"
        :boardId="boardId"
        @onRatingTaskSuccess="onRatingTaskSuccess"
    />
    <TaskKanbanModal ref="taskKanbanModal"
        :boardId="boardId"
        :stepId="stepId"
        :taskId="taskID"
        :updateFlg="updateFlg"
        :cloneChildFlg="cloneChildFlg"
        :duplicateChildFlg="duplicateChildFlg"
        :viewFlg="viewFlg"
        :enabled="true"
        @onSuccessSaveTask="onSuccessSaveTask"
    />
    <ComplaintTaskModal ref="complaintTaskModal"
          :boardId="boardId"
          :taskId="taskID"
          @complaintSuccess="complaintSuccess"
      />
  </div>
</template>
<script>
import ColumnWorkForm from './column_form/ColumnWorkForm.vue'
import API from './API'
import RatingTaskModal from '../../kanban/rating/RatingTaskModal.vue'
import TaskKanbanModal from '../../kanban/task/TaskKanbanModal.vue'
import moment from 'moment'
import ComplaintTaskModal from '../../kanban/task/ComplaintTaskModal.vue'
export default {
  name:'CurrentWorkDashboard',
  components:{
    ColumnWorkForm,
    RatingTaskModal,
    TaskKanbanModal,
    ComplaintTaskModal
  },
  data(){
    return {
      header: {
        title: "Báo cáo công việc cá nhân tại thời điểm hiện tại",
        list: [
        ],
      },
      input_timkiem:'',
      nguoi_giao_nhan_selected:0,
      ds_user:[
        {
          user_id: 0,
          username: "",
          full_name: "",
          display_name: "Tất cả"
        }
      ],
      dsWorkCreator:[
        {
          id:1,
          title:"Đã giao, chưa bắt đầu",
          tasks:[]
        },
        {
          id:2,
          title:"Đã giao, đã bắt đầu",
          tasks:[]
        },
        {
          id:3,
          title:"Đã giao, đã kết thúc",
          tasks:[]
        }
      ],
      dsWorkAssign:[
        {
          id:1,
          title:"Đang thực hiện",
          tasks:[]
        },
        {
          id:2,
          title:"Đã nhận",
          tasks:[]
        },
        {
          id:3,
          title:"Đã hoàn thành",
          tasks:[]
        }
      ],
      taskRating:null,
      boardId:0,
      stepId:null,
      taskID:0,
      updateFlg: false,
      cloneChildFlg: false,
      duplicateChildFlg: false,
      viewFlg:false,
      ngay_batdau: moment().subtract(6, 'months').startOf('month').format('DD/MM/YYYY'),
      ngay_ketthuc:moment().format('DD/MM/YYYY')
    }
  },
  methods:{
    onSearch(){
      this.loadDataReport()
    },
    async intPage(){
      //
      let result=await API.GetUsersByUserUnit(this)
      if(result){
        this.ds_user=this.ds_user.concat(JSON.parse(result))
      }
      var userId=this.$_root.token.getUserId()
      if(userId&&this.ds_user.findIndex(x=>x.user_id==userId)>-1){
        this.nguoi_giao_nhan_selected=userId
      }
      //
      this.loadDataReport()
    },
    changeNgayBD(event){
      this.ngay_batdau=moment(event.value).format('DD/MM/YYYY')
      this.loadDataReport()
    },
    changeNgayKT(event){
      this.ngay_ketthuc=moment(event.value).format('DD/MM/YYYY')
      this.loadDataReport()
    },
    async loadDataReport(){
      var arrUserIds=[]
      if(this.nguoi_giao_nhan_selected==0){
        arrUserIds=this.ds_user.filter(x=>x.user_id!=0).map(x=>x.user_id)
      }else{
        arrUserIds=[this.nguoi_giao_nhan_selected]
      }
     
      var rsDashboard=await API.GetReportTaskByUserCurrentFunc(this, this.input_timkiem.trim(), JSON.stringify(arrUserIds), this.ngay_batdau, this.ngay_ketthuc)
      if(rsDashboard){
        rsDashboard=JSON.parse(rsDashboard)
        this.dsWorkCreator[0].tasks=rsDashboard.doing_create_by_task_not_start
        this.dsWorkCreator[1].tasks=rsDashboard.doing_create_by_task_start
        this.dsWorkCreator[2].tasks=rsDashboard.done_create_by_task
        this.dsWorkAssign[0].tasks=rsDashboard.doing_assignee_task
        this.dsWorkAssign[1].tasks=rsDashboard.doing_assignee_task_start
        this.dsWorkAssign[2].tasks=rsDashboard.done_assignee_task
      }else{
        this.dsWorkCreator[0].tasks=[]
        this.dsWorkCreator[1].tasks=[]
        this.dsWorkCreator[2].tasks=[]
        this.dsWorkAssign[0].tasks=[]
        this.dsWorkAssign[1].tasks=[]
        this.dsWorkAssign[2].tasks=[]
      }
    },
    onClickTaskAction(value){
        var task=value.task
        var action=value.action

        if(action.id=="Edit"){
          this.showFormUpdateTask(task)
        }else if(action.id=="Delete"){
          this.onDeleteTask(task)
        }else if(action.id=='CloneChild'){
          this.showFormCloneChild(task)
        }else if(action.id=='DuplicateTask'){
          this.showFormDuplicateTask(task)
        }else if(action.id=='ReviewTask'){
          this.showRatingForm(task)
        }else if(action.id=='complaintStart'){
          this.showComplaintModal(task)
           
        }else if(action.id=='complaintEnd'){
          this.closeComplaint(task)
        }
    },
    async showComplaintModal(task){
      this.taskID=task.task_id
      this.boardId=await API.GetBoardByTaskId(this, this.taskID)
      this.$refs.complaintTaskModal.showModal()
    },
    async closeComplaint(task){
      let rs = await this.$confirm('Thông báo', `Bạn có chắc muốn kết thúc khiếu nại không?`)
      if(rs==0) return
      let dataRequest={
          task_id:task.task_id
      }
      let result=await API.ComplaintDone(this, dataRequest);
      if(result=='1'){
          this.$toast.success("Đóng khiếu nại thành công");
          this.loadDataReport()
      }else{
          this.$toast.error(result)
      }
    },
    complaintSuccess(){
      this.loadDataReport()
    },
    async showDetailTask(task){
        this.stepId=task.step_id
        this.taskID=task.task_id
        this.boardId=await API.GetBoardByTaskId(this, this.taskID)
        this.updateFlg=false
        this.cloneChildFlg=false
        this.duplicateChildFlg=false
        this.viewFlg=true
        this.$refs.taskKanbanModal.showModal()
    },
    async showFormUpdateTask(task){
        this.stepId=task.step_id
        this.taskID=task.task_id
        this.boardId=await API.GetBoardByTaskId(this, this.taskID)
        this.updateFlg=true
        this.cloneChildFlg=false
        this.duplicateChildFlg=false
        this.viewFlg=false
        this.$refs.taskKanbanModal.showModal()
    },
    async showFormCloneChild(task){
        this.stepId=task.step_id
        this.taskID=task.task_id
        this.boardId=await API.GetBoardByTaskId(this, this.taskID)
        this.updateFlg=false
        this.cloneChildFlg=true
        this.duplicateChildFlg=false
        this.viewFlg=false
        this.$refs.taskKanbanModal.showModal()
    },
    async showFormDuplicateTask(task){
        this.stepId=task.step_id
        this.taskID=task.task_id
        this.boardId=await API.GetBoardByTaskId(this, this.taskID)

        this.updateFlg=false
        this.cloneChildFlg=false
        this.duplicateChildFlg=true
        this.viewFlg=false
        this.$refs.taskKanbanModal.showModal()
    },
    onSuccessSaveTask(){
      this.loadDataReport()
    },
    showRatingForm(task){
        this.taskRating=task
        this.$refs.ratingTaskModal.showModal()
    },
    onRatingTaskSuccess(){
        this.$refs.ratingTaskModal.hideModal()
        this.loadDataReport()
    },
    async onDeleteTask(task){
        let result = await this.$confirm('Thông báo', `Bạn có chắc muốn xóa công việc '${task.task_name}'?`)
        if(result==0) return
        let data=await API.DeleteTask(this, task.task_id)
        if(data=='1'){
            this.$toast.success('Xóa công việc thành công!')
            await this.loadDataReport()
        }else{
            this.$toast.error(data)
        }
    },
    async onCheckTask(task){
        if (!task.assignee_flg&&!task.creator_flg) {
            this.$msgBox.warn("Thông báo","Bạn không được quyền thao tác công việc của người khác")
            return;
        }

        if(task.assignee_flg&&task.creator_flg){}
        else if(task.creator_flg&&(task.status_id == 3||task.status_id == 10)){}
        else if(task.creator_flg){
            return
        }else if(task.assignee_flg&&task.status_id == 3){
            return
        }
        let data=await API.DoneTask(this, task.task_id)
        if(data=='1'){
            await this.loadDataReport()
        }else{
            this.$toast.error(data)
        }
    },
    async onDoingTask(task){
        if (!task.assignee_flg) {
            if (task.creator_flg) {
                var msgErr = "";
                if (task.status_id != 3 && (task.status_id == 0 || task.running_flag == 2)) {
                    msgErr = "Bạn không được quyền bắt đầu công việc";
                } else if (task.status_id != 3 && (task.status_id == 2 && task.running_flag != 2)) {
                    msgErr = "Bạn không được quyền tạm dừng công việc";
                }

                if (msgErr) {
                    this.$msgBox.warn("Thông báo",msgErr)
                    return
                }
            } else {
                var msgErr = "Bạn không được quyền thao tác công việc của người khác";
                this.$msgBox.warn("Thông báo",msgErr)
                return
            }
        }
        if (task.status_id == 3||task.status_id == 10) {
            return
        }

        let data=await API.DoingTask(this, task.task_id)
        if(data=='1'){
            await this.loadDataReport()
        }else{
            this.$toast.error(data)
        }

    },
  },
  mounted(){
    setTimeout(()=>{
      this.intPage()
    }, 1000)
  }
}
</script>
<style src="./CurrentWorkDashboard.css" scoped></style>