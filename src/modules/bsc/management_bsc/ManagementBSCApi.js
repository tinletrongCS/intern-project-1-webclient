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
  async GetJobWorkPositionAndDepartmentTTKDGP(parent){
    return await this.getDs(parent, `revenue/ManagementBSC/GetJobWorkPositionAndDepartmentTTKDGP`,null)
  },
  async GetManagementBSCList(parent, data){
    return await this.getDs(parent, `revenue/ManagementBSC/GetManagementBSCList?p_work_position_id=${data.work_position_id}&p_search_text=${data.search_text}&p_from_month=${data.from_month}&p_to_month=${data.to_month}`,null, true)
  },
  async GetManagementBSCListInsertUpdate(parent, data){
    return await this.getDs(parent, `revenue/ManagementBSC/GetManagementBSCListInsertUpdate?work_position_id=${data.work_position_id}&is_add=${data.is_add}&arr_management_bsc_id=${data.arr_management_bsc_id}&from_month=${data.from_month}&to_month=${data.to_month}`,null, true)
  },

  async AddManagementBSC(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/ManagementBSC/AddManagementBSC', data)
          parent.loading(false)
          if (response && response.data && response.data.success) {
              return response.data.data
          } else {
              if (response.data.message) {
                  return response.data.message
              } else {
                  return "Đã xảy ra lỗi"
              }
          }
      } catch (e) {
          parent.loading(false)
          if (e.data && e.data.message) {
              return e.data.message
          } else if (e.response && e.response.data && e.response.data.message) {
              return e.response.data.message
          } else {
              return 'Đã xảy ra lỗi'
          }
      }
  },
  async UpdateManagementBSC(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/ManagementBSC/UpdateManagementBSC', data)
          parent.loading(false)
          if (response && response.data && response.data.success) {
              return response.data.data
          } else {
              if (response.data.message) {
                  return response.data.message
              } else {
                  return "Đã xảy ra lỗi"
              }
          }
      } catch (e) {
          parent.loading(false)
          if (e.data && e.data.message) {
              return e.data.message
          } else if (e.response && e.response.data && e.response.data.message) {
              return e.response.data.message
          } else {
              return 'Đã xảy ra lỗi'
          }
      }
  },
  async DeleteManagementBSC(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/ManagementBSC/DeleteManagementBSC', data)
          parent.loading(false)
          if (response && response.data && response.data.success) {
              return response.data.data
          } else {
              if (response.data.message) {
                  return response.data.message
              } else {
                  return "Đã xảy ra lỗi"
              }
          }
      } catch (e) {
          parent.loading(false)
          if (e.data && e.data.message) {
              return e.data.message
          } else if (e.response && e.response.data && e.response.data.message) {
              return e.response.data.message
          } else {
              return 'Đã xảy ra lỗi'
          }
      }
  },
  
}