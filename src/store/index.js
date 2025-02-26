import { defineStore } from 'pinia'

export const useClientStore = defineStore('clients', {
  state: () => ({
    clients: [],
    activeClientId: null
  }),
  actions: {
    toggleArchive(id) {
      const client = this.clients.find(c => c.id === id)
      if (client) {
        client.archived = !client.archived
      }
    },
    sortByName() {
      this.clients.sort((a, b) => a.name.localeCompare(b.name))
    },
    sortByBalance() {
      this.clients.sort((a, b) => b.balance - a.balance)
    }
  }
}) 