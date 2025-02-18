import type { Client } from '../types';

export const StorageKeys = {
    CLIENTS: 'clients'
} as const;

export const storage = {
    saveClients(clients: Client[]): void {
        localStorage.setItem(StorageKeys.CLIENTS, JSON.stringify(clients));
    },

    getClients(): Client[] {
        const savedClients = localStorage.getItem(StorageKeys.CLIENTS);
        if (!savedClients) return [];

        const parsedClients = JSON.parse(savedClients);
        return parsedClients.map((client: any) => ({
            ...client,
            createdAt: new Date(client.createdAt),
            updatedAt: new Date(client.updatedAt)
        }));
    }
}; 