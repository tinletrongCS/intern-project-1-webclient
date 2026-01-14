<template>
  <div class="page">
    <Header :userName="userName" />
    <SideBar :menuItems="menuItems" />

    <div class="main-wrapper">
      <Breadcrumb :pathItems="currentPathItems" />
      <div class="main-content" id="maincontent">
        <router-view v-slot="{ Component, route }">
          <transition name="router-anim">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
      <Footer />
    </div>

    <Loader />
  </div>
</template>

<script>
import "../assets/vendor/font-awesome/css/font-awesome.min.css";
import "../assets/vendor/ap8/css/style.css";
import "../assets/vendor/nucleo/outline/css/style.css";
import "../assets/vendor/nucleo/glyph/css/style.css";
import "../assets/vendor/bootstrap/css/bootstrap.min.css";
import "../../node_modules/@syncfusion/ej2-base/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-buttons/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-calendars/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-dropdowns/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-inputs/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-navigations/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-popups/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-vue-grids/styles/bootstrap4.css";
import "../../node_modules/@syncfusion/ej2-vue-layouts/styles/bootstrap4.css";

import "../assets/vendor/oneicon/style.css";
import "../assets/css/style.css";
import "../assets/css/custom.css";

import Loader from "@/components/Loader";
import SideBar from "./SideBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/BreadCrumb";

export default {
  name: "main-layout",
  components: {
    Header,
    Footer,
    SideBar,
    Loader,
    Breadcrumb,
  },
  data() {
    return {
      flag: false,
      menuItems: [],
    };
  },
  async created() {
    this.$root.showLoading(false);
    this.loading(false);

    if (!this.$_root.context.isAuthenticated()) {
      this.$router.push({ name: "Login" });
    } else {
      let menus = await this.$_root.context.getMenu();
      this.menuItems = menus.concat([]);
    }
  },
  mounted() {
    this.addCssFile("/static/vendor/font-awesome/css/font-awesome.min.css");
    this.addCssFile("/static/vendor/bootstrap/css/bootstrap.min.css");
    this.addCssFile("/static/vendor/ap8/css/style.css");
    this.addCssFile("/static/vendor/nucleo/outline/css/style.css");
    this.addCssFile("/static/vendor/nucleo/glyph/css/style.css");
    this.addCssFile("/static/vendor/treegrid/css/jquery.treegrid.css");
    this.addCssFile("/static/vendor/select2/css/select2.min.css");
    this.addCssFile("/static/vendor/oneicon/style.css");
    this.addCssFile("/static/css/style.css");
    this.addCssFile("/static/css/app.css");
    this.addCssFile("/static/css/custom.css");
  },
  computed: {
    currentPathItems() {
      return this.getMenuPath();
    },
    userName() {
      return this.$_root.token.getUserName();
    },
    nhanVien() {
      return this.$_root.context.user.getTenNhanVien();
    },
  },
  methods: {
    addCssFile(path) {
      let style = document.createElement("link");
      style.type = "text/css";
      style.rel = "stylesheet";
      style.href = path;
      document.head.appendChild(style);
    },
    getMenuPath() {
      let url = this.getCurrentPath();
      if (url != "/#/") {
        return [];
      } else return [];
    },
    getCurrentPath() {
      return "/#";
    },
    async getMenuFromStorage() {
      let listMenu = await this.$_root.context.getMenu();
      this.flag = true;
      this.menuItems = listMenu;
      return listMenu;
    },
  },
};
</script>

<style scoped>
#maincontent {
  background-color: #fff;
}
.main-wrapper {
  background-color: #fff;
}
</style>
