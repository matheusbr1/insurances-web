import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function ProducerTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <ProducerTableRowSkeleton key={i} />
      ))}
    </>
  );
}

export function ProducerTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[140px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[180px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[128px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[128px]" />
      </TableCell>
    </TableRow>
  );
}
