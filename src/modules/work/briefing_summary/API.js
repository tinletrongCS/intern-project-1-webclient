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
  async GetAllProject(parent){
    return await this.getDs(parent, 'Project/GetAllProject',[])
  },
  async GetBriefingSummaryWithEF(parent, data) {
    const params = new URLSearchParams({
        p_arr_department_ids: data.arrDepartmentIds,
        p_arr_project_ids: data.arrProjectIds,
        p_status_id: data.status_id,
        p_briefing_type: data.briefing_type,
        p_start_date: data.start_date,
        p_end_date: data.end_date
    });

    return await this.getDs(
        parent,
        `work/BriefingSummary/GetBriefingSummary?${params.toString()}`,
        '[]',
        true
    );
  },
  async GetAllUser(parent){
    return await this.getDs(parent, 'user/GetAllUser',[])
  },
  async GetDirectorUsers(parent){
    return await this.getDs(parent, 'user/GetDirectorUsers',[])
  },
  async CreateBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/CreateBriefingSummary', data)
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
  async UpdateBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/UpdateBriefingSummary', data)
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
  async DeleteBriefingSummary(parent, arrId) {
    try {
      parent.loading(true)
      let response = await parent.axios.delete('work/BriefingSummary/DeleteBriefingSummary', {
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
  async ApprovalBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/ApprovalBriefingSummary', data)
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
  async FeedbackBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/FeedbackBriefingSummary', data)
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
  async RatingBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/RatingBriefingSummary', data)
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

  async CreateBriefingSummaryDetail(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummaryDetail/CreateBriefingSummaryDetail', data)
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
  async UpdateBriefingSummaryDetail(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummaryDetail/UpdateBriefingSummaryDetail', data)
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
  async ReturnBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/ReturnBriefingSummary', data)
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
 //New
  async GetDepartmentBriefing(parent) {
    return await this.getDs(parent, 'work/BriefingSummary/GetDepartmentBriefing', null)
  },
  async GetProjectByDepartmentBriefing(parent, arrIds) {
    return await this.getDs(parent, `work/DepartmentProjectBriefing/GetProjectByDepartmentBriefing?arrIds=${arrIds}`, [])
  },
  async FeedbackBriefingSummaryDetail(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummaryDetail/FeedbackBriefingSummaryDetail', data)
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
  async RequestNotificationBriefingSummary(parent, data) {
      try {
          parent.loading(true)
          let response = await axios.post('work/BriefingSummary/RequestNotificationBriefingSummary', data)
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