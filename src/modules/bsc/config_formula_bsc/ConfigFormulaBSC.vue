<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; ">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="value">
                <input type="text" :value="input_search_name" @change="e => input_search_name = e.target.value"
                  class="form-control" @keyup.enter="SearchText" placeholder="Tìm kiếm theo mã, tên danh mục">
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
          <div class="group-buttons -bottom">
            <button class="btn btn-second" style="min-width: 100px;" @click="updateNewLibraryBSC">
              <span class="icon one-edit"></span>&nbsp;Cấu hình
            </button>&nbsp;
          </div>
        </div>

        <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="true" :enabledSelectFirstRow="false"
          :showSTT="false" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>

    </div>
    <!-- Modal -->
    <AddUpdateConfigFormulaBSCModal ref="addUpdateLibraryBSCModal" :isAdd="isAddNew" :data="rowSelected" :codeList="codeList"
      @successAddUpdate="successAddUpdate" />

  </div>
</template>
<script>
import API from './ConfigFormulaBSCApi'
import AddUpdateConfigFormulaBSCModal from './AddUpdateConfigFormulaBSCModal.vue'
export default {
  name: 'LibraryBSC',
  components: {
    AddUpdateConfigFormulaBSCModal
  },
  data() {
    return {
      header: {
        title: "Cấu hình chỉ số BSC",
        list: [
        ],
      },
      columns: [
        {
          fieldName: 'code',
          headerText: 'Mã chỉ số',
          allowFiltering: true,
        },
        {
          fieldName: 'name',
          headerText: 'Danh mục chỉ số',
          allowFiltering: true
        },
        {
          fieldName: 'data_type',
          headerText: 'Loại dữ liệu',
          allowFiltering: true,
          textAlign: 'left',
          valueAccessor: (field, data) => {
            const item = this.data_type_list.find(x => x.id === data[field]);
            return item ? item.text : '';
          }
        },
        {
          fieldName: 'schema',
          headerText: 'Schema',
          allowFiltering: true
        },
        {
          fieldName: 'function',
          headerText: 'Function',
          allowFiltering: true
        },
        {
          fieldName: 'calculation_formula',
          headerText: 'Công thức/ Cách đo lường',
          allowFiltering: true,
        },
        {
          fieldName: 'formula',
          headerText: 'Công thức đánh giá',
          allowFiltering: true
        },
        // {
        //   fieldName: 'weight',
        //   headerText: 'Tỷ trọng',
        //   allowFiltering: true,
        //   valueAccessor: (field, data) => this.formatWeight(field, data)
        // }
      ],
      dataSources: [],
      input_search_name: '',
      isAddNew: true,
      rowSelected: {},
      data_type_list: [
        { id: 1, text: 'Thủ công' },
        { id: 2, text: 'Tự động' }
      ],
      codeList: []
    }
  },
  computed: {

  },
  methods: {
    SearchText() {
      this.initDataGrid()
    },
    addNewLibraryBSC() {
      this.isAddNew = true
      this.$refs.addUpdateLibraryBSCModal.showModal()
    },
    updateNewLibraryBSC() {
      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0 || dsSlected.length > 1) {
        this.$toast.error('Vui lòng chọn 1 dòng cần cấu hình!')
        return
      }
      this.isAddNew = false
      this.rowSelected = dsSlected[0]

      this.codeList = this.dataSources.map(item => item.code);
      this.$refs.addUpdateLibraryBSCModal.showModal()
    },
    successAddUpdate() {
      this.initDataGrid()
    },
    async initDataGrid() {
      let data = await API.GetAllBSCLibrary(this, this.input_search_name.trim())
      this.dataSources = data.concat([])
    },
    async loadPage() {
      this.initDataGrid()
    },
    formatWeight(field, data) {
      const val = data.weight
      if (val == null || val === '') return ''
      return `${val}%`
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadPage()
    }, 200)
  }
}
</script>
<style scoped></style>