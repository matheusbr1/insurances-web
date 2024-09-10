
import { api } from "@/lib/axios";

// Interface expandida para incluir todos os campos
export interface Insurance {
  id: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export async function getInsurance(): Promise<Insurance[]> {
  try {
    const response = await api.get<Insurance[]>('/insurance');
    if (response.status === 200) { // Verifica se o status é 200 OK
      return response.data;
    } else {
      console.error(`Falha ao obter seguradoras. Status: ${response.status}`);
      throw new Error(`Falha ao obter seguradoras. Status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao obter seguradora:", error.message);
      throw new Error(`Erro ao obter seguradora: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao obter seguradora.");
      throw new Error("Erro desconhecido ao obter segurado.");
    }
  }
}
