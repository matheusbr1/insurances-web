import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function UserTableSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <UserTableRowSkeleton key={i} />
    )
  })
}

export function UserTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[140px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[180px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[128px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[128px]" />
      </TableCell>
    </TableRow>
  )
}