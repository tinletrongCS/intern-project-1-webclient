<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="info-row">
            <div class="key w200 bold">Nhập nội dung tìm kiếm</div>
            <div style="display: flex !important;align-items: center !important;">
              <div class="value" style="flex: 1 !important;">
                  <input type="text" :value="input_search" @change="e=>input_search=e.target.value" @keyup.enter="onSearch" placeholder="Tìm theo tên người dùng" class="form-control">
              </div>
              <div class="value custom-value-btn" style="margin-left: 5px !important;">
                  <button class="btn btn-second" @click="onSearch">
                    <span class="-ap icon-search"></span>
                     
                  </button>
              </div>
            </div>
        </div>

        <div class="info-row">
            <div class="key w200 bold">Số lượng công việc được giao <required-marker/></div>
            <div style="display: flex !important;align-items: center !important;">
              <div class="value" style="flex: 1 !important;">
                  <input type="number" :value="input_number_limit" @change="e=>input_number_limit=e.target.value" class="form-control">
              </div>
            </div>
        </div>

        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="value wp100" style="margin-top: 10px !important;text-align: left !important;">
                <button  class="btn btn-second" style="width: 180px" @click="onSave">
                    Lưu thông tin
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-9 col-12">

          </div>
        </div>

        <KDataGrid
              ref="gridDs"
              :columns="columns"
              :dataSource="dataSources"
              :enable-paging-server="false"
              :allowPaging="true"
              :showFilter="false"
              :showColumnCheckbox="true"
              :enabledSelectFirstRow="false"
              :showSTT="true"
              :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
              
          />

      </div>
    </div>
  </div>
</template>

<script>
import API from './API'
export default {
  name: "UserTaskLimit",
  components:{
 
  },
  data() {
    return {
      header: {
        title: "Cấu hình giới hạn công việc giao tại thời điểm",
        list: [],
      },
      input_search:'',
      input_number_limit:'',
      columns:[
            {
                fieldName:'full_name',
                headerText:'Người dùng',
                allowFiltering:false,
            },
            {
                fieldName:'task_limit',
                headerText:'Số lượng công việc được giao',
                allowFiltering:false
            },
            
        ],
        dataSources:[]
    };
  },
  methods: {
    async pageLoad(){
      let rs=await API.GetUserLimitTask(this, this.input_search.trim())
      if(rs){
        this.dataSources=JSON.parse(rs)
      }else{
        this.dataSources=[]
      }
    },
    onSearch(){
      this.pageLoad()
    },
    async onSave(){
      let dsSlected=this.$refs.gridDs.getSelectedRecords();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn dữ liệu cần điều chỉnh!')
        return
      }
      if(this.input_number_limit==''||this.input_number_limit=='0'){
        this.$toast.error('Vui lòng vui lòng nhập số lượng task!')
        return
      }
      let data=dsSlected.map(x=> {
        return {
          user_id: x.user_id,
          task_limit_id: x.task_limit_id,
          task_limit: Number(this.input_number_limit)
        }
      })
      let rs=await API.InsertUpdateUserLimitTask(this, data)
      if(rs=='1'){
        this.$toast.success("Lưu thành công!")
        this.input_number_limit=''
        this.pageLoad()
      }else{
        this.$toast.error(rs)
      }

    }
  },
  mounted() {
    setTimeout(()=>{
      this.pageLoad()
    }, 200)
  },
};
</script>
<style scoped>
::v-deep(.e-input-group.e-control-wrapper) {
  border-radius: 4px !important;
  border-color: #E0E0E0 !important;
}
.custom-value-btn{
    min-width: 40px !important;
    display: flex !important;
    justify-content: center !important;
}
</style>
