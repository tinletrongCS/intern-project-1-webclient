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
  async GetAllProject(parent) {
    return await this.getDs(parent, 'Project/GetAllProject', [])
  },
  async GetResourceSummaryByUnitWithRangeMonth(parent, data) {
    return await this.getDs(parent, `work/ResourceManagement/GetResourceSummaryByUnitWithRangeMonth?center_id=${data.center_id}&department_id=${data.department_id}&group_id=${data.group_id}&project_id=${data.project_id}&from_month=${data.from_month}&to_month=${data.to_month}`, [], true)
  },
  async GetResourceSummaryByUnitWithRangeMonthDetail(parent, data) {
    return await this.getDs(parent, `work/ResourceManagement/GetResourceSummaryByUnitWithRangeMonthDetail?center_id=${data.center_id}&department_id=${data.department_id}&group_id=${data.group_id}&project_id=${data.project_id}&from_month=${data.from_month}&to_month=${data.to_month}&assignee_id=${data.assignee_id}`, [], true)
  },
  
}