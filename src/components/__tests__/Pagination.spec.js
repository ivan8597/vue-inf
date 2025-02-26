import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../Pagination.vue'

describe('Pagination', () => {
  // Проверяет корректное отображение кнопок страниц
  it('отображает правильное количество страниц', () => {
    const wrapper = mount(Pagination, {
      props: {
        totalItems: 100,    // Всего элементов
        itemsPerPage: 10,   // Элементов на странице
        currentPage: 1      // Текущая страница
      }
    })

    // Находим все кнопки страниц и проверяем их количество
    const pageButtons = wrapper.findAll('[data-test="page-button"]')
    expect(pageButtons).toHaveLength(10) // Должно быть 10 страниц (100/10)
  })

  // Проверяет работу события при смене страницы
  it('эмитит событие page-change при клике на страницу', async () => {
    const wrapper = mount(Pagination, {
      props: {
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1
      }
    })

    // Имитируем клик по второй странице
    await wrapper.findAll('[data-test="page-button"]')[1].trigger('click')
    
    // Проверяем, что событие page-change было вызвано
    expect(wrapper.emitted('page-change')).toBeTruthy()
    // Проверяем, что в событие передан номер новой страницы (2)
    expect(wrapper.emitted('page-change')[0][0]).toBe(2)
  })

  // Проверяет выделение текущей активной страницы
  it('выделяет текущую страницу', () => {
    const wrapper = mount(Pagination, {
      props: {
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 3      // Устанавливаем активной третью страницу
      }
    })

    // Находим кнопку с классом active и проверяем её номер
    const activeButton = wrapper.find('.active')
    expect(activeButton.text()).toBe('3')
  })
}) 