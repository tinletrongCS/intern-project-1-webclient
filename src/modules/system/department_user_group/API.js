import { NullLogger } from "@microsoft/signalr"
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
  async GetUnitByParentId(parent, arrParentId, level) {
    return await this.getDs(parent, `user/Department/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
  },
  async GetUsersByDepartment(parent, departmentId) {
    return await this.getDs(parent, `user/Department/GetUsersByDepartment?departmentId=${departmentId}`, null, true)
  },

  async AddDepartmentUserGroup(parent, data) {
    try {
        parent.loading(true)
        let response = await axios.post('user/Department/AddDepartmentUserGroup', data)
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
  async RemoveDepartmentUserGroup(parent, data) {
    try {
        parent.loading(true)
        let response = await axios.post('user/Department/RemoveDepartmentUserGroup', data)
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