import express from "express";
const router = express.Router();

import beholderController from "../controllers/beholderController.js";

router.get("/memory", beholderController.getMemory);

router.get("/brain", beholderController.getBrain);

export default router;