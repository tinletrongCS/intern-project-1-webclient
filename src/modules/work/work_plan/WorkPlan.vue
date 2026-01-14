<template>

    <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k form-head-sc">
            <div class="k form-acction"> 
                <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
            </div>
            <div class="k form-filter"> 

                <span class="k text-note-filter">Board:</span>
                <select2  class="select-filter"  @select ="onChangeBoard"  v-model="boardID" :options="listBoards.map(e=>({id:e.id, text:e.name}))"></select2>

                <span class="k text-note-filter">Trạng thái công việc:</span>
                <select2  class="select-filter" @select="onChangeWorkType"  v-model="status_id" :options="listStatusFilter"></select2>
                <span class="k text-note-filter">Tháng:</span>
                <div class="k form--month_assign">
                    <!-- <ejs-datetimepicker :value="month_assign" @change="onChangeDateAssign($event)" :format='"MM/yyyy"'></ejs-datetimepicker> -->
                    <ejs-datepicker class="form-control bg-none bor0 fw6 text-red"
                        placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                        :enabled="true"
                        :depth="'Year'" :showClearButton="false" v-model="month_assign"
                        :allowEdit="false"
                        @change="onChangeDateAssign($event)" 
                    />
                </div> 
            </div>
        </div>
        
        <div class="k box-form">
            <KDataGrid ref="gridDs"
                :columns ="colums"
                :allowFilter="true"
                :enable-paging-server="false"
                :dataSource="lisWorks"
                :allowPaging="true"
                :showFilter="true"
                :showColumnCheckbox="false"
                :enabledSelectFirstRow="false"
                :allowSorting="true"
                @onRowSelected="selectTask"
                :editSettings="editSettings"
                @cellSaved="cellSaved"
                @actionComplete="actionComplete"
                :commands="commands" 
                :commandColumn="{headerText: '',cellCssClass: 'css1', show: true, firstColumn:true, width:'130'}"
                @commandClicked="commandClicked"
                @rowDataBound="rowDataBound"
            />
        </div>
        
        <ejs-dialog
                ref='dialogObj'
                :allowDragging="true"
                :enableResize="false"
                :position="{X:'center', Y:'center'}"
                :visible="false"
                :showCloseIcon="true"
                width="80%"
                :header='"Cập nhật task"'
                :isModal='true'>
                <div class="modal-content popup-box">
                    <div class="popup-body">
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Dịch vụ</div>
                                <div class="value">
                                    <!-- <select2  class="select2"  v-model="taskSelected.project_id" :options="listProjects.map(e=>({id:e.project_id, text:e.project_name}))"></select2> -->
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Tên task</div>
                                <div class="value">
                                    <input type="text"  v-model="taskSelected.task_name" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Tiến độ</div>
                                <div class="value">
                                    <select2  class="select2"  v-model="taskSelected.progress_id" :options="listProgress.map(e=>({id:e.progress_id, text:e.progress_name}))"></select2>
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">BA thực hiện</div>
                                <div class="value">
                                    <select2  class="select2"  v-model="taskSelected.user_id_ba" :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày bắt đầu BA</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.start_day_ba"  @change="onChangeDatePickerModal($event,'start_day_ba')" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày kết thúc BA</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.end_day_ba" @change="onChangeDatePickerModal($event,'end_day_ba')" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Manday BA</div>
                                <div class="value">
                                    <input class="form-control" v-model="taskSelected.manday_ba" />
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Manday Dev</div>
                                <div class="value">
                                    <input class="form-control" v-model="taskSelected.manday_dev" />
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày bắt đầu Dev</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.start_day_dev" @change="onChangeDatePickerModal($event,'start_day_dev')" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày kết thúc Dev</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.end_day_dev" @change="onChangeDatePickerModal($event,'end_day_dev')" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Dev thực hiện</div>
                                <div class="value">
                                    <select2  class="select2"  v-model="taskSelected.user_id_dev" :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ghi chú</div>
                                <div class="value">
                                    <textarea class="form-control" v-model="taskSelected.note" />
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Đầu mối kinh doanh</div>
                                <div class="value">
                                    <input class="form-control" v-model="taskSelected.business_focal_point" />
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Đầu mối IT</div>
                                <div class="value">
                                    <input class="form-control" v-model="taskSelected.it_focal_point" />
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Jira</div>
                                <div class="value">
                                    <input class="form-control" v-model="taskSelected.jira" />
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row" style="padding: 6px 12px">
                            <input id="input-file" type="file" v-show="false"/>
                            <button class="k bnt-select-file" @click="onSelectImage">Chọn file</button>
                            <span class="k name-file-selected">{{fileName}}</span>
                            <span @click="deleteFile" class="bnt-delete-file"><i class="fa fa-times-circle-o" aria-hidden="true"></i></span>
                        </div>
                    </div>
                    <div class="group-buttons -bottom center">
                        <button
                            class="btn btn-outline-secondary nocorner"
                            @click="updateTaskModal" 
                            style="width: 120px"
                        >
                        <span>Cập nhật</span>
                        </button>
                    </div>
                </div>
        </ejs-dialog>
    </div>
</template>
<script>
import WorkPlanApi from './WorkPlanApi.js';
import { createApp } from "vue"
const app = createApp()
import { Query } from "@syncfusion/ej2-data";
import ActionTop from '@/components/controls/ActionTop.vue'
import moment from 'moment';
export default {
    components:{
        ActionTop
    },
    data(){
        return {
            editSettings: {
                allowEditing: true,
                mode:'Normal'
            },
            actions:[
                {
                    id:'themmoi',
                    name:'Thêm mới',
                    active: true,
                    icon_class:'icon fa fa-plus'
                },
                {
                    id:'xoa',
                    name:'Xóa',
                    active: true,
                    icon_class:'icon nc-icon-glyph ui-1_circle-remove'
                }
            ],
            lisWorks:[
            ],
            listProgress:[],
            listProjects:[],
            listUsers:[],
            //editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
            taskInsert:{
                task_id:0,
                task_name:"",
                active :1,
                project_id : 0 ,
                project_name : "",
                progress_id : 1,
                //thêm cột hiển thị
                progress_name: "",
                note : "",
                user_ba:'',
                user_id_ba:1,
                start_day_ba:moment(new Date()).format('DD/MM/YYYY'),
                end_day_ba: moment(new Date()).format('DD/MM/YYYY'),
                manday_ba:0,
                manday_dev:0,
                start_day_dev: moment(new Date()).format('DD/MM/YYYY'),
                end_day_dev: moment(new Date()).format('DD/MM/YYYY'),
                user_id_dev:0,
                progress_id: 0,
                progress_name: "",
                customer: "",
                it_focal_point:"",
                business_focal_point:""
            },
            taskSelected:{},
            visibleUpdateTask : false,
            commands:[
                {
                    name: 'editTask',
                    cssClass: 'btn btn-main -ap one-edit',
                    width: 40,
                    text: '',
                    title: 'Cập nhật',
                },
                {
                    name: 'viewTask',
                    cssClass: 'btn btn-main -ap one-file-detail',
                    width: 40,
                    text: '',
                    title: 'Chi tiết',
                },
            ],
            fileObject:{},
            fileName:"Chưa có file được chọn",
            header: {
                title: "Giao tasks",
                list: [
                ],
            },
            listWorkTypeFilter:[
                {
                    id:0, text:"Tất cả"
                },
                {
                    id:1, text:"Đã hoàn thành"
                }
                ,
                {
                    id:2, text:"Chưa hoàn thành"
                }
            ],
            workTypeFilter:0,
            month_assign: moment(new Date()).format('MM/YYYY'),
            status_id:-1,
            isEdit:true,
            listBoards:[],
            boardID:"",
            listJobtype:[],
            listWorkGroup:[],
            listSteps:[],
            listRatings:[
                {
                    "rating":"1",
                    "rating_id":1
                },
                {
                    "rating":"2",
                    "rating_id":2
                },
                {
                    "rating":"3",
                    "rating_id":3
                },
                {
                    "rating":"4",
                    "rating_id":4
                }
            ],
            listStatus:[
                {
                    id:0,
                    text:'Tạo mới'
                },
                {
                    id:1,
                    text:'Giao việc'
                },
                {
                    id:2,
                    text:'Đang thực hiện'
                },
                {
                    id:3,
                    text:'Hoàn thành'
                },
                {
                    id:4,
                    text:'Đóng'
                }
            ],
            listStatusFilter:[
                {
                    id:-1,
                    text:'Tất cả'
                },
                {
                    id:0,
                    text:'Tạo mới'
                },
                {
                    id:1,
                    text:'Giao việc'
                },
                {
                    id:2,
                    text:'Đang thực hiện'
                },
                {
                    id:3,
                    text:'Hoàn thành'
                },
                {
                    id:4,
                    text:'Đóng'
                }
            ]
        }   
    },
    computed:{
        colums(){
            return [
                // {
                //     fieldName: "row",
                //     headerText: "STT",
                //     width:'70'
                // },
                {
                    fieldName: "step_name",
                    headerText: "Step",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    // template:this.columnTemplate(this, 'step_name'),
                    editTemplate:this.columnTemplateSelect2(this, 'step_name'),
                    width:'150'
                },
                {
                    fieldName: "project_name",
                    headerText: "Dự án",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate:this.columnTemplateSelect2(this, 'project_name')
                },
                {
                    fieldName: "parent_name",
                    headerText: "Công việc cha",
                    allowFilter: true,
                    allowEditing: false,
                    width:'200'
                },
                {
                    fieldName: "task_name",
                    headerText: "Tên công việc",
                    allowFilter: true,
                    allowEditing: true,
                    width:'200'
                },
                {
                    fieldName: "description",
                    headerText: "Nội dung",
                    allowFilter: true,
                    allowEditing: true,
                    width:'300'
                },
                {
                    fieldName: "full_name",
                    headerText: "Thực hiện",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate:this.columnTemplateSelect2(this, 'full_name'),
                    width:'150'
                },
                {
                    fieldName: "statusID",
                    headerText: "Trạng thái",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate:this.columnTemplateSelect2(this, 'statusID'),
                    width:'150'
                },
                {
                    fieldName: "scheduleStartDate",
                    headerText: "Ngày bắt đầu",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "datepickeredit",
                    editTemplate:this.columnTemplateDateTime(this,'scheduleStartDate'),
                    width:'150'
                },
                {
                    fieldName: "scheduleEndDate",
                    headerText: "Ngày kết thúc",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "datepickeredit",
                    editTemplate:this.columnTemplateDateTime(this,'scheduleEndDate'),
                    width:'150'
                },
                {
                    fieldName: "work_group_name",
                    headerText: "Nhóm công việc",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate:this.columnTemplateSelect2(this, 'work_group_name')
                },
                {
                    fieldName: "jobtype_name",
                    headerText: "Loại công việc",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate:this.columnTemplateSelect2(this, 'jobtype_name')
                },
                {
                    fieldName: "rating",
                    headerText: "Đánh giá",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate:this.columnTemplateSelect2(this, 'rating')
                },
                {
                    fieldName: "JiraUrl",
                    headerText: "Jira",
                    allowFilter: true,
                    allowEditing: true,
                },
            ]
        }
    },
    methods:{
        async onActionClick(action){
            if(action.id=='themmoi'){
                this.taskInsert = {
                    task_name:"",
                    active :1,
                    project_id : 0 ,
                    project_name : "",
                    description : "",
                    scheduleEndDate:moment(new Date()).format('DD/MM/YYYY'),
                    scheduleStartDate:moment(new Date()).format('DD/MM/YYYY'),
                    full_name:"",
                    assigneeid:"",
                    jiraUrl:"",
                    jobtype_id:this.listJobtype.length>0? this.listJobtype[0].jobtype_id:"",
                    jobtype_name:this.listJobtype.length>0?this.listJobtype[0].jobtype_name:"",
                    work_group_id:this.listWorkGroup.length>0? this.listWorkGroup[0].work_group_id:"",
                    work_group_name: this.listWorkGroup.length>0? this.listWorkGroup[0].work_group_name:"",
                    step_id:"",
                    step_name:""
                }; 
                this.lisWorks.unshift(this.taskInsert);
            }
            else if(action.id=='xoa'){
                if(this.taskSelected.task_id == 0){
                    this.$toast.warning('Vui lòng chọn đối tượng muốn xóa');
                    return;
                }
                let result = await this.$confirm('Thông báo', "Bạn có chắc chắn xóa?");
                if (result==0) return;
                else{
                    try{
                        this.lisWorks=[];
                        let response = await WorkPlanApi.deleteTask(this.axios,this.taskSelected.task_id,this.status_id,this.month_assign)
                        if(response.data.success){
                            this.$toast.success(response.data.message);
                            this.loading(false);
                            this.lisWorks=response.data.data;
                        }
                        else{
                            this.$toast.error(response.data.message);
                            this.loading(false);
                        }
                    }catch(e){
                        this.$toast.error(e.message);
                        this.loading(false);
                    }
                }
            }

        },
        actionComplete(args){
            // console.log('actionComplete',args)
            //this.lisWork=this.lisWork.concat([])
            //actionComplete save
            
            if(args.requestType== "save"){
                //Gắn các cột text, datepicker lại data list
                // const index=this.lisWorks.findIndex(x=>x.task_id==args.data.task_id);
                // this.lisWorks[index].task_name=args.data.task_name;
                // //this.lisWorks[index].step_name=args.data.step_name;
                // // this.lisWorks[index].project_name=args.data.project_name;
                // this.lisWorks[index].description=args.data.description;
                // this.lisWorks[index].assignName=args.data.assignName;
                // this.lisWorks[index].jiraUrl=args.data.jiraUrl;
                // //this.lisWorks[index].work_group_name=args.data.work_group_name;
                // //this.lisWorks[index].jobtype_name=args.data.jobtype_name;
                // //Lấy data này cập nhật hoặc insert
                // var dataCN= Object.assign({}, this.lisWorks[index]); 
                // this.lisWorks=this.lisWorks.concat([]);
                // this.updateTask(dataCN);
            }
        },
        cellSaved(args){
            // console.log('cellSaved1', args)
            //check insert lại dữ liệu lisWork
        },
        changeSelect2Value(item, type, value){
            if(type=='full_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].assigneeid=value.id
                    this.lisWorks[index].assignName=value.text
                }
            }
            else 
            if(type=='project_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].project_id= value.id
                    this.lisWorks[index].project_name=value.text
                }
            }
            else if(type=='work_group_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].work_group_id = value.id
                    this.lisWorks[index].work_group_name = value.text
                    this.listJobtype= this.listJobtypeBK.filter(m=> m.work_group_id == value.id);
                    // if(this.listJobtype.length>0){
                    //     this.lisWorks[index].jobtype_id = this.listJobtype[0].jobtype_id;
                    //     this.lisWorks[index].jobtype_name = this.listJobtype[0].jobtype_name;
                    //     console.log('this.lisWorks[index].jobtype_id',this.lisWorks[index].jobtype_id)
                    // }
                    
                }
                
            }
            else if(type=='jobtype_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].jobtype_id=value.id
                    this.lisWorks[index].jobtype_name=value.text
                }
            }
            else if(type=='rating'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].rating=value.id
                    // this.lisWorks[index].rating_name=value.text
                }
            }
            else if(type=='step_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].step_id=value.id
                    this.lisWorks[index].step_name=value.text
                }
            }
            else if(type=='statusID'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].statusID=value.id
                }
            }
        },
        onChangeDatePicker(item, type, value){
            const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id);
            if(index>-1){
                this.lisWorks[index][type]=value;
            }
        },
        async commandClicked(cmdName, rowData){
          if(cmdName=='editTask'){
             this.$refs.dialogObj.show();
          }
          else if(cmdName == "viewTask"){
            this.$router.push({name:'task_detail',params:{id:this.taskSelected.task_id}});
          }
        },
        columnTemplateSelect2(parent,type) {
            return function () {
                return {
                    template: app.component("columnTemplateSelect2", {
                        template: ` <select2 :z-index="2000" class="select2" @select="onChangeSelect2Value" v-model="cp_value" :options="cp_items"></select2>`,
                        data() {
                            return {
                                parent: parent,
                                data: {},
                                list:[], 
                            }
                        },
                        computed: {
                            cp_value(){         
                                if(type == 'work_group_name'){
                                    return this.data['work_group_id']
                                }
                                if(type == 'jobtype_name'){
                                    return this.data['jobtype_id']
                                }   
                                if(type == 'full_name'){
                                    return this.data['account_id']
                                }         
                                if(type == 'project_name'){
                                    return this.data['project_id']
                                }         
                                if(type == 'step_name'){
                                    return this.data['step_id']
                                }               
                                if(type == 'rating'){
                                    return this.data['rating_id']
                                }               
                                if(type == 'statusID'){
                                    return this.data['statusID']
                                }               
                                return this.data[type]
                            },
                            cp_items(){
                                var items = [];
                                if (type == 'work_group_name') {
                                    items = this.parent.listWorkGroup && this.parent.listWorkGroup.length > 0 ? this.parent.listWorkGroup.map(e=>({id:e.work_group_id, text:e.work_group_name})) : []
                                }else
                                if (type == 'jobtype_name') {
                                    items = this.parent.listJobtype && this.parent.listJobtype.length > 0 ? this.parent.listJobtype.map(e=>({id:e.jobtype_id, text:e.jobtype_name})) : []
                                }else
                                if (type == 'full_name') {
                                    items = this.parent.listUsers && this.parent.listUsers.length > 0 ? this.parent.listUsers.map(e=>({id:e.account_id, text:e.full_name})) : []
                                }else
                                if (type == 'step_name') {
                                    items = this.parent.listSteps && this.parent.listSteps.length > 0 ? this.parent.listSteps.map(e=>({id:e.step_id, text:e.step_name})) : []
                                }
                                else if(type == 'project_name'){
                                    items = this.parent.listProjects && this.parent.listProjects.length > 0 ? this.parent.listProjects.map(e=>({id:e.project_id, text:e.project_name})) : []
                                }
                                else if(type == 'rating'){
                                    items = this.parent.listRatings && this.parent.listRatings.length > 0 ? this.parent.listRatings.map(e=>({id:e.rating_id, text:e.rating})) : []
                                }
                                else if(type == 'statusID'){
                                    items = this.parent.listStatus && this.parent.listStatus.length > 0 ? this.parent.listStatus.map(e=>({id:e.id, text:e.text})) : []
                                }
                                return items
                            },
                        },
                        methods: {
                            onChangeSelect2Value(e) {
                                this.parent.changeSelect2Value(this.data, type, {
                                    id:e.id,
                                    text:e.text
                                })
                               
                            },

                        }
                    })
                }
            }
        },
        columnTemplate(parent,type){
            return function () {
                return {
                    template: app.component("columnTemplateSelect2", {
                        template: '<span class="bold" :class="color">{{data.progress_name}}</span>',
                        data() {
                            return {
                                parent: parent,
                                data: {},
                            }
                        },
                        computed: {
                            color(){
                                if(this.data['progress_id']==7||this.data['progress_id']==1||this.data['progress_id']==2){
                                    //Hủy
                                    return 'red'
                                }else if(this.data['progress_id']==3||this.data['progress_id']==6||this.data['progress_id']==5){
                                    return 'green'
                                }else if(this.data['progress_id']==4){
                                    return 'blue'
                                }
                                return 'black'
                            },
                        },
                    })
                }
            }
        },
        columnTemplateDateTime(parent,type) {
            return function () {
                return {
                    template: app.component("columnTemplateSelect2", {
                        template: `<ejs-datepicker :value="cp_value" @change="onChangeDatePicker" :firstDayOfWeek="1" :format='dateFormat'></ejs-datepicker>`,
                        data() {
                            return {
                                dateFormat:'dd/MM/yyyy',
                                data:{},
                                parent:parent
                            }
                        },
                        computed: {
                            cp_value(){                
                                return this.data[type]
                            },
                        },
                        methods: {
                            onChangeDatePicker(event) {
                                // console.log('onChangeDatePicker eve', event.value)
                                if(!event.value){
                                    this.parent.onChangeDatePicker(this.data, type, null)
                                    return
                                }
                                this.parent.onChangeDatePicker(this.data, type, moment(event.value).format('DD/MM/YYYY'))
                            },

                        }
                    })
                }
            }
        },
        async getProjects(){
            try{
                this.listProjects = [];
				let response = await WorkPlanApi.getProjects(this.axios)
				if(response.data.success){
					this.listProjects=response.data.data;
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async checkPermissionTask(){
            try{
				let response = await WorkPlanApi.checkPermissionTask(this.axios)
				if(response.data.success &&  response.data.data){
					this.editSettings = {
                        allowEditing: true,
                        mode:'Normal'
                    };
                    this.isEdit = false;
				}
				else{
                    this.isEdit = true;
                    this.editSettings = {
                        allowEditing: false,
                        mode:'Normal'
                    };
                    // khoa them moi, xoa task
                    this.actions.forEach(element => {
                        element.active = false;
                    });
                    // khoa edit task
                    // this.commands.find(m=> m.name == "editTask").
					// this.$toast.warning(response.data.message);
                    this.loading(false);
				}
                this.getTasks();
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
                this.isEdit = true;
                this.getTasks();
			}
        },
        async getUsers(){
            try{
                this.listUsers = [

                ];
				let response = await WorkPlanApi.getUsersTask(this.axios,this.boardID)
				if(response.data.success){
                    var temp = [];
					this.listUsers =  temp.concat( response.data.data);
                    // this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    // this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                // this.loading(false);
			}
        },
        async updateTask(data){
            try{

				let response = await WorkPlanApi.updateTask(this.axios,data,this.status_id,this.month_assign);
                this.lisWorks= [];
				if(response.data.success){
                    this.loading(false);
                    this.lisWorks=response.data.data;
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async getProgress(){
            try{
                this.listUsers = [];
				let response = await WorkPlanApi.getProgress(this.axios)
				if(response.data.success){
					this.listProgress=response.data.data;
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        selectTask(data){
            this.taskSelected = data;
            // this.fileName = data.file_name == null?"Chưa có file được chọn":data.file_name;
            // console.log(this.taskSelected)
        },
        onSelectImage(){
            var self = this;
            $('#input-file').click();
            $("#input-file").change(function (event) {
                self.readFile(event);
            });
        },
        readFile(event){
            var self= this;
            if(event.target.files[0]==null){
                   self.$toast.warning("Please select a image");
                return;
            }
            else{
                self.fileObject = event.target.files[0];
                self.fileName= event.target.files[0].name;
                
                var reader = new FileReader();
                reader.onload = function (e) {
                    self.imageAuto = e.target.result;
                    // $(".img-preview").css("background-image", "url(" + e.target.result + ")");
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        },
        deleteFile(){
            $('#input-file').val();
            this.fileObject = {};
            this.fileName = "Chưa có file được chọn";
        },
        async updateTaskModal(){
            try{
                var task = new FormData();
                task.append("task_id",this.taskSelected.task_id);
                task.append("project_id",this.taskSelected.project_id);
                task.append("task_name",this.taskSelected.task_name);
                
                task.append("customer",this.taskSelected.customer);
               
                if(this.taskSelected.progress_id){
                   task.append("progress_id",this.taskSelected.progress_id);
                }

                if(this.taskSelected.user_id_ba){
                    task.append("user_id_ba",this.taskSelected.user_id_ba);
                }
                if(this.taskSelected.user_id_dev){
                    task.append("user_id_dev",this.taskSelected.user_id_dev);
                }
                
                if(this.taskSelected.start_day_ba){
                    task.append("start_day_ba",this.taskSelected.start_day_ba);
                }
                if(this.taskSelected.end_day_ba){
                    task.append("end_day_ba",this.taskSelected.end_day_ba);
                }
                if(this.taskSelected.start_day_dev){
                    task.append("start_day_dev",this.taskSelected.start_day_dev);
                }
                if(this.taskSelected.end_day_dev){
                    task.append("end_day_dev",this.taskSelected.end_day_dev);
                }
                if(this.taskSelected.manday_ba){
                    task.append("manday_ba",this.taskSelected.manday_ba);
                }
                if(this.taskSelected.manday_dev){
                    task.append("manday_dev",this.taskSelected.manday_dev);
                } 
                if(this.taskSelected.note){
                    task.append("note",this.taskSelected.note);
                }
                if(this.taskSelected.jira){
                    task.append("jira",this.taskSelected.jira);
                }
                if(this.taskSelected.it_focal_point){
                    task.append("it_focal_point",this.taskSelected.it_focal_point);
                }
                if(this.taskSelected.business_focal_point){
                    task.append("business_focal_point",this.taskSelected.business_focal_point);
                }
                if(this.fileObject != null){
                    task.append("file",this.fileObject);
                }
				let response = await WorkPlanApi.updateTaskModal(this.axios,task,{ headers: { 'Content-Type': 'multipart/form-data'}},this.workTypeFilter,this.month_assign);
                this.lisWork= [];
				if(response.data.success){
                    this.loading(false);
                    this.$toast.success(response.data.message);
                    this.lisWork=response.data.data;
                    this.$refs.dialogObj.hide();
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        onChangeDatePickerModal(event,type) {
            if(!event.value){
                //this.taskSelected.start_day_ba = null
                return
            }
            switch(type){
                case "scheduleStartDate":
                    this.taskSelected.scheduleStartDate = moment(event.value).format('DD/MM/YYYY');
                    // this.taskSelected.manday_ba = this.taskSelected.endt_day_ba - this.taskSelected.start_day_ba;
                    break;
                case "scheduleEndDate":
                    this.taskSelected.scheduleEndDate = moment(event.value).format('DD/MM/YYYY');  
                    // const oneDay = 24 * 60 * 60 * 1000;
                    // this.taskSelected.manday_ba = (moment(event.value).toDate() - moment(this.taskSelected.start_day_ba,'DD/MM/YYYY').toDate()) /oneDay;

                    // console.log('sub',this.taskSelected)
                    break;
                // case "start_day_dev":
                //     this.taskSelected.start_day_dev = moment(event.value).format('DD/MM/YYYY');  
                //     break;
                // case "end_day_dev":
                //     this.taskSelected.end_day_dev = moment(event.value).format('DD/MM/YYYY');  
                //     break;
            }
           
            
        },
        onChangeDateAssign(event){
            this.month_assign =  moment(event.value).format('MM/YYYY');
            this.getListWork();
        },
        onChangeWorkType(){
            this.getListWork();
        },
        rowDataBound(args){
            //Lưu ý cho chạy cái checkPermissionTask đầu tiên sau đó mới chạyload dữ liệu chạy hàm lấy biến cờ check
            if(this.isEdit){
                args.row.cells[1].children[0].children[0].classList.add('hide-command')
            }else{
                args.row.cells[1].children[0].children[0].classList.remove('hide-command')
            }
            // console.log('args.data', args.data)
            //check tô màu row gần hạn, quá hạn
            if(args.data['progress_id']==2){
                if(args.data['end_day_ba']&&moment(args.data['end_day_ba'],'DD/MM/YYYY').isBefore(moment())){
                    args.row.classList.remove('e-altrow')
                    args.row.classList.add('color-thoi-gian-qua-han')
                }
                // else if(args.data['end_day_ba']&&moment(args.data['end_day_ba'],'DD/MM/YYYY').isBefore(moment().subtract(2, "days"))){
                //     args.row.classList.remove('e-altrow')
                //     args.row.classList.add('color-thoi-gian-gan-han')
                // }
            }else if(args.data['progress_id']==4){
                if(args.data['end_day_dev']&&moment(args.data['end_day_dev'],'DD/MM/YYYY').isBefore(moment())){
                    args.row.classList.remove('e-altrow')
                    args.row.classList.add('color-thoi-gian-qua-han')
                }
                // if(args.data['end_day_dev']&&moment(args.data['end_day_dev'],'DD/MM/YYYY').isBefore(moment().subtract(1, "days"))){
                //     args.row.classList.remove('e-altrow')
                //     args.row.classList.add('color-thoi-gian-gan-han')
                // }
            }
        },
        async getBoards(){
            try{
                this.listBoards = [];
				let response = await WorkPlanApi.getBoards(this.axios)
				if(response.data.success){
					this.listBoards=response.data.data;
                    
                    if(this.listBoards.length>0){
                        this.boardID = this.listBoards[0].id;
                        this.getListWork();
                        this.getUsers();
                        this.getSteps();
                    }
                    else{
                        this.loading(false);
                    }
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async getListWork(){
            try{
                this.lisWorks = [];
				let response = await WorkPlanApi.getListWork(this.axios,this.boardID,this.status_id,this.month_assign)
				if(response.data.success){
					this.lisWorks=response.data.data;
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        onChangeBoard(){
            this.loading(true);
            this.getListWork();
            this.getUsers();
            this.getSteps();
        },
        async getJobTypes(){
            // try{
                this.listJobtype = [];
                this.listJobtypeBK = [];
				let response = await WorkPlanApi.getJobTypes(this.axios)
				if(response.data.success){
					// this.listJobtype= [].concat(response.data.data);
                    this.listJobtypeBK = [].concat(response.data.data);
                    if(this.listJobtypeBK.length>0){
                        this.listJobtype = [].concat(response.data.data).filter(m=>m.work_group_id == this.listWorkGroup[0].work_group_id);
                    }
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			// }catch(e){
			// 	this.$toast.error(e.message);
            //     this.loading(false);
			// }
        },
        async getWork_Groups(){
            try{
				let response = await WorkPlanApi.getWork_Groups(this.axios)
				if(response.data.success){
					this.listWorkGroup=response.data.data;
                    this.getJobTypes();
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async getSteps(){
            try{
                this.listSteps = [];
				let response = await WorkPlanApi.getSteps(this.axios,this.boardID)
				if(response.data.success){
					this.listSteps=response.data.data;
                    console.log('this.listSteps',this.listSteps)
                    // this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        disableEnterKey(event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        }
    },
    created(){
         this.getProjects();
        this.getBoards();
        this.getWork_Groups();
    }
}
</script>
<style src="./WorkPlan.css" scoped></style>