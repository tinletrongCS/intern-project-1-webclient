export default {
    getProvinces: (axios) => axios.get('/User/Administrative_Subdivisions/getProvinces'),
    getDepartmentForAccount: (axios) => axios.get('/User/Department/getDepartmentForAccount'),
    getWards: (axios,province_id) => axios.get('/User/Administrative_Subdivisions/getWards?province_id='+province_id),
    getJobPositions: (axios) => axios.get('/User/Account/getJobPositions'),
    insertAccount: (axios,rq) => axios.post('/User/Account/insertAccount?time='+new Date(),rq),
    getAccountByUser: (axios,user_id) => axios.get('/User/Account/getAccountByUser?user_id='+ user_id)
}
    