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
  async GetAllUnit(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenue/GetUnitAll', null)
  },
  async GetUnitByParentId(parent, arrParentId, level) {
    return await this.getDs(parent, `revenue/PlannedRevenue/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
  },

  async GetReportRevenueUnitDetailWithMonth(parent, centerId, deparmentId, groupId, fromDate, toDate) {
    return await this.getDs(parent, `revenue/Report/GetReportRevenueUnitDetailWithMonth?centerId=${centerId}&&deparmentId=${deparmentId}&&groupId=${groupId}&&fromDate=${fromDate}&&toDate=${toDate}`, null, true)
  },
  
}