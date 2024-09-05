import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Corrected from "reqf" to "ref"
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Corrected from "reqf" to "ref"
        required: true,
    },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
