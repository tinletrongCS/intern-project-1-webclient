export default {
    getProjects: (axios) => axios.get('/work/Task/getProjects'),
    getReportTask: (axios, input) => axios.get(`/work/Report/getReportTask?month=${input.thang}&project_id=${input.project_id}`),
    getReportTaskByUser: (axios, input) => axios.get(`/work/Report/getReportTaskByUser?month=${input.thang}&project_id=${input.project_id}`),
    getReportDetailByUser: (axios, user_id,month,project_id,rownname) => axios.get(`/work/Report/getReportDetailByUser?user_id=${user_id}&month=${month}&project_id=${project_id}&rownname=${rownname}`),
}