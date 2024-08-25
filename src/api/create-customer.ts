import { api } from "@/lib/axios"

export async function createCustomer(data: unknown) {
  await api.post('customer', data)
}