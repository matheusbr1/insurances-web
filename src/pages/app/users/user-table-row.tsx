import { Trash, UserPen } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { User } from '@/api/get-users';
import { UserStatus } from './user-role';
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

interface UserTableRowProps {
  user: User
}

const userForm = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
})

type UserForm = z.infer<typeof userForm>

export function UserTableRow({ user }: UserTableRowProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(userForm),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: ''
    }
  })

  async function handleDeleteUser() {
    try {
      await deleteUser(user.id)

      queryClient.invalidateQueries({
        queryKey: ['users']
      })

      toast.success('Usuário deletado com sucesso!')
    } catch (error) {
      toast.error('Ocorreu um erro ao deletar usuário.')
    }
  }

  async function handleChangeUser({ name, email, password }: UserForm) {
    try {
      let payload: Partial<UserForm> = { name, email }

      if (password) {
        payload = { ...payload, password }
      }

      await changeUser(user.id, payload)

      queryClient.invalidateQueries({
        queryKey: ['users']
      })

      toast.success('Usuário alterado com sucesso!')

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
        {user.id}
      </TableCell>
      <TableCell className="text-muted-foreground" >
        {formatDistanceToNow(user.createdAt, {
          locale: ptBR,
          addSuffix: true
        })}
      </TableCell>
      <TableCell>
        <UserStatus role={user.role} />
      </TableCell>
      <TableCell className="font-medium" >
        {user.name}
      </TableCell>
      <TableCell className="font-medium" >
        {user.email}
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
              <DialogTitle>Alterar usuário</DialogTitle>
              <DialogDescription>Altere alguma informação deste usuário </DialogDescription>
            </DialogHeader>
            <div className="space-y-6" >
              <form className="space-y-4" onSubmit={handleSubmit(handleChangeUser)} >
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
              <AlertDialogTitle>Tem certeza que deseja deletar esse usuário?</AlertDialogTitle>
              <AlertDialogDescription>
                Os dados do usuário {user.name} não poderão ser mais recuperados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="hover:bg-red-800 bg-red-700" >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </TableCell>
    </TableRow>
  )
}