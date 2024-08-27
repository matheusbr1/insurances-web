import { api } from "@/lib/axios";

interface ChangeProducerBody {
  fullName?: string;
  cpfCnpj?: string;
  birthDate?: string;
  identityDocument?: string;
  address?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  position?: string;
  professionalRegistrationNumber?: string;
  operatingSegment?: string;
  operatingRegion?: string;
  contractType?: string;
  contactPreference?: string;
  availableContactHours?: string;
  capturedClientCount?: number;
  capturedInsuranceTypes?: string;
  startOfActivitiesDate?: string;
  generatedBusinessVolume?: number;
  conversionRate?: number;
  signedContract?: boolean;
  certificatesLicenses?: string;
  references?: string;
  additionalNotes?: string;
}

export async function changeProducer(id: number, payload: ChangeProducerBody) {
  try {
    const response = await api.patch(`producers/${id}`, payload);
    if (response.status !== 200) {
      throw new Error('Falha ao atualizar o produtor.');
    }
    // Opcional: Retornar a resposta ou algum dado útil
    return response.data;
  } catch (error) {
    // Tratamento de erros
    console.error('Erro ao atualizar o produtor:', error);
    throw new Error('Erro ao atualizar o produtor. Tente novamente.');
  }
}
