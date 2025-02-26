import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ClientForm from '../ClientForm.vue'
import { useClientStore } from '../../store'

describe('ClientForm', () => {
  // Инициализируем новый экземпляр Pinia перед каждым тестом
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // Проверяет базовый рендеринг формы
  it('рендерит форму', () => {
    const wrapper = mount(ClientForm, {
      global: {
        // Заглушки для иконок, чтобы упростить тестирование
        stubs: {
          'UserIcon': true,
          'CurrencyDollarIcon': true,
          'AtSymbolIcon': true,
          'PhoneIcon': true,
          'HomeIcon': true,
          'GlobeAltIcon': true,
          'ClockIcon': true,
          'PencilIcon': true
        }
      }
    })
    // Проверяем наличие элемента формы
    expect(wrapper.find('form').exists()).toBe(true)
  })

  // Проверяет отправку формы с валидными данными
  it('эмитит событие submit с данными клиента', async () => {
    const wrapper = mount(ClientForm, {
      global: {
        // Заглушки для иконок
        stubs: {
          'UserIcon': true,
          'CurrencyDollarIcon': true,
          'AtSymbolIcon': true,
          'PhoneIcon': true,
          'HomeIcon': true,
          'GlobeAltIcon': true,
          'ClockIcon': true,
          'PencilIcon': true
        },
        // Подключаем Pinia для доступа к store
        plugins: [createPinia()]
      }
    })
    
    // Заполняем поля формы
    await wrapper.find('[data-test="name-input"]').setValue('Иван Иванов')
    await wrapper.find('[data-test="email-input"]').setValue('ivan@example.com')
    // Имитируем отправку формы
    await wrapper.find('form').trigger('submit.prevent')

    // Проверяем, что данные сохранились в store
    const store = useClientStore()
    expect(store.clients).toHaveLength(1)
    expect(store.clients[0]).toMatchObject({
      name: 'Иван Иванов',
      contact: {
        email: 'ivan@example.com'
      }
    })
  })

  // Проверяет валидацию пустой формы
  it('показывает сообщение об ошибке при отправке пустой формы', async () => {
    const wrapper = mount(ClientForm, {
      global: {
        // Заглушки для иконок
        stubs: {
          'UserIcon': true,
          'CurrencyDollarIcon': true,
          'AtSymbolIcon': true,
          'PhoneIcon': true,
          'HomeIcon': true,
          'GlobeAltIcon': true,
          'ClockIcon': true,
          'PencilIcon': true
        }
      }
    })
    
    // Пытаемся отправить пустую форму
    await wrapper.find('form').trigger('submit.prevent')
    // Проверяем наличие сообщения об ошибке
    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
    // Проверяем текст сообщения об ошибке
    expect(wrapper.find('[data-test="error-message"]').text())
      .toBe('Все поля обязательны для заполнения')
  })
}) 