import { FormEvent, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { z, ZodError } from "zod"

import {
  changeUserInfoOptions,
  getUserInfoOptions,
} from "@user/queries/options"
import { UserInfo } from "@user/types"

import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardLayout, CardContent, CardTitle } from "@/components/layouts"

const ProfileSection = () => {
  const { data } = useQuery<UserInfo>({
    queryKey: getUserInfoOptions.key,
    queryFn: getUserInfoOptions.fn,
    staleTime: getUserInfoOptions.staleTime,
  })

  const formSchema = z.object({
    name: z.string().min(2),
  })

  const [inp, setInp] = useState(data?.name || "")
  const [error, setError] = useState<boolean>(false)

  const { mutateAsync } = useMutation({
    mutationKey: changeUserInfoOptions.key,
    mutationFn: async () => await changeUserInfoOptions.fn({ name: inp }),
    onSuccess: () => {
      changeUserInfoOptions.invalidates()
    },
  })

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await formSchema.parseAsync({ name: inp })
      await mutateAsync()
      setError(false)
      toast.success("Change profile successfully", { duration: 2000 })
    } catch (error) {
      if (error instanceof ZodError) {
        setError(true)
      }
    }
  }

  return (
    <CardLayout id="profile">
      <>
        <CardTitle
          title="Profile Information"
          description="Update your account's profile information."
        ></CardTitle>
        <CardContent>
          <form onSubmit={(e) => submitHandler(e)}>
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              value={inp || ""}
              onChange={(e) => setInp(e.target.value)}
              className="w-2/3"
            />
            {error && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                New name invalid
              </p>
            )}
            <div className="mt-5 w-full flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </>
    </CardLayout>
  )
}

export default ProfileSection
