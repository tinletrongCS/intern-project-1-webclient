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
    return await this.getDs(parent, `revenue/AssignmentKpi/GetJobWorkPositionAndDepartmentTTKDGP`,null)
  },
  async GetAssignmentKpiResultList(parent, data){
    return await this.getDs(parent, `revenue/AssignmentKpi/GetAssignmentKpiResultList?p_kpi_type=${data.kpi_type}&p_department_id=${data.department_id}&p_work_position_id=${data.work_position_id}&p_period=${data.period}`,null, true)
  },
  async GetAssignmentKpiResultListUpdate(parent, data){
    return await this.getDs(parent, `revenue/AssignmentKpi/GetAssignmentKpiResultListUpdate?kpi_type=${data.kpi_type}&department_id=${data.department_id}&work_position_id=${data.work_position_id}&period=${data.period}&arr_assignment_kpi_id=${data.arr_assignment_kpi_id}`,null, true)
  },
  async UpdateAssignmentKpiResult(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/AssignmentKpi/UpdateAssignmentKpiResult', data)
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
  }
  
}