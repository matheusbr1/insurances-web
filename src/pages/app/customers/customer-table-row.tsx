import { Trash, UserPen } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { deleteUser } from "@/api/delete-user";
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
import { changeUser } from "@/api/change-user";
import axios from "axios";

interface CustomerTableRowProps {
  customer: Any
}

const customerForm = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
})

type CustomerForm = z.infer<typeof customerForm>

export function CustomerTableRow({ customer }: CustomerTableRowProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(customerForm),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      password: ''
    }
  })

  async function handleDeleteCustomer() {
    try {
      await deleteUser(customer.id)

      queryClient.invalidateQueries({
        queryKey: ['customers']
      })

      toast.success('Cliente deletado com sucesso!')
    } catch (error) {
      toast.error('Ocorreu um erro ao deletar Cliente.')
    }
  }

  async function handleChangeCustomer({ name, email, password }: CustomerForm) {
    try {
      let payload: Partial<CustomerForm> = { name, email }

      if (password) {
        payload = { ...payload, password }
      }

      await changeUser(customer.id, payload)

      queryClient.invalidateQueries({
        queryKey: ['customers']
      })

      toast.success('Cliente alterado com sucesso!')

      setIsDetailsDialogOpen(false)

      reset()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          const errorMessage = error.response.data?.message || error.response.statusText;
          toast.error(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          toast.error('Nenhuma resposta do servidor. Verifique sua conexão.');
        } else {
          // Something else happened while setting up the request
          toast.error(`Erro ao alterar o usuário: ${error.message}`);
        }
      } else {
        toast.error(`Ocorreu um erro ao alterar o usuário!`)
      }
    }
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-sm font-medium" >
        {customer.id}
      </TableCell>
      <TableCell className="text-muted-foreground" >
        {formatDistanceToNow(customer.createdAt, {
          locale: ptBR,
          addSuffix: true
        })}
      </TableCell>
      <TableCell>
        {customer.status}
      </TableCell>
      <TableCell className="font-medium" >
        {customer.name}
      </TableCell>
      <TableCell className="font-medium" >
        {customer.email}
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
              <DialogTitle>Alterar cliente</DialogTitle>
              <DialogDescription>Altere alguma informação deste cliente </DialogDescription>
            </DialogHeader>
            <div className="space-y-6" >
              <form className="space-y-4" onSubmit={handleSubmit(handleChangeCustomer)} >
                <div className="space-y-2" >
                  <Label htmlFor="name" >Nome</Label>
                  <Input id='name' type='text' {...register('name')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="email" >E-mail</Label>
                  <Input id='email' type='email' {...register('email')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="password" >Senha</Label>
                  <Input id='password' type='password' {...register('password')} />
                </div>

                <Button
                  type='submit'
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Criando...' : 'Criar'}
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
              <AlertDialogTitle>Tem certeza que deseja deletar esse cliente?</AlertDialogTitle>
              <AlertDialogDescription>
                Os dados do usuário {customer.name} não poderão ser mais recuperados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCustomer} className="hover:bg-red-800 bg-red-700" >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </TableCell>
    </TableRow>
  )
}