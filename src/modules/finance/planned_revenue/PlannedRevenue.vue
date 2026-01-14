<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <input ref="fileInput" id="file" type="file" @change="onChangeFile($event)" accept=".xls, .xlsx" style="display:none" class="form-control ">
        <div class="row">
          <div class="col-sm-2 col-12">
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
                        v-model='deparment_selected'
                        :options="department_list"
                        @select="onDeparmentChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w120 bold center">Nhóm sản phẩm</div>
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
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="editPlannedRevenue()">
                  <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deletePlannedRevenue()">
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
          <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-5">
            Tổng doanh thu: {{totalPlannedRevnue}}
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
    <PlannedRevenueModal ref="plannedRevenueModal" 
      :isAdd="isAddNew" 
      :isViewDetail="isViewDetail"
      :data="rowSelected"
      @successPlannedRevenue="successPlannedRevenue"/>

      <CheckImportPlannedRevenueModal ref="checkImportPlannedRevenueModal"
        :dataCheckImports="dataCheckImports"
        @successImportData="successImportData"/>
  </div>
</template>
<script>
import moment from 'moment'
import PlannedRevenueModal from './PlannedRevenueModal.vue'
import API from './API'
import * as XLSX from 'xlsx-js-style';
import CheckImportPlannedRevenueModal from './CheckImportPlannedRevenueModal.vue'
export default {
  name:'PlannedRevenue',
  components:{
    PlannedRevenueModal,
    CheckImportPlannedRevenueModal
  },
  data(){
    return {
      header: {
          title: "Quản lý doanh thu kế hoạch",
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
      tu_thang:moment().startOf('year').format('MM/YYYY'),
      den_thang:moment().endOf('year').format('MM/YYYY'),

      columns:[
            {
                fieldName:'center_name',
                headerText:'Trung tâm',
                allowFiltering:true,
            },
            {
                fieldName:'department_name',
                headerText:'Phòng ban',
                allowFiltering:true
            },
            {
                fieldName:'group_name',
                headerText:'Nhóm sản phẩm',
                allowFiltering:true
            },
            {
                fieldName:'revenue',
                headerText:'Doanh thu kế hoạch (VNĐ)',
                allowFiltering:true,
                valueAccessor:this.formatVND
            },
            {
                fieldName:'period_display',
                headerText:'Tháng',
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
    totalPlannedRevnue(){
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
      this.$refs.plannedRevenueModal.showModal()
    },
    formatCurrencyVND(value) {
      if (typeof value !== 'number') return '0';
      return value.toLocaleString('vi-VN');
    },
    ExportExcel(){
      if(this.dataSources.length==0){
        this.$toast.error('Không có dữ liệu xuất excel')
        return
      }
      // 1. Chuẩn bị header
      const wsData = [
        ['Trung tâm', 'Phòng ban', 'Nhóm sản phẩm', 'Tháng', 'Hạng mục', 'Dự án', 'Doanh thu kế hoạch']
      ];
      var data=this.dataSources.concat([])
      // 2. Group theo center/department/group
      data.sort((a, b) => {
        return a.center_name?.localeCompare(b.center_name || '') ||
              a.department_name?.localeCompare(b.department_name || '') ||
              a.group_name?.localeCompare(b.group_name || '') ||
              a.period - b.period;
      });

      // 3. Push dòng dữ liệu
      const startRows = []; // để lưu vị trí merge
      let lastKey = '';
      let startRow = 1;

      for (const item of data) {
        const row = [
          item.center_name || '',
          item.department_name || '',
          item.group_name || '',
          item.period_display,
          item.item_revenue_name||'',
          item.project_name||'',
          item.revenue ?? 0
        ];

        wsData.push(row);

        const currentKey = `${item.center_name}|${item.department_name}|${item.group_name}`;
        if (currentKey !== lastKey) {
          startRows.push({ row: wsData.length - 1, key: currentKey });
          lastKey = currentKey;
        }
      }

      // 4. Tạo sheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      //Thêm width cho cột
      ws['!cols'] = [
        { wch: 60 }, // Trung tâm
        { wch: 60 }, // Phòng ban
        { wch: 60 }, // Nhóm sản phẩm
        { wch: 40 }, // Tháng
        { wch: 60 }, // Hạng mục
        { wch: 60 }, // Dự án
        { wch: 60 }, // Doanh thu kế hoạch
      ];

      // 5. Merge các cột theo block: center, department, group
      const merges = [];
      const endRow = wsData.length - 1;

       ['center_name', 'department_name', 'group_name'].forEach((field, colIdx) => {
          let prev = '';
          let start = null;

          for (let r = 1; r <= endRow + 1; r++) {
            const curr = wsData[r]?.[colIdx] ?? '';
            if (curr && curr === prev) {
              continue;
            }

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

      // 6. Style header và các cell
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
          else if (C === 6) ws[ref].s = numberStyle;
          else ws[ref].s = centerStyle;
        }
      }

      // 7. Xuất file
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Doanh thu kế hoạch');
      XLSX.writeFile(wb, 'doanh_thu_ke_hoach.xlsx');
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
      window.open("/static/files/MauFile_Import_Doanh_Thu_Ke_Hoach.xlsx")
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
        this.editPlannedRevenue(rowData)
      }else if(cmdName=='xoa_dulieu'){
        this.deletePlannedRevenue(rowData)
      }
    },
    viewDetail(rowData){
      this.isAddNew=false
      this.isViewDetail=true
      this.rowSelected=rowData
      this.$refs.plannedRevenueModal.showModal()
    },
    //editPlannedRevenue(rowData){
    editPlannedRevenue(){

      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      

      this.isAddNew=false
      this.isViewDetail=false
      this.rowSelected=dsSlected[0]
      this.$refs.plannedRevenueModal.showModal()
    },
    successImportData(){
      this.initDataGrid()
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
                          var center_name = data[i][0]!=undefined?data[i][0].toString().trim():null
                          var department_name=data[i][1]!=undefined?data[i][1].toString().trim():null
                          var group_name=data[i][2]!=undefined?data[i][2].toString().trim():null
                          if((!center_name||center_name.toString().trim()=='')&&(!department_name||department_name.toString().trim()=='')&&(!group_name||group_name.toString().trim()=='')){
                            this.$toast.error(`Dòng số ${i+1} dữ liệu ít nhất phải có Trung tâm hoặc Phòng ban hoặc Nhóm sản phẩm`)
                            isError=true
                            break
                          }
                          var period_display=data[i][3]!=undefined?data[i][3].toString().trim():null
                          if (period_display && moment(period_display, 'MM/YYYY', true).isValid()) {} else {
                            this.$toast.error(`Dòng số ${i+1} dữ liệu tháng doanh thu không đúng định dạng MM/yyyy, vui lòng nhập lại`)
                            isError=true
                             break
                          }
                          var revenue=data[i][6]!=undefined?data[i][6].toString().trim():null
                          if (revenue !== null && revenue !== '' && !isNaN(revenue)) {} else {
                            this.$toast.error(`Dòng số ${i+1} dữ liệu phải là số, vui lòng nhập lại`)
                            isError=true
                            break
                          }
                          var item_revenue_name=data[i][4]!=undefined?data[i][4].toString().trim():null
                          if(!item_revenue_name||item_revenue_name==''){
                            this.$toast.error(`Dòng số ${i+1} phải nhập dữ liệu hạng mục, vui lòng nhập lại`)
                            isError=true
                            break
                          }
                          this.danhsach_excel.push({
                              center_name:center_name,
                              department_name:department_name,
                              group_name:group_name,
                              period_display:period_display,
                              item_revenue_name:item_revenue_name,
                              project_name:data[i][5]!=undefined?data[i][5].toString().trim():null,
                              revenue:revenue
                          })
                        }
                        if(this.danhsach_excel.length>0&&!isError){
                            this.docfile_doanhthu_kehoach(this.danhsach_excel)
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
    async docfile_doanhthu_kehoach(data){
      let result=await API.CheckImportPlannedRevenue(this, data)
      if(Array.isArray(result)){
        this.dataCheckImports=result
        this.$refs.checkImportPlannedRevenueModal.showModal()
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
            this.$toast.error('File excel gồm 7 trường theo thứ tự:  Trung tâm, Phòng ban, Nhóm sản phẩm, Tháng, Hạng mục, Dự án, Doanh thu kế hoạch!')
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
    //async deletePlannedRevenue(rowData){
    async deletePlannedRevenue(){
      //var message=rowData.group_name?rowData.group_name:(rowData.department_name?rowData.department_name:(rowData.center_name?rowData.center_name:""))
      
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      let dsIdPlannedRevenues=dsSlected.map(x=>x.planned_revenue_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu doanh thu kế hoạch đang chọn?`)
      if(result==0) return
      let data=await API.DeletePlannedRevenue(this, JSON.stringify(dsIdPlannedRevenues))
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
    successPlannedRevenue(){
      this.isAddNew=false
      this.isViewDetail=true
      this.initDataGrid()
    },
    async initDataGrid(){
      let fromDate=Number(moment(this.tu_thang, 'MM/YYYY').format('YYYYMM'))
      let toDate=Number(moment(this.den_thang, 'MM/YYYY').format('YYYYMM'))
      let data=await API.GetPlannedRevenue(this, this.center_selected, this.deparment_selected, this.group_selected,fromDate, toDate)
      if(data&&data!=''){
        this.dataSources=JSON.parse(data)
      }else{
        this.dataSources=[]
      }
    },
    async initDuLieu(){
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

        const { department_id, from_date, to_date } = this.$route.query
        if (department_id && from_date && to_date) {
          // Có đủ 3 tham số
          this.deparment_selected=department_id
          this.tu_thang=moment(from_date, 'YYYYMM').format('MM/YYYY')
          this.den_thang=moment(to_date, 'YYYYMM').format('MM/YYYY')
          this.onDeparmentChange()
        } else {
          // Thiếu ít nhất 1 tham số
          //Điều chỉnh default TTCNTT đầu tiên
          if(this.center_list.findIndex(x=>x.id==2)>-1){
            this.center_selected=2
            this.onCenterChange()
          }else{
            this.initDataGrid()
          }
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