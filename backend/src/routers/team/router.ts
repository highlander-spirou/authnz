import { Router } from "express"
import userSessionGuard from "@middleware/user-session-guard"
import adminGuard from "@middleware/admin-guard"
import TeamController from "./team.controller"
import mfaGuard from "@middleware/mfa-guard"

const secureTeamRouter = Router()
secureTeamRouter.use(userSessionGuard)
// secureTeamRouter.use(adminGuard)

secureTeamRouter.post(
  "/create-team",
  adminGuard,
  mfaGuard,
  TeamController.createTeam
)
secureTeamRouter.get("/list-team", TeamController.listTeam)

export { secureTeamRouter }
