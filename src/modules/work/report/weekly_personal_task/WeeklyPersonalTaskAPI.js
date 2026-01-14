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
  getDetailByDate: (axios, input) =>
    axios.get(
      `/report/dashboard/DashboardWeeklyTask/getDetailByDate?assignee_id=${input.assignee_id}&fromDate=${input.fromDate}&toDate=${input.toDate}`
    ),
};
