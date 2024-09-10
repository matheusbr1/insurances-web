
import { api } from "@/lib/axios";

// Definindo a interface para o produtor
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

export async function changeInsurance(data: InsuranceData) {
  try {
    const response = await api.post('insurance', data);
    if (response.status === 200 || response.status === 201) {
      console.log("Seguro alterado com sucesso!");
    } else {
      throw new Error(`Falha ao alterar o seguro. Status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao alterar a seguradora:', error.message);
      throw new Error(`Erro ao alterar a seguradora: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao alterar a seguradora.");
      throw new Error('Erro desconhecido ao alterar a seguradora.');
    }
  }
}
