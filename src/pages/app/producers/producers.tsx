import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Helmet } from "react-helmet-async";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProducerTableRow } from './producer-table-row';
import { useQuery } from '@tanstack/react-query';
import { getProducers } from '@/api/get-producers';
import { ProducerTableSkeleton } from './producer-table-skeleton';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// Defina a interface para o objeto Producer
interface Producer {
  id: string;
  fullName: string;
  cpfCnpj: string;
  birthDate: string;
  identityDocument: string;
  address: string;
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
  capturedInsuranceTypes: string[];
  startOfActivitiesDate: string;
  generatedBusinessVolume: number;
  conversionRate: number;
  signedContract: boolean;
  certificatesLicenses: string;
  references: string;
  additionalNotes: string;
  registrationDate: string;
  registrationResponsible: string;
  createdAt: string;
  updatedAt: string;
}


const options = [
  { value: 'name', label: 'Nome Completo' },
  { value: 'email', label: 'E-mail' },
  // Adicione mais opções de filtro conforme necessário
];

export const Producers: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('name');

  // Especifique o tipo para os dados retornados por useQuery
  const { data: producers, isLoading: isLoadingProducers, isError } = useQuery<Producer[]>({
    queryKey: ['producers'],
    staleTime: Infinity,
    queryFn: getProducers
  });

  const handleFilterChange = useCallback(
    debounce((value: string) => {
      setFilter(value);
    }, 300), 
    []
  );

  if (isError) {
    return (
      <div className="p-4">
        <h2 className="text-red-600">Ocorreu um erro ao carregar os produtores.</h2>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  const filteredProducers = producers?.filter((producer: Producer) =>
    filter ? producer[filterType]?.toLowerCase().includes(filter.toLowerCase()) : true
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredProducers?.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil((filteredProducers?.length || 0) / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <>
      <Helmet title="Produtores" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Produtores</h1>
          <Button
            onClick={() => navigate('new')}
            variant='default'
          >
            Novo Produtor
          </Button>
        </div>

        <div className="space-y-2.5">
          <div className="mb-4 flex items-center gap-4">
            <Select
              options={options}
              value={options.find(option => option.value === filterType)}
              onChange={(selectedOption) => setFilterType(selectedOption?.value || 'name')}
              className="w-1/3"
              placeholder="Escolha um filtro"
            />
            <input
              type="text"
              placeholder="Pesquisar"
              className="border p-2 rounded w-2/3"
              onChange={(e) => handleFilterChange(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Criado há</TableHead>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead className="w-[128px]"></TableHead>
                  <TableHead className="w-[128px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingProducers ? (
                  <ProducerTableSkeleton />
                ) : (
                  currentRecords?.map((producer: Producer) => (
                    <ProducerTableRow key={producer.id} producer={producer} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span>Página {currentPage} de {totalPages}</span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || currentRecords?.length < recordsPerPage}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
