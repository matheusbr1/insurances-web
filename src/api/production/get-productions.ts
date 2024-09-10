import { api } from "@/lib/axios";
import axios from "axios";

// Definindo a interface para os dados da produção (se precisar tipar os dados de retorno)
interface ProductionData {
  id: number;
  serviceName: string;
  insuranceCompany: string;
  producer: string;
  coverageStartDate: string;
  coverageEndDate: string;
  totalCoverageAmount: number;
  additionalDescription?: string;
  aggregatedTo?: string;
}

// Função para obter a lista de produções
export async function getProductions(): Promise<Production[]> {
  try {
    const response = await api.get('/productions');

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Falha ao obter as produções. Status: ${response.status}`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Exibe o erro da API ou mensagem genérica
      console.error("Erro ao obter as produções:", error.response?.data || error.message);
      throw new Error(`Erro ao obter as produções: ${error.response?.data?.message || error.message}`);
    } else {
      // Lida com erros desconhecidos
      console.error("Erro desconhecido ao obter as produções:", error);
      throw new Error('Erro desconhecido ao obter as produções.');
    }
  }
}
