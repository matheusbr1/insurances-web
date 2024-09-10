import { getUsers } from "@/api/users/get-users";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { UserTableRow } from "./user-table-row";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/api/get-profile";
import { isAdmin } from "@/utils/isAdmin";
import { useNavigate } from "react-router-dom";
import { UserTableSkeleton } from "./user-table-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/api/users/create-user";
import axios from "axios";
import { queryClient } from "@/lib/react-query";

const userForm = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type UserForm = z.infer<typeof userForm>

export const Users: React.FC = () => {
  const navigate = useNavigate()

  const [isCreateNewUserDialogOpen, setIsCreateNewUserDialogOpen] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(userForm),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const { data: profile, status } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity
  })

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    staleTime: Infinity,
    queryFn: getUsers
  })

  useEffect(() => {
    if (!isAdmin(Number(profile?.role)) && status === 'success') {
      navigate('/app')
    }
  }, [navigate, profile, status])

  async function handleCreateUser({ name, email, password }: UserForm) {
    try {
      await createUser({
        email,
        name,
        password
      })

      queryClient.invalidateQueries({
        queryKey: ['users']
      })

      toast.success('Usuário criado com sucesso!')

      reset()

      setIsCreateNewUserDialogOpen(false)
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
          toast.error(`Erro ao criar o usuário: ${error.message}`);
        }
      } else {
        toast.error(`Ocorreu um erro ao criar o usuário!`)
      }
    }
  }

  return (
    <>
      <Helmet title="Usuários" />
      <div className="flex flex-col gap-4"  >
        <div className="flex justify-between w-full mb-2" >
          <h1 className="text-2xl font-bold tracking-tight" >Usuários</h1>

          <Dialog open={isCreateNewUserDialogOpen} onOpenChange={setIsCreateNewUserDialogOpen}>
            <DialogTrigger asChild >
              <Button
                onClick={() => setIsCreateNewUserDialogOpen(true)}
                variant='default'
                disabled={isLoadingUsers}
              >
                Novo usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo usuário</DialogTitle>
                <DialogDescription>Crie um novo usuário para o seu colaborador</DialogDescription>
              </DialogHeader>
              <div className="space-y-6" >
                <form className="space-y-4" onSubmit={handleSubmit(handleCreateUser)} >
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
        </div>

        <div className="space-y-2.5" >
          <div className="border rounded-md" >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]" >Identificador</TableHead>
                  <TableHead className="w-[180px]" >Criado há</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead className="w-[128px]" ></TableHead>
                  <TableHead className="w-[128px]" ></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers && <UserTableSkeleton />}
                {users && users.map(user => {
                  return (
                    <UserTableRow key={user.id} user={user} />
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}