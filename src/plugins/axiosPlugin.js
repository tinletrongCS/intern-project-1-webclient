import axios from "axios"
// import { store } from "@/store"
import jwtdecode from "jwt-decode"
import token from './token'
import router from '@/router';
import { createGlobalToast } from '@/plugins/toastPlugin';
// Tạo 1 instance toast global độc lập (sử dụng eventBus chung)
const toast = createGlobalToast();
// Cờ trạng thái toàn cục
let isHandling401 = false;
// default
const baseUrl = import.meta.env.VNPT_API
const TOKEN_KEY = 'VNPT-Token'
const apiKey=import.meta.env.VNPT_API_KEY
const USER_INFO='USER_INFO'

axios.defaults.baseURL = baseUrl
axios.defaults.headers = {
  "Content-Type": "application/json",
  "x-api-key": apiKey,
  "Mac-address": "WEB"
};
// doing something with the request
axios.interceptors.request.use(
  (request) => {
    var config = {}
    if (request.config) {
      config = request.config
    }
    config.start = Date.now()
    request.config = config

  var access_token = token.getToken()?.token ?? "";

  if(access_token) {
    access_token = access_token;
  }
  request.headers.Authorization = `Bearer ${access_token}`

  let userInfo=JSON.parse(localStorage.getItem(USER_INFO));
  // request.headers['x-access-token']=access_token
  request.headers['x-user-id']=userInfo?userInfo.id:''
  request.headers['X-Request-Timestamp']=new Date().toISOString()

  // Ép URL có thêm `t=timestamp` nếu là GET hoặc POST (giúp tránh cache frontend)
  if (['get', 'post'].includes(request.method)) {
    const url = new URL(request.url, window.location.origin);
    url.searchParams.set('t', Date.now().toString());
    request.url = url.pathname + url.search;
  }
  return request;
});

// doing something with the response
axios.interceptors.response.use(
  response => {
    const now = Date.now();
    return response;
  },
  error => {
    // =========================
    // 413 - Payload Too Large
    // =========================
    if (error.response && error.response.status === 413) {
      toast.error(`Tổng dung lượng upload không vượt ngưỡng cho phép, vui lòng kiễm tra lại.`);
      return Promise.reject(error.response);
    }
    // =========================
    // 401 - Unauthorized
    // =========================
    if(error.response && error.response.status === 401) {

      if (!isHandling401) {
        isHandling401 = true;
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.")
        // Chờ một chút để tránh đụng animation toast
        setTimeout(() => {
          router.replace({ name: "Login" })
          isHandling401 = false;
        }, 1000);
      }
      
    }
    //return Promise.reject(error);
    return Promise.reject(error.response);
  }

);
export default axios;
