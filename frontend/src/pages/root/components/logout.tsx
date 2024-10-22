import { useMutation } from "@tanstack/react-query"
import { LogOutIcon } from "lucide-react"
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { logoutOptions } from "@auth/queries/options"

const LogoutMenuItem = () => {
  const { mutate: logout } = useMutation({
    mutationFn: logoutOptions.fn,
    onSuccess: () => {
      logoutOptions.invalidates()
      window.location.reload()
    },
  })

  return (
    <DropdownMenuItem variant="destructive" onClick={() => logout()}>
      Logout
      <DropdownMenuShortcut>
        <LogOutIcon className="w-4 h-4 stroke-red-500" />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}

export default LogoutMenuItem
