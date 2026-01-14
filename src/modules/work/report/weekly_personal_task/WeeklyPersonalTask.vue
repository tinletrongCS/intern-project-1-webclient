<template>
  <div id="weeklyPersonalTask" class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="k main-form">
      <div class="k box-form">
        <div class="k info-row col-lg-3">
          <div class="k title-filter">Nhân viên</div>
          <div class="k select-pj">
            <select2 class="select2" v-model="listMember.value" @select="onChangeMember" :options="listMember.Items && listMember.Items.length > 0 ?
              listMember.Items.map(e => ({ id: e.user_id, text: e.display_name })) : []"> </select2>
          </div>
        </div>
        <div class="k info-row col-lg-3">
          <div class="k title-filter">Từ ngày</div>
          <div class="k select-pj">
            <ejs-datepicker ref="fromDate" class="form-control bg-none bor0 fw6 text-red" placeholder="Chọn ngày"
              :format="'dd/MM/yyyy'" :enabled="true" :showClearButton="false"
              v-model="fromDate" :allowEdit="false" @change="onChangeFromDate($event)" />
          </div>
        </div>
        <div class="k info-row col-lg-3">
          <div class="k title-filter">Đến ngày</div>
          <div class="k select-pj">
            <ejs-datepicker ref="toDate" class="form-control bg-none bor0 fw6 text-red" placeholder="Chọn ngày"
              :format="'dd/MM/yyyy'" :enabled="true" :showClearButton="false"
              v-model="toDate" :allowEdit="false" @change="onChangeToDate($event)" />
          </div>
        </div>
        <div class="k info-row col-lg-3">
          <button @click="onSearch" class="btn btn-second">
            <span class="-ap icon-search"></span> Tìm kiếm
          </button>
        </div>
      </div>
      <div class="k step-kanban">
        <div class="border-all-step">
          <div class="k col-weeekly">
            <StepFormKanban :step="step2" @showDetailTask="showDetailTask"/>
          </div>
          <div class="k col-weeekly">
            <StepFormKanban :step="step3" @showDetailTask="showDetailTask"/>
          </div>
          <div class="k col-weeekly">
            <StepFormKanban :step="step4" @showDetailTask="showDetailTask"/>
          </div>
          <div class="k col-weeekly">
            <StepFormKanban :step="step5" @showDetailTask="showDetailTask"/>
          </div>
          <div class="k col-weeekly">
            <StepFormKanban :step="step6" @showDetailTask="showDetailTask"/>
          </div>
        </div>
      </div>
    </div>
    <div style="width:100%;position:relative;float:left">
      <div style="position:absolute">
        <span class="abc"></span>
         <span class="abc"></span>
      </div>
    </div>
    <TaskKanbanModal ref="taskKanbanModal"
      :boardId="taskSelected.boardId"
      :stepId="taskSelected.stepId"
      :taskId="taskSelected.taskId"
      :updateFlg="false"
      :cloneChildFlg="false"
      :duplicateChildFlg="false"
      :viewFlg="true"
      :enabled="true"
      @onSuccessSaveTask="onSuccessSaveTask"
      @onTagCodeClick="onTagCodeClick"
    />
  </div>
</template>
<script>
import moment from 'moment';
import vClickOutside from "click-outside-vue3";
import WeeklyPersonalTaskAPI from './WeeklyPersonalTaskAPI.js';
import StepFormKanban from '@/modules/work/kanban/step/StepFormKanban.vue';
import TaskKanbanModal from '@/modules/work/kanban/task/TaskKanbanModal.vue';
export default {
  components: {
    StepFormKanban,
    TaskKanbanModal
  },
  data() {
    return {
      header: {
        title: this.$route.meta.title,
        list: [
        ],
      },
      listMember: { value: null, Items: [] },
      fromDate: moment().startOf('week').add(1, 'days').toDate(),
      toDate: moment().startOf('week').add(5, 'days').toDate(),
      workdays: [],
      step2: { step_name:'Thứ 2', only_view: true, tasks: [] },
      step3: { step_name:'Thứ 3', only_view: true, tasks: [] },
      step4: { step_name:'Thứ 4', only_view: true, tasks: [] },
      step5: { step_name:'Thứ 5', only_view: true, tasks: [] },
      step6: { step_name:'Thứ 6', only_view: true, tasks: [] },
      taskSelected: {
        boardId: 0,
        stepId: 0,
        taskId: 0,
      }
    }
  },
  methods: {
    async getAllMemberByUnit() {
      try {
        this.listMember.Items = [];
        let result = await WeeklyPersonalTaskAPI.getUsersByUserUnit(this);
        if (result) {
          this.listMember.Items = JSON.parse(result);
        }
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    async onChangeMember() {
      try {
        this.loading(true);
        await Promise.all([
          this.getDetailByDate()
        ]);
      } catch (e) { } finally {
        this.loading(false);
      }
    },
    onChangeFromDate(event) {
      if (event?.value) {
        this.setWeekRangeFromDate(event.value);
      }
    },
    onChangeToDate(event) {
      if (event?.value) {
        this.setWeekRangeFromDate(event.value);
        this.onSearch();
      }
    },
    setWeekRangeFromDate(date) {
      this.fromDate = moment(date).startOf('week').add(1, 'days').toDate();
      this.toDate = moment(date).startOf('week').add(5, 'days').toDate();
      this.getWorkDay();
    },
    async onSearch() {
      try {
        this.loading(true);
        await Promise.all([
          this.getDetailByDate()
        ]);
      } catch (e) { } finally {
        this.loading(false);
      }
    },
    getWorkDay() {
      var startOfWeek = moment(this.fromDate);
      this.workdays = [];
      for (let i = 0; i < 5; i++) {
        this.workdays.push(startOfWeek.clone().add(i, 'days').format('DD/MM/yyyy'));
      }
    },
    async getDetailByDate() {
      try {
        this.step2.tasks = [];
        this.step3.tasks = [];
        this.step4.tasks = [];
        this.step5.tasks = [];
        this.step6.tasks = [];
        let response = await WeeklyPersonalTaskAPI.getDetailByDate(this.axios, {
          assignee_id: this.listMember.value,
          fromDate: this.workdays[0],
          toDate: this.workdays[4],
        })
        if (response.data.success) {
          if (response.data.data && response.data.data.length > 0) {
            var data = JSON.parse(response.data.data);
            this.step2.tasks = data.filter(e => e['schedule_end'] == this.workdays[0]);
            this.step3.tasks = data.filter(e => e['schedule_end'] == this.workdays[1]);
            this.step4.tasks = data.filter(e => e['schedule_end'] == this.workdays[2]);
            this.step5.tasks = data.filter(e => e['schedule_end'] == this.workdays[3]);
            this.step6.tasks = data.filter(e => e['schedule_end'] == this.workdays[4]);
          }
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    onSuccessSaveTask() {},
    onTagCodeClick(code){
      this.$refs.searchFormKanban.input_timkiem=code
      this.$refs.searchFormKanban.onSearch()
    },
    showDetailTask(task) {
      this.taskSelected.boardId = task.board_id;
      this.taskSelected.stepId = task.step_id;
      this.taskSelected.taskId = task.task_id;
      this.$refs.taskKanbanModal.showModal()
    },
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  async mounted() {
    try {
      this.loading(true);
      await Promise.all([
        this.getAllMemberByUnit(),
        this.getWorkDay()
      ]);
      var index = this.listMember.Items.findIndex(item => item.username == this.$_root.token.getUserName());
      if (index >= 0) {
        this.listMember.value = this.listMember.Items[index].user_id;
      }
      if (!this.listMember.value) {
        this.loading(false);
        return;
      };
      await Promise.all([
        this.getDetailByDate()
      ]);
    } catch (e) {
      console.log(e)
    } finally {
      this.loading(false);
    }
  }
}
</script>


<style src="./WeeklyPersonalTask.css" scoped></style>