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

  async GetCashReceiptPendingList(parent, data) {
    const searchText = data.searchText ?? ''
    const paymentDateFrom = data.paymentDateFrom ?? ''
    const paymentDateTo = data.paymentDateTo ?? ''
    const confirmStatus = data.confirmStatus ?? 0
    const acceptanceDateFrom = data.acceptanceDateFrom ?? ''
    const acceptanceDateTo = data.acceptanceDateTo ?? ''

    return await this.getDs(
      parent,
      `revenue/ContractProject123/GetCashReceiptPendingList` +
        `?searchText=${searchText}` +
        `&&paymentDateFrom=${paymentDateFrom}` +
        `&&paymentDateTo=${paymentDateTo}` +
        `&&confirmStatus=${confirmStatus}` +
        `&&acceptanceDateFrom=${acceptanceDateFrom}` +
        `&&acceptanceDateTo=${acceptanceDateTo}`,
      null,
      true
    )
  },
  async ConfirmCashReceipt(parent, data) {
    try {
      parent.loading(true)

      // ===== build FormData =====
      const formData = new FormData()
      formData.append('contract_project_123_id', data.contract_project_123_id)
      formData.append('receipt_amount', data.receipt_amount)
      formData.append('payment_date', data.payment_date)
      formData.append('invoice_no', data.invoice_no)
      formData.append('note', data.note || '')

      if (data.file) {
        formData.append('file', data.file)
      }

      let response = await axios.post(
        'revenue/ContractProject123/ConfirmCashReceipt',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
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
  async GetProject447DataApprovalList(parent, data) {
    const searchText = data.searchText ?? ''
    const period = data.period ?? ''     // YYYYMM
    const status = data.status ?? 0      // 0 | 1 | 2

    return await this.getDs(
      parent,
      `revenue/ContractProject123/GetProject447DataApprovalList` +
        `?searchText=${searchText}` +
        `&&period=${period}` +
        `&&status=${status}`,
      null,
      true
    )
  },
  async ApproveProject447(parent, data) {
    try {
      parent.loading(true)

      let response = await axios.post(
        'revenue/ContractProject123/ApproveProject447',
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
  async ReturnProject447(parent, data) {
    try {
      parent.loading(true)

      let response = await axios.post(
        'revenue/ContractProject123/ReturnProject447',
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
  async SyncProject447(parent, data) {
    try {
      parent.loading(true)

      let response = await axios.post(
        'revenue/ContractProject123/SyncProject447',
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