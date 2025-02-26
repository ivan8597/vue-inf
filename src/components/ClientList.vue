<template>
  <div class="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm">
    <!-- Фиксированная панель инструментов -->
    <div class="sticky top-0 z-10 bg-white pb-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <!-- Строка поиска -->
        <div class="flex justify-between items-center gap-4">
          <div class="relative flex-1">
            <input
              data-test="search-input"
              v-model="searchQuery"
              placeholder="Поиск клиента..."
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <!-- Кнопки управления -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <button
              data-test="sort-name"
              @click="sortClientsByName"
              class="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              По имени
            </button>
            <button
              data-test="sort-balance"
              @click="sortClientsByBalance"
              class="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              По балансу
            </button>
            <button
              data-test="toggle-archive"
              @click="toggleShowArchived"
              class="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              {{ showArchived ? "Скрыть архив" : "Показать архив" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Список клиентов -->
    <TransitionGroup
      name="list"
      tag="ul"
      class="space-y-4"
    >
      <li
        v-for="client in filteredClients"
        :key="client.id"
        data-test="client-item"
        class="bg-white border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <!-- Заголовок и баланс -->
              <div class="flex items-center gap-3 mb-3">
                <h3 data-test="client-name" class="text-lg font-medium text-gray-900">
                  {{ client.name }}
                </h3>
                <div 
                  data-test="client-balance" 
                  class="px-2.5 py-0.5 text-sm font-medium rounded-full"
                  :class="client.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ client.balance }} USD
                </div>
                <span 
                  v-if="client.archived"
                  class="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800"
                >
                  Архив
                </span>
              </div>
              
              <!-- Основная информация -->
              <div class="grid grid-cols-2 gap-6 text-sm">
                <!-- Адрес -->
                <div class="space-y-2">
                  <div class="text-gray-600">
                    <span class="font-medium text-gray-900">Адрес:</span>
                    <div class="ml-1 space-y-1">
                      <div v-if="client.address.country">Страна: {{ client.address.country }}</div>
                      <div v-if="client.address.postalCode">Индекс: {{ client.address.postalCode }}</div>
                      <div v-if="client.address.street">Улица: {{ client.address.street }}</div>
                      <div v-if="client.address.office">Офис: {{ client.address.office }}</div>
                    </div>
                  </div>
                </div>

                <!-- Контактная информация -->
                <div class="space-y-2">
                  <div class="text-gray-600">
                    <span class="font-medium text-gray-900">Контакты:</span>
                    <div class="ml-1 mt-1">
                      <div class="flex flex-wrap items-center gap-4">
                        <div v-if="client.contact?.phone" class="flex items-center gap-1 whitespace-nowrap">
                          <PhoneIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span class="text-gray-600">{{ client.contact.phone }}</span>
                        </div>
                        <div v-if="client.contact?.email" class="flex items-center gap-1 whitespace-nowrap">
                          <AtSymbolIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span class="text-gray-600">{{ client.contact.email }}</span>
                        </div>
                      </div>
                      <div v-if="!client.contact?.phone && !client.contact?.email" class="text-gray-400 italic">
                        Контакты не указаны
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Даты -->
              <div class="mt-4 pt-3 border-t border-amber-100 text-xs text-gray-500 grid grid-cols-2 gap-4">
                <div>
                  <span class="text-gray-700">Создан:</span> 
                  {{ formatDate(client.createdAt) }}
                </div>
                <div>
                  <span class="text-gray-700">Обновлен:</span> 
                  {{ formatDate(client.updatedAt) }}
                </div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex gap-2 ml-4">
              <button
                @click="editClient(client.id)"
                class="inline-flex items-center px-3 py-1.5 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <PencilIcon class="w-4 h-4 mr-1.5" />
                Изменить
              </button>
              
              <button
                @click="toggleArchive(client.id)"
                class="inline-flex items-center px-3 py-1.5 border border-amber-300 text-sm font-medium rounded-md bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                :class="client.archived ? 'text-green-700' : 'text-red-700'"
              >
                <ArchiveBoxIcon v-if="!client.archived" class="w-4 h-4 mr-1.5" />
                <ArchiveBoxArrowDownIcon v-else class="w-4 h-4 mr-1.5" />
                {{ client.archived ? "Восстановить" : "В архив" }}
              </button>

              <button
                @click="confirmDelete(client.id)"
                class="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon class="w-4 h-4 mr-1.5" />
                Удалить
              </button>
            </div>
          </div>
        </div>
      </li>
    </TransitionGroup>

    <EditClientModal
      v-if="isModalOpen && selectedClientId !== null"
      :clientId="selectedClientId as number"
      :isOpen="isModalOpen"
      :close="closeModal"
    />

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useClientStore } from "../store";
import EditClientModal from "./EditClientModal.vue";
import ClientFormBase from "./ClientFormBase.vue"
import { 
  AtSymbolIcon, 
  PhoneIcon, 
  PencilIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  TrashIcon
} from "@heroicons/vue/24/outline";
import DeleteConfirmModal from './DeleteConfirmModal.vue';

export default defineComponent({
  components: {
    EditClientModal,
    ClientFormBase,
    AtSymbolIcon,
    PhoneIcon,
    PencilIcon,
    ArchiveBoxIcon,
    ArchiveBoxArrowDownIcon,
    TrashIcon,
    DeleteConfirmModal
  },
  setup() {
    const clientStore = useClientStore();
    const showArchived = ref(false);
    const searchQuery = ref("");
    const selectedClientId = ref<number | null>(null);
    const isModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const clientToDelete = ref<number | null>(null);
    const toggleShowArchived = () => {
      showArchived.value = !showArchived.value;
    };

    const filteredClients = computed(() => {
      return clientStore.clients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          client.contact.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (client.contact.phone && client.contact.phone.includes(searchQuery.value));
        
        const matchesArchived = showArchived.value ? true : !client.archived;
        
        return matchesSearch && matchesArchived;
      });
    });

    const toggleArchive = (id: number) => {
      clientStore.toggleArchive(id);
    };

    const editClient = (id: number) => {
      selectedClientId.value = id;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      selectedClientId.value = null;
      isModalOpen.value = false;
    };
    const formatDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return date.toLocaleString("ru-RU", options);
    };

    const sortClientsByName = () => {
      clientStore.sortByName();
    };

    const sortClientsByBalance = () => {
      clientStore.sortByBalance();
    };

    const confirmDelete = (id: number) => {
      clientToDelete.value = id;
      isDeleteModalOpen.value = true;
    };

    const handleDelete = () => {
      if (clientToDelete.value !== null) {
        clientStore.deleteClient(clientToDelete.value);
        closeDeleteModal();
      }
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      clientToDelete.value = null;
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
      sortClientsByBalance,
      confirmDelete,
      isDeleteModalOpen,
      handleDelete,
      closeDeleteModal
    };
  },
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
