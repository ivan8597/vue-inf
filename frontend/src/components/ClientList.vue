<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-semibold text-gray-900 animate__animated animate__fadeIn">
          {{ showArchived ? 'Архив клиентов' : 'Активные клиенты' }}
        </h1>
        <button
          @click="toggleShowArchived"
          class="px-4 py-2 text-sm font-medium rounded-md animate__animated animate__fadeIn"
          :class="showArchived ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'"
          data-test="toggle-archive"
        >
          {{ showArchived ? 'Показать активных' : 'Показать архив' }}
        </button>
      </div>
      <router-link
        to="/clients/new"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 animate__animated animate__fadeIn"
      >
        Добавить клиента
      </router-link>
    </div>

    <!-- Поиск и сортировка -->
    <div class="mb-6 flex gap-4 animate__animated animate__fadeIn">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по имени, email или телефону..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">По имени</option>
          <option value="balance">По балансу</option>
        </select>
        <button
          @click="toggleSort(sortBy)"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden animate__animated animate__fadeIn">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Баланс</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="client in filteredAndSortedClients" 
            :key="client.id" 
            :class="{ 'bg-gray-50': client.archived }"
            class="animate__animated animate__fadeIn"
          >
            <td class="px-6 py-4 whitespace-nowrap">{{ client.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ client.contact.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ client.contact.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ client.balance }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  client.archived ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                ]"
              >
                {{ client.archived ? 'В архиве' : 'Активный' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button
                  @click="openEditModal(client)"
                  class="text-blue-600 hover:text-blue-900 animate__animated animate__fadeIn"
                  data-test="edit-button"
                >
                  Редактировать
                </button>
                <button
                  @click="toggleArchived(client)"
                  :class="[
                    'animate__animated animate__fadeIn',
                    client.archived ? 'text-green-600 hover:text-green-900' : 'text-amber-600 hover:text-amber-900'
                  ]"
                  data-test="archive-button"
                >
                  {{ client.archived ? 'Восстановить' : 'Архивировать' }}
                </button>
                <button
                  @click="openDeleteModal(client)"
                  class="text-red-600 hover:text-red-900 animate__animated animate__fadeIn"
                  data-test="delete-button"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EditClientModal
      :isOpen="isEditModalOpen"
      :clientId="selectedClientId"
      :close="closeEditModal"
      @updated="loadClients"
    />

    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      :client="selectedClient"
      :close="closeDeleteModal"
      @confirmed="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useClientStore } from '../store'
import type { Client } from '../types'
import EditClientModal from './EditClientModal.vue'
import DeleteConfirmModal from './DeleteConfirmModal.vue'

const clientStore = useClientStore()
const clients = ref<Client[]>([])
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedClientId = ref<number>(0)
const selectedClient = ref<Client | null>(null)

// Поиск и сортировка
const searchQuery = ref('')
const sortBy = ref<'name' | 'balance' | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const showArchived = ref(false)

const filteredAndSortedClients = computed(() => {
  let result = [...clients.value]

  // Фильтрация
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.contact.email.toLowerCase().includes(query) ||
      client.contact.phone.toLowerCase().includes(query)
    )
  }

  // Сортировка
  if (sortBy.value) {
    result.sort((a, b) => {
      const aValue = sortBy.value === 'name' ? a.name : a.balance
      const bValue = sortBy.value === 'name' ? b.name : b.balance
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  // Фильтрация по статусу
  result = result.filter(client => client.archived === showArchived.value)

  return result
})

const loadClients = async () => {
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    if (sortBy.value) {
      params.append('sort_by', sortBy.value)
      params.append('sort_order', sortOrder.value)
    }
    params.append('archived', String(showArchived.value))

    const response = await fetch(`http://localhost:8000/api/clients?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }
    clients.value = await response.json()
  } catch (error) {
    console.error('Error loading clients:', error)
  }
}

// Обновляем данные при изменении параметров
watch([searchQuery, sortBy, sortOrder, showArchived], () => {
  loadClients()
})

const toggleSort = (field: 'name' | 'balance' | null) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const openEditModal = (client: Client) => {
  selectedClientId.value = client.id
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  loadClients()
}

const openDeleteModal = (client: Client) => {
  selectedClient.value = client
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedClient.value = null
}

const handleDeleteConfirm = async () => {
  if (selectedClient.value) {
    try {
      await clientStore.deleteClient(selectedClient.value.id)
      await loadClients()
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error)
    }
    closeDeleteModal()
  }
}

const toggleArchived = async (client: Client) => {
  try {
    const response = await fetch(`http://localhost:8000/api/clients/${client.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...client,
        archived: !client.archived
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update client')
    }
    
    await loadClients()
  } catch (error) {
    console.error('Error updating client:', error)
  }
}

const toggleShowArchived = () => {
  showArchived.value = !showArchived.value
  loadClients()
}

onMounted(loadClients)
</script>

<style>
.animate__animated {
  animation-duration: 0.5s;
}

/* Замедляем некоторые анимации для лучшего восприятия */
.animate__fadeIn {
  animation-duration: 0.8s;
}

/* Добавляем задержку для анимации строк таблицы */
tbody tr {
  animation-delay: calc(var(--animate-delay) * 0.1s);
}
</style> 