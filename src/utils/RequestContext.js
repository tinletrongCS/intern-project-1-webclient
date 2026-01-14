import axios from "axios";
import token from "../plugins/token";
import menu from "./menu";

export default {
  async getOriginal(url, params) {
    var instance = axios.create();
    instance.interceptors.request.use(request => {
      request.baseURL = import.meta.env.VNPT_API;
      request.headers = {
        "Content-Type": "application/json",
        Authorization: token.getAuthorization(),
      };
      request.data = {};
      return request;
    });
    var begin = Date.now();
    var r = await instance.get(url, { params: params });
    if (import.meta.env.MODE !== "production") {
      console.info(
        "url: " + url + " (" + (Date.now() - begin) + "ms)"
      );
    }
    return r;
  },
  async get(url, params) {
    var r = await this.getOriginal(url, params)
    return r;
  },
  async postOriginal(url, data) {
    var instance = axios.create();
    instance.interceptors.request.use(request => {
      request.baseURL = import.meta.env.VNPT_API;
      request.headers = {
        "Content-Type": "application/json",
        Authorization: token.getAuthorization(),
    //     SelectedMenuId: this.getCurrentMenuItemID(),
		// SelectedPath: this.getCurrentPath()
      };
      return request;
    });
    var begin = Date.now();
    var r = await instance.post(url, data);
    if (import.meta.env.MODE !== "production") {
      console.info(
        "url: " + url + " (" + (Date.now() - begin) + "ms)"
      );
    }
    return r;
  },
  async postForm(url, data) {
    var instance = axios.create();
    instance.interceptors.request.use(request => {
      request.baseURL = import.meta.env.VNPT_API;
      request.headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token.getAuthorization(),
      };
      return request;
    });
    var begin = Date.now();
    var r = await instance.post(url, data);
    if (import.meta.env.MODE !== "production") {
      console.info(
        "url: " + url + " (" + (Date.now() - begin) + "ms)"
      );
    }
    return r;
  },
  async post(url, data) {
    var r = await this.postOriginal(url, data);
    return r;
  },
  async postfile(url, data) {
    var r = await this.postForm(url, data);
    return r;
  },
  async getWithOutToken(url, params) {
    var instance = axios.create();

    instance.interceptors.request.use(request => {
      request.baseURL = import.meta.env.VNPT_API;
      request.headers = {
        "Content-Type": "application/json",
      };
      return request;
    });
    var r = await instance.get(url, { params: params });
    return r;
  },
  async postWithOutToken(url, data) {
    var instance = axios.create();
    instance.interceptors.request.use(request => {
      request.baseURL = import.meta.env.VNPT_API
      const apiKey=import.meta.env.VNPT_API_KEY
      request.headers = {
        "Content-Type": "application/json",
        'x-api-key':apiKey
      };
      return request;
    });
    var begin = Date.now();
    var r = await instance.post(url, data).then(function (response) {
      console.info(
        "url: " + url + " (" + (Date.now() - begin) + "ms)"
      );
      return response;
    });
    return r;
  },


}
