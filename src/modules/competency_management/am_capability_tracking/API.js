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
  
  // Lấy danh sách Nhóm dịch vụ
  async GetAllServiceGroup(parent){
    return await this.getDs(
      parent,
      `revenue/IndicatorConfig/GetAllServiceGroup`,
      []
    )
  },

  // Lấy danh sách Loại dịch vụ
  async GetAllServiceType(parent){
    return await this.getDs(
      parent,
      `revenue/IndicatorConfig/GetAllServiceType`,
      []
    )
  },

  // Lấy danh sách Đối tượng (AM, NVKD KHDN)
  async GetAllIndicatorObject(parent){
    return await this.getDs(
      parent,
      `revenue/IndicatorConfig/GetAllIndicatorObject`,
      []
    )
  },

  // Lấy danh sách Đơn vị 
  async GetDepartmentByRoot(parent, departmentId){
    return await this.getDs(
      parent,
      `user/Department/GetDepartmentsByRoot?rootId=${departmentId}`,
      null
    )
  },
  
  async GetServiceOneBss(parent){
    return await this.getDs(parent, 'revenue/IndicatorConfig/GetServiceOneBss',null)
  },
  async GetUsersByUserUnit(parent){
    return await this.getDs(parent, 'work/TaskReport/GetUsersByUserUnit',null)
  },
  async GetIndicatorTreeByUser(parent, data){
    return await this.getDs(parent, `revenue/AmCapabilityCracking/GetIndicatorTreeByUser?serviceId=${data.serviceId}&&userId=${data.userId}&&searchText=${data.searchText}&&statusId=${data.statusId}`,null, true)
  },
  async GetIndicatorUserStatistics(parent, data){
    return await this.getDs(parent, `revenue/AmCapabilityCracking/GetIndicatorUserStatistics?serviceId=${data.serviceId}&&userId=${data.userId}`,null, true)
  },
  async AddOrUpdateIndicatorUserScore(parent, formData) {
    try {
      parent.loading(true)

      const response = await axios.post(
        'revenue/AmCapabilityCracking/AddOrUpdateIndicatorUserScore',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      parent.loading(false)

      if (response?.data?.success) {
        return response.data.data
      } else {
        return response?.data?.message || 'Đã xảy ra lỗi'
      }
    } catch (e) {
      parent.loading(false)

      if (e.response?.data?.message) {
        return e.response.data.message
      }

      return 'Đã xảy ra lỗi'
    }
  },
  async GetIndicatorByUserScoreIds(parent, data){
    return await this.getDs(parent, `revenue/AmCapabilityCracking/GetIndicatorByUserScoreIds?arrIds=${data.arrIds}&&userId=${data.userId}`,null, true)
  },
  async ApproveIndicatorUserScore(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post(
        'revenue/AmCapabilityCracking/ApproveIndicatorUserScore',
        data
      )
      parent.loading(false)

      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if (response.data && response.data.message) {
          return response.data.message
        } else {
          return 'Đã xảy ra lỗi'
        }
      }
    } catch (e) {
      parent.loading(false)
      if (e.data && e.data.message) {
        return e.data.message
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message
      } else {
        return 'Đã xảy ra lỗi'
      }
    }
  },
  async RejectIndicatorUserScore(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post(
        'revenue/AmCapabilityCracking/RejectIndicatorUserScore',
        data
      )
      parent.loading(false)

      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if (response.data && response.data.message) {
          return response.data.message
        } else {
          return 'Đã xảy ra lỗi'
        }
      }
    } catch (e) {
      parent.loading(false)
      if (e.data && e.data.message) {
        return e.data.message
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message
      } else {
        return 'Đã xảy ra lỗi'
      }
    }
  },
  async CheckImportIndicatorUserScore(parent, data = null) {
    try {
      parent.loading(true)

      const response = await axios.post(
        'revenue/AmCapabilityCracking/CheckImportIndicatorUserScore',
        data
      )

      parent.loading(false)

      if (response && response.data && response.data.success) {
        return response.data.data ?? null
      } else {
        return null
      }
    } catch (e) {
      parent.loading(false)
      return null
    }
  },

  async ImportIndicatorUserScore(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post(
        'revenue/AmCapabilityCracking/ImportIndicatorUserScore',
        data
      )
      parent.loading(false)

      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if (response.data && response.data.message) {
          return response.data.message
        } else {
          return 'Đã xảy ra lỗi'
        }
      }
    } catch (e) {
      parent.loading(false)
      if (e.data && e.data.message) {
        return e.data.message
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message
      } else {
        return 'Đã xảy ra lỗi'
      }
    }
  },

}