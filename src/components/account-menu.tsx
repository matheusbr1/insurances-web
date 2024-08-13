import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "@/api/get-profile";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity
  })

  const signOut = () => {
    sessionStorage.removeItem('insurances-app:access-token')
    navigate('/', {
      replace: true
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Button variant='outline' className="flex items-center gap-2 select-none" >
          {isLoadingProfile ? <Skeleton className="h-4 w-40" /> : 'Harper Insurances'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" >
        <DropdownMenuLabel className="flex flex-col" >
          {isLoadingProfile ? (
            <div className="space-y-1.5" >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ) : (
            <>
              <span>{profile?.name}</span>
              <span className="text-xs font-normal text-muted-foreground" >
                {profile?.email}
              </span>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-500 dark:text-rose-400" asChild>
          <button onClick={() => signOut()} className="w-full" >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sair</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}