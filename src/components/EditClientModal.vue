<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-4 rounded shadow-lg">
      <h2 class="text-lg font-bold mb-4">Редактировать клиента</h2>

      <ClientFormBase
        v-if="clientData"
        :client="clientData"
        @submit="handleEdit"
        @cancel="close"
      />
      <p v-else>Загрузка данных...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import ClientFormBase from "./ClientFormBase.vue";
import { useClientStore, Client } from "../store";

export default defineComponent({
  props: {
    clientId: {
      type: Number,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  components: {
   ClientFormBase
  },
  setup(props) {
    const clientStore = useClientStore();
    const clientData = ref<Client | null>(null);

    const loadClientData = () => {
      const client = clientStore.clients.find((c) => c.id === props.clientId);
      if (client) {
        clientData.value = { ...client };
      } else {
        console.error(`Client with id ${props.clientId} not found.`);
      }
    };

    const handleEdit = (updatedClient: Client) => {
      if (updatedClient) {
        clientStore.editClient(updatedClient.id, updatedClient);//обновления данных клиента в хранилище
        props.close();
      }
    };

    watch(
      () => props.isOpen,
      (newVal) => {
        if (newVal) {
          loadClientData();//загружаются данные
        } else {
          clientData.value = null;//очищаются данные
        }
      },
      { immediate: true }
    );

    return { clientData, handleEdit };
  },
});
</script>
