<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Затемнение фона -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Модальное окно -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Редактирование клиента
            </h3>
            <ClientFormBase
              v-if="client"
              :client="client"
              @submit="handleSubmit"
              @cancel="close"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useClientStore } from '../store';
import ClientFormBase from './ClientFormBase.vue';
import type { Client } from '../types';
import { PropType } from 'vue';

export default defineComponent({
  components: {
    ClientFormBase
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
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    const clientStore = useClientStore();
    
    const client = computed(() => {
      return clientStore.clients.find(c => c.id === props.clientId);
    });

    const handleSubmit = (updatedClient: Client) => {
      clientStore.updateClient(updatedClient);
      props.close();
    };

    return {
      client,
      handleSubmit
    };
  }
});
</script>
