import React from 'react';
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, Controller } from 'react-hook-form';
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

// Defina a interface TypeScript para os dados do formulário
interface ProducerData {
  gender: 'M' | 'F';
  fullName: string;
  cpfCnpj: string;
  identityDocument: string;
  birthDate: string;
  postalCode: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  addressComplement: string;
  phone: string;
  email: string;
  companyName: string;
  position: string;
  professionalRegistrationNumber: string;
  operatingSegment: string;
  operatingRegion: string;
  contractType: string;
  contactPreference: string;
  availableContactHours: string;
  capturedClientCount: number;
  capturedInsuranceTypes: string;
  startOfActivitiesDate: string;
  generatedBusinessVolume: number;
  conversionRate: number;
  signedContract: boolean;
  certificatesLicenses: string;
  references: string;
  additionalNotes: string;
  registrationDate: string;
  registrationResponsible: string;
}

export const Producer: React.FC = () => {
  const navigate = useNavigate();

  // Passe o tipo ProducerData para o useForm
  const { handleSubmit, register, control, formState: { errors } } = useForm<ProducerData>();

  async function onSubmit(data: ProducerData) {
    try {
      await createProducer(data);
      queryClient.invalidateQueries({ queryKey: ['producers'] });
      toast.success('Produtor criado com sucesso!');
      navigate('/app/producers');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.statusText || 'Erro ao criar o produtor!';
        toast.error(errorMessage);
      } else {
        toast.error('Ocorreu um erro ao criar o produtor!');
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
                <div className='col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mb-2'>
                  <p className='font-semibold text-lg'>Dados Pessoais</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gender">Sexo</Label>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue="M"
                    render={({ field }) => (
                      <RadioGroup id='gender' className="flex flex-row space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="M" id="r1" {...field} />
                          <Label htmlFor="r1">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="F" id="r2" {...field} />
                          <Label htmlFor="r2">Feminino</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                {[
                  { label: 'Nome Completo', name: 'fullName', type: 'text' },
                  { label: 'CPF ou CNPJ', name: 'cpfCnpj', type: 'text' },
                  { label: 'Documento de Identidade', name: 'identityDocument', type: 'text' },
                  { label: 'Data de Nascimento', name: 'birthDate', type: 'date' },
                ].map(({ label, name, type }) => (
                  <div key={name} className="space-y-2">
                    <Label htmlFor={name}>{label}</Label>
                    <Input id={name} type={type} {...register(name)} />
                    {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
                  </div>
                ))}
              </div>

              {/* Adicione o restante das seções do formulário aqui, seguindo o mesmo padrão */}

            </div>
          </form>
        </div>
      </div>
    </>
  );
}
