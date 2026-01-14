<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupCheckImportActualRevenue"
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
    name:'CheckImportActualRevenueModal',
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
                fieldName:'revenue_type_name',
                headerText:'Loại doanh thu',
                allowFiltering:true
            },
            {
                fieldName:'project_name',
                headerText:'Dự án',
                allowFiltering:true
            },
            {
                fieldName:'revenue',
                headerText:'Doanh thu thực tế',
                allowFiltering:true,
                valueAccessor:this.formatVND
            }
            
        ],
        dataSources:[],
      }
    },
    methods:{
      showModal() {
          this.$refs["popupCheckImportActualRevenue"].show()
      },
      hideModal() {
          this.$refs["popupCheckImportActualRevenue"].hide()
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
      groupRevenueData(data) {
          const sortByPeriod = (a, b) => {
              const [ma, ya] = a.period_display.split('/').map(Number);
              const [mb, yb] = b.period_display.split('/').map(Number);
              return ya - yb || ma - mb;
          };

          const groupedMap = new Map();

          data.forEach(item => {
              const key = JSON.stringify({
                  actual_revenue_id:item.actual_revenue_id,
                  center_name: item.center_name,
                  department_name: item.department_name,
                  group_name: item.group_name,
                  item_revenue_name: item.item_revenue_name,
                  project_name: item.project_name,
                  revenue_type_name: item.revenue_type_name
              });

              if (!groupedMap.has(key)) {
                  groupedMap.set(key, []);
              }

              groupedMap.get(key).push({
                  actual_revenue_detail_id:item.actual_revenue_detail_id,
                  actual_revenue_detail_id_1:item.actual_revenue_detail_id_1,
                  actual_revenue_detail_id_2:item.actual_revenue_detail_id_2,
                  period_display: item.period_display,
                  revenue: parseFloat(item.revenue) || 0
              });
          });

          const result = Array.from(groupedMap.entries()).map(([key, periods]) => {
              const group = JSON.parse(key);
              const sorted = periods.sort(sortByPeriod);
              const totalRevenue = sorted.reduce((sum, p) => sum + p.revenue, 0);

              return {
                  ...group,
                  from_period_display: sorted[0]?.period_display || null,
                  to_period_display: sorted[sorted.length - 1]?.period_display || null,
                  revenue: totalRevenue,
                  actual_revenue_details: sorted
              };
          });

          return result;
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
        let dataRequest = this.groupRevenueData(this.dataSources.map(({ actual_revenue_id, actual_revenue_detail_id, actual_revenue_detail_id_1,actual_revenue_detail_id_2, center_name, department_name, group_name, item_revenue_name, project_name, period_display, revenue, revenue_type_name}) => ({
           actual_revenue_id, actual_revenue_detail_id, actual_revenue_detail_id_1,actual_revenue_detail_id_2, center_name, department_name, group_name, item_revenue_name, project_name, period_display, revenue, revenue_type_name
        })));
        console.log("dataRequest",dataRequest)
        let rs=await API.ImportActualRevenue(this, dataRequest)
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
