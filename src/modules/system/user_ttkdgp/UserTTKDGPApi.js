export default {
    getListUsers: (axios) => axios.get('/User/getUsersTTKDGP'),
    getRoles: (axios) => axios.get('/User/getRoles'),
    insertUser: (axios,data) => axios.put('/User/insertUser',data),
    updateUser: (axios,data) => axios.post('/User/updateUser',data),
    deleteUser: (axios,user_id) => axios.delete('/User/deleteUser?user_id='+user_id)
}
  