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
    async GetAllUnit(parent) {
        return await this.getDs(parent, 'revenue/DashboardRevenue/GetUnitAll', null)
    },
    async GetUnitByParentId(parent, arrParentId, level) {
        return await this.getDs(parent, `revenue/DashboardRevenue/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
    },
    async GetDashboardRevenueMonth(parent, centerId, departmentId, groupId, fromDate, toDate) {
        return await this.getDs(parent, `revenue/DashboardRevenue/GetDashboardRevenueMonth?centerId=${centerId}&departmentId=${departmentId}&groupId=${groupId}&fromDate=${fromDate}&toDate=${toDate}`, [])
    },
    async GetDashboardRevenueDepartment(parent, centerId, departmentId, groupId, fromDate, toDate) {
        return await this.getDs(parent, `revenue/DashboardRevenue/GetDashboardRevenueDepartment?centerId=${centerId}&departmentId=${departmentId}&groupId=${groupId}&fromDate=${fromDate}&toDate=${toDate}`, [])
    },
    async GetDashboardRevenueTotal(parent, centerId, departmentId, groupId, fromDate, toDate) {
        return await this.getDs(parent, `revenue/DashboardRevenue/GetDashboardRevenueTotal?centerId=${centerId}&departmentId=${departmentId}&groupId=${groupId}&fromDate=${fromDate}&toDate=${toDate}`, [])
    }
}