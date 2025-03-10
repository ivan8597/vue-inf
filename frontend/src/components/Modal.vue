<template>
  <Transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content animate__animated animate__zoomIn">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  animation-duration: 0.3s;
}
.modal-content {
  animation-duration: 0.4s;
}
</style> 