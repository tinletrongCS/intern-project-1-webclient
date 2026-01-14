import axios from "axios";

const API_PATH = 'api/customer/ServiceDeclare';

const getDs = async (parent, path, params = {}) => {
  try {
    parent.loading(true);
    let response = await axios.get(path, { params });
    return response.data;
  } catch (e) {
    parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dữ liệu.');
    return { success: false, data: [] };
  } finally {
    parent.loading(false);
  }
};

const postDs = async (parent, path, data) => {
  try {
    parent.loading(true);
    let response = await axios.post(path, data);
    return response.data;
  } catch (e) {
    parent.$toast.error(e.response?.data?.message || 'Thao tác thất bại.');
    return null;
  } finally {
    parent.loading(false);
  }
};

const putDs = async (parent, path, data) => {
    try {
      parent.loading(true);
      let response = await axios.put(path, data);
      return response.data;
    } catch (e) {
      parent.$toast.error(e.response?.data?.message || 'Thao tác thất bại.');
      return null;
    } finally {
      parent.loading(false);
    }
  };

const deleteDs = async (parent, path, params = {}) => {
  try {
    parent.loading(true);
    let response = await axios.delete(path, { params });
    return response.data;
  } catch (e) {
    parent.$toast.error(e.response?.data?.message || 'Thao tác thất bại.');
    return null;
  } finally {
    parent.loading(false);
  }
};

export default {
  GetAllServiceDeclare: (parent, customerId, serviceId) => getDs(parent, `${API_PATH}/GetAllServiceDeclare`, { customerId, serviceId }),
  AddServiceDeclare: (parent, data) => postDs(parent, `${API_PATH}/AddServiceDeclare`, data),
  UpdateServiceDeclare: (parent, data) => putDs(parent, `${API_PATH}/UpdateServiceDeclare`, data),
  DeleteServiceDeclare: (parent, customerId, serviceId) => deleteDs(parent, `${API_PATH}/DeleteServiceDeclare`, { customerId, serviceId })
}