import express from "express"
import http from "node:http"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerui from "swagger-ui-express"

import { env } from "@lib/env"
import authRouter from "@auth/router"
import userRouter from "@user/router"

const app = express()

const docspecs = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: "Authentication and Authorization process",
      version: "0.1",
    },
    host: `http://localhost:8080`,
  },
  apis: ['./src/routers/**/docs.yaml'],
})

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

app.use("/api-docs", swaggerui.serve, swaggerui.setup(docspecs))

// Run the server
const server = http.createServer(app)
const PORT = Number(env.PORT ?? 8080)
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
