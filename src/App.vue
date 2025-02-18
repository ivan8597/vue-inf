<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100/30 to-amber-100/20">
    <div class="container mx-auto h-screen flex flex-col">
      <!-- Шапка приложения -->
      <header class="py-4 px-4 bg-gradient-to-r from-amber-100/50 to-amber-50/50 border-b border-amber-200/30">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-xl font-semibold text-amber-900">Система управления клиентами</h1>
          <p class="text-sm text-amber-800/80">Управление базой клиентов и их данными</p>
        </div>
      </header>

      <!-- Основной контент -->
      <main class="flex-1 overflow-hidden px-4 py-2">
        <div class="max-w-7xl mx-auto h-full">
          <div class="flex gap-6 h-full">
            <div class="w-[500px] overflow-auto">
              <ClientForm />
            </div>
            <div class="flex-1 overflow-auto">
              <ClientList />
            </div>
          </div>
        </div>
      </main>

      <!-- Подвал -->
      <footer class="py-2 px-4 border-t border-amber-200/30 bg-gradient-to-r from-amber-50/50 to-amber-100/50">
        <div class="max-w-7xl mx-auto text-center text-amber-900/70 text-xs">
          © {{ new Date().getFullYear() }} Система управления клиентами
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import ClientForm from "./components/ClientForm.vue";
import ClientList from "./components/ClientList.vue";
// import EditClientModal from "./components/EditClientModal.vue";
import ClientFormBase from './components/ClientFormBase.vue'
import { useClientStore } from "./store";

export default defineComponent({
  components: {
    ClientForm,
    ClientList,
    // EditClientModal,
    ClientFormBase
  },
  setup() {
    const clientStore = useClientStore();

    onMounted(() => {
      clientStore.initializeStore();
    });
  }
});
</script>

<style lang="postcss">
body {
  @apply bg-amber-50;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Стили для скроллбара */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-amber-100/50;
}

::-webkit-scrollbar-thumb {
  @apply bg-amber-200 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-amber-300;
}

/* Добавляем стили для скроллируемых контейнеров */
.overflow-auto {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    @apply bg-amber-100/30;
  }
  
  &::-webkit-scrollbar-thumb {
    @apply bg-amber-200/70 rounded-full;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    @apply bg-amber-300/70;
  }
}

.btn-primary {
  @apply px-4 py-2 border border-transparent rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors;
}
</style>
