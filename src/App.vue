<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Client Organizer</h1>
    <div class="flex">
      <div class="flex-grow">
        <ClientForm />
      </div>
      <div class="flex-shrink-0 w-1/2">
        <ClientList />
      </div>
    </div>
    <!-- <EditClientModal /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClientForm from "./components/ClientForm.vue";
import ClientList from "./components/ClientList.vue";
// import EditClientModal from "./components/EditClientModal.vue";
import ClientFormBase from './components/ClientFormBase.vue'

export default defineComponent({
  components: {
    ClientForm,
    ClientList,
    // EditClientModal,
    ClientFormBase
  },
});
</script>
