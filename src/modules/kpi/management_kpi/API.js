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
    return await this.getDs(parent, `revenue/ManagementKpi/GetJobWorkPositionAndDepartmentTTKDGP`,null)
  },
  async GetManagementKpiList(parent, data){
    return await this.getDs(parent, `revenue/ManagementKpi/GetManagementKpiList?p_kpi_type=${data.kpi_type}&p_department_id=${data.department_id}&p_work_position_id=${data.work_position_id}&p_search_text=${data.search_text}&p_period_from=${data.period_from}&p_period_to=${data.period_to}`,null, true)
  },
  async GetManagementKpiListInsertUpdate(parent, data){
    return await this.getDs(parent, `revenue/ManagementKpi/GetManagementKpiListInsertUpdate?kpi_type=${data.kpi_type}&department_id=${data.department_id}&work_position_id=${data.work_position_id}&is_add=${data.is_add}&arr_management_kpi_id=${data.arr_management_kpi_id}&period_from=${data.period_from}&period_to=${data.period_to}`,null, true)
  },

  async AddManagementKpi(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/ManagementKpi/AddManagementKpi', data)
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
  async UpdateManagementKpi(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/ManagementKpi/UpdateManagementKpi', data)
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
  async DeleteManagementKpi(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/ManagementKpi/DeleteManagementKpi', data)
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