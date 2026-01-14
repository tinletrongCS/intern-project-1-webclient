<template>
  <div class="stat-card">
    <div class="stat-icon" :class="color">
      <span>{{ icon }}</span>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, default: '📊' },
    color: { type: String, default: 'blue' }
  }
}
</script>

<style scoped>
.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10);
}

.stat-icon {
  width: 36px;
  height: 36px;
  margin: 0 auto 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue { background: #e7f1ff; }
.stat-icon.green { background: #e8f8ef; }
.stat-icon.yellow { background: #fff6db; }
.stat-icon.purple { background: #f1e9ff; }

.stat-value {
  font-size: 20px;
  font-weight: bold;
}

.stat-label {
  font-size: 13px;
  color: #666;
}
</style>
