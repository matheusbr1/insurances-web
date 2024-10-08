import { api } from "@/lib/axios";

interface Profile {
  id: number
  name: string
  email: string
  birthAt: string | null
  role: number
  createdAt: Date
  updatedAt: Date
}

export async function getProfile() {
  const response = await api.post<Profile>('/auth/me')
  return response.data
}