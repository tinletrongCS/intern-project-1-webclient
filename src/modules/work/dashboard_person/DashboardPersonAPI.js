import axios  from "axios";
export default {
  async getDs(parent, path, defaultValue, isLoading = false){
    try{
      if (isLoading)parent.loading(true)
        let response = await axios.get(path)
      if (isLoading)parent.loading(false)
      if(response && response.data && response.data.success) {
        return response.data.data
      }else{
        return defaultValue
      }
    }catch(e){
      if (isLoading)parent.loading(false)
      return defaultValue
    }
  },
  async getUsersByUserUnit(parent){
    return await this.getDs(parent, '/work/TaskReport/GetUsersByUserUnit',null)
  },
  getDetailByMonth: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardQLCV/getDetailByMonth?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  getAverageQualityOfTreeMonth: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardQLCV/getAverageQualityOfTreeMonth?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  getCountWorkingOverDue: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardQLCV/getCountWorkingOverDue?assignee_id=${input.assignee_id}`
    ),
  getAverageQualityOfWork: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardQLCV/getAverageQualityOfWork?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  getTaskByJobType: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardQLCV/getTaskByJobType?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
  getTaskDetailTable: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardQLCV/getTaskDetailTable?month=${input.month}&assignee_id=${input.assignee_id}`
    ),
};
