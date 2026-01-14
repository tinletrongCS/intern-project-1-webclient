<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupUserDayOffCheckImportDataResource"
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
    name:'CheckImportDataResourceModal',
    props:{
      dataCheckImports:{
        type:Array,
        default: () => []
      },
      thang_nam_modal: {
        type: String,
        default: ''
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
            width:'120'
          },
          {
            fieldName:'error_message',
            headerText:'Lỗi',
            allowFiltering:true,
          },
          {
            fieldName:'user_code',
            headerText:'Mã nhân viên',
            allowFiltering:true,
          },
          {
            fieldName:'full_name',
            headerText:'Họ và tên',
            allowFiltering:true,
          },
          {
            fieldName:'department_name',
            headerText:'Bộ phận',
            allowFiltering:true,
          },
          {
            fieldName:'total_paid_days',
            headerText:'Công chuẩn',
            allowFiltering:true
          },
          {
            fieldName:'day_off_count',
            headerText:'Ngày trực tiếp làm việc được hưởng lương',
            allowFiltering:true
          },
          {
            fieldName:'email',
            headerText:'Email',
            allowFiltering:true
          },
          
        ],
        dataSources:[],
      }
    },
    methods:{
      showModal() {
        this.clear()
        setTimeout(()=>{
          this.initDataPopup()
        },200)
        
        this.$refs["popupUserDayOffCheckImportDataResource"].show()
      },
      hideModal() {
        this.$refs["popupUserDayOffCheckImportDataResource"].hide()
      },
      handleShowModal(){

      },
      clear(){
        this.dataSources=[]
      },
      initDataPopup(){
        this.dataSources=this.dataCheckImports
      },
      async onSave(){
        //check file có lỗi không
        const rowErrors=this.dataSources.filter(x=>x.is_error)
        if(rowErrors.length>0){
          this.$msgBox.error("Thông báo","Danh sách dữ liệu vẫn tồn tại lỗi, vui lòng kiểm tra lại dữ liệu nhập!")
          return
        }
        let result = await this.$confirm('Thông báo', `Bạn có chắc chắn muốn **import** danh sách này không? Việc này có thể cập nhật hoặc thêm mới dữ liệu hiện có.`)
        if(result==0) return
        let rs=await API.DoImportDataResource(this, this.dataSources, this.thang_nam_modal)
        console.log('rs', rs)
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
          }
          else if (field === 'error_message') {
            if (data.is_error) {
              // Màu vàng nâu đậm hơn khi có lỗi
              args.cell.setAttribute(
                'style',
                'color: #842029; font-weight: 600;'
              );
            }

            let content = data?.error_message;
            
            if (content) {
              // Bỏ \n đầu dòng nếu có
              content = content.replace(/^\s*\n/, '');

              // Xuống dòng bằng <br/>
              content = content.replace(/\n/g, '<br/>');

              // Dùng innerHTML để render HTML
              args.cell.innerHTML = content;

              // Style hiển thị đẹp
              args.cell.style.whiteSpace = 'normal';  // Cho phép hiển thị xuống dòng
              args.cell.style.lineHeight = '1.4';     // Cải thiện chiều cao dòng để dễ đọc
            }
          }

      }
    }
}
</script>
