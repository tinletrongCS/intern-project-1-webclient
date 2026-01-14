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
            if (isLoading) parent.loading(true);

            const response = await axios.post(path, data);

            if (isLoading) parent.loading(false);

            // ✅ LUÔN trả response.data
            return response?.data;

        } catch (e) {
            if (isLoading) parent.loading(false);

            // lỗi kỹ thuật (500, network...)
            return {
                success: false,
                message: 'Có lỗi xảy ra khi gọi API',
                data: defaultValue
            };
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
    getDepartmentByDepartmentIdLogin: (axios, departmentId) => axios.get('/User/Department/GetDepartmentsByRoot?rootId=' + departmentId),
    getBSCDetailUserMonth: (axios, userId, month) => axios.get('/revenue/DashboardBscUser/GetBSCDetailUserMonth?assignee_id=' + userId + '&month=' + month),
    GetListTaskTableBsc: (axios, input) =>
        axios.get(
            `/revenue/DashboardBscUser/GetListTaskTableBsc?month=${input.month}&assignee_id=${input.assignee_id}`
        ),
    GetBscUserOfTreeMonth: (axios, input) =>
        axios.get(
            `/revenue/DashboardBscUser/GetBscUserOfTreeMonth?month=${input.month}&assignee_id=${input.assignee_id}`
        ),
    CheckManagerAdmin: (axios, user_id) =>
        axios.get(
            `/revenue/DashboardBscUser/CheckManagerAdmin?userId=${user_id}`
        ),

    // Request Management
    async CreateRequestManagement(parent, payload, isLoading = true) {
        const path = `/work/RequestManagement`;
        return await this.postDs(parent, path, payload, null, isLoading);
    },

    GetListRequestUser: (axios, input) =>
        axios.get(
            `/work/RequestManagement/GetListRequestUserStatistical?fromday=${input.fromday}&today=${input.today}&assignee_id=${input.assignee_id}`
        ),

    DoingTask: async (taskId) => {
        const response = await axios.post(`/work/Task/DoingTask`, {
            task_id: taskId,
        });
        if (response.status !== 200) {
            throw new Error("Failed to fetch request info");
        }
        return response.data;
    },

    async ReportDoneTaskRequest(parent, payload, isLoading = true) {
        const path = `/work/RequestManagement/ReportDoneTaskRequest`;
        return await this.postDs(parent, path, payload, null, isLoading);
    },

    async GetTaskLog(parent, taskId) {
        return await this.getDs(parent, 'work/TaskLog/GetTaskLog?taskId=' + taskId, [])
    }
}