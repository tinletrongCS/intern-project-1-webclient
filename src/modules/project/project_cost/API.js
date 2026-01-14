import axios from "axios"
export default {
    async getDs(parent, path, defaultValue, isLoading = false) {
        try {
            if (isLoading) parent.loading(true)
            let response = await axios.get(path)
            if (isLoading) parent.loading(false)
            if (response && response.data && response.data.success) {
                return response.data.data
            } else {
                return defaultValue
            }
        } catch (e) {
            if (isLoading) parent.loading(false)
            return defaultValue
        }
    },
    async postDs(parent, path, data, defaultValue, isLoading = false) {
        try {
            if (isLoading) parent.loading(true)
            let response = await axios.post(path, data)
            if (isLoading) parent.loading(false)
            if (response && response.data && response.data.success) {
                return response.data.data
            } else {
                return defaultValue
            }
        } catch (e) {
            if (isLoading) parent.loading(false)
            return defaultValue
        }
    },
    async GetAllProjectCostType(parent) {
        return await this.getDs(parent, 'project/projectcost/cost-types', null)
    },
    async GetAllProject(parent) {
        return await this.getDs(parent, 'project/GetAllProject', [])
    },
    async GetAllProjectCost(parent, input) {
        return await this.getDs(parent, `project/projectcost/search?search_text=${input.search_text}&project_type_ids=${input.project_type_ids}&project_id=${input.project_id}`, [])
    },
    async GetProjectMembers(parent, projectId) {
        const path = `project/ProjectMember/GetMembersByProjectId`;
        const defaultValue = [];
        try {
            parent.loading(true);
            const response = await axios.get(path, { params: { projectId } });
            parent.loading(false);

            if (response && response.data && response.data.success) {
                let resultData = response.data.data;
                if (typeof resultData === 'string' && resultData.startsWith('[')) {
                    return JSON.parse(resultData);
                }
                return resultData;
            } else {
                if (parent.$toast) {
                    parent.$toast.error('Lỗi khi tải danh sách thành viên: ' + (response.data.message || 'Không thành công'));
                }
                return defaultValue;
            }
        } catch (e) {
            parent.loading(false);
            if (parent.$toast) {
                parent.$toast.error(e.response?.data?.message || 'Lỗi khi tải danh sách thành viên.');
            }
            return defaultValue;
        }
    },
    async AddProjectCost(parent, data) {
        try {
            parent.loading(true)
            let response = await axios.post('project/projectcost/add', data)
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
    async DeleteProjectCost(parent, arrId) {
        try {
            parent.loading(true)
            let response = await parent.axios.delete(`project/projectcost/delete?ids=${arrId}`)
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
    async UpdateProjectCost(parent, data) {
        try {
            parent.loading(true)
            let response = await axios.post('project/projectcost/update', data)
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

    async UploadFileCommon(parent, fromData, type, ref_id) {
        try {
            parent.loading(true)
            let response = await parent.axios.post('project/Upload/UploadFileCommon?type=' + type + '&ref_id=' + ref_id, fromData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
    async DeleteFileAttachment(parent, file_attachment_id) {
        try {
            parent.loading(true)
            let response = await parent.axios.delete('project/Upload/DeleteFileAttachment', {
                params: { file_attachment_id: file_attachment_id }
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

    async CheckAdmin(parent) {
        return await this.getDs(parent, 'revenue/PlannedRevenue/CheckAdmin', "0")
    },


}