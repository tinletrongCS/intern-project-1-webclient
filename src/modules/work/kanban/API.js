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
    async GetMembersByBoard(parent, boardId){
        return await this.getDs(parent, 'work/Board/GetMembers?boardId='+boardId,[])
    },
    async GetTaskByStepInBoard(parent, data){
        return await this.getDs(parent, `work/Step/GetTaskByStepInBoard?boardID=${data.boardId}&searchText=${data.searchText}&customerID=${data.customerID}&creatorId=${data.creatorId}&assigneeID=${data.assigneeID}&statusID=${data.statusID}&ratingID=${data.ratingID}`,[], true)
    },
    async GetTaskByStepInBoardWithEF(parent, data){
        return await this.getDs(parent, `work/Step/GetTaskByStepInBoardWithEF?boardID=${data.boardId}&searchText=${data.searchText}&customerID=${data.customerID}&creatorId=${data.creatorId}&assigneeID=${data.assigneeID}&statusID=${data.statusID}&ratingID=${data.ratingID}`,[], true)
    },
    async DeleteStep(parent, stepId){
        try{
            parent.loading(true)
            let response = await parent.axios.delete('work/Step/DeleteStep', {
                params: { stepId: stepId }
            })
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async UpdateStepForTask(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Step/UpdateStepForTask',data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async DeleteTask(parent, taskId){
        try{
            parent.loading(true)
            let response = await parent.axios.delete('work/Task/DeleteTask', {
                params: { taskId: taskId }
            })
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async DoneTask(parent, taskId){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/DoneTask', { task_id: taskId })
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async DoingTask(parent, taskId){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/DoingTask', { task_id: taskId })
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
    async ComplaintDone(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/ComplaintDone', data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },

    async ClosedBoard(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Board/ClosedBoard',data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data
            }else{
              if(response.data.message){
                return response.data.message
              }else{
                return "Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return e.response.data.message
            }else{
                return 'Đã xảy ra lỗi'
            }
        }
    },
}