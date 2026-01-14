import axios from "axios"

// Base path được lấy từ Route attribute trong Controller
const INDIVIDUAL_WORK_REPORT_API_PATH = 'report/StaffWorkReport';

// Hàm generic để gọi API GET và xử lý response
const getDs = async (parent, path, params = {}, defaultValue = null) => {
  try {
    parent.loading(true);
    let response = await axios.get(path, { params });
    if (response && response.data) {
      return response.data;
    }
    parent.$toast.error('Không có dữ liệu trả về từ server');
    return { success: false, data: defaultValue };
  } catch (e) {
    parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dữ liệu.');
    return { success: false, data: defaultValue };
  } finally {
    parent.loading(false);
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
  postDs,
  // Lấy danh sách phòng ban theo cây đơn vị của user đăng nhập
  async GetMyDepartmentTree(parent) {
    const path = `${INDIVIDUAL_WORK_REPORT_API_PATH}/GetMyDepartmentTree`;
    const result = await getDs(parent, path, {}, []);
    return result.success ? result.data : [];
  },
  // Lấy danh sách người dùng theo một phòng ban cụ thể
  async GetUsersByDepartment(parent, departmentId) {
    const path = `${INDIVIDUAL_WORK_REPORT_API_PATH}/GetUsersByDepartment`;
    const params = { departmentId };
    const result = await getDs(parent, path, params, []);
    return result.success ? result.data : [];
  },
  // Lấy báo cáo thống kê lượng công việc cá nhân
  async GetIndividualWorkReport(parent, params) {
    const path = `${INDIVIDUAL_WORK_REPORT_API_PATH}/SearchPersonWorkByDate`;
    return await getDs(parent, path, params, { Data: [], isThongKeJira: false });
  },
  async SearchOneTwoStarTasks(parent, params) {
    const path = `${INDIVIDUAL_WORK_REPORT_API_PATH}/SearchOneTwoStarTasks`;
    const result = await getDs(parent, path, params, []);
    return result.success ? result.data : [];
  }
}