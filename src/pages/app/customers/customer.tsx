import React from 'react';
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';
import axios from 'axios';
import { queryClient } from '@/lib/react-query';
import { createCustomer } from '@/api/create-customer';

export const Customer: React.FC = () => {
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
  } = useForm()

  async function onSubmit(data: unknown) {
    try {
      console.log(data)

      await createCustomer(data)

      queryClient.invalidateQueries({
        queryKey: ['customers']
      })

      toast.success('Usuário criado com sucesso!')

      navigate('/app/customers')
    } catch (error) {
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
          toast.error(`Erro ao criar o cliente: ${error.message}`);
        }
      } else {
        toast.error(`Ocorreu um erro ao criar o cliente!`)
      }
    }
  }

  return (
    <>
      <Helmet title="Clientes" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Novo cliente</h1>

          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='secondary' className='mr-2' >
                  Descartar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja descartar o preenchimento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Os dados não poderão ser mais recuperados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate('/app/customers')} className="hover:bg-red-800 bg-red-700" >
                    Descartar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              Salvar cliente
            </Button>
          </div>
        </div>

        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} >
            <input type='submit' hidden />

            <div className='flex flex-col gap-4' >
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6' >
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mb-2' >
                  <p className='font-semibold text-lg' >Dados Pessoais</p>
                </div>

                <div className="space-y-3" >
                  <Label htmlFor="gender" >Sexo</Label>
                  <RadioGroup defaultValue="M" id='gender' className="flex flex-row space-x-4"   >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="r1" />
                      <Label htmlFor="r1">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="r2" />
                      <Label htmlFor="r2">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="name" >Nome</Label>
                  <Input id='name' type='text' {...register('name')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="cpfOrCnpj" >CPF</Label>
                  <Input id='cpfOrCnpj' type='text' {...register('cpfOrCnpj')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="identityDocNumber" >RG</Label>
                  <Input id='identityDocNumber' type='text' {...register('identityDocNumber')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="profession" >Profissão</Label>
                  <Input id='profession' type='text' {...register('profession')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="averageBilling" >Renda</Label>
                  <Input id='averageBilling' type='text' {...register('averageBilling')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="maritalStatus" >Estado Civíl</Label>
                  <Input id='maritalStatus' type='text' {...register('maritalStatus')} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6' >
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mb-2' >
                  <p className='font-semibold text-lg'  >Endereço</p>
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="postalCode" >CEP</Label>
                  <Input id='postalCode' type='text' {...register('postalCode')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="street" >Logradouro</Label>
                  <Input id='street' type='text' {...register('street')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="addressNumber" >Número</Label>
                  <Input id='addressNumber' type='text' {...register('addressNumber')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="password" >Bairro</Label>
                  <Input id='password' type='text' {...register('password')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="city" >Cidade</Label>
                  <Input id='city' type='text' {...register('city')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="state" >Estado</Label>
                  <Input id='state' type='text' {...register('state')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="addressComplement" >Complemento</Label>
                  <Input id='addressComplement' type='text' {...register('addressComplement')} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6' >
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mb-2' >
                  <p className='font-semibold text-lg'  >Contatos</p>
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="phone" >Telefone</Label>
                  <Input id='phone' type='text' {...register('phone')} />
                </div>

                <div className="space-y-2" >
                  <Label htmlFor="email" >E-mail</Label>
                  <Input id='email' type='text' {...register('email')} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
