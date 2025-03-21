import { defineStore } from 'pinia'
import axios from 'axios'
import type { Client } from '../types'

const API_URL = 'http://localhost:8000/api'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[]
  }),
  
  actions: {
    async getClients() {
      const response = await axios.get(`${API_URL}/clients`)
      return response.data
    },

    async addClient(client: Client) {
      const response = await axios.post(`${API_URL}/clients`, client)
      return response.data
    },
    
    async updateClient(id: number, client: Client) {
      const response = await axios.put(`${API_URL}/clients/${id}`, client)
      return response.data
    },

    async deleteClient(id: number) {
      const response = await axios.delete(`${API_URL}/clients/${id}`)
      return response.data
    }
  }
})

