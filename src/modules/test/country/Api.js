import axios from "axios"
export default {
    async getDs(parent, path, defaultValue){
        try{
            parent.loading(true)
            let response = await axios.get(path)
            parent.loading(false)
            if(response && response.data && response.data.code && response.data.code == 200 && response.data.success&&response.data.data) {
                return response.data.data
            }else{
                return defaultValue
            }
        }catch(e){
            parent.loading(false)
            return defaultValue
        }
    },
    async postDs(parent, path, data, defaultValue){
        try{
            parent.loading(true)
            let response = await axios.post(path, data)
            parent.loading(false)
            if(response && response.data && response.data.code && response.data.code == 200 && response.data.success&&response.data.data) {
                return response.data.data
            }else{
                return defaultValue
            }
        }catch(e){
            parent.loading(false)
            return defaultValue
        }
    },
    async getDsCountry(parent){
        return await this.getDs(parent, 'country', [])
    },
    async insertCountry(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('country/insert', data)
            parent.loading(false)
            if(response && response.data && response.data.code && response.data.code == 200 && response.data.success&&response.data.data) {
                if(response.data.data.code==100){
                    return '1'
                }else{
                    return response.data.data.message
                }
            }else{
                return 'Đã xảy ra lỗi thêm mới không thành công'
            }
        }catch(e){
            parent.loading(false)
            return 'Đã xảy ra lỗi thêm mới không thành công'
        }
    },
    async updateCountry(parent, data){
        try{
            parent.loading(true)
            let response = await axios.post('country/update', data)
            parent.loading(false)
            if(response && response.data && response.data.code && response.data.code == 200 && response.data.success&&response.data.data) {
                if(response.data.data.code==100){
                    return '1'
                }else{
                    return response.data.data.message
                }
            }else{
                return 'Đã xảy ra lỗi cập nhật không thành công'
            }
        }catch(e){
            parent.loading(false)
            return 'Đã xảy ra lỗi cậo nhật không thành công'
        }
    },
    async deleteCountry(parent, id){
        try{
            parent.loading(true)
            let response = await axios.delete(`country/delete?id=${id}`)
            parent.loading(false)
            if(response && response.data && response.data.code && response.data.code == 200 && response.data.success&&response.data.data) {
                if(response.data.data.code==102){
                    return '1'
                }else{
                    return response.data.data.message
                }
            }else{
                return 'Đã xảy ra lỗi xóa không thành công'
            }
        }catch(e){
            parent.loading(false)
            return 'Đã xảy ra lỗi xóa không thành công'
        }
    },
}