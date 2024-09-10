
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

export const InsuranceTableSkeleton = () => {
  return (
    <React.Fragment>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
          
        </TableRow>
      ))}
    </React.Fragment>
  );
}
