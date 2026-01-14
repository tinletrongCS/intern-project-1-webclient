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
  async GetViolationReportMonth(parent, data) {
    const period = data?.period ?? 0
    const phongBan = data?.phongBan ?? 0
    return await this.getDs(parent, `report/ViolationRPT/GetViolationsReportMonth?period=${period}&phongBan=${phongBan}`, null, true)
  },
  // Lấy danh sách phòng ban theo cây đơn vị của user đăng nhập
  async GetMyDepartmentTree(parent) {
    return await this.getDs(parent, `revenue/BscIndividualSummary/GetDepartmentTreeBsc`, [])
  },
  // Lấy danh sách người dùng theo một phòng ban cụ thể
  async GetUsersByDepartment(parent, departmentId) {
    return await this.getDs(parent, `report/StaffWorkReport/GetUsersByDepartment?departmentId=${departmentId}`, [])
  },
  async GetUnitByParentId(arrParentId, level) {
    const response = await axios.get(
      `report/ViolationRPT/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch unit data");
    }

    const payload = response.data;

    if (!payload?.success) return [];

    // Chỉ trả về mảng
    return Array.isArray(payload?.data) ? payload.data : [];
  }


}
