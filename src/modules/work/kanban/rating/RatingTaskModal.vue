<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupRatingTask"
    :showCloseIcon="true"
    width="50%"
    :isModal="true"
    :target="target"
    :header="header"
    :open="handleShowModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
            <div class="stars">
                <span
                v-for="n in 4"
                :key="n"
                class="star"
                :class="getStarClass(n)"
                @click="selectRating(n)"
                @mouseover="hoverRating = n"
                @mouseleave="hoverRating = null"
                >
                    ★
                </span>
            </div>
            
            <div v-if="codeWorkgroup === 'N17'">
                <ejs-multiselect 
                    id='taskDictionaryMultiSelect'
                    ref="taskDictionaryMultiSelect"
                    :dataSource="ds_loaicongviec" 
                    placeholder="Chọn loại công việc" 
                    v-model="selectedJobtypeIds" 
                    :fields='taskDictionaryFields' 
                    :allowFiltering="true" 
                    filterType="Contains">
                </ejs-multiselect>
            </div>
            
            <div class="guide">
                <strong>Hướng dẫn đánh giá</strong>
                <ul>
                    <li><strong>Mức 1:</strong> Không đạt mức kỳ vọng/yêu cầu</li>
                    <li><strong>Mức 2:</strong> Đạt mức kỳ vọng/yêu cầu nhưng phát sinh lãng phí rework</li>
                    <li><strong>Mức 3:</strong> Đạt mức kỳ vọng/yêu cầu, không lãng phí rework</li>
                    <li><strong>Mức 4:</strong> Đạt vượt mức kỳ vọng/yêu cầu</li>
                </ul>
            </div>

          <div class="group-buttons -bottom right" style="margin-top: 37px; margin-bottom: 10px;">
            <button @click="onRatingTask" class="btn btn-second nocorner" style="width: 180px">
               Kết thúc công việc
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import API from './API'
import TaskAPI from '../task/API'
export default {
  name: "RatingTaskModal",
  props: {
    task:{
      type:Object,
      default: () => ({}) 
    },
    boardId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="icon one-notepad"></span> ĐÁNH GIÁ CHẤT LƯỢNG CÔNG VIỆC`,
      rating: 0,
      hoverRating: null,
      taskRating: {},
      codeWorkgroup: '',
      ds_nhomcongviec: [],
      ds_loaicongviec: [],
      selectedJobtypeIds: [],
      taskDictionaryFields: {
        value: 'dictionary_id',
        text: 'task_dictionary'
      }
    };
  },
  methods: {
    showModal() {
        this.$refs["popupRatingTask"].show();
    },
    hideModal() {
      this.$refs["popupRatingTask"].hide();
    },
    handleShowModal() {
      this.clear();
      setTimeout(() => {
        this.initDuLieu();
      }, 200);
    },
    async initDuLieu() {
        Object.assign(this.taskRating, this.task)
        // Xác định codeWorkgroup của task
        await this.determineCodeWorkgroup()
        // Load task dictionary data chỉ khi là N17
        if (this.codeWorkgroup === 'N17') {
            await this.loadTaskDictionaryData()
        }
    },
    async determineCodeWorkgroup() {
        try {
            // Kiểm tra các trường cần thiết
            if (!this.taskRating.task_id) {
                console.error('Task ID is missing');
                return;
            }
            let boardId = this.boardId || this.taskRating.board_id || this.taskRating.boardId || this.task.board_id || this.task.boardId;
            if (!boardId) {
                console.error('Board ID is missing');
                return;
            }
            const taskInfo = await TaskAPI.GetTaskInfo(this, this.taskRating.task_id, boardId);
            if (taskInfo && taskInfo.dictionary_group_id) {
                this.ds_nhomcongviec = await TaskAPI.GetAllTaskDictionaryGroups(this);
                const workgroup = this.ds_nhomcongviec.find(x => x.dictionary_group_id === taskInfo.dictionary_group_id);
                this.codeWorkgroup = workgroup ? workgroup.code : '';
            }
        } catch (error) {
            console.error('Error determining code workgroup:', error);
            this.codeWorkgroup = '';
        }
    },
    async loadTaskDictionaryData() {
        try {
            if (!this.taskRating.task_id) {
                console.error('Task ID is missing for loadTaskDictionaryData');
                return;
            }
            let boardId = this.boardId || this.taskRating.board_id || this.taskRating.boardId || this.task.board_id || this.task.boardId;
            
            if (!boardId) {
                console.error('Board ID is missing for loadTaskDictionaryData');
                return;
            }
            
            const taskInfo = await TaskAPI.GetTaskInfo(this, this.taskRating.task_id, boardId);
            if (taskInfo && taskInfo.dictionary_group_id) {
                this.ds_loaicongviec = await TaskAPI.GetTaskDictionaryByGroupId(this, taskInfo.dictionary_group_id) || []
            }
        } catch (error) {
            console.error('Error loading task dictionary:', error)
            this.ds_loaicongviec = []
        }
    },
    clear() {
      this.rating = 0;
      this.hoverRating = null;
      this.taskRating = {}
      this.codeWorkgroup = ''
      this.ds_nhomcongviec = []
      this.ds_loaicongviec = []
      this.selectedJobtypeIds = []
    },
    selectRating(value) {
      this.rating = value;
    },
    getStarClass(index) {
        const value = this.hoverRating || this.rating;
        if (value === 0) return 'unselected';
        let color = '';
        if (value === 1) color = 'red';
        else if (value === 2) color = 'yellow';
        else color = 'green';
        return index <= value ? `filled ${color}` : `unselected`;
    },
    async onRatingTask() {
        if(!this.rating||this.rating==0){
            this.$msgBox.warn("Thông báo", "Hãy chọn đánh giá công việc trước khi kết thúc!")
            return
        }
        let dataRequest={
            task_id:this.taskRating.task_id,
            rating:this.rating,
            task_dictionary_ids: this.selectedJobtypeIds || []
        }
        let data=await API.RatingTask(this, dataRequest)
        if(data=='1'){
            // Đóng modal sau khi đánh giá thành công
            this.hideModal();
            
            // Emit success event
            this.$emit("onRatingTaskSuccess", {
                task_id: this.taskRating.task_id,
                rating: this.rating,
                task_dictionary_ids: this.selectedJobtypeIds || []
            })
        }else{
            this.$toast.error(data)
        }
    }
  },
};
</script>

<style scoped>
.rating-form {
  font-family: Arial, sans-serif;
  max-width: 600px;
}

.stars {
  font-size: 25px;
  margin-bottom: 10px;
  text-align: center;
}

.star {
  cursor: pointer;
  margin-right: 4px;
}

/* FILL styles */
.filled.red {
  color: #f03c56;
}

.filled.yellow {
  color: #ffc058;
}

.filled.green {
  color: #7ed321;
}

/* Unselected */
.unselected {
  color: lightgray;
  -webkit-text-stroke-width: 1.5px;
  -webkit-text-stroke-color: gray;
}

.selected-text {
  margin-bottom: 10px;
  font-weight: bold;
}

.guide {
  margin-top: 20px;
}

.guide ul {
  padding-left: 1em;
}
</style>
