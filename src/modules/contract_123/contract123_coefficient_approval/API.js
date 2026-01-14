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

  async GetPayrollApprovalList(parent, data) {
      const searchText = data.searchText ?? ''
      const docDateFrom = data.docDateFrom ?? ''
      const docDateTo = data.docDateTo ?? ''
      const approvalStatus = data.approvalStatus ?? 0
      const contractStatus = data.contractStatus ?? 0

      return await this.getDs(
        parent,
        `revenue/ContractProject123/GetPayrollApprovalList` +
          `?searchText=${searchText}` +
          `&&docDateFrom=${docDateFrom}` +
          `&&docDateTo=${docDateTo}` +
          `&&approvalStatus=${approvalStatus}` +
          `&&contractStatus=${contractStatus}`,
        null,
        true
      )
  },
  async ApproveSalary(parent, data) {
    try {
      parent.loading(true)

      let response = await axios.post(
        'revenue/ContractProject123/ApproveSalary',
        data
      )

      parent.loading(false)

      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if (response.data && response.data.message) {
          return response.data.message
        } else {
          return 'Đã xảy ra lỗi'
        }
      }
    } catch (e) {
      parent.loading(false)

      if (e.data && e.data.message) {
        return e.data.message
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message
      } else {
        return 'Đã xảy ra lỗi'
      }
    }
  },
  async GetProject447CoefficientApprovalList(parent, data) {
    const searchText = data.searchText ?? ''
    const period = data.period ?? ''     // YYYYMM
    const status = data.status ?? 0      // 0 | 1 | 2

    return await this.getDs(
      parent,
      `revenue/ContractProject123/GetProject447CoefficientApprovalList` +
        `?searchText=${searchText}` +
        `&&period=${period}` +
        `&&status=${status}`,
      null,
      true
    )
  },
  async ConfirmServiceRateProject123(parent, data) {
    try {
      parent.loading(true)

      let response = await axios.post(
        'revenue/ContractProject123/ConfirmServiceRateProject123',
        data
      )

      parent.loading(false)

      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        if (response.data && response.data.message) {
          return response.data.message
        } else {
          return 'Đã xảy ra lỗi'
        }
      }
    } catch (e) {
      parent.loading(false)

      if (e.data && e.data.message) {
        return e.data.message
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message
      } else {
        return 'Đã xảy ra lỗi'
      }
    }
  }

}