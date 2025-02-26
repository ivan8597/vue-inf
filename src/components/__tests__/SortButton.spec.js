import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortButton from '../SortButton.vue'

describe('SortButton', () => {
  // Проверяет переключение направления сортировки при клике
  it('меняет направление сортировки при клике', async () => {
    // Создаем компонент с начальным направлением сортировки "asc"
    const wrapper = mount(SortButton, {
      props: {
        field: 'name',
        direction: 'asc'
      }
    })

    // Имитируем клик по кнопке сортировки
    await wrapper.trigger('click')
    
    // Проверяем, что событие sort было вызвано
    expect(wrapper.emitted('sort')).toBeTruthy()
    // Проверяем, что направление сортировки изменилось на "desc"
    expect(wrapper.emitted('sort')[0][0]).toEqual({
      field: 'name',
      direction: 'desc'
    })
  })

  // Проверяет корректное отображение иконки сортировки
  it('отображает правильную иконку для направления сортировки', () => {
    // Создаем компонент с направлением сортировки "asc"
    const wrapper = mount(SortButton, {
      props: {
        field: 'name',
        direction: 'asc'
      }
    })

    // Проверяем наличие иконки для возрастающей сортировки
    expect(wrapper.find('.sort-icon-asc').exists()).toBe(true)
    // Проверяем отсутствие иконки для убывающей сортировки
    expect(wrapper.find('.sort-icon-desc').exists()).toBe(false)
  })
}) 