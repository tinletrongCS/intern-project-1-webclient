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
  async GetServiceOneBss(parent){
    return await this.getDs(parent, 'revenue/IndicatorConfig/GetServiceOneBss',null)
  },
  async GetIndicatorConfig(parent, data){
    return await this.getDs(parent, `revenue/IndicatorConfig/GetIndicatorConfig?searchText=${data.search_text}&&serviceId=${data.service_id}`,null, true)
  },
  async AddIndicatorConfig(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post(
        'revenue/IndicatorConfig/AddIndicatorConfig',
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
  async UpdateIndicatorConfig(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post(
        'revenue/IndicatorConfig/UpdateIndicatorConfig',
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
  }

}