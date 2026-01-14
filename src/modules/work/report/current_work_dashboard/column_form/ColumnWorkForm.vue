<template>
  <div class="k border-col-task">
      <div class="k column-work-form">
        <div class="k column-header">
          <div class="k title-wrap">
            <div class="title">{{ data.title ?? "" }}</div>
            <div class="count">{{numberTask}}</div>
          </div>

           <!-- Nút lọc -->
          <div class="menu-wrapper" ref="menuFilterRef">
            <div class="task-menu" @click="toggleDropdown">
              <!-- <i class="-ap icon-filter2" :style="{ color: status!=0 ? '#035FCC' : '#444' }"></i> -->
              <i class="fa fa-filter" style="font-size:18px;" :style="{ color: status!=0 ? '#035FCC' : '#444' }"></i>
            </div>
            <Teleport to="body">
              <div v-if="showDropdown" class="dropdown-column"  :style="dropdownStyle">
                <div class="dropdown-item-column" @click="clickFiler(0)"><i class="fa fa-check" :class="{ invisible: status !== 0 }"></i>Tất cả</div>
                <div class="dropdown-item-column" @click="clickFiler(1)"><i class="fa fa-check" :class="{ invisible: status !== 1 }"></i>Đến hạn</div>
                <div class="dropdown-item-column" @click="clickFiler(2)"><i class="fa fa-check" :class="{ invisible: status !== 2 }"></i>Trễ hạn</div>
              </div>
            </Teleport>
          </div>

        </div>


        <TaskCardKanban v-for="(task, index) in listTask" 
            :key="index" 
            :task="task" 
            @onClickTaskAction="onClickTaskAction"
            @onCheckTask="onCheckTask"
            @onDoingTask="onDoingTask"
            @showDetailTask="showDetailTask"/>

        <button class="add-task" 
          v-if="hasMoreTasks"
          @click="loadMore" >
          Xem thêm
        </button>
    </div>
  </div>
</template>
<script>
import TaskCardKanban from '../../../kanban/kanban_task/TaskCardKanban.vue'
export default {
  name:'ColumnWorkForm',
  props:{
    data:{
      type:Object,
      default: () => ({}) 
    }
  },
  components:{
    TaskCardKanban
  },
  computed:{
    numberTask(){
      return this.data.tasks.filter(x=>this.status==0||(x.status==this.status))?this.data.tasks.filter(x=>this.status==0||(x.status==this.status)).length:0
    },
    listTask(){
      return this.data.tasks.filter(x=>this.status==0||(x.status==this.status))
        ? this.data.tasks.filter(x=>this.status==0||(x.status==this.status)).slice(0, this.pageSize)
        : [];
    },
    hasMoreTasks() {
      return this.data.tasks.filter(x=>this.status==0||(x.status==this.status)) && this.data.tasks.filter(x=>this.status==0||(x.status==this.status)).length > this.pageSize;
    }
  },
  data(){
    return {
      pageSize:30,
      showDropdown: false,
      dropdownStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px'
      },
      status:0, //0: Tất cả không filer, 1: Đến hạn, 2 Trễ hạn (1, 2)-->Tô xanh nút filter
    }
  },
  methods:{
    loadMore() {
      this.pageSize += 30;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown

      this.$nextTick(() => {
        if (this.showDropdown) {
          const rect = this.$refs.menuFilterRef.getBoundingClientRect();
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
      const dropdown = this.$refs.menuFilterRef;
      if (dropdown && !dropdown.contains(event.target)) {
          this.showDropdown = false;
      }
    },
    clickFiler(value){
      this.status=value
      this.showDropdown=false
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
    showDetailTask(task){
      this.$emit('showDetailTask',task)
    }
  },
  watch:{
    'data.tasks':function(newVal, oldVal) {
      this.pageSize=30
      this.status=0
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
<style src="./ColumnWorkForm.css" scoped></style>