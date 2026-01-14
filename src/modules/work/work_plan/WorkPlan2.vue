<template>
    <div class="main-wrapper">
        <!-- <breadcrumb :header="header" /> -->
        <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
        <div class="page-content" style="bottom: 40px !important; top:40px !important; padding:7px !important;">
            <div class="box-form">
                <KDataGrid ref="gridDs"
                    :columns ="colums"
                    :allowFilter="true"
                    :enable-paging-server="false"
                    :dataSource="lisWorks"
                    :allowPaging="true"
                    :showFilter="false"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                    @onRowSelected="selectTask"
                    @actionComplete="actionComplete"
                    :commands="commands" 
                    :commandColumn="{headerText: '',cellCssClass: 'css1', show: true, firstColumn:true, width:'100'}"
                    @commandClicked="commandClicked"
                />
            </div>
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
                                <div class="key w120">Dự án</div>
                                <div class="value">
                                    <select2  class="select2"  v-model="taskSelected.project_id" :options="listProjects.map(e=>({id:e.project_id, text:e.project_name}))"></select2>
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
                                    <ejs-datetimepicker :value="taskSelected.start_day_ba" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày kết thúc BA</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.end_day_ba" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Manday BA</div>
                                <div class="value">
                                    <input class="form-control" :v-model="taskSelected.manday_ba" />
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Manday Dev</div>
                                <div class="value">
                                    <input class="form-control" :v-model="taskSelected.manday_dev" />
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row">
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày bắt đầu Dev</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.start_day_dev" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
                                </div>
                            </div>
                            <div class="info-row col-lg-6">
                                <div class="key w120">Ngày kết thúc Dev</div>
                                <div class="value">
                                    <ejs-datetimepicker :value="taskSelected.end_day_dev" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
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
                                    <input class="form-control" v-model="taskSelected.note" />
                                </div>
                            </div>
                        </div>
                        <div class="box-form col-lg-12 row" style="padding: 6px 12px;!importain">
                            <input id="input-file" type="file" v-show="false"/>
                            <button class="k bnt-select-file" @click="onSelectImage">Chọn file</button>
                            <span class="k name-file-selected">{{fileName}}</span>
                            <span @click="deleteFile" class="bnt-delete-file"><i class="fa fa-times-circle-o" aria-hidden="true"></i></span>
                        </div>
                    </div>
                    <div class="group-buttons -bottom center">
                        <button
                            class="btn btn-outline-secondary nocorner"
                            @click="clickOK"
                            style="width: 120px"
                        >
                        <span></span>Cập nhật
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
import ActionTop from '@/components/controls/ActionTop.vue'
import moment from 'moment';
export default {
    components:{
        ActionTop
    },
    data(){
        return {
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
            colums:[
                {
                    fieldName: "row",
                    headerText: "STT",
                    width:'100'
                },
                {
                    fieldName: "project_name",
                    headerText: "Dự án",
                    allowFilter: true,
                    template:this.columnTemplateSelect2(this, 'project_name')
                },
                {
                    fieldName: "task_name",
                    headerText: "Tên công việc",
                    allowFilter: true,
                    allowEditing: true,
                   // editTemplate:this.columnTemplateInput(this,'task_name')

                },
                {
                    fieldName: "progress_name",
                    headerText: "Tiến độ",
                    allowFilter: true,
                    template:this.columnTemplateSelect2(this, 'progress_name')
                },
                {
                    fieldName: "full_name_ba",
                    headerText: "BA thực hiện",
                    allowFilter: true,
                    allowEditing: true,
                    template:this.columnTemplateSelect2(this, 'full_name_ba')
                },
                {
                    fieldName: "start_day_ba",
                    headerText: "Ngày bắt đầu BA",
                    allowFilter: true,
                    template:this.columnTemplateDateTime(this,'start_day_ba')
                },
                {
                    fieldName: "end_day_ba",
                    headerText: "Ngày hoàn thành BA",
                    allowFilter: true,
                    template:this.columnTemplateDateTime(this,'end_day_ba')
                },
                {
                    fieldName: "manday_ba",
                    headerText: "Manday BA",
                    allowFilter: true,
                    allowEditing: true,
                },
                {
                    fieldName: "full_name_dev",
                    headerText: "Dev thực hiện",
                    allowFilter: true,
                    template:this.columnTemplateSelect2(this, 'full_name_dev')
                    
                },
                {
                    fieldName: "start_day_dev",
                    headerText: "Ngày bắt đầu Dev",
                    allowFilter: true,
                    template:this.columnTemplateDateTime(this,'start_day_dev')
                    
                },
                {
                    fieldName: "end_day_dev",
                    headerText: "Ngày kết thúc Dev",
                    template:this.columnTemplateDateTime(this,'end_day_dev')
                    
                },
                {
                    fieldName: "manday_dev",
                    headerText: "Manday Dev",
                    allowFilter: true,
                    allowEditing: true,
                    
                },
                {
                    fieldName: "note",
                    headerText: "Ghi chú",
                    allowFilter: true,
                    allowEditing: true,
                    
                }
            ],
            lisWorks:[],
            listProgress:[],
            listProjects:[],
            listUsers:[],
            taskInsert:{
                task_id:0,
                task_name:"",
                active :1,
                project_id : 0 ,
                project_name : "",
                progress_id : 0,
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
                progress_name: ""
            },
            taskSelected:{},
            visibleUpdateTask : false,
            commands:[
                {
                    name: 'quanlyrolemenu',
                    cssClass: 'btn btn-main -ap one-file-attach',
                    width: 40,
                    text: '',
                    title: 'Quản lý Role & Menu',
                },
            ],
            fileObject:{},
            fileName:"Chưa có file được chọn"
        }
    },
    methods:{
        onActionClick(action){
            if(action.id=='themmoi'){
                let dataMau=Object.assign({}, this.taskInsert)
                this.lisWorks.unshift(this.taskInsert)
            }
        },
        actionComplete(args){
            if(args.requestType== "save"){
                console.log('actionCompleteData', args.data)
                //Gắn các cột text, datepicker lại data list
                const index=this.lisWorks.findIndex(x=>x.task_id==args.data.task_id)
                this.lisWorks[index].task_name=args.data.task_name;
                this.lisWorks[index].manday_ba=args.data.manday_ba;
                this.lisWorks[index].manday_dev=args.data.manday_dev;
                this.lisWorks[index].note=args.data.note;

                if(args.data.start_day_ba&&args.data.start_day_ba!=''){
                    this.lisWorks[index].start_day_ba=args.data.start_day_ba?moment(args.data.start_day_ba).format('DD/MM/YYYY'):null
                }
                if(args.data.end_day_ba&&args.data.end_day_ba!=''){
                    this.lisWorks[index].end_day_ba=args.data.end_day_ba?moment(args.data.end_day_ba).format('DD/MM/YYYY'):null
                }
                if(args.data.start_day_dev&&args.data.start_day_dev!=''){
                    this.lisWorks[index].start_day_dev=args.data.start_day_dev?moment(args.data.start_day_dev).format('DD/MM/YYYY'):null
                }
                if(args.data.end_day_dev&&args.data.end_day_dev!=''){
                    this.lisWorks[index].end_day_dev=args.data.end_day_dev?moment(args.data.end_day_dev).format('DD/MM/YYYY'):null
                }
               

                //Lấy data này cập nhật hoặc insert
                var dataCN= Object.assign({}, this.lisWorks[index]); 
                this.lisWorks=this.lisWorks.concat([])
                //Lưu nội dung row xuống DB
                // console.log('dataCN', dataCN);
                dataCN.start_day_ba = moment(dataCN.start_day_ba).format('DD/MM/YYYY').toString();
                this.insertTask(dataCN);
            }
        },

        changeSelect2Value(item, type, value){
            // console.log(item)
            if(type=='progress_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].progress_id=Number(value.id)
                    this.lisWorks[index].progress_name=value.text
                }
                // console.log('changeSelect2Value', index)
            }
            else if(type=='project_name'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].project_id=Number(value.id)
                    this.lisWorks[index].project_name=value.text
                }
                // console.log('changeSelect2Value', index)
            }
            else if(type=='full_name_ba'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].user_id_ba = Number(value.id)
                    this.lisWorks[index].full_name_ba=value.text
                }
                // console.log('changeSelect2Value', index)
            }
            else if(type=='full_name_dev'){
                const index=this.lisWorks.findIndex(x=>x.task_id==item.task_id)
                if(index>-1){
                    this.lisWorks[index].user_id_dev=Number(value.id)
                    this.lisWorks[index].full_name_dev=value.text
                }
                // console.log('changeSelect2Value', index)
            }
        },
        onChangeDatePicker(item, type, value){
            console.log('onChangeDatePicker', value)
        },
        async commandClicked(cmdName, rowData){
          if(cmdName=='quanlyrolemenu'){
             this.$refs.dialogObj.show();
          }
        },
        columnTemplateSelect2(parent,type) {
            return function () {
                return {
                    template: app.component("columnTemplateSelect2", {
                        template: `<select2 :z-index="2000" class="select2" @select="onChangeSelect2Value" v-model="cp_value" :options="cp_items"></select2>`,
                        data() {
                            return {
                                parent: parent,
                                data: {},
                                list:[],
                                
                            }
                        },
                        computed: {
                            cp_value(){         
                                if(type == 'progress_name'){
                                    return this.data['progress_id']
                                }
                                if(type == 'project_name'){
                                    return this.data['project_id']
                                }   
                                if(type == 'full_name_ba'){
                                    return this.data['user_id_ba']
                                }         
                                if(type == 'full_name_dev'){
                                    return this.data['user_id_dev']
                                }         
                                return this.data[type]
                            },
                            cp_items(){
                                var items = [];
                                if (type == 'project_name') {
                                    items = this.parent.listProjects && this.parent.listProjects.length > 0 ? this.parent.listProjects.map(e=>({id:e.project_id, text:e.project_name})) : []
                                }
                                if (type == 'full_name_ba') {
                                    items = this.parent.listUsers && this.parent.listUsers.length > 0 ? this.parent.listUsers.map(e=>({id:e.user_id, text:e.full_name})) : []
                                }
                                if (type == 'full_name_dev') {
                                    items = this.parent.listUsers && this.parent.listUsers.length > 0 ? this.parent.listUsers.map(e=>({id:e.user_id, text:e.full_name})) : []
                                }
                                else if(type == 'progress_name'){
                                    items = this.parent.listProgress.map(e=>({id:e.progress_id, text:e.progress_name}))
                                }
                                // else if(type == 'user_ba'){
                                //     items = this.parent.listUsers && this.parent.listUsers.length > 0 ? this.parent.listUsers.map(e=>({id:e.user_id, text:e.username})) : []
                                // }
                                // else if(type == 'user_dev'){
                                //     items = this.parent.listUsers && this.parent.listUsers.length > 0 ? this.parent.listUsers.map(e=>({id:e.user_id, text:e.username})) : []
                                // }
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
        columnTemplateDateTime(parent,type) {
            return function () {
                return {
                    template: app.component("columnTemplateSelect2", {
                        template: `<ejs-datetimepicker :value="cp_value" @change="onChangeDatePicker" :firstDayOfWeek="1" :format='dateFormat'></ejs-datetimepicker>`,
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
                                console.log(e)
                                if(event.value){
                                    this.parent.onChangeDatePicker(this.data, type, '')
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
        async getUsers(){
            try{
                this.listUsers = [];
				let response = await WorkPlanApi.getUsers(this.axios)
				if(response.data.success){
					this.listUsers=response.data.data;
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
        async insertTask(data){
            try{
                data.manday_ba = parseInt(data.manday_ba );
                data.manday_dev = parseInt(data.manday_dev );
                 console.log('khanh test insert', data);
				let response = await WorkPlanApi.updateTask(this.axios,data)
				if(response.data.success){
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
        async getTasks(){
            try{
                this.listUsers = [];
				let response = await WorkPlanApi.getTasks(this.axios)
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
    },
    created(){
        this.getProjects();
        this.getUsers();
        this.getTasks();
        this.getProgress();
    }
}
</script>
<style src="./WorkPlan.css" scoped></style>