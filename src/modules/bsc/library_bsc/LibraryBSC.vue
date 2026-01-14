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
            <button class="btn btn-second" style="min-width: 100px;" @click="addNewLibraryBSC">
              <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click="updateNewLibraryBSC">
              <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            <button class="btn btn-second" style="min-width: 100px;" @click="deleteNewLibraryBSC">
              <span class="icon one-trash"></span>&nbsp;Xóa
            </button>&nbsp;
          </div>
        </div>

        <KDataGrid ref="gridDs" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="true" :showColumnCheckbox="true" :enabledSelectFirstRow="false"
          :showSTT="false" :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }" />
      </div>

    </div>
    <!-- Modal -->
    <AddUpdateLibraryBSCModal ref="addUpdateLibraryBSCModal" :isAdd="isAddNew" :data="rowSelected"
      @successAddUpdate="successAddUpdate" />

  </div>
</template>
<script>
import API from './API'
import AddUpdateLibraryBSCModal from './AddUpdateLibraryBSCModal.vue'
export default {
  name: 'LibraryBSC',
  components: {
    AddUpdateLibraryBSCModal
  },
  data() {
    return {
      header: {
        title: "Danh mục thư viện BSC",
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
        // {
        //   fieldName: 'assign_target',
        //   headerText: 'Chỉ tiêu giao',
        //   allowFiltering: true
        // },
        {
          fieldName: 'unit',
          headerText: 'Đơn vị tính',
          allowFiltering: true
        },
        {
          fieldName: 'description',
          headerText: 'Mô tả',
          allowFiltering: true
        },
        {
          fieldName: 'calculation_formula',
          headerText: 'Công thức/Cách đo lường',
          allowFiltering: true,
        },
        {
          fieldName: 'data_source',
          headerText: 'Nguồn lấy dữ liệu',
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
      rowSelected: {}
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
        this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!')
        return
      }
      this.isAddNew = false
      this.rowSelected = dsSlected[0]
      this.$refs.addUpdateLibraryBSCModal.showModal()

    },
    async deleteNewLibraryBSC() {
      let dsSlected = this.$refs.gridDs.getSelectedRecords();
      if (dsSlected.length == 0) {
        this.$toast.error('Vui lòng chọn dữ liệu cần xóa!')
        return
      }
      let dsId = dsSlected.map(x => x.bsc_library_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu đang chọn?`)
      if (result == 0) return
      let dataRequest = {
        arrIds: JSON.stringify(dsId)
      }
      let data = await API.DeleteBSCLibrary(this, dataRequest)
      if (data == '1') {
        this.$toast.success('Xóa thành công!')
        this.initDataGrid()
      } else {
        this.$toast.error(data)
      }
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