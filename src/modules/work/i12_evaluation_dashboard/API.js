import axios from "axios";
export default {
  getEvaluationDashboard: async (params) => {
    const response = await axios.get(
      "/work/EvaluationDashboard/GetEvaluationDashboard",
      { params }
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch evaluation dashboard data");
    }
    return response.data;
  },
  async GetUnitByParentId(arrParentId, level) {
    const response = await axios.get(
      `revenue/PlannedRevenueRegion/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch unit data");
    }
    return response.data;
  },
  getDepartmentForAccount: async () => {
    const response = await axios.get(
      "/User/Department/getDepartmentForAccount"
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch department data");
    }
    return response.data;
  },
  getUserByDepartment: async (departmentId) => {
    const response = await axios.get(
      `/User/GetUserByDepartment?department_id=${departmentId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch users by department");
    }
    return response.data;
  },
  getReportI10EvaluationDashboard: async (params) => {
    const response = await axios.get(
      "/report/dashboard/DashboardQLCV/getReportI10",
      { params }
    );
    if (response.status !== 200) {
      throw new Error("Failed to export evaluation dashboard report");
    }
    return response.data;
  },
  getReportI10Details: async (priority, center_id, status_group, department_id, user_id, month) => {
    const response = await axios.get(
      "/report/dashboard/DashboardQLCV/getReportI10Details",
      {
        params: {
          priority,
          center_id,
          status_group,
          department_id,
          user_id,
          month,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch i10 detail report");
    }
    return response.data;
  },
  GetTaskDictionary: async () => {
    const response = await axios.get("/work/TaskDictionary/GetTaskDictionary");
    if (response.status !== 200) {
      throw new Error("Failed to fetch task dictionary");
    }
    return response.data;
  },
};
