<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">
            <div class="col-sm-3 col-12">
                <div class="info-row">
                    <div class="value">
                        <input type="text" :value="input_search_name" @change="e=>input_search_name=e.target.value"  class="form-control" @keyup.enter="SearchText"
                        placeholder="Tìm kiếm theo mã, tên danh mục">
                    </div>
                </div>
            </div>
            <div class="col-sm-3 col-12">
                <button class="btn btn-second" style="min-width: 100px;" @click="SearchText">
                  <span class="icon one-search"></span>Tìm kiếm
                </button>
            </div>
        </div>
        
      </div>

      <div class="box-form">
        <div class="info-row">
            <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
            <button class="btn btn-second" style="min-width: 100px;" @click="addNewLibraryKpi" >
                <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click="updateNewLibraryKpi">
                <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click="deleteNewLibraryKpi">
                <span class="icon one-trash"></span>&nbsp;Xóa
            </button>&nbsp;
            </div>
        </div>

        <div class="info-row">
          <div class="value bold">
            Danh sách thông tin danh mục thư việc KPI
          </div>
        </div>
           
        <KDataGrid
            ref="gridDs"
            class="grid-kpi"
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
    <AddUpdateLibraryKPIModal ref="addUpdateLibraryKPIModal"
      :isAdd="isAddNew"
      :data="rowSelected"
      @successAddUpdate="successAddUpdate"
    />

  </div>
</template>
<script>
import API from './API'
import AddUpdateLibraryKPIModal from './AddUpdateLibraryKPIModal.vue'
export default {
  name:'LibraryKPI',
  components:{
    AddUpdateLibraryKPIModal
  },
  data(){
    return {
      header: {
          title: "Danh mục thư viện KPI",
          list: [
          ],
      },
      columns:[
            {
                fieldName:'code',
                headerText:'Mã chỉ số',
                allowFiltering:true,
            },
            {
                fieldName:'name',
                headerText:'Danh mục chỉ số',
                allowFiltering:true
            },
            {
                fieldName:'unit',
                headerText:'ĐVT',
                allowFiltering:true
            },
            {
                fieldName:'description',
                headerText:'Mô tả',
                allowFiltering:true
            },
            {
                fieldName:'measurement_method',
                headerText:'Công thức/Cách đo lường',
                allowFiltering:true,
                disableHtmlEncode:false
            },
            {
                fieldName:'formula',
                headerText:'Công thức đánh giá',
                allowFiltering:true,
                disableHtmlEncode:false
            },
            {
                fieldName:'data_source',
                headerText:'Nguồn lấy dữ liệu',
                allowFiltering:true
            }
        ],
        dataSources:[],
        input_search_name:'',
        isAddNew:true,
        rowSelected:{}
    }
  },
  computed:{

  },
  methods:{
    SearchText(){
      this.initDataGrid()
    },
    addNewLibraryKpi(){
      this.isAddNew=true
      this.$refs.addUpdateLibraryKPIModal.showModal()
    },
    updateNewLibraryKpi(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0||dsSlected.length>1){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      this.isAddNew=false
      this.rowSelected=dsSlected[0]
      this.$refs.addUpdateLibraryKPIModal.showModal()

    },
    async deleteNewLibraryKpi(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu cần xóa!')
        return
      }
      let dsId=dsSlected.map(x=>x.kpi_library_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu đang chọn?`)
      if(result==0) return
      let dataRequest ={
        arrIds:JSON.stringify(dsId)
      }
      let data=await API.DeleteKpiLibrary(this, dataRequest)
      if(data=='1'){
          this.$toast.success('Xóa thành công!')
          this.initDataGrid()
      }else{
          this.$toast.error(data)
      }
    },
    successAddUpdate(){
      this.initDataGrid()
    },
    async initDataGrid(){
      let data=await API.GetAllKpiLibrary(this, this.input_search_name.trim())
      this.dataSources=data.concat([])
    },
    async loadPage(){
      this.initDataGrid()
    }
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
    }, 200)
  }
}
</script>
<style scoped>

</style>