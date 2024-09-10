
import { useQuery } from '@tanstack/react-query';
import { getInsurance } from '@/api/insurance/get-insurancers';
import { InsuranceTableRow } from './insurance-table-row';
import { InsuranceTableSkeleton } from './insurance-table-skeleton';
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Insurances = () => {
  const navigate = useNavigate();
  const { data: insurances, isLoading, isError } = useQuery({
    queryKey: ['insurances'],
    queryFn: getInsurance,
  });

  if (isError) {
    return <p className="text-red-600">Erro ao carregar a lista de seguros. Tente novamente mais tarde.</p>;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Lista de Seguradoras</h1>
        <Button onClick={() => navigate('new')}>Nova Seguradora</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Criado Há</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Apólice</TableHead>
              <TableHead>Limite </TableHead>
              <TableCell>CNPJ</TableCell> {/* Novo campo */}
              <TableCell>Endereço</TableCell> {/* Novo campo */}
              <TableHead>Contato </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <InsuranceTableSkeleton />}
            {!isLoading && insurances?.map(insurance => (
              <InsuranceTableRow key={insurance.id} insurance={insurance} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
