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
    console.log('Dados enviados:', data)
    
    const response = await api.post('producer', data)
    
    if (response.status === 200 || response.status === 201) {
      console.log('Produtor alterado com sucesso!', response.data)
      // Aqui você pode adicionar um toast para notificar o usuário sobre o sucesso
    } else {
      throw new Error(`Erro ao alterar produtor. Status: ${response.status}`)
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Erro da API:', error.response.data)
      // Notificar o usuário com a mensagem de erro retornada pela API
    } else if (error.request) {
      console.error('Nenhuma resposta da API. Verifique sua conexão:', error.request)
    } else {
      console.error('Erro desconhecido ao alterar produtor:', error.message)
    }
    // Mostrar um toast ou notificação para o usuário informando que houve um erro
  }
}
