import { Router } from "express"
import userSessionGuard from "@middleware/user-session-guard"
import adminGuard from "@middleware/admin-guard"
import TeamController from "./team.controller"

const secureTeamRouter = Router()
secureTeamRouter.use(userSessionGuard)
secureTeamRouter.use(adminGuard)

secureTeamRouter.post("/create-team", TeamController.createTeam)

export { secureTeamRouter }
