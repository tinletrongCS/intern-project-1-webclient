<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-4 col-12">
            <div class="info-row">
              <div class="key w150 bold">Tìm kiếm</div>
              <div class="value">
                <input type="text" v-model="search_query" class="form-control" placeholder="Nhập tên đơn vị..." @input="searchUnits">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-form">
        <div class="info-row">
          <div class="group-buttons -bottom">
            <button class="btn btn-second" style="min-width: 100px;" @click.prevent="createNew">
              <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
            </button>&nbsp;

            <button class="btn btn-second" style="min-width: 100px;" @click.prevent="editUnit">
              <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            
            <button class="btn btn-second" style="min-width: 100px;" @click.prevent="deleteUnit">
              <span class="icon one-trash"></span>&nbsp;Xóa
            </button>&nbsp;
          </div>
        </div>
        <KDataGrid
          ref="gridDs"
          :columns="columns"
          :dataSource="data_sources"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="false"
          :showColumnCheckbox="true"
          :enabledSelectFirstRow="false"
          :showSTT="true"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
          @rowSelected="onRowSelected"
          @recordDoubleClick="onRecordDoubleClick"
        />
      </div>
    </div>
    
    <!-- Modal tạo mới/chỉnh sửa/xem chi tiết đơn vị phát triển -->
    <DevelopmentUnitModal 
      ref="unitModal"
      :isAdd="is_add_new"
      :isViewDetail="is_view_detail"
      @successUnit="successUnit"
      :data="row_selected"
    />
  </div>
</template>

<script>
import DevelopmentUnitModal from './DevelopmentUnitModal.vue'
import API from './DevelopmentUnitAPI.js'

export default {
  name: "DevelopmentUnit",
  components: {
    DevelopmentUnitModal
  },
  data() {
    return {
      header: {
        title: "Quản lý đơn vị phát triển dự án",
        list: [],
      },
      search_query: '',
      data_sources: [],
      original_data_sources: [],
      is_loading: false,
      is_add_new: false,
      is_view_detail: true,
      row_selected: {},
      columns: [
        {
          fieldName: 'developmentUnitName',
          headerText: 'Tên đơn vị',
          allowFiltering: true,
          width: '400'
        },
        {
          fieldName: 'description',
          headerText: 'Ghi chú',
          allowFiltering: true,
          width: '600'
        }
      ],
    }
  },
  async mounted() {
    this.loading(true);
    await this.loadData();
    this.loading(false);
  },
  methods: {
    loading(show) {
      this.$root.showLoading(show)
    },

    createNew() {
      this.is_add_new = true
      this.is_view_detail = false
      this.row_selected = {}
      this.$refs.unitModal.showModal()
    },

    getSelectedRow() {
      try {
        if (this.$refs.gridDs) {
          const selectedRecords = this.$refs.gridDs.getSelectedRecords();
          
          if (selectedRecords.length > 1) {
            return;
          }
          
          return selectedRecords.length === 1 ? selectedRecords[0] : null;
        }
      } catch (error) {
        console.error('Error getting selected row:', error)
      }
      return null
    },

    viewDetail(rowData) {
      this.is_add_new = false;
      this.is_view_detail = true;
      this.row_selected = rowData;
      this.$refs.unitModal.showModal();
    },

    editUnit() {
      const dsSelected = this.$refs.gridDs.getSelectedRecords();
      if (dsSelected.length === 0) {
          this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!');
          return;
      }
      if (dsSelected.length > 1) {
          this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!');
          return;
      }
      this.is_add_new = false;
      this.is_view_detail = false;
      this.row_selected = dsSelected[0];
      this.$refs.unitModal.showModal();
    },

    async deleteUnit() {
      let dsSelected = this.$refs.gridDs.getSelectedRecords();
      if (dsSelected.length === 0) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng cần xóa!');
        return;
      }
      let dsId = dsSelected.map(x => x.developmentUnitId);

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa ${dsSelected.length} đơn vị phát triển đang chọn?`);
      if (result != '1') return;
      const response = await API.DeleteDevelopmentUnit(this, dsId);
      if (response && response.success) {
          this.$toast.success(response.message || `Đã xóa thành công`);
          await this.loadData();
      }
    },
    searchUnits() {
      this.initDataGrid();
    },

    async loadData() {
      const response = await API.GetAllDevelopmentUnits(this);
      if (response && response.success) {
        this.original_data_sources = response.data || [];
      } else {
        this.original_data_sources = [];
        this.$toast.error(response?.message || "Không tải được danh sách đơn vị.");
      }
      this.initDataGrid();
    },

    onRowSelected(args) {
      this.row_selected = args.data
    },

    onRecordDoubleClick(args) {
      if (args.rowData) {
        this.viewDetail(args.rowData)
      }
    },

    async successUnit() {
      await this.loadData();
    },

    initDataGrid() {
      let filteredData = [...this.original_data_sources];
      
      // Lọc theo từ khóa tìm kiếm
      if (this.search_query.trim()) {
        const query = this.search_query.toLowerCase();
        filteredData = filteredData.filter(u =>
          u.developmentUnitName?.toLowerCase().includes(query) ||
          u.description?.toLowerCase().includes(query)
        );
      }

      this.data_sources = filteredData;
    }
  },
}
</script>
