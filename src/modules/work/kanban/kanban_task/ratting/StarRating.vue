<template>
<div class="starratingkanban">
  <div  class="star-rating">
    <span
      v-for="i in max"
      :key="i"
      class="star"
      :style="{ color: i <= rating ? starColor() : '#ccc' }"
    >
      {{ i <= rating ? '★' : '☆' }}
    </span>
  </div>
</div>

</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: { type: Number, default:0, required: true },
    max: { type: Number, default: 4 }
  },
  methods: {
    starColor() {
      // Định nghĩa màu theo vị trí sao
      if (this.rating === 1){
        return 'red'
      }else if (this.rating === 2){
        return 'orange'
      }else if(this.rating === 3||this.rating === 4){
        return 'limegreen'; // 3, 4 trở lên
      }else{
        return '#ccc'
      }
    }
  }
}
</script>

<style scoped>
.starratingkanban .star-rating {
  font-size: 25px;
  line-height: 1;
  display: inline-block;
}
.starratingkanban .star {
  font-weight: bold;
}
</style>
