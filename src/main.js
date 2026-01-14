import { createApp } from 'vue';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.vue';
import router from './router.js';
import VueAxios from 'vue-axios';
import axiosPlugin from './plugins/axiosPlugin';
import Auth from './plugins/auth';
import Root from './plugins/root';
import Select2 from './components/controls/Select2.vue';
import KRequiredMarker from './components/controls/KRequiredMarker.vue'
import { provideAppToast } from './plugins/toastPlugin';
import confirmPlugin from './plugins/confirmPlugin';
import permissionMixin from './mixins/permissionMixin.js';
import {
  registerLicense,
  loadCldr,
  setCulture,
  L10n,
} from '@syncfusion/ej2-base';
import KDataGrid from './components/controls/KDataGrid';

registerLicense(
  'ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5WdEFhWH1fcHddQ2lf'
);

import {
  ChartPlugin,
  AccumulationChartPlugin,
} from '@syncfusion/ej2-vue-charts';
import {
  Chart,
  LineSeries,
  ColumnSeries,
  Legend,
  Category,
  DataLabel,
  Tooltip,
  StackingBarSeries,
  StackingColumnSeries,
  AccumulationChart,
  AccumulationAnnotation,
  PieSeries,
  AccumulationLegend,
  AccumulationTooltip,
  AccumulationDataLabel,
} from '@syncfusion/ej2-charts';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  AggregatesDirective,
  AggregateDirective,
  VirtualScroll,
  Sort,
  Filter,
  Selection,
} from '@syncfusion/ej2-vue-grids';
import {
  CircularGaugeComponent,
  AxesDirective,
  AxisDirective,
  PointersDirective,
  PointerDirective,
  RangesDirective,
  RangeDirective,
} from '@syncfusion/ej2-vue-circulargauge';
import {
  DropDownListComponent,
  MultiSelectComponent,
} from '@syncfusion/ej2-vue-dropdowns';
import {
  DateTimePickerComponent,
  DatePickerComponent,
  TimePickerComponent,
  DateRangePickerComponent,
} from '@syncfusion/ej2-vue-calendars';
import {
  DialogComponent,
  DialogUtility,
  TooltipComponent,
} from '@syncfusion/ej2-vue-popups';
import {
  ButtonComponent,
  CheckBoxComponent,
  ButtonPlugin,
  RadioButtonPlugin,
} from '@syncfusion/ej2-vue-buttons';
import { DropDownButtonComponent as EjsDropDownButton } from '@syncfusion/ej2-vue-splitbuttons';
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { TabPlugin, TreeViewPlugin } from '@syncfusion/ej2-vue-navigations';
import FormInput from './components/controls/FormInput.vue'; 
import select2 from 'select2';
import breadcrumb from './components/controls/Breadcrumb.vue';
select2();

import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
// import * as weekData from 'cldr-data/supplemental/weekdata.json'

loadCldr(
  numberingSystems,
  gregorian,
  numbers,
  timeZoneNames //weekData
  //require('cldr-data/supplemental/weekdata.json')
); // To load the culture based first day of week

L10n.load({
  vi: {
    datepicker: { placeholder: '', today: 'Hôm nay' },
  },
});

setCulture('vi');

const app = createApp(App);

app.use(router);
// app.use(VueAxios, axios);
app.use(VueAxios, axiosPlugin);
app.use(Auth);
app.use(Root);
// app.use(DialogUtility);
app.use(ButtonPlugin);
app.use(TextBoxPlugin);
app.use(RadioButtonPlugin);
app.use(TabPlugin);
app.use(TreeViewPlugin);
// app.use(Toast);
app.use(provideAppToast);
app.use(confirmPlugin);

app.mixin(permissionMixin);
//app.use(CKEditor)

// app.use(ToastPlugin, {position:"top-right"});
app.component('Select2', Select2);
app.config.globalProperties.loading = function (value) {
  if (value) {
    $('.overlay-common').addClass('show');
  } else {
    $('.overlay-common').removeClass('show');
  }
};
// Ejs chart
Chart.Inject(
  LineSeries,
  ColumnSeries,
  Legend,
  Category,
  DataLabel,
  Tooltip,
  StackingBarSeries,
  StackingColumnSeries
);
AccumulationChart.Inject(
  PieSeries,
  AccumulationLegend,
  AccumulationTooltip,
  AccumulationDataLabel,
  AccumulationAnnotation
);
app.use(ChartPlugin);
app.use(AccumulationChartPlugin);

app.component('ejs-circulargauge', CircularGaugeComponent);
app.component('e-pointers', PointersDirective);
app.component('e-pointer', PointerDirective);
app.component('e-ranges', RangesDirective);
app.component('e-range', RangeDirective);
app.component('ejs-dropdownbutton', EjsDropDownButton);
app.component('ejs-dropdownlist', DropDownListComponent);
app.component('ejs-datetimepicker', DateTimePickerComponent);
app.component('ejs-datepicker', DatePickerComponent);
app.component('ejs-daterangepicker', DateRangePickerComponent);
app.component('ejs-grid', GridComponent);
app.component('ejs-dialog', DialogComponent);
app.component('ejs-msgBoxConfirm', DialogUtility);
app.component('ejs-tooltip', TooltipComponent);
app.component('KDataGrid', KDataGrid);
app.component('e-aggregates', AggregatesDirective);
app.component('e-aggregate', AggregateDirective);
app.component('ejs-checkbox', CheckBoxComponent);
app.component('ejs-multiselect', MultiSelectComponent);
app.component('ejs-timepicker', TimePickerComponent);
app.component('k-input', FormInput);
app.component('breadcrumb', breadcrumb);
app.component('required-marker', KRequiredMarker);
app.mount('#app');

app.provide('grid', [Filter, Selection, Sort, VirtualScroll]);

import 'bootstrap/dist/js/bootstrap.js';
import 'jquery/dist/jquery.slim.min.js';
import $, { uniqueSort } from 'jquery';
window.jQuery = window.$ = $;
