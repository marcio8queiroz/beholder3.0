import express from "express";
import helmet from "helmet"; //protege de ataques web
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMidleware.js";
import authController from "./controllers/authController.js";

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

app.post("/login", authController.doLogin)

app.use("/logout", authController.doLogout)

app.use("/", (req, res, next) => {
    res.send("Hello World!");
})

app.use(errorMiddleware);


export default app;