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
        return await this.getDs(parent, 'revenue/PlannedRevenueRegion/GetUnitAll', null)
    },
    async GetUnitByParentId(parent, arrParentId, level) {
        return await this.getDs(parent, `revenue/PlannedRevenueRegion/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
    },
    async GetDashboardRevenueRegionMonth(parent, regionId, centerId, departmentId, fromDate, toDate) {
        return await this.getDs(parent, `revenue/DashboardRevenueRegion/GetDashboardRevenueRegionMonth?regionId=${regionId}&centerId=${centerId}&departmentId=${departmentId}&fromDate=${fromDate}&toDate=${toDate}`, null)
    },
    async GetDashboardRevenueRegionCenter(parent, regionId, centerId, departmentId, fromDate, toDate) {
        return await this.getDs(parent, `revenue/DashboardRevenueRegion/GetDashboardRevenueRegionCenter?regionId=${regionId}&centerId=${centerId}&departmentId=${departmentId}&fromDate=${fromDate}&toDate=${toDate}`, null)
    },
    async GetDashboardRevenueRegionTotal(parent, regionId, centerId, departmentId, fromDate, toDate) {
        return await this.getDs(parent, `revenue/DashboardRevenueRegion/GetDashboardRevenueRegionTotal?regionId=${regionId}&centerId=${centerId}&departmentId=${departmentId}&fromDate=${fromDate}&toDate=${toDate}`, null)
    }
}