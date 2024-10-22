import { FormEvent, useState } from "react"
import { AxiosError } from "axios"
import { z, ZodError } from "zod"
import { useMutation } from "@tanstack/react-query"

import { changePasswordOptions } from "@auth/queries/options"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardLayout, CardContent, CardTitle } from "@/components/layouts"

const PasswordSection = () => {
  const schema = z
    .object({
      currentPassword: z
        .string()
        .min(8, "Password must contains at least 8 characters"),
      newPassword: z
        .string()
        .min(8, "Password must contains at least 8 characters"),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.newPassword === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    })

  const [error, setError] = useState<null | string>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const { mutateAsync } = useMutation({
    mutationFn: changePasswordOptions.fn,
    onError: (error: AxiosError<{ message: string }>) => {
      setError(error.response?.data.message!)
    },
  })

  const resetForm = () => {
    setCurrentPassword("")
    setNewPassword("")
    setPasswordConfirm("")
    setError(null)
  }

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await schema.parseAsync({ currentPassword, newPassword, passwordConfirm })
      await mutateAsync({ oldPassword: currentPassword, newPassword })
      resetForm()
      toast.success("Change password successfully", { duration: 2000 })
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0].message)
      }
    }
  }

  return (
    <>
      <CardLayout id="password">
        <>
          <CardTitle
            title="Update Password"
            description="Ensure your account is using a long, random password to stay secure."
          ></CardTitle>
          <CardContent>
            <form onSubmit={(e) => submitHandler(e)}>
              <Label>Old Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-2/3 mb-5"
              />
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-2/3 mb-5"
              />
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-2/3"
              />
              {error && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  {error}
                </p>
              )}
              <div className="mt-5 w-full flex justify-end">
                <Button type="submit">Change password</Button>
              </div>
            </form>
          </CardContent>
        </>
      </CardLayout>
    </>
  )
}

export default PasswordSection
