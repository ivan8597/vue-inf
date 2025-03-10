<template>
  <Modal :isOpen="isOpen">
    <div class="bg-white p-6 rounded-lg max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Редактировать клиента</h2>
        <button 
          @click="close"
          class="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <ClientFormBase 
        :client="client"
        @submit="handleSubmit"
      />
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useClientStore } from '../store'
import Modal from './Modal.vue'
import ClientFormBase from './ClientFormBase.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { Client } from '../types'

export default defineComponent({
  components: {
    Modal,
    ClientFormBase,
    XMarkIcon
  },

  props: {
    clientId: {
      type: Number,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },

  setup(props) {
    const clientStore = useClientStore()
    const client = ref<Client | null>(null)

    onMounted(() => {
      const foundClient = clientStore.clients.find(c => c.id === props.clientId)
      if (foundClient) {
        client.value = { ...foundClient }
      }
    })

    const handleSubmit = async (updatedClient: Client) => {
      try {
        await clientStore.updateClient(props.clientId, updatedClient)
        props.close()
      } catch (error) {
        console.error('Error updating client:', error)
      }
    }

    return {
      client,
      handleSubmit
    }
  }
})
</script> 