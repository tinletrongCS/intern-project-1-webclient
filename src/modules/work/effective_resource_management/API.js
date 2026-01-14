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
  // Lấy ds đơn vị
  async GetAllUnit(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenue/GetUnitAll', null)
  },
  // Lấy ds đơn vị con từ id cha
  async GetUnitByParentId(parent, arrParentId, level) {
    return await this.getDs(parent, `revenue/PlannedRevenue/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
  },
  // Lấy ds user từ id đơn vị
  async GetUserByUnit(parent, department_id) {
    return await this.getDs(parent, `work/ResourceManagement/GetUserByUnit?department_id=${department_id}`, [])
  },
  async GetUserMemberByBoardId(parent, boardId) {
    return await this.getDs(parent, 'work/Board/GetUserMemberByBoardId?boardId=' + boardId, [])
  },
  async GetBoardByTaskCode(parent, task_code) {
    return await this.getDs(parent, 'work/Board/GetBoardByTaskCode?task_code=' + task_code, {})
  },
  async GetBoardByProject(parent, project_id) {
    return await this.getDs(parent, 'work/Board/GetBoardByProject?project_id=' + project_id, [])
  },
  async GetStepByBoardID(parent, boardId) {
    return await this.getDs(parent, 'work/Step/GetByBoardID?boardId=' + boardId, [])
  },
  async GetResourceByUnitWithRangeMonth(parent, data) {
    return await this.getDs(parent, `work/ResourceManagement/GetResourceByUnitWithRangeMonth?center_id=${data.center_id}&department_id=${data.department_id}&group_id=${data.group_id}&project_id=${data.project_id}&from_month=${data.from_month}&to_month=${data.to_month}`, [], true)
  },
  async GetAllProject(parent) {
    return await this.getDs(parent, 'Project/GetAllProject', [])
  },
  async AddDataResource(parent, step_id, data) {
    try {
      parent.loading(true)
      let response = await axios.post('work/ResourceManagement/AddDataResource?step_id=' + step_id, data)
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
  async DeleteDataResource(parent, arrId) {
    try {
      parent.loading(true)
      let response = await parent.axios.delete('work/ResourceManagement/DeleteDataResource', {
        params: { arrId: arrId }
      })
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
  async UpdateDataResource(parent, step_id, data) {
    try {
      parent.loading(true)
      let response = await axios.post('work/ResourceManagement/UpdateDataResource?step_id=' + step_id, data)
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
  async CheckAdmin(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenue/CheckAdmin', "0")
  },
  async DoImportDataResource(parent, step_id, data) {
    try {
      parent.loading(true)
      let response = await axios.post('work/ResourceManagement/DoImportDataResource?step_id=' + step_id, data)
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
  async CheckImportData(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post('work/ResourceManagement/CheckImportDataResource', data)
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