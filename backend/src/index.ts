import express from "express"
import http from "http"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import authRouter from "./routers/auth/router"
import userRouter from "./routers/user/router"

dotenv.config()

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
const PORT = Number(process.env.PORT ?? 8080)
server.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
