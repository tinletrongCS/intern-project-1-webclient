export default {
    getMenuForManage: (axios) => axios.get('/permission/Menu/getMenuForManage'),
    getParentMenus: (axios) => axios.get('/permission/Menu/getParentMenus'),
    insertPermission: (axios,data) => axios.post('/permission/Menu/insertPermission',data),
    updatePermision: (axios,data) => axios.post('/permission/Menu/updatePermission',data),
    deletePermission: (axios,per_id) => axios.delete('/permission/Menu/deletePermission?per_id='+per_id),
}
  