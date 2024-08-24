import React, { useState } from 'react';
import { Helmet } from "react-helmet-async";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { CustomerTableRow } from './customer-table-row';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/api/get-customers';
import { CustomerTableSkeleton } from './customer-table-skeleton';

export const Customers: React.FC = () => {
  const [isCreateNewCustomerDialogOpen, setIsCreateNewCustomerDialogOpen] = useState(false);

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
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>

          <Dialog open={isCreateNewCustomerDialogOpen} onOpenChange={setIsCreateNewCustomerDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsCreateNewCustomerDialogOpen(true)}
                variant='default'
              >
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
                <DialogDescription>Crie um novo cliente</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id='name' type='text' />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id='email' type='email' />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id='password' type='password' />
                  </div>

                  <Button
                    type='submit'
                    className="w-full"
                  >
                    Criar
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
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
