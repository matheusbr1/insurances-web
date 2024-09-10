import { api } from "@/lib/axios";
import axios from "axios";

// Função para deletar uma produção
export async function deleteProduction(id: number) {
  try {
    const response = await api.delete(`/production/${id}`);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Falha ao deletar a produção. Status: ${response.status}`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Exibe o erro da API ou mensagem genérica
      console.error("Erro ao deletar a produção:", error.response?.data || error.message);
      throw new Error(`Erro ao deletar a produção: ${error.response?.data?.message || error.message}`);
    } else {
      // Lida com erros desconhecidos
      console.error("Erro desconhecido ao deletar a produção:", error);
      throw new Error('Erro desconhecido ao deletar a produção.');
    }
  }
}
