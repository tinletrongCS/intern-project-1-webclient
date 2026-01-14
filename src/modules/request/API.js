import APIREPORT from "../work/report/current_work_dashboard/API.js";
import APITASKKANBAN from "../work/kanban/task/API.js";
import axios from "axios";
export const RequestApi = {
  getDepartmentForAccount: () =>
    axios.get("/User/Department/getDepartmentForAccount"),
  GetUsersByUserUnit: async (parent) =>
    JSON.parse((await APIREPORT.GetUsersByUserUnit(parent)) ?? "[]"),
  GetServiceProjectAll: async (parent) =>
    JSON.parse((await APITASKKANBAN.GetServiceProjectAll(parent)) ?? "[]"),
  GetUserByDepartment: async (departmentId) => {
    const response = await axios.get(
      `/User/GetUserByDepartment?department_id=${departmentId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch users by department");
    }
    return response.data;
  },
  async DeleteFileAttachment(parent, file_attachment_id) {
    try {
      parent.loading(true);
      let response = await parent.axios.delete(
        "work/Upload/DeleteFileAttachment",
        {
          params: { file_attachment_id: file_attachment_id },
        }
      );
      parent.loading(false);
      if (response && response.data && response.data.success) {
        return response.data.data;
      } else {
        if (response.data.message) {
          return response.data.message;
        } else {
          return "Đã xảy ra lỗi";
        }
      }
    } catch (e) {
      parent.loading(false);
      if (e.data && e.data.message) {
        return e.data.message;
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
      } else {
        return "Đã xảy ra lỗi";
      }
    }
  },
  async UploadFileCommon(fromData, type, ref_id) {
    try {
      let response = await axios.post(
        "work/Upload/UploadFileCommon?type=" + type + "&ref_id=" + ref_id,
        fromData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response && response.data && response.data.success) {
        return response.data.data;
      } else {
        if (response.data.message) {
          return response.data.message;
        } else {
          return "Đã xảy ra lỗi";
        }
      }
    } catch (e) {
      if (e.data && e.data.message) {
        return e.data.message;
      } else if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
      } else {
        return "Đã xảy ra lỗi";
      }
    }
  },
  // Create new task
  addRequest: async (requestData) => {
    const response = await axios.post("/work/Task/AddRequest", requestData);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to add new task");
    }
    return response.data;
  },

  // Get request list
  getRequestList: async (axios, searchParams) => {
    const response = await axios.get("work/Task/GetRequests", {
      params: searchParams,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch request list");
    }
    return response.data;
  },
  GetRequestInfo: async (requestId) => {
    const response = await axios.get(
      `/work/Task/GetRequestInfo?id=${requestId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch request info");
    }
    return response.data;
  },
  Delete: async (taskId) => {
    const response = await axios.delete(
      `/work/Task/DeleteTask?taskId=${taskId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to delete task");
    }
    return response.data;
  },
  DoingTask: async (taskId) => {
    const response = await axios.post(`/work/Task/DoingTask`, {
      task_id: taskId,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch request info");
    }
    return response.data;
  },
  UpdateRequest: async (requestData) => {
    const timestamp = new Date().getTime();
    const response = await axios.put(
      "/work/Task/UpdateRequest?t=" + timestamp,
      requestData
    );
    if (response.status !== 200) {
      throw new Error("Failed to update task");
    }
    return response.data;
  },
  GetInfoService: async (serviceId) => {
    const response = await axios.get(
      `/work/Task/GetInfoService?id=${serviceId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch service info");
    }
    return response.data;
  },
  ProcessingRequest: async (processData) => {
    const response = await axios.post(
      "/work/Task/ProcessingRequest",
      processData
    );
    if (response.status !== 200) {
      throw new Error("Failed to update process request");
    }
    return response.data;
  },
  GetConfigUserDomain: async (params) => {
    const response = await axios.get("/work/Task/GetConfigUserDomain", {
      params,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch config user service");
    }
    return response.data;
  },
  UpdateConfigUserDomain: async (configData) => {
    const response = await axios.put(
      "/work/Task/UpdateConfigUserDomain?t=" + new Date().getTime(),
      configData
    );
    if (response.status !== 200) {
      throw new Error("Failed to update config user service");
    }
    return response.data;
  },
  DeleteConfigUserDomain: async (user_id) => {
    const response = await axios.delete(
      `/work/Task/DeleteConfigUserDomain?user_id=${user_id}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to delete config user service");
    }
    return response.data;
  },
  AddConfigUserDomain: async (configData) => {
    const response = await axios.post(
      "/work/Task/AddConfigUserDomain",
      configData
    );
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to add config user service");
    }
    return response.data;
  },
  GetAllDomain: async () => {
    const response = await axios.get("/work/Task/GetAllDomain");
    if (response.status !== 200) {
      throw new Error("Failed to fetch all domains");
    }
    return response.data;
  },
  GetPermissionButton: async () => {
    const response = await axios.get(
      `permission/getPermissionButtons?name=list_request`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch permission button");
    }
    return response.data;
  },
  GetDepartmentByTypeDep: async (type_ids) => {
    const response = await axios.get(`/User/Department/GetInTypeDeps`, {
      params: { type_ids },
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          params.type_ids.forEach((id) => {
            searchParams.append("type_ids", id);
          });
          return searchParams.toString();
        },
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch departments by type");
    }
    return response.data;
  },
  GetUserByTTKDGP: async () => {
    const response = await axios.get(`/User/GetUserByTTKDGP`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch users by TTKDGP");
    }
    return response.data;
  },
};
