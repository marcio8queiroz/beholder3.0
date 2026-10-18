import express from "express";
const router = express.Router();

import beholderController from "../controllers/beholderController.js";

router.get("/memory", beholderController.getMemory);

router.patch("/memory/:index", beholderController.updateMemory);

router.get("/brain", beholderController.getBrain);

export default router;
