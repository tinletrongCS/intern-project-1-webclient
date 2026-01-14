<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content bsc-individual-summary" style="top: 46px !important; bottom: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold">Phòng ban</div>
              <div class="value">
                <select2
                  v-model="department_selected"
                  :options="unit_list.map(e => ({
                    id: e.department_id,
                    text: e.department_name
                  }))"
                  @select="onChangeDepartment"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key bold">Nhóm</div>
              <div class="value">
                <select2
                  v-model="group_selected"
                  :options="group_list.map(e => ({
                    id: e.department_id,
                    text: e.department_name
                  }))"
                  @select="onChangeGroup"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold">Người nhận</div>
              <div class="value">
                <select2 
                  v-model.number="user_selected"
                  :options="user_list"
                  @select="onChangeUser"
                />
              </div>
            </div>
          </div>

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
        <div class="info-row" v-if="hasButtonPermission('exportExcelBscPersonal')">
          <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
            <button class="btn btn-second" style="min-width: 100px;" @click="clickExportReportBSC">
              <span class="icon fa fa-file-excel-o"></span>&nbsp;Xuất Excel
            </button>&nbsp;
          </div>
        </div>
        <div class="info-row">
          <div class="value bold">
            DANH SÁCH THÔNG TIN BSC TỪNG CÁ NHÂN
          </div>
        </div>

        <KDataGrid ref="gridDs" 
          :columns="columns" 
          :dataSource="dataSources" 
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="true" 
          :showColumnCheckbox="false" 
          :enabledSelectFirstRow="false"
          :showSTT="false" 
          @rowDataBound="onRowDataBound"
          @queryCellInfo="queryCellInfo"
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
  name:'BscIndividualSummary',
  components:{

  },
  data(){
    return {
      header: {
          title: "Báo cáo tổng hợp kết quả BSC từng cá nhân",
          list: [
          ],
      },
      user_selected:null,
      user_list:[],
      unit_list:[],
      group_list:[],
      all_group_list:[],
      department_selected:null,
      group_selected:null,
      id_ttkd_gp:14,

      month: moment(new Date()).format('MM/YYYY'),

      columns: [
        {
          fieldName: 'department_name',
          headerText: 'Đơn vị',
          allowFiltering: true,
          freeze:'left'
        },
        {
          fieldName: 'full_name',
          headerText: 'Nhân sự',
          allowFiltering: true,
          freeze:'left'
        },
        {
          fieldName: 'employee_code',
          headerText: 'Mã nhân viên',
          allowFiltering: true,
          width:'140',
          freeze:'left'
        },
        {
          fieldName: 'work_position_name',
          headerText: 'Chức danh',
          allowFiltering: true,
          width:'140',
          freeze:'left'
        },
        {
          fieldName: 'bsc',
          headerText: 'Kết quả BSC',
          allowFiltering: true,
          width:'120',
          freeze:'left'
        },
        //Thông số
        {
          fieldName: 'kh_b1',
          headerText: 'Độ hài lòng KH (B1)',
          allowFiltering: true
        },
        {
          fieldName: 'tdkh_b2',
          headerText: 'Tăng trưởng DA (B2)',
          allowFiltering: true
        },
        {
          fieldName: 'tdda_b3',
          headerText: 'Tiến độ DA (B3)',
          allowFiltering: true
        },
        {
          fieldName: 'hs_c1',
          headerText: 'Hiệu suất (C1)',
          allowFiltering: true
        },
        {
          fieldName: 'cl_c2',
          headerText: 'Chất lượng (C2)',
          allowFiltering: true
        },
        {
          fieldName: 'td_c3',
          headerText: 'Tiến độ (C3)',
          allowFiltering: true
        },
        {
          fieldName: 'hs_nc1',
          headerText: 'Nhóm (C1)',
          allowFiltering: true
        },
         {
          fieldName: 'cl_nc2',
          headerText: 'Nhóm (C2)',
          allowFiltering: true
        },
        {
          fieldName: 'td_nc3',
          headerText: 'Nhóm (C3)',
          allowFiltering: true
        },
        {
          fieldName: 'ct_e1',
          headerText: 'CT trừ (E1)',
          allowFiltering: true
        }
      ],
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
  },
  methods:{
    normalizeBscItem(item) {
      return {
        phongban: item.phongban,
        nhom: item.nhom,
        username: item.username,
        full_name: item.full_name,
        ma_nv:item.ma_nv,

        tongthoigian_giao: item.tongthoigian_giao,
        tongthoigian_th: item.tongthoigian_th,

        hieu_suat: item.hieu_suat,
        hieu_suat_bsc: item.hieu_suat_bsc,

        tongdiem_dm: item.tongdiem_dm,
        tongdiem_clcvht: item.tongdiem_clcvht,

        chat_luong: item.chat_luong,
        chatluong_cv_bsc: item.chat_luong_bsc,

        tong_task: item.tong_task,

        sl_task_bth: item.sl_task_bth,
        sl_task_qt: item.sl_task_qt,
        sl_task_rat_qt: item.sl_task_rat_qt,

        bth_trehan: item.bth_trehan,
        qtrong_trehan: item.qtrong_trehan,
        ratqtrong_trehan: item.ratqtrong_trehan,

        bth_dunghan: item.bth_dunghan,
        qtrong_dunghan: item.qtrong_dunghan,
        ratqtrong_dunghan: item.ratqtrong_dunghan,

        bth_somhan: item.bth_somhan,
        qtrong_somhan: item.qtrong_somhan,
        ratqtrong_somhan: item.ratqtrong_somhan,

        kqth_bth: item.kqth_bth,
        kqth_qt: item.kqth_qt,
        kqth_rqt: item.kqth_rqt,

        tiendo: item.tiendo,
        tiendo_bsc: item.tiendo_bsc,
        bsc_tong: item.bsc_tong,

        total_rating_bth:item.total_rating_bth,
				total_rating_qtrong:item.total_rating_qtrong,
				total_rating_ratqtrong:item.total_rating_ratqtrong,

        tongcv1saomucbt:item.tongcv1saomucbt,
				tongcv2saomucbt: item.tongcv2saomucbt,
        tongcv3saomucbt: item.tongcv3saomucbt,
        tongcv4saomucbt: item.tongcv4saomucbt,

        tongcv1saomucqt: item.tongcv1saomucqt,
        tongcv2saomucqt: item.tongcv2saomucqt,
        tongcv3saomucqt: item.tongcv3saomucqt,
        tongcv4saomucqt: item.tongcv4saomucqt,

        tongcv1saomucrqt: item.tongcv1saomucrqt,
        tongcv2saomucrqt: item.tongcv2saomucrqt,
        tongcv3saomucrqt: item.tongcv3saomucrqt,
        tongcv4saomucrqt: item.tongcv4saomucrqt,

        hs_nc1_result: item.hs_nc1_result,
        cl_nc2_result: item.cl_nc2_result,
        td_nc3_result: item.td_nc3_result,
        tdkh_b2_result: item.tdkh_b2_result,
        tdda_b3_result: item.tdda_b3_result,
        cvt_c_result: item.cvt_c_result,
        chap_hanh_bsc: item.chap_hanh_bsc,
        hai_long_bsc: item.hai_long_bsc,

        hs_ps_result: item.hs_ps_result,
				td_ps_result: item.td_ps_result,
				dt_a1_result: item.dt_a1_result,

      }
    },
    async loadPage(){
      var result=await API.GetDepartmentTTKDGP(this)
      if(result){
        result=JSON.parse(result)

        var unitTTKDGP=result.find(x=>x.dep_type_id==2)
        if(unitTTKDGP){
          this.id_ttkd_gp=unitTTKDGP.department_id
        }
        
        var unit=result.filter(r=>r.dep_type_id==3)

        unit.unshift({
          department_id:0,
          department_name:'Tất cả',
        })
        this.unit_list=unit.concat([])
        this.department_selected=0

        //all nhóm
        this.all_group_list=result.filter(r=>r.dep_type_id==4)
        this.group_list=result.filter(r=>r.dep_type_id==4)
        this.group_list.unshift({
          department_id:0,
          department_name:'Tất cả',
        })
        this.group_selected=0

        const unit_id = this.getSelectedUnitId()


        this.user_selected=0
        this.user_list=[
          {
            id:0,
            text:'Tất cả'
          }
        ]
        var result= await API.GetUsersByDepartment(this, unit_id)
        this.user_list=this.user_list.concat(result)
        this.loadDataReport()

      }
    
    },
    async onChangeDepartment(){

      this.group_selected = 0
      // filter group theo department (nếu có parent_id)
      if (this.department_selected > 0) {
        this.group_list = this.all_group_list.filter(
          g => g.parent_id == this.department_selected
        )
      } else {
        this.group_list = this.all_group_list.concat([])
      }
      this.group_list.unshift({
        department_id:0,
        department_name:'Tất cả',
      })

      // reset user
      this.user_selected = 0
      this.user_list = [{ id: 0, text: 'Tất cả' }]

      const unit_id = this.getSelectedUnitId()

      const result = await API.GetUsersByDepartment(this, unit_id)
      this.user_list = this.user_list.concat(result)

      this.onChangeUser()
    },
    async onChangeGroup(){
      this.user_selected = 0
      this.user_list = [{ id: 0, text: 'Tất cả' }]

      const unit_id = this.getSelectedUnitId()

      const result = await API.GetUsersByDepartment(this, unit_id)
      this.user_list = this.user_list.concat(result)

      this.onChangeUser()
    },
    onChangeUser(){
      this.loadDataReport()
    },
    getSelectedUnitId() {
      if (this.group_selected > 0) {
        return this.group_selected
      }
      if (this.department_selected > 0) {
        return this.department_selected
      }
      return this.id_ttkd_gp
    },
    async clickExportReportBSC(){
      if(!this.hasButtonPermission('exportExcelBscPersonal')){
        this.$toast.error('Bạn không có quyền thực hiện chức năng này.')
        return
      }
      //
      let period=Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))

      var assignee_ids=[]
      if(this.user_selected==0){
        assignee_ids =  this.user_list.filter(r=>r.id!=0).map(x=>x.id)
      }else{
        assignee_ids=[this.user_selected]
      }

      // -----------------------------
      // 🔥 SHEET 1: SUMMARY
      // -----------------------------
      var dataScores=await API.GetBscIndividualSummaryFinalScoresMonth(this,{
        period:period,
        assignee_ids:JSON.stringify(assignee_ids)
      })
      if(!dataScores)return
      dataScores=JSON.parse(dataScores)
      dataScores = dataScores.map(x => this.normalizeBscItem(x));

      const headerDisplay = [
        "Phòng ban", "Nhóm", "Tài khoản", "Nhân sự", "Mã NV", "BSC tổng",
        "Tổng thời gian giao", "Tổng thời gian thực hiện",
        "Hiệu suất", "Hiệu suất BSC",
        "Tổng điểm định mức", "Tổng điểm CLCVHT",
        "Chất lượng", "Chất lượng CV BSC",
        "Tổng task",
        "SL task bình thường", "SL task quan trọng", "SL task rất quan trọng",
        "Bình thường trễ hạn", "Quan trọng trễ hạn", "RQT trễ hạn",
        "Bình thường đúng hạn", "Quan trọng đúng hạn", "RQT đúng hạn",
        "Bình thường sớm hạn", "Quan trọng sớm hạn", "RQT sớm hạn",
        "KQTH BT", "KQTH QT", "KQTH RQT",
        "Tiến độ", "Tiến độ BSC", 

        "Tổng đánh giá bình thường",
        "Tổng đánh giá quan trọng",
        "Tổng đánh giá rất quan trọng",

        "Tổng CV 1 sao mức bình thường",
        "Tổng CV 2 sao mức bình thường",
        "Tổng CV 3 sao mức bình thường",
        "Tổng CV 4 sao mức bình thường",

        "Tổng CV 1 sao mức quan trọng",
        "Tổng CV 2 sao mức quan trọng",
        "Tổng CV 3 sao mức quan trọng",
        "Tổng CV 4 sao mức quan trọng",

        "Tổng CV 1 sao mức rất quan trọng",
        "Tổng CV 2 sao mức rất quan trọng",
        "Tổng CV 3 sao mức rất quan trọng",
        "Tổng CV 4 sao mức rất quan trọng",

        "Hiệu suất nhóm C1",
        "Chất lượng nhóm C2",
        "Tiến độ nhóm C3",
        "Tăng trưởng DA B2",
        "Tiến độ DA B3",

        "CVT_C",

        "Chấp hành BSC",
        "Hài lòng BSC",

        "Hiệu suất PS",
        "Tiên độ PS",
        "Doanh thu A1"
      ];

      const headerKeys = [
        "phongban", "nhom", "username", "full_name", "ma_nv", "bsc_tong",
        "tongthoigian_giao", "tongthoigian_th",
        "hieu_suat", "hieu_suat_bsc",
        "tongdiem_dm", "tongdiem_clcvht",
        "chat_luong", "chatluong_cv_bsc",
        "tong_task",
        "sl_task_bth", "sl_task_qt", "sl_task_rat_qt",
        "bth_trehan", "qtrong_trehan", "ratqtrong_trehan",
        "bth_dunghan", "qtrong_dunghan", "ratqtrong_dunghan",
        "bth_somhan", "qtrong_somhan", "ratqtrong_somhan",
        "kqth_bth", "kqth_qt", "kqth_rqt",
        "tiendo", "tiendo_bsc",
        "total_rating_bth",
				"total_rating_qtrong",
				"total_rating_ratqtrong",
        "tongcv1saomucbt",
				"tongcv2saomucbt",
				"tongcv3saomucbt",
				"tongcv4saomucbt",
				
				"tongcv1saomucqt",
				"tongcv2saomucqt",
				"tongcv3saomucqt",
				"tongcv4saomucqt",
				
				"tongcv1saomucrqt",
				"tongcv2saomucrqt",
				"tongcv3saomucrqt",
				"tongcv4saomucrqt",

        "hs_nc1_result",
        "cl_nc2_result",
        "td_nc3_result",
        "tdkh_b2_result",
        "tdda_b3_result",
        "cvt_c_result",
        "chap_hanh_bsc",
        "hai_long_bsc",

        "hs_ps_result",
        "td_ps_result",
        "dt_a1_result"
      ];

      const excelData = [
        headerDisplay,
        ...dataScores.map(obj => headerKeys.map(k => obj[k]))
      ];

      const ws = XLSX.utils.aoa_to_sheet(excelData);

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

      ws["!cols"] = headerDisplay.map(() => ({ wpx: 140 }));

      // -----------------------------
      // 🔥 SHEET 2: DETAIL TASKS
      // -----------------------------
      var dataDetailTask = await API.GetBscIndividualSummaryDetailTaskMonth(this, {
        period,
        assignee_ids: JSON.stringify(assignee_ids)
      })
      if (!dataDetailTask) return

      dataDetailTask = JSON.parse(dataDetailTask)

      const detailHeaderDisplay = [
        "Phòng ban thực hiện",
        "Nhóm thực hiện",
        "Phòng ban người giao",
        "Mã công việc",
        "Nội dung công việc",

        "Ngày bắt đầu KH",
        "Ngày kết thúc KH",
        "Ngày bắt đầu thực tế",
        "Ngày kết thúc thực tế",

        "Tài khoản người thực hiện",
        "Tên người thực hiện",
        "Mã NV người thực hiện",

        "Tên người giao",
        "Mã NV người giao",

        "Giờ thực hiện",
        "Giờ kế hoạch",
        "Trạng thái",
        "Đánh giá",
        "Mức độ"
      ];


      // mapping theo JSON key từ function SQL
      const detailHeaderKeys = [
        "department",            // phòng ban người thực hiện
        "group",
        "creator_department",    // phòng ban người giao

        "task_code",
        "task_name",

        "plan_start_date",
        "plan_end_date",
        "actual_start_date",
        "actual_end_date",

        "assignee_account",
        "assignee_name",
        "assignee_code",         // 🔥 mã NV người thực hiện

        "creator_name",
        "creator_code",          // 🔥 mã NV người giao

        "actual_hours",
        "planned_hours",
        "status_task",
        "evaluation",
        "priority_level"
      ];

      const detailSheetData = [
        detailHeaderDisplay,
        ...dataDetailTask.map(obj => detailHeaderKeys.map(k => obj[k]))
      ]

      const ws2 = XLSX.utils.aoa_to_sheet(detailSheetData)

      detailHeaderDisplay.forEach((col, index) => {
        const cell = ws2[XLSX.utils.encode_cell({ r: 0, c: index })]
        cell.s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          fill: { fgColor: { rgb: "FCE4D6" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        }
      })

      ws2["!cols"] = detailHeaderDisplay.map(() => ({ wpx: 160 }))

      // -----------------------------
      // 🟢 Gộp 2 sheet vào 1 file
      // -----------------------------
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Số liệu tính BSC")
      XLSX.utils.book_append_sheet(wb, ws2, "Chi tiết công việc")

      XLSX.writeFile(wb, `bsc_ca_nhan_${period}.xlsx`)


    },
    onSearch(){
      this.loadDataReport()
    },
    async loadDataReport(){
      let period=Number(moment(this.month, 'MM/YYYY').format('YYYYMM'))

      var assignee_ids=[]
      if(this.user_selected==0){
        assignee_ids =  this.user_list.filter(r=>r.id!=0).map(x=>x.id)
      }else{
        assignee_ids=[this.user_selected]
      }

      this.dataSources=[]
      var result=await API.GetBscIndividualSummaryMonth(this,{
        period:period,
        assignee_ids:JSON.stringify(assignee_ids)
      })
      if(result){
        result=JSON.parse(result)
        this.dataSources = result.concat([]);
      }
    },
    onChangeFromMonth(event){
      if (event && event.value) {
        this.month = moment(event.value).format('MM/YYYY');
        this.loadDataReport(true)
      }
    },
    onRowDataBound(args) {
      const data = args.data
      if (!data) return

      const bscRaw = data.bsc

      // 🔴 null / undefined / rỗng
      if (bscRaw === null || bscRaw === undefined || bscRaw === '') {
        args.row.classList.add("row-bsc-danger")
        return
      }

      const bsc = Number(bscRaw)

      // 🔴 không phải số hoặc < 0.8
      if (isNaN(bsc) || bsc < 0.8) {
        args.row.classList.add("row-bsc-danger")
        return
      }

      // 🟢 > 1.02
      if (bsc > 1.02) {
        args.row.classList.add("row-bsc-success")
      }
    },
    queryCellInfo(args) {
      console.log('onCellClick',args)
      if (args.column.field == 'full_name') {
        // gắn click trực tiếp cell
        args.cell.onclick = () => {
          this.openUserDetail(args.data)
        }
      }
    },
    openUserDetail(row) {
      if (!row || !row.user_id) return

      this.$router.push({
        name: 'personal_bsc_scores',
        query: {
          userId: row.user_id,
          month: this.month
        }
      })
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
.bsc-individual-summary .info-row {
    display: table;
    width: 100%;
    table-layout: fixed; /* Bắt buộc table-cell tuân theo width */
}

.bsc-individual-summary .info-row .key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: table-caption; /*Cho lên dòng trên*/
}

.bsc-individual-summary .info-row .value {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden; /* quan trọng */
    width: auto;
    padding-left: 0px !important;
}

.bsc-individual-summary .info-row .value .select2-container {
    width: 100% !important;
}

.bsc-individual-summary.info-row .value .select2-selection {
    width: 100% !important;
    overflow: hidden !important;
}

.bsc-individual-summary .info-row .value .select2-selection__rendered {
    display: block !important;
    width: 100% !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
.bsc-individual-summary .col-button-search{
  padding-top:26px !important;
}
@media (min-width: 576px) and (max-width: 768px) {
  .bsc-individual-summary .col-button-search{
    padding-top:29px !important;
  }
} 
/* 🔴 BSC null hoặc < 0.8 */
.e-grid .row-bsc-danger,
.e-grid .row-bsc-danger.e-altrow {
  background-color: #fb7575 !important;
}
/* 🟢 BSC > 1.02 */
.e-grid .row-bsc-success,
.e-grid .row-bsc-success.e-altrow {
  background-color: #b7f5c8 !important;
}

/* chữ dễ nhìn hơn */
.e-grid .row-bsc-danger td,
.e-grid .row-bsc-success td {
  font-weight: 500;
}

.link-user {
  color: #0d6efd;
  cursor: pointer;
  text-decoration: underline;
}
</style>