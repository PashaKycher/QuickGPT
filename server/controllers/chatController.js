import Chat from "../models/Chat.js";

// create chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatData = {
            userId,
            userName: req.user.name,
            name: "New Chat",
            messages: [],
        }

        const chat = await Chat.create(chatData);

        res.status(201).json({
            success: true,
            error: false,
            message: "Chat created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        });
    }
};

// get all chats
export const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            error: false,
            message: "Chats fetched successfully",
            chats
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        });
    }
};

// delete chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;
        await Chat.deleteOne({ _id: chatId, userId });
        res.status(200).json({
            success: true,
            error: false,
            message: "Chat deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        });
    }
};