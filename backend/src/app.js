import express from "express";
import helmet from "helmet"; //protege de ataques web
import cors from "cors";
import morgan from "morgan";

import errorMiddleware from "./middlewares/errorMidleware.js";
import authMiddleware from "./middlewares/authMiddleware.js";

import authController from "./controllers/authController.js";
import exchangeController from "./controllers/exchangeController.js";

import beholderRouter from "./routers/beholderRouter.js";
import symbolsRouter from "./routers/symbolsRouter.js"

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

app.post("/login", authController.doLogin)

app.use("/exchange/balance", authMiddleware, exchangeController.getBalance);

app.post("/logout", authController.doLogout)

app.use("/beholder", authMiddleware, beholderRouter);

app.use("/symbols", authMiddleware, symbolsRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use((req, res) => {
    res.status(404).json({ message: "Rota não encontrada." });
});

app.use(errorMiddleware);


export default app;
