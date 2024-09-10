import { api } from "@/lib/axios";

// Definindo a interface para o serviço
interface ServiceData {
  serviceName: string;
  insuranceCompany: string;
  producer: string;
  coverageStartDate: string;
  coverageEndDate: string;
  totalCoverageAmount: number;
  additionalDescription?: string;
  aggregatedTo?: string;
}

export async function changeProduction(id: number, data: ServiceData) {
  try {
    const response = await api.put(`/service/${id}`, data);
    
    if (response.status >= 200 && response.status < 300) {
      console.log("Serviço alterado com sucesso!");
      return response.data; // Retorna a resposta para reutilização
    } else {
      throw new Error(`Falha ao alterar o serviço. Status: ${response.status}`);
    }
  } catch (error: any) {
    if (error.response) {
      // Erro da API, com mensagem detalhada
      console.error('Erro da API:', error.response.data);
      throw new Error(`Erro ao alterar o serviço: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      // Erro de conexão ou ausência de resposta
      console.error('Nenhuma resposta recebida da API. Verifique sua conexão:', error.request);
      throw new Error('Erro de conexão ao alterar o serviço.');
    } else {
      // Outros tipos de erros
      console.error('Erro desconhecido ao alterar o serviço:', error.message);
      throw new Error('Erro desconhecido ao alterar o serviço.');
    }
  }
}
