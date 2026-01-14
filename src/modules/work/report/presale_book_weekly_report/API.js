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
  async GetBookPsReportRange(parent, data) {
    const fromDate = data?.fromDate ?? 0
    const toDate = data?.toDate ?? 0
    const phongBan = data?.phongBan ?? 0
    const assigneeId = data?.assigneeId ?? 0
    return await this.getDs(
      parent,
      `report/BookPsReport/GetBookPsReportWeek?phongBan=${phongBan}&assigneeId=${assigneeId}&start=${fromDate}&end=${toDate}`,
      null,
      true
    )
  },

  // Lấy danh sách phòng ban theo cây đơn vị của user đang đăng nhập
  async GetMyDepartmentTree(parent) {
    return await this.getDs(parent, `revenue/BscIndividualSummary/GetDepartmentTreeBsc`, [])
  },

  // Lấy danh sách người dùng theo phòng ban
  async GetUsersByDepartment(parent, departmentId) {
    return await this.getDs(
      parent,
      `report/StaffWorkReport/GetUsersByDepartment?departmentId=${departmentId}`,
      []
    )
  },

}
