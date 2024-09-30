import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardLayout, CardTitle } from "@user/layouts"
import { useState } from "react"
import { z } from "zod"

const Team = () => {
  const formSchema = z.object({
    name: z.string().min(2),
  })

  const [inp, setInp] = useState("")
  const [error, setError] = useState<boolean>(false)

  return (
    <>
      <div className="restrict-content-grow grid my-10">
        <CardLayout id="team-details">
          <>
            <CardTitle
              title="Team Overview"
              description="View your team, or Create a new team to collaborate with others on projects."
            ></CardTitle>
            <CardContent>
              <Label>Team Name</Label>
              <Input
                placeholder="Enter your name"
                value={inp || ""}
                onChange={(e) => setInp(e.target.value)}
                className="w-2/3"
              />
              {error && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  Team name invalid
                </p>
              )}
              <div className="mt-5 w-full flex justify-end">
                <Button type="submit">Create team</Button>
              </div>
            </CardContent>
          </>
        </CardLayout>
      </div>
    </>
  )
}

export default Team
