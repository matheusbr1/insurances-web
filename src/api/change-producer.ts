import { api } from "@/lib/axios"

export async function createProducer(data: unknown) {
  console.log(data)
  await api.post('producer', data)
}