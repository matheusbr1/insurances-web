import { Trash, UserPen } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { deleteProduction } from "@/api/production/delete-production";  // Importação correta
import { queryClient } from "@/lib/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeProduction } from "@/api/production/change-production"; // Alterado para `changeProduction`
import axios from "axios";

// Schema de validação com zod
const productionFormSchema = z.object({
  serviceName: z.string().nonempty('Nome do serviço é obrigatório'),
  insuranceCompany: z.string().nonempty('Seguradora é obrigatória'),
  producer: z.string().nonempty('Produtor é obrigatório'),
  coverageStartDate: z.string().nonempty('Data de início da cobertura é obrigatória'),
  coverageEndDate: z.string().nonempty('Data de fim da cobertura é obrigatória'),
  totalCoverageAmount: z.number().nonnegative('Valor total da cobertura é obrigatório'),
  additionalDescription: z.string().optional(),
  aggregatedTo: z.string().optional(),
});

type ProductionForm = z.infer<typeof productionFormSchema>;

interface ProductionTableRowProps {
  production: Production;  // Ajustado para produção
}

export function ProductionTableRow({ production }: ProductionTableRowProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleSubmit, register, formState: { errors, isSubmitting }, reset } = useForm<ProductionForm>({
    resolver: zodResolver(productionFormSchema),
    defaultValues: {
      serviceName: production.serviceName ?? '',
      insuranceCompany: production.insuranceCompany ?? '',
      producer: production.producer ?? '',
      coverageStartDate: production.coverageStartDate ?? '',
      coverageEndDate: production.coverageEndDate ?? '',
      totalCoverageAmount: production.totalCoverageAmount ?? 0,
      additionalDescription: production.additionalDescription ?? '',
      aggregatedTo: production.aggregatedTo ?? '',
    },
  });

  // Função para alterar produção
  async function handleChangeProduction(data: ProductionForm) {
    try {
      await changeProduction(production.id, data);  // Chamada correta
      queryClient.invalidateQueries({ queryKey: ['productions'] });  // Nome ajustado
      toast.success('Produção alterada com sucesso!');
      setIsDetailsDialogOpen(false);
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao alterar a produção');
      } else {
        toast.error('Erro desconhecido ao alterar a produção');
      }
    }
  }

  // Função para deletar produção
  async function handleDeleteProduction() {
    try {
      setIsDeleting(true);
      await deleteProduction(production.id);  // Chamada correta
      queryClient.invalidateQueries({ queryKey: ['productions'] });  // Nome ajustado
      toast.success('Produção deletada com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar a produção');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <TableRow>
      <TableCell>{production.id}</TableCell>
      <TableCell>
        {production.createdAt
          ? formatDistanceToNow(new Date(production.createdAt), { locale: ptBR, addSuffix: true })
          : 'Data indisponível'}
      </TableCell>
      <TableCell>{production.serviceName}</TableCell>
      <TableCell>{production.insuranceCompany}</TableCell>
      <TableCell>{production.producer}</TableCell>
      <TableCell>{production.totalCoverageAmount}</TableCell>

      <TableCell>
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <UserPen className="h-3 w-3 mr-2" />
              Alterar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar produção</DialogTitle>
              <DialogDescription>Altere os dados da produção</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleChangeProduction)}>
              {/* Campos do formulário */}
              <div>
                <Label htmlFor="serviceName">Nome do serviço</Label>
                <Input id="serviceName" {...register('serviceName')} />
                {errors.serviceName && <p className="text-red-600">{errors.serviceName.message}</p>}
              </div>
              <div>
                <Label htmlFor="insuranceCompany">Seguradora</Label>
                <Input id="insuranceCompany" {...register('insuranceCompany')} />
                {errors.insuranceCompany && <p className="text-red-600">{errors.insuranceCompany.message}</p>}
              </div>
              <div>
                <Label htmlFor="producer">Produtor</Label>
                <Input id="producer" {...register('producer')} />
                {errors.producer && <p className="text-red-600">{errors.producer.message}</p>}
              </div>
              <div>
                <Label htmlFor="coverageStartDate">Início da cobertura</Label>
                <Input id="coverageStartDate" type="date" {...register('coverageStartDate')} />
                {errors.coverageStartDate && <p className="text-red-600">{errors.coverageStartDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="coverageEndDate">Fim da cobertura</Label>
                <Input id="coverageEndDate" type="date" {...register('coverageEndDate')} />
                {errors.coverageEndDate && <p className="text-red-600">{errors.coverageEndDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="totalCoverageAmount">Valor total da cobertura</Label>
                <Input id="totalCoverageAmount" type="number" {...register('totalCoverageAmount')} />
                {errors.totalCoverageAmount && <p className="text-red-600">{errors.totalCoverageAmount.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Alterando...' : 'Alterar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="xs" disabled={isDeleting}>
              <Trash className="h-3 w-3 mr-2" />
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar deleção</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja deletar a produção {production.serviceName}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProduction}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
