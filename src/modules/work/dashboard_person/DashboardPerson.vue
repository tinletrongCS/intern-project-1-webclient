<template>
    <div id="dashboardPerson" class="main-wrapper">
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
                    <div class="k title-filter">Kỳ đánh giá</div>
                    <div class="k select-pj">
                        <ejs-datepicker class="form-control bg-none bor0 fw6 text-red" placeholder="Chọn tháng"
                            :format="'MM/yyyy'" :start="'Year'" :enabled="true" :depth="'Year'" :showClearButton="false"
                            v-model="month" :allowEdit="false" @change="onChangeMonth($event)" />
                    </div>
                </div>
            </div>
            <div class="k box-form">
                <div class="row">
                    <div class="col-md-12 col-12 ">
                        <div class="box-form-title" style="text-align: center;">{{ "Hiệu quả về thời gian" }}</div>
                    </div>
                </div>
                <div class="row dashboard-card">
                    <div class="col-lg-4 col-md-4 col-sm-12 col-4">
                        <div class="card">
                            <div class="card-title">Thời gian thực hiện</div>
                            <div class="card-content">
                                <p>{{ actualHourNums }} giờ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-12 col-4">
                        <div class="card">
                            <div class="card-title">Quỹ thời gian giao</div>
                            <div class="card-content">
                                <p>{{ scheduleHourNums }} giờ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-12 col-4">
                        <div :class="percentActualSchedule > 100 ? 'card-percent-bad' : 'card-percent'">
                            <div class="card-content">
                                <p>{{ percentActualSchedule }} %</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row dashboard-card">
                    <div class="col-lg-4 col-md-4 col-sm-12 col-4">
                        <div class="card">
                            <div class="card-title">Thời gian làm việc</div>
                            <div class="card-content">
                                <p>{{ actualHourNums }} giờ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-12 col-4">
                        <div class="card">
                            <div class="card-title">Tiêu chuẩn tuần</div>
                            <div class="card-content">
                                <p>{{ standardHourNums }} giờ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-12 col-4">
                        <div :class="percentActualStandard > 100 ? 'card-percent-bad' : 'card-percent'">
                            <div class="card-content">
                                <p>{{ percentActualStandard }} %</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="k box-form full-width">
                <div class="k row full-width">
                    <div class="k col-lg-6 col-md-6 col-sm-12 col-12 dashboard-card">
                        <div class="box-form-title" style="text-align: center;">Chỉ số hiệu quả khác</div>
                        <div class="card">
                            <div class="card-title">Việc đang trễ hẹn</div>
                            <div class="card-content">
                                <p>{{ countOverDue }} việc</p>
                            </div>
                        </div>
                    </div>
                    <div class="k col-lg-6 col-md-6 col-sm-12 col-12">
                        <div class="box-form-title" style="text-align: center;">TB chất lượng 3 tháng liền kề</div>
                        <ejs-chart id="chart1" :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis'
                            :pointRender='pointRender' :tooltip="{ enable: true }" :legendSettings='legendSettings'>
                            <e-series-collection>
                                <e-series :dataSource='AverageQualityOfTreeMonth' :marker='marker' type='Column'
                                    xName='x' yName='y' columnWidthInPixel="50"> </e-series>
                            </e-series-collection>
                        </ejs-chart>
                    </div>
                </div>
            </div>

            <div class="k box-form full-width">
                <div class="k row full-width">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <div class="box-form-title" style="text-align: center;">Tổng hợp theo loại công việc</div>
                        <div class="full-width">
                            <ejs-accumulationchart id="chart2" :tooltip='tooltip' :legendSettings="legendSettings"
                                :pointRender="pointRender" :pointClick="onPointClick">
                                <e-accumulation-series-collection>
                                    <e-accumulation-series type="Pie" :dataSource="TaskByJobType" xName="x" yName="y"
                                        innerRadius="50%" :dataLabel="donutDataLabel" tooltipMappingName='legend'>
                                    </e-accumulation-series>
                                </e-accumulation-series-collection>

                                <e-accumulation-annotations>
                                    <e-accumulation-annotation
                                        :content="`<div style='font-size: 30px; font-weight: bold;'>${detailTaskByJobType.numberTask}</div>`"
                                        region="Chart" x="50%" y="53%" />
                                </e-accumulation-annotations>
                            </ejs-accumulationchart>

                            <div class="task-chart">
                                <div class="task-header">
                                    <strong>Loại công việc:</strong> {{ detailTaskByJobType.jobName }}
                                </div>
                                <div class="bar-container">
                                    <div v-for="(item, index) in detailTaskByJobType.barData" :key="index"
                                        class="bar-segment"
                                        :style="{ width: item.percent + '%', backgroundColor: item.color }">
                                        <span v-if="item.value > 0" class="bar-label">{{ item.value }}</span>
                                    </div>
                                </div>
                                <div class="legend">
                                    <div v-for="(item, index) in detailTaskByJobType.barData" :key="index"
                                        class="legend-item">
                                        <div class="color-box" :style="{ backgroundColor: item.color }"></div>
                                        <span>{{ item.label }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <div class="box-form-title" style="text-align: center;">TB chất lượng việc đã hoàn thành</div>
                        <ejs-chart id="chart4" :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis'
                            :pointRender='pointRender' :tooltip='tooltip' :legendSettings='legendSettings'>
                            <e-series-collection>
                                <e-series :dataSource='AverageQualityOfWork' :marker='marker' type='Column' xName='x'
                                    yName='y' tooltipMappingName='legend' columnWidthInPixel="50"> </e-series>
                            </e-series-collection>
                        </ejs-chart>
                    </div>
                </div>
            </div>

            <div class="k box-form full-width">
                <span style="font-size: 18px; font-weight: bold;">Danh sách công việc</span>
                <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
                    :allowPaging="true" :showFilter="true" :showColumnCheckbox="false" :enabledSelectFirstRow="false"
                    :showSTT="true" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
            </div>
        </div>
    </div>
</template>
<style src="./DashboardPerson.css" scoped></style>
<script>
import DashboardPersonApi from './DashboardPersonAPI.js';
import { createApp } from "vue"
const app = createApp()
import ActionTop from '@/components/controls/ActionTop.vue'
import moment from 'moment';
import { forEach } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';

const primaryXAxis = {
    valueType: 'Category',
    majorGridLines: { width: 0 },
    visible: true
};
const primaryYAxis = {
    majorGridLines: { width: 0 },
    minimum: 0,
    maximum: 5,
    interval: 1,
    visible: true
};
const legendSettings = {
    visible: true,
    position: 'Top'
};
const tooltip = { enable: true, format: '${point.tooltip}' };
const marker = {
    dataLabel: { visible: true }
};
const donutDataLabel = {
    visible: true,
    name: 'y',
    position: 'Inside'
}
const detailData = {
    jobName: 'Tất cả',
    numberTask: 0,
    barData: [
        { label: 'Hoàn thành đúng hạn', value: 0, percent: 0, color: '#4D9FFB' },
        { label: 'Hoàn thành trễ hạn', value: 0, percent: 0, color: '#E0E4F4' },
        { label: 'Chưa hoàn thành', value: 0, percent: 0, color: '#D7D7D7' }
    ]
};

export default {
    components: {
        ActionTop
    },
    provide: {
    },
    data() {
        return {
            header: {
                title: this.$route.meta.title,
                list: [
                ],
            },
            listMember: { value: null, Items: [] },
            month: moment(new Date()).format('MM/yyyy'),
            actualHourNums: 0,
            scheduleHourNums: 0,
            percentActualSchedule: 0,
            standardHourNums: 0,
            percentActualStandard: 0,
            countOverDue: 0,
            AverageQualityOfTreeMonth: [],
            AverageQualityOfWork: [],
            TaskByJobType: [],
            detailTaskByJobType: detailData,
            primaryXAxis: primaryXAxis,
            primaryYAxis: primaryYAxis,
            paletteColors: [],
            tooltip: tooltip,
            marker: marker,
            donutDataLabel: donutDataLabel,
            legendSettings: legendSettings,
            columns: [
                {
                    fieldName: 'code',
                    headerText: 'Mã công việc',
                    allowFiltering: true,
                    width: '120'
                },
                {
                    fieldName: 'group_task',
                    headerText: 'Nhóm công việc',
                    allowFiltering: true,
                    width: '200'
                },
                {
                    fieldName: 'type_task',
                    headerText: 'Loại công việc',
                    allowFiltering: true,
                    width: '180'
                },
                {
                    fieldName: 'planned_duration_time',
                    headerText: 'Thời lượng giao',
                    allowFiltering: true,
                    width: '150',
                    textAlign: 'Right'
                },
                {
                    fieldName: 'actual_execution_time',
                    headerText: 'Thời lượng thực hiện',
                    allowFiltering: true,
                    width: '150',
                    textAlign: 'Right'
                },
                {
                    fieldName: 'efficiency',
                    headerText: 'Hiệu suất (E/D)',
                    allowFiltering: true,
                    width: '130',
                    textAlign: 'Center',
                    valueAccessor: (field, data) => {
                        const planned = data.planned_duration_time || 0;
                        const actual = data.actual_execution_time || 0;
                        return planned > 0 ? ((actual / planned) * 100).toFixed(2) + '%' : '0%';
                    }
                },
                {
                    fieldName: 'status_name',
                    headerText: 'Đã hoàn thành/Chưa hoàn thành',
                    allowFiltering: true,
                    width: '200'
                },
                {
                    fieldName: 'progress_status',
                    headerText: 'Đúng/Trễ tiến độ',
                    allowFiltering: true,
                    width: '150'
                },
                {
                    fieldName: 'rating',
                    headerText: 'Chất lượng',
                    allowFiltering: true,
                    width: '150'
                }
            ]
            ,
            dataSources: [],
        }
    },
    computed: {
    },
    methods: {
        async getAllMemberByUnit() {
            try {
                this.listMember.Items = [];
                let result = await DashboardPersonApi.getUsersByUserUnit(this);
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
                if (!this.listMember.value) {
                    this.loading(false);
                    return;
                };
                await Promise.all([
                    this.getCountWorkingOverDue(),
                    this.getDetailByMonth(),
                    this.getAverageQualityOfTreeMonth(),
                    this.getAverageQualityOfWork(),
                    this.getTaskByJobType(),
                    this.getTaskDetailTable()
                ]);
            } catch (e) { } finally {
                this.loading(false);
            }
        },
        async onChangeMonth(event) {
            try {
                this.loading(true);
                if (event && event.value) {
                    this.month = moment(event.value).format('MM/yyyy');
                }
                await Promise.all([
                    this.getDetailByMonth(),
                    this.getAverageQualityOfTreeMonth(),
                    this.getAverageQualityOfWork(),
                    this.getTaskByJobType(),
                    this.getTaskDetailTable()
                ]);
            } catch (e) { } finally {
                this.loading(false);
            }
        },
        async getDetailByMonth() {
            try {
                this.actualHourNums = 0;
                this.scheduleHourNums = 0;
                this.percentActualSchedule = 0;
                this.standardHourNums = 0;
                this.percentActualStandard = 0;
                let response = await DashboardPersonApi.getDetailByMonth(this.axios, {
                    month: this.month,
                    assignee_id: this.listMember.value,
                })
                if (response.data.success) {
                    if (response.data.data && response.data.data.length > 0) {
                        var data = JSON.parse(response.data.data);
                        this.actualHourNums = data[0].ActualHourNums;
                        this.scheduleHourNums = data[0].ScheduleHourNums;
                        this.percentActualSchedule = data[0].PercentActualSchedule;
                        this.standardHourNums = data[0].StandardHourNums;
                        this.percentActualStandard = data[0].PercentActualStandard;
                    }
                } else {
                    this.$toast.error(response.data.message);
                }
            } catch (e) {
                this.$toast.error(e.message);
            }
        },
        async getAverageQualityOfTreeMonth() {
            try {
                this.AverageQualityOfTreeMonth = [];
                let response = await DashboardPersonApi.getAverageQualityOfTreeMonth(this.axios, {
                    month: this.month,
                    assignee_id: this.listMember.value,
                })
                if (response.data.success) {
                    if (response.data.data) {
                        var data = JSON.parse(response.data.data);
                        this.AverageQualityOfTreeMonth = data && data.length > 0 ? data.map(r => ({ x: r.month_code, y: r.average_rating })) : [];
                    }
                } else {
                    this.$toast.error(response.data.message);
                }
            } catch (e) {
                this.$toast.error(e.message);
            }
        },
        async getCountWorkingOverDue() {
            try {
                this.countOverDue = 0;
                let response = await DashboardPersonApi.getCountWorkingOverDue(this.axios, {
                    assignee_id: this.listMember.value,
                })
                if (response.data.success) {
                    if (response.data.data) {
                        this.countOverDue = response.data.data ? response.data.data : 0;
                    }
                } else {
                    this.$toast.error(response.data.message);
                }
            } catch (e) {
                this.$toast.error(e.message);
            }
        },
        async getAverageQualityOfWork() {
            try {
                this.AverageQualityOfWork = [];
                let response = await DashboardPersonApi.getAverageQualityOfWork(this.axios, {
                    month: this.month,
                    assignee_id: this.listMember.value,
                })
                if (response.data.success) {
                    if (response.data.data && response.data.data.length > 0) {
                        var data = JSON.parse(response.data.data);
                        this.AverageQualityOfWork = data && data.length > 0 ?
                            data.map(r => ({ x: r.work_group_code, y: r.average_rating, legend: `${r.work_group_code}: ${r.work_group_name}` })) : [];
                    }
                } else {
                    this.$toast.error(response.data.message);
                }
            } catch (e) {
                this.$toast.error(e.message);
            }
        },
        async getTaskByJobType() {
            try {
                this.TaskByJobType = [];
                this.detailTaskByJobType = cloneDeep(detailData);
                let response = await DashboardPersonApi.getTaskByJobType(this.axios, {
                    month: this.month,
                    assignee_id: this.listMember.value,
                })
                if (response.data.success) {
                    if (response.data.data && response.data.data.length > 0) {
                        var data = JSON.parse(response.data.data);
                        this.TaskByJobType = data.map(r => ({ ...r, x: r.job_code, y: r.number_task, legend: `Nhóm công việc: ${r.work_name} <br> Loại công việc: ${r.job_name}` }));
                        this.detailTaskByJobType.jobName = 'Tất cả';
                        var total = 0;
                        data.forEach(e => total += e["number_task"] ? e["number_task"] : 0);
                        this.detailTaskByJobType.numberTask = total;
                        forEach(this.TaskByJobType, item => {
                            this.detailTaskByJobType.barData[0].value += item.number_ontime;
                            this.detailTaskByJobType.barData[1].value += item.number_latetime;
                            this.detailTaskByJobType.barData[2].value += item.number_unfinished;
                        })
                        forEach(this.detailTaskByJobType.barData, item => {
                            item.percent = this.detailTaskByJobType.numberTask > 0 ? (item.value / this.detailTaskByJobType.numberTask) * 100 : 0;
                        })
                    }
                } else {
                    this.$toast.error(response.data.message);
                }
            } catch (e) {
                this.$toast.error(e.message);
            }
        },
        onPointClick(event) {
            var index = this.TaskByJobType.findIndex(item => item.job_code === event.point.x);
            var tmp = this.detailTaskByJobType.barData;
            tmp[0].value = this.TaskByJobType[index].number_ontime;
            tmp[1].value = this.TaskByJobType[index].number_latetime;
            tmp[2].value = this.TaskByJobType[index].number_unfinished;
            var numberTask = this.TaskByJobType[index].number_task;
            tmp.forEach(item => {
                item.percent = numberTask > 0 ? (item.value / numberTask) * 100 : 0;
            });
            this.detailTaskByJobType.barData = tmp;
            this.detailTaskByJobType.jobName = this.TaskByJobType[index].job_name;
        },
        pointRender(args) {
            const defaultPalette = [
                "#00bdae", "#404041", "#357cd2", "#e56590", "#f8b883",
                "#70ad47", "#dd8abd", "#7f84e8", "#7bb4eb", "#ea7a57"
            ];

            // Chỉ sinh 1 lần nếu chưa có
            if (!this.dynamicColors) {
                const numExtra = 100; // số lượng màu dư phòng bạn cần
                this.dynamicColors = this.generateDistinctColors(numExtra);
            }

            // Nếu index nhỏ hơn palette gốc => dùng màu mặc định
            if (args.point.index < defaultPalette.length) {
                args.fill = defaultPalette[args.point.index];
            } else {
                const colorIndex = args.point.index - defaultPalette.length;
                args.fill = this.dynamicColors[colorIndex % this.dynamicColors.length];
            }
        },
        generateDistinctColors(count) {
            const result = new Set();
            while (result.size < count) {
                result.add(this.getRandomColor());
            }
            return Array.from(result);
        },
        getRandomColor() {
            // Sinh màu RGB lạnh/ngẫu nhiên đảm bảo độ tương phản
            const r = Math.floor(Math.random() * 200);
            const g = Math.floor(Math.random() * 200);
            const b = Math.floor(180 + Math.random() * 75); // thiên về xanh-lạnh

            return `rgb(${r}, ${g}, ${b})`;
        },
        async getTaskDetailTable(){
            try {
                let response = await DashboardPersonApi.getTaskDetailTable(this.axios, {
                    month: this.month,
                    assignee_id: this.listMember.value,
                })
                if (response.data.success) {
                    if (response.data.data && response.data.data.length > 0) {
                        var data = JSON.parse(response.data.data);
                        this.dataSources = data.concat([])
                    }
                    else{
                        this.dataSources = []
                    }
                } else {
                    this.$toast.error(response.data.message);
                }
            } catch (e) {
                this.$toast.error(e.message);
            }
        }
    },
    async created() { },
    async mounted() {
        try {
            this.loading(true);
            await this.getAllMemberByUnit();
            var index = this.listMember.Items.findIndex(item => item.username == this.$_root.token.getUserName());
            if (index >= 0) {
                this.listMember.value = this.listMember.Items[index].user_id;
            }
            if (!this.listMember.value) {
                this.loading(false);
                return;
            };
            await Promise.all([
                this.getCountWorkingOverDue(),
                this.getDetailByMonth(),
                this.getAverageQualityOfTreeMonth(),
                this.getAverageQualityOfWork(),
                this.getTaskByJobType(),
                this.getTaskDetailTable()
            ]);
            this.pointRender = this.pointRender.bind(this);

        } catch (e) {
        } finally {
            this.loading(false);
        }
    },
}
</script>