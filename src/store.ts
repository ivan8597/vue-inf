import { defineStore } from 'pinia';

export interface Address {
    country: string;
    postalCode: string;
    street: string;
    office: string;
}

export interface Contact {
    phone: string;
    email: string;
}

export interface Client {
    id: number;
    name: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    address: Address;
    contact: Contact;
}

export const useClientStore = defineStore('clients', {
    state: () => ({
        clients: [] as Client[],
        nextId: 1,
        activeClientId:null as null | number
    }),
    actions: {
        addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
            const newClient = { ...client, id: this.nextId++, createdAt: new Date(), updatedAt: new Date() };
            this.clients.push(newClient);
        },
        editClient(id: number, updatedClient: Partial<Omit<Client, 'id' | 'createdAt'>>) {
            const client = this.clients.find(client => client.id === id);
            if (client) {
                Object.assign(client, updatedClient);//обновляет свойства найденного клиента, копируя значения из updatedClient в client
                client.updatedAt = new Date();
            }
        },
        setActiveClientId(id:number){//функция чтобы отслеживать, какой клиент в данный момент редактируется 
          this.activeClientId=id
        },
        toggleArchive(id: number) {//функция для переключения состояния архивирования конкретного клиента
            const client = this.clients.find(client => client.id === id);
            if (client) {
                client.archived = !client.archived;
            }
        },
        sortClientsByName() {// функция сортировки по имени
            this.clients.sort((a, b) => a.name.localeCompare(b.name));
        },
        sortClientsByBalance() {//функция сортировки по балансу
            this.clients.sort((a, b) => a.balance - b.balance);
        },
        searchClients(query: string) {//функция позволяет пользователю находить клиентов в поиске по имени, адресу, телефону или электронной почте
            return this.clients.filter(client =>
                client.name.includes(query) ||
                client.address.street.includes(query) ||
                client.contact.phone.includes(query) ||
                client.contact.email.includes(query)
            );
        },
    },
});
