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
  email: z.string().email().optional(),
  phone: z.string().optional(),
})

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
      email: producer.email,
      phone: producer.phone
    }
  })

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
            <div className="space-y-6" >
              <form className="space-y-4" onSubmit={handleSubmit(handleChangeProducer)} >
                <div className="space-y-2" >
                  <Label htmlFor="fullName" >Nome Completo</Label>
                  <Input id='fullName' type='text' {...register('fullName')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="email" >E-mail</Label>
                  <Input id='email' type='email' {...register('email')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="phone" >Telefone</Label>
                  <Input id='phone' type='text' {...register('phone')} />
                </div>

                <Button
                  type='submit'
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
