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

  // Lấy danh sách phòng ban theo cây đơn vị của user đăng nhập
  async GetMyDepartmentTree(parent) {
    return await this.getDs(parent, `revenue/BscIndividualSummary/GetDepartmentTreeBsc`,[])
  },
  // Lấy danh sách người dùng theo một phòng ban cụ thể
  async GetUsersByDepartment(parent, departmentId) {
    return await this.getDs(parent, `report/StaffWorkReport/GetUsersByDepartment?departmentId=${departmentId}`, [])
  },
  async GetDepartmentTTKDGP(parent) {
    return await this.getDs(parent, `user/Department/GetDepartmentTTKDGP`, null)
  },

  async GetBscIndividualSummaryMonth(parent, data){
    try {
      parent.loading(true)
      let response = await axios.get(`revenue/BscIndividualSummary/GetBscIndividualSummaryMonth?p_period=${data.period}&p_assignee_ids=${data.assignee_ids}`)
      parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if(!response.data.success){
          parent.$toast.error(response.data.message)
        }
        return null
      }
    } catch (e) {
      parent.loading(false)
      return null
    }
  },
  async GetBscIndividualSummaryFinalScoresMonth(parent, data){
    try {
      parent.loading(true)
      let response = await axios.get(`revenue/BscIndividualSummary/GetBscIndividualSummaryFinalScoresMonth?p_period=${data.period}&p_assignee_ids=${data.assignee_ids}`)
      parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if(!response.data.success){
          parent.$toast.error(response.data.message)
        }
        return null
      }
    } catch (e) {
      parent.loading(false)
      return null
    }
  },
  async GetBscIndividualSummaryDetailTaskMonth(parent, data){
    try {
      parent.loading(true)
      let response = await axios.get(`revenue/BscIndividualSummary/GetBscIndividualSummaryDetailTaskMonth?p_period=${data.period}&p_assignee_ids=${data.assignee_ids}`)
      parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if(!response.data.success){
          parent.$toast.error(response.data.message)
        }
        return null
      }
    } catch (e) {
      parent.loading(false)
      return null
    }
  },

}