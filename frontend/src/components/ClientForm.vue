<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">
      {{ isEditing ? 'Редактировать клиента' : 'Новый клиент' }}
    </h1>

    <div class="bg-white shadow rounded-lg p-6">
      <ClientFormBase 
        :client="client"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientStore } from '../store'
import ClientFormBase from './ClientFormBase.vue'
import type { Client } from '../types'

export default defineComponent({
  components: {
    ClientFormBase
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const clientStore = useClientStore()
    const error = ref('')

    const isEditing = computed(() => route.params.id !== undefined)

    const client = ref<Client>({
      id: 0,
      name: '',
      contact: {
        email: '',
        phone: ''
      },
      balance: 0,
      archived: false,
      address: {
        country: '',
        street: ''
      }
    })

    const handleSubmit = async (formData: Client) => {
      try {
        if (isEditing.value) {
          await clientStore.updateClient(Number(route.params.id), formData)
        } else {
          await clientStore.addClient(formData)
        }
        router.push('/clients')
      } catch (err) {
        error.value = 'Ошибка при сохранении клиента'
      }
    }

    return {
      client,
      handleSubmit,
      isEditing,
      error
    }
  }
})
</script> 