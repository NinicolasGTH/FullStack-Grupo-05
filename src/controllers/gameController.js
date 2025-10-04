import {Game} from '../models/game.js';

async function createGame(req, res){
    try{
        // Apenas admins podem criar jogos, hierarquia de roles
        if(req.user.role !== 'admin'){
            return res.status(403).json({error: "Acesso negado."});
        }
        const {title, genre, platform, releaseDate} = req.body;
        if(!title || !genre || !platform){
            return res.status(400).json({error: "Título, gênero e plataforma são obrigatórios."});
        }
        const game = await Game.create({title, genre, platform, releaseDate});
        res.status(201).json({message: "Jogo criado com sucesso.", game});
    } catch (err){
        console.error(err);
        res.status(500).json({error: "Erro ao criar jogo."});
    }
}