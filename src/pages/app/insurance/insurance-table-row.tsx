import { Trash, UserPen } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { deleteInsurance } from "@/api/insurance/delete-insurance";
import { queryClient } from "@/lib/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Insurance } from "@/api/insurance/get-insurancers";
import { changeInsurance } from "../../../api/insurance/change-insurance";

interface InsuranceTableRowProps {
  insurance: Insurance;
}

// Schema de validação com Zod
const insuranceForm = z.object({
  name: z.string().nonempty("Nome é obrigatório").optional(),
  policyNumber: z.string().nonempty("Número da Apólice é obrigatório").optional(),
  companyCnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").optional(),
  address: z.string().optional(),
  mainContact: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("E-mail inválido").optional(),
  insuranceTypes: z.array(z.string()).optional(),
  establishmentDate: z.union([z.string(), z.date(), z.null()]).optional(),  // Ajustado para aceitar string, Date ou null
  maxCoverageAmount: z.number().optional(),
  marketRating: z.string().optional(),
  certificatesLicenses: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
  operatingStatus: z.string().optional(),
});

type InsuranceForm = z.infer<typeof insuranceForm>;

export function InsuranceTableRow({ insurance }: InsuranceTableRowProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleSubmit, reset, register, formState: { errors, isSubmitting } } = useForm<InsuranceForm>({
    resolver: zodResolver(insuranceForm),
    defaultValues: {
      name: insurance.name ?? '',
      policyNumber: insurance.policyNumber ?? '',
      companyCnpj: insurance.companyCnpj ?? '',
      address: insurance.address ?? '',
      mainContact: insurance.mainContact ?? '',
      contactPhone: insurance.contactPhone ?? '',
      contactEmail: insurance.contactEmail ?? '',
      insuranceTypes: insurance.insuranceTypes ?? [],
      establishmentDate: insurance.establishmentDate ? new Date(insurance.establishmentDate).toISOString() : '',  // Convertido para string ISO
      maxCoverageAmount: insurance.maxCoverageAmount ?? 0,
      marketRating: insurance.marketRating ?? '',
      certificatesLicenses: insurance.certificatesLicenses ?? [],
      additionalNotes: insurance.additionalNotes ?? '',
      operatingStatus: insurance.operatingStatus ?? '',
    },
  });

  // Função para deletar seguro
  async function handleDeleteInsurance() {
    try {
      setIsDeleting(true);
      await deleteInsurance(insurance.id);

      queryClient.invalidateQueries({
        queryKey: ['insurances'],
      });

      toast.success('Seguro deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar seguro:', error);
      toast.error('Ocorreu um erro ao deletar o seguro.');
    } finally {
      setIsDeleting(false);
    }
  }

  // Função para alterar seguro
  async function handleChangeInsurance(data: InsuranceForm) {
    try {
      const insuranceData = {
        id: insurance.id,
        name: data.name ?? '',
        policyNumber: data.policyNumber ?? '',
        companyCnpj: data.companyCnpj ?? '',
        address: data.address ?? '',
        mainContact: data.mainContact ?? '',
        contactPhone: data.contactPhone ?? '',
        contactEmail: data.contactEmail ?? '',
        insuranceTypes: data.insuranceTypes ?? [],
        establishmentDate: data.establishmentDate ? data.establishmentDate.toString() : undefined, // Convertendo null para undefined
        maxCoverageAmount: data.maxCoverageAmount ?? 0,
        marketRating: data.marketRating ?? '',
        certificatesLicenses: data.certificatesLicenses ?? [],
        additionalNotes: data.additionalNotes ?? '',
        operatingStatus: data.operatingStatus ?? ''
      };
      
      await changeInsurance(insuranceData);

      queryClient.invalidateQueries({
        queryKey: ['insurances'],
      });

      toast.success('Seguro alterado com sucesso!');
      setIsDetailsDialogOpen(false);
      reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.statusText;
        toast.error(errorMessage);
      } else {
        toast.error('Ocorreu um erro ao alterar o seguro.');
      }
    }
  }

  return (
    <TableRow>
    <TableCell className="font-mono text-sm font-medium">
      {insurance.id}
    </TableCell>
    <TableCell className="text-muted-foreground">
      {insurance.createdAt
        ? formatDistanceToNow(new Date(insurance.createdAt), {
            locale: ptBR,
            addSuffix: true,
          })
        : 'Data indisponível'}
    </TableCell>
    <TableCell>
      {insurance.operatingStatus || 'Status indisponível'}
    </TableCell>
    <TableCell className="font-medium">{insurance.name}</TableCell>
    <TableCell className="font-medium">{insurance.contactEmail}</TableCell>
    <TableCell className="font-medium">{insurance.policyNumber}</TableCell>
    <TableCell>{insurance.maxCoverageAmount}</TableCell>
    <TableCell>{insurance.companyCnpj}</TableCell>
    <TableCell>{insurance.address}</TableCell> 
    <TableCell>{insurance.mainContact}</TableCell> 
  
    {/* Caixa de Diálogo de Alteração */}
    <TableCell>
    <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
  <DialogTrigger asChild>
    <Button className="w-[100%]" variant="outline" size="xs" disabled={isSubmitting}>
      <UserPen className="h-3 w-3 mr-2" />
      {isSubmitting ? 'Alterando...' : 'Alterar'}
    </Button>
  </DialogTrigger>

  {/* Adicionando a classe de rolagem ao DialogContent */}
  <DialogContent className="dialog-content-scrollable">
    <DialogHeader>
      <DialogTitle>Alterar seguro</DialogTitle>
      <DialogDescription>Altere alguma informação deste seguro</DialogDescription>
    </DialogHeader>

    {/* Formulário com todos os campos */}
    <form onSubmit={handleSubmit(handleChangeInsurance)}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <span className="text-red-600">{errors.name.message}</span>}
      </div>

      <div>
        <Label htmlFor="policyNumber">Número da Apólice</Label>
        <Input id="policyNumber" {...register('policyNumber')} />
        {errors.policyNumber && <span className="text-red-600">{errors.policyNumber.message}</span>}
      </div>

      <div>
        <Label htmlFor="companyCnpj">CNPJ da Empresa</Label>
        <Input id="companyCnpj" {...register('companyCnpj')} />
        {errors.companyCnpj && <span className="text-red-600">{errors.companyCnpj.message}</span>}
      </div>

      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" {...register('address')} />
        {errors.address && <span className="text-red-600">{errors.address.message}</span>}
      </div>

      <div>
        <Label htmlFor="mainContact">Contato Principal</Label>
        <Input id="mainContact" {...register('mainContact')} />
        {errors.mainContact && <span className="text-red-600">{errors.mainContact.message}</span>}
      </div>

      <div>
        <Label htmlFor="contactPhone">Telefone de Contato</Label>
        <Input id="contactPhone" {...register('contactPhone')} />
        {errors.contactPhone && <span className="text-red-600">{errors.contactPhone.message}</span>}
      </div>

      <div>
        <Label htmlFor="contactEmail">E-mail de Contato</Label>
        <Input id="contactEmail" type="email" {...register('contactEmail')} />
        {errors.contactEmail && <span className="text-red-600">{errors.contactEmail.message}</span>}
      </div>

      <div>
        <Label htmlFor="insuranceTypes">Tipos de Seguros</Label>
        <Input id="insuranceTypes" {...register('insuranceTypes')} />
        {errors.insuranceTypes && <span className="text-red-600">{errors.insuranceTypes.message}</span>}
      </div>

      <div>
        <Label htmlFor="establishmentDate">Data de Estabelecimento</Label>
        <Input id="establishmentDate" type="date" {...register('establishmentDate')} />
        {errors.establishmentDate && <span className="text-red-600">{errors.establishmentDate.message}</span>}
      </div>

      <div>
        <Label htmlFor="maxCoverageAmount">Cobertura Máxima</Label>
        <Input id="maxCoverageAmount" type="number" {...register('maxCoverageAmount')} />
        {errors.maxCoverageAmount && <span className="text-red-600">{errors.maxCoverageAmount.message}</span>}
      </div>

      <div>
        <Label htmlFor="marketRating">Classificação de Mercado</Label>
        <Input id="marketRating" {...register('marketRating')} />
        {errors.marketRating && <span className="text-red-600">{errors.marketRating.message}</span>}
      </div>

      <div>
        <Label htmlFor="certificatesLicenses">Certificados/Licenças</Label>
        <Input id="certificatesLicenses" {...register('certificatesLicenses')} />
        {errors.certificatesLicenses && <span className="text-red-600">{errors.certificatesLicenses.message}</span>}
      </div>

      <div>
        <Label htmlFor="additionalNotes">Notas Adicionais</Label>
        <Input id="additionalNotes" {...register('additionalNotes')} />
        {errors.additionalNotes && <span className="text-red-600">{errors.additionalNotes.message}</span>}
      </div>

      <div>
        <Label htmlFor="operatingStatus">Status Operacional</Label>
        <Input id="operatingStatus" {...register('operatingStatus')} />
        {errors.operatingStatus && <span className="text-red-600">{errors.operatingStatus.message}</span>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Alterando...' : 'Alterar'}
      </Button>
    </form>
  </DialogContent>
</Dialog>

    </TableCell>
  
    {/* Caixa de Diálogo de Exclusão */}
    <TableCell>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-[100%]"
            variant="outline"
            size="xs"
            disabled={isDeleting}
          >
            <Trash className="h-3 w-3 mr-2" />
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar esse seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados do seguro {insurance.name} não poderão ser mais
              recuperados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInsurance}
              className="hover:bg-red-800 bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableCell>
  </TableRow>
  
  
  );
}
