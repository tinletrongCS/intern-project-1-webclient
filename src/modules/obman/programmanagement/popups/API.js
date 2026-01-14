export default {
    getAll: async (axios) => axios.get(`/package/getAll`),
    progType: async (axios) => axios.get(`/progType?size=100000`),
    progPackage: async (axios) => axios.get(`/progpackage/findByAll`),
    programGroupName: async (axios) => axios.get(`/programGroupName/get?size=100000`),
    
    getAllProgram: async (axios) => axios.get(`program/getAll`),

    getDataProgram: async (axios, id, name, value) => axios.get(`/program/getdata?id=${id}&name=${name}&value=${value}`),
    
    addDataProgram: async (axios, id, data) => axios.put(`program/adddata?id=${id}`, data),
    updateDataProgram: async (axios, id, data) => axios.put(`program/updata?id=${id}`, data),
    deleteDataProgram: async (axios, id, data) => axios.put(`program/deldata?id=${id}`, data),
    
    editOBProgram: async (axios, id, data, header) => axios.put(`program/editOB?id=${id}`, data, header),

    getProgramById: async (axios, id) => axios.get(`program/getId?id=${id}`),
   
    addOBProgram: async (axios, data, header) => axios.post(`program/addOB`, data, header),

    searchUser: async (axios, user_name) => axios.get(`search-user?user_name=${user_name}`),

    getKBan: async (axios, id) => axios.get(`program/getKBan?id=${id}`),
    addKBan: async (axios, id, data, header) => axios.post(`program/kban?id=${id}`, data, header),
    
}