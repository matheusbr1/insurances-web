import { api } from "@/lib/axios";

export interface GetProfileResponse {
  id: string
  name: string
  email: string
  birthAt: string | null
  role: number
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getProfile() {
  const response = await api.post<GetProfileResponse>('/auth/me')
  return response.data
}