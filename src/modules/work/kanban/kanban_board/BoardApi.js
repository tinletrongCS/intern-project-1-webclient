export default {
    getBoardsForManagement: (axios,boardtype_id) => axios.get('/work/Board/getBoardsForManagement?boardtype_id='+boardtype_id),
    getTypes: (axios) => axios.get('/work/Board/getTypes'),
    getTypes: (axios) => axios.get('/work/Board/getTypes'),
    getUserToAddToBoard: (axios) => axios.get('/user/getUserToAddToBoard'),
    getProjectToCreateBoard: (axios) => axios.get('/project/getProjectToCreateBoard'),
    insertBoard: (axios,data) => axios.post('/work/Board/insertBoard',data),
    updateBoard: (axios,data) => axios.put('/work/Board/updateBoard',data),
    getMemberInBoard: (axios,board_id) => axios.get('/work/Board/getMemberInBoard?board_id='+board_id),
    deleteBoard: (axios,board_id) => axios.delete('/work/Board/deleteBoard?board_id='+board_id),
    getRoleOfMemberBoard: (axios) => axios.get('/work/Board/getRoleOfMemberBoard'),
}
  