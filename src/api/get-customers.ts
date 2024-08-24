import { api } from "@/lib/axios";

export interface Customer {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export async function getCustomers() {
  const response = await api.get<Customer[]>('/customer')
  return response.data
}