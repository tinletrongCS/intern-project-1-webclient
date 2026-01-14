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

  async GetServiceOneBss(parent){
    return await this.getDs(parent, 'revenue/IndicatorConfig/GetServiceOneBss',null)
  },
  async GetContractProject123List(parent, data) {
    const searchText = data.searchText ?? ''
    const acceptancePeriod = data.acceptancePeriod ?? ''
    const status = data.status ?? 0

    return await this.getDs(
      parent,
      `revenue/ContractProject123/GetContractProject123List` +
        `?searchText=${searchText}` +
        `&&acceptancePeriod=${acceptancePeriod}` +
        `&&status=${status}`,
      null,
      true
    )
  },

  async CreateContractProject123(parent, formData) {
    try {
      parent.loading(true)

      const response = await axios.post(
        'revenue/ContractProject123/CreateContractProject123',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      parent.loading(false)

      if (response?.data?.success) {
        return response.data.data   // "1"
      } else {
        return response?.data?.message || 'Đã xảy ra lỗi'
      }
    } catch (e) {
      parent.loading(false)

      if (e.response?.data?.message) {
        return e.response.data.message
      }

      return 'Đã xảy ra lỗi'
    }
  },
  async UpdateContractProject123(parent, formData) {
    try {
      parent.loading(true)

      const response = await axios.post(
        'revenue/ContractProject123/UpdateContractProject123',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      parent.loading(false)

      if (response?.data?.success) {
        return response.data.data   // "1"
      } else {
        return response?.data?.message || 'Đã xảy ra lỗi'
      }
    } catch (e) {
      parent.loading(false)

      if (e.response?.data?.message) {
        return e.response.data.message
      }

      return 'Đã xảy ra lỗi'
    }
  },
  async DeleteContractProject123(parent, data) {
    try {
      parent.loading && parent.loading(true)

      const response = await axios.post(
        'revenue/ContractProject123/DeleteContractProject123',
        data
      )

      parent.loading && parent.loading(false)

      if (response?.data?.success) {
        return response.data.message // "1"
      } else {
        return response?.data?.message || 'Đã xảy ra lỗi'
      }
    } catch (e) {
      parent.loading && parent.loading(false)

      if (e.response?.data?.message) {
        return e.response.data.message
      }

      return 'Đã xảy ra lỗi'
    }
  },

  // Lấy danh sách user theo departmentId (cây phòng ban)
  async GetUserByDepartmentId(parent, departmentId) {
    return await this.getDs(
      parent,
      `user/GetUserByDepartmentId?departmentId=${departmentId}`,
      null
    )
  },

  // Lấy danh sách lãnh đạo TTKDGP (DB tự lấy DEPARTMENT_ID_DEFAULT_FOR_CONFIG)
  async GetLeaderTTKDGP(parent) {
      return await this.getDs(
        parent,
        `user/GetLeaderTTKDGP`,
        null
      )
  },
  async GetCustomerByCode(parent, code){
    if (!code || !code.trim()) return []
    return await this.getDs(
        parent,
        'customer/GetCustomerByCode?searchCode=' + encodeURIComponent(code),
        [], true
    )
  },
  async GetAccountByCode(parent, code) {
    if (!code || !code.trim()) return []

    return await this.getDs(
      parent,
      'user/Account/GetAccountByCode?searchCode=' + encodeURIComponent(code),
      [],true
    )
  },
  async GetAllCostContent(parent) {
    return await this.getDs(
      parent,
      `revenue/ContractProject123/GetAllCostContent`,
      []
    )
  },
  async GetProductServiceCatalog(parent) {
    return await this.getDs(
      parent,
      'revenue/ContractProject123/GetProductServiceCatalog',
      null
    )
  },
  async GetCustomerById(parent, customerId) {
    if (!customerId || customerId <= 0) return null

    return await this.getDs(
      parent,
      'customer/GetCustomerById?customerId=' + customerId,
      null,
      true
    )
  },
  async GetProject447List(parent, data) {
    const searchText = data.searchText ?? ''
    const period = data.period ?? ''     // YYYYMM
    const status = data.status ?? 0      // 0 | 1 | 2

    return await this.getDs(
      parent,
      `revenue/ContractProject123/GetProject447List` +
        `?searchText=${searchText}` +
        `&&period=${period}` +
        `&&status=${status}`,
      null,
      true
    )
  },

  /* =====================================================
   * =============== PROJECT 447 =========================
   * ===================================================== */

  async CreateProject447(parent, formData) {
    try {
      parent.loading(true)

      const response = await axios.post(
        'revenue/ContractProject123/CreateProject447',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      parent.loading(false)

      if (response?.data?.success) {
        return response.data.data   // "1"
      } else {
        return response?.data?.message || 'Đã xảy ra lỗi'
      }
    } catch (e) {
      parent.loading(false)

      if (e.response?.data?.message) {
        return e.response.data.message
      }

      return 'Đã xảy ra lỗi'
    }
  },

  async UpdateProject447(parent, formData) {
    try {
      parent.loading(true)

      const response = await axios.post(
        'revenue/ContractProject123/UpdateProject447',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      parent.loading(false)

      if (response?.data?.success) {
        return response.data.data   // "1"
      } else {
        return response?.data?.message || 'Đã xảy ra lỗi'
      }
    } catch (e) {
      parent.loading(false)

      if (e.response?.data?.message) {
        return e.response.data.message
      }

      return 'Đã xảy ra lỗi'
    }
  },

}