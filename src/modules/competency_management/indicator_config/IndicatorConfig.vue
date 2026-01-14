<template>
  <div class="main-wrapper indicator-config">
    <breadcrumb :header="header" />

    <div class="page-content" style="top: 46px !important;">
      <!-- Bộ lọc -->
      <div class="box-form">
        <div class="row">
          <div class="col-sm-6 col-12">
            <div class="info-row">
              <div class="key bold w80">Tìm kiếm</div>
              <div class="value">
                <input
                  v-model="search_text"
                  type="text"
                  class="form-control"
                  @keydown.enter="onEnterSearch"
                  placeholder="Tìm kiếm theo yêu cầu, đối tượng..."
                />
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w60">Dịch vụ</div>
              <div class="value">
                <select2
                  v-model="service_selected"
                  :options="service_list"
                  @select="onChangeService"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="box-form">
        <div class="group-buttons -bottom" style="margin-top: 0px !important;">
          <button class="btn btn-second" @click="onAdd">
            <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
          </button>
          &nbsp;
          <button class="btn btn-second" @click="onUpdate">
            <span class="icon one-edit"></span>&nbsp;Cập nhật
          </button>
        </div>
      </div>

      <!-- Table component -->
      <IndicatorTable
        :data="mockData"
        @selection-change="onSelectionChange"
        :pageSize="10"
      />

    </div>
    <!-- Modal -->
    <AddUpdateIndicatorConfigModal
      ref="addUpdateIndicatorConfigModal"
      :isAdd="isAddNew"
      :data="rowSelected"
      @successAddUpdate="successAddUpdate"
    />
  </div>
</template>

<script>
import IndicatorTable from './IndicatorTable.vue'
import AddUpdateIndicatorConfigModal from './AddUpdateIndicatorConfigModal.vue'
import API from './API'
export default {
  name: 'IndicatorConfig',
  components: {
    IndicatorTable,
    AddUpdateIndicatorConfigModal
  },
  data() {
    return {
      header: {
        title: 'Cấu hình chỉ số năng lực',
        list: []
      },

      search_text: '',

      service_selected: 0,
      service_list: [{ id: 0, text: 'Tất cả' }],
      mockData: [],
      selectedRows:null,
      isAddNew:true,
      rowSelected:null

    }
  },
  methods: {
    onChangeService() {
      // gọi API filter
      this.loadDataGrid()
    },
    onEnterSearch(){
      this.loadDataGrid()
    },
    onAdd() {
      this.isAddNew = true
      this.rowSelected = {}
      this.$refs.addUpdateIndicatorConfigModal.showModal()
    },
    onSelectionChange(rows) {
      this.selectedRows = rows
      // ví dụ: rows.map(x => x.id)
    },
    onUpdate() {
      if (!this.selectedRows || this.selectedRows.length == 0) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$toast.error('Vui lòng chọn 1 dòng để điều chỉnh')
        return
      }

      // chỉ cho update 1 dòng – đúng nghiệp vụ
      this.isAddNew = false
      this.rowSelected = this.selectedRows[0]

      this.$refs.addUpdateIndicatorConfigModal.showModal()
    },
    successAddUpdate() {
      this.loadDataGrid()
    },
    async loadDataGrid(){
      this.mockData=[]
      this.rowSelected=null
      var data = await API.GetIndicatorConfig(this, {
        search_text:this.search_text?this.search_text:'',
        service_id:this.service_selected
      })
      if(data){
        data=JSON.parse(data)
        this.mockData=data.concat([])
      }
    },
    async loadPage(){
      var data = await API.GetServiceOneBss(this)
      if(data){
        data=JSON.parse(data)
        this.service_list = [
        { id: 0, text: 'Tất cả' },
          ...data.map(x => ({
            id: x.device_profile_id,
            text: x.device_profile_name
          }))
        ]
      }
      this.loadDataGrid()
    }
  },
  mounted(){
    setTimeout(()=>{
      this.loadPage()
    }, 500)
  }
}
</script>
