export default {
    getUsersInGroup: (axios, group_id) => axios.get('/permission/getUsersInGroup?group_id='+group_id),
    getUsersNotInGroup: (axios, group_id) => axios.get('/permission/getUsersNotInGroup?group_id='+group_id),
    getPermissonsInGroup: (axios, group_id) => axios.get('/permission/getPermissonsInGroup?group_id='+group_id),
    getPermissonsNotInGroup: (axios, group_id) => axios.get('/permission/getPermissonsNotInGroup?group_id='+group_id),
    addUserToGroup: (axios, data) => axios.post('/permission/addUserToGroup',data),
    removeUserToGroup: (axios, data) => axios.post('/permission/removeUserToGroup',data),
    addPermissionToGroup: (axios, data) => axios.post('/permission/addPermissionToGroup',data),
    removePermissionToGroup: (axios, data) => axios.post('/permission/removePermissionToGroup',data),
}
  