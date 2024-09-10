import { api } from "@/lib/axios";

// Interface expandida para incluir todos os campos
export interface Producer {
  id: number;
  fullName: string;
  email: string;
  cpfCnpj: string;
  address: string;
  phone: string;
  birthDate?: string;
  identityDocument?: string;
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
  registrationDate?: string;
  registrationResponsible?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getProducers(): Promise<Producer[]> {
  try {
    const response = await api.get<Producer[]>('/producer');
    if (response.status === 200) { // Verifica se o status é 200 OK
      return response.data;
    } else {
      console.error(`Falha ao obter produtores. Status: ${response.status}`);
      throw new Error(`Falha ao obter produtores. Status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao obter produtores:", error.message);
      throw new Error(`Erro ao obter produtores: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao obter produtores.");
      throw new Error("Erro desconhecido ao obter produtores.");
    }
  }
}
