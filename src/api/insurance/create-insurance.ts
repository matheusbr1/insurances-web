
import { api } from "@/lib/axios";

// Defina o tipo que representa os dados do Producer
interface InsuranceData {
  name: string;
  policyNumber: string;
  companyCnpj?: string;
  address?: string;
  mainContact?: string;
  contactPhone?: string;
  contactEmail?: string;
  insuranceTypes?: string[];
  establishmentDate?: string;
  maxCoverageAmount?: number;
  marketRating?: string;
  certificatesLicenses?: string[];
  additionalNotes?: string;
  operatingStatus?: string;
}

export async function createInsurance(data: InsuranceData) {
  try {
    const response = await api.post('/insurance', data);
    if (response.status === 201) { // Verifica se o status é 201 Created
      return response.data;
    } else {
      throw new Error('Falha ao criar a seguradora.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao criar a seguradora:", error.message);
      throw new Error(`Erro ao criar a seguradora: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao criar a seguradora.");
      throw new Error('Erro desconhecido ao criar a seguradora.');
    }
  }
}
