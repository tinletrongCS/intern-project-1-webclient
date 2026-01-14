import axios from "axios"

// Base path được lấy từ Route attribute trong Controller
const PROJECT_API_PATH = 'Project';
const PROJECT_MEMBER_API_PATH = 'project/ProjectMember';
const PROJECT_REVENUE_API_PATH = 'project/ProjectRevenue';

// Hàm generic để gọi API GET và xử lý response
const getDs = async (parent, path, defaultValue, isLoading = false) => {
  try {
    if (isLoading) parent.loading(true);
    let response = await axios.get(path);
    if (isLoading) parent.loading(false);
    if (response && response.data && response.data.success) {
      return response.data.data;
    }
    if (parent.$toast) {
      parent.$toast.error('Lỗi khi tải dữ liệu: ' + response.data.message);
    }
    return defaultValue;
  } catch (e) {
    if (isLoading) parent.loading(false);
    if (parent.$toast) {
      parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dữ liệu.');
    }
    return defaultValue;
  }
};

// Hàm generic để gọi API DELETE và xử lý response
const deleteDs = async (parent, path, params, defaultValue, isLoading = false) => {
  try {
    if (isLoading) parent.loading(true);
    let response = await axios.delete(path, { params });
    if (isLoading) parent.loading(false);
    if (response && response.data) {
      return response.data;
    }
    return { success: false, message: 'Phản hồi không hợp lệ từ server.' };
  } catch (e) {
    if (isLoading) parent.loading(false);
    if (parent.$toast) {
      parent.$toast.error(e.response?.data?.message || 'Thao tác xóa thất bại.');
    }
    return { success: false, message: e.response?.data?.message || 'Thao tác xóa thất bại.' };
  }
};

// Hàm generic để gọi API POST và xử lý response
const postDs = async (parent, path, data, successMessage, isLoading = true, handleErrorInComponent = false, handleSuccessInComponent = false) => {
  try {
    if (isLoading) parent.loading(true);
    const response = await axios.post(path, data);
    if (isLoading) parent.loading(false);
    if (response.data && response.data.success) {
      if (!handleSuccessInComponent) {
        if (successMessage) {
          parent.$toast.success(successMessage);
        } else if (response.data.message) {
          parent.$toast.success(response.data.message);
        }
      }
    } else {
      if (!handleErrorInComponent) {
        parent.$toast.error(response.data.message || 'Thao tác thất bại.');
      }
    }
    return response.data;
  } catch (e) {
    if (isLoading) parent.loading(false);
    parent.$toast.error(e.response?.data?.message || 'Có lỗi xảy ra.');
    return null;
  }
};

export default {
  getDs,
  deleteDs,
  postDs,
  // Lấy pipeline step
  async GetProjectPipeline(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetProjectPipeline`, [], true);
  },
  // Lấy danh sách dự án pipeline
  async GetProjectDetail(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetProjectDetail`, [], true);
  },

  // Lấy danh sách loại dự án đang hoạt động
  async GetActiveProjectTypes(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveProjectTypes`, []);
  },

  // Lấy danh sách khách hàng đang hoạt động
  async GetActiveCustomers(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveCustomers`, []);
  },

  // Lấy danh sách loại khách hàng đang hoạt động
  async GetActiveCustomerTypes(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveCustomerTypes`, []);
  },

  // Lấy danh sách phòng ban VNPT đang hoạt động
  async GetActiveVnptUnits(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveDepartments`, []);
  },

  // Lấy danh sách đơn vị chủ trì xúc tiến đang hoạt động
  async GetActivePromotionUnits(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveDepartments`, []);
  },

  // Lấy danh sách đơn vị phát triển đang hoạt động
  async GetActiveDevelopmentUnits(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveDevelopmentUnits`, []);
  },

  // Lấy danh sách người dùng đang hoạt động
  async GetActiveUsers(parent) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetActiveUsers`, []);
  },
  // Tạo mã dự án
  async GenerateProjectCode(parent, customerTypeId) {
    const timestamp = new Date().getTime();
    return await getDs(parent, `${PROJECT_API_PATH}/GenerateProjectCode?customerTypeId=${customerTypeId}&_=${timestamp}`, { projectCode: '' });
  },

  // Lấy danh sách sản phẩm dịch vụ đang hoạt động
  async GetAllServices(parent) {
    try {
      if (parent.loading) parent.loading(true);
      const response = await axios.get('project/Service/GetAllService');
      if (parent.loading) parent.loading(false);

      if (response && response.data && response.data.success) {
        const transformedData = response.data.data.map(item => ({
          id: item.service_id,
          text: item.service_name
        }));
        return transformedData;
      }
      return [];
    } catch (e) {
      if (parent.loading) parent.loading(false);
      if (parent.$toast) {
        parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dữ liệu sản phẩm dịch vụ.');
      }
      return [];
    }
  },
  async GetProjectLogs(parent, projectId) {
    return await getDs(parent, `${PROJECT_API_PATH}/GetProjectLogs?projectId=${projectId}`, []);
  },
  // Xóa dự án
  async DeleteProject(parent, projectId) {
    return await deleteDs(parent, `${PROJECT_API_PATH}/DeleteProject`, { id: projectId });
  },

  // Thêm mới dự án
  async AddProject(parent, projectData) {
    return await postDs(parent, `${PROJECT_API_PATH}/AddProject`, projectData, 'Thêm dự án thành công!');
  },

  // Cập nhật thông tin dự án
  async UpdateProject(parent, projectData) {
    return await postDs(parent, `${PROJECT_API_PATH}/UpdateProject`, projectData, null);
  },
  async ApproveInvestmentAmount(parent, projectId) {
    return await postDs(parent, `${PROJECT_API_PATH}/ApproveInvestmentAmount`, { projectId }, "Phê duyệt thành công!");
  },
  async RejectInvestmentAmount(parent, projectId) {
    return await postDs(parent, `${PROJECT_API_PATH}/RejectInvestmentAmount`, { projectId }, "Đã từ chối yêu cầu!");
  },
  // ==========================================================
  // CÁC CHỨC NĂNG ĐIỀU CHỈNH TRẠNG THÁI DỰ ÁN
  // ==========================================================
  async CompleteProject(parent, projectId) {
    return await postDs(parent, `${PROJECT_API_PATH}/CompleteProject`, projectId, null);
  },
  async ApproveProject(parent, projectId) {
    return await postDs(parent, `${PROJECT_API_PATH}/ApproveProject`, projectId, null);
  },
  async ToggleLockProject(parent, projectId) {
    return await postDs(parent, `${PROJECT_API_PATH}/ToggleLockProject`, projectId, null);
  },
  // Cập nhật bước pipeline
  async UpdatePipelineStep(parent, stepData) {
    return await postDs(parent, `${PROJECT_API_PATH}/UpdatePipelineStep`, stepData, 'Cập nhật bước pipeline thành công!');
  },
  // Phê duyệt pipeline step
  async ApprovePipelineStep(parent, projectId, periodId) {
    const params = new URLSearchParams({ projectId, periodId }).toString();
    return await postDs(parent, `${PROJECT_API_PATH}/ApprovePipelineStep?${params}`, null, null, true, false, true);
  },
  // Từ chối pipeline step
  async RejectPipelineStep(parent, projectId, periodId) {
    const params = new URLSearchParams({ projectId, periodId }).toString();
    return await postDs(parent, `${PROJECT_API_PATH}/RejectPipelineStep?${params}`, null, null, true, false, true);
  },
  // ==========================================================
  // CÁC HÀM XỬ LÝ CHO MODULE THÀNH VIÊN DỰ ÁN
  // ==========================================================
  async GetProjectMembers(parent, projectId) {
    const path = `${PROJECT_MEMBER_API_PATH}/GetMembersByProjectId`;
    const defaultValue = [];
    try {
      parent.loading(true);
      const response = await axios.get(path, { params: { projectId } });
      parent.loading(false);

      if (response && response.data && response.data.success) {
        let resultData = response.data.data;
        if (typeof resultData === 'string' && resultData.startsWith('[')) {
          return JSON.parse(resultData);
        }
        return resultData;
      } else {
        if (parent.$toast) {
          parent.$toast.error('Lỗi khi tải danh sách thành viên: ' + (response.data.message || 'Không thành công'));
        }
        return defaultValue;
      }
    } catch (e) {
      parent.loading(false);
      if (parent.$toast) {
        parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải danh sách thành viên.');
      }
      return defaultValue;
    }
  },
  async GetActiveMemberRoles(parent) {
    return await getDs(parent, `${PROJECT_MEMBER_API_PATH}/GetActiveRoles`, []);
  },
  async AddProjectMember(parent, requestBody) {
    return await postDs(parent, `${PROJECT_MEMBER_API_PATH}/AddMember`, requestBody, 'Thêm thành viên thành công!');
  },
  async UpdateProjectMember(parent, requestBody) {
    return await postDs(parent, `${PROJECT_MEMBER_API_PATH}/UpdateMember`, requestBody, 'Cập nhật thành viên thành công!');
  },
  async DeleteProjectMember(parent, params) {
    return await deleteDs(parent, `${PROJECT_MEMBER_API_PATH}/DeleteMember`, params);
  },
  // ==========================================================
  // HÀM XỬ LÝ CHO MODULE DỰ KIẾN DOANH THU
  // ==========================================================
  async GetProjectRevenues(parent, projectId) {
    const path = `${PROJECT_REVENUE_API_PATH}/GetByProjectId`;
    const defaultValue = [];
    try {
      parent.loading(true);
      const response = await axios.get(path, { params: { projectId } });
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data.data;
      }
      return defaultValue;
    } catch (e) {
      parent.loading(false);
      if (parent.$toast) {
        parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dự kiến doanh thu.');
      }
      return defaultValue;
    }
  },

  async AddProjectRevenue(parent, payload) {
    return await postDs(parent, `${PROJECT_REVENUE_API_PATH}/AddProjectRevenue`, payload, null, true, true);
  },

  async UpdateProjectRevenue(parent, payload) {
    return await postDs(parent, `${PROJECT_REVENUE_API_PATH}/UpdateProjectRevenue`, payload, null, true, true);
  },

  async DeleteProjectRevenue(parent, id) {
    return await deleteDs(parent, `${PROJECT_REVENUE_API_PATH}/DeleteProjectRevenue`, { id });
  },
  async ApproveProjectRevenue(parent, approvalId) {
    return await postDs(parent, `${PROJECT_REVENUE_API_PATH}/ApproveProjectRevenue`, approvalId, "Phê duyệt thành công!");
  },
  async RejectProjectRevenue(parent, approvalId) {
    return await postDs(parent, `${PROJECT_REVENUE_API_PATH}/RejectProjectRevenue`, approvalId, "Từ chối thành công!");
  },

  async GetDepartmentTTKDGP(parent){
    return await this.getDs(parent, `user/Department/GetDepartmentTTKDGP`,null)
  },
};