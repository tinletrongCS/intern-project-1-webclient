<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupCheckImportPlannedRevenue"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                 <KDataGrid
                      ref="gridCheckImport"
                      :columns="columns"
                      :dataSource="dataSources"
                      :enable-paging-server="false"
                      :allowPaging="false"
                      :showFilter="false"
                      :showColumnCheckbox="false"
                      :enabledSelectFirstRow="false"
                      :showSTT="true"
                      :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                      @rowDataBound="rowDataBound"
                      @queryCellInfo="queryCellInfo"
                  />
                  <div class="group-buttons -bottom right" style="margin-top: 37px !important;margin-bottom: 10px !important;">
                      <button @click="onSave"  class="btn btn-second nocorner" style="width: 180px">
                          <span class="icon one-save"></span> Lưu thay đổi
                      </button>
                  </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import moment from 'moment'
import API from './API'
export default {
    name:'CheckImportPlannedRevenueModal',
    props:{
      dataCheckImports:{
        type:Array,
        default: () => []
      }
    },
    data(){
      return {
        target: '.main-wrapper',
        animationSettings: { effect: 'Zoom' },
        header:`<span class="icon one-notepad"></span> Kiểm tra dữ liệu từ file`,
        columns:[
          {
                fieldName:'status_name',
                headerText:'Trạng thái',
                allowFiltering:true,
                width:"120"
            },
            {
                fieldName:'error_message',
                headerText:'Lỗi',
                allowFiltering:true
            },
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
                fieldName:'period_display',
                headerText:'Tháng',
                allowFiltering:true
            },
            {
                fieldName:'item_revenue_name',
                headerText:'Hạng mục',
                allowFiltering:true
            },
            {
                fieldName:'project_name',
                headerText:'Dự án',
                allowFiltering:true
            },
            {
                fieldName:'revenue',
                headerText:'Doanh thu kế hoạch',
                allowFiltering:true,
                valueAccessor:this.formatVND
            }
            
        ],
        dataSources:[],
      }
    },
    methods:{
      showModal() {
          this.$refs["popupCheckImportPlannedRevenue"].show()
      },
      hideModal() {
          this.$refs["popupCheckImportPlannedRevenue"].hide()
      },
      handleShowModal(){
          this.clear()
          setTimeout(()=>{
              this.initDataPopup()
          },200)
      },
      clear(){
        this.dataSources=[]
      },
      initDataPopup(){
        this.dataSources=this.dataCheckImports
      },
      formatVND(field, data, column) {
        if (typeof data[field] !== 'number') return '';
        return new Intl.NumberFormat('vi-VN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(data[field])// + ' ₫';
      },
      async onSave(){
        //check file có lỗi không
        const rowErrors=this.dataSources.filter(x=>x.is_error)
        if(rowErrors.length>0){
          this.$msgBox.error("Thông báo","Danh sách dữ liệu vẫn tồn tại lỗi, vui lòng kiểm tra lại dữ liệu nhập!")
          return
        }
        //
        let result = await this.$confirm('Thông báo', `Bạn có chắc chắn muốn **import** danh sách này không? Việc này có thể cập nhật hoặc thêm mới dữ liệu hiện có.`)
        if(result==0) return
        let data = this.dataSources.map(({ planned_revenue_id, project_id, unit_id, item_id, period, revenue }) => ({
          planned_revenue_id,
          project_id,
          unit_id,
          item_id,
          period,
          revenue
        }));
        let rs=await API.ImportPlannedRevenue(this, data)
        if(rs=='1'){
          this.$msgBox.success("Thông báo","Import thành công!")
          this.$emit("successImportData")
          this.hideModal()
        }else{
           this.$msgBox.error("Thông báo",rs)
        }


      },
      rowDataBound(args){
        // if (args.data.is_error) {
        //   args.row.setAttribute(
        //     'style',
        //     'background-color: #f8d7da !important; color: #842029;',
        //   );
        // } else if (args.data.is_update) {
        //   args.row.setAttribute(
        //     'style',
        //     'background-color: #fff3cd !important; color: #664d03;',
        //   );
        // } else {
        //   args.row.setAttribute(
        //     'style',
        //     'background-color: #d1e7dd !important; color: #0f5132;',
        //   );
        // }
        
      },
      queryCellInfo(args){
          const field = args.column.field;
          const data = args.data;
          // Tô màu chữ cho từng ô theo logic riêng
          if (field === 'status_name') {
            if (data.is_update) {
              // Màu vàng nâu đậm hơn
              args.cell.setAttribute(
                'style',
                'color: #b26a00; font-weight: 600;'
              );
            } else {
              // Màu xanh đậm hơn
              args.cell.setAttribute(
                'style',
                'color: #1b5e20; font-weight: 600;'
              );
            }
          }else if(field === 'error_message'){
            if (data.is_error) {
              // Màu vàng nâu đậm hơn
              args.cell.setAttribute(
                'style',
                'color: #842029; font-weight: 600;'
              );
            } 
          }
      }
    }
}
</script>
