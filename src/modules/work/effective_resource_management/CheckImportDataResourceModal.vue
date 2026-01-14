<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupCheckImportDataResource"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
              <div class="row">
                <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w140 bold">Bảng làm việc<required-marker/></div>
                      <div class="value wp100">
                          <div class="select-custom" ref="ds_board">
                              <select2 :settings="{ dropdownParent: $refs['ds_board'] }"
                                v-model="board_selected" class="select2"
                                :options="board_list && board_list.length > 0 ? board_list.map(e=>({id:e.board_id, text:e.board_name})) : []"
                                @select="onBoardChange"
                              >
                              </select2>
                          </div> 
                      </div>
                  </div>
                </div>
                <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w140 bold">Giai đoạn<required-marker/></div>
                      <div class="value wp100">
                          <div class="select-custom" ref="ds_giaidoan">
                              <select2 :settings="{ dropdownParent: $refs['ds_giaidoan'] }"
                                v-model="step_selected" class="select2"
                                :options="step_list && step_list.length > 0 ? step_list.map(e=>({id:e.step_id, text:e.step_name})) : []"
                                @select="onStepChange"
                              >
                              </select2>
                          </div> 
                      </div>
                  </div>
                </div>
              </div>
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
            allowFiltering:true
          },
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
            headerText:'Dự án',
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
            headerText:'Diễn giải tiến độ (nếu có); Số giờ yêu cầu (đơn vị giờ)',
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
          {
            fieldName:'jira_url',
            headerText:'Link liên quan',
            allowFiltering:true
          },
        ],
        dataSources:[],
        board_list: [],
        board_selected:0,
        step_list:[],
        step_selected:0
      }
    },
    methods:{
      showModal() {
        this.$refs["popupCheckImportDataResource"].show()
      },
      hideModal() {
        this.$refs["popupCheckImportDataResource"].hide()
      },
      handleShowModal(){
        this.clear()
        setTimeout(()=>{
          this.initDataPopup()
        },200)
      },
      clear(){
        this.dataSources=[]
        this.board_list=[]
        this.step_list=[]
        this.board_selected=0
        this.step_selected=0
      },
      initDataPopup(){
        this.dataSources=this.dataCheckImports
        this.board_list=this.dataCheckImports[0]['board_list'] && this.dataCheckImports[0]['board_list'].length > 0 ? this.dataCheckImports[0]['board_list'] : []
        this.board_selected=this.dataCheckImports[0]['board_id']
        this.step_selected=this.dataCheckImports[0]['step_id']
        this.initStep()
      },
      async initStep(){
        this.step_list=await API.GetStepByBoardID(this, this.board_selected)
        if(this.step_list.length>0){
          // this.step_selected=this.step_list[0].step_id
        }
      },
      onBoardChange(){
        this.step_selected=0
        this.initStep()
        
        let data = this.dataSources.map((item) => ({
          ...item,
          board_id: Number(this.board_selected),
          step_id: Number(this.step_selected)
        }));
        this.docfile_import_excel(data)
      },
      onStepChange() {
      },
      async docfile_import_excel(data){
        let result=await API.CheckImportData(this, data)
        if(Array.isArray(result)){
          this.dataSources=result
          this.board_selected=result[0]['board_id']??0
          this.step_selected=result[0]['step_id']??0
        }else{
          this.$msgBox.error("Thông báo",result)
        }
      },
      async onSave(){
        //check file có lỗi không
        const rowErrors=this.dataSources.filter(x=>x.is_error)
        if(rowErrors.length>0){
          this.$msgBox.error("Thông báo","Danh sách dữ liệu vẫn tồn tại lỗi, vui lòng kiểm tra lại dữ liệu nhập!")
          return
        }
        if (!this.board_selected || this.board_selected == '0' || this.board_selected == 0) {
          this.$msgBox.error("Thông báo","Bạn chưa chọn board!")
          return
        }
        if (!this.step_selected || this.step_selected == '0' || this.step_selected == 0) {
          this.$msgBox.error("Thông báo","Bạn chưa chọn giai đoạn!")
          return
        }
        //
        let result = await this.$confirm('Thông báo', `Bạn có chắc chắn muốn **import** danh sách này không? Việc này có thể cập nhật hoặc thêm mới dữ liệu hiện có.`)
        if(result==0) return
        let rs=await API.DoImportDataResource(this, this.step_selected, this.dataSources)
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
