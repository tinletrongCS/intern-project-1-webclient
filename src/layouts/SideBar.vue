<template>
  <div class="sidebar" id="SideBar">
    <div class="sidebar-content">
      <div class="search">
          <span class="icon nc-icon-outline ui-1_zoom"></span>
          <input
                  type="text"
                  v-model="txtSearch"
                  placeholder="Tìm kiếm"
                  class="form-control"
          />
      </div>

      <ul class="menus">
        <menu-item
            v-for="route in routes"
            :key="route.per_id"
            :item="route"
            :txtSearch="txtSearch"
            @go="goToPage"
          />
      </ul>
      
    </div>
    <div class="sidebar-common" :class="{hidden:!($route.fullPath && $route.fullPath!='/' && $route.fullPath!='/#/')}"></div>
    <BaseFormDialog ref="baseFormDialog"/>
  </div>
</template>
<script>
import MenuItem from "./MenuItem.vue";
import BaseFormDialog from "./BaseFormDialog.vue"
import router from '@/router'
export default {
  name: "SideBar",
  components: {
    BaseFormDialog,
    MenuItem
  },
  props:{
    menuItems :{
      type:Array,
      default:()=>[]
    }
  },
  
  // ['menuItems'],
  data: function () {
    return {
      _menuItems: null,
      txtSearch: "",
    };
  },
  created: function () {
  },
  computed: {
    routes() {
      let searchKey = this.getText(this.txtSearch);
      return this.filterMenu(this.menuItems, searchKey);
    }
  },
  updated() {
  },
  methods: {
    CloseSideBar: function() {
      document.getElementById("SideBar").classList.remove("show");
    },
    getText: function (text) {
      if (!text) return "";
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
        .toLowerCase();
    },
    async goToPage(route){
      document.getElementById("SideBar").classList.remove("show");
      //lưu push theo cột name component trong router
      if(!route.is_dialog){
        //Nếu không phải dạng dialog thì mở page
        this.$router.push({ name: route.link })
      }else{
        //Nếu là dialog thì show dialog
        const ro = router.getRoutes().find(r => r.name == route.link )
        if (!ro) return console.error('Route không tồn tại dialog:', route.link )
        // Nếu route.component là hàm dynamic import
        let module = null;
        if (ro.components && typeof ro.components.default === 'function') {
          module = await ro.components.default()
        } else {
          module = { default: ro.components.default }
        }
        this.$refs.baseFormDialog.showDialog({
          component: module.default,
          header: route.per_name
        })
      }
      
    },
    filterMenu(items, searchKey) {
      return items
        .map(item => {
          // lọc con trước
          let children = this.filterMenu(item.children || [], searchKey);

          // check tên của chính item
          let matched = this.getText(item.per_name).includes(searchKey);

          // nếu chính nó match hoặc có con match → giữ lại
          if (matched || children.length > 0 || !searchKey) {
            return { ...item, children };
          }
          return null;
        })
        .filter(x => x != null);
    }
  }
};
</script>
<style scoped>
  #app .sidebar .menus a { color: white }
  .sidebar ul.menus li ul { padding-left: 20px;}
  /* .sidebar ul.menus li  { border-bottom: solid 0px #EEE; } */
  .fa{
    width: 20px;
  }
  .sidebar ul.menus > li > ul >li  > a { padding-left: 20px !important;}
  .sidebar ul.menus > li > ul > li > ul > li >a{
    padding-left: 30px !important;
  }
  .sidebar ul.menus > li > ul > li > ul > li > a:hover{
    font-weight: bold;
  }

</style>
