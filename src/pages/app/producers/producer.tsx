import React from 'react';
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import axios from 'axios';
import { queryClient } from '@/lib/react-query';
import { createProducer } from '@/api/create-producer';


export const Producer: React.FC = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
  } = useForm();

  async function onSubmit(data: unknown) {
    try {
      console.log(data)
      await createProducer(data);


      queryClient.invalidateQueries({
        queryKey: ['producers']
      });

      toast.success('Produtor criado com sucesso!');

      navigate('/app/producers');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data?.message || error.response.statusText;
          toast.error(errorMessage);
        } else if (error.request) {
          toast.error('Nenhuma resposta do servidor. Verifique sua conexão.');
        } else {
          toast.error(`Erro ao criar o produtor: ${error.message}`);
        }
      } else {
        toast.error(`Ocorreu um erro ao criar o produtor!`);
      }
    }
  }

  return (
    <>
      <Helmet title="Produtores" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Novo produtor</h1>

          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='secondary' className='mr-2'>
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
                  <AlertDialogAction onClick={() => navigate('/app/producers')} className="hover:bg-red-800 bg-red-700">
                    Descartar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              Salvar produtor
            </Button>
          </div>
        </div>

        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input type='submit' hidden />

            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6'>
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:grid-cols-4 mb-2'>
                  <p className='font-semibold text-lg'>Dados Pessoais</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gender">Sexo</Label>
                  <RadioGroup defaultValue="M" id='gender' className="flex flex-row space-x-4">
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

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input id='fullName' type='text' {...register('fullName')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
                  <Input id='cpfCnpj' type='text' {...register('cpfCnpj')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identityDocument">Documento de Identidade</Label>
                  <Input id='identityDocument' type='text' {...register('identityDocument')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id='birthDate' type='date' {...register('birthDate')} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6'>
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:grid-cols-4 mb-2'>
                  <p className='font-semibold text-lg'>Endereço</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">CEP</Label>
                  <Input id='postalCode' type='text' {...register('postalCode')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Logradouro</Label>
                  <Input id='address' type='text' {...register('address')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressNumber">Número</Label>
                  <Input id='addressNumber' type='text' {...register('addressNumber')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id='neighborhood' type='text' {...register('neighborhood')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id='city' type='text' {...register('city')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id='state' type='text' {...register('state')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressComplement">Complemento</Label>
                  <Input id='addressComplement' type='text' {...register('addressComplement')} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6'>
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:grid-cols-4 mb-2'>
                  <p className='font-semibold text-lg'>Contatos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id='phone' type='text' {...register('phone')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id='email' type='text' {...register('email')} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 rounded border p-6'>
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:grid-cols-4 mb-2'>
                  <p className='font-semibold text-lg'>Informações Profissionais</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id='companyName' type='text' {...register('companyName')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input id='position' type='text' {...register('position')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalRegistrationNumber">Número de Registro Profissional</Label>
                  <Input id='professionalRegistrationNumber' type='text' {...register('professionalRegistrationNumber')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingSegment">Segmento de Atuação</Label>
                  <Input id='operatingSegment' type='text' {...register('operatingSegment')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingRegion">Região de Atuação</Label>
                  <Input id='operatingRegion' type='text' {...register('operatingRegion')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractType">Tipo de Contrato</Label>
                  <Input id='contractType' type='text' {...register('contractType')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPreference">Preferência de Contato</Label>
                  <Input id='contactPreference' type='text' {...register('contactPreference')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableContactHours">Horário Disponível para Contato</Label>
                  <Input id='availableContactHours' type='text' {...register('availableContactHours')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capturedClientCount">Número de Clientes Capturados</Label>
                  <Input id='capturedClientCount' type='number' {...register('capturedClientCount')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capturedInsuranceTypes">Tipos de Seguros Capturados</Label>
                  <Input id='capturedInsuranceTypes' type='text' {...register('capturedInsuranceTypes')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startOfActivitiesDate">Data de Início das Atividades</Label>
                  <Input id='startOfActivitiesDate' type='date' {...register('startOfActivitiesDate')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generatedBusinessVolume">Volume de Negócios Gerados</Label>
                  <Input id='generatedBusinessVolume' type='number' {...register('generatedBusinessVolume')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversionRate">Taxa de Conversão</Label>
                  <Input id='conversionRate' type='number' {...register('conversionRate')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signedContract">Contrato Assinado</Label>
                  <Input id='signedContract' type='checkbox' {...register('signedContract')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificatesLicenses">Certificados e Licenças</Label>
                  <Input id='certificatesLicenses' type='text' {...register('certificatesLicenses')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="references">Referências</Label>
                  <Input id='references' type='text' {...register('references')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Notas Adicionais</Label>
                  <Input id='additionalNotes' type='text' {...register('additionalNotes')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationDate">Data de Registro</Label>
                  <Input id='registrationDate' type='date' {...register('registrationDate')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationResponsible">Responsável pelo Registro</Label>
                  <Input id='registrationResponsible' type='text' {...register('registrationResponsible')} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
