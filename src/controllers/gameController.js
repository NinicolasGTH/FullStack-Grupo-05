
import { Game } from '../models/game.js';

// CREATE (admin)
async function createGame(req, res) {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        const { title, description, genres, platforms, coverUrl, releaseDate } = req.body;
        if (!title || !description || !Array.isArray(genres) || genres.length === 0 || !Array.isArray(platforms) || platforms.length === 0 || !coverUrl || !releaseDate) {
            return res.status(400).json({ error: 'Campos obrigatórios: title, description, genres[], platforms[], coverUrl, releaseDate.' });
        }
        const game = await Game.create({ title, description, genres, platforms, coverUrl, releaseDate });
        res.status(201).json({ message: 'Jogo criado com sucesso.', game });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar jogo.' });
    }
}

// LIST (public)
async function listGames(req, res){
    try {
        const { q, upcoming, limit = 20, page = 1 } = req.query;
        const filter = {};
        if (q) filter.title = { $regex: q, $options: 'i' };
        if (upcoming === 'true') filter.releaseDate = { $gte: new Date() };
        const skip = (Number(page)-1) * Number(limit);
        const games = await Game.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        const total = await Game.countDocuments(filter);
        res.json({ data: games, meta: { total, page: Number(page), pages: Math.ceil(total/Number(limit)) }});
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar jogos.' });
    }
}

// GET one (public)
async function getGame(req, res){
    try {
        const game = await Game.findById(req.params.id);
        if(!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
        res.json(game);
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter jogo.' });
    }
}

// UPDATE (admin)
async function updateGame(req, res){
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        const { title, description, genres, platforms, coverUrl, releaseDate } = req.body;
        const update = {};
        if (title) update.title = title;
        if (description) update.description = description;
        if (Array.isArray(genres)) update.genres = genres;
        if (Array.isArray(platforms)) update.platforms = platforms;
        if (coverUrl) update.coverUrl = coverUrl;
        if (releaseDate) update.releaseDate = releaseDate;
        const game = await Game.findByIdAndUpdate(req.params.id, update, { new: true });
        if(!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
        res.json({ message: 'Atualizado com sucesso.', game });
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar jogo.' });
    }
}

// DELETE (admin)
async function deleteGame(req, res){
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        const game = await Game.findByIdAndDelete(req.params.id);
        if(!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
        res.json({ message: 'Removido com sucesso.' });
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar jogo.' });
    }
}

export { createGame, listGames, getGame, updateGame, deleteGame };