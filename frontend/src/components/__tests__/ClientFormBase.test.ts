import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientFormBase from '../ClientFormBase.vue'
import type { Client } from '../../types'

describe('ClientFormBase', () => {
  const testClient: Client = {
    id: 1,
    name: "Test Client",
    contact: {
      email: "test@example.com",
      phone: "+1234567890"
    },
    balance: 1000,
    archived: false,
    address: {
      country: "Test Country",
      street: "Test Street"
    }
  }

  it('отображает форму с данными клиента', () => {
    const wrapper = mount(ClientFormBase, {
      props: {
        client: testClient
      }
    })

    // Проверяем, что все поля заполнены корректно
    const inputs = {
      name: wrapper.find('[data-test="name-input"]').element as HTMLInputElement,
      email: wrapper.find('[data-test="email-input"]').element as HTMLInputElement,
      phone: wrapper.find('[data-test="phone-input"]').element as HTMLInputElement,
      balance: wrapper.find('[data-test="balance-input"]').element as HTMLInputElement,
      country: wrapper.find('[data-test="country-input"]').element as HTMLInputElement,
      street: wrapper.find('[data-test="street-input"]').element as HTMLInputElement
    }

    expect(inputs.name.value).toBe(testClient.name)
    expect(inputs.email.value).toBe(testClient.contact.email)
    expect(inputs.phone.value).toBe(testClient.contact.phone)
    expect(inputs.balance.value).toBe(String(testClient.balance))
    expect(inputs.country.value).toBe(testClient.address.country)
    expect(inputs.street.value).toBe(testClient.address.street)
  })

  it('валидирует обязательные поля', async () => {
    const wrapper = mount(ClientFormBase, {
      props: {
        client: {
          id: 0,
          name: "",
          contact: {
            email: "",
            phone: ""
          },
          balance: 0,
          archived: false,
          address: {
            country: "",
            street: ""
          }
        }
      }
    })

    // Пытаемся отправить пустую форму
    await wrapper.find('form').trigger('submit')

    // Проверяем наличие сообщений об ошибках
    const errors = wrapper.findAll('[data-test="error-message"]')
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].text()).toBe('Это поле обязательно')
  })

  it('эмитит событие submit с данными формы', async () => {
    const wrapper = mount(ClientFormBase, {
      props: {
        client: testClient
      }
    })

    // Изменяем значение в поле
    await wrapper.find('[data-test="name-input"]').setValue('New Name')

    // Отправляем форму
    await wrapper.find('form').trigger('submit')

    // Проверяем, что событие submit было эмитировано с правильными данными
    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0][0]).toEqual({
        ...testClient,
        name: 'New Name'
      })
    }
  })

  it('валидирует формат email', async () => {
    const wrapper = mount(ClientFormBase, {
      props: {
        client: testClient
      }
    })

    // Вводим неверный email
    await wrapper.find('[data-test="email-input"]').setValue('invalid-email')

    // Отправляем форму
    await wrapper.find('form').trigger('submit')

    // Проверяем наличие сообщения об ошибке
    const error = wrapper.find('[data-test="email-error"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Неверный формат email')
  })

  it('валидирует формат телефона', async () => {
    const wrapper = mount(ClientFormBase, {
      props: {
        client: testClient
      }
    })

    // Вводим неверный телефон
    await wrapper.find('[data-test="phone-input"]').setValue('invalid-phone')

    // Отправляем форму
    await wrapper.find('form').trigger('submit')

    // Проверяем наличие сообщения об ошибке
    const error = wrapper.find('[data-test="phone-error"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Неверный формат телефона')
  })

  it('валидирует значение баланса', async () => {
    const wrapper = mount(ClientFormBase, {
      props: {
        client: testClient
      }
    })

    // Вводим отрицательный баланс
    await wrapper.find('[data-test="balance-input"]').setValue('-100')

    // Отправляем форму
    await wrapper.find('form').trigger('submit')

    // Проверяем наличие сообщения об ошибке
    const error = wrapper.find('[data-test="balance-error"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Баланс не может быть отрицательным')
  })
}) 