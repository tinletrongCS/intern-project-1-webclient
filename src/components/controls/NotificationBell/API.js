import axios from "axios";

export default {
  async getDs(parent, path, defaultValue, isLoading = false) {
    try {
      if (isLoading) parent.loading(true);
      let response = await axios.get(path);
      if (isLoading) parent.loading(false);
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return defaultValue;
      }
    } catch (e) {
      if (isLoading) parent.loading(false);
      return defaultValue;
    }
  },

  async postDs(parent, path, data, defaultValue, isLoading = false) {
    try {
      if (isLoading) parent.loading(true);
      let response = await axios.post(path, data);
      if (isLoading) parent.loading(false);
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return defaultValue;
      }
    } catch (e) {
      if (isLoading) parent.loading(false);
      return defaultValue;
    }
  },

  // Lấy danh sách notification theo user
  async GetByUser(parent, userId, pageIndex, pageSize) {
    return await this.getDs(parent, `notifyHub/notification/user/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`, []);
  },

  // Đánh dấu 1 thông báo đã đọc
  async MarkAsRead(parent, notiId, data) {
    try {
      parent.loading(true)
      let response = await axios.post(`notifyHub/notification/mark-as-read/${notiId}`, data)
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

  // Đánh dấu tất cả đã đọc
  async MarkAllAsRead(parent, userId, data) {
    try {
      parent.loading(true)
      let response = await axios.post(`notifyHub/notification/mark-as-read-all/${userId}`, data)
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
  async GetTaskInfo(parent, taskId, boardId) {
    return await this.getDs(parent, 'work/Task/GetTaskInfo?taskId=' + taskId + "&boardId=" + boardId, null)
  },
  async GetUserByID(parent, userId) {
    return await this.getDs(parent, `notifyHub/notification/GetUserByID?user_id=${userId}`, null);
  },
  async GetBriefingSummaryById(parent, id) {
    return await this.getDs(parent, `work/BriefingSummary/GetBriefingSummaryById?id=${id}`, null)
  },
  // Bat/Tat nhan thong bao
  async UpdateUserNotifyByID(parent, data) {
    try {
      parent.loading(true)
      let response = await axios.post(`notifyHub/notification/UpdateUserNotifyByID`, data)
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
  // Tạo thông báo mới
  async CreateNotification(parent, notification) {
    return await this.postDs(parent, `notifyHub/notification/create`, notification, null);
  },
};
