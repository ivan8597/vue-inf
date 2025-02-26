import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
  // Проверяет, что компонент эмитит событие search при вводе текста
  it('эмитит событие search при вводе текста', async () => {
    const wrapper = mount(SearchBar)// создаёт экземпляр компонента для тестирования
    
    await wrapper.find('input').setValue('Иван')// устанавливает значение в поле ввода
    
    expect(wrapper.emitted('search')).toBeTruthy()// проверяет, что событие search было вызвано
    expect(wrapper.emitted('search')[0][0]).toBe('Иван')// проверяет, что событие search было вызвано с правильным значением
  })

  it('очищает поле поиска при клике на кнопку очистки', async () => {
    const wrapper = mount(SearchBar)// создаёт экземпляр компонента для тестирования
    
    await wrapper.find('input').setValue('Иван')// устанавливает значение в поле ввода
    await wrapper.find('[data-test="clear-button"]').trigger('click')// кликает на кнопку очистки
    
    expect(wrapper.find('input').element.value).toBe('')// проверяет, что поле ввода было очищено
    expect(wrapper.emitted('search')).toBeTruthy()// проверяет, что событие search было вызвано
    expect(wrapper.emitted('search')[1][0]).toBe('')// проверяет, что событие search было вызвано с правильным значением
  })
}) 