import { z } from "zod"

export const loginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerAdminDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
})

export const registerUserDTO = z.object({
  password: z.string().min(8),
  name: z.string().optional(),
})

export const inviteUserDTO = z.object({
  email: z.string().email(),
})

export const changePasswordDTO = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
})

export const forgotPasswordDTO = z.object({
  email: z.string().email(),
})

export const resetPwdDTO = z.object({
  password: z.string().min(8),
})
