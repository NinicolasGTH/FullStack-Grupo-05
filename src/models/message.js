// modelo de mensagens e persistência de dados/mensagens

import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: {type: String, required: true, trim: true, maxlength: 2000},
    readAt: { type: Date, default: null },
    conversationKey: { type: String, required: true, index: true }
}, { timestamps: true });

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);