import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientCard from '../ClientCard.vue'

describe('ClientCard', () => {
  // Тестовые данные клиента для всех тестов
  const mockClient = {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 999 999 99 99'
  }

  // Проверяет корректное отображение информации о клиенте
  it('отображает информацию о клиенте', () => {
    const wrapper = mount(ClientCard, {
      props: { 
        client: mockClient 
      }
    })

    // Проверяем, что все поля клиента отображаются в компоненте
    expect(wrapper.text()).toContain('Иван Иванов')
    expect(wrapper.text()).toContain('ivan@example.com')
    expect(wrapper.text()).toContain('+7 999 999 99 99')
  })

  // Проверяет работу кнопки редактирования
  it('эмитит событие edit при клике на кнопку редактирования', async () => {
    const wrapper = mount(ClientCard, {
      props: { 
        client: mockClient 
      }
    })

    // Имитируем клик по кнопке редактирования
    await wrapper.find('[data-test="edit-button"]').trigger('click')
    
    // Проверяем, что событие edit было вызвано
    expect(wrapper.emitted()).toHaveProperty('edit')
    const editEvent = wrapper.emitted('edit')
    // Проверяем, что в событие передан объект клиента
    expect(editEvent[0][0]).toEqual(mockClient)
  })

  // Проверяет работу кнопки удаления
  it('эмитит событие delete при клике на кнопку удаления', async () => { 
    const wrapper = mount(ClientCard, {
      props: { 
        client: mockClient 
      }
    })

    // Имитируем клик по кнопке удаления
    await wrapper.find('[data-test="delete-button"]').trigger('click')
    
    // Проверяем, что событие delete было вызвано
    expect(wrapper.emitted()).toHaveProperty('delete')
    const deleteEvent = wrapper.emitted('delete')
    // Проверяем, что в событие передан id клиента
    expect(deleteEvent[0][0]).toBe(mockClient.id)
  })
}) 