import React from 'react';
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

export const Producers: React.FC = () => {
  const navigate = useNavigate();

  const { data: producers, isLoading: isLoadingProducers, isError } = useQuery({
    queryKey: ['producers'],
    staleTime: Infinity,
    queryFn: getProducers
  });

  if (isError) {
    return (
      <div className="p-4">
        <h2 className="text-red-600">Ocorreu um erro ao carregar os produtores.</h2>
        {/* Opcional: Adicionar um botão para tentar novamente */}
      </div>
    );
  }

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
                  producers?.map(producer => (
                    <ProducerTableRow key={producer.id} producer={producer} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
