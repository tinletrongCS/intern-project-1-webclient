<template>
    <div class="k tab-split" >
        <span class="k head-card" :style="{ backgroundColor: colorCard }">
            <span class="name-split">DOING(20)</span>
            <span class="k btn-add-task" @click="onClickCreateNewTask">Tạo việc</span>
            <span @click="showTabChangeBoard($event)" class="bd-icon-more-split">
                <i class="fa fa-ellipsis-v k icon-more-split" aria-hidden="true"></i>
                <div class="tab-edit-task" >
                    <div class="k bd-tab-edit">
                        <span class="k item-edit-task" @click="toggleDialogUpdateSplit"><i class="fa fa-pencil icon-form-kb" aria-hidden="true"></i>Sửa</span>
                        <span class="k item-edit-task" @click="deleteTask"><i class="fa fa-trash-o icon-form-kb" aria-hidden="true"></i>Xóa</span>
                        <!-- <span class="k item-edit-task" @click="doubleTask">Nhân bản</span> -->
                    </div>
                </div>
            </span>
            
        </span>
        <Card  v-for="task in listTask" :key="task.task_id" :colorCard = colorCard :task=task draggable="true" 
            @dragstart="dragStart($event,task)" @openFormUpdateTask="openFormUpdateTask"
            @doubleTask="doubleTask" @deleteTask="deleteTask" @checkDoneTask = checkDoneTask @openFormDetailTask = openFormDetailTask
        />
    </div>
</template>
<script>
import Card from '../kanban_label/KanBanCard.vue';
export default {
    components:{
        Card,
    },
    data(){
        return{
        }
    },
    props:{
        colorCard :{
            type:String,
            default:"#F7E999"
        },
        listTask:{
            type:Array,
            default:[]
        }
    },
    methods:{
        dragStart(e,task){
            this.$emit('onDragStart',e,task);
        },
        //Show form update
        openFormUpdateTask() {
            this.$emit('openFormUpdateTask');
        },
        //X2 task
        doubleTask(){
            this.$emit('doubleTask');
        },
        //Delete task
        deleteTask(){
            this.$emit('deleteTask');
        },
        //Done task
        checkDoneTask(){
            this.$emit('checkDoneTask');
        },
        toggleDialogUpdateSplit(){
            this.$emit('toggleDialogUpdateSplit');
        },
        onClickCreateNewTask(){
            this.$emit('onClickCreateNewTask');
        }
    }
}
</script>
<style src="./KanBanSplitCard.css" scoped></style>