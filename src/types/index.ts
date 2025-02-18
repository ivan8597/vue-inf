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