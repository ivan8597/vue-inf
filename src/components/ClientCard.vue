<template>
  <div class="animate__animated animate__fadeIn client-card">
    <h3>{{ client.name }}</h3>
    <p>{{ client.email }}</p>
    <p>{{ client.phone }}</p>
    <div class="actions">
      <button 
        data-test="edit-button"
        @click="$emit('edit', client)"
      >
        Редактировать
      </button>
      <button 
        data-test="delete-button"
        @click="$emit('delete', client.id)"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    client: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.animate__animated {
  animation-duration: 0.5s;
}
</style> 