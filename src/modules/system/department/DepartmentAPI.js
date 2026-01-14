export default {
    getTypeOfDep: (axios) => axios.get('/User/Department/getTypeOfDep'),
    getDepartments: (axios) => axios.get('/User/Department/getDepartments'),
    getDepartmentForTables: (axios) => axios.get('/User/Department/getDepartmentForTables'),
    insertDepartment: (axios,data) => axios.put('/User/Department/insertDepartment',data),
    updateDepartment: (axios,data) => axios.post('/User/Department/updateDepartment',data),
    deleteDepartment: (axios,id) => axios.delete('/User/Department/deleteDepartment?id='+id),
}
  