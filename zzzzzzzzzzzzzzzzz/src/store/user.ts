import { proxy } from "valtio"

export interface UserInterface {
	email_verified_at: string | null
	name: string
}

export const userStore = proxy<{ user: UserInterface | null }>({ user: null })

export const addUser = (user: UserInterface) => {
	userStore.user = user
}
