<template>
    <div class="k main-wrapper">
        <breadcrumb :header="header" />
        <div class="k main-form">
            <div class="k box-form">
                    <div class="k info-row col-lg-3">
                        <div class="k title-filter">Dự án:</div>
                        <div class="k select-pj">
                            <select2  class="select2"  v-model="listProjects.value" @select="onChangeProject"
                                :options="listProjects.Items && listProjects.Items.length > 0 ? listProjects.Items.map(e=>({id:e.project_id, text:e.project_name})) : []">
                            </select2>
                        </div>
                    </div>
                    <div class="k info-row col-lg-3">
                        <div class="k title-filter">Tháng:</div>
                        <div class="k select-pj">
                            <!-- <ejs-datetimepicker :value="thang" :format='"MM/yyyy"' @change="onChangeThang"></ejs-datetimepicker> -->
                            <ejs-datepicker class="form-control bg-none bor0 fw6 text-red"
                                placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                                :enabled="true"
                                :depth="'Year'" :showClearButton="false" v-model="thang"
                                :allowEdit="false"
                                @change="onChangeThang($event)" 
                            />
                        </div>
                    </div>
            </div>
            <div class="k card-item">
                <div class="k item-chart">
                    <ejs-circulargauge style='display:block' align='center' :title='chart1.title' :titleStyle='axes.titleStyle' :centerY='axes.centerY'>
                        <e-axes>
                            <e-axis :key="chart1.key" :radius='axes.gaugeRadius' :startAngle='axes.startAngle' minimum=0 :maximum='tong_cong > 0 ? tong_cong : 1' :endAngle='axes.endAngle' :majorTicks='axes.majorTicks' :lineStyle='axes.lineStyle' :minorTicks='axes.minorTicks' :labelStyle='axes.labelStyle' :annotations='chart1.annotations' :ranges='axes.ranges'>
                                <e-pointers>
                                    <e-pointer :type='chart1.type' :value='tong_cong' :radius='chart1.pointerRadius' :markerShape='chart1.markerShape' :imageUrl='chart1.imageUrl' :markerWidth='chart1.markerWidth' :markerHeight='chart1.markerHeight' :animation='chart1.animation'>
                                    </e-pointer>
                                </e-pointers>
                            </e-axis>
                        </e-axes>
                    </ejs-circulargauge>
                </div>
                 <div class="k item-chart">
                    <ejs-circulargauge style='display:block' align='center' :title='chart2.title' :titleStyle='axes.titleStyle' :centerY='axes.centerY'>
                        <e-axes>
                            <e-axis :key="chart2.key" :radius='axes.gaugeRadius' :startAngle='axes.startAngle' minimum=0 :maximum='tong_cong > 0 ? tong_cong : 1' :endAngle='axes.endAngle' :majorTicks='axes.majorTicks' :lineStyle='axes.lineStyle' :minorTicks='axes.minorTicks' :labelStyle='axes.labelStyle' :annotations='chart2.annotations' :ranges='axes.ranges'>
                                <e-pointers>
                                    <e-pointer :type='chart2.type' :value='dang_thuc_hien' :radius='chart2.pointerRadius' :markerShape='chart2.markerShape' :imageUrl='chart2.imageUrl' :markerWidth='chart2.markerWidth' :markerHeight='chart2.markerHeight' :animation='chart2.animation'>
                                    </e-pointer>
                                </e-pointers>
                            </e-axis>
                        </e-axes>
                    </ejs-circulargauge>
                </div>
                 <div class="k item-chart">
                    <ejs-circulargauge style='display:block' align='center' :title='chart3.title' :titleStyle='axes.titleStyle' :centerY='axes.centerY'>
                        <e-axes>
                            <e-axis :key="chart3.key" :radius='axes.gaugeRadius' :startAngle='axes.startAngle' minimum=0 :maximum='tong_cong > 0 ? tong_cong : 1' :endAngle='axes.endAngle' :majorTicks='axes.majorTicks' :lineStyle='axes.lineStyle' :minorTicks='axes.minorTicks' :labelStyle='axes.labelStyle' :annotations='chart3.annotations' :ranges='axes.ranges'>
                                <e-pointers>
                                    <e-pointer :type='chart3.type' :value='qua_han_chua_hoan_thanh' :radius='chart3.pointerRadius' :markerShape='chart3.markerShape' :imageUrl='chart3.imageUrl' :markerWidth='chart3.markerWidth' :markerHeight='chart3.markerHeight' :animation='chart3.animation'>
                                    </e-pointer>
                                </e-pointers>
                            </e-axis>
                        </e-axes>
                    </ejs-circulargauge>
                </div>
                 <div class="k item-chart">
                    <ejs-circulargauge style='display:block' align='center' :title='chart4.title' :titleStyle='axes.titleStyle' :centerY='axes.centerY'>
                        <e-axes>
                            <e-axis :key="chart4.key" :radius='axes.gaugeRadius' :startAngle='axes.startAngle' minimum=0 :maximum='tong_cong > 0 ? tong_cong : 1' :endAngle='axes.endAngle' :majorTicks='axes.majorTicks' :lineStyle='axes.lineStyle' :minorTicks='axes.minorTicks' :labelStyle='axes.labelStyle' :annotations='chart4.annotations' :ranges='axes.ranges'>
                                <e-pointers>
                                    <e-pointer :type='chart4.type' :value='da_hoan_thanh' :radius='chart4.pointerRadius' :markerShape='chart4.markerShape' :imageUrl='chart4.imageUrl' :markerWidth='chart4.markerWidth' :markerHeight='chart4.markerHeight' :animation='chart4.animation'>
                                    </e-pointer>
                                </e-pointers>
                            </e-axis>
                        </e-axes>
                    </ejs-circulargauge>
                </div>
                <div class="k item-chart">
                    <ejs-circulargauge style='display:block' align='center' :title='chart5.title' :titleStyle='axes.titleStyle' :centerY='axes.centerY'>
                        <e-axes>
                            <e-axis :key="chart5.key" :radius='axes.gaugeRadius' :startAngle='axes.startAngle' minimum=0 :maximum='tong_cong > 0 ? tong_cong : 1' :endAngle='axes.endAngle' :majorTicks='axes.majorTicks' :lineStyle='axes.lineStyle' :minorTicks='axes.minorTicks' :labelStyle='axes.labelStyle' :annotations='chart5.annotations' :ranges='axes.ranges'>
                                <e-pointers>
                                    <e-pointer :type='chart5.type' :value='da_hoan_thanh' :radius='chart5.pointerRadius' :markerShape='chart5.markerShape' :imageUrl='chart5.imageUrl' :markerWidth='chart5.markerWidth' :markerHeight='chart5.markerHeight' :animation='chart5.animation'>
                                    </e-pointer>
                                </e-pointers>
                            </e-axis>
                        </e-axes>
                    </ejs-circulargauge>
                </div>
            </div>
            <span class="k title-header">THỐNG KÊ CÔNG VIỆC THEO NGƯỜI DÙNG</span>
            <div class="k card-item">
                <KDataGrid  :columns ="grid_chitiet.columns"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "grid_chitiet.list"
                    :allowPaging="true"
                    :showFilter="true"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                    @recordClick="selectReport"
                />
            </div>

            <span class="k title-header">THỐNG KÊ CHI TIẾT CÔNG VIỆC</span>
            <div class="k card-item">
                <KDataGrid  :columns ="columnsDetails"  :allowFilter="true"  :enable-paging-server="false" :dataSource="listDetailReport"
                    :allowPaging="true"
                    :showFilter="true"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                />
            </div>

        </div>
    </div>
</template>
<style src="./Dashboard.css" scoped></style>
<script>
import DashboardApi from './DashboardAPI.js';
import { createApp } from "vue"
const app = createApp()
import { Query } from "@syncfusion/ej2-data";
import ActionTop from '@/components/controls/ActionTop.vue'
import moment from 'moment';

import { CircularGaugePlugin, Gradient, Annotations } from "@syncfusion/ej2-vue-circulargauge";
app.component(CircularGaugePlugin);

export default {
    components:{
        ActionTop
    },
    provide: {
        circulargauge: [Gradient, Annotations]
    },
    data(){
        var rangeLinearGradient = {
          startValue: '0%', endValue: '100%',
          colorStop: [
            { color: '#9E40DC', offset: '0%', opacity: 0.9 },
            { color: '#E63B86', offset: '70%', opacity: 0.9 }]
        }
        return {
            header: {
                title: "Dashboard",
                list: [
                ],
            },
            actions:[
                {
                    id:'refresh',
                    name:'Lấy TT',
                    active: true,
                    icon_class:'icon fa fa-refresh'
                }
            ],

            axes: {                
                titleStyle: {
                    size: '18px'
                },
                centerY: '57%',
                gaugeRadius: '90%',
                startAngle: 270,
                endAngle: 90,
                majorTicks: {
                    width: 0,
                },
                lineStyle: {
                    width: 0
                },
                minorTicks: {
                    width: 0,
                },
                labelStyle: {
                    font: {
                        size: '0px'
                    }
                },                
                ranges: [
                    {
                        start: 0, 
                        end: 9000000,
                        radius: '115%',
                        startWidth: 25, endWidth: 25,
                        linearGradient : rangeLinearGradient
                    }
                ],
            },
            chart1: {
                key: 1,
                title: 'Tổng số',
                type: 'Marker',
                markerShape: 'Image',
                imageUrl: 'https://ej2.syncfusion.com/vue/demos/src/circular-gauge/images/foot-ball.png',
                pointerRadius: '108%', 
                markerWidth: 28, 
                markerHeight: 28,
                animation: { duration: 1500 },
                annotations: [{
                    content: this.anoTemplate(0), radius: '0%', angle: 190, zIndex: '1',
                }],
            },
            chart2: {
                key: 1,
                title: 'Đang thực hiện',
                type: 'Marker', 
                markerShape: 'Image',
                imageUrl: 'https://ej2.syncfusion.com/vue/demos/src/circular-gauge/images/foot-ball.png',
                pointerRadius: '108%', 
                markerWidth: 28, 
                markerHeight: 28,
                animation: { duration: 1500 },
                annotations: [{
                    content: this.anoTemplate(0), radius: '0%', angle: 190, zIndex: '1'
                }],
            },
            chart3: {
                key: 1,
                title: 'Quá hạn đang thực hiện',
                type: 'Marker', 
                markerShape: 'Image',
                imageUrl: 'https://ej2.syncfusion.com/vue/demos/src/circular-gauge/images/foot-ball.png',
                pointerRadius: '108%', 
                markerWidth: 28, 
                markerHeight: 28,
                animation: { duration: 1500 },
                annotations: [{
                    content: this.anoTemplate(0), radius: '0%', angle: 190, zIndex: '1',
                }],
            },
            chart4: {
                key: 1,
                title: 'Đã hoàn thành',
                type: 'Marker', 
                markerShape: 'Image',
                imageUrl: 'https://ej2.syncfusion.com/vue/demos/src/circular-gauge/images/foot-ball.png',
                pointerRadius: '108%', 
                markerWidth: 28, 
                markerHeight: 28,
                animation: { duration: 1500 },
                annotations: [{
                    content: this.anoTemplate(0), radius: '0%', angle: 190, zIndex: '1',
                }],
            },
            chart5: {
                key: 1,
                title: 'Quá hạn đã hoàn thành',
                type: 'Marker', 
                markerShape: 'Image',
                imageUrl: 'https://ej2.syncfusion.com/vue/demos/src/circular-gauge/images/foot-ball.png',
                pointerRadius: '108%', 
                markerWidth: 28, 
                markerHeight: 28,
                animation: { duration: 1500 },
                annotations: [{
                    content: this.anoTemplate(0), radius: '0%', angle: 190, zIndex: '1',
                }],
            },
            
            listProjects: { value: 0, Items: [] },
            thang: moment(new Date()).format('MM/yyyy'),   
            tong_cong: 0,
            dang_thuc_hien: 0,
            qua_han_chua_hoan_thanh: 0,
            da_hoan_thanh: 0,
            qua_han_da_hoan_thanh: 0,
            grid_chitiet: {
                columns: [
                    {
                        fieldName: "full_name",
                        headerText: "Nhân viên",
                    },
                    {
                        fieldName: "total",
                        headerText: "Tổng số YC",
                        allowFilter: true
                    },
                    {
                        fieldName: "task_not_finished_ontime",
                        headerText: "YC đang thực hiện",
                        allowFilter: true
                    },
                    {
                        fieldName: "task_not_finished_late",
                        headerText: "YC quá hạn đang thực hiện",
                        allowFilter: true
                    },
                    {
                        fieldName: "task_done_on_time",
                        headerText: "YC đã hoàn thành",
                        allowFilter: true
                    },                    
                    {
                        fieldName: "task_done_on_late",
                        headerText: "YC quá hạn đã hoàn thành",
                        allowFilter: true
                    },
                ],
                list: [],
            },
            listDetailReport:[],
            columnsDetails:[
                {
                    fieldName: "project_name",
                    headerText: "Dịch vụ",
                },
                {
                    fieldName: "customer",
                    headerText: "Khách hàng",
                },
                {
                    fieldName: "task_name",
                    headerText: "Nội dung công việc",
                },
                {
                    fieldName: "full_name",
                    headerText: "Người thực hiện",
                },
                {
                    fieldName: "start_day",
                    headerText: "Ngày bắt đầu",
                },
                {
                    fieldName: "end_day",
                    headerText: "Ngày việc kết",
                },
                {
                    fieldName: "note",
                    headerText: "Ghi chú",
                },
                {
                    fieldName: "progress_name",
                    headerText: "Kết quả",
                },
            ]
        }
    },
    computed:{},
    methods:{
        anoTemplate(value) {
            return '<div><span style="font-size:30px">'+value+'</span></div>'
        },
        async onActionClick(action){
            this.loading(true);
            if (action.id == 'refresh') {
                await Promise.all([
                    this.getReportTask(),
                    this.getReportTaskByUser(),
                ]);          
            }
            this.loading(false);
        },
        async getProjects(){
            try {
                this.listProjects.Items = [];
				let response = await DashboardApi.getProjects(this.axios)
				if (response.data.success) {
                    let init = [{project_id: 0, project_name: 'Tất cả'}]
                    if (response.data.data && response.data.data.length > 0) {
                        this.listProjects.Items = init.concat(response.data.data);
                    }
                    this.loading(false);
				} else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			} catch (e) {
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async onChangeProject() {
            this.loading(true);
            await Promise.all([
                this.getReportTask(),
                this.getReportTaskByUser(),
            ]);
        },
        async onChangeThang(event) {
            if (event && event.value) {
                this.thang = moment(event.value).format('MM/yyyy');
                this.loading(true);
                await Promise.all([
                    this.getReportTask(),
                    this.getReportTaskByUser(),
                ]);
            }
        },
        async getReportTaskByUser(){
            try {
                this.grid_chitiet.list = [];
                let input = {
                    project_id: this.listProjects.value,
                    thang: this.thang
                }
				let response = await DashboardApi.getReportTaskByUser(this.axios, input)
				if (response.data.success) {
					this.grid_chitiet.list = response.data.data;
                    this.loading(false);
				} else {
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			} catch (e) {
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        async getReportTask(){
            try {
                let input = {
                    project_id: this.listProjects.value,
                    thang: this.thang
                }
				let response = await DashboardApi.getReportTask(this.axios, input)
				if (response.data.success) {
					this.tong_cong = response.data.data[0]?.total || 0;
                    this.dang_thuc_hien = response.data.data[0]?.task_not_finished_ontime || 0;
                    this.qua_han_chua_hoan_thanh = response.data.data[0]?.task_not_finished_late || 0;
                    this.da_hoan_thanh = response.data.data[0]?.task_done_on_time || 0;
                    this.qua_han_da_hoan_thanh = response.data[0]?.data.task_done_on_late || 0;
                    this.getChart();
                    this.loading(false);
				} else {
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			} catch (e) {
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        getChart() {
            this.chart1.annotations[0].content = this.anoTemplate(this.tong_cong);
            this.chart2.annotations[0].content = this.anoTemplate(this.dang_thuc_hien);
            this.chart3.annotations[0].content = this.anoTemplate(this.qua_han_chua_hoan_thanh);
            this.chart4.annotations[0].content = this.anoTemplate(this.da_hoan_thanh);
            this.chart5.annotations[0].content = this.anoTemplate(this.qua_han_da_hoan_thanh);
            this.chart1.key++;
            this.chart2.key++;
            this.chart3.key++;
            this.chart4.key++;
            this.chart5.key++;
        },
        selectReport(args){
            console.log('index',args.column)
            var obj = this.grid_chitiet.list[args.column.index-1];
            console.log('abc',args.rowData);
            this.getReportDetailByUser(args.rowData.user_id,this.thang,this.listProjects.value,args.column.field);
        },
        async getReportDetailByUser(user_id,month,project_id,rownname){
            try{
                let response = await DashboardApi.getReportDetailByUser(this.axios,user_id,month,project_id,rownname);
                this.listDetailReport = [];
                if(response.data.success){
                    // this.$toast.success(response.data.message);
                    this.loading(false);
                    this.listDetailReport = response.data.data;
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
    },
    async created(){},
    async mounted(){
        this.loading(true);
        await this.getProjects();
        this.listProjects.value = this.listProjects.Items && this.listProjects.Items.length > 0 ? this.listProjects.Items[0].project_id : 0;
        await Promise.all([
            this.getReportTask(),
            this.getReportTaskByUser(),
        ]);
    },
}
</script>