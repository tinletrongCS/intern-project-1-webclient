<template>
  <div class="taskcardkanban">
    <div class="task-card">
      <div class="column-header">
        <div class="column-left">
          <span @click="showDetailTask" class="title">Xem thẻ</span>
          <StarRating :rating="rating" v-if="!only_view" />
        </div>
        <div class="column-actions">
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
              
          <div class="menu-wrapper" ref="menuRef" v-if="!only_view">
            <span class="task-menu" @click="toggleMenu">⋯</span>
            <!-- <div class="dropdown" v-if="showMenu&&actionData.length>0"  :class="{ 'dropdown-left': isNearRightEdge }">
              <div class="dropdown-item" v-for="(action, index) in actionData" :key="index"
                  @click="clickAction(action)"
              >
                {{action.text}}
              </div>
            </div> -->
            <Teleport to="body">
              <div 
                v-if="showMenu && actionData.length > 0"
                class="dropdown-task"
                :class="{ 'dropdown-left-task': isNearRightEdge }"
                :style="dropdownStyle"
                ref="dropdownRef"
              >
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
      </div>

      <div class="task-title">
        {{task.task_name??""}}
      </div>

      <span class="task-subinfo">
        <span class="left">{{task.code??""}}</span>
        <span v-if="isLinkJira" class="right">
          <a :href="jiraUrl" target="_blank" rel="noopener noreferrer">Link liên quan</a>
        </span>
      </span>

      <div class="task-footer">
        <div class="task-date" :class="statusClass" @click="onDoingTask">
          <span class="icon" v-if="task.status_id != 3 && (task.status_id == 0 || task.running_flag == 2)">▶</span>
          <span class="icon" v-if="task.status_id != 3 && (task.status_id == 2 && task.running_flag != 2)">❚❚</span>
          <span>{{task.schedule_end}}</span>
          <span v-if="task.actual_execution_time"> ({{task.actual_execution_time}}h)</span>
        </div>
        <div class="task-tags">
          <span v-if="task.ChildTaskNumber&&task.ChildTaskNumber.TotalTask>0" class="tag">{{task.ChildTaskNumber.DoneTask}}/{{task.ChildTaskNumber.TotalTask}} subtask</span>
          <!-- <img src="your-icon.svg" class="icon-img" /> -->
          <span class="initial">{{this.task.prefix_name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StarRating from './StarRating.vue'
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

      if (this.task && (this.task.creator_flg || this.task.assignee_flg)) {
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
      if (this.task.status_id == 3) return 'step-task-done'
      else if (this.task.status == 2) return 'step-task-duadate-lated'
      else if (this.task.status == 1) return 'step-task-duadate-comming'
      else return 'step-task-duadate-default';
    }
  },
  data(){
    return {
      showMenu:false,
      isNearRightEdge: false,
      dropdownStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px'
      }
    }
  },
  methods:{
    toggleMenu(){
      this.showMenu=!this.showMenu;
      console.log('ttass', this.task)
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
      if (this.only_view) return;
      this.$emit('onCheckTask', this.task)
    },
    onDoingTask(){
      if (this.only_view) return;
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
<style scoped>
.taskcardkanban{
  cursor: pointer;
}
/* Task card */
.taskcardkanban .task-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
  font-size: 14px;
}

.taskcardkanban .column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0; */
}

.taskcardkanban .column-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.taskcardkanban .title {
  color: #007bff;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
}

.taskcardkanban .column-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.taskcardkanban .menu {
  font-size: 18px;
  cursor: pointer;
  color: #555;
}

.taskcardkanban .task-title {
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  height: calc(1.4em * 3);
}

.taskcardkanban .task-subinfo {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 13px;
  color: #666;
}

.taskcardkanban .task-subinfo .left,
.taskcardkanban .task-subinfo .right {
  flex: 1;
}

.taskcardkanban .task-subinfo .right {
  text-align: right;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
}

.taskcardkanban .task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.taskcardkanban .task-date {
  display: flex;
  align-items: center;
  color: #444;
}

.taskcardkanban .task-date .icon {
  font-size: 12px;
  margin-right: 4px;
  background: #000;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.taskcardkanban .task-tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.taskcardkanban .tag {
  font-size: 12px;
  color: #007bff;
  cursor: pointer;
}

.taskcardkanban .icon-img {
  width: 16px;
  height: 16px;
}

.taskcardkanban .initial {
  background: #7dc242;
  color: white;
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.dropdown-task {
  /* position: absolute; */
  left: 0;
  right: auto;
  top: 120%;
  background: white !important;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15)!important;
  border-radius: 6px!important;
  z-index: 100;
  min-width: 100px!important;
}

.dropdown-left-task {
  left: auto;
  right: 0;
}

.dropdown-item-task {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}
.dropdown-item-task:hover {
  background-color: #f2f2f2;
}
.menu-wrapper {
  position: relative; /* Quan trọng để dropdown căn theo đây */
}
.taskcardkanban .column-header .task-menu {
  cursor: pointer;
  font-size: 18px;
  color: #888;
  padding: 4px;
  transition: color 0.2s ease;
}
.taskcardkanban .step-task-duadate:hover {
  cursor: pointer;
  background-color: #418ee1;
  color: white;
}

.taskcardkanban .step-task-duadate-default {
  background-color: #f0f0f0;
  text-align: center;
  padding: 4px;
  border-radius: 4px
}

.taskcardkanban .step-task-duadate-comming {
  background-color: #ffde88;
  text-align: center;
  padding: 4px;
  border-radius: 4px
}

.taskcardkanban .step-task-duadate-lated {
  background-color: #ea9999;
  text-align: center;
  padding: 4px;
  border-radius: 4px
}

.taskcardkanban .step-task-done {
  color: black;
  text-align: center;
  padding: 4px;
  border-radius: 4px
}
.taskcardkanban .fa-custom-icon {
  font-size: 18px;
  color: #01458E;
}
</style>