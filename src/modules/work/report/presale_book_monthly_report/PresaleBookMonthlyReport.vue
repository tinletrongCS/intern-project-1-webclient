<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content presale-book-monthly-report" style="top: 46px !important; bottom: 46px !important;">
      <div class="box-form">
        <div class="row">
            
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold">Tháng</div>
              <div class="value">
                <ejs-datepicker class="form-control" placeholder="Chọn tháng" :format="'MM/yyyy'" :start="'Year'"
                  :enabled="true" :depth="'Year'" :showClearButton="false" v-model="month" :allowEdit="false"
                  @change="onChangeFromMonth($event)" />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12" style="padding-top: 26px !important;">
            <button class="btn btn-second" @click="onSearch" style="min-width: 100px;">
              <span class="icon one-search"></span>Tìm kiếm
            </button>
          </div>

        </div>
        
      </div>
      <div class="box-form">
        <div class="info-row" v-if="hasButtonPermission('exportExcelBookPs')">
          <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
            <button class="btn btn-second" style="min-width: 100px;" @click="clickExportReportBookPs">
              <span class="icon fa fa-file-excel-o"></span>&nbsp;Xuất Excel
            </button>&nbsp;
          </div>
        </div>
        <div class="info-row">
          <div class="value bold">
            DANH SÁCH TỔNG HỢP DỮ LIỆU BOOK PS THÁNG {{month}}
          </div>
        </div>

        <KDataGrid ref="gridDs"
          v-show="isShowGrid"
          :columns="columns" 
          :dataSource="dataSources" 
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="true" 
          :showColumnCheckbox="false" 
          :enabledSelectFirstRow="false"
          :showSTT="true" 
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
        
      </div>

    </div>

  </div>
</template>
<script>
import API from './API'
import moment from 'moment'
import * as XLSX from 'xlsx-js-style'
export default {
  name:'PresaleBookMonthlyReport',
  components:{

  },
  data(){
    return {
      header: {
          title: "Báo cáo tổng hợp dữ liệu Book PS theo tháng",
          list: [
          ],
      },
      month: moment(new Date()).format('MM/YYYY'),
      columns: [],
      dataSources: [],
      bsc_columns: [
        "phongban",
        "username",
        "full_name",

        "tongthoigian_giao",
        "tongthoigian_th",

        "hieu_suat",
        "hieu_suat_bsc",

        "tongdiem_dm",
        "tongdiem_clcvht",

        "chat_luong",
        "chatluong_cv_bsc",

        "tong_task",
        "sl_task_bth",
        "sl_task_qt",
        "sl_task_rat_qt",

        "bth_trehan",
        "qtrong_trehan",
        "ratqtrong_trehan",

        "bth_dunghan",
        "qtrong_dunghan",
        "ratqtrong_dunghan",

        "bth_somhan",
        "qtrong_somhan",
        "ratqtrong_somhan",

        "kqth_bth",
        "kqth_qt",
        "kqth_rqt",

        "tiendo",
        "tiendo_bsc",
        "bsc_tong"
      ]

    }
  },
  computed:{
    isShowGrid(){
      return this.columns.length>0
    }
  },
  methods:{
    
    async loadPage(){
      this.loadDataReport()
    },
    
    async clickExportReportBookPs(){
      if (!this.hasButtonPermission('exportExcelBookPs')) {
        this.$toast.error('Bạn không có quyền thực hiện chức năng này.');
        return;
      }

      let period = Number(moment(this.month, 'MM/YYYY').format('YYYYMM'));

      // Gọi lại API — lấy đúng columns + data backend đã trả
      let result = await API.GetBookPsReportMonth(this, { period });
      if (!result) return;

      result = JSON.parse(result);
      const columns = result.columns;   // backend trả về
      const data = result.data;

      // Tạo header Excel từ headerText trong columns
      const headerDisplay = columns.map(c => c.headerText);

      // Tạo mapping key theo fieldName
      const headerKeys = columns.map(c => c.fieldName);

      // Build data Excel
      const excelData = [
        headerDisplay,
        ...data.map(row => headerKeys.map(key => row[key]))
      ];

      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // STYLE HEADER
      headerDisplay.forEach((col, index) => {
        const cell = ws[XLSX.utils.encode_cell({ r: 0, c: index })];
        cell.s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          fill: { fgColor: { rgb: "D9E1F2" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      });

      // Auto width
      ws["!cols"] = headerDisplay.map(() => ({ wpx: 160 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Book PS tháng ${this.month.replace('/', '-')}`);
      XLSX.writeFile(wb, `book_ps_${period}.xlsx`);
    },
    onSearch(){
      this.loadDataReport()
    },
    async loadDataReport(){
      let period=Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))
      this.columns=[]
      this.dataSources=[]
      var result=await API.GetBookPsReportMonth(this,{
        period:period
      })
      if(result){
        result=JSON.parse(result)
        this.$nextTick(()=>{
          this.columns=result.columns.concat([])
          this.dataSources=result.data.concat([])
        })
      }
    },
    onChangeFromMonth(event){
      if (event && event.value) {
        this.month = moment(event.value).format('MM/YYYY');
        this.loadDataReport(true)
      }
    }
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
      this.GetPermissionButtons()
    }, 200)
  }
}
</script>
<style>
.presale-book-monthly-report .info-row {
    display: table;
    width: 100%;
    table-layout: fixed; /* Bắt buộc table-cell tuân theo width */
}

.presale-book-monthly-report .info-row .key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: table-caption; /*Cho lên dòng trên*/
}

.presale-book-monthly-report .info-row .value {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden; /* quan trọng */
    width: auto;
    padding-left: 0px !important;
}

.presale-book-monthly-report .info-row .value .select2-container {
    width: 100% !important;
}

.presale-book-monthly-report.info-row .value .select2-selection {
    width: 100% !important;
    overflow: hidden !important;
}

.presale-book-monthly-report .info-row .value .select2-selection__rendered {
    display: block !important;
    width: 100% !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
.presale-book-monthly-report .col-button-search{
  padding-top:26px !important;
}
@media (min-width: 576px) and (max-width: 768px) {
  .presale-book-monthly-report .col-button-search{
    padding-top:29px !important;
  }
} 
</style>