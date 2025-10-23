import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

// text-based message
export const textMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Not enough credits"
            })
        }
        const { chatId, prompt } = req.body;
        const chat = await Chat.findOne({ _id: chatId, userId });

        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false, isPublished: false });

        // open ai api call
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: prompt, },
            ],
        });
        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false, isPublished: false };
        // send reply
        res.status(201).json({
            success: true,
            error: false,
            message: "Message sent successfully",
            reply
        })
        // save reply
        chat.messages.push(reply);
        await chat.save();
        await User.findOneAndUpdate({ _id: userId }, { $inc: { credits: -1 } });
        // ----------
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        })
    }
}

// image generation message
export const imageMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 2) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Not enough credits"
            })
        }
        const { chatId, prompt, isPublished } = req.body;
        const chat = await Chat.findOne({ _id: chatId, userId });

        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false, isPublished: false });

        // generate image imageKit
        // encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);
        // construct the url (${process.env.IMAGEKIT_URL_ENDPOINT} - endpoint, /ik-genimg-prompt-${encodedPrompt} - prompt,  /${Date.now()}.png - name to save, ?tr=w-800,h-800 - size)
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/${Date.now()}.png?tr=w-800,h-800`;
        // trigger the image generation
        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: 'arraybuffer'});
        // convert the image to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;
        // upload the image to imageKit
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: 'QuickGpt',
        })

        const reply = { role: "assistant", content: uploadResponse.url, timestamp: Date.now(), isImage: true, isPublished: isPublished };
        // send reply
        res.status(201).json({
            success: true,
            error: false,
            message: "Message sent successfully",
            reply
        })
        // save reply
        chat.messages.push(reply);
        await chat.save();
        await User.findOneAndUpdate({ _id: userId }, { $inc: { credits: -2 } });
        // ----------
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        })
    }
}