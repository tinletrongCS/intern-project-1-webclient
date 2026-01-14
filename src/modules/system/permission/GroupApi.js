export default {
    getGroups: (axios) => axios.get('/permission/Group/getGroups'),
    insertGroup: (axios, data) => axios.put('/permission/Group/insertGroup', data),
    updateGroup: (axios, data) => axios.post('/permission/Group/updateGroup', data),
    deleteGroup: (axios, group_id) => axios.delete('/permission/Group/deleteGroup?group_id='+group_id ),
}
  