import { Home, Lock, User } from "lucide-react";

// import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { ModeToggle } from "./theme/theme-toggle";
import { Separator } from "./ui/separator";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b" >
      <div className="flex h-16 items-center gap-6 px-6" >
        <Lock className="h-6 w-6" />
        <p>Nome do produto</p>

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6" >
          <NavLink to='/app' >
            <Home className="h-4 w-4" />
            Início
          </NavLink>

          <NavLink to='/app/customers' >
            <User className="h-4 w-4" />
            Clientes
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2" >
          <ModeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}