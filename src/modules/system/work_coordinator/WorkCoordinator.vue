<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="info-row col-sm-4">
            <div class="key w150 bold">Tìm theo nội dung</div>
              <div class="value">
                <input type="text" v-model="search_query" class="form-control" style="border: 1px solid #ccc;" @input="searchContracts">
              </div>
        </div> 
      </div>
      <div class="box-form">
        <div class="info-row">
          <div class="group-buttons -bottom">
            <button class="btn btn-second" @click.prevent="createNew">
              <span class="icon fa fa-plus"></span>&nbsp;Tạo mới
            </button>&nbsp;
            <button class="btn btn-second" @click.prevent="editItem">
              <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>&nbsp;
            <button class="btn btn-second" @click.prevent="deleteItem">
              <span class="icon one-trash"></span>&nbsp;Xóa
            </button>&nbsp;
          </div>
        </div>
        <KDataGrid
          ref="gridDs"
          :columns="columns"
          :dataSource="filtered_data_sources"
          :showFilter="false"
          :allowSorting="true"
          :allowPaging="true"
          :showColumnCheckbox="true"
          @rowSelected="onRowSelected"
          @recordDoubleClick="editItem"
        />
      </div>
    </div>
    <CoordinatorModal 
        ref="coordinatorModal" 
        :is_add_new="is_add_new" 
        :user_list="user_list"
        @add="handleAdd"
        @update="handleUpdate"
    />
  </div>
</template>

<script>
import CoordinatorAPI from './WorkCoordinatorAPI.js';
import CoordinatorModal from './WorkCoordinatorModal.vue';

export default {
  name: 'WorkCoordinator',
  components: { CoordinatorModal },
  data() {
    return {
      header: { title: "Cấu hình nhân sự điều phối", list: [] },
      search_query: '',
      data_sources: [],
      user_list: [],
      row_selected: null,
      is_add_new: false,
      columns: [
        { fieldName: 'nhanVienDieuPhoi', headerText: 'Nhân viên điều phối', allowFiltering: true, width: '700' },
        { fieldName: 'nhanVienThucHien', headerText: 'Nhân viên thực hiện', allowFiltering: true, width: '700' }
      ]
    }
  },
  computed: {
      filtered_data_sources() {
          if (!this.search_query || this.search_query.trim() === '') return this.data_sources;
          const query = this.search_query.toLowerCase().trim();
          return this.data_sources.filter(item => 
              item.nhanVienDieuPhoi.toLowerCase().includes(query) ||
              item.nhanVienThucHien.toLowerCase().includes(query)
          );
      }
  },
  async mounted() {
    this.loading(true);
    await this.loadUserList();
    await this.loadData();
    this.loading(false);
  },
  methods: {
    loading(show) { this.$root.showLoading(show); },

    async loadData() {
        const response = await CoordinatorAPI.GetAllCoordinators(this);
        if (response && response.success) {
            this.data_sources = response.data;
        } else {
            this.data_sources = [];
        }
    },
    async loadUserList() {
        const response = await CoordinatorAPI.GetAllEmployee(this);
          if (response && response.success) {
              this.user_list = response.data.map(u => ({ 
                  id: u.user_id, 
                  text: `${u.full_name} (${u.username})` 
              }));
          } else {
              this.user_list = [];
          }
    },

    createNew() {
        this.is_add_new = true;
        this.$nextTick(() => {
            if (this.$refs.coordinatorModal) {
                this.$refs.coordinatorModal.showModal();
            }
        });
    },
    editItem() {
      const selected = this.$refs.gridDs.getSelectedRecords();
      if (selected.length === 0) {
          this.$toast.error('Vui lòng chọn 1 dòng cần điều chỉnh!');
          return;
      }
      if (selected.length > 1) {
          this.$toast.error('Chỉ cho phép điều chỉnh mỗi lần 1 dữ liệu duy nhất!');
          return;
      }
      this.is_add_new = false;
      this.$nextTick(() => {
          if (this.$refs.coordinatorModal) {
              this.$refs.coordinatorModal.showModal(selected[0]);
          }
      });
    },
    async deleteItem() {
      const selected = this.$refs.gridDs.getSelectedRecords();
      if (selected.length === 0) {
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng cần xóa!');
        return;
      }
      
      const confirmation = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa ${selected.length} dòng đang chọn?`);
      if (confirmation != 1 && confirmation !== 'ok') return;

      const payload = { Ids: selected.map(x => x.id) };
      const response = await CoordinatorAPI.DeleteCoordinators(this, payload);
      
      if (response && response.success) {
          this.$toast.success('Đã xóa thành công');
          await this.loadData();
      } else {
          this.$toast.error(response?.message || 'Xóa thất bại');
      }
    },

    async handleAdd(payload) {
        const response = await CoordinatorAPI.AddCoordinator(this, payload);
        if (response && response.success) {
            this.$toast.success('Thêm mới thành công');
            await this.loadData();
        }
    },
    async handleUpdate(payload) {
        const response = await CoordinatorAPI.UpdateCoordinator(this, payload);
        if (response && response.success) {
            this.$toast.success('Cập nhật thành công');
            await this.loadData();
        }
    },

    searchContracts() {
        // Tự động tìm kiếm khi nhập vào input
        // Computed property filtered_data_sources sẽ tự động cập nhật
    },

    onRowSelected(args) { this.row_selected = args.data; },
    onRecordDoubleClick() { this.editItem(); }
  }
}
</script>