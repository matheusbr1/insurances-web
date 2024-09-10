
import { api } from "@/lib/axios";

export async function deleteInsurance(id: number) {
  try {
    const response = await api.delete(`/insurance/${id}`);
    if (response.status === 200) {
      console.log(`Seguro com ID ${id} foi deletado com sucesso.`);
    } else {
      console.error(`Falha ao deletar o seguro com ID ${id}. Status: ${response.status}`);
      throw new Error(`Falha ao deletar o seguro com ID ${id}.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro ao deletar o seguro com ID ${id}: ${error.message}`);
      throw new Error(`Erro ao deletar o seguro com ID ${id}: ${error.message}`);
    } else {
      console.error(`Erro desconhecido ao deletar o seguro com ID ${id}.`);
      throw new Error(`Erro desconhecido ao deletar o seguro com ID ${id}.`);
    }
  }
}
