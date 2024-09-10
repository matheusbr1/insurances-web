import { api } from "@/lib/axios";
import axios from "axios";

// Definindo a interface para os dados da produção
interface ProductionData {
  serviceName: string; // Nome do serviço
  insuranceCompany: string; // Seguradora
  producer: string; // Produtor
  coverageStartDate: string; // Data de início da cobertura
  coverageEndDate: string; // Data de fim da cobertura
  totalCoverageAmount: number; // Valor total da cobertura
  additionalDescription?: string; // Descrição adicional
  aggregatedTo?: string; // Agregado a
}

export async function createProduction(data: ProductionData) {
  try {
    const response = await api.post('/production', data);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Falha ao criar a produção. Status: ${response.status}`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Exibe o erro da API ou mensagem genérica
      console.error("Erro ao criar a produção:", error.response?.data || error.message);
      throw new Error(`Erro ao criar a produção: ${error.response?.data?.message || error.message}`);
    } else {
      // Lida com erros desconhecidos
      console.error("Erro desconhecido ao criar a produção:", error);
      throw new Error('Erro desconhecido ao criar a produção.');
    }
  }
}
