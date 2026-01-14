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

    async GetDepartmentTTKDGP(parent) {
        return await this.getDs(parent, `user/Department/GetDepartmentTTKDGP`, null)
    },

    async GetMyDepartmentTree(parent) {
        const path = `${'revenue/BSCAssignUser'}/GetDepartmentTreeUpdateResult`;
        return await this.getDs(parent, path, null);
        // return result.success ? result.data : [];
    },

    getUsersByDepartment: (axios, departmentId) => axios.get('/report/StaffWorkReport/GetUsersByDepartment?departmentId=' + departmentId),
    getAccountByUser: (axios, user_id) => axios.get('/User/Account/getAccountByUser?user_id=' + user_id),
    getDetailEmployee: (axios, userId, month) => axios.get('/revenue/BSCAssignUser/GetAllBSCAssignUser?userId=' + userId + '&month=' + month),
    getDepartmentByDepartmentIdLogin: (axios, departmentId) => axios.get('/User/Department/GetDepartmentsByRoot?rootId=' + departmentId),
    async GetListBSCAssignUser(parent, data, user_id, month) {
        return await this.getDs(parent, `revenue/BSCAssignUser/GetListBSCAssignUser?user_id=${user_id}&bsc_library_ids=${data}&month=${month}`, null, true)
    },
    async UpdateResultBSC(parent, data) {
        try {
            parent.loading(true)
            let response = await axios.post('revenue/BSCAssignUser/UpdateResultBSC', data)
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
    async GetJobWorkPositionAndDepartmentTTKDGP(parent) {
        return await this.getDs(parent, `revenue/ManagementBSC/GetJobWorkPositionAndDepartmentTTKDGP`, null)
    },
    async GetUpdateResultBSCListUpdate(parent, data) {
        return await this.getDs(parent, `revenue/BSCAssignUser/GetUpdateResultBSCListUpdate?department_id=${data.department_id}&work_position_id=${data.work_position_id}&period=${data.period}&arr_update_result_bsc_id=${data.arr_assignment_kpi_id}`, null, true)
    },
    async GetUpdateResultBSCList(parent, data) {
        return await this.getDs(parent, `revenue/BSCAssignUser/GetUpdateResultBSCList?p_department_id=${data.department_id}&p_work_position_id=${data.work_position_id}&p_period=${data.period}`, null, true)
    },
    async UpdateResultBSC(parent, data) {
        try {
            parent.loading(true)
            let response = await axios.post('revenue/BSCAssignUser/UpdateResultBSC', data)
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