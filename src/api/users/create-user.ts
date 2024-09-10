import { api } from "@/lib/axios"

interface CreateUserBody {
  name: string
  email: string
  password: string
}

export async function createUser({ email, name, password }: CreateUserBody) {
  await api.post('users', {
    email,
    name,
    password
  })
}