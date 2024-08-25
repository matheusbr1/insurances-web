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
import { CustomerTableRow } from './customer-table-row';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/api/get-customers';
import { CustomerTableSkeleton } from './customer-table-skeleton';
import { useNavigate } from 'react-router-dom';

export const Customers: React.FC = () => {
  const navigate = useNavigate()

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    staleTime: Infinity,
    queryFn: getCustomers
  })

  return (
    <>
      <Helmet title="Clientes" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>

          <Button
            onClick={() => navigate('new')}
            variant='default'
          >
            Novo Cliente
          </Button>
        </div>

        <div className="space-y-2.5">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Criado há</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead className="w-[128px]"></TableHead>
                  <TableHead className="w-[128px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCustomers && <CustomerTableSkeleton />}
                {customers && customers.map(customer => (
                  <CustomerTableRow key={customer.id} customer={customer} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
