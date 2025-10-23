import express from "express";
import { createChat, deleteChat, getAllChats } from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
chatRouter.get("/get", protect, getAllChats);
chatRouter.post("/delete", protect, deleteChat);

export default chatRouter;