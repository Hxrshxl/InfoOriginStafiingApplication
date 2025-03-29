import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from './routes/user.route.js';
import companyRoutes from './routes/company.route.js';
import path from 'path';
import jobRoute  from "./routes/job.route.js";
import applicationRoute  from "./routes/application.route.js";
dotenv.config({})
let port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/company", companyRoutes)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)

app.listen(port, () => {
    connectDB()
    console.log(`listening on port ${port}`)
})