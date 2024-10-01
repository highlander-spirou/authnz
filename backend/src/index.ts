import express from "express"
import http from "node:http"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import env from "@lib/env"
import swaggerui from "swagger-ui-express"
import useragent from 'express-useragent'

import authRouter from "@auth/index"
import userRouter from "@user/index"
import mfaRouter from "@mfa/index"
import swaggerDocument from "./docs"
import { secureTeamRouter } from "./routers/team"

const app = express()

//#region Register Top-level Module

app.use(morgan("dev"))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(useragent.express())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

//#endregion 



//#region Route register

app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/mfa", mfaRouter)
app.use("/team", secureTeamRouter)

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

//#endregion







//#region Run the server

const server = http.createServer(app)
const PORT = Number(env.PORT ?? 8080)
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

//#endregion