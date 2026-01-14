<template>
  <div class="dashboard-header">
    <div class="nav-toggle">
      <span class="fa fa-bars"></span>
    </div>

    <!-- Logo bên trái -->
    <div class="pull-left">
      <div class="logo">
        <a class="img" href="/#/">
          <img src="@/assets/img/logo.svg" />
        </a>
        <span class="text">
          Hệ thống điều hành hoạt động sản xuất kinh doanh Dịch vụ số - VNPT TP.HCM
        </span>
      </div>
    </div>

    <!-- Menu bên phải -->
    <div class="pull-right menus-right">
      <!-- <div v-if="hasPermissionCreateRequest" @click="openAddRequestModal" class="item special flex items-center space-x-4" style="cursor: pointer;">
        <img style="height: 30px;" src="@/assets/request_icon.png" alt="">
      </div> -->
      <div class="item special flex items-center space-x-4">
        <!-- 🔔 NotificationBell -->
        <NotificationBell :userId="userId" />
      </div>
      

      <!-- 👤 User info -->
      <div class="item special flex items-center space-x-4" @click.stop="toggleUserDropdown"> 
        <!-- @mouseenter="showUserDropdown = true" @mouseleave="showUserDropdown = false"> -->
        <div class="user-image" >
          <div class="avatar">
            <img 
              v-if="hasUserAvatar" 
              :src="userAvatar" 
              :alt="userName || 'User Avatar'"
              class="avatar-image"
              @error="onAvatarLoadError"
            />
            <i v-else-if="!showUserDropdown" class="fa fa-user-secret" aria-hidden="true"></i>
            <i v-else class="fa fa-binoculars" aria-hidden="true"></i>
          </div>
          <div class="username">{{ userName }}</div>
          <!-- <div class="pos">Lê Quốc Kỳ</div> -->
        </div>
        
        <!-- User Dropdown Menu -->
        <transition name="fade">
          <div v-if="showUserDropdown" class="user-dropdown-menu">
            <div class="user-dropdown-item" @click="editProfile">
              <i class="fa fa-edit"></i>
              <span>Chỉnh sửa thông tin</span>
            </div>
            <div class="user-dropdown-item" @click="logout">
              <i class="fa fa-sign-out"></i>
              <span>Đăng xuất</span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditInfo 
      ref="editInfoModal"/>
    <AddUpdateRequestModal
      ref="addUpdateRequestModal"
      :boardType="1"
      :disabled="false"
      :domains="domains"
      @saved="onRequestSaved"
    />
  </div>
</template>

<script>
import NotificationBell from "@/components/controls/NotificationBell";
import EditInfo from "@/components/controls/editAccountInfo/editInfo.vue";
import packageJson from "@/../package.json";
import EditInfoAPI from "@/components/controls/editAccountInfo/editInfoAPI.js";
import { RequestApi } from "../../modules/request/API";
import AddUpdateRequestModal from "@/modules/request/AddUpdateRequestModal.vue";
import { has } from "lodash";
function mounteMenu() {
  $(".nav-toggle").click(function () {
    $(".sidebar").toggleClass("show");
  });
  $(".sidebar-common").click(function () {
    $(".sidebar").removeClass("show");
  });
  $(".dropdown .favourite-menu").click(function () {
    $(".sidebar").removeClass("show");
  });
}

export default {
  name: "Header",
  components: {
    NotificationBell,
    EditInfo,
    AddUpdateRequestModal
  },
  data() {
    return {
      userId: this.$_root.token.getUserId(),
      showUserDropdown: false,
      userAvatarFromDB: null,
      domains: [],
      //hasPermissionCreateRequest: false,
    };
  },
  mounted() {
    mounteMenu();
    this.loadUserInfo();
    // RequestApi.GetPermissionButton().then((data) => {
    //   if (data && data.success && data.data) {
    //     const permissions = data.data;
    //     this.hasPermissionCreateRequest = permissions.map(s => s.policy).includes('insertRequest');
    //   }
    // }).catch((error) => {
    //   console.error("Error fetching permission buttons:", error);
    //   this.hasPermissionCreateRequest = false;
    // });
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  computed: {
    userName() {
      return this.$_root.token.getUserName();
    },
    nhanVien() {
      return this.$_root.token.getTenNguoiDung();
    },
    version() {
      return packageJson.version;
    },
    hasUserAvatar() {
      return this.userAvatarFromDB && this.userAvatarFromDB.trim() !== '';
    },
    userAvatar() {
      if (this.hasUserAvatar) {
        return EditInfoAPI.getAvatarUrl(this.userId);
      }
      return null;
    },
  },
  methods: {
    async loadUserInfo() {
      try {
        const response = await EditInfoAPI.getAccountByUser(this, this.userId);
        if (response && response.success && response.data) {
          this.userAvatarFromDB = response.data.avatar || null;
        } else {
          this.userAvatarFromDB = null;
        }
      } catch (error) {
        this.userAvatarFromDB = null;
      }
    },

    async onAvatarLoadError(event) {
      try {
        const blobUrl = await EditInfoAPI.getAvatarBlob(this.userId);
        if (blobUrl) {
          event.target.src = blobUrl;
          return;
        }
      } catch (error) {
        // Fallback to icon
      }
      this.userAvatarFromDB = null;
    },

    refreshUserAvatar() {
      this.loadUserInfo();
    },
    editProfile() {
      this.showUserDropdown = false;
      this.$refs.editInfoModal.showModal();
    },
    async logout() {
      this.showUserDropdown = false;
      this.$_root.context.logOut();
      const isSSO = localStorage.getItem("isSSO") === "1";
      if (isSSO) {
        localStorage.removeItem("isSSO");
        this.doLogoutSSO();
      }
      if (this.$route.name != "Login") {
        this.$router.push({ name: "Login" });
      }
    },
    async doLogoutSSO() {
      let url = "/auth/authSSO/logout-sso?service_url=" + window.location.origin;
      try {
        let respond = await this.$_root.context.getWithOutToken(url, {});
        if (respond.data.success) {
          window.location.href = respond.data.data;
        }
      } catch (e) {}
    },
    toggleUserDropdown() {
      // Nếu sidebar đang mở thì đóng nó lại
      if ($(".sidebar").hasClass("show")) {
        $(".sidebar").removeClass("show");
      }
      
      // Toggle dropdown user như bình thường
      this.showUserDropdown = !this.showUserDropdown;
    },
    handleClickOutside(event) {
      const dropdown = this.$el.querySelector(".user-dropdown-menu");
      const avatar = this.$el.querySelector(".user-image");
      if (
        this.showUserDropdown &&
        dropdown &&
        !dropdown.contains(event.target) &&
        !avatar.contains(event.target)
      ) {
        this.showUserDropdown = false;
      }
    },
    async openAddRequestModal() {
      await this.onLoadDomain();
      this.$refs.addUpdateRequestModal.showModal();
    },
    async onLoadDomain() {
      try {
        const response = await RequestApi.GetAllDomain();

        this.domains = response.data || [];
      } catch (error) {
        console.error("Error loading domain:", error);
        this.domains = [];
      }
    },
    async onRequestSaved(savedRequest) {
      try {
        // Call API để save request với TaskRequest format
        const response = await RequestApi.addRequest(savedRequest);
        if (response && response.success !== true) {
          throw new Error(
            response.message || "Lỗi không xác định khi tạo yêu cầu"
          );
        }

        // Đóng modal sau khi lưu thành công
        this.$refs.addUpdateRequestModal.hideModal();

        // Hiển thị thông báo thành công
        if (this.$toast) {
          this.$toast.success("Tạo yêu cầu thành công!");
        } else {
          alert("Tạo yêu cầu thành công!");
        }
      } catch (error) {
        console.error("Error saving request in ListRequest:", error);

        // Hiển thị thông báo lỗi
        if (this.$toast) {
          this.$toast.error(
            "Có lỗi xảy ra khi tạo yêu cầu: " +
              (error?.data?.message || error?.message)
          );
        } else {
          alert("Có lỗi xảy ra khi tạo yêu cầu: " + (error.message || error));
        }
      }
    },
  },
};
</script>

<style scoped>
div.special.item a {
  font-size: 2em;
  color: #fff;
  padding-left: 20px;
}

.form-notify {
  font-size: 12px;
}

.number-of-item {
  color: red;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: -4px;
  right: -10px;
  padding: 2px 0;
  width: 22px;
  text-align: center;
  font-weight: bold;
}

.user-avatar {
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-avatar i {
  font-size: 20px;
  color: #fff;
  transition: all 0.3s ease;
}

/* Dropdown menu styles */
.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.user-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.user-dropdown-item:hover {
  background-color: #d2d7de;
}

.user-dropdown-item i {
  width: 16px;
  text-align: center;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

.user-dropdown-item span {
  flex: 1;
  font-weight: 500;
}

/* Fade transition for dropdown */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dashboard-header .user-image .avatar {
  position: absolute;
  left: 0px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-header .user-image .avatar i {
  font-size: 20px;
  color: #fff;
  transition: all 0.3s ease;
}
.dashboard-header .user-image .avatar i::before {
  margin-top: 8px;
}
.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.avatar-image:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

/* Đảm bảo user-image có chiều cao đủ */
.dashboard-header .user-image {
  position: relative;
  padding-left: 50px;
  min-height: 40px;
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .dashboard-header .logo .text {
    display: none;
  }
}

</style>
