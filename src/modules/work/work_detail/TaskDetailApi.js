export default {
    getTaskDetail: (axios,task_id) => axios.get('/work/TaskDetail/getTaskDetail?task_id='+task_id),
    resolveTask: (axios,data,header) => axios.post('/work/TaskDetail/resolveTask', data,header),
    logWorkTask: (axios,task_id) => axios.get('/work/TaskDetail/logWorkTask?task_id='+task_id),
    assignTask: (axios,rq) => axios.post('/work/TaskDetail/assignTask',rq),
}
  