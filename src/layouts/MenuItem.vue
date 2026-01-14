<template>
  <li class="haschild" :class="{ open: (txtSearch && txtSearch.trim().length>0) }">
    <!-- Nếu có children thì chỉ toggle -->
    <a v-if="item.children && item.children.length" @click.prevent="toggle">
      <span class="menu-icon"></span>
      <span class="menu-item-text">
        <i :class="item.icon" aria-hidden="true"></i>
        {{ item.per_name }}
      </span>
    </a>

    <!-- Nếu không có children thì click đi page -->
    <a v-else @click.prevent="goToPage(item)">
      <span class="menu-icon"></span>
      <span class="menu-item-text">
        <i :class="item.icon" aria-hidden="true"></i>
        {{ item.per_name }}
      </span>
    </a>

    <!-- Nút mở/đóng nếu có children -->
    <span
      v-if="item.children && item.children.length"
      class="down"
      :class="{ open: (txtSearch && txtSearch.trim().length>0) }"
      @click.prevent="toggle"
    ></span>

    <!-- Render children đệ quy -->
    <ul v-if="item.children && item.children.length" class="child">
      <menu-item
        v-for="child in item.children"
        :key="child.per_id"
        :item="child"
        :txtSearch="txtSearch"
        @go="goToPage"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    item: { type: Object, required: true },
    txtSearch: { type: String, default: "" }
  },
  methods: {
    toggle() {
      this.$el.classList.toggle("open");
    },
    goToPage(route) {
      this.$emit("go", route);
    }
  }
};
</script>
