import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const reciverId = req.params.id;
        const { textMessage: message } = req.body;
        
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, reciverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            reciverId,
            message
        });

        if (newMessage) conversation.message.push(newMessage._id);
        
        await Promise.all([conversation.save(), newMessage.save()]);

        // Implement Socket.IO
        const reciverSocketId = getReciverSocketId(reciverId); // Corrected
        if (reciverSocketId) {
            io.to(reciverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('message');
        if (!conversation) return res.status(200).json({ success: true, message: [] });

        return res.status(200).json({ success: true, messages: conversation?.message });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
