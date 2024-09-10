import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Definindo o esquema de validação com zod
const insuranceSchema = z.object({
  name: z.string().nonempty('O nome é obrigatório'),
  policyNumber: z.string().nonempty('O número da apólice é obrigatório'),
  companyCnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').optional(),
  address: z.string().optional(),
  mainContact: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('E-mail inválido').optional(),
  
  // Transforma string em array, se necessário
  insuranceTypes: z.array(z.string()).optional().or(z.string().transform((val) => val.split(',').map((s) => s.trim()))),

  // Converte a string para Date, se aplicável
  establishmentDate: z.string().optional().transform((val) => (val ? new Date(val) : null)),
  
  maxCoverageAmount: z.number().optional(),
  marketRating: z.string().optional(),
  
  // Transforma string em array, se necessário
  certificatesLicenses: z.array(z.string()).optional().or(z.string().transform((val) => val.split(',').map((s) => s.trim()))),
  
  additionalNotes: z.string().optional(),
  operatingStatus: z.string().optional(),
});


// Inferindo os dados do formulário a partir do esquema zod
type InsuranceFormData = z.infer<typeof insuranceSchema>;

interface InsuranceFormProps {
  onSubmit: (data: InsuranceFormData) => void;
  onCancel?: () => void;
}

export function InsuranceForm({ onSubmit, onCancel }: InsuranceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitForm = async (data: InsuranceFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast.success('Seguro cadastrado com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao cadastrar o seguro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
  <div>
    <label htmlFor="name">Nome</label>
    <Input id="name" {...register('name')} />
    {errors.name && <p className="text-red-600">{errors.name.message}</p>}
  </div>

  <div>
    <label htmlFor="policyNumber">Número da Apólice</label>
    <Input id="policyNumber" {...register('policyNumber')} />
    {errors.policyNumber && <p className="text-red-600">{errors.policyNumber.message}</p>}
  </div>

  <div>
    <label htmlFor="companyCnpj">CNPJ da Empresa</label>
    <Input id="companyCnpj" {...register('companyCnpj')} />
    {errors.companyCnpj && <p className="text-red-600">{errors.companyCnpj.message}</p>}
  </div>

  <div>
    <label htmlFor="address">Endereço</label>
    <Input id="address" {...register('address')} />
    {errors.address && <p className="text-red-600">{errors.address.message}</p>}
  </div>

  <div>
    <label htmlFor="mainContact">Contato Principal</label>
    <Input id="mainContact" {...register('mainContact')} />
    {errors.mainContact && <p className="text-red-600">{errors.mainContact.message}</p>}
  </div>

  <div>
    <label htmlFor="contactPhone">Telefone de Contato</label>
    <Input id="contactPhone" {...register('contactPhone')} />
    {errors.contactPhone && <p className="text-red-600">{errors.contactPhone.message}</p>}
  </div>

  <div>
    <label htmlFor="contactEmail">E-mail de Contato</label>
    <Input id="contactEmail" type="email" {...register('contactEmail')} />
    {errors.contactEmail && <p className="text-red-600">{errors.contactEmail.message}</p>}
  </div>

  <div>
  <label htmlFor="insuranceTypes">Tipos de Seguros</label>
  <Input
    id="insuranceTypes"
    {...register('insuranceTypes', {
      setValueAs: (v) => v.split(',').map((item: string) => item.trim()), // Converte a string para array
    })}
  />
  {errors.insuranceTypes && <p className="text-red-600">{errors.insuranceTypes.message}</p>}
</div>


  <div>
    <label htmlFor="establishmentDate">Data de Estabelecimento</label>
    <Input id="establishmentDate" type="date" {...register('establishmentDate')} />
    {errors.establishmentDate && <p className="text-red-600">{errors.establishmentDate.message}</p>}
  </div>

  <div>
  <label htmlFor="maxCoverageAmount">Cobertura Máxima</label>
  <Input
    id="maxCoverageAmount"
    type="number"
    {...register('maxCoverageAmount', {
      valueAsNumber: true, // Corrige o problema, garante que o valor seja tratado como número
      min: { value: 0, message: 'O valor deve ser no mínimo 0' },
      max: { value: 100000000, message: 'O valor máximo é 100.000.000' },
    })}
  />
  {errors.maxCoverageAmount && (
    <p className="text-red-600">{errors.maxCoverageAmount.message}</p>
  )}
</div>

  <div>
    <label htmlFor="marketRating">Classificação de Mercado</label>
    <Input id="marketRating" {...register('marketRating')} />
    {errors.marketRating && <p className="text-red-600">{errors.marketRating.message}</p>}
  </div>

  <div>
    <label htmlFor="certificatesLicenses">Certificados/Licenças</label>
    <Input id="certificatesLicenses" {...register('certificatesLicenses')} />
    {errors.certificatesLicenses && <p className="text-red-600">{errors.certificatesLicenses.message}</p>}
  </div>

  <div>
    <label htmlFor="additionalNotes">Notas Adicionais</label>
    <Input id="additionalNotes" {...register('additionalNotes')} />
    {errors.additionalNotes && <p className="text-red-600">{errors.additionalNotes.message}</p>}
  </div>

  <div>
    <label htmlFor="operatingStatus">Status Operacional</label>
    <Input id="operatingStatus" {...register('operatingStatus')} />
    {errors.operatingStatus && <p className="text-red-600">{errors.operatingStatus.message}</p>}
  </div>

  <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
</form>

  );
}
