
<template>
    <div id="workkanban" class="main-wrapper"  >
        <breadcrumb :header="header" />
        <div class="k main-form" >
            <div class="row form-board">
                <div class="col-12 col-md-6">
                    <BoardKanban ref="boardKanban" 
                        @clickSelectBoard="clickSelectBoard"
                    />
                </div>
                <div class="col-12 col-md-6 member-board">
                    <MemberGroup ref="memberGroup" 
                        :boardId="boardIdSelected" 
                        :allowAddBoardFlg="allowAddBoardFlg"
                        :boardClosed="boardClosed"
                        @onLoadMembers="onLoadMembers"
                    />
                </div>
            </div>
            <SearchFormKanban ref="searchFormKanban"
               @onClickSearch="onClickSearch"
            />
            
            <div class="step-kanban">
                <StepFormKanban v-for="(step, index) in listStep" 
                    :key="`${step.step_id}-${index}`"
                    :step="step"
                    :ownerBoardFlg="ownerBoardFlg"
                    :subOwnerBoardFlg="subOwnerBoardFlg"
                    :boardClosed="boardClosed"
                    @onDragStart="onDragStart" 
                    @dragover = "onDragOver"
                    @drop = "onDrop($event, step.step_id)"
                    @clickEditStep="clickEditStep"
                    @clickDeleteStep="clickDeleteStep"
                    @onClickTaskAction="onClickTaskAction"
                    @onCheckTask="onCheckTask"
                    @onDoingTask="onDoingTask"
                    @onClickAddNewTask="onClickAddNewTask"
                    @showDetailTask="showDetailTask"
                    @successImportData="onClickSearch"
                />
                <button v-if="(ownerBoardFlg||subOwnerBoardFlg)&&!boardClosed"  @click="openFormInsertStep" class="btn btn-second btn-add-step">
                    <span class="-ap icon-plus3"></span> Thêm giai đoạn mới
                </button>
            </div>
        </div>
        <!-- Modal -->
        <AddUpdateStepModal ref="addUpdateStepModal" 
            :isUpdate="isUpdateStep" 
            :data="stepEdit" 
            :boardId="boardIdSelected"
            :positionLast="positionStepLast"
            @successAddUpdateStep="successAddUpdateStep"
        />
        <RatingTaskModal ref="ratingTaskModal"
            :task="taskRating"
            :boardId="boardIdSelected"
            @onRatingTaskSuccess="onRatingTaskSuccess"
        />
        <TaskKanbanModal ref="taskKanbanModal"
            :boardId="boardIdSelected"
            :stepId="stepIdAddTask"
            :taskId="taskID"
            :updateFlg="updateFlg"
            :cloneChildFlg="cloneChildFlg"
            :duplicateChildFlg="duplicateChildFlg"
            :viewFlg="viewFlg"
            :boardClosed="boardClosed"
            :enabled="true"
            @onSuccessSaveTask="onSuccessSaveTask"
            @onTagCodeClick="onTagCodeClick"
        />
        <ComplaintTaskModal ref="complaintTaskModal"
            :boardId="boardIdSelected"
            :taskId="taskID"
            @complaintSuccess="complaintSuccess"
        />
    </div>
</template>
<script>
import AddUpdateStepModal from './step/modal/AddUpdateStepModal.vue';
import MemberGroup from './member/MemberGroup.vue';
import BoardKanban from './board/BoardKanban.vue';
import SearchFormKanban from './search/SearchFormKanban.vue'
import StepFormKanban from './step/StepFormKanban.vue'
import API from './API';
import RatingTaskModal from './rating/RatingTaskModal.vue'
import TaskKanbanModal from './task/TaskKanbanModal.vue'
import ComplaintTaskModal from './task/ComplaintTaskModal.vue'
export default {
    components:{
        AddUpdateStepModal,
        MemberGroup,
        BoardKanban,
        SearchFormKanban,
        StepFormKanban,
        RatingTaskModal,
        TaskKanbanModal,
        ComplaintTaskModal
    },
    data(){
        return{
            header: {
                title: "Quản lý công việc",
                list: [
                ],
            },
            dragTask:null,
            boardIdSelected:0,
            allowAddBoardFlg:false,
            memberList:[],
            listStep:[],
            searchOption:{
                searchText:'',
                customerId:-1,
                assignId:-1,
                reporterId:-1,
                status:-1,
                rating:-1
            },
            ownerBoardFlg:false,
            isUpdateStep:false,
            stepEdit:{},
            taskRating:null,
            stepIdAddTask:null,

            taskID:0,
            updateFlg: false,
            cloneChildFlg: false,
            duplicateChildFlg: false,
            viewFlg:false,
            subOwnerBoardFlg:false,
            boardClosed: false,
            isTaskDetailRestricted:false
        }
    },
    computed:{
        positionStepLast(){
            return this.listStep?(this.listStep.length+1):1
        }
    },
    methods:{
        //Di chuyển task khi vừa kéo
        onDragStart(e,task){
            this.dragTask = task
        },
        // Dang di chuyen
        onDragOver(e) {
            e.preventDefault();
        },
        //Sau khi di chuyen va tha chuot
        onDrop(e, targetStepId){
            e.preventDefault();
            this.HandleUpdateStepForTask(this.dragTask, targetStepId)
        },
        async HandleUpdateStepForTask(task, targetStepId){
            console.log(`Chuyển task ${task.task_id} sang step ${targetStepId}`)
            if(task.step_id==targetStepId){
                return
            }
            if(task.MoveFlg||this.ownerBoardFlg){
                let data=await API.UpdateStepForTask(this, {
                    task_id:task.task_id,
                    step_old_id:task.step_id,
                    step_target_id:targetStepId
                })
                if(data=='1'){
                    //this.$toast.success('Xóa công đoạn thành công!')
                    await this.initStepTask()
                }else{
                    this.$toast.error(data)
                }
            }else{
                this.$toast.error("Bạn không quyền di chuyển công việc này!")
            }
        },
        //Open form Insert Split/Step
        openFormInsertStep(){
            this.isUpdateStep=false
            this.$refs.addUpdateStepModal.showModal()
        },
        onLoadMembers(value){
            this.memberList=value.boardMembers
            //Load đẩy danh sách option search
            this.$refs.searchFormKanban.setMembers(this.memberList)
            this.ownerBoardFlg=value.ownerBoardFlg
            this.subOwnerBoardFlg=value.subOwnerBoardFlg
        },
        onClickSearch(value){
            Object.assign(this.searchOption,value);
            this.initStepTask()
        },
        clickEditStep(value){
            this.isUpdateStep=true
            Object.assign(this.stepEdit, value);
            this.$refs.addUpdateStepModal.showModal()
        },
        async clickDeleteStep(value){
            let result = await this.$confirm('Thông báo', `Bạn có chắc muốn xóa công đoạn '${value.step_name}'?`)
            if(result==0) return
            let data=await API.DeleteStep(this, value.step_id)
            if(data=='1'){
                this.$toast.success('Xóa công đoạn thành công!')
                await this.initStepTask()
            }else{
                this.$toast.error(data)
            }
        },
        async onDeleteTask(task){
            let result = await this.$confirm('Thông báo', `Bạn có chắc muốn xóa công việc '${task.task_name}'?`)
            if(result==0) return
            let data=await API.DeleteTask(this, task.task_id)
            if(data=='1'){
                this.$toast.success('Xóa công việc thành công!')
                await this.initStepTask()
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
                await this.initStepTask()
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
                await this.initStepTask()
            }else{
                this.$toast.error(data)
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
                this.taskID=task.task_id
                this.$refs.complaintTaskModal.showModal()
            }else if(action.id=='complaintEnd'){
                this.closeComplaint(task)
            }
        },
        showRatingForm(task){
            this.taskRating=task
            this.$refs.ratingTaskModal.showModal()
        },
        onRatingTaskSuccess(){
            this.$refs.ratingTaskModal.hideModal()
            this.initStepTask()
        },
        async successAddUpdateStep(){
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.initStepTask()
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
                this.initStepTask()
            }else{
                this.$toast.error(result)
            }
        },
        complaintSuccess(){
            this.initStepTask()
        },
        onSuccessSaveTask(){
            this.initStepTask()
        },
        onClickAddNewTask(value){
            this.stepIdAddTask=value

            this.taskID=0
            this.updateFlg=false
            this.cloneChildFlg=false
            this.duplicateChildFlg=false
            this.viewFlg=false

            this.$refs.taskKanbanModal.showModal()
        },
        showDetailTask(task){
            //Check bật giới hạn xem chi tiết thì check Owner(or admin) vs task.is_user_task
            if (this.isTaskDetailRestricted) {
                if (!this.ownerBoardFlg && !task.is_user_task) {
                    return
                }
            }
            this.stepIdAddTask=task.step_id
            this.taskID=task.task_id
            this.updateFlg=false
            this.cloneChildFlg=false
            this.duplicateChildFlg=false
            this.viewFlg=true
            this.$refs.taskKanbanModal.showModal()
        },
        showFormUpdateTask(task){
            this.stepIdAddTask=task.step_id
            this.taskID=task.task_id
            this.updateFlg=true
            this.cloneChildFlg=false
            this.duplicateChildFlg=false
            this.viewFlg=false
            this.$refs.taskKanbanModal.showModal()
        },
        showFormCloneChild(task){
            this.stepIdAddTask=task.step_id
            this.taskID=task.task_id
            this.updateFlg=false
            this.cloneChildFlg=true
            this.duplicateChildFlg=false
            this.viewFlg=false
            this.$refs.taskKanbanModal.showModal()
        },
        showFormDuplicateTask(task){
            this.stepIdAddTask=task.step_id
            this.taskID=task.task_id
            this.updateFlg=false
            this.cloneChildFlg=false
            this.duplicateChildFlg=true
            this.viewFlg=false
            this.$refs.taskKanbanModal.showModal()
        },
        onTagCodeClick(code){
            this.$refs.searchFormKanban.input_timkiem=code
            this.$refs.searchFormKanban.onSearch()
        },
        async initDuLieu(){
            await this.$refs.boardKanban.initDuLieu()
        },
        async clickSelectBoard(board){
            this.boardClosed=board.Closed;
            this.ownerBoardFlg=false
            this.subOwnerBoardFlg=false
            this.boardIdSelected=board.Id
            this.allowAddBoardFlg=board.CanAddMember
            this.isTaskDetailRestricted=board.isTaskDetailRestricted
            if(!this.boardIdSelected)return;
            this.listStep=[]
            //Clear search do mỗi board ds thành viên khác nhau cần clear nguwofi giao nhận
            this.searchOption.reporterId=-1
            this.searchOption.assignId=-1
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.initStepTask()
            await this.$refs.memberGroup.initDuLieu()
        },
        async initStepTask(){
            let dataRequest={
                boardId: this.boardIdSelected,
                searchText:this.searchOption.searchText,
                customerID:this.searchOption.customerId,
                creatorId:this.searchOption.reporterId,
                assigneeID:this.searchOption.assignId,
                statusID:this.searchOption.status,
                ratingID:this.searchOption.rating,
            }
            var strStep=await API.GetTaskByStepInBoardWithEF(this, dataRequest)
            var list=JSON.parse(strStep)
            this.listStep=list;
        }

    },
    mounted(){
        setTimeout(async ()=>{
            // Kiểm tra nếu có query parameters
            if (this.$route.query.searchText) {
                this.$refs.searchFormKanban.input_timkiem = this.$route.query.searchText;
                this.searchOption.searchText = this.$route.query.searchText;
            }
            const boardIdFromQuery = this.$route.query.board_id ?? null;
            await this.initDuLieu()

            if (boardIdFromQuery) {
                const matched = await this.$refs.boardKanban.selectBoardById(boardIdFromQuery)
                if (!matched) {
                    console.warn('Board not found for id from query:', boardIdFromQuery)
                }
            }
        }, 100)
    }
}
</script>


<style src="./Work_Kanban.css" scoped></style>
