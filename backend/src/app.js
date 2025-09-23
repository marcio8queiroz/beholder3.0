import express from "express";
import helmet from "helmet"; //protege de ataques web
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMidleware.js";

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

app.use("/login", (req, res, next) => {
   res.send("Login");
   //throw new Error("Erro qualquer");
})

app.use("/logout", (req, res, next) => {
    res.send("Logout");
})

app.use("/", (req, res, next) => {
    res.send("Hello World!");
})

app.use(errorMiddleware);


export default app;