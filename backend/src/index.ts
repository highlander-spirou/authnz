import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dashboard from "./routers/dashboard";
import authRoute from './routers/auth'


dotenv.config();

const app = express();

// Module register
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// Route register
app.use("/dashboard", dashboard);
app.use("/auth", authRoute);

// Run the server
const server = http.createServer(app);
const PORT = Number(process.env.PORT ?? 8080);
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
