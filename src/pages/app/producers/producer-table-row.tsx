import { Trash, UserPen } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { deleteProducer } from "@/api/delete-producer";
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeProducer } from "@/api/change-producer";
import axios from "axios";
import { Producer } from "@/api/get-producers";

interface ProducerTableRowProps {
  producer: Producer
}

const producerForm = z.object({
  fullName: z.string().optional(),
  cpfCnpj: z.string().optional(),
  birthDate: z.string().optional(),
  identityDocument: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  companyName: z.string().optional(),
  position: z.string().optional(),
  professionalRegistrationNumber: z.string().optional(),
  operatingSegment: z.string().optional(),
  operatingRegion: z.string().optional(),
  contractType: z.string().optional(),
  contactPreference: z.string().optional(),
  availableContactHours: z.string().optional(),
  capturedClientCount: z.number().optional(),
  capturedInsuranceTypes: z.string().optional(),
  startOfActivitiesDate: z.string().optional(),
  generatedBusinessVolume: z.number().optional(),
  conversionRate: z.number().optional(),
  signedContract: z.string().optional(),
  certificatesLicenses: z.string().optional(),
  references: z.string().optional(),
  additionalNotes: z.string().optional(),
  registrationDate: z.string().optional(),
  registrationResponsible: z.string().optional(),
});


type ProducerForm = z.infer<typeof producerForm>

export function ProducerTableRow({ producer }: ProducerTableRowProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(producerForm),
    defaultValues: {
      fullName: producer.fullName,
      cpfCnpj: producer.cpfCnpj,
      birthDate: producer.birthDate,
      identityDocument: producer.identityDocument,
      address: producer.address,
      phone: producer.phone,
      email: producer.email,
      companyName: producer.companyName,
      position: producer.position,
      professionalRegistrationNumber: producer.professionalRegistrationNumber,
      operatingSegment: producer.operatingSegment,
      operatingRegion: producer.operatingRegion,
      contractType: producer.contractType,
      contactPreference: producer.contactPreference,
      availableContactHours: producer.availableContactHours,
      capturedClientCount: producer.capturedClientCount,
      capturedInsuranceTypes: producer.capturedInsuranceTypes,
      startOfActivitiesDate: producer.startOfActivitiesDate,
      generatedBusinessVolume: producer.generatedBusinessVolume,
      conversionRate: producer.conversionRate,
      signedContract: producer.signedContract,
      certificatesLicenses: producer.certificatesLicenses,
      references: producer.references,
      additionalNotes: producer.additionalNotes,
      registrationDate: producer.registrationDate,
      registrationResponsible: producer.registrationResponsible
    }
  });
  

  async function handleDeleteProducer() {
    try {
      await deleteProducer(producer.id)

      queryClient.invalidateQueries({
        queryKey: ['producers']
      })

      toast.success('Produtor deletado com sucesso!')
    } catch (error) {
      toast.error('Ocorreu um erro ao deletar o produtor.')
    }
  }

  async function handleChangeProducer({ fullName, email, phone }: ProducerForm) {
    try {
      let payload: Partial<ProducerForm> = { fullName, email, phone };

      await changeProducer(producer.id, payload)

      queryClient.invalidateQueries({
        queryKey: ['producers']
      })

      toast.success('Produtor alterado com sucesso!')

      setIsDetailsDialogOpen(false)

      reset()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data?.message || error.response.statusText;
          toast.error(errorMessage);
        } else if (error.request) {
          toast.error('Nenhuma resposta do servidor. Verifique sua conexão.');
        } else {
          toast.error(`Erro ao alterar o produtor: ${error.message}`);
        }
      } else {
        toast.error(`Ocorreu um erro ao alterar o produtor!`)
      }
    }
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-sm font-medium" >
        {producer.id}
      </TableCell>
      <TableCell className="text-muted-foreground" >
        {formatDistanceToNow(producer.createdAt, {
          locale: ptBR,
          addSuffix: true
        })}
      </TableCell>
      <TableCell className="font-medium" >
        {producer.fullName}
      </TableCell>
      <TableCell className="font-medium" >
        {producer.email}
      </TableCell>
      <TableCell>
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogTrigger asChild >
            <Button
              className='w-[100%]'
              variant='outline'
              size='xs'
            >
              <UserPen className="h-3 w-3 mr-2" />
              Alterar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar produtor</DialogTitle>
              <DialogDescription>Altere alguma informação deste produtor </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
  <form className="space-y-4" onSubmit={handleSubmit(handleChangeProducer)}>
    <div className="space-y-2">
      <Label htmlFor="fullName">Nome Completo</Label>
      <Input id="fullName" type="text" {...register('fullName')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
      <Input id="cpfCnpj" type="text" {...register('cpfCnpj')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="birthDate">Data de Nascimento</Label>
      <Input id="birthDate" type="date" {...register('birthDate')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="identityDocument">Documento de Identidade</Label>
      <Input id="identityDocument" type="text" {...register('identityDocument')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="address">Endereço</Label>
      <Input id="address" type="text" {...register('address')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="phone">Telefone</Label>
      <Input id="phone" type="text" {...register('phone')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">E-mail</Label>
      <Input id="email" type="email" {...register('email')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="companyName">Nome da Empresa</Label>
      <Input id="companyName" type="text" {...register('companyName')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="position">Cargo</Label>
      <Input id="position" type="text" {...register('position')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="professionalRegistrationNumber">Número de Registro Profissional</Label>
      <Input id="professionalRegistrationNumber" type="text" {...register('professionalRegistrationNumber')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="operatingSegment">Segmento de Atuação</Label>
      <Input id="operatingSegment" type="text" {...register('operatingSegment')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="operatingRegion">Região de Atuação</Label>
      <Input id="operatingRegion" type="text" {...register('operatingRegion')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="contractType">Tipo de Contrato</Label>
      <Input id="contractType" type="text" {...register('contractType')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="contactPreference">Preferência de Contato</Label>
      <Input id="contactPreference" type="text" {...register('contactPreference')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="availableContactHours">Horário Disponível para Contato</Label>
      <Input id="availableContactHours" type="text" {...register('availableContactHours')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="capturedClientCount">Número de Clientes Capturados</Label>
      <Input id="capturedClientCount" type="number" {...register('capturedClientCount')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="capturedInsuranceTypes">Tipos de Seguros Capturados</Label>
      <Input id="capturedInsuranceTypes" type="text" {...register('capturedInsuranceTypes')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="startOfActivitiesDate">Data de Início das Atividades</Label>
      <Input id="startOfActivitiesDate" type="date" {...register('startOfActivitiesDate')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="generatedBusinessVolume">Volume de Negócios Gerado</Label>
      <Input id="generatedBusinessVolume" type="number" {...register('generatedBusinessVolume')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="conversionRate">Taxa de Conversão</Label>
      <Input id="conversionRate" type="number" {...register('conversionRate')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="signedContract">Contrato Assinado</Label>
      <Input id="signedContract" type="text" {...register('signedContract')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="certificatesLicenses">Certificados e Licenças</Label>
      <Input id="certificatesLicenses" type="text" {...register('certificatesLicenses')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="references">Referências</Label>
      <Input id="references" type="text" {...register('references')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="additionalNotes">Notas Adicionais</Label>
      <Input id="additionalNotes" type="text" {...register('additionalNotes')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="registrationDate">Data de Registro</Label>
      <Input id="registrationDate" type="date" {...register('registrationDate')} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="registrationResponsible">Responsável pelo Registro</Label>
      <Input id="registrationResponsible" type="text" {...register('registrationResponsible')} />
    </div>

    <Button
      type="submit"
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Alterando...' : 'Alterar'}
    </Button>
  </form>
</div>

          </DialogContent>
        </Dialog>

      </TableCell>
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className='w-[100%]'
              variant='outline'
              size='xs'
              disabled={false}
            >
              <Trash className="h-3 w-3 mr-2" />
              Deletar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja deletar esse produtor?</AlertDialogTitle>
              <AlertDialogDescription>
                Os dados do produtor {producer.fullName} não poderão ser mais recuperados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProducer} className="hover:bg-red-800 bg-red-700" >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </TableCell>
    </TableRow>
  )
}
