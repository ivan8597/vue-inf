<template>
  <Modal :isOpen="props.isOpen">
    <div class="bg-white p-6 rounded-lg max-w-2xl mx-auto animate__animated" :class="props.isOpen ? 'animate__fadeInDown' : 'animate__fadeOutUp'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 animate__animated animate__fadeIn">Редактировать клиента</h2>
        <button 
          @click="props.close"
          class="text-gray-400 hover:text-gray-500 animate__animated animate__fadeIn"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <ClientFormBase 
        :client="client"
        @submit="handleSubmit"
        class="animate__animated animate__fadeIn animate__delay-1s"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'
import ClientFormBase from './ClientFormBase.vue'
import { useClientStore } from '../store'
import type { Client } from '../types'

const props = defineProps<{
  clientId: number
  isOpen: boolean
  close: () => void
}>()

const emit = defineEmits<{
  updated: []
}>()

const clientStore = useClientStore()
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

const loadClient = async () => {
  try {
    const response = await clientStore.getClients()
    const foundClient = response.find((c: Client) => c.id === props.clientId)
    if (foundClient) {
      client.value = { ...foundClient }
    }
  } catch (error) {
    console.error('Error loading client:', error)
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadClient()
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadClient()
  }
})

const handleSubmit = async (updatedClient: Client) => {
  try {
    await clientStore.updateClient(props.clientId, updatedClient)
    emit('updated')
    props.close()
  } catch (error) {
    console.error('Error updating client:', error)
  }
}

defineExpose({
  client,
  handleSubmit
})
</script>

<style scoped>
.animate__animated {
  animation-duration: 0.5s;
}

.animate__delay-1s {
  animation-delay: 0.2s;
}
</style> 