import { api } from "@/lib/axios"

export async function deleteCustomer(id: number) {
  await api.delete(`customer/${id}`)
}