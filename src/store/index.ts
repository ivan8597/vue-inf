import { defineStore, StoreDefinition, PiniaCustomProperties } from 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    sortByName(): void
    sortByBalance(): void
    toggleArchive(id: number): void
  }
}

export interface Client {
  id: number
  name: string
  contact: { email: string; phone: string }
  balance: number
  archived: boolean
  address: { country: string; street: string }
  createdAt?: Date
  updatedAt?: Date
}

interface State {
  clients: Client[]
  activeClientId: number | null
}

interface Actions {
  sortByName(): void
  sortByBalance(): void
  toggleArchive(id: number): void
}

export const useClientStore = defineStore('clients', {
  state: () => ({
    clients: [] as Client[],
    activeClientId: null as number | null
  }),
  actions: {
    toggleArchive(id: number) {
      const client = this.clients.find(c => c.id === id)
      if (client) client.archived = !client.archived
    },
    sortByName() {
      this.clients.sort((a, b) => a.name.localeCompare(b.name))
    },
    sortByBalance() {
      this.clients.sort((a, b) => b.balance - a.balance)
    }
  }
})