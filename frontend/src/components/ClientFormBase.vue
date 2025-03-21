<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Основная информация -->
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700">Название</label>
        <input
          v-model="formData.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="formData.contact.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Телефон</label>
        <input
          v-model="formData.contact.phone"
          type="tel"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Баланс</label>
        <input
          v-model.number="formData.balance"
          type="number"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>
    </div>

    <!-- Адрес -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Страна</label>
        <input
          v-model="formData.address.country"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Улица</label>
        <input
          v-model="formData.address.street"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>
    </div>

    <button
      type="submit"
      class="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      Сохранить
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { Client } from '../types'

export default defineComponent({
  props: {
    client: {
      type: Object as () => Client,
      required: true
    }
  },

  emits: ['submit'],

  setup(props, { emit }) {
    const formData = ref<Client>({ ...props.client })

    watch(() => props.client, (newClient) => {
      formData.value = { ...newClient }
    })

    const handleSubmit = () => {
      emit('submit', formData.value)
    }

    return {
      formData,
      handleSubmit
    }
  }
})
</script> 