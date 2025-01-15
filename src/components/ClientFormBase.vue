<template>
  <form class="w-[490px]" @submit.prevent="handleSubmit">
    <div class="border p-2 mb-2 flex items-center">
      <UserIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="formData.name"
        placeholder="Название"
        @keypress="validateInput"
        required
      />
    </div>
    <div class="border p-2 mb-2 flex items-center">
      <CurrencyDollarIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model.number="formData.balance"
        type="number"
        placeholder="Баланс"
        required
      />
    </div>
    <div class="border p-2 mb-2 flex items-center">
      <GlobeAltIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="formData.address.country"
        placeholder="Страна"
        @keypress="validateInput"
      />
    </div>
    <div class="border p-2 mb-2 flex items-center">
      <PencilIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="formData.address.postalCode"
        type="number"
        placeholder="Индекс"
      />
    </div>
    <div class="border p-2 mb-2 flex items-center">
      <HomeIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="formData.address.street"
        placeholder="Улица"
        @keypress="validateInput"
      />
    </div>
    <div class="border p-2 mb-2 flex items-center">
      <ClockIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="formData.address.office"
        type="number"
        placeholder="Офис"
      />
    </div>
    <div class="relative border p-2 mb-2 flex items-center">
      <PhoneIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="formattedPhone"
        @input="formatInput"
        placeholder="+7(XXX)XXX-XX-XX"
        @focus="showTooltip = true"
        @blur="showTooltip = false"
      />
      <div
        v-if="showTooltip"
        class="absolute left-full ml-2 mt-1 bg-gray-700 text-white text-xs p-1 rounded"
      >
        Для редактирования выделите номер и удалите
      </div>
    </div>

    <div class="border p-2 mb-2 flex items-center">
      <AtSymbolIcon class="w-5 h-5 text-gray-500 mr-2" />
      <input
        class="w-full"
        v-model="client.contact.email"
        type="email"
        placeholder="Email"
      />
    </div>
    <div class="flex justify-between">
      <button type="button" @click="$emit('cancel')" class="bg-gray-300 p-2">
        Отмена
      </button>
      <button type="submit" class="bg-blue-500 text-white p-2">
        Сохранить
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { Client } from "../store";
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
  },
  emits: ["submit", "cancel"],
  setup(props, { emit }) {
    const formData = ref<Client>({ ...props.client });
    const formattedPhone = ref(props.client.contact.phone || "");//отформатированный хранит номер телефона клиента
    const showTooltip = ref(false);//подсказка 
    const handleSubmit = () => {
      emit("submit", formData.value);

      formData.value.contact.phone = formattedPhone.value;//сохраняет отформатированный номер телефона
    };//позволяет родительскому компоненту получить доступ к обновленным данным клиента

    const formatInput = () => {//использование функции отформатирования номера телефона
      formattedPhone.value = formatPhoneNumber(formattedPhone.value);
    };

    return {
      formData,
      formatInput,
      validateInput,
      formattedPhone,
      handleSubmit,
      showTooltip,
    };
  },
});
</script>
