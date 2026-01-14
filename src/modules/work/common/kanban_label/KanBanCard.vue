<template>
    <aside class="k note-wrap note-color" :style="{ backgroundColor: colorCard }"  >
        <div class="k head-card"> 
            <span class="k task-code" @click="openFormDetailTask" >
                {{ task.code }}
            </span>
            <div class="k form-edit-task">
                <span class="icon-edit-task" @click="onOpenFormChangeTask($event)">
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    <div class="tab-edit-task" >
                        <div class="k bd-tab-edit">
                            <span class="k item-edit-task" @click="openFormUpdateTask"><i class="fa fa-pencil icon-form-kb" aria-hidden="true"></i>Sửa</span>
                            <span class="k item-edit-task" @click="deleteTask"><i class="fa fa-trash-o icon-form-kb" aria-hidden="true"></i>Xóa</span>
                            <!-- <span class="k item-edit-task" @click="doubleTask">Nhân bản</span> -->
                        </div>
                    </div>
                </span>
                <input type="checkbox" class="check-done-task" @change="checkDoneTask">
                
            </div>
        </div>
        <div class="k body-card"> 
            <span class="k card-name-project">
                {{ task.project_name }}
            </span>
        </div>
        <div class="k body-card"> 
            <span class="k card-task-name">
                {{ task.name }}
            </span>
        </div>
        <div class="k body-card"> 
            <span class="k card-deadline">
                {{ task.day }}
            </span>
            <div class="card-avt-user-assign"></div>
        </div>
    </aside>
</template>
<script>
import vClickOutside from "click-outside-vue3";
export default{
    data(){
        return {

        }
    },
    methods:{
    },
    props:{
        colorCard :{
            type:String,
            default:"#F7E999"
        },
        task :{
            type:Object,
            default:{}
        }
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    methods:{
        openFormUpdateTask(){
            this.$emit('openFormUpdateTask');
        },
        doubleTask(){
            this.$emit('doubleTask');
        },
        deleteTask(){
            this.$emit('deleteTask');
        },
        checkDoneTask(){
            this.$emit('checkDoneTask');
        },
        openFormDetailTask(){
            this.$emit('openFormDetailTask');
        }
    }
}
</script>
<style src="./KanBanCard.css" scoped></style>