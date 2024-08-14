import { isAdmin } from "@/utils/isAdmin"

export type UserStatus = "admin" | "user"

interface UserStatusProps {
  role: number
}

const UserStatusMap: Record<UserStatus, string> = {
  admin: 'Administrador',
  user: 'Usuário'
}

export function UserStatus({ role }: UserStatusProps) {
  const status = isAdmin(role) ? 'admin' : 'user'
  return (
    <div className="flex items-center gap-2" >
      {status === 'admin' && (
        <span data-testid='badge' className="h-2 w-2 rounded bg-emerald-500" />
      )}
      {status === 'user' && (
        <span data-testid='badge' className="h-2 w-2 rounded bg-slate-500" />
      )}
      <span className="font-medium text-muted-foreground" >{UserStatusMap[status]}</span>
    </div>
  )
}