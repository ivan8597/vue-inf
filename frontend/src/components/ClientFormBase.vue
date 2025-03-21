<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Название</label>
      <input
        v-model="formData.name"
        data-test="name-input"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
      <span v-if="errors.name" data-test="error-message" class="text-red-500 text-sm">{{ errors.name }}</span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        v-model="formData.contact.email"
        data-test="email-input"
        type="email"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
      <span v-if="errors.email" data-test="email-error" class="text-red-500 text-sm">{{ errors.email }}</span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Телефон</label>
      <input
        v-model="formData.contact.phone"
        data-test="phone-input"
        type="tel"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
      <span v-if="errors.phone" data-test="phone-error" class="text-red-500 text-sm">{{ errors.phone }}</span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Баланс</label>
      <input
        v-model.number="formData.balance"
        data-test="balance-input"
        type="number"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
      <span v-if="errors.balance" data-test="balance-error" class="text-red-500 text-sm">{{ errors.balance }}</span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Страна</label>
      <input
        v-model="formData.address.country"
        data-test="country-input"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
      <span v-if="errors.country" data-test="error-message" class="text-red-500 text-sm">{{ errors.country }}</span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Улица</label>
      <input
        v-model="formData.address.street"
        data-test="street-input"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
      <span v-if="errors.street" data-test="error-message" class="text-red-500 text-sm">{{ errors.street }}</span>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Сохранить
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Client } from '../types'

const props = defineProps<{
  client: Client
}>()

const emit = defineEmits<{
  (e: 'submit', client: Client): void
}>()

const formData = ref<Client>({ ...props.client })
const errors = ref<Record<string, string>>({})

watch(() => props.client, (newClient) => {
  formData.value = { ...newClient }
})

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s-()]+$/
  return phoneRegex.test(phone)
}

const handleSubmit = () => {
  errors.value = {}

  // Валидация обязательных полей
  if (!formData.value.name) {
    errors.value.name = 'Это поле обязательно'
  }
  if (!formData.value.contact.email) {
    errors.value.email = 'Это поле обязательно'
  }
  if (!formData.value.contact.phone) {
    errors.value.phone = 'Это поле обязательно'
  }
  if (!formData.value.address.country) {
    errors.value.country = 'Это поле обязательно'
  }
  if (!formData.value.address.street) {
    errors.value.street = 'Это поле обязательно'
  }

  // Валидация формата email
  if (formData.value.contact.email && !validateEmail(formData.value.contact.email)) {
    errors.value.email = 'Неверный формат email'
  }

  // Валидация формата телефона
  if (formData.value.contact.phone && !validatePhone(formData.value.contact.phone)) {
    errors.value.phone = 'Неверный формат телефона'
  }

  // Валидация баланса
  if (formData.value.balance < 0) {
    errors.value.balance = 'Баланс не может быть отрицательным'
  }

  if (Object.keys(errors.value).length === 0) {
    emit('submit', formData.value)
  }
}
</script> 