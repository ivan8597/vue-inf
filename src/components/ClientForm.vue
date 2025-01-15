<template>
  <form class="w-[490px]" @submit.prevent="handleSubmit">
    <fieldset class="border p-4">
      <legend>Информация о клиенте</legend>
      <div class="border p-2 mb-2 flex items-center">
       <UserIcon class="w-5 h-5 text-gray-500 mr-2" />
        <input
          class="w-full"
          v-model="client.name"
          placeholder="Название"
          @keypress="validateInput"
          required
        />
      </div>
      <div class="border p-2 mb-2 flex items-center">
      <CurrencyDollarIcon  class="w-5 h-5 text-gray-500 mr-2"/> 
        <input
          class="w-full"
          v-model.number="client.balance"
          type="number"
          placeholder="Баланс"
          required
        />
      </div>
      <div class="border p-2 mb-2 flex items-center">
        <GlobeAltIcon class="w-5 h-5 text-gray-500 mr-2"/>
        <input
          class="w-full"
          v-model="client.address.country"
          placeholder="Страна"
          @keypress="validateInput"
        />
      </div>
      <div class="border p-2 mb-2 flex items-center">
        <PencilIcon class="w-5 h-5 text-gray-500 mr-2"/> 
        <input
          class="w-full"
          v-model="client.address.postalCode"
          type="number"
          placeholder="Индекс"
        />
      </div>
      <div class="border p-2 mb-2 flex items-center">
       <HomeIcon class="w-5 h-5 text-gray-500 mr-2"/>
        <input
          class="w-full"
          v-model="client.address.street"
          placeholder="Улица"
          @keypress="validateInput"
        />
      </div>
      <div class="border p-2 mb-2 flex items-center">
       <ClockIcon class="w-5 h-5 text-gray-500 mr-2"/>
        <input
          class="w-full"
          v-model="client.address.office"
          type="number"
          placeholder="Офис"
        />
      </div>
      <div class="border p-2 mb-2 flex items-center">
      <PhoneIcon class="w-5 h-5 text-gray-500 mr-2" />
        <input
          class="w-full"
          v-model="formattedPhone"
          @input="formatInput"
          placeholder="+7(XXX)XXX-XX-XX"
        />
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
      <div class="border p-2 mb-2">
        <label>Дата создания:</label>
        <input
          class="w-full"
          v-model="client.createdAt"
          type="date"
          placeholder="Дата создания"
        />
      </div>
      <div class="border p-2 mb-2 bg-green-600 rounded text-white">
        <button type="submit" class="w-full">Сохранить</button>
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { formatPhoneNumber,validateInput } from "../utilities/utils";
import { useClientStore, Client } from "../store";
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
      balance: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
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

    const handleSubmit = () => {//функция отпраки формы клиента
      client.value.contact.phone = formattedPhone.value; // cохраняем отформатированный телефонный номер
      clientStore.addClient(client.value);//добавление 
      Object.assign(client.value, {//объект клиента будет обновлен с новыми значениями для указанных полей
        name: "",
        balance: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        archived: client.value.archived,//cохраняет текущее состояние поля archived, будет оставлено как есть, не сбрасывается

        address: { country: "", postalCode: "", street: "", office: "" },
        contact: { phone: "", email: "" },
      });
      formattedPhone.value = ""; // сбрасываем форматированный  телефонный номер
    };
     const formatInput = () => {///использование функции отформатирования номера телефона
      formattedPhone.value = formatPhoneNumber(formattedPhone.value)
    };
    
    return { client, handleSubmit, formattedPhone, formatInput, validateInput };
  },
});
</script>
