import axios from "axios";

const API_PATH = 'user/Account'; 

const getDs = async (parent, path, params = {}) => {
  try {
    parent.loading(true);
    let response = await axios.get(path, { params });
    return response.data;
  } catch (e) {
    if(e.response?.data?.message){
      parent.$toast.error(e.response?.data?.message)
    }
    //parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dữ liệu.');
    return { success: false, data: null };
  } finally {
    parent.loading(false);
  }
};

const postDs = async (parent, path, data, config = {}) => {
  try {
    parent.loading(true);
    let response = await axios.post(path, data, config);
    return response.data;
  } catch (e) {
    parent.$toast.error(e.response?.data?.message || 'Thao tác thất bại.');
    return { success: false, data: null, message: e.response?.data?.message || 'Thao tác thất bại.' };
  } finally {
    parent.loading(false);
  }
};

export default {
  getAccountByUser: (parent, userId) => getDs(parent, `${API_PATH}/getAccountByUser`, { user_id: userId }),

  updateAccountInfo: (parent, data) => postDs(parent, `${API_PATH}/updateAccountInfo`, data),

  updateAvatar: (parent, formData) => postDs(parent, `${API_PATH}/updateAvatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Kiểm tra avatar có tồn tại không (không loading spinner)
  checkAvatarExists: async (userId) => {
    try {
      const response = await axios.head(`${API_PATH}/getAvatar`, { params: { userId } });
      return response.status === 200;
    } catch (e) {
      return false;
    }
  },

  // Lấy avatar qua axios và trả về blob URL (fallback method)
  getAvatarBlob: async (userId) => {
    try {
      const response = await axios.get(`${API_PATH}/getAvatar`, {
        params: { userId },
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (e) {
      return null;
    }
  },

  // Tạo avatar URL với cache busting
  getAvatarUrl: (userId) => {
    const timestamp = new Date().getTime();
    const baseURL = axios.defaults.baseURL || '';
    return `${baseURL}/user/Account/getAvatar?userId=${userId}&t=${timestamp}`;
  }
}