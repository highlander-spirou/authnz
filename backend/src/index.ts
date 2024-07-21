import express from "express"
import http from "node:http"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import authRouter from "@auth/router"
import userRouter from "@user/router"
import { env } from "@lib/env"


const app = express()

// Module register
app.use(morgan("dev"))
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
)
app.use(cookieParser())
app.use(bodyParser.json())

// Route register
app.use("/user", userRouter)
app.use("/auth", authRouter)

// Run the server
const server = http.createServer(app)
const PORT = Number(env.PORT ?? 8080)
server.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})