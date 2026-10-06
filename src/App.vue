<template>

  <RouterView />
</template>

<script>
  export default {};
</script>

<style scoped>
  /* Tambahkan di file CSS global atau di App.vue */

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.breadcrumb a {
  transition: color 0.2s;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #4b5563;
}

.breadcrumb--active {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb__icon {
  margin: 0 0.5rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
}
</style>

