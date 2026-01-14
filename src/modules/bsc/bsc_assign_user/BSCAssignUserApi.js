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
        const path = `${'report/StaffWorkReport'}/GetMyDepartmentTree`;
        return await this.getDs(parent, path, null);
        // return result.success ? result.data : [];
    },

    getUsersByDepartment: (axios, departmentId) => axios.get('/report/StaffWorkReport/GetUsersByDepartment?departmentId=' + departmentId),
    getAccountByUser: (axios, user_id) => axios.get('/User/Account/getAccountByUser?user_id=' + user_id),
    getDetailEmployee: (axios, userId, month) => axios.get('/revenue/BSCAssignUser/GetAllBSCAssignUser?userId=' + userId + '&month=' + month),
    getDepartmentByDepartmentIdLogin: (axios, departmentId) => axios.get('/User/Department/GetDepartmentsByRoot?rootId=' + departmentId)
}