import axios from "axios"
const PROJECT_MEMBER_API_PATH = 'project/ProjectMember';
export default {
  async getDs(parent, path, defaultValue, isLoading = false) {
    try {
      if (isLoading) parent.loading(true)
      let response = await axios.get(path)
      if (isLoading) parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        return defaultValue
      }
    } catch (e) {
      if (isLoading) parent.loading(false)
      return defaultValue
    }
  },
  async postDs(parent, path, data, defaultValue, isLoading = false) {
    try {
      if (isLoading) parent.loading(true)
      let response = await axios.post(path, data)
      if (isLoading) parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        return defaultValue
      }
    } catch (e) {
      if (isLoading) parent.loading(false)
      return defaultValue
    }
  },
  // Lấy ds đơn vị
  async GetAllUnit(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenue/GetUnitAll', null)
  },
  // Lấy ds đơn vị con từ id cha
  async GetUnitByParentId(parent, arrParentId, level) {
    return await this.getDs(parent, `revenue/PlannedRevenue/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
  },
  // Lấy ds user từ id đơn vị
  async GetUserByUnit(parent, department_id) {
    return await this.getDs(parent, `work/ResourceManagement/GetUserByUnit?department_id=${department_id}`, [])
  },
  async GetActiveMemberRoles(parent) {
    return await this.getDs(parent, `${PROJECT_MEMBER_API_PATH}/GetActiveRoles`, []);
  },
  async GetResourceSummaryByUnitWithRangeMonth(parent, data) {
    return await this.getDs(parent, `work/ResourceManagement/GetResourceSummaryByUnitWithRangeMonth?center_id=${data.center_id}&department_id=${data.department_id}&group_id=${data.group_id}&project_id=${data.project_id}&from_month=${data.from_month}&to_month=${data.to_month}`, [], true)
  },
  async GetProjectCountByStaff(parent, departmentId, roleId, projectStatus) {
    const params = new URLSearchParams({ departmentId, roleId, projectStatus }).toString();
    return await this.getDs(parent, `project/DashboardProject/GetProjectCountByStaff?${params}`, []);
  },
  async GetProjectsByStaffAndStatus(parent, userId, status, memberType) {
    const params = new URLSearchParams({ userId, status , memberType}).toString();
    return await this.getDs(parent, `project/DashboardProject/GetProjectsByStaffAndStatus?${params}`, []);
  },
  async GetProjectCountByCustomer(parent) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectCountByCustomer`, []);
  },
  async GetProjectsByCustomer(parent, customerId) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectsByCustomer?customerId=${customerId}`, []);
  },
  async GetProjectCountByService(parent) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectCountByService`, []);
  },
  async GetProjectsByService(parent, serviceId) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectsByService?serviceId=${serviceId}`, []);
  },
  async GetProjectStatusSummary(parent) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectStatusSummary`, null);
  },
  async GetProjectsByStatus(parent, status) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectsByStatus?status=${status}`, []);
  },
  async GetProjectedRevenueByYear(parent) {
    return await this.getDs(parent, `project/DashboardProject/GetProjectedRevenueByYear`, []);
  },
  async GetRevenueDetailsByYear(parent, year) {
    return await this.getDs(parent, `project/DashboardProject/GetRevenueDetailsByYear?year=${year}`, []);
  },
}