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
  async GetUsersByUserUnit(parent){
    return await this.getDs(parent, 'work/TaskReport/GetUsersByUserUnit',null)
  },

  // Lấy danh sách phòng ban theo cây đơn vị của user đăng nhập
  async GetMyDepartmentTree(parent) {
    return await this.getDs(parent, `report/StaffWorkReport/GetMyDepartmentTree`,[])
  },
  // Lấy danh sách người dùng theo một phòng ban cụ thể
  async GetUsersByDepartment(parent, departmentId) {
    return await this.getDs(parent, `report/StaffWorkReport/GetUsersByDepartment?departmentId=${departmentId}`, [])
  },

  async GetDepartmentOverviewKpiDay(parent, data, isLoading){
    return await this.getDs(parent,`revenue/OverviewKpi/GetDepartmentOverviewKpiDay?departmentId=${data.departmentId}&period=${data.period}`,null, isLoading)
  },
  async GetDepartmentOverviewKpiWeek(parent, data, isLoading){
    return await this.getDs(parent,`revenue/OverviewKpi/GetDepartmentOverviewKpiWeek?departmentId=${data.departmentId}&periodFrom=${data.periodFrom}&periodTo=${data.periodTo}`,null, isLoading)
  },
  async GetDepartmentOverviewKpiMonth(parent, data, isLoading){
    return await this.getDs(parent,`revenue/OverviewKpi/GetDepartmentOverviewKpiMonth?departmentId=${data.departmentId}&period=${data.period}`,null, isLoading)
  },
}