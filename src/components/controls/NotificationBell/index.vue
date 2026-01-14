<template>
  <div class="notification-bell">
    <span class="icon" @click.stop="toggleDropdown">
      <i class="fa fa-bell-o"></i>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </span>

    <!-- Dropdown -->
    <transition name="fade">
      <div
        v-if="dropdownOpen"
        class="dropdown"
        @scroll="onScroll"
        ref="notificationList"
        style="padding: 0px 10px 10px !important;"
      >
        <div class="dropdown-inner">
          <!-- Link đánh dấu tất cả, Bật/tắt tin thông báo -->
          <!-- <div v-if="notifications.length > 0" class="mark-all">
            <a href="javascript:void(0)" @click.prevent="markAllAsRead">Đánh dấu tất cả đã đọc</a>
            <a
              href="javascript:void(0)"
              @click.prevent="toggleNotifyPopover"
              class="toggle-bell"
              :title="show_notify == 1 ? 'Đang bật - click để tắt tin thông báo' : 'Đang tắt - click để bật tin thông báo'"
            >
              <i :class="show_notify == 1 ? 'fa fa-bell' : 'fa fa-bell-slash'"></i>
            </a>
          </div> -->

          <!-- Thanh tìm kiếm -->
          <!-- <div class="search-box">
            <input
              type="text"
              v-model="searchText"
              placeholder="Tìm kiếm thông báo..."
            />
          </div> -->
          <div class="sticky-header">
            <!-- Link đánh dấu tất cả, Bật/tắt tin thông báo -->
            <div v-if="notifications.length > 0" class="mark-all">
               <a href="javascript:void(0)" @click.prevent="markAllAsRead">Đánh dấu tất cả đã đọc</a>
                <a
                  href="javascript:void(0)"
                  @click.prevent="toggleNotifyPopover"
                  class="toggle-bell"
                  :title="show_notify == 1 ? 'Đang bật - click để tắt tin thông báo' : 'Đang tắt - click để bật tin thông báo'"
                >
                  <i :class="show_notify == 1 ? 'fa fa-bell' : 'fa fa-bell-slash'"></i>
              </a>
            </div>
            <!-- Thanh tìm kiếm -->
            <div class="search-box">
              <input type="text" v-model="searchText" placeholder="Tìm kiếm thông báo..." />
            </div>
          </div>

          <!-- Danh sách thông báo -->
          <!-- <div
            v-for="n in filteredNotifications"
            :key="n.noti_id"
            class="item-notify"
            :class="{ unread: !n.is_read }"
            :title="n.description"
            @click="markAsRead(n)"
          >
            <div class="avatar-item-notify"></div>
            <span>{{ n.description }}</span>
          </div> -->
          <ejs-tooltip
            v-for="n in filteredNotifications"
            :key="n.noti_id"
            :content="n.description"
            position="BottomCenter"
            :openDelay="300"
            :closeDelay="200"
            class="tooltip-wrapper"
          >
            <div
              class="item-notify"
              :class="{ unread: !n.is_read }"
              @click="markAsRead(n)"
            >
              <div class="avatar-item-notify"></div>
              <span>{{ n.description }}</span>
            </div>
          </ejs-tooltip>

          <!-- Loading / trạng thái -->
          <div v-if="loadingMore" class="loading">Đang tải thêm...</div>
          <div v-else-if="!hasMore && filteredNotifications.length > 0" class="end">
            Không còn thông báo nào
          </div>
          <div v-else-if="filteredNotifications.length === 0" class="empty">
            Không có thông báo
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as signalR from "@microsoft/signalr";
import API from "./API.js";
import token from '@/plugins/token';

export default {
  name: "NotificationBell",
  props: { userId: { type: Number, required: true } },
  data() {
    return {
      connection: null,
      notifications: [],
      show_notify: 1,
      unreadCount: 0,
      dropdownOpen: false,
      searchText: "",

      // Lazy load
      pageIndex: 1,
      pageSize: 20,
      hasMore: true,
      loadingMore: false,
    };
  },
  mounted() {
    this.init();
    document.addEventListener("click", this.handleClickOutside);
    window.addEventListener("beforeunload", this.stopConnection); // 🔑
  },
  beforeUnmount() {
    this.stopConnection();
    document.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("beforeunload", this.stopConnection); // 🔑
  },
  computed: {
    filteredNotifications() {
      if (!this.searchText) return this.notifications;
      const keyword = this.searchText.toLowerCase();
      return this.notifications.filter(n =>
        n.description?.toLowerCase().includes(keyword)
      );
    },
  },
  methods: {
    async init() {
      // this.$root.showLoading(true);
      try {
        await Promise.all([
          this.GetUserByID(),
          this.loadNotifications(true)
        ]);
        await this.startConnection()
      } catch (e) {
        console.error("Init notification error:", e);
      } finally {
        // this.$root.showLoading(false);
      }
    },

    async startConnection() {
      // Nếu đang connected/connecting thì bỏ qua
      if (
        this.connection?.state === signalR.HubConnectionState.Connected ||
        this.connection?.state === signalR.HubConnectionState.Connecting
      ) {
        return;
      }

      // Nếu connection cũ chưa stop hẳn -> stop trước
      if (this.connection) {
        try {
          await this.connection.stop();
        } catch (e) {
          console.warn("Force stop old connection:", e);
        }
        this.connection = null;
      }

      // Tạo mới connection
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VNPT_API}/notifyHub`, {
          transport: signalR.HttpTransportType.WebSockets, // ép dùng WebSocket
          skipNegotiation: true,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Cấu hình timeout / keepalive
      this.connection.serverTimeoutInMilliseconds = 60000; // 60s thay vì 30s
      this.connection.keepAliveIntervalInMilliseconds = 15000; // ping 15s

      // Nhận notify
      this.connection.on("ReceiveNotification", (payload) => {
        if (!payload?.notifications?.length) return;

        this.pageIndex = 1;
        this.notifications = [];
        this.hasMore = true;
        this.notifications.push(...payload.notifications);
        this.unreadCount = payload.unreadCount;
        if (payload.notifications.length < this.pageSize) this.hasMore = false;
        this.pageIndex++;

        if (this.show_notify == 1) {
          this.$toast.warning(payload.notifications[0]["description"]);
        }

        if (this.dropdownOpen && this.$refs.notificationList) {
          this.$nextTick(() => {
            this.$refs.notificationList.scrollTop = 0;
          });
        }
      });

      // Khi reconnect thành công
      this.connection.onreconnected(async () => {
        console.log("♻️ Reconnected");
        if (this.userId) {
          await this.connection.invoke("JoinGroup", this.userId.toString());
        }
      });

      // Khi mất kết nối
      this.connection.onclose(() => {
        console.warn("⚡ SignalR closed. Retry in 3s...");
        setTimeout(() => this.startConnection(), 3000);
      });

      try {
        // Delay 2s để tránh lỗi khi F5 liên tục
        await new Promise((r) => setTimeout(r, 2000));
        if (!this.connection) return; // 👈 tránh null
        await this.connection.start();
        console.log("✅ SignalR connected");

        if (this.userId) {
          await this.connection.invoke("JoinGroup", this.userId.toString());
          console.log(`📌 Joined group ${this.userId}`);
        }
      } catch (err) {
        console.error("❌ SignalR start error:", err);
        this.connection = null;
        setTimeout(() => this.startConnection(), 5000);
      }
    },

    async stopConnection() {
      if (!this.connection) return;
      try {
        await this.connection.stop();
        console.log("🛑 SignalR stopped");
      } catch (err) {
        console.error("Stop connection error:", err);
      } finally {
        this.connection = null;
      }
    },

    async loadNotifications(reset = false) {
      if (reset) {
        this.pageIndex = 1;
        this.notifications = [];
        this.hasMore = true;
      }
      if (!this.hasMore || this.loadingMore) return;

      this.loadingMore = true;
      const data = await API.GetByUser(
        this,
        this.userId,
        this.pageIndex,
        this.pageSize
      );
      if (data && Array.isArray(data.notifications)) {
        this.notifications.push(...data.notifications);
        this.unreadCount = data.unreadCount || 0;
        if (data.notifications.length < this.pageSize) this.hasMore = false;
        this.pageIndex++;
      } else {
        this.hasMore = false;
      }
      this.loadingMore = false;
    },

    async markAsRead(noti) {
      this.navigateToDetail(noti);
      if (noti.is_read) return;
      const updated = await API.MarkAsRead(this, noti.noti_id, {});
      if (updated) {
        this.loadNotifications(true);
      }
    },

    async markAllAsRead() {
      try {
        this.$root.showLoading(true);
        const success = await API.MarkAllAsRead(this, this.userId, {});
        if (success) {
          await this.loadNotifications(true);
        }
      } finally {
        this.$root.showLoading(false);
      }
    },

    async toggleNotifyPopover() {
      try {
        this.$root.showLoading(true);
        var input = {
          user_id: this.userId,
          show_notify: this.show_notify == 2 ? 1 : 2
        }
        const success = await API.UpdateUserNotifyByID(this, input);
        if (success) {
          await Promise.all([
            this.GetUserByID(),
            this.loadNotifications(true)
          ]);
        }
      } finally {
        this.$root.showLoading(false);
      }
    },

    navigateToDetail(n) {
      if (n?.type_noti === "task") {
        this.initTaskInfo(n.des_id);
      } else if (n?.type_noti === "briefing"){
        this.redirectToBriefingSummaryPage(n.des_id)
      } else {
        this.$toast.error("Không tìm thấy mã công việc tồn tại trong CSDL");
      }
    },

    async GetUserByID() {
      const result = await API.GetUserByID(this, this.userId, 0);
      if (!result) {
        //this.$toast.error("Không tìm thấy mã công việc tồn tại trong CSDL");
        return;
      }
      this.show_notify = result.show_notify;
    },
    
    async initTaskInfo(task_id) {
      const result = await API.GetTaskInfo(this, task_id, 0);
      if (!result) return;
      const task = result.task;
      if (result.board_id) {
        this.$_root.board.setBoardIdSelected(result.board_id);
      }
      const routeData = this.$router.resolve({
        name: "kanban",
        query: { searchText: task.code?.toString() || "" },
      });
      window.open(routeData.href, "_blank");
    },
    
    async redirectToBriefingSummaryPage(id){
      const result = await API.GetBriefingSummaryById(this, id);
      if (!result) return;
      // Tạo route với name và query
      const routeData = this.$router.resolve({
        name: "briefing_summary",
        query: {
          plan_start_day: result.plan_start_day,
          plan_end_day: result.plan_end_day,
          project_id: result.project_id,
          status_id: result.status_id,
          unit_id: result.unit_id,
          briefing_type: result.briefing_type
        },
      });
      // Mở tab mới
      window.open(routeData.href, "_blank");
    },
    
    toggleDropdown() {
      // Nếu sidebar đang mở thì đóng nó lại
      if ($(".sidebar").hasClass("show")) {
        $(".sidebar").removeClass("show");
      }
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen && !this.notifications.length) {
        this.loadNotifications(true);
      }
    },

    handleClickOutside(event) {
      if (this.dropdownOpen && !this.$el.contains(event.target)) {
        this.dropdownOpen = false;
      }
    },

    async onScroll(e) {
      const el = e.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        await this.loadNotifications(false);
      }
    },
  },
};
</script>

<style scoped>
.notification-bell {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
}
.icon {
  font-size: 24px;
  color: #fff;
  position: relative;
}
.badge {
  position: absolute;
  top: -6px;
  right: -9px;
  background: white;
  color: red;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 16px;
  font-weight: bold;
}
.dropdown {
  position: absolute;
  top: 30px;
  right: 0;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 10px;
  z-index: 1000;
}
.sticky-header {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
  padding-top: 10px;
}
 .mark-all {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2; /* cao hơn .search-box để không bị đè */
  padding-bottom: 8px;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mark-all a {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}
.mark-all a:hover {
  color: #0056b3;
  text-decoration: underline;
}
.mark-all .toggle-bell {
  font-size: 16px;
  margin-left: 6px;
  color: #007bff;
}
.mark-all .toggle-bell:hover {
  color: #ff9800;
}
.search-box {
  position: sticky;   /* để cố định khi scroll */
  top: 0;
  background: #fff;
  z-index: 1;
  padding: 6px 0;
}
.search-box input {
  width: 100%;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}
.search-box input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.4);
}
.item-notify {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: black;
}
.item-notify:hover {
  background: rgba(0, 0, 0, 0.05);
}
.item-notify.unread {
  font-weight: bold;
  background: #f0f8ff;
}
.item-notify span {
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 14px;
  line-height: 1.4em;
  max-height: 4.2em;
}
.avatar-item-notify {
  background-image: url("@/assets/img/avatar-default.png");
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.empty,
.loading,
.end {
  text-align: center;
  color: #666;
  padding: 10px;
}

/* Hiệu ứng mở/đóng dropdown */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>