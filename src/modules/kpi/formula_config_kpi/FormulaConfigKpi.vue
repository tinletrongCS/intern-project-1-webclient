<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <div class="info-row">
            <div class="group-buttons -bottom" style="margin-top: 0px; margin-bottom: 2px;">
            <button class="btn btn-second" style="min-width: 100px;" @click="updateFormulaConfigKpi">
                <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            </div>
        </div>

        <div class="info-row">
          <div class="value bold">
            Danh sách thông tin cấu hình công thức chỉ số
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
    <UpdateFormulaConfigKpiModal ref="updateFormulaConfigKpiModal"
      :data="rowSelected"
      @successUpdate="successUpdate"
    />

  </div>
</template>
<script>
import API from './API'
import UpdateFormulaConfigKpiModal from './UpdateFormulaConfigKpiModal.vue'
export default {
  name:'FormulaConfigKpi',
  components:{
    UpdateFormulaConfigKpiModal
  },
  data(){
    return {
      header: {
          title: "Cấu hình công thức tính chỉ số KPI",
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
                headerText:'Tên chỉ số',
                allowFiltering:true
            },
            {
                fieldName:'calculation_type_name',
                headerText:'Phương thức tính',
                allowFiltering:true
            },
            {
                fieldName:'function_schema',
                headerText:'Schema',
                allowFiltering:true
            },
            {
                fieldName:'function_name',
                headerText:'Function',
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
        rowSelected:{}
    }
  },
  computed:{

  },
  methods:{
    updateFormulaConfigKpi(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0||dsSlected.length>1){
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      this.rowSelected=dsSlected[0]
      this.$refs.updateFormulaConfigKpiModal.showModal()

    },
    successUpdate(){
      this.initDataGrid()
    },
    async initDataGrid(){
      this.dataSources=[]
      var data=await API.GetKpiLibraryWithFormula(this)
      if(data){
        data = JSON.parse(data)
        this.dataSources=data.concat([])
      }
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