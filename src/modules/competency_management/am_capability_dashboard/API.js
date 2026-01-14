import axios from "axios"
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

  async GetDepartmentByRoot(parent, departmentId){
    return await this.getDs(
      parent,
      `user/Department/GetDepartmentsByRoot?rootId=${departmentId}`,
      null
    )
  },
  // Lấy danh sách người dùng theo một phòng ban cụ thể
  async GetUsersByDepartment(parent, departmentId) {
    return await this.getDs(
      parent,
      `user/Department/GetUsersByDepartment?departmentId=${departmentId}`,
      null
    )
  },
  
  async GetAmDashboardStatistic(parent, data) {
    return await this.getDs(
      parent,
      `revenue/AmCapabilityDashboard/GetAmDashboardStatistic`
        + `?period=${data.period}`
        + `&&departmentId=${data.departmentId}`
        + `&&userId=${data.userId}`,
      null,
      true
    )
  },
  async GetAmDashboardRecent(parent, data) {
    return await this.getDs(
      parent,
      `revenue/AmCapabilityDashboard/GetAmDashboardRecentEvaluation`
        + `?departmentId=${data.departmentId}`
        + `&&period=${data.period}`
        + `&&userId=${data.userId}`,
      null,
      true
    )
  },
  async GetAmDashboardTopBottom(parent, data) {
    return await this.getDs(
      parent,
      `revenue/AmCapabilityDashboard/GetAmDashboardTopBottom`
        + `?period=${data.period}`,
      null,
      true
    )
  }

}