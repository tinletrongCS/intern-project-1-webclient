<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w80">Tìm kiếm</div>
                <div class="value">
                  <input type="text" placeholder="Tìm kiếm..." 
                    :value="input_timkiem" @change="e=>input_timkiem=e.target.value" 
                    @keyup.enter="clickSearch" class="form-control">
                </div>
              </div>
          </div>
          <div class="col-sm-4 col-12">
            <div class="info-row">
                <div class="key w80 center">Dự án</div>
                <div class="value">
                    <select2 
                        v-model='project_selected'
                        :options="project_list.map(e=>({id:e.project_id, text:e.project_name}))"
                        @select="onProjectChange"
                    />
                </div>
            </div>
          </div>
          
          <div class="col-sm-4 col-12 w200">
              <button class="btn btn-second" @click="clickSearch"><span class="-ap icon-search"></span> Tìm kiếm</button>
          </div>
        </div>

      </div>

      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="group-buttons -bottom">
                <!-- <button class="btn btn-second" style="min-width: 100px;" @click.prevent="viewProjectCost()">
                  <span class="icon fa fa-eye"></span>&nbsp;Xem chi tiết
                </button>&nbsp; -->
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="addNewProjectCost()">
                  <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="editProjectCost()">
                  <span class="icon one-edit"></span>&nbsp;Điều chỉnh
                </button>&nbsp;
                <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteProjectCost()">
                  <span class="icon one-trash"></span>&nbsp;Xóa
                </button>&nbsp;
              </div>
            </div> 
          </div>
          <div class="col-sm-6 col-12 d-flex align-items-center justify-content-end text-danger text-end fw-bold fs-5">
            Tổng Chi Phí: {{totalProjectCost}}
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
            @recordDoubleClick="viewProjectCost"
          />
      </div>
      
    </div>
    <!-- Modal -->
    <ProjectCostModal ref="detailProjectCostModal" 
      :isAdd="isAddNew" 
      :isViewDetail="isViewDetail"
      :data="rowSelected"
      @successProjectCost="successProjectCost"/>

  </div>
</template>
<script>
import moment from 'moment'
import ProjectCostModal from './ProjectCostModal.vue'
import API from './API'
export default {
  name:'ProjectCost',
  components:{
    ProjectCostModal,
  },
  data(){
    return {
      header: {
          title: "Quản lý chi phí dự án",
          list: [
          ],
      },
      project_selected:0,
      project_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      input_timkiem:'',
      columns:[
        {
            fieldName:'project_name',
            headerText:'Dự án',
            allowFiltering:true
        },
        {
            fieldName:'full_name',
            headerText:'Người chi',
            allowFiltering:true
        },
        {
            fieldName:'cost_amount',
            headerText:'Số tiền chưa VAT (VNĐ)',
            allowFiltering:true,
            valueAccessor:this.formatVND
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
    }
  },
  computed:{
    totalProjectCost(){
      if(this.dataSources.length==0) return 0
      const totalCost = this.dataSources.reduce((sum, item) => {
        return sum + (item.cost_amount || 0);
      }, 0)
      return this.formatCurrencyVND(totalCost)
    }
  },
  methods:{
    viewProjectCost() {
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng chi phí!')
        return
      }

      this.isAddNew=false
      this.isViewDetail=true
      this.rowSelected=dsSlected[0]
      this.$refs.detailProjectCostModal.showModal()
    },
    addNewProjectCost(){
      this.isAddNew=true
      this.isViewDetail=false
      this.$refs.detailProjectCostModal.showModal()
    },
    formatCurrencyVND(value) {
      if (typeof value !== 'number') return '0';
      return value.toLocaleString('vi-VN');
    },
    
    borderAll() {
      return {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      };
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
        this.editProjectCost(rowData)
      }else if(cmdName=='xoa_dulieu'){
        this.deleteProjectCost(rowData)
      }
    },
    viewDetail(rowData){
      this.isAddNew=false
      this.isViewDetail=true
      this.rowSelected=rowData
      this.$refs.detailProjectCostModal.showModal()
    },
    editProjectCost(){
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
      this.$refs.detailProjectCostModal.showModal()
    },
    async deleteProjectCost(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      let ids = dsSlected.map(x => x.cost_id).join(",") // "1,2"

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu doanh thu kế hoạch đang chọn?`)
      if(result==0) return
      let data=await API.DeleteProjectCost(this, ids)
      if(data=='1'){
          this.$toast.success('Xóa thành công!')
          this.initDataGrid()
      }else{
          this.$toast.error(data)
      }
    },
    successProjectCost(){
      this.isAddNew=false
      this.isViewDetail=true
      this.initDataGrid()
    },
    async initDataGrid(){
      let input={
        search_text:this.input_timkiem,
        project_type_ids:'',
        project_id:this.project_selected
      }
      let data=await API.GetAllProjectCost(this, input)
      if(data){
        this.dataSources=data
      }else{
        this.dataSources=[]
      }
    },
    onProjectChange() {
      this.clickSearch()
    },
    async clickSearch() {
      await this.initDataGrid()
    },
    async initDuLieu(){
      this.project_list=await API.GetAllProject(this)
      this.project_list.unshift({
          project_id: 0,
          project_name: "Chọn"
      })
      this.project_selected=0
    }
  },
  mounted(){
    setTimeout(()=>{
      this.initDuLieu()
      this.initDataGrid()
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