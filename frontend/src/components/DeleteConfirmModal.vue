<template>
  <Modal :isOpen="isOpen">
    <div class="bg-white p-6 rounded-lg max-w-md mx-auto">
      <div class="text-center">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Удалить клиента?
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          Это действие нельзя будет отменить
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from './Modal.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  components: {
    Modal,
    ExclamationTriangleIcon
  },

  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },

  emits: ['confirm', 'cancel']
})
</script> 