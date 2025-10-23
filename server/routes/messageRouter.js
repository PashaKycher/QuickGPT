import express from "express"
import {textMessage, imageMessage} from "../controllers/messageController.js"
import { protect } from "../middlewares/auth.js"

const messageRouter = express.Router()

messageRouter.post("/text", protect, textMessage)
messageRouter.post("/image", protect, imageMessage)

export default messageRouter