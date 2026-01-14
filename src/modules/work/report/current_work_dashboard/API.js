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
    async GetUsersByUserUnit(parent){
        return await this.getDs(parent, 'work/TaskReport/GetUsersByUserUnit',null)
    },

    async GetReportTaskByUserCurrent(parent, searchText, arrUserIds){
        return await this.getDs(parent, `work/TaskReport/GetReportTaskByUserCurrent?searchText=${searchText}&&arrUserIds=${arrUserIds}`,null, true)
    },
    async GetReportTaskByUserCurrentFunc(parent, searchText, arrUserIds, startDate, endDate){
        return await this.getDs(parent, `work/TaskReport/GetReportTaskByUserCurrentFunc?searchText=${searchText}&&arrUserIds=${arrUserIds}&&startDate=${startDate}&&endDate=${endDate}`,null, true)
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
    async GetBoardByTaskId(parent, taskId){
        return await this.getDs(parent, `work/TaskReport/GetBoardByTaskId?taskId=${taskId}`,0)
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
  }