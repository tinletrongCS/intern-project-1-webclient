<template>
  <div class="k task-card-kanban">
    <div class="k task-card">
      <!-- <div  :class="statusClass" class="decorative-border" ></div> -->
      <div class="k form-head">
        <div class="k arrow" :class="statusClass" ></div>
        <div class="k task-title" @click="showDetailTask">
          {{task.task_name??""}}
        </div>
        <div class="k bd-checkbox-done">
          <i class="fa fa-square-o fa-custom-icon"
            v-if="(task.status_id == 2 || (task.status_id != 3 && task.creator_flg))&&task.status_id != 10"
            aria-hidden="true"
            @click="onCheckTask"
            title="Hoàn thành công việc"></i>
          <i class="fa fa-check-square-o fa-custom-icon"
            v-if="task.status_id == 3||task.status_id == 10"
            aria-hidden="true"
            @click="onCheckTask"
            title="Thực hiện công việc"></i>
        </div>
        <div class="k menu-wrapper" ref="menuRef" v-if="!only_view&&!boardClosed">
          <span class="task-menu" @click="toggleMenu">⋯</span>
          <Teleport to="body">
            <div  v-if="showMenu && actionData.length > 0" class="dropdown-task" :class="{ 'dropdown-left-task': isNearRightEdge }" :style="dropdownStyle"  ref="dropdownRef">
              <div 
                class="dropdown-item-task" 
                v-for="(action, index) in actionData" 
                :key="index"
                @click="clickAction(action)"
              >
                {{ action.text }}
              </div>
            </div>
          </Teleport>
        </div>

      </div>
      <div class="k form-head">
        <span class="k task-subinfo">
          <div class="k">
            <div class="k img-task-code"></div>
            <span class="k task-code">{{task.code??""}}</span>
          </div>
          <span v-if="task.ChildTaskNumber&&task.ChildTaskNumber.TotalTask>0" class="tag sub-task">{{task.ChildTaskNumber.DoneTask}}/{{task.ChildTaskNumber.TotalTask}} subtask</span>
        </span>
      </div>
      <div class="k form-head">
        <!-- <span @click="showDetailTask" class="title">Xem thẻ</span> -->
        <span v-if="isLinkJira" class="left url-task">
          <i class="fa fa-link url-jira" aria-hidden="true"></i>
          <a :href="jiraUrl" target="_blank" rel="noopener noreferrer">Link liên quan</a>
        </span>
        <div class="bd-form-ratting">
          
          <StarRating :rating="rating" v-if="!only_view" />
        </div>
      </div>
      <div class="k form-head">
        <div class="task-footer">
          <div class="task-date" :class="statusClass" @click="onDoingTask">
            <span class="icon" v-if="task.status_id != 3 && (task.status_id == 0 || task.running_flag == 2)">▶</span>
            <span class="icon" v-if="task.status_id != 3 && (task.status_id == 2 && task.running_flag != 2)">❚❚</span>
            <span  class="k icon-deadline">
              <i class="fa fa-calendar-times-o k" aria-hidden="true"></i>
            </span>
            <span class="text-date">{{task.schedule_end}}</span>
            <span v-if="task.actual_execution_time">({{task.actual_execution_time}}h)</span>
          </div>
          <div class="task-tags">
            <!-- <img src="your-icon.svg" class="icon-img" /> -->
            <img 
              v-if="!loadImageError&&hasAssigneeAvatar" 
              :src="assigneeAvatar" 
              :title="userAssignee || 'User Avatar'"
              class="avatar-image"
              @error="loadImageError = true"
            />
            <span v-else class="initial" :title="userAssignee">{{this.task.prefix_name}}</span>
          </div>
        </div> 
      </div>
    </div>

  </div>
</template>
<script>
import StarRating from './ratting/StarRating.vue'
export default {
  name:'TaskCardKanban',
  components:{
    StarRating
  },
  props:{
    only_view: {
      type: Boolean,
      default: false
    },
    task:{
      type:Object,
      default: () => ({}) 
    },
    boardClosed:{
      type:Boolean,
      default:false
    }
  },
  computed:{
    rating(){
      return this.task.rating??0;
    },
    isLinkJira(){
      return this.task.jira_url!=null&&this.task.jira_url.trim()!='';
    },
    jiraUrl(){
      return this.task.jira_url
    },
    actionData(){
      var list=[]
      if (this.task && this.task.creator_flg) {
        list.push({
          text: "Sửa",
          id: 'Edit',
          icon: 'pencil',
        })
      }
      if (this.task && this.task.creator_flg) {
        list.push({
          text: "Xóa",
          id: 'Delete',
          icon: 'trash',
        })
      }
      //Tạo khiếu nại
      if (this.task &&this.task.assignee_flg&&this.task.status_id==3&&(this.task.complaint_status==null||this.task.complaint_status==2)) {
        list.push({
          text: "Khiếu nại",
          id: 'complaintStart',
          icon: 'copy',
        })
      }
      //Kết thúc khiếu nại
      if (this.task &&this.task.assignee_flg&&this.task.status_id==3&&this.task.complaint_status!=null&&this.task.complaint_status==1) {
        list.push({
          text: "Kết thúc khiếu nại",
          id: 'complaintEnd',
          icon: 'copy',
        })
      }

      if (this.task && (this.task.creator_flg || this.task.assignee_flg)&&this.task.status_id!=3&&this.task.status_id!=4) {
        list.push({
          text: "Tạo công việc con",
          id: 'CloneChild',
          icon: 'copy',
        })
      }
      if (this.task  && (this.task.creator_flg || this.task.assignee_flg)) {
        list.push({
          text: "Nhân bản công việc",
          id: 'DuplicateTask',
          icon: 'copy'
        })
      }
      if (this.task  && this.task.creator_flg &&this.task.status_id!=3) {
        list.push({
          text: "Kết thúc và đánh giá chất lượng công việc",
          id: 'ReviewTask',
          icon: 'star',
        })
      }
      return list
    },
    statusClass() {
      if (this.task.complaint_status == 1){
        return 'step-task-complaint'
      }
      if (this.task.status_id == 3) return 'step-task-done'
      else if (this.task.status == 2) return 'step-task-duadate-lated'
      else if (this.task.status == 1) return 'step-task-duadate-comming'
      else return 'step-task-duadate-default';
    },
    hasAssigneeAvatar() {
      return this.task.avatar && this.task.avatar.trim() !== '';
    },
    assigneeAvatar() {
      if (this.hasAssigneeAvatar) {
        return `${import.meta.env.VNPT_API}/user/Account/ImageView/${this.task.avatar}`
      }
      return null;
    },
    userAssignee() {
      return this.task.account_name;
    },
  },
  data(){
    return {
      showMenu:false,
      isNearRightEdge: false,
      dropdownStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px'
      },
      loadImageError:false
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
            zIndex: 9999
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
    clickAction(action){
      this.showMenu = false;
      this.$emit("onClickTaskAction",{
        action:action,
        task:this.task
      })
      
    },
    onCheckTask(){
      if (this.only_view||this.boardClosed) return;

      this.$emit('onCheckTask', this.task)
    },
    onDoingTask(){
      if (this.only_view||this.boardClosed) return;
      this.$emit('onDoingTask', this.task)
    },
    showDetailTask(){
      this.$emit('showDetailTask', this.task)
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
<style src="./TaskCardKanban.css" scoped></style>