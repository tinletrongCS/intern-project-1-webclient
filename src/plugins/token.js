import jwtdecode from "jwt-decode";
import requestContext from "@/utils/RequestContext";
export default {
  data: {
    TOKEN_KEY: "VNPT-Token",
  },
  setToken: function (token) {
    try {
      // localStorage.setItem(this.data.TOKEN_KEY, token);
      var tokenObj=JSON.parse(token);
      //document.cookie = this.data.TOKEN_KEY +"="+ token;
      document.cookie = `${this.data.TOKEN_KEY}=${token}; max-age=${tokenObj.expires}; path=/;`;

      return true;
    } catch (error) {
      return false;
    }
  },
  getTokenFromStorage(){
    return localStorage.getItem(this.data.TOKEN_KEY);
  },
  getAuthorization: function (){
    let tt = this.getTokenType();
    let tv = this.getToken().token;
   
    if(!(tt == null || tv == null)){
      return tt.charAt(0).toUpperCase() + tt.slice(1) + " " + tv;
    }
    return null;
  },
  getToken: function () {
    try {
        let t = this.getCookie(this.data.TOKEN_KEY);
        if(t != null){
          return this.strToObj(t);
        }
        return null;
    } 
    catch (error) 
    {
      return null;
    }
  },
  strToObj(str) {//convert string to object
    var obj = {};
    if (str && typeof str === "string") {
      var objStr = str.match(/\{(.)+\}/g);
      eval("obj =" + objStr);
    }
    return obj;
  },
  getTokenType: function () {
    try {
      // let t = this.getTokenFromStorage();
      let t = this.getToken();
      return "Bearer";
    } catch (error) {
      return null;
    }
  },
  getTokenExpired: function () {
    try {
      let t = this.getTokenFromStorage();
      return t.exp;
    } catch (error) {
      return null;
    }
  },
  getCookie(cname) {//get cookie from local
    var name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie).split(';')
    for (var i = 0; i < decodedCookie.length; i++) {
      let cookie = decodedCookie[i].trim();
      const index=cookie.indexOf(name)
      if(index>-1){
        return cookie.substring(name.length, cookie.length)
      }
    }
    return null
  },
  getClaims: function () {
    try {
      var token = this.getToken();
      if (token !== null && token !== "") {
        return jwtdecode(token);
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  getProperty: function (name) {
    var obj = this.getClaims();
    if (obj  && obj[name])
      return obj[name];
    obj =  this.getTokenFromStorage();
    if(obj && obj[name])
      return obj[name];
    return null;
  },
  getPhanVungID: function () {
    try {
      var obj = this.getProperty("id_tinhthanh");
      if (obj !== null) {
        return obj;
      } else {
        return -1;
      }
    } catch (error) {
      return -1;
    }
  },
  getUserName: function () {
    try {
      return this.getToken(this.data.TOKEN_KEY).user.username;
    } catch (error) {
      return null;
    }
  },
  getUserId: function () {
    try {
      return this.getToken(this.data.TOKEN_KEY).user.usid;
    } catch (error) {
      return null;
    }
  },
  getNhanVienID: function () {
    try {
      var obj = this.getProperty("id_nhanvien_dhsx");
      if (obj !== null) {
        return obj;
      } else {
        return -1;
      }
    } catch (error) {
      return -1;
    }
  },
  getMaNhanVien: function () {
    try {
      var obj = this.getProperty("ma_nv");
      if (obj !== null) {
        return obj;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },
  getDonViID: function () {
    try {
      var obj = this.getProperty("id_donvi");
      if (obj !== null) {
        return obj;
      } else {
        return -1;
      }
    } catch (error) {
      return -1;
    }
  },
  getDonViDuLieuID: function () {
    try {
      var obj = this.getProperty("donvi_dl_id");
      if (obj !== null) {
        return obj;
      } else {
        return -1;
      }
    } catch (error) {
      return -1;
    }
  },
  getNguoiDungID: function () {
    try {
      var obj = this.getProperty("nguoidung_id");
      if (obj !== null) {
        return obj;
      } else {
        return -1;
      }
    } catch (error) {
      return -1;
    }
  },
  getMaTinh: function() {
    try {
      var obj = this.getProperty("ma_tinh");
      if (obj !== null) {
        return obj;
      } else {
        return null; // -1
      }
    } catch (error) {
      return null; // -1
    }
  },
  destroy: function(){
    try {
      this.clearAllCookies();
      localStorage.removeItem(this.data.TOKEN_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },
  isAuthenticated: function(){
    return this.getToken() != null;
  },
  clearAllCookies: function() {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();

      // Xóa bằng cách đặt lại với ngày hết hạn trong quá khứ
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
}
