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
  
  async GetAmCapabilityReport(parent, data) {
    return await this.getDs(
      parent,
      `revenue/AmCapabilityReport/GetAmCapabilityReport`
      + `?departmentId=${data.departmentId}`
      + `&&period=${data.period}`
      + `&&searchName=${data.searchName || ''}`,
      null,
      true
    )
  }

}