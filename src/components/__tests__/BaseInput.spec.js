import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
  // Проверяет, что компонент содержит элемент input
  it('рендерит input элемент', () => {
    const wrapper = mount(BaseInput)
    // Проверяем наличие элемента input в DOM дереве компонента
    // wrapper.find() ищет элемент по CSS селектору
    // exists() возвращает true, если элемент найден
    expect(wrapper.find('input').exists()).toBe(true) 
  })

  // Проверяет, что компонент правильно эмитит события при вводе текста
  it('эмитит событие input при вводе', async () => {
    // Создаём экземпляр компонента для тестирования
    const wrapper = mount(BaseInput)
    // Находим элемент input внутри компонента
    const input = wrapper.find('input')
    // Имитируем ввод текста пользователем
    // await необходим, так как setValue возвращает Promise
    await input.setValue('test value')
    
    // Проверяем, что событие update:modelValue было вызвано
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // Проверяем, что событие было вызвано с правильным значением
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
  })

  // Проверяет, что начальное значение корректно отображается в поле ввода
  it('правильно отображает начальное значение', () => {
    // Создаём экземпляр компонента для тестирования
    const wrapper = mount(BaseInput, { 
      // Передаём начальное значение для проверки
      props: {
        modelValue: 'initial value'
      }
    })
    expect(wrapper.find('input').element.value).toBe('initial value')
  })

  // Проверяет, что HTML-атрибуты корректно передаются в элемент input
  it('применяет переданные атрибуты', () => {
    // Создаём экземпляр компонента для тестирования
    const wrapper = mount(BaseInput, { 
      // Передаём атрибуты для проверки
      props: {
        placeholder: 'Enter text',  
        type: 'email'
      }
    })
    const input = wrapper.find('input')
    // Проверяем, что атрибут placeholder корректно передан
    expect(input.attributes('placeholder')).toBe('Enter text')
    // Проверяем, что атрибут type корректно передан
    expect(input.attributes('type')).toBe('email')
  })
}) 