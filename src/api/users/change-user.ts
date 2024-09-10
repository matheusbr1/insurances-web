import { api } from "@/lib/axios"

interface CreateUserBody {
  name?: string
  email?: string
  password?: string
}

export async function changeUser(id: number, payload: CreateUserBody) {
  await api.patch(`users/${id}`, payload)
}