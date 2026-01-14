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
  async GetAllBSCLibrary(parent, searchText){
    return await this.getDs(parent, `revenue/BSCLibrary/GetAllBSCLibrary?searchKey=${searchText}`,[], true)
  },
  async UpdateBSCLibrary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('revenue/BSCLibrary/UpdateConfigBSC', data)
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