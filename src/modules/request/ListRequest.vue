<template>
  <div id="request-list" class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="k main-form">
      <SearchRequest
        ref="searchFormKanban"
        :departments="departments"
        :loading="loading"
        @onClickSearch="onClickSearch"
      />
      <div class="section-btn">
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('insertRequest')"
          :disabled="selectedRequest != null"
          @click="createNew"
        >
          <i class="fa fa-plus"></i> Tạo mới
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('modifyRequest')"
          :disabled="
            selectedRequest == null || selectedRequest.creator_flg !== true
          "
          @click="adjustRequest"
        >
          <i class="fa fa-edit"></i> Điều chỉnh
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('deleteRequest')"
          :disabled="selectedRequest == null"
          @click="deleteRequest"
        >
          <i class="fa fa-trash"></i> Xóa
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('processRequest')"
          :disabled="
            selectedRequest == null ||
            selectedRequest.status_id !== 2 ||
            selectedRequest.assignee_flg !== true
          "
          @click="processRequest"
        >
          <i class="fa fa-cogs"></i> Xử lý
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('execRequest')"
          :disabled="
            selectedRequest == null ||
            selectedRequest.status_id !== 0 ||
            selectedRequest.assignee_flg !== true
          "
          @click="executeRequest"
        >
          <i class="fa fa-play"></i> Thực hiện
        </button>
        <button
          class="btn btn-primary"
          v-if="hasButtonPermission('evaluateQualityRequest')"
          :disabled="
            selectedRequest == null ||
            selectedRequest.status_id !== 10 ||
            selectedRequest?.creator_flg !== true
          "
          @click="evaluateQuality"
        >
          <i class="fa fa-star"></i> Đánh giá chất lượng
        </button>
      </div>
      <div class="section-list">
        <!-- Danh sách yêu cầu sẽ hiển thị ở đây -->
        <section>Danh sách thông tin yêu cầu</section>
        <KDataGrid
          v-if="!loading"
          :columns="columns"
          :enable-paging-server="false"
          :dataSource="requestList"
          :allowPaging="true"
          :showFilter="false"
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
          @rowSelected="onRowSelected"
        />
        <div v-else class="text-center p-4">
          <i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...
        </div>
      </div>
    </div>

    <!-- Modal tạo mới/chỉnh sửa yêu cầu -->
    <AddUpdateRequestModal
      ref="addUpdateRequestModal"
      :boardType="1"
      :disabled="false"
      :domains="domains"
      @saved="onRequestSaved"
      @updated="onRequestUpdated"
    />

    <!-- Modal đánh giá chất lượng -->
    <RatingTaskModal
      ref="ratingTaskModal"
      :task="taskForRating"
      @onRatingTaskSuccess="onRatingCompleted"
    />

    <!-- Modal xử lý yêu cầu -->
    <ProcessRequestModal
      ref="processRequestModal"
      :requestData="requestForProcess"
      :viewMode="processModalViewMode"
      @saved="onProcessRequestSaved"
    />
  </div>
</template>

<script>
import RatingTaskModal from "@/modules/work/kanban/rating/RatingTaskModal.vue";
import axiosPlugin from "@/plugins/axiosPlugin";
import AddUpdateRequestModal from "./AddUpdateRequestModal.vue";
import { RequestApi } from "./API.js";
import ProcessRequestModal from "./ProcessRequestModal.vue";
import SearchRequest from "./SearchRequest.vue";

export default {
  name: "ListRequest",
  components: {
    SearchRequest,
    AddUpdateRequestModal,
    RatingTaskModal,
    ProcessRequestModal,
  },
  data() {
    return {
      searchParams: {
        query: "",
        // department_id: null,
        from_date: new Date(),
        to_date: new Date(),
      },
      header: {
        title: "Quản lý yêu cầu triển khai nhóm dịch vụ B - C",
        list: [],
      },
      departments: [], // Danh sách departments để truyền cho SearchRequest
      domains: [],
      requestList: [], // Data for KDataGrid
      loading: false, // Loading state
      selectedRequest: null, // Lưu thông tin request được chọn cho chức năng điều chỉnh
      taskForRating: {}, // Data for rating modal
      requestForProcess: {}, // Data for process modal
      processModalViewMode: false, // View mode for process modal
      columns: [
        {
          headerText: "Mã yêu cầu",
          fieldName: "code",
          width: "120",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
        { headerText: "Nội dung yêu cầu", fieldName: "content", width: "250" },
        {
          headerText: "Mô tả giao phẩm",
          fieldName: "description",
          width: "200",
        },
        {
          headerText: "Người thực hiện",
          fieldName: "assignee_name",
          width: "120",
        },
        {
          headerText: "Giờ dự kiến",
          fieldName: "task_plan_hour",
          width: "100",
        },
        {
          headerText: "Giờ thực tế",
          fieldName: "task_actual_hour",
          width: "100",
        },
        {
          headerText: "Hạn hoàn thành",
          fieldName: "deadline",
          width: "120",
        },
        {
          headerText: "Trạng thái",
          fieldName: "task_status",
          width: "120",
        },
      ],
    };
  },
  async mounted() {
    await Promise.all([
      // this.onLoadDepartments(),
      this.GetPermissionButtons(),
      this.onLoadService(),
    ]); // Đảm bảo hàm mounted là async
    this.refreshRequestList();
  },
  methods: {
    onClickSearch(data) {
      this.searchParams = { ...data };
      this.refreshRequestList();
      // Add your search logic here
    },

    // Các function cho action buttons
    createNew() {
      // Reset form và mở modal tạo mới
      const modal = this.$refs.addUpdateRequestModal;
      modal.resetToCreateMode();
      modal.showModal();
    },

    adjustRequest() {
      // Kiểm tra xem có request nào được chọn không
      if (!this.selectedRequest) {
        if (this.$toast) {
          this.$toast.warning("Vui lòng chọn một yêu cầu để điều chỉnh");
        } else {
          alert("Vui lòng chọn một yêu cầu để điều chỉnh");
        }
        return;
      }

      // Mở modal ở chế độ edit với dữ liệu của request được chọn
      this.openModalWithData(this.selectedRequest.id, false); // false = edit mode
    },

    async deleteRequest() {
      if (!this.selectedRequest) {
        {
          if (this.$toast) {
            this.$toast.warning("Vui lòng chọn một yêu cầu để xóa");
          } else {
            alert("Vui lòng chọn một yêu cầu để xóa");
          }
          return;
        }
      }
      let result = await this.$confirm('Thông báo', `Bạn có muốn xóa yêu cầu này không?`);
      if(result==0){
        return;
      }
      try {
        const response = await RequestApi.Delete(this.selectedRequest.id);
        if (!response.success) {
          throw new Error(response.message || "Xóa yêu cầu thất bại");
        }
        if (this.$toast) {
          this.$toast.success("Xóa yêu cầu thành công!");
        } else {
          alert("Xóa yêu cầu thành công!");
        }
        this.refreshRequestList();
      } catch (error) {
        if (this.$toast) {
          this.$toast.error(error?.data?.message || error?.message);
        } else {
          alert(error.message || error);
        }
        return;
      }
      // Logic xóa yêu cầu đã chọn
    },

    processRequest() {
      // Kiểm tra xem có request nào được chọn không
      if (!this.selectedRequest) {
        if (this.$toast) {
          this.$toast.warning("Vui lòng chọn một yêu cầu để xử lý");
        } else {
          alert("Vui lòng chọn một yêu cầu để xử lý");
        }
        return;
      }

      // Set data cho modal xử lý
      this.requestForProcess = {
        id: this.selectedRequest.id,
        content: this.selectedRequest.content,
        description: this.selectedRequest.description,
        code: this.selectedRequest.code,
        assignee_name: this.selectedRequest.assignee_name,
        // Thêm các field đã có sẵn từ database nếu có
        xuLy: this.selectedRequest.xuLy || "",
        phanHoi: this.selectedRequest.phanHoi || "",
      };

      // Set view mode = false để có thể chỉnh sửa
      this.processModalViewMode = false;

      // Mở modal
      const processModal = this.$refs.processRequestModal;
      if (processModal) {
        processModal.showModal();
      }
    },

    async executeRequest() {
      if (!this.selectedRequest) {
        {
          if (this.$toast) {
            this.$toast.warning("Vui lòng chọn một yêu cầu để thực hiện");
          } else {
            alert("Vui lòng chọn một yêu cầu để thực hiện");
          }
          return;
        }
      }
      try {
        const response = await RequestApi.DoingTask(
          this.selectedRequest.task_id
        );
        if (this.$toast) {
          this.$toast.success("Thực hiện yêu cầu thành công!");
        } else {
          alert("Thực hiện yêu cầu thành công!");
        }
        this.refreshRequestList();
      } catch (error) {
        if (this.$toast) {
          this.$toast.error(error.data.message || error);
        } else {
          alert(error.message || error);
        }
        return;
      }
      // Logic thực hiện yêu cầu
    },

    evaluateQuality() {
      // Kiểm tra xem có request nào được chọn không
      if (!this.selectedRequest) {
        if (this.$toast) {
          this.$toast.warning(
            "Vui lòng chọn một yêu cầu để đánh giá chất lượng"
          );
        } else {
          alert("Vui lòng chọn một yêu cầu để đánh giá chất lượng");
        }
        return;
      }

      // Mở modal đánh giá chất lượng
      const ratingModal = this.$refs.ratingTaskModal;
      if (ratingModal) {
        // Map từ request sang task format và set vào taskForRating
        this.taskForRating = {
          task_id: this.selectedRequest.task_id || this.selectedRequest.id,
          task_name: this.selectedRequest.content,
          assignee_name: this.selectedRequest.assignee_name,
          assignee_id: this.selectedRequest.assignee_id,
          code: this.selectedRequest.code,
          description: this.selectedRequest.description,
          // Thêm các field khác nếu cần
        };

        // Show modal (không cần truyền parameter)
        ratingModal.showModal();
      }
    },

    // Handle row selection event - khi check checkbox để dùng cho action buttons
    onRowSelected(args) {
      if (args && args.data) {
        this.selectedRequest = args.data; // Lấy row đầu tiên được chọn
      } else {
        this.selectedRequest = null;
      }
    },

    // Open modal with pre-loaded data
    async openModalWithData(taskId, viewOnly = false) {
      try {
        const modal = this.$refs.addUpdateRequestModal;

        // Set modal mode first
        modal.setViewMode(viewOnly);

        // Load data into modal
        await modal.loadRequestData(taskId);

        // Show modal
        modal.showModal();
      } catch (error) {
        console.error("Error opening modal with data:", error);
        if (this.$toast) {
          this.$toast.error("Không thể mở thông tin yêu cầu");
        }
      }
    },
    onRowDeselected(args) {
      this.selectedRequest = null;
    },

    // Handle rating completion từ RatingTaskModal
    onRatingCompleted(ratingResult) {
      try {
        // Đóng modal đánh giá chất lượng
        this.$refs.ratingTaskModal.hideModal();

        // Refresh danh sách để cập nhật trạng thái nếu có
        this.refreshRequestList();

        // Hiển thị thông báo thành công
        if (this.$toast) {
          this.$toast.success("Đánh giá chất lượng thành công!");
        } else {
          alert("Đánh giá chất lượng thành công!");
        }
      } catch (error) {
        console.error("Error handling rating completion:", error);

        if (this.$toast) {
          this.$toast.error("Có lỗi xảy ra sau khi đánh giá chất lượng");
        } else {
          alert("Có lỗi xảy ra sau khi đánh giá chất lượng");
        }
      }
    },

    async onLoadDepartments() {
      try {
        // Sử dụng axiosPlugin đã import
        const response = await RequestApi.getDepartmentForAccount(axiosPlugin);

        // Lưu data vào departments để truyền cho SearchRequest
        this.departments = Object.assign(response.data.data, []) || [];
        // Map to format for select2 (id và text)
        this.departments = this.departments.map((dept) => ({
          id: dept.department_id || dept.id,
          text: dept.name || dept.department_name,
        }));
        // this.searchParams.department_id = this.departments.length > 0 ? this.departments[0].id : null;
      } catch (error) {
        console.error("Error loading departments:", error);
        this.departments = [];
      }
    },
    async onLoadService() {
      try {
        const response = await RequestApi.GetAllDomain();

        this.domains = response.data || [];
      } catch (error) {
        console.error("Error loading domain:", error);
        this.domains = [];
      }
    },
    createDataRequest(requestData) {
      // Map data từ modal saved event vào format API mới
      const date = new Date(requestData.han_mongmuon);

      const year = date.getFullYear();

      // getMonth() trả về từ 0 (tháng 1) đến 11 (tháng 12), nên cần +1
      const month = (date.getMonth() + 1).toString().padStart(2, "0");

      // getDate() trả về ngày trong tháng
      const day = date.getDate().toString().padStart(2, "0");

      // Ghép lại
      const formattedDate = `${year}-${month}-${day}`;
      return {
        id: requestData.id || 0, // 0 cho request mới
        request_department_id: requestData.donvi_yeucau_id || null,
        execute_department_id: requestData.donvi_thuchien_id || null,
        domain_id: requestData.domain_id || null,
        assignee_id: requestData.am_thuchien_id || null,
        content: requestData.noidung || "",
        description: requestData.mota || "",
        user_del: null,
        delete_day: null,
        code: requestData.ma || "",
        task_id: requestData.task_id || null,
        deadline: formattedDate || null,
        user_ins: null, // Sẽ được set bởi backend
        // Thêm các field khác nếu cần
        files: requestData.files || [],
      };
    },
    // Modal event handlers
    async onRequestSaved(savedRequest) {
      try {
        // Call API để save request với TaskRequest format
        const response = await RequestApi.addRequest(savedRequest);
        if (response && response.success !== true) {
          throw new Error(
            response.message || "Lỗi không xác định khi tạo yêu cầu"
          );
        }

        // Đóng modal sau khi lưu thành công
        this.$refs.addUpdateRequestModal.hideModal();

        // Refresh danh sách sau khi lưu
        this.refreshRequestList();

        // Hiển thị thông báo thành công
        if (this.$toast) {
          this.$toast.success("Tạo yêu cầu thành công!");
        } else {
          alert("Tạo yêu cầu thành công!");
        }
      } catch (error) {
        console.error("Error saving request in ListRequest:", error);

        // Hiển thị thông báo lỗi
        if (this.$toast) {
          this.$toast.error(
            "Có lỗi xảy ra khi tạo yêu cầu: " +
              (error?.data?.message || error?.message)
          );
        } else {
          alert("Có lỗi xảy ra khi tạo yêu cầu: " + (error.message || error));
        }
      }
    },

    // Handle update từ AddUpdateRequestModal
    async onRequestUpdated(updatedRequest) {
      try {
        // Đóng modal sau khi cập nhật thành công
        this.$refs.addUpdateRequestModal.hideModal();

        // Refresh danh sách sau khi cập nhật
        this.refreshRequestList();
      } catch (error) {
        console.error("Error handling updated request:", error);

        if (this.$toast) {
          this.$toast.error("Có lỗi xảy ra sau khi cập nhật yêu cầu");
        } else {
          alert("Có lỗi xảy ra sau khi cập nhật yêu cầu");
        }
      }
    },

    // Handle save từ ProcessRequestModal
    async onProcessRequestSaved(processData) {
      try {
        const request = {
          task_id: processData.id,
          status_id: processData.xuLyStatusId,
          processing_content: processData.phanHoi,
        };

        // Gọi API để lưu thông tin xử lý
        // Bạn có thể tạo API endpoint mới cho việc này
        const response = await RequestApi.ProcessingRequest(request);
        if (response && response.success !== true) {
          throw new Error(
            response.message || "Lỗi không xác định khi xử lý yêu cầu"
          );
        }
        this.$refs.processRequestModal.hideModal();
        // Refresh danh sách
        this.refreshRequestList();

        // Hiển thị thông báo thành công
        if (this.$toast) {
          this.$toast.success("Cập nhật xử lý yêu cầu thành công!");
        } else {
          alert("Cập nhật xử lý yêu cầu thành công!");
        }
      } catch (error) {
        console.error("Error saving process request:", error);

        // Hiển thị thông báo lỗi
        if (this.$toast) {
          this.$toast.error(
            "Có lỗi xảy ra khi cập nhật xử lý: " +
              (error?.data?.message || error?.message)
          );
        } else {
          alert(
            "Có lỗi xảy ra khi cập nhật xử lý: " + (error.message || error)
          );
        }
      }
    },

    async refreshRequestList() {
      try {
        this.loading = true;

        // Format dates to MM/yyyy if they exist
        const formatToMonthYear = (date) => {
          if (!date) return null;
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${month}/${year}`;
        };

        const searchParams = {
          ...this.searchParams,
          from_date: formatToMonthYear(this.searchParams.from_date),
          to_date: formatToMonthYear(this.searchParams.to_date),
        };

        const response = await RequestApi.getRequestList(
          axiosPlugin,
          searchParams
        );
        if (response && response.data) {
          const data = response.data;
          // Parse data properly to ensure it's an array
          let taskData = Array.isArray(data) ? data : JSON.parse(data);

          // Map task data to request format for grid display
          let requestData = taskData.map((task) => {
            return {
              // Map task fields to request fields for grid display
              id: task.task_id,
              code: task.code,
              content: task.task_name,
              description: task.description,

              // Map departments (cần load từ API để có tên)
              request_department_id: task.task_creator, // Creator as requester
              execute_department_id: task.assignee_id, // Assignee department
              request_department_name: "", // Will be loaded from user info
              execute_department_name: "", // Will be loaded from user info
              requester_name: task.user_ins || "N/A", // Creator name

              // Map user info
              assignee_id: task.assignee_id,
              assignee_name: task.assignee_name || "N/A", // Will be loaded from user mapping

              // Map time fields
              task_plan_hour: task.planned_duration_time || 0,
              task_actual_hour: task.actual_execution_time || 0,

              // Map dates
              deadline: task.schedule_end,
              created_at: task.create_day,

              // Map task specific fields
              task_id: task.task_id,
              status_id: task.status_id,
              task_status: this.getTaskStatusText(task.status_id),
              domain_id: task.domain_id,
              assignee_flg: task.assignee_flg || false,
              creator_flg: task.creator_flg || false,

              // Keep original task data for reference
              _originalTask: task,
            };
          });

          // Format dates for display
          requestData.forEach((item) => {
            // Format deadline date
            if (item.deadline) {
              item.deadline = new Date(item.deadline).toLocaleDateString(
                "vi-VN"
              );
            }
            // Format created_at date
            if (item.created_at) {
              item.created_at = new Date(item.created_at).toLocaleDateString(
                "vi-VN"
              );
            }
          });

          // Force reactive update
          this.$set
            ? this.$set(this, "requestList", requestData)
            : (this.requestList = requestData);
        } else {
          this.requestList = [];
        }
      } catch (error) {
        console.error("Error refreshing request list:", error);
        this.requestList = [];
      } finally {
        this.loading = false;
      }
    },
    onRecordClick(args) {
      if (args && args.cellIndex == 1) {
        // nhấn vào ô mã yêu cầu
        this.selectedRequest = args.rowData;
        this.$refs.addUpdateRequestModal.setViewMode(true); // Chế độ xem
        this.openModalWithData(this.selectedRequest.task_id, true); // true = view only
      }
    },
    // Map task status ID to text
    getTaskStatusText(statusId) {
      const statusMap = {
        0: "Tạo mới",
        2: "Đang thực hiện",
        3: "Hoàn thành",
        10: "Chờ đánh giá",
      };
      return statusMap[statusId] || `Trạng thái ${statusId}`;
    },
  },
};
</script>

<style scoped>
#request-list .main-form {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
}

#request-list .section-btn {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

#request-list .section-btn .btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

#request-list .section-btn .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#request-list .section-btn .btn i {
  font-size: 14px;
}

#request-list .section-list {
  margin-top: 20px;
}

#request-list .section-list section {
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}
</style>
