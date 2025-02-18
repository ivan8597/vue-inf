import { defineStore } from 'pinia';
import type { Client } from './types';
import { storage } from './utils/storage';

export const useClientStore = defineStore('clients', {
    state: () => ({
        clients: [] as Client[],
        activeClientId: null as number | null,
    }),
    
    getters: {
        getClientById: (state) => (id: number) => 
            state.clients.find(client => client.id === id),
            
        sortedClients: (state) => [...state.clients].sort((a, b) => 
            b.updatedAt.getTime() - a.updatedAt.getTime()
        ),
    },

    actions: {
        initializeStore() {
            this.clients = storage.getClients();
        },

        addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
            const maxId = Math.max(0, ...this.clients.map(c => c.id));
            const newClient: Client = {
                ...client,
                id: maxId + 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            this.clients.push(newClient);
            storage.saveClients(this.clients);
        },

        updateClient(updatedClient: Client) {
            const index = this.clients.findIndex(c => c.id === updatedClient.id);
            if (index !== -1) {
                this.clients[index] = {
                    ...updatedClient,
                    updatedAt: new Date()
                };
                storage.saveClients(this.clients);
            }
        },

        deleteClient(id: number) {
            const index = this.clients.findIndex(c => c.id === id);
            if (index !== -1) {
                this.clients.splice(index, 1);
                storage.saveClients(this.clients);
            }
        },

        toggleArchive(id: number) {
            const client = this.getClientById(id);
            if (client) {
                client.archived = !client.archived;
                client.updatedAt = new Date();
                storage.saveClients(this.clients);
            }
        },

        sortClientsByName() {
            this.clients.sort((a, b) => 
                a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'ru')
            );
            storage.saveClients(this.clients);
        },

        sortClientsByBalance() {
            this.clients.sort((a, b) => {
                const balanceDiff = b.balance - a.balance;
                return balanceDiff || a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'ru');
            });
            storage.saveClients(this.clients);
        },

        searchClients(query: string) {
            const searchTerm = query.toLowerCase();
            return this.clients.filter(client => 
                client.name.toLowerCase().includes(searchTerm) ||
                client.address.street.toLowerCase().includes(searchTerm) ||
                client.contact.phone.includes(searchTerm) ||
                client.contact.email.toLowerCase().includes(searchTerm)
            );
        },
    },
});
