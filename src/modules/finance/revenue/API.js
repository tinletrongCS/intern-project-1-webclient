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
  async GetAllUnit(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenue/GetUnitAll', null)
  },
  async GetUnitByParentId(parent, arrParentId, level) {
    return await this.getDs(parent, `revenue/PlannedRevenue/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
  },

  async GetActualRevenue(parent, centerId, deparmentId, groupId, fromDate, toDate) {
    return await this.getDs(parent, `revenue/ActualRevenue/GetActualRevenue?centerId=${centerId}&&deparmentId=${deparmentId}&&groupId=${groupId}&&fromDate=${fromDate}&&toDate=${toDate}`, null, true)
  },

  async GetAllProject(parent) {
    return await this.getDs(parent, 'Project/GetAllProject', [])
  },

  async GetItemRevenueAll(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenue/GetItemRevenueAll', [])
  },

  async AddItemRevenue(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post('revenue/PlannedRevenue/AddItemRevenue', data)
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
  async DeleteFileAttachment(parent, file_attachment_id) {
    try {
      parent.loading(true)
      let response = await parent.axios.delete('revenue/Upload/DeleteFileAttachment', {
        params: { file_attachment_id: file_attachment_id }
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
  async UploadFileCommon(parent, fromData, type, ref_id) {
    try {
      parent.loading(true)
      let response = await parent.axios.post('revenue/Upload/UploadFileCommon?type=' + type+'&ref_id='+ref_id, fromData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
  async AddActualRevenue(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post('revenue/ActualRevenue/AddActualRevenue', data)
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

  async DeleteActualRevenue(parent, arrId) {
    try {
      parent.loading(true)
      let response = await parent.axios.delete('revenue/ActualRevenue/DeleteActualRevenue', {
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

  async GetActualRevenueInfoById(parent, id) {
    return await this.getDs(parent, `revenue/ActualRevenue/GetActualRevenueInfoById?id=${id}`, null)
  },

  async UpdateActualRevenue(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post('revenue/ActualRevenue/UpdateActualRevenue', data)
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

  async GetContractAll(parent) {
    return await this.getDs(parent, `revenue/Contract/GetContractAll`, [])
  },
  async GetActualRevenueExportExcel(parent, centerId, deparmentId, groupId, fromDate, toDate) {
    return await this.getDs(parent, `revenue/ActualRevenue/GetActualRevenueExportExcel?centerId=${centerId}&&deparmentId=${deparmentId}&&groupId=${groupId}&&fromDate=${fromDate}&&toDate=${toDate}`, null, true)
  },
    async ImportActualRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/ActualRevenue/ImportActualRevenue',data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async CheckImportActualRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/ActualRevenue/CheckImportActualRevenue',data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async DeleteFileAttachments(parent, file_attachment_ids) {
      try {
        parent.loading(true)
        let response = await parent.axios.delete('revenue/Upload/DeleteFileAttachments', {
          params: { file_attachment_ids: file_attachment_ids }
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
    
  }
