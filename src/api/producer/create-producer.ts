import { api } from "@/lib/axios";

// Defina o tipo que representa os dados do Producer
interface ProducerData {
  id?: string; // Removido como opcional se a API gerar automaticamente
  fullName: string;
  cpfCnpj: string;
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
  registrationDate?: string;
  registrationResponsible?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function createProducer(data: ProducerData) {
  try {
    const response = await api.post('/producer', data);
    if (response.status === 201) { // Verifica se o status é 201 Created
      return response.data;
    } else {
      throw new Error('Falha ao criar o produtor.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao criar o produtor:", error.message);
      throw new Error(`Erro ao criar o produtor: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao criar o produtor.");
      throw new Error('Erro desconhecido ao criar o produtor.');
    }
  }
}
