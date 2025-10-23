import express from "express";
import { getAllPlans, purchasePlan } from "../controllers/creditController.js";
import { protect } from "../middlewares/auth.js";

const creditRouter = express.Router();

creditRouter.get("/plan", getAllPlans);
creditRouter.post("/purchase", protect, purchasePlan);

export default creditRouter;