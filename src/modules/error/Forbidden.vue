<template>
  <div class="d-flex justify-content-center align-items-start vh-100 vw-100 bg-light">
    <div class="card shadow p-4 text-center border-0 mt-5" style="max-width: 420px; border-radius: 1rem;">
      <div class="mb-4 text-danger">
        <i class="bi bi-shield-lock display-4"></i>
      </div>

      <h1 class="display-5 fw-bold text-danger mb-2">403</h1>
      <h2 class="h5 fw-semibold mb-3">Không có quyền truy cập</h2>

      <p class="text-muted mb-4" style="line-height: 1.6;">
        Bạn không được phép truy cập trang này.<br>
        Vui lòng kiểm tra quyền hạn hoặc liên hệ quản trị hệ thống.
      </p>

      <button class="btn btn-outline-primary px-4 py-2" @click="goHome">
        <i class="bi bi-house-door me-2"></i> Quay lại trang chủ
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
