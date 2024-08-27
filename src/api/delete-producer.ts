import { api } from "@/lib/axios";

export async function deleteProducer(id: number): Promise<void> {
  try {
    const response = await api.delete(`/producer/${id}`);
    if (response.status === 200) { // Verifica se o status é 200 OK
      console.log(`Produtor com ID ${id} foi deletado com sucesso.`);
    } else {
      console.error(`Falha ao deletar o produtor com ID ${id}. Status: ${response.status}`);
      throw new Error(`Falha ao deletar o produtor com ID ${id}.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro ao deletar o produtor com ID ${id}: ${error.message}`);
      throw new Error(`Erro ao deletar o produtor com ID ${id}: ${error.message}`);
    } else {
      console.error(`Erro desconhecido ao deletar o produtor com ID ${id}.`);
      throw new Error(`Erro desconhecido ao deletar o produtor com ID ${id}.`);
    }
  }
}
