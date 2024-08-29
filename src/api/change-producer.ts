import { api } from "@/lib/axios"

// Definindo a interface para o produtor
interface ProducerData {
  fullName: string
  cpfCnpj: string
  birthDate: string
  identityDocument?: string
  address?: string
  phone?: string
  email?: string
  companyName?: string
  position?: string
  professionalRegistrationNumber?: string
  operatingSegment?: string
  operatingRegion?: string
  contractType?: string
  contactPreference?: string
  availableContactHours?: string
  capturedClientCount?: number
  capturedInsuranceTypes?: string[]
  startOfActivitiesDate?: string
  generatedBusinessVolume?: number
  conversionRate?: number
  signedContract?: boolean
  certificatesLicenses?: string[]
  references?: string[]
  additionalNotes?: string
  registrationDate?: string
  registrationResponsible?: string
}

export async function changeUser(data: ProducerData) {
  try {
    console.log(data)
    await api.post('producer', data)
  } catch (error) {
    console.error('Erro ao criar produtor:', error)
    // Aqui você pode adicionar um tratamento adicional, como mostrar uma notificação para o usuário
  }
}
