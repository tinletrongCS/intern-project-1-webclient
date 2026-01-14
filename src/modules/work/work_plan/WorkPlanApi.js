export default {
    // getProjects: (axios) => axios.get('/work/Task/getProjects'),
    // checkPermissionTask: (axios) => axios.get('/work/Task/checkPermissionTask'),
    // getUsers: (axios) => axios.get('/work/Task/getUsers'),
    // getTasks: (axios,workTypeFilter,month_assign) => axios.get('/work/Task/getTasks?workTypeFilter='+workTypeFilter+'&month_assign='+month_assign),
    // getProgress: (axios) => axios.get('/work/Task/getProgress'),
    // updateTask: (axios,data,workTypeFilter,month_assign) => axios.post('/work/Task/updateTask?workTypeFilter='+workTypeFilter+'&month_assign='+month_assign,data),
    // updateTaskModal: (axios,data,header,workTypeFilter,month_assign) => axios.post('/work/Task/updateTaskModal?workTypeFilter='+workTypeFilter+'&month_assign='+month_assign,data,header),
    // deleteTask: (axios,task_id,workTypeFilter,month_assign) => axios.delete('/work/Task/deleteTask?workTypeFilter='+workTypeFilter+'&month_assign='+month_assign+'&task_id='+task_id),


    getBoards: (axios) => axios.get('/work/WorkSheet/getBoards'),
    getListWork: (axios,board_id,status_id,month) => axios.get('/work/WorkSheet/getListWork?board_id='+board_id+'&status_id='+status_id+'&month='+month),
    getProjects: (axios) => axios.get('/work/WorkSheet/getProjects'),
    getUsersTask: (axios,board_id) => axios.get('/work/WorkSheet/getUsersTask?board_id='+board_id),
    getJobTypes: (axios) => axios.get('/work/WorkSheet/getJobTypes'),
    getWork_Groups: (axios) => axios.get('/work/WorkSheet/getWork_Groups'),
    updateTask: (axios,rq,status_id,month) => axios.post('/work/WorkSheet/updateTask?status_id='+status_id+'&month='+month,rq),   

    getSteps: (axios,board_id) => axios.get('/work/WorkSheet/getSteps?board_id='+board_id),


    deleteTask: (axios,task_id,status_id,month_assign) => axios.delete('/work/WorkSheet/deleteTask?task_id='+task_id+'&status_id='+status_id+'&month='+month_assign),

}
  