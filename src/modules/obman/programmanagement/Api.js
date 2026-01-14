export default {
    ds_don_vi: async (axios) => axios.get(`/search-org`),
    get_list_program: async (axios, data) => axios.get(`/program/get?fromN=${data.tungay}&toN=${data.denngay}&txt=${data.txt}&dvi=${data.dvi}&status=${data.status}&size=1000000`),
    delOB: async (axios, data) => axios.post(`/program/delOB`, data),
}