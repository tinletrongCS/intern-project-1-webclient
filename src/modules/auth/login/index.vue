<template>
  <div class="login-wrapper">
    <div class="img img-bg">
      <!-- <dev src="@/assets/img/saigon_line.png" alt=""> -->
    </div>
    <div class="logo"></div>
    <!-- <div class="bg" :style="{ backgroundImage: 'url(../../../assets/img/saigon_line.png)' }"></div> -->
    <div class="box-login">
      <div class="head">
        {{formTitle}}
      </div>
      <div class="form">
        <div class="form-group">
          <div class="input-icon">
            <input type="text" placeholder="Tên đăng nhập" v-model.trim="username" class="form-control" @keyup.enter="btnLogin_Click">
            <span class="icon">
              <i class="fa fa-user" aria-hidden="true"></i>
            </span>
          </div>
        </div>
        <div class="form-group">
          <div class="input-icon -show">
            <input v-model="password" type="password" name="password" placeholder="Mật khẩu" class="form-control" @keyup.enter="btnLogin_Click">
            <span class="icon">
              <i class="fa fa-key" aria-hidden="true"></i>
            </span>
            <!-- <span class="icon-show fa  fa-eye"></span> -->
          </div>
        </div>
        
        <div class="form-group error" v-if="formError">
          <div v-if="loginFailedAccount"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>Tài khoản hoặc mật
            khẩu không đúng</div>
          <div v-if="loginFailedOTP">&bull; Số OTP không hợp lệ!</div>
        
        </div>
        <!-- <div style="color: rgb(197, 91, 91);" v-if="loginFailedAccount" ><i class="fa fa-exclamation-circle"  aria-hidden="true"></i>Vui lòng nhập thông tin tài khoản</div> -->
        <div class="acts">
          <div class="k bnt-login-mail" >
            <span style="font-size: 16px;" @click="btnLoginSSO_Click">
              <i class="fa fa-sign-in" aria-hidden="true"></i> Đăng nhập Email VNPT
            </span>
          </div>
          <span class="forget-pass" @click="forgetPassWord">Quên mật khẩu?</span>
          <button class="btn btn-primary btn-login bold" @click="btnLogin_Click">Đăng nhập</button>
        </div>
        
        
      </div>
    </div>
    <div class="copyright">
      TTCNTT &copy; 2024
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data: () => ({
    username: "",
    password: "",
    otpValue: "",
    loginFailedAccount: false,
    loginFailedOTP: false,
    loginAccountCheckLength:false,
    currentSecretCode: "",
    authType: false
  }),
  created() {
    this.$_root.context.logOut();

  },
  computed: {
    formTitle: function () {
      return "Đăng nhập"
    },
    formError: function () {
      return this.loginFailedAccount || this.loginFailedOTP;
    },
    AppName: function() {
      return import.meta.env.VNPT_APPNAME;
    }
  },
  methods: {
    btnLogin_Click: async function () {
      // let host_cas = "https://id.vnpt.com.vn";
      // window.location.href = host_cas + "/cas/login?service=cds-cntt.vnpttphcm.vn";
      this.$root.showLoading(true);
      try {
        let respond = await this.doLogin();
        if (respond.data.success)
        {
          this.loginFailedAccount = false;
          let value = 
          {
            token: respond.data.data.token.access_token,
            user:{
                usid: respond.data.data.user.user_id,
                username: respond.data.data.user.username,
            },
            expires: respond.data.data.token.expires_in
          } 
          this.$_root.context.authenticate(JSON.stringify(value));
          this.redirectToHome();
        } else {
          this.loginFailedAccount = true;
        }
        this.$root.showLoading(false);
      } catch (error) {

      } finally {
        this.$root.showLoading(false);
      }
    },
    doLogin: async function () {
        let url = "/auth/login";
        if(this.username.length<5 || this.password.length<7){
          this.loginFailedAccount = true;
          return;
        }
        const t = new Date().getTime();
        try {
            let rs = await this.$_root.context.postWithOutToken( `${url}?t=${t}`, {
                    username: this.username,
                    password: this.password
                }
            );
            return rs;
        } catch (error) {
            this.$toast.error("Có lỗi xảy ra vui lòng thử lại hoặc liên hệ quản trị viên");
            return error.response.data;
        }
    },
    btnLoginSSO_Click: async function () {
      let url = "/auth/authSSO/redirect-sso?service_url=" + window.location.origin;
      try {
        let respond = await this.$_root.context.getWithOutToken(url,{});
        if (respond.data.success) {
          window.location.href = respond.data.data
        }
      } catch (e) {} finally {}
    },
    doLoginSSO: async function (ticket) {
      let url = "/auth/authSSO/login-sso?ticket=" + ticket + "&service_url=" + window.location.origin;
      try {
        let respond = await this.$_root.context.postWithOutToken(url, {});
        if (respond.data.success) {
          this.loginFailedAccount = true;

          let value = {
            token: respond.data.data.token.access_token,
            user: {
              usid: respond.data.data.user.user_id,
              username: respond.data.data.user.username,
            },
            expires: respond.data.data.token.expires_in,
          };

          this.$_root.context.authenticate(JSON.stringify(value));

          // === Xoá ticket khỏi URL ===
          const cleanUrl = window.location.origin + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
          // Lưu khi login thành công
          localStorage.setItem("isSSO", 1);
          this.redirectToHome();
        }
      } catch (error) {
        console.log(error.response?.data || error);
      }
    },
    getTicketFromUrl() {
      const params = new URLSearchParams(window.location.search);
      let ticket = params.get("ticket");
      if (!ticket) {
        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.split("?")[1]);
        ticket = hashParams.get("ticket");
      }
      return ticket;
    },
    redirectToHome() {
      this.$router.push({ name: "Home" });
    },
    forgetPassWord(){
      alert("Để khởi tạo lại mật khẩu, vui lòng soạn tin nhắn theo cú pháp: MK<Khoảng trắng><Tên tài khoản> gửi 293");
    }
  },
  mounted() {
    const ticket = this.getTicketFromUrl();
    if (ticket) {
      this.doLoginSSO(ticket);
    }
  }
};
</script>

<style src="./index.css" scoped></style>
