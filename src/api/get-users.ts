import { api } from "@/lib/axios";

export interface User {
  id: number
  name: string
  email: string
  birthAt: string | null
  role: number
  createdAt: Date
  updatedAt: Date
}

export async function getUsers() {
  const response = await api.get<User[]>('/users')
  return response.data
}