import axios  from "axios"
// Nội bộ
const dtoApi = axios.create({
    baseURL: "http://10.70.31.24:9090",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer e2dca53252b7b32fa6d8bd9f711f62207df7a78c"
    },
    timeout: 15000
});
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

    async GetAllProject(parent){
        return await this.getDs(parent, 'Project/GetAllProject',[])
    },
    async GetBoardByUser(parent){
        return await this.getDs(parent, 'work/Board/GetBoardByUser',[])
    },
    async GetStepByBoardID(parent, boardId){
        return await this.getDs(parent, 'work/Step/GetByBoardID?boardId='+boardId,[])
    },

    async GetUserMemberByBoardId(parent, boardId){
        return await this.getDs(parent, 'work/Board/GetUserMemberByBoardId?boardId='+boardId,[])
    },
    async GetAllTaskDictionaryGroups(parent){
        return await this.getDs(parent, 'work/TaskDictionaryGroups/GetAllTaskDictionaryGroups',[])
    },
    async GetTaskDictionaryByGroupId(parent, groupId){
        return await this.getDs(parent, 'work/TaskDictionary/GetTaskDictionaryByGroupId?groupId='+groupId,[])
    },

    async GetTaskDictionary(parent){
        return await this.getDs(parent, 'work/TaskDictionary/GetTaskDictionary',null)
    },
    async GetServiceProjectAll(parent){
        return await this.getDs(parent, 'work/Task/GetServiceProjectAll',null)
    },

    async GetAllService(parent){
        return await this.getDs(parent, 'project/service/GetAllService',[])
    },

    async GetTimeTargetByJobtypeID(parent, groupId, jobTypeId){
        return await this.getDs(parent, `work/TimeTarget/GetTimeTargetByJobtypeID?groupId=${groupId}&&jobTypeId=${jobTypeId}`,0)
    },
    
    async AddTask(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/AddTask', data)
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

    async UploadFileTaskKanban(parent, fromData, taskId){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Upload/UploadFileTaskKanban?taskId='+taskId, fromData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
    async DeleteFileAttachment(parent, file_attachment_id){
        try{
            parent.loading(true)
            let response = await parent.axios.delete('work/Upload/DeleteFileAttachment', {
                params: { file_attachment_id: file_attachment_id }
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
    async GetTaskInfo(parent, taskId, boardId){
        return await this.getDs(parent, 'work/Task/GetTaskInfo?taskId='+taskId+"&boardId="+boardId,null)
    },
    async UploadFileTaskComment(parent, fromData, commentId){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Upload/UploadFileTaskComment?commentId='+commentId, fromData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
    async AddTaskComment(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/TaskComment/AddTaskComment', data)
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
    async GetTaskComment(parent, taskId){
        return await this.getDs(parent, 'work/TaskComment/GetTaskComment?taskId='+taskId,[])
    },
    async GetTaskLog(parent, taskId){
        return await this.getDs(parent, 'work/TaskLog/GetTaskLog?taskId='+taskId,[])
    },
    async IsOverTaskLimit(parent, assigneeId){
        return await this.getDs(parent, 'work/UserLimitTask/IsOverTaskLimit?assigneeId='+assigneeId,"Đã xảy ra lỗi, không check được giới hạn task giao")
    },

    async GetUserAssignByCustomerId(parent, customerId){
        return await this.getDs(parent, 'work/UserCustomerInvoice/GetUserAssignByCustomerId?customerId='+customerId,"Đã xảy ra lỗi, không lấy được thông tin người dùng phân cho tập khách hàng!")
    },
    async UpdateTask(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/UpdateTask', data)
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
    async CloneChildTask(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/CloneChildTask', data)
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
    async DuplicateTask(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/DuplicateTask', data)
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
    async DeleteFileAttachments(parent, file_attachment_ids) {
      try {
        parent.loading(true)
        let response = await parent.axios.delete('work/Upload/DeleteFileAttachments', {
          params: { file_attachment_ids: file_attachment_ids }
        })
        parent.loading(false)
        if (response && response.data && response.data.success) {
          return response.data.data
        } else {
          if (response.data.message) {
            return response.data.message
          } else {
            return "Đã xảy ra lỗi"
          }
        }
      } catch (e) {
        parent.loading(false)
        if (e.data && e.data.message) {
          return e.data.message
        } else if (e.response && e.response.data && e.response.data.message) {
          return e.response.data.message
        } else {
          return 'Đã xảy ra lỗi'
        }
      }
    },
    async ComplaintTask(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/ComplaintTask', data)
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
    async GetServicePresale(parent){
        return await this.getDs(parent, 'project/Service/GetServicePresale',null)
    },

    async GetProjectOneBss(parent) {
        const path = "/salary/common_sp/v1/d129afecd073f8c9d93339ed14ee023e";
        try {
            parent.loading(true);
            const response = await dtoApi.post(path, {})
            parent.loading(false);
            // API mới: code = 1 là thành công
            if (response?.data?.code == 1) {
                const list = response.data.result ?? []

                // lọc theo PHANVUNG_ID = 28 và lấy 3 trường
                const filtered = list
                    .filter(x => x.PHANVUNG_ID == 28)
                    .map(x => ({
                        DUAN_ID: x.DUAN_ID,
                        MA_DUAN: x.MA_DUAN,
                        TEN_DUAN: x.TEN_DUAN
                    }))

                return filtered
            } else {
                return []
            }
        } catch (err) {
            parent.loading(false)
            return []
        }
    },
    async CheckPercentPs(parent, data){
        try{
            parent.loading(true)
            let response = await parent.axios.post('work/Task/CheckPercentPs', data)
            parent.loading(false)
            if(response && response.data && response.data.success) {
                return response.data.data
            }else{
              if(response.data.message){
                return "ERROR:"+response.data.message
              }else{
                return "ERROR:Đã xảy ra lỗi"
              }
            }
        }catch(e){
            parent.loading(false)
            if(e.data&&e.data.message){
                return "ERROR:"+e.data.message
            }else if(e.response&&e.response.data&&e.response.data.message){
                return "ERROR:"+e.response.data.message
            }else{
                return 'ERROR:Đã xảy ra lỗi'
            }
        }
    },

  }