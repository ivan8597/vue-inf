<template>
  <Modal :isOpen="isOpen">
    <div class="bg-white p-6 rounded-lg max-w-md mx-auto animate__animated" :class="isOpen ? 'animate__zoomIn' : 'animate__zoomOut'">
      <div class="text-center">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4 animate__animated animate__bounceIn" />
        <h3 class="text-lg font-medium text-gray-900 mb-2 animate__animated animate__fadeIn">
          Удалить клиента {{ client?.name }}?
        </h3>
        <p class="text-sm text-gray-500 mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Это действие нельзя будет отменить
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="close"
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 animate__animated animate__fadeIn animate__delay-2s"
          >
            Отмена
          </button>
          <button
            @click="$emit('confirmed')"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 animate__animated animate__fadeIn animate__delay-2s"
            data-test="confirm-delete"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'
import type { Client } from '../types'

defineProps<{
  isOpen: boolean
  client: Client | null
  close: () => void
}>()

defineEmits<{
  confirmed: []
}>()
</script>

<style scoped>
.animate__animated {
  animation-duration: 0.5s;
}

.animate__delay-1s {
  animation-delay: 0.2s;
}

.animate__delay-2s {
  animation-delay: 0.4s;
}
</style> 