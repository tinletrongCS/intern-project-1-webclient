import axios  from "axios"
export default {
    async getDs(parent, path, defaultValue, isLoading = false){
        try{
            if (isLoading)parent.loading(true)
            let response = await axios.get(path)
            if (isLoading)parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
                return defaultValue
            }
        }catch(e){
            if (isLoading)parent.loading(false)
            return defaultValue
        }
    },
    async postDs(parent, path, data, defaultValue, isLoading = false){
        try{
            if (isLoading)parent.loading(true)
            let response = await axios.post(path, data)
            if (isLoading)parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
                return defaultValue
            }
        }catch(e){
            if (isLoading)parent.loading(false)
            return defaultValue
        }
    },
    async getMembersByBoard(parent, boardId){
        return await this.getDs(parent, 'work/Board/GetMembers?boardId='+boardId,[])
    },
    async CheckSubOwnerOrOwner(parent, boardId){
        return await this.getDs(parent, 'work/Board/CheckSubOwnerOrOwner?boardId='+boardId,{
            isOwner:false,
            isSubOwner:false
        })
    },
    async GetOnlyMemberByBoard(parent, boardId){
        return await this.getDs(parent, 'work/Board/GetOnlyMemberByBoard?boardId='+boardId,[])
    },
    async GetAllUser(parent){
        return await this.getDs(parent, 'user/GetAllUser',[])
    },

    async UpdateMembers(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('work/Board/UpdateMembers', data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
                if(response&&response.data&&response.data.message){
                    return response.data.message
                }else{
                    return 'Xảy ra lỗi'
                }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Xảy ra lỗi'
            }
        }
    },
}