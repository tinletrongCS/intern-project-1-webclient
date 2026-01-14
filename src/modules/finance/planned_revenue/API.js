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
    async GetAllUnit(parent){
        return await this.getDs(parent, 'revenue/PlannedRevenue/GetUnitAll',null)
    },
    async GetUnitByParentId(parent, arrParentId, level){
        return await this.getDs(parent, `revenue/PlannedRevenue/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`,[])
    },
    async GetPlannedRevenue(parent, centerId, deparmentId, groupId, fromDate, toDate){
        return await this.getDs(parent, `revenue/PlannedRevenue/GetPlannedRevenue?centerId=${centerId}&&deparmentId=${deparmentId}&&groupId=${groupId}&&fromDate=${fromDate}&&toDate=${toDate}`,null, true)
    },
    async GetAllProject(parent){
        return await this.getDs(parent, 'Project/GetAllProject',[])
    },
    async GetItemRevenueAll(parent){
        return await this.getDs(parent, 'revenue/PlannedRevenue/GetItemRevenueAll',[])
    },
    async AddPlannedRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/PlannedRevenue/AddPlannedRevenue',data)
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
    async DeletePlannedRevenue(parent, arrId){
        try{
            parent.loading(true)
            let response = await parent.axios.delete('revenue/PlannedRevenue/DeletePlannedRevenue', {
                params: { arrId: arrId }
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
    async UpdatePlannedRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/PlannedRevenue/UpdatePlannedRevenue',data)
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
    async AddItemRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/PlannedRevenue/AddItemRevenue',data)
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
    async CheckAdmin(parent){
        return await this.getDs(parent, 'revenue/PlannedRevenue/CheckAdmin',"0")
    },
    async ImportPlannedRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/PlannedRevenue/ImportPlannedRevenue',data)
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
    async CheckImportPlannedRevenue(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('revenue/PlannedRevenue/CheckImportPlannedRevenue',data)
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