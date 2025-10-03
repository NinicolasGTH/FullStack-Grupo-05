import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, minlength: 1, maxlength: 200},
    description: {type: String, required: true, trim: true, minlength: 1},
    releaseDate: {type: Date, required: true},
    genres: {type: [String], required: true, trim: true, minlength: 1, maxlength: 100},
    platforms:{type: [String]},
    coverUrl:{type: String},
    }, {timestamps: true});


gameSchema.index({releaseDate: 1}); // Índice para consultas por data de lançamento

export const Game = mongoose.model('Game', gameSchema);
