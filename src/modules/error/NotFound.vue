<template>
  <div class="d-flex justify-content-center align-items-start vh-100 vw-100 bg-light">
    <div class="card shadow p-4 text-center border-0 mt-5" style="max-width: 420px; border-radius: 1rem;">
      <div class="mb-4 text-secondary">
        <i class="bi bi-exclamation-triangle display-4"></i>
      </div>

      <h1 class="display-5 fw-bold text-secondary mb-2">404</h1>
      <h2 class="h5 fw-semibold mb-3">Không tìm thấy trang</h2>

      <p class="text-muted mb-4" style="line-height: 1.6;">
        Trang bạn đang tìm có thể đã bị xóa hoặc không tồn tại.<br>
        Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ.
      </p>

      <button class="btn btn-outline-primary px-4 py-2" @click="goHome">
        <i class="bi bi-arrow-left-circle me-2"></i> Quay lại trang chủ
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
