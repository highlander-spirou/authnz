import { Link } from "react-router-dom"
import PageIcon from "@/assets/page-icon.svg"
import { HandshakeIcon, UserCogIcon, UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LogoutMenuItem from "./logout"
const Navbar = () => {
  return (
    <>
      <div className="restrict-navbar-grow z-10 sticky top-0 h-16 bg-destructive-foreground shadow-sm px-5">
        <div className="flex justify-between items-center">
          <div className="left-section">
            <Link to="/">
              <img src={PageIcon} alt="" className="h-16 aspect-square" />
            </Link>
          </div>
          <div className="center-section"></div>
          <div className="right-section">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="size-8 bg-slate-200 rounded-full grid place-items-center">
                  <UserIcon className="stroke-gray-600" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-40">
                <DropdownMenuItem>
                  <Link to="/team" className="w-full">
                    Team
                  </Link>
                  <DropdownMenuShortcut>
                    <HandshakeIcon className="h-4 w-4" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">
                    Settings
                  </Link>
                  <DropdownMenuShortcut>
                    <UserCogIcon className="h-4 w-4" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <LogoutMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
