<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w80 bold">Trung tâm</div>
                <div class="value">
                    <select2 
                        v-model='center_selected'
                        :options="center_list"
                        @select="onCenterChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w80 bold">Phòng ban</div>
                <div class="value">
                    <select2 
                        v-model='deparment_selected'
                        :options="department_list"
                        @select="onDeparmentChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w80 bold">Nhóm SP</div>
                <div class="value">
                    <select2 
                        v-model='group_selected'
                        :options="group_list"
                         @select="onGroupChange"
                    />
                </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w60 bold">Dự án</div>
              <div class="value">
                <select2 
                  v-model='project_selected'
                  :options="project_list.map(e=>({id:e.project_id, text:`${e.project_name} ${e.project_code ? '- ' + e.project_code : ''}`}))"
                  @select="onProjectChange"
                />
              </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
           <div class="info-row">
                <div class="key w80 bold">Từ tháng</div>
                <div class="value">
                    <div class="input-icon-right">
                        <ejs-datepicker
                            v-model="tu_thang"
                            format="MM/yyyy"
                            :showClearButton="false"
                            :allowEdit="true"
                            :strict-mode="true"
                            locale="vi"
                            @change="changeThangBD"
                            :firstDayOfWeek="1"
                            start="Year"
                            depth="Year"
                        />
                    </div>
                </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
           <div class="info-row">
                <div class="key w80 bold">Đến tháng</div>
                <div class="value">
                    <div class="input-icon-right">
                        <ejs-datepicker
                            v-model="den_thang"
                            format="MM/yyyy"
                            :showClearButton="false"
                            :allowEdit="true"
                            :strict-mode="true"
                            locale="vi"
                            @change="changeThangKT"
                            :firstDayOfWeek="1"
                            start="Year"
                            depth="Year"
                        />
                    </div>
                </div>
            </div>
          </div>

        </div>

      </div>

      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="group-buttons -bottom">
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="addNewResource()">
                  <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="updateResource()">
                  <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteResource()">
                  <span class="icon one-trash"></span>&nbsp;Xóa
                </button>&nbsp;

                <!-- <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ExportImportExcel()">
                  <span class="">Công cụ</span>
                </button>&nbsp; -->
                
                <div class="btn-group" style="min-width: 150px;">
                  <button type="button" class="btn btn-second dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Công cụ
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="ExportExcel">Export Excel</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="DownloadImportTemplate">File mẫu Import</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="ImportExcel">Import Excel</a>
                    </li>
                  </ul>
                </div>

              </div>
            </div> 
          </div>
        </div>
          
        <KDataGrid
          ref="gridDs"
          :columns="columns"
          :dataSource="dataSources"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="true"
          :showColumnCheckbox="true"
          :enabledSelectFirstRow="false"
          :showSTT="false"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
            
        />
      </div>
      
    </div>
    <!-- Modal -->
    <DetailDataResourceModal ref="detailDataResourceModal" 
      :isAdd="isAddNew" 
      :isViewDetail="isViewDetail"
      :data="rowSelected"
      @successDataResource="successDataResource"/>

    <CheckImportDataResourceModal ref="CheckImportDataResourceModal"
      :dataCheckImports="dataCheckImports"
      @successImportData="successImportData"/>

  </div>
</template>
<script>
import moment from 'moment'
import API from './API'
import * as XLSX from 'xlsx-js-style';
import DetailDataResourceModal from './DetailDataResourceModal.vue'
import CheckImportDataResourceModal from './CheckImportDataResourceModal.vue'
export default {
  name:'EffectiveResourceManagement',
  components:{
    DetailDataResourceModal,
    CheckImportDataResourceModal
  },
  data(){
    return {
      header: {
          title: "Quản lý hiệu quả nguồn lực",
          list: [
          ],
      },
      center_selected:0,
      center_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      deparment_selected:0,
      department_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      group_selected:0,
      group_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      project_list:[],
      project_selected:0,
      tu_thang:moment().startOf('year').format('MM/YYYY'),
      den_thang:moment().endOf('year').format('MM/YYYY'),
      // tu_thang:moment(new Date()).format('MM/YYYY'),
      // den_thang:moment(new Date()).format('MM/YYYY'),

      columns:[
        {
          fieldName:'work_code',
          headerText:'Mã công việc',
          allowFiltering:true,
        },
        {
          fieldName:'work_name',
          headerText:'Nội dung công việc',
          allowFiltering:true,
        },
        {
          fieldName:'parent_work_code',
          headerText:'Phụ thuộc',
          allowFiltering:true,
        },
        {
          fieldName:'project_code',
          headerText:'Mã dự án',
          allowFiltering:true
        },
        {
          fieldName:'description',
          headerText:'Giao phẩm',
          allowFiltering:true
        },
        {
          fieldName:'completion_rate',
          headerText:'Hoàn thành',
          allowFiltering:true
        },
        {
          fieldName:'plan_duration_time',
          headerText:'Thời lượng dự kiến',
          allowFiltering:true
        },
        {
          fieldName:'schedule_start_display',
          headerText:'Ngày bắt đầu dự kiến',
          allowFiltering:true
        },
        {
          fieldName:'schedule_end_display',
          headerText:'Ngày kết thúc dự kiến',
          allowFiltering:true
        },
        {
          fieldName:'actual_duration_time',
          headerText:'Thời lượng thực tế',
          allowFiltering:true
        },
        {
          fieldName:'actual_start_display',
          headerText:'Ngày bắt đầu thực tế',
          allowFiltering:true
        },
        {
          fieldName:'actual_end_display',
          headerText:'Ngày kết thúc thực tế',
          allowFiltering:true
        },
        {
          fieldName:'progress_note',
          headerText:'Diễn giải tiến độ (nếu có); Số giờ thực hiện task (đơn vị giờ)',
          allowFiltering:true
        },
        {
          fieldName:'role_r_name',
          headerText:'Vai trò R',
          allowFiltering:true
        },
        {
          fieldName:'role_a_name',
          headerText:'Vai trò A',
          allowFiltering:true
        },
        {
          fieldName:'role_c_name',
          headerText:'Vai trò C',
          allowFiltering:true
        },
        {
          fieldName:'role_i_name',
          headerText:'Vai trò I',
          allowFiltering:true
        },
      ],
      dataSources:[],
      commands:[
        {
          name: 'view_detail',
          cssClass: 'btn btn-main -ap icon-eye',
          width: 40,
          text: '',
          title: 'Xem chi tiết',
        },
        {
          name: 'edit',
          cssClass: 'btn btn-main -ap icon-pen',
          width: 40,
          text: '',
          title: 'Điều chỉnh',
        },
        {
          name: 'xoa_dulieu',
          cssClass: 'btn btn-main -ap icon-close',
          width: 40,
          text: '',
          title: 'Xóa'
        },
      ],
      isAddNew:false,
      isViewDetail:true,
      rowSelected:{},
      file:null,
      danhsach_excel:[],
      dataCheckImports:[]
    }
  },
  computed:{},
  methods:{
    changeThangBD(event){
      this.tu_thang=moment(event.value).format('MM/YYYY')
      this.initDataGrid()
    },
    changeThangKT(event){
      this.den_thang=moment(event.value).format('MM/YYYY')
      this.initDataGrid()
    },
    ExportExcel() {
      if (this.dataSources.length == 0) {
        this.$toast.error('Không có dữ liệu xuất excel')
        return
      }

      // 1. Header
      const wsData = [[
        'Mã công việc',
        'Nội dung công việc',
        'Phụ thuộc',
        'Mã dự án',
        'Giao phẩm',
        'Hoàn thành (%)',
        'Thời lượng dự kiến',
        'Ngày bắt đầu dự kiến',
        'Ngày kết thúc dự kiến',
        'Thời lượng thực tế',
        'Ngày bắt đầu thực tế',
        'Ngày kết thúc thực tế',
        'Diễn giải tiến độ',
        'Vai trò R',
        'Vai trò A',
        'Vai trò C',
        'Vai trò I',
        'Link liên quan'
      ]];

      const data = this.dataSources.concat([]);

      // 2. Push rows
      for (const item of data) {
        const row = [
          item.work_code || '',
          item.work_name || '',
          item.parent_work_code || '',
          item.project_code || '',
          item.description || '',
          item.completion_rate ?? 0,
          item.plan_duration_time ?? 0,
          item.schedule_start_display || '',
          item.schedule_end_display || '',
          item.actual_duration_time ?? 0,
          item.actual_start_display || '',
          item.actual_end_display || '',
          item.progress_note ?? 0,
          item.role_r_name || '',
          item.role_a_name || '',
          item.role_c_name || '',
          item.role_i_name || '',
          item.jira_url || '',
        ];
        wsData.push(row);
      }

      // 3. Tạo sheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // 4. Column width
      ws['!cols'] = [
        { wch: 20 }, // WP
        { wch: 100 }, // Nội dung công việc
        { wch: 20 }, // Phụ thuộc
        { wch: 40 }, // Mã dự án
        { wch: 60 }, // Giao phẩm
        { wch: 15 }, // Hoàn thành
        { wch: 25 }, // Thời lượng dự kiến
        { wch: 25 }, // Ngày bắt đầu dự kiến
        { wch: 25 }, // Ngày kết thúc dự kiến
        { wch: 25 }, // Thời lượng thực tế
        { wch: 25 }, // Ngày bắt đầu thực tế
        { wch: 25 }, // Ngày kết thúc thực tế
        { wch: 15 }, // Diễn giải tiến độ
        { wch: 40 }, // Vai trò R
        { wch: 40 }, // Vai trò A
        { wch: 40 }, // Vai trò C
        { wch: 40 }, // Vai trò I
        { wch: 40 }, // Link liên quan
      ];

      // 5. Style
      const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: this.borderAll()
      };
      const centerStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        border: this.borderAll()
      };
      const leftStyle = {
        alignment: { horizontal: 'left', vertical: 'center' },
        border: this.borderAll()
      };
      const numberStyle = {
        alignment: { horizontal: 'right', vertical: 'center' },
        border: this.borderAll()
      };

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const ref = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[ref]) continue;
          if (R === 0) ws[ref].s = headerStyle;
          else if ([5, 6, 9, 12].includes(C)) ws[ref].s = numberStyle; // % hoàn thành + durations
          else if ([7, 8, 10, 11].includes(C)) ws[ref].s = centerStyle; // ngày
          else ws[ref].s = leftStyle;
        }
      }

      // 6. Export file
      let fromDate = Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'));
      let toDate = Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'nguon_luc');
      XLSX.writeFile(wb, `quan_ly_nguon_luc_${fromDate}_${toDate}.xlsx`);
    },
    borderAll() {
      return {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      };
    },
    DownloadImportTemplate(){
      window.open("/static/files/MauFile_Import_Quan_Ly_Nguon_Luc.xlsx")
    },
    ImportExcel(){
      this.$refs.fileInput.value=null
      document.getElementById("file").click()
    },
    async commandClicked(cmdName, rowData){
      if(cmdName=='view_detail'){
        
        this.viewDetail(rowData)
      }else if(cmdName=='edit'){
        this.updateResource(rowData)
      }else if(cmdName=='xoa_dulieu'){
        this.deleteResource(rowData)
      }
    },
    viewDetail(rowData){
      this.isAddNew=false
      this.isViewDetail=true
      this.rowSelected=rowData
      // this.$refs.detailDataResourceModal.showModal()
    },
    addNewResource(){
      this.isAddNew=true
      this.isViewDetail=false
      this.rowSelected={
        center_id: this.center_selected,
        deparment_id: this.deparment_selected,
        group_id: this.group_selected
      }
      this.$refs.detailDataResourceModal.showModal()
    },
    updateResource(){

      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      if(dsSlected.length>1){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }

      this.isAddNew=false
      this.isViewDetail=false
      this.rowSelected=dsSlected[0]
      this.$refs.detailDataResourceModal.showModal()
    },
    successImportData(){
      this.initDataGrid()
    },
    onChangeFile(event){
      this.file=event.target.files[0]
      this.readFileExcel()
    },
    readFileExcel() {
      this.danhsach_excel = []
      let columns
      try {
        this.loading(true)
        if (!this.checkfile()) return

        const reader = new FileReader()
        reader.onload = (e) => {
          const wb = XLSX.read(e.target.result, { type: "binary" })
          const ws = wb.Sheets[wb.SheetNames[0]]
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

          columns = data[0]
          if (!this.kiemTraDuLieu(columns)) return

          let isError = false

          for (let i = 1; i < data.length; i++) {
            const row = data[i]

            // ==== Mapping theo file mẫu ====
            const work_code            = row[0]?.toString().trim() || null
            const work_name            = row[1]?.toString().trim() || null
            const parent_work_code     = row[2]?.toString().trim() || null
            const project_code         = row[3]?.toString().trim() || null
            const description          = row[4]?.toString().trim() || null

            const completion_rate         = row[5]?.toString().trim() || null
            const plan_duration_time      = row[6]?.toString().trim() || null
            const schedule_start_display  = row[7]?.toString().trim() || null
            const schedule_end_display    = row[8]?.toString().trim() || null

            const actual_duration_time        = row[9]?.toString().trim() || null
            const actual_start_display         = row[10]?.toString().trim() || null
            const actual_end_display           = row[11]?.toString().trim() || null
            const progress_note        = row[12]?.toString().trim() || null

            const role_r_name          = row[13]?.toString().trim() || null
            const role_a_name          = row[14]?.toString().trim() || null
            const role_c_name          = row[15]?.toString().trim() || null
            const role_i_name          = row[16]?.toString().trim() || null

            const jira_url              = row[17]?.toString().trim() || null

            const schedule_start = schedule_start_display
                ? moment(schedule_start_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null
            const schedule_end = schedule_end_display
                ? moment(schedule_end_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null
            const actual_start = actual_start_display
                ? moment(actual_start_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null
            const actual_end = actual_end_display
                ? moment(actual_end_display, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00') 
                : null

            // ==== Validate dữ liệu tối thiểu ====
            if (!work_name) {
              this.$toast.error(`Dòng ${i + 1}: thiếu Nội dung công việc`); isError = true; break
            }
            if (!project_code) {
              this.$toast.error(`Dòng ${i + 1}: thiếu Mã dự án`); isError = true; break
            }
            if (!description) {
              this.$toast.error(`Dòng ${i + 1}: thiếu Mô tả giao phẩm`); isError = true; break
            }
            if (!plan_duration_time || isNaN(plan_duration_time)) {
              this.$toast.error(`Dòng ${i + 1}: Thời lượng dự kiến phải là số`); isError = true; break
            }
            if (schedule_start_display && !moment(schedule_start_display, 'DD/MM/YYYY', true).isValid()) {
              this.$toast.error(`Dòng ${i + 1}: Ngày bắt đầu dự kiến không đúng định dạng DD/MM/YYYY`); isError = true; break
            }
            if (schedule_end_display && !moment(schedule_end_display, 'DD/MM/YYYY', true).isValid()) {
              this.$toast.error(`Dòng ${i + 1}: Ngày kết thúc dự kiến không đúng định dạng DD/MM/YYYY`); isError = true; break
            }
            if (!progress_note || isNaN(progress_note) || Number(progress_note) <= 0) {
              this.$toast.error(`Dòng ${i + 1}: Số giờ yêu cầu phải > 0`); isError = true; break
            }
            // if (actual_start_display && !moment(actual_start_display, 'DD/MM/YYYY', true).isValid()) {
            //   this.$toast.error(`Dòng ${i + 1}: Ngày bắt đầu thực tế không đúng định dạng DD/MM/YYYY`); isError = true; break
            // }
            // if (actual_end_display && !moment(actual_end_display, 'DD/MM/YYYY', true).isValid()) {
            //   this.$toast.error(`Dòng ${i + 1}: Ngày kết thúc thực tế không đúng định dạng DD/MM/YYYY`); isError = true; break
            // }

            // ==== Push object JSON chuẩn ====
            this.danhsach_excel.push({
              work_code,
              parent_work_code,
              work_name,
              project_code,
              description,

              completion_rate: completion_rate ? parseFloat(completion_rate) : 0,
              plan_duration_time: parseFloat(plan_duration_time),
              actual_duration_time: actual_duration_time ? parseFloat(actual_duration_time) : null,

              schedule_start_display: schedule_start_display,
              schedule_end_display: schedule_end_display,
              actual_start_display: actual_start_display,
              actual_end_display: actual_end_display,

              schedule_start: schedule_start,
              schedule_end: schedule_end,
              actual_start: actual_start,
              actual_end: actual_end,

              progress_note: progress_note ? parseFloat(progress_note) : null,

              role_r_name,
              role_a_name,
              role_c_name,
              role_i_name,

              jira_url
            })
          }

          if (this.danhsach_excel.length > 0 && !isError) {
            console.log("✅ Dữ liệu gửi API:", this.danhsach_excel)
            this.docfile_import_excel(this.danhsach_excel)
          }
        }
        reader.readAsBinaryString(this.file)
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi đọc file')
      } finally {
        this.loading(false)
      }
    },
    async docfile_import_excel(data){
      let result=await API.CheckImportData(this, data)
      if(Array.isArray(result)){
        this.dataCheckImports=result
        this.$refs.CheckImportDataResourceModal.showModal()
      }else{
        this.$msgBox.error("Thông báo",result)
      }
    },
    kiemTraDuLieu: function (columns) {
      if (!columns) {
        this.$toast.error('File có cấu trúc không hợp lệ!')
        return false
      }

      const requiredHeaders = [
        'Mã công việc',
        'Nội dung công việc',
        'Phụ thuộc',
        'Mã dự án',
        'Giao phẩm',
        'Hoàn thành (%)',
        'Thời lượng dự kiến',
        'Ngày bắt đầu dự kiến',
        'Ngày kết thúc dự kiến',
        'Thời lượng thực tế',
        'Ngày bắt đầu thực tế',
        'Ngày kết thúc thực tế',
        'Diễn giải tiến độ',
        'Vai trò R',
        'Vai trò A',
        'Vai trò C',
        'Vai trò I',
        'Link liên quan',
      ]

      if (columns.length !== requiredHeaders.length) {
        this.$toast.error(`File không có đủ ${requiredHeaders.length} cột yêu cầu!`)
        return false
      }

      return true
    },
    checkfile: function () {
      if (this.file == null) {
        this.$toast.error('Chưa chọn file excel')
        return false
      }
      if (this.file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        this.$toast.error('File upload không đúng định dạng')
        return false
      }
      return true
    },
    async deleteResource(){
      //var message=rowData.group_name?rowData.group_name:(rowData.department_name?rowData.department_name:(rowData.center_name?rowData.center_name:""))
      
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      let dsId=dsSlected.map(x=>x.resource_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu đang chọn?`)
      if(result==0) return
      let data=await API.DeleteDataResource(this, JSON.stringify(dsId))
      if(data=='1'){
          this.$toast.success('Xóa thành công!')
          this.initDataGrid()
      }else{
          this.$toast.error(data)
      }
    },
    async onCenterChange(){
      this.department_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.group_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.deparment_selected=0
      this.group_selected=0
      var arrParentId=[this.center_selected]
      let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
      this.department_list=this.department_list.concat(rsDeparment.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))
      arrParentId=rsDeparment.map(x=>x.department_id)
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4)
      this.group_list=this.group_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))
      this.initDataGrid()

    },
    async onDeparmentChange(){
      this.group_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.group_selected=0
      var arrParentId=[]
      if(this.deparment_selected){
        arrParentId=[this.deparment_selected]
      }else{
        arrParentId=this.department_list.filter(x=>x.id!=0).map(x=>x.id)
      }
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),4)
      this.group_list=this.group_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))

      this.initDataGrid()

    },
    onGroupChange(){
      this.initDataGrid()
    },
    onProjectChange(){
      this.initDataGrid()
    },
    successDataResource(){
      this.isAddNew=false
      this.isViewDetail=true
      this.initDataGrid()
    },
    onSuccessSaveTask(){
      this.isAddNew=false
      this.isViewDetail=true
      this.initDataGrid()
    },
    async initDataGrid(){
      let fromDate=Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
      let toDate=Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'))
      let dataRequest={
        center_id: this.center_selected,
        department_id: this.deparment_selected,
        group_id: this.group_selected,
        project_id: this.project_selected,
        from_month: fromDate,
        to_month: toDate,
      }
      var data = await API.GetResourceByUnitWithRangeMonth(this, dataRequest)
      if(data&&data!=''){
        this.dataSources=JSON.parse(data)
        console.log('initDataGrid', this.dataSources)
      }else{
        this.dataSources=[]
      }
    },
    async initDuLieu(){
      this.project_list=await API.GetAllProject(this)
      this.project_list.unshift({
          project_id: 0,
          project_code: "",
          project_name: "Tất cả"
      })
      this.project_selected=0
      let dataUnit=await API.GetAllUnit(this)
      if(dataUnit){
        this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.department_list=this.department_list.concat(dataUnit.deparments.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.group_list=this.group_list.concat(dataUnit.groups.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        //
        //Điều chỉnh default TTKD giải pháp số
        if(this.center_list.findIndex(x=>x.id==14)>-1){
          this.center_selected=14
          this.onCenterChange()
        }else{
          this.initDataGrid()
        }
      }

    }
  },
  mounted(){
    setTimeout(()=>{
      this.initDuLieu()
    }, 200)
  }
}
</script>
<style scoped>
::v-deep(.e-input-group.e-control-wrapper) {
  border-radius: 4px !important;
  border-color: #E0E0E0 !important;
}
</style>