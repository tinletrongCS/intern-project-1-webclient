<template>
  <div id="config-user-service" class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="k main-form">
      <div class="row search-box">
        <div class="col-sm-3 col-md-3 col-xl-2 col-12">
          <div class="info-row">
            <div class="key">Tìm kiếm</div>
            <div class="input-row">
              <div class="value">
                <input
                  type="text"
                  @keyup.enter="onSearch"
                  placeholder="Tìm kiếm theo nhân viên"
                  :value="search.text_search"
                  @change="(e) => (search.text_search = e.target.value)"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3 col-md-3 col-xl-2 col-12">
          <div class="info-row">
            <div class="key">Đơn vị</div>
            <div class="input-row">
              <select2
                class="value"
                :options="departments"
                v-model="search.department_id"
              ></select2>
            </div>
          </div>
        </div>
        <div class="col-sm-2 col-md-2 col-xl-2 col-12">
          <div class="info-row">
            <div class="key">&nbsp;</div>
            <div class="input-row">
              <button class="btn btn-primary" @click="onSearch">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="section-btn">
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('insertConfig')"
          :disabled="record_selected != null"
          @click="createNew"
        >
          <i class="fa fa-plus"></i> Tạo mới
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('modifyConfig')"
          :disabled="record_selected == null"
          @click="adjustRequest"
        >
          <i class="fa fa-edit"></i> Cập nhật
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('deleteConfig')"
          :disabled="record_selected == null"
          @click="deleteRequest"
        >
          <i class="fa fa-trash"></i> Xóa
        </button>
      </div>
      <div class="section-list">
        <!-- Danh sách sẽ hiển thị ở đây -->
        <section>Danh sách thông tin</section>
        <KDataGrid
          v-if="!loading"
          :columns="columns"
          :dataSource="requestList"
          :allowPaging="true"
          :showFilter="true"
          :enable-paging-server="false"
          :enabledSelectFirstRow="false"
          :allowSorting="true"
          :commandColumn="{
            headerText: 'Chức năng',
            cellCssClass: 'css1',
            show: true,
            firstColumn: false,
            width: '130',
          }"
          :selectionSettings="{
            type: 'Single',
            mode: 'Row',
            enableToggle: true,
          }"
          @recordClick="onRecordClick"
          @rowDeselected="onRowDeselected"
        />
        <div v-else class="text-center p-4">
          <i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...
        </div>
      </div>
    </div>
    <!-- Nội dung cấu hình sẽ được thêm vào đây -->
    <AddUpdateConfigModal
      ref="addUpdateConfigModal"
      :domains="domains"
      :is_add="record_selected == null"
      @saved="onSaveConfig"
      :departments="departments"
    />
  </div>
</template>
<script>
import { RequestApi } from "../API";
import axiosPlugin from "@/plugins/axiosPlugin";
import AddUpdateConfigModal from "./AddUpdateConfigModal.vue";
import { create } from "lodash";
export default {
  name: "ConfigUserDomain",
  components: { AddUpdateConfigModal },
  data() {
    return {
      header: {
        title: "Cấu hình người dùng theo lĩnh vực",
        list: [],
      },
      search: {
        text_search: "",
        department_id: -1,
      },
      departments: [],
      loading: false,
      columns: [
        {
          headerText: "Tên nhân viên",
          fieldName: "full_name",
          width: "120",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
        {
          headerText: "Đơn vị",
          fieldName: "department_names",
          width: "120",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
        {
          headerText: "Lĩnh vực đăng ký",
          fieldName: "domain_names",
          width: "120",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
        {
          headerText: "Thời gian tạo",
          fieldName: "create_at",
          width: "120",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
        {
          headerText: "Thời gian cập nhật",
          fieldName: "update_at",
          width: "120",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
      ],
      domains: [],
      record_selected: null,
    };
  },
  methods: {
    async onSearch() {
      this.loading = true;
      const response = await RequestApi.GetConfigUserDomain(this.search);
      this.requestList = response.data.map((item) => ({
        ...item,
        domain_names: item.domains.map((d) => d.name).join(", "),
        department_names: item.departments
          .map((dept) => dept.name)
          .join(", "),
      }));
      this.loading = false;
    },
    async loadDomains() {
      try {
        const response = await RequestApi.GetAllDomain();
        this.domains = response.data;
      } catch (error) {
        console.error("Error loading domains:", error);
      }
    },
    async loadDepartments() {
      try {
        const response = await RequestApi.GetDepartmentByTypeDep([2, 3]);

        this.departments = response.data.map((dept) => ({
          id: dept.department_id,
          text: dept.name,
        }));
        this.departments.unshift({ id: -1, text: "Tất cả" });
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    },
    createNew() {
      this.$refs["addUpdateConfigModal"].showModal();
    },
    async onSaveConfig(data) {
      try {
        let response = null
        if(this.record_selected != null){
          response = await RequestApi.UpdateConfigUserDomain(data);
        }else{
          response = await RequestApi.AddConfigUserDomain(data);
        }
        if (!response.success) {
          throw new Error(response.message || "Lưu cấu hình thất bại");
        }
        this.$toast.success("Lưu cấu hình thành công");
        this.$refs["addUpdateConfigModal"].hideModal();
        this.onSearch();
      } catch (error) {
        this.$toast.error(
          error?.data?.message || error.message || "Lưu cấu hình thất bại"
        );
      }
    },
    adjustRequest() {
      this.$refs["addUpdateConfigModal"].setViewMode(false);
      this.$refs["addUpdateConfigModal"].showModal(this.record_selected);
    },
    deleteRequest(){
      try{
        if(!this.record_selected){
          this.$toast.warning("Vui lòng chọn cấu hình để xóa");
          return;
        }
        RequestApi.DeleteConfigUserDomain(this.record_selected.user_id).then((response)=>{
          if(!response.success){
            throw new Error(response.message || "Xóa cấu hình thất bại");
          }
          this.$toast.success("Xóa cấu hình thành công");
          this.record_selected = {};
          this.onSearch();
        }).catch((error)=>{
          this.$toast.error(
            error?.data?.message || error.message || "Xóa cấu hình thất bại"
          );
        });
      }catch(error){
        this.$toast.error(
          error?.data?.message || error.message || "Xóa cấu hình thất bại"
        );
      }
    },
    onRecordClick(record) {
      if (record && record.cellIndex == 1) {
        this.$refs["addUpdateConfigModal"].setViewMode(true);
        this.$refs["addUpdateConfigModal"].showModal(record.rowData);
      }
      this.record_selected = record.rowData;
    },
    onRowDeselected(args) {
      this.record_selected = null;
    },
  },
  mounted() {
    Promise.all([
      this.GetPermissionButtons(),
      this.loadDomains(),
      this.loadDepartments(),
      this.onSearch(),
    ]);
  },
};
</script>
<style scoped>
.search-box .info-row {
  display: flex;
  flex-direction: column;
}

.search-box .info-row .input-row {
  display: flex;
}

.search-box .info-row .key {
  font-weight: bold;
}

.search-box .info-row .value:first-child {
  flex: 1;
  padding-left: 0;
}
.section-btn {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.section-btn .btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}
.main-form {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
}
.section-list {
  margin-top: 20px;
}

.section-list section {
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}
</style>
