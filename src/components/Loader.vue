<template>
  <div class="loader-border overlay-common">
      <div class="loader">
          <span v-for="n in 20" :key="n" :style="{ '--i': n }"></span>
          <div class="rocket"><i class="fa fa-plane"></i></div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
};
</script>
<style src="./Loader.css" scoped></style>