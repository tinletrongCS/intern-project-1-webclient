import axios from "axios";

const API_PATH = '/work/Coordinator';

const getDs = async (parent, path, params = {}) => {
  try {
    parent.loading(true);
    let response = await axios.get(path, { params });
    return response.data;
  } catch (e) {
    if(e.response?.data?.message){
      parent.$toast.error(e.response?.data?.message)
    }
    return { success: false, data: [] };
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

const putDs = async (parent, path, data, config = {}) => {
  try {
    parent.loading(true);
    let response = await axios.put(path, data, config);
    return response.data;
  } catch (e) {
    parent.$toast.error(e.response?.data?.message || 'Cập nhật thất bại.');
    return { success: false, data: null, message: e.response?.data?.message || 'Cập nhật thất bại.' };
  } finally {
    parent.loading(false);
  }
};

const deleteDs = async (parent, path, data) => {
    try {
        parent.loading(true);
        let response = await axios.delete(path, { data: data });
        return response.data;
    } catch (e) {
        parent.$toast.error(e.response?.data?.message || 'Xóa thất bại.');
        return { success: false, message: e.response?.data?.message || 'Xóa thất bại.' };
    } finally {
        parent.loading(false);
    }
};


export default {
  GetAllCoordinators: (parent) => getDs(parent, `${API_PATH}/GetAllCoordinators`),
  AddCoordinator: (parent, data) => postDs(parent, `${API_PATH}/AddCoordinator`, data),
  UpdateCoordinator: (parent, data) => putDs(parent, `${API_PATH}/UpdateCoordinator`, data),
  DeleteCoordinators: (parent, data) => deleteDs(parent, `${API_PATH}/DeleteCoordinators`, data),
  GetAllEmployee: (parent) => getDs(parent, `${API_PATH}/GetAllEmployee`),
}