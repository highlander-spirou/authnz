import { useMutation } from "@tanstack/react-query"
import { LogOutIcon } from "lucide-react"
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { logoutOptions } from "@auth/queries/options"

const LogoutMenuItem = () => {
  const { mutate } = useMutation(logoutOptions)

  return (
    <DropdownMenuItem variant="destructive" onClick={() => mutate()}>
      Logout
      <DropdownMenuShortcut>
        <LogOutIcon className="w-4 h-4 stroke-red-500" />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}

export default LogoutMenuItem
