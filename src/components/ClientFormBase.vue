<template>
  <form class="w-full max-w-2xl" @submit.prevent="handleSubmit">
    <div class="bg-white rounded-lg">
      <div class="grid grid-cols-2 gap-4">
        <!-- Название -->
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <BaseInput
            v-model="formData.name"
            :icon="UserIcon"
            placeholder="Введите название"
            @keypress="validateInput"
            required
          />
        </div>

        <!-- Баланс -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Баланс</label>
          <BaseInput
            v-model.number="formData.balance"
            :icon="CurrencyDollarIcon"
            type="number"
            placeholder="0.00"
            required
          />
        </div>

        <!-- Адрес -->
        <FormSection title="Адрес">
          <BaseInput
            v-model="formData.address.country"
            :icon="GlobeAltIcon"
            placeholder="Страна"
            @keypress="validateInput"
          />
          <BaseInput
            v-model="formData.address.postalCode"
            :icon="PencilIcon"
            type="number"
            placeholder="Индекс"
          />
          <BaseInput
            v-model="formData.address.street"
            :icon="HomeIcon"
            placeholder="Улица"
            @keypress="validateInput"
          />
          <BaseInput
            v-model="formData.address.office"
            :icon="ClockIcon"
            type="number"
            placeholder="Офис"
          />
        </FormSection>

        <!-- Контакты -->
        <FormSection title="Контактная информация">
          <BaseInput
            v-model="formattedPhone"
            :icon="PhoneIcon"
            @input="formatInput"
            placeholder="+7(XXX)XXX-XX-XX"
          />
          <BaseInput
            v-model="formData.contact.email"
            :icon="AtSymbolIcon"
            type="email"
            placeholder="Email"
          />
        </FormSection>
      </div>

      <!-- Кнопки -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          class="btn-primary"
        >
          Сохранить
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import type { Client } from "../types";
import { formatPhoneNumber, validateInput } from "../utilities/utils";
import {
  AtSymbolIcon,
  PhoneIcon,
  UserIcon,
  HomeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PencilIcon,
} from "@heroicons/vue/24/solid";
import BaseInput from "./BaseInput.vue";
import FormSection from "./FormSection.vue";

export default defineComponent({
  props: {
    client: {
      type: Object as PropType<Client>,
      required: true,
    },
  },

  components: {
    AtSymbolIcon,
    PhoneIcon,
    UserIcon,
    HomeIcon,
    GlobeAltIcon,
    CurrencyDollarIcon,
    ClockIcon,
    PencilIcon,
    BaseInput,
    FormSection,
  },
  emits: ["submit", "cancel"],
  setup(props, { emit }) {
    const formData = ref<Client>(JSON.parse(JSON.stringify(props.client)));
    const formattedPhone = ref(props.client.contact.phone || "");

    const handleSubmit = () => {
      // Создаем обновленный объект клиента
      const updatedClient = {
        ...formData.value,
        contact: {
          ...formData.value.contact,
          phone: formattedPhone.value
        },
        updatedAt: new Date()
      };

      emit("submit", updatedClient);
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

    return {
      formData,
      formatInput,
      validateInput,
      formattedPhone,
      handleSubmit,
      UserIcon,
      CurrencyDollarIcon,
      GlobeAltIcon,
      PencilIcon,
      HomeIcon,
      ClockIcon,
      PhoneIcon,
      AtSymbolIcon
    };
  },
});
</script>
