import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Formato de email inválido']
    },
        passwordHash: {
            type: String,
            required: true,
            minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
        },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export { User };