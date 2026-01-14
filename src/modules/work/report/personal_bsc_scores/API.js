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
    // const path = `${INDIVIDUAL_WORK_REPORT_API_PATH}/GetMyDepartmentTree`;
    const path = `${'revenue/BSCAssignUser'}/GetDepartmentTreeUpdateResult`;
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
  // Lấy báo cáo thống kê BSC cá nhân
  async GetPersonalBSCScores(parent, data) {
    // return await this.getDs(parent, `revenue/DashboardBscUser/GetManagementBSCPersonalFinalScores?p_user_id=${data.user_selected}&p_from_month=${data.from_month}&p_to_month=${data.to_month}`, null, true)
    return await this.getDs(parent, 'revenue/DashboardBscUser/GetStatisticalUserMonth?assignee_id=' + data.user_selected + '&month=' + data.from_month, null, true)
    // getBSCDetailUserMonth: (axios, userId, month) => axios.get('revenue/DashboardBscUser/GetStatisticalUserMonth?assignee_id=' + data.user_selected + '&month=' + data.from_month),

  },
  GetTaskDetailUserMonth: (axios, input) =>
    axios.get(
      `/revenue/DashboardBscUser/GetTaskDetailUserMonth?month=${input.month}&assignee_id=${input.assignee_id}&type=${input.type}`
    ),
  GetBscUserOfOneMonth: (axios, input) =>
    axios.get(
      `/revenue/DashboardBscUser/GetBscUserOfOneMonth?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  GetBscUserOfOneCurentMonth: (axios, input) =>
    axios.get(
      `/revenue/DashboardBscUser/GetBscUserOfOneCurentMonth?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  getAccountByUser: (axios, user_id) => axios.get('/User/Account/getAccountByUser?user_id=' + user_id),
  getUsersByDepartment: (axios, departmentId) => axios.get('/revenue/DashboardBscUser/GetUsersByDepartmentBSC?departmentId=' + departmentId),
  GetProjectUserOfOneMonth: (axios, input) =>
    axios.get(
      `/revenue/DashboardBscUser/GetProjectUserOfOneMonth?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  CheckManagerAdmin: (axios, user_id) =>
    axios.get(
      `/revenue/DashboardBscUser/CheckManagerAdmin?userId=${user_id}`
    ),
  async GetGroupBSCScores(parent, data) {
    return await this.getDs(parent, 'revenue/DashboardBscUser/GetStatisticalGroupDetailMonth?assignee_id=' + data.user_selected + '&month=' + data.from_month, null, true)

  },
  GetTaskGroupDetailUserMonth: (axios, input) =>
    axios.get(
      `/revenue/DashboardBscUser/GetTaskGroupDetailUserMonth?month=${input.month}&assignee_id=${input.assignee_id}&type=${input.type}`
    ),
  GetPeriodProjectDetailUserMonth: (axios, input) =>
    axios.get(
      `/revenue/DashboardBscUser/GetPeriodProjectDetailUserMonth?month=${input.month}&assignee_id=${input.assignee_id}&type=${input.type}`
    ),
}