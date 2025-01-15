<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <input
        v-model="searchQuery"
        placeholder="Поиск..."
        class="p-2 border border-gray-300 rounded w-1/2"
      />
      <button
        @click="toggleShowArchived"
        class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {{ showArchived ? "Скрыть" : "Показать" }} архивные
      </button>
    </div>
    <div class="flex mb-4">
      <button
        @click="sortClientsByName"
        class="p-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
      >
        Сортировать по имени
      </button>
      <button
        @click="sortClientsByBalance"
        class="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Сортировать по балансу
      </button>
    </div>
    <ul class="space-y-4">
      <li
        v-for="client in filteredClients"
        :key="client.id"
        class="bg-gray-100 border border-gray-300 rounded-lg p-4 flex justify-between"
      >
        <div class="flex flex-col">
          <span class="font-bold">Название: {{ client.name }}</span>
          <span class="text-gray-800">Баланс: {{ client.balance }} USD</span>
          <span class="text-gray-500"
            >Страна: {{ client.address.country }}</span
          >
          <span class="text-gray-500"
            >Индекс: {{ client.address.postalCode }}</span
          >
          <span class="text-gray-500">Улица: {{ client.address.street }}</span>
          <span class="text-gray-500">Офис: {{ client.address.office }}</span>
          <span class="text-gray-500">Телефон: {{ client.contact.phone }}</span>
          <span class="text-gray-600">Email: {{ client.contact.email }}</span>
          <span class="text-gray-500"
            >Дата создания: {{ formatDate(client.createdAt) }}</span
          >
          <span class="text-gray-500"
            >Дата редактирования: {{ formatDate(client.updatedAt) }}</span
          >
        </div>
        <div class="flex space-x-2 items-end">
          <button
            @click="editClient(client.id)"
            class="bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600"
          >
            Редактировать
          </button>
          <button
            @click="toggleArchive(client.id)"
            class="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
          >
            {{ client.archived ? "Восстановить" : "Архивировать" }}
          </button>
        </div>
      </li>
    </ul>

    <EditClientModal
      v-if="isModalOpen"
      :clientId="selectedClientId"
      :isOpen="isModalOpen"
      :close="closeModal"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useClientStore } from "../store";
import EditClientModal from "./EditClientModal.vue";
import ClientFormBase from "./ClientFormBase.vue"

export default defineComponent({
  components: {
    EditClientModal,
    ClientFormBase
  },
  setup() {
    const clientStore = useClientStore();
    const showArchived = ref(false);
    const searchQuery = ref("");
    const selectedClientId = ref<number | null>(null);
    const isModalOpen = ref(false);
    const toggleShowArchived = () => {//функция для переключения состояния видимости архивированных клиентов, если архивированные клиенты были видны то будут скрыты и наоборот
      showArchived.value = !showArchived.value;
    };

    const filteredClients = computed(() => {//filteredClients  содержаит только тех клиентов из clientStore.clients, которые не архивированы (если архивированные скрыты) и соответствуют критериям поиска  
      return clientStore.clients.filter((client) => {
        const isArchived = !showArchived.value && client.archived;
        const matchesSearch =
          client.name.includes(searchQuery.value) ||
          client.address.street.includes(searchQuery.value) ||
          client.contact.phone.includes(searchQuery.value) ||
          client.contact.email.includes(searchQuery.value);
        return !isArchived && matchesSearch;
      });
    });

    const toggleArchive = (id: number) => {//функция отвечает за переключение состояния архивирования  клиента
      clientStore.toggleArchive(id);
    };

    const editClient = (id: number) => {//редактирование
      selectedClientId.value = id;
      isModalOpen.value = true;
      clientStore.setActiveClientId(id);
    };

    const closeModal = () => {//закрыть модальное окно
      selectedClientId.value = null;
      isModalOpen.value = false;
    };
    const formatDate = (dateString: string) => {//время создания редактирования
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-часовой формат
      };
      return new Date(dateString).toLocaleString("ru-RU", options);
    };

    const sortClientsByName = () => {// сотировка по имени
      clientStore.sortClientsByName();
    };

    const sortClientsByBalance = () => {//сортировка по балансу
      clientStore.sortClientsByBalance();
    };

    return {
      filteredClients,
      toggleShowArchived,
      searchQuery,
      showArchived,
      toggleArchive,
      editClient,
      isModalOpen,
      closeModal,
      selectedClientId,
      formatDate,
      sortClientsByName,
      sortClientsByBalance
    };
  },
});
</script>
