import axios from "axios";

const API_PATH = "/work/UserDayOff";

export default {
  async GetUserDayOff(parent, period) {
    try {
      parent.loading(true);
      let response = await axios.get(`${API_PATH}/GetUserDayOff`, {
        params: { period },
      });
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data;
      } else {
        parent.$toast.error(response.data?.message || "Không có dữ liệu.");
        return [];
      }
    } catch (e) {
      parent.loading(false);
      parent.$toast.error(e.response?.data?.message || "Lỗi khi tải dữ liệu.");
      return [];
    }
  },

  async CheckImportData(parent, data, thang_nam) {
    try {
      parent.loading(true);
      let response = await axios.post(
        `${API_PATH}/CheckImportDataResource?period=${thang_nam}`,
        data
      );
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data.data;
      } else {
        if (response.data.message) {
          return response.data.message;
        } else {
          return "Đã xảy ra lỗi";
        }
      }
    } catch (e) {
      parent.loading(false);
      if (e.data && e.data.message) {
        return e.data.message;
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
      } else {
        return "Đã xảy ra lỗi";
      }
    }
  },

  async DoImportDataResource(parent, data, thang_nam) {
    try {
      parent.loading(true);
      let response = await axios.post(
        `${API_PATH}/DoImportDataResource?period=${thang_nam}`,
        data
      );
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data.success;
      } else {
        if (response.data.message) {
          return response.data.message;
        } else {
          return "Đã xảy ra lỗi";
        }
      }
    } catch (e) {
      parent.loading(false);
      if (e.data && e.data.message) {
        return e.data.message;
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
      } else {
        return "Đã xảy ra lỗi";
      }
    }
  },

  async UpdateUserDayOff(parent, day_off_id, data) {
    try {
      parent.loading(true);
      let response = await axios.post(
        `${API_PATH}/UpdateUserDayOff?day_off_id=${day_off_id}`,
        data
      );
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data.success;
      } else {
        if (response.data.message) {
          return response.data.message;
        } else {
          return "Đã xảy ra lỗi";
        }
      }
    } catch (e) {
      parent.loading(false);
      if (e.data && e.data.message) {
        return e.data.message;
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
      } else {
        return "Đã xảy ra lỗi";
      }
    }
  },

  async DeleteUserDayOff(parent, day_off_id) {
    try {
      parent.loading(true);
      let response = await axios.post(
        `${API_PATH}/DeleteUserDayOff?day_off_id=${day_off_id}`,
        {}
      );
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data.success;
      } else {
        if (response.data.message) {
          return response.data.message;
        } else {
          return "Đã xảy ra lỗi";
        }
      }
    } catch (e) {
      parent.loading(false);
      if (e.data && e.data.message) {
        return e.data.message;
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
      } else {
        return "Đã xảy ra lỗi";
      }
    }
  },
};
