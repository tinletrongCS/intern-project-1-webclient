<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w60 bold center">Địa bàn</div>
                <div class="value">
                    <select2 
                        v-model='region_selected'
                        :options="region_list"
                        @select="onRegionChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w80 bold center">Trung tâm</div>
                <div class="value">
                    <select2 
                        v-model='center_selected'
                        :options="center_list"
                        @select="onCenterChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w80 bold center">Phòng ban</div>
                <div class="value">
                    <select2 
                        v-model='department_selected'
                        :options="department_list"
                         @select="onDepartmentChange"
                    />
                </div>
            </div>
          </div>

          <div class="col-sm-2 col-12">
           <div class="info-row">
                <div class="key w80 bold center">Từ tháng</div>
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
                <div class="key w80 bold center">Đến tháng</div>
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
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ThemMoi()">
                  <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
                </button>&nbsp;

                <!-- <button class="btn btn-second" style="min-width: 100px;" @click.prevent="ExportImportExcel()">
                  <span class="">Công cụ</span>
                </button>&nbsp; -->
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="editRevenue()">
                  <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteRevenue()">
                  <span class="icon one-trash"></span>&nbsp;Xóa
                </button>&nbsp;
                
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
          <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-5">
            Tổng doanh thu: {{totalRevnue}}
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
              :showSTT="true"
              :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
              
          />
          <!-- :commands="commands" 
              :commandColumn="{headerText: 'Chức năng',cellCssClass: 'css1', show: true, firstColumn:true}"
              @commandClicked="commandClicked" -->
      </div>
      
    </div>
    <!-- Modal -->
    <PlannedRevenueRegionModal ref="plannedRevenueRegionModal" 
      :isAdd="isAddNew" 
      :isViewDetail="isViewDetail"
      @successPlannedRevenueRegion="successPlannedRevenueRegion"
      :data="rowSelected"/>
    <CheckImportPlannedRevenueRegionModal ref="checkImportPlannedRevenueRegionModal"
        :dataCheckImports="dataCheckImports"
        @successImportData="successImportData"/>
  </div>
</template>
<script>
import moment from 'moment'
import PlannedRevenueRegionModal from './PlannedRevenueRegionModal.vue'
import API from './API'
import * as XLSX from 'xlsx-js-style';
import CheckImportPlannedRevenueRegionModal from './CheckImportPlannedRevenueRegionModal.vue'
export default {
  name:'PlannedRevenueRegion',
  components:{
    PlannedRevenueRegionModal,
    CheckImportPlannedRevenueRegionModal
  },
  data(){
    return {
      header: {
          title: "Quản lý doanh thu kế hoạch địa bàn",
          list: [
          ],
      },
      region_selected:0,
      region_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      center_selected:0,
      center_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      department_selected:0,
      department_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      tu_thang:moment().startOf('year').format('MM/YYYY'),
      den_thang:moment().endOf('year').format('MM/YYYY'),
      columns:[
            {
                fieldName:'region_name',
                headerText:'Địa bàn',
                allowFiltering:true,
            },
            {
                fieldName:'center_name',
                headerText:'Trung tâm',
                allowFiltering:true
            },
            {
                fieldName:'department_name',
                headerText:'Phòng ban',
                allowFiltering:true
            },
            {
                fieldName:'revenue',
                headerText:'Doanh thu kế hoạch (VNĐ)',
                allowFiltering:true,
                valueAccessor:this.formatVND
            },
            {
                fieldName:'from_period_display',
                headerText:'Từ tháng',
                allowFiltering:true
            },
            {
                fieldName:'to_period_display',
                headerText:'Đến tháng',
                allowFiltering:true
            }
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
  computed:{
    totalRevnue(){
      if(this.dataSources.length==0) return 0
      const totalRevenue = this.dataSources.reduce((sum, item) => {
        return sum + (item.revenue || 0);
      }, 0)
      return this.formatCurrencyVND(totalRevenue)
    }
  },
  methods:{
    changeThangBD(event){
      this.tu_thang=moment(event.value).format('MM/YYYY')
      this.initDataGrid()
    },
    changeThangKT(event){
      this.den_thang=moment(event.value).format('MM/YYYY')
      this.initDataGrid()
    },
    ThemMoi(){
      this.isAddNew=true
      this.isViewDetail=false
      this.$refs.plannedRevenueRegionModal.showModal()
    },
    formatCurrencyVND(value) {
      if (typeof value !== 'number') return '0';
      return value.toLocaleString('vi-VN');
    },
    async ExportExcel(){
      let fromDate=Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
      let toDate=Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'))
      var result=await API.GetPlannedRevenueRegionExportExcel(this, this.region_selected, this.center_selected, this.department_selected,fromDate, toDate)
      result=JSON.parse(result)
      if(result.length==0){
        this.$toast.error('Không có dữ liệu xuất excel')
        return
      }
      
      // 1. Chuẩn bị header
      const wsData = [
        ['Địa bàn', 'Trung tâm', 'Phòng ban', 'Tháng', 'Hạng mục', 'Doanh thu kế hoạch địa bàn']
      ];

      const data = result.concat([]);

      // 2. Sort theo địa bàn/trung tâm/phòng ban/period
      data.sort((a, b) => {
        return a.region_name?.localeCompare(b.region_name || '') ||
              a.center_name?.localeCompare(b.center_name || '') ||
              a.department_name?.localeCompare(b.department_name || '') ||
              a.period - b.period;
      });

      // 3. Push dòng dữ liệu
      const startRows = [];
      let lastKey = '';
      let startRow = 1;

      for (const item of data) {
        const row = [
          item.region_name || '',
          item.center_name || '',
          item.department_name || '',
          item.period_display,
          item.item_revenue_name || '',
          item.revenue_month ?? 0
        ];

        wsData.push(row);

        const currentKey = `${item.region_name}|${item.center_name}|${item.department_name}`;
        if (currentKey !== lastKey) {
          startRows.push({ row: wsData.length - 1, key: currentKey });
          lastKey = currentKey;
        }
      }

      // 4. Tạo sheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // 5. Cấu hình độ rộng cột
      ws['!cols'] = [
        { wch: 60 }, // Địa bàn
        { wch: 60 }, // Trung tâm
        { wch: 60 }, // Phòng ban
        { wch: 40 }, // Tháng
        { wch: 60 }, // Hạng mục
        { wch: 60 }  // Doanh thu kế hoạch địa bàn
      ];

      // 6. Merge các cột theo block
      const merges = [];
      const endRow = wsData.length - 1;

      ['region_name', 'center_name', 'department_name'].forEach((field, colIdx) => {
        let prev = '';
        let start = null;

        for (let r = 1; r <= endRow + 1; r++) {
          const curr = wsData[r]?.[colIdx] ?? '';
          if (curr && curr === prev) continue;

          if (start !== null && r - start > 1) {
            merges.push({
              s: { r: start, c: colIdx },
              e: { r: r - 1, c: colIdx }
            });
          }

          prev = curr;
          start = curr ? r : null;
        }
      });
      ws['!merges'] = merges;

      // 7. Style
      const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: this.borderAll()
      };
      const centerStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        border: this.borderAll()
      };
      const numberStyle = {
        alignment: { horizontal: 'right' },
        border: this.borderAll(),
        numFmt: '#,##0 [$₫-vi-VN]'
      };

      // Apply styles
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const ref = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[ref]) continue;
          if (R === 0) ws[ref].s = headerStyle;
          else if (C === 5) ws[ref].s = numberStyle; // Cột cuối: Doanh thu
          else ws[ref].s = centerStyle;
        }
      }

      // 8. Xuất file
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Doanh thu kế hoạch địa bàn');
      XLSX.writeFile(wb, 'doanh_thu_ke_hoach_dia_ban.xlsx');
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
      window.open("/static/files/MauFile_Import_Doanh_Thu_Ke_Hoach_Dia_Ban.xlsx")
    },
    ImportExcel(){
      this.$refs.fileInput.value=null
      document.getElementById("file").click()
    },
    formatVND(field, data, column) {
      if (typeof data[field] !== 'number') return '';
      return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(data[field])// + ' ₫';
    },
    async commandClicked(cmdName, rowData){
      if(cmdName=='view_detail'){
        
        this.viewDetail(rowData)
      }else if(cmdName=='edit'){
       // this.editRevenue(rowData)
      }else if(cmdName=='xoa_dulieu'){
       // this.deleteRevenue(rowData)
      }
    },
    successImportData(){
      this.initDataGrid()
    },
    viewDetail(rowData){
      this.isAddNew=false
      this.isViewDetail=true
      this.rowSelected=rowData
      this.$refs.plannedRevenueRegionModal.showModal()
    },
    //editRevenue(rowData){
    editRevenue(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      if(dsSlected.length>1){
        this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!')
        return
      }
      this.isAddNew=false
      this.isViewDetail=false
      this.rowSelected=dsSlected[0]
      this.$refs.plannedRevenueRegionModal.showModal()
    },
    onChangeFile(event){
      this.file=event.target.files[0]
      this.readFileExcel()
    },
    readFileExcel(){
        this.danhsach_excel=[]
        let columns
        try {
            this.loading(true)
            if (this.checkfile()) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    /* Parse data */
                    const bstr = e.target.result
                    const wb = XLSX.read(bstr, { type: "binary" })
                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    columns=data[0]
                    //Trung tâm, Phòng ban, Nhóm sản phẩm, Tháng, Hạng mục, Dự án, Doanh thu kế hoạch
                    if(this.kiemTraDuLieu(columns)){
                      var isError=false
                        for(var i=1;i<data.length;i++){

                          var region_name = data[i][0]!=undefined?data[i][0].toString().trim():null
                          var center_name=data[i][1]!=undefined?data[i][1].toString().trim():null
                          var department_name=data[i][2]!=undefined?data[i][2].toString().trim():null

                          if((!region_name||center_name.toString().trim()=='')&&(!center_name||center_name.toString().trim()=='')&&(!department_name||department_name.toString().trim()=='')){
                            this.$toast.error(`Dòng số ${i+1} dữ liệu ít nhất phải có Địa bàn hoặc Trung tâm hoặc Phòng ban`)
                            isError=true
                            break
                          }
                          var period_display=data[i][3]!=undefined?data[i][3].toString().trim():null
                          if (period_display && moment(period_display, 'MM/YYYY', true).isValid()) {} else {
                            this.$toast.error(`Dòng số ${i+1} dữ liệu tháng doanh thu không đúng định dạng MM/yyyy, vui lòng nhập lại`)
                            isError=true
                             break
                          }

                          var field_name=data[i][4]!=undefined?data[i][4].toString().trim():null
                          if(!field_name||field_name==''){
                            this.$toast.error(`Dòng số ${i+1} phải nhập dữ liệu lĩnh vực`)
                            isError=true
                            break
                          }

                          var revenue_type=data[i][5]!=undefined?data[i][5].toString().trim():null
                          if (revenue_type !== null && revenue_type !== '') {} else {
                            this.$toast.error(`Dòng số ${i+1} dữ liệu loại doanh thu đang trống`)
                            isError=true
                            break
                          }


                          var revenue=data[i][7]!=undefined?data[i][7].toString().trim():null
                          if (revenue !== null && revenue !== '' && !isNaN(revenue)) {} else {
                            this.$toast.error(`Dòng số ${i+1} dữ liệu phải là số, vui lòng nhập lại`)
                            isError=true
                            break
                          }
                          var item_revenue_name=data[i][6]!=undefined?data[i][6].toString().trim():null
                          if(!item_revenue_name||item_revenue_name==''){
                            this.$toast.error(`Dòng số ${i+1} phải nhập dữ liệu hạng mục, vui lòng nhập lại`)
                            isError=true
                            break
                          }
                          this.danhsach_excel.push({
                              region_name:region_name,
                              center_name:center_name,
                              department_name:department_name,
                              period_display:period_display,
                              item_revenue_name:item_revenue_name,
                              revenue:revenue,
                              revenue_type_name:revenue_type,
                              field_name:field_name
                          })
                        }
                        if(this.danhsach_excel.length>0&&!isError){
                            this.docfile_doanhthu_kehoach_diaban(this.danhsach_excel)
                        }
                    }
                    
                }
                reader.readAsBinaryString(this.file)
            }
        } catch (error) {
            this.$toast.error('Có lỗi xảy ra khi đọc file')
        } finally {
            this.loading(false)
        }
    },
    async docfile_doanhthu_kehoach_diaban(data){
      let result=await API.CheckImportPlannedRevenueRegion(this, data)
      if(Array.isArray(result)){
        this.dataCheckImports=result
        this.$refs.checkImportPlannedRevenueRegionModal.showModal()
      }else{
        this.$msgBox.error("Thông báo",result)
      }
    },
    

    kiemTraDuLieu: function (columns) {
        if (columns == null) {
            this.$toast.error('File có cấu trúc không hợp lệ!')
            return false
        }
        if(columns.length<=1){
            this.$toast.error('File excel gồm 7 trường theo thứ tự:  Trung tâm, Phòng ban, Nhóm sản phẩm, Tháng, Hạng mục, Dự án, Doanh thu thực tế!')
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
    //async deleteRevenue(rowData){
    async deleteRevenue(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      let dsId=dsSlected.map(x=>x.planned_revenue_region_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu doanh thu kế hoạch địa bàn đang chọn?`)
      if(result==0) return
      
      let data=await API.DeletePlannedRevenueRegion(this, JSON.stringify(dsId))
      if(data=='1'){
          this.$toast.success('Xóa thành công!')
          this.initDataGrid()
      }else{
          this.$toast.error(data)
      }

    },
    async onRegionChange(){
      this.center_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.department_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.center_selected=0
      this.department_selected=0
      var arrParentId=[this.region_selected]
      let rsDeparment=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),2)
      this.center_list=this.center_list.concat(rsDeparment.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))
      arrParentId=rsDeparment.map(x=>x.department_id)
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
      this.department_list=this.department_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))
      this.initDataGrid()

    },
    async onCenterChange(){
      this.department_list=[
        {
          id:0,
          text:'Tất cả'
        }
      ]
      this.department_selected=0
      var arrParentId=[]
      if(this.center_selected){
        arrParentId=[this.center_selected]
      }else{
        arrParentId=this.center_list.filter(x=>x.id!=0).map(x=>x.id)
      }
      let rsGroup=await API.GetUnitByParentId(this, JSON.stringify(arrParentId),3)
      this.department_list=this.department_list.concat(rsGroup.map(x=>{
        return {
          id:x.department_id,
          text:x.name
        }
      }))

      this.initDataGrid()

    },
    onDepartmentChange(){
      this.initDataGrid()
    },
    successPlannedRevenueRegion(){
      this.isAddNew=false
      this.isViewDetail=true
      this.initDataGrid()
    },
    async initDataGrid(){
      let fromDate=Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
      let toDate=Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'))
      let data=await API.GetPlannedRevenueRegion(this, this.region_selected, this.center_selected, this.department_selected,fromDate, toDate)
      if(data&&data!=''){
        this.dataSources=JSON.parse(data)
      }else{
        this.dataSources=[]
      }
    },
    async initDuLieu(){
      let dataUnit=await API.GetAllUnit(this)
      if(dataUnit){
        this.region_list=this.region_list.concat(dataUnit.regions.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.center_list=this.center_list.concat(dataUnit.centers.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        this.department_list=this.department_list.concat(dataUnit.departments.map(x=>{
          return {
            id:x.department_id,
            text:x.name
          }
        }))
        
        //Điều chỉnh default TTCNTT đầu tiên
        if(this.region_list.findIndex(x=>x.id==1)>-1){
          this.region_selected=1
          this.onRegionChange()
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