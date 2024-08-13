import { api } from "@/lib/axios";

export interface SignInBody {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post<{ accessToken: string }>('/auth/login', {
    email,
    password
  })
  return response.data
}