import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientList from '../ClientList.vue'
import { createTestingPinia } from '@pinia/testing'

// Мокаем fetch
global.fetch = vi.fn()

function mockFetch(data: any) {
  return vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data)
    })
  )
}

describe('ClientList', () => {
  const testClients = [
    {
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
    },
    {
      id: 2,
      name: "Archived Client",
      contact: {
        email: "archived@example.com",
        phone: "+9876543210"
      },
      balance: 2000,
      archived: true,
      address: {
        country: "Another Country",
        street: "Another Street"
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = mockFetch(testClients)
  })

  it('отображает список клиентов', async () => {
    const wrapper = mount(ClientList, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Ждем, пока загрузятся данные
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Проверяем, что клиенты отображаются
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1) // только неархивированные клиенты
    expect(rows[0].text()).toContain('Test Client')
    expect(rows[0].text()).toContain('test@example.com')
    expect(rows[0].text()).toContain('+1234567890')
  })

  it('фильтрует клиентов при поиске', async () => {
    const wrapper = mount(ClientList, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Ждем загрузки данных
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Вводим текст поиска
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('test')

    // Ждем обновления данных
    await wrapper.vm.$nextTick()

    // Проверяем фильтрацию
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1)
    expect(rows[0].text()).toContain('Test Client')
  })

  it('переключает отображение архивных клиентов', async () => {
    const wrapper = mount(ClientList, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Ждем загрузки данных
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Нажимаем кнопку показа архива
    const archiveButton = wrapper.find('[data-test="toggle-archive"]')
    await archiveButton.trigger('click')

    // Ждем обновления данных
    await wrapper.vm.$nextTick()

    // Проверяем, что отображаются архивные клиенты
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1)
    expect(rows[0].text()).toContain('Archived Client')
  })

  it('архивирует клиента', async () => {
    const wrapper = mount(ClientList, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Ждем загрузки данных
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Нажимаем кнопку архивации
    const archiveButton = wrapper.find('[data-test="archive-button"]')
    await archiveButton.trigger('click')

    // Проверяем запрос на архивацию
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/clients/1'),
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"archived":true')
      })
    )
  })

  
}) 