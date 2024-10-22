import VerifyMfaDialog from "@/components/custom-ui/verification"
import { CardContent, CardLayout, CardTitle } from "@/components/layouts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGlobalContext } from "@/context"
import { createTeamOption } from "@/modules/team/queries/options"
import queryClient from "@/query-client"
import { mfaVerifyStatusOption } from "@mfa/queries/options"
import mfaKeys from "@mfa/queries/queryKeyFactories"
import { useMutation, useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { LockIcon, LockOpenIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z, ZodError } from "zod"

const DetailLock = () => {
  const [open, toggleOpen] = useState(false)

  return (
    <>
      <h3 className="text-red-500 flex gap-1 items-center">
        <LockIcon className="w-5 h-5" />
        This content is lock.
      </h3>
      To unlock the view, you need to provide the Multi-factor verification
      <div className="mt-5 w-full">
        <Button className="items-center gap-2" onClick={() => toggleOpen(true)}>
          <LockOpenIcon className="w-4 h-4" />
          Unlock
        </Button>
      </div>
      <VerifyMfaDialog open={open} toggleOpen={toggleOpen} />
    </>
  )
}

const ViewTeamDetail = () => {
  return (
    <>
      <p>Úm ba la địt mẹ mày</p>
    </>
  )
}

const NewTeamForm = () => {
  const [open, toggleOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { mfaToken } = useGlobalContext()

  const schema = z.object({
    name: z.string().min(3, "Team name must contain at least 3 characters"),
    mfaToken: z.string(),
  })

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toggleOpen(true)
  }

  const { mutateAsync } = useMutation({
    mutationKey: createTeamOption.key,
    mutationFn: createTeamOption.fn,
  })

  const resetForm = () => {
    setName("")
    setError(null)
  }

  const onVerifiedSuccessHandler = async () => {
    try {
      const { name: parsedName, mfaToken: parsedMfaToken } =
        await schema.parseAsync({ name, mfaToken })
      await mutateAsync({ name: parsedName, mfaToken: parsedMfaToken })
      resetForm()
      toast.success("Create team successfully", { duration: 2000 })
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0].message)
      }
    }
  }

  return (
    <>
      <CardLayout id="create-team">
        <CardTitle title="Create team" description="Create a new team" />
        <CardContent>
          <form onSubmit={(e) => submitHandler(e)}>
            <Label>Create a new team</Label>
            <Input
              placeholder="Team name"
              className="w-2/3 mb-5"
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <p className="mt-5 text-red-500 font-semibold">{error}</p>
            )}
            <div className="mt-5 w-full flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </CardLayout>
      <VerifyMfaDialog
        open={open}
        toggleOpen={toggleOpen}
        onVerifiedSuccessHandler={onVerifiedSuccessHandler}
      />
    </>
  )
}

const ViewAllTeams = () => {
  const { mfaToken } = useGlobalContext()

  const { data } = useQuery({
    queryKey: mfaVerifyStatusOption.key,
    queryFn: async () => mfaVerifyStatusOption.fn(mfaToken!),
    retry: 10,
    enabled: !!mfaToken,
    refetchOnWindowFocus: false,
    staleTime: mfaVerifyStatusOption.staleTime,
  })

  return (
    <>
      <CardLayout id="all-teams">
        <CardTitle
          title="All teams"
          description="View all the teams participated by this account "
        />
        <CardContent>
          {data && dayjs().diff(dayjs(data.tz), "minutes") < 30 ? (
            <>
              <ViewTeamDetail />
            </>
          ) : (
            <>
              <DetailLock />
            </>
          )}
        </CardContent>
      </CardLayout>
    </>
  )
}

const TeamPage = () => {
  return (
    <>
      <div className="restrict-content-grow grid my-10">
        <h1>Hello 👋</h1>
        <NewTeamForm />
        <hr className="border-gray-200 my-10" />
        <ViewAllTeams />
      </div>
    </>
  )
}

export default TeamPage
