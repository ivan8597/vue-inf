export interface Client {
  id: number
  name: string
  contact: {
    email: string
    phone: string
  }
  balance: number
  archived: boolean
  address: {
    country: string
    street: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface ClientFormData extends Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number
}

export interface ApiError {
  message: string
  statusCode: number
} 