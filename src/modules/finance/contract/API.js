import axios from "axios";

// Base path được lấy từ Route attribute trong Controller
const API_BASE_PATH = 'revenue/contract/Contract';
const APPENDIX_API_PATH = 'revenue/contract/ContractAppendix';
const CONTRACT_VALUE_API_PATH = 'revenue/contract/ContractValue';
const ITEM_CONTRACT_API_PATH = 'revenue/contract/ItemContract';
const REVENUE_SHARING_API_PATH = 'revenue/contract/RevenueSharing';
const CONTRACT_REVENUE_API_PATH = 'revenue/contract/ContractRevenue';

// Hàm generic để gọi API GET và xử lý response
const getDs = async (parent, path, defaultValue, isLoading = false) => {
  try {
    if (isLoading) parent.loading(true);
    let response = await axios.get(path);
    if (isLoading) parent.loading(false);
    if (response && response.data && response.data.success) {
      return response.data.data;
    }
    if (parent.$toast) {
      parent.$toast.error('Lỗi khi tải dữ liệu: ' + response.data.message);
    }
    return defaultValue;
  } catch (e) {
    if (isLoading) parent.loading(false);
    if (parent.$toast) {
      parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải dữ liệu.');
    }
    return defaultValue;
  }
};

// Hàm generic để gọi API DELETE và xử lý response
const deleteDs = async (parent, path, params, defaultValue, isLoading = false) => {
  try {
    if (isLoading) parent.loading(true);
    let response = await axios.delete(path, { params });
    if (isLoading) parent.loading(false);
    if (response && response.data) {
      return response.data;
    }
    return { success: false, message: 'Phản hồi không hợp lệ từ server.' };
  } catch (e) {
    if (isLoading) parent.loading(false);
    if (parent.$toast) {
      parent.$toast.error(e.response?.data?.message || 'Thao tác xóa thất bại.');
    }
    return { success: false, message: e.response?.data?.message || 'Thao tác xóa thất bại.' };
  }
};

// Hàm generic để gọi API POST và xử lý response
const postDs = async (parent, path, data, successMessage, isLoading = true) => {
  try {
    if (isLoading) parent.loading(true);
    const response = await axios.post(path, data);
    if (isLoading) parent.loading(false);
    if (response.data && response.data.success) {
      parent.$toast.success(successMessage || response.data.message);
    } else {
      parent.$toast.error(response.data.message || 'Thao tác thất bại.');
    }
    return response.data;
  } catch (e) {
    if (isLoading) parent.loading(false);
    parent.$toast.error(e.response?.data?.message || 'Có lỗi xảy ra.');
    return null;
  }
};

export default {
  getDs,
  deleteDs,
  postDs,

  // Lấy danh sách dịch vụ
  async GetServices(parent) {
    return await this.getDs(parent, `${API_BASE_PATH}/GetServices`, [])
  },

  // Lấy danh sách người dùng
  async GetUsers(parent) {
    return await this.getDs(parent, `${API_BASE_PATH}/GetUsers`, null)
  },

  // Lấy danh sách đơn vị ký hợp đồng
  async GetUnits(parent) {
    return await this.getDs(parent, `${API_BASE_PATH}/GetUnitAll`, null)
  },

  // Lấy danh sách khách hàng đang hoạt động
  async GetCustomers(parent) {
    return await getDs(parent, `${API_BASE_PATH}/GetActiveCustomers`, [], true);
  },

  // Lấy danh sách dự án đang hoạt động
  async GetProjects(parent) {
    return await getDs(parent, `${API_BASE_PATH}/GetActiveProjects`, [], true);
  },

  // Lấy danh sách tất cả hợp đồng với thông tin đầy đủ
  async GetFullContractAll(parent, contractType) {
    let url = `${API_BASE_PATH}/GetFullContractAll`;
    if (contractType) {
      url += `?type=${contractType}`;
    }
    return await getDs(parent, url, [], true);
  },

  // Xóa hợp đồng theo ID hoặc mảng ID
  async DeleteContract(parent, ids) {
    try {
      parent.loading(true);
      let parsedIds;

      // Kiểm tra nếu ids là string JSON, parse nó thành mảng
      if (typeof ids === 'string') {
        try {
          parsedIds = JSON.parse(ids);
        } catch (e) {
          // Nếu không parse được, coi như là ID đơn lẻ
          parsedIds = [ids];
        }
      } else if (Array.isArray(ids)) {
        parsedIds = ids;
      } else {
        // Nếu là ID đơn lẻ
        parsedIds = [ids];
      }

      const response = await axios.delete(`${API_BASE_PATH}/DeleteContract`, {
        params: { ids: JSON.stringify(parsedIds) }
      });

      parent.loading(false);

      if (response && response.data) {
        return response.data;
      }
      return { success: false, message: 'Phản hồi không hợp lệ từ server.' };
    } catch (e) {
      parent.loading(false);
      if (parent.$toast) {
        parent.$toast.error(e.response?.data?.message || 'Thao tác xóa thất bại.');
      }
      return { success: false, message: e.response?.data?.message || 'Thao tác xóa thất bại.' };
    }
  },

  // Thêm mới hợp đồng với file đính kèm
  async AddContract(parent, formData) {
    try {
      parent.loading(true);
      const response = await axios.post(`${API_BASE_PATH}/AddContract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      parent.loading(false);
      if (response && response.data && response.data.success) {
        parent.$toast.success(response.data.message || 'Thêm mới thành công!');
      } else {
        parent.$toast.error(response.data.message || 'Thao tác thêm mới thất bại.');
      }
      return response.data;
    } catch (e) {
      parent.loading(false);
      if (parent.$toast) {
        parent.$toast.error(e.response?.data?.message || 'Thao tác thêm mới thất bại.');
      }
      return null;
    }
  },

  // Cập nhật thông tin hợp đồng với file đính kèm
  async UpdateContract(parent, formData) {
    try {
      parent.loading(true);
      const response = await axios.post(`${API_BASE_PATH}/UpdateContract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      parent.loading(false);
      if (response && response.data && response.data.success) {
        parent.$toast.success(response.data.message || 'Cập nhật thành công!');
      } else {
        parent.$toast.error(response.data.message || 'Thao tác cập nhật thất bại.');
      }
      return response.data;
    } catch (e) {
      parent.loading(false);
      if (parent.$toast) {
        parent.$toast.error(e.response?.data?.message || 'Thao tác cập nhật thất bại.');
      }
      return null;
    }
  },
  async downloadContractAttachment(parent, fileAttachmentId, fileName) {
    try {
      parent.loading(true);
      // Gọi đến endpoint mới trong ContractController
      const response = await axios.get(`${API_BASE_PATH}/DownloadAttachment`, {
        params: { fileAttachmentId }, // Truyền fileAttachmentId
        responseType: 'blob',
      });
      parent.loading(false);

      // Logic helper để trigger download trên trình duyệt (giữ nguyên)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      parent.loading(false);
      parent.$toast.error('Tải file thất bại. File có thể không còn tồn tại trên server.');
      console.error("Download error:", error);
    }
  },
  // ==========================================================
  // CÁC HÀM XỬ LÝ PHỤ LỤC HỢP ĐỒNG
  // ==========================================================
  // Lấy danh sách phụ lục theo ID hợp đồng
  async getAppendices(parent, contractId) {
    try {
      parent.loading(true);
      const response = await axios.get(`${APPENDIX_API_PATH}/GetAppendicesByContractId`, {
        params: { contractId }
      });
      parent.loading(false);
      if (response.data && response.data.success && typeof response.data.data === 'string') {
        try {
          response.data.data = JSON.parse(response.data.data);
        } catch (parseError) {
          console.error("Failed to parse appendix data:", parseError);
          parent.$toast.error('Lỗi xử lý dữ liệu phụ lục.');
          response.data.data = [];
        }
      }
      return response.data;
    } catch (e) {
      parent.loading(false);
      parent.$toast.error('Lỗi khi tải danh sách phụ lục.');
      return { success: false, data: [] };
    }
  },

  // Thêm mới phụ lục hợp đồng với file đính kèm
  async addAppendix(parent, formData) {
    try {
      parent.loading(true);
      const response = await axios.post(`${APPENDIX_API_PATH}/AddContractAppendix`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      parent.loading(false);
      if (!response.data.success) {
        parent.$toast.error(response.data.message || 'Thêm mới phụ lục thất bại.');
      }
      return response.data;
    } catch (e) {
      parent.loading(false);
      parent.$toast.error(e.response?.data?.message || 'Thao tác thêm mới thất bại.');
      return null;
    }
  },

  // Xóa phụ lục hợp đồng theo ID
  async deleteAppendix(parent, appendixId) {
    try {
      parent.loading(true);
      const response = await axios.delete(`${APPENDIX_API_PATH}/DeleteContractAppendix`, {
        params: { appendixId }
      });
      parent.loading(false);
      if (!response.data.success) {
        parent.$toast.error(response.data.message || 'Xóa phụ lục thất bại.');
      }
      return response.data;
    } catch (e) {
      parent.loading(false);
      parent.$toast.error(e.response?.data?.message || 'Thao tác xóa thất bại.');
      return null;
    }
  },

  // Tải file từ server về máy tính người dùng
  async downloadFileByPath(parent, filePath, fileName) {
    try {
      parent.loading(true);
      // Gọi đến endpoint Download trong UploadController
      const response = await axios.get(`revenue/Upload/Download`, {
        params: { filePath },
        responseType: 'blob',
      });
      parent.loading(false);

      // Logic helper để trigger download trên trình duyệt
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      parent.loading(false);
      parent.$toast.error('Tải file thất bại. File có thể không còn tồn tại trên server.');
      console.error("Download error:", error);
    }
  },
  // ==========================================================
  // HẠNG MỤC HỢP ĐỒNG (ITEM CONTRACT)
  // ==========================================================

  // Lấy danh sách hạng mục hợp đồng đang hoạt động
  async getActiveItemContracts(parent) {
    return await getDs(parent, `${ITEM_CONTRACT_API_PATH}/GetActive`, [], true);
  },

  // Thêm mới hạng mục hợp đồng
  async addItemContract(parent, requestBody) {
    return await postDs(parent, `${ITEM_CONTRACT_API_PATH}/Add`, requestBody, 'Thêm hạng mục thành công!');
  },

  // ==========================================================
  // GIÁ TRỊ HỢP ĐỒNG (CONTRACT VALUE)
  // ==========================================================

  // Lấy danh sách giá trị hợp đồng theo ID hợp đồng
  async getContractValues(parent, contractId) {
    try {
      parent.loading(true);
      const response = await axios.get(`${CONTRACT_VALUE_API_PATH}/GetByContractId`, { params: { contractId } });
      parent.loading(false);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return "[]";
    } catch (e) {
      parent.loading(false);
      parent.$toast.error('Lỗi khi tải giá trị hợp đồng.');
      return "[]";
    }
  },

  // Thêm mới hạng mục giá trị hợp đồng
  async addContractValue(parent, requestBody) {
    return await postDs(parent, `${CONTRACT_VALUE_API_PATH}/Add`, requestBody, 'Thêm hạng mục giá trị thành công!');
  },

  // Cập nhật hạng mục giá trị hợp đồng
  async updateContractValue(parent, requestBody) {
    return await postDs(parent, `${CONTRACT_VALUE_API_PATH}/Update`, requestBody, 'Cập nhật hạng mục thành công!');
  },

  // Xóa hạng mục giá trị hợp đồng
  async deleteContractValue(parent, contractValueIds) {
    const idsString = JSON.stringify(contractValueIds);
    return await deleteDs(parent, `${CONTRACT_VALUE_API_PATH}/Delete`, { ids: idsString });
  },
  // ==========================================================
  // PHÂN CHIA DOANH THU (REVENUE SHARING)
  // ==========================================================

  // Lấy dữ liệu phân chia doanh thu theo ID hợp đồng
  async getRevenueSharing(parent, contractId) {
    try {
      parent.loading(true);
      const response = await axios.get(`${REVENUE_SHARING_API_PATH}/GetByContractId`, { params: { contractId } });
      parent.loading(false);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return "[]";
    } catch (e) {
      parent.loading(false);
      parent.$toast.error('Lỗi khi tải dữ liệu phân chia doanh thu.');
      return "[]";
    }
  },

  // Thêm mới phân chia doanh thu
  async addRevenueSharing(parent, requestBody) {
    return await postDs(parent, `${REVENUE_SHARING_API_PATH}/Add`, requestBody, 'Thêm phân chia doanh thu thành công!');
  },

  // Cập nhật phân chia doanh thu
  async updateRevenueSharing(parent, requestBody) {
    return await postDs(parent, `${REVENUE_SHARING_API_PATH}/Update`, requestBody, 'Cập nhật phân chia doanh thu thành công!');
  },

  // Xóa phân chia doanh thu
  async deleteRevenueSharing(parent, revenueSharingIds) {
    const idsString = JSON.stringify(revenueSharingIds); // Chuyển mảng thành chuỗi JSON
    return await deleteDs(parent, `${REVENUE_SHARING_API_PATH}/Delete`, { ids: idsString });
  },
  // ==========================================================
  // DOANH THU HỢP ĐỒNG (CONTRACT REVENUE)
  // ==========================================================
  async getContractRevenue(parent, contractId) {
    try {
      parent.loading(true);
      const response = await axios.get(`${CONTRACT_REVENUE_API_PATH}/GetByContractId`, { params: { contractId } });
      parent.loading(false);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (e) {
      parent.loading(false);
      parent.$toast.error('Lỗi khi tải doanh thu hợp đồng.');
      return [];
    }
  },
  async addContractRevenue(parent, requestBody) {
    return await postDs(parent, `${CONTRACT_REVENUE_API_PATH}/Add`, requestBody, 'Thêm doanh thu thành công!');
  },
  async updateContractRevenue(parent, requestBody) {
    return await postDs(parent, `${CONTRACT_REVENUE_API_PATH}/Update`, requestBody, 'Cập nhật doanh thu thành công!');
  },
  async deleteContractRevenue(parent, contractRevenueIds) {
    const idsString = JSON.stringify(contractRevenueIds);
    return await deleteDs(parent, `${CONTRACT_REVENUE_API_PATH}/Delete`, { ids: idsString });
  },
};