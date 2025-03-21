declare module '@pinia/testing' {
  import { Pinia } from 'pinia'
  export function createTestingPinia(options?: { initialState?: Record<string, any>; createSpy?: () => any }): Pinia
} 