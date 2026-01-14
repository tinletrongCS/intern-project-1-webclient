export default {
    getProjects: (axios) => axios.get('/work/project/getProjects'),
    insertProject: (axios,data) => axios.post('/work/project/insertProject',data),
    updateProject: (axios,data) => axios.put('/work/project/updateProject',data),
    deleteProject: (axios,project_id) => axios.delete('/work/project/deleteProject?project_id='+project_id),
}
  