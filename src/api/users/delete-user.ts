import { api } from "@/lib/axios"

export async function deleteUser(id: number) {
  await api.delete(`users/${id}`)
}