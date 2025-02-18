<template>
  <form class="bg-white shadow-lg rounded-lg p-4" @submit.prevent="handleSubmit">
    <fieldset class="space-y-3">
      <legend class="text-lg font-semibold text-gray-800 pb-2 border-b">Информация о клиенте</legend>
      
      <div class="grid grid-cols-2 gap-3">
        <!-- Основная информация -->
        <div class="col-span-2">
          <div class="flex items-center border border-gray-300 rounded-lg focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
            <UserIcon class="w-4 h-4 text-gray-400 ml-3" />
            <input
              class="w-full px-3 py-1.5 border-0 focus:ring-0 rounded-lg"
              v-model="client.name"
              placeholder="Название"
              @keypress="validateInput"
              required
            />
          </div>
        </div>

        <!-- Баланс -->
        <div class="col-span-1">
          <div class="flex items-center border border-gray-300 rounded-lg focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
            <CurrencyDollarIcon class="w-4 h-4 text-gray-400 ml-3" />
            <input
              class="w-full px-3 py-1.5 border-0 focus:ring-0 rounded-lg"
              v-model.number="client.balance"
              type="number"
              placeholder="Баланс"
            />
          </div>
        </div>

        <!-- Дата -->
        <div class="col-span-1">
          <input
            class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="client.createdAt"
            type="date"
          />
        </div>

        <!-- Адрес -->
        <div class="col-span-2 grid grid-cols-2 gap-3">
          <input
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="client.address.country"
            placeholder="Страна"
            @keypress="validateInput"
          />
          <input
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="client.address.postalCode"
            type="number"
            placeholder="Индекс"
          />
          <input
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="client.address.street"
            placeholder="Улица"
            @keypress="validateInput"
          />
          <input
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="client.address.office"
            type="number"
            placeholder="Офис"
          />
        </div>

        <!-- Контакты -->
        <div class="col-span-2 grid grid-cols-2 gap-3">
          <input
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="formattedPhone"
            @input="formatInput"
            type="tel"
            maxlength="17"
            placeholder="+7(XXX)XXX-XX-XX"
          />
          <input
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            v-model="client.contact.email"
            type="email"
            placeholder="Email"
          />
        </div>
      </div>

      <!-- Кнопка отправки -->
      <button 
        type="submit" 
        class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mt-4"
      >
        Сохранить
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { formatPhoneNumber,validateInput } from "../utilities/utils";
import { useClientStore } from "../store";
import type { Client } from "../types";
import { AtSymbolIcon,PhoneIcon,UserIcon, HomeIcon, GlobeAltIcon,CurrencyDollarIcon, ClockIcon,PencilIcon} from "@heroicons/vue/24/solid"; 
export default defineComponent({
  components: {
    AtSymbolIcon,
    PhoneIcon,
    UserIcon,
    HomeIcon,
    GlobeAltIcon,
    CurrencyDollarIcon,
    ClockIcon,
    PencilIcon
  
  },
  setup() {
    const clientStore = useClientStore();
    const client = ref<Client>({
      id: 0,
      name: "",
      balance: null as unknown as number,
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
      address: {
        country: "",
        postalCode: "",
        street: "",
        office: "",
      },
      contact: {
        phone: "",
        email: "",
      },
    });

    const formattedPhone = ref("");

    const handleSubmit = () => {
      const newClient = {
        ...client.value,
        contact: {
          ...client.value.contact,
          phone: formattedPhone.value
        },
        balance: client.value.balance || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      clientStore.addClient(newClient);

      client.value = {
        id: 0,
        name: "",
        balance: null as unknown as number,
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false,
        address: {
          country: "",
          postalCode: "",
          street: "",
          office: "",
        },
        contact: {
          phone: "",
          email: "",
        },
      };
      formattedPhone.value = "";
    };
    
    const formatInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const cursorPosition = input.selectionStart;
      let value = input.value.replace(/\D/g, '').substring(0, 11);
      
      if (value.length === 0) {
        formattedPhone.value = '';
        return;
      }

      let formattedValue = '+7';
      if (value.length > 1) {
        formattedValue += '(' + value.substring(1, 4);
      }
      if (value.length >= 4) {
        formattedValue += ')' + value.substring(4, 7);
      }
      if (value.length >= 7) {
        formattedValue += '-' + value.substring(7, 9);
      }
      if (value.length >= 9) {
        formattedValue += '-' + value.substring(9, 11);
      }
      
      formattedPhone.value = formattedValue;

      setTimeout(() => {
        input.selectionStart = input.selectionEnd = cursorPosition;
      }, 0);
    };
    
    return { client, handleSubmit, formattedPhone, formatInput, validateInput };
  },
});
</script>
