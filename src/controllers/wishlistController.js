import {User} from '../models/user.js';
import {Game} from '../models/game.js';

// Adicionando jogos a lista de desejos

export async function addToWishlist(req, res){
    try {
        const userId = req.user.userId;
        const gameId = req.params.gameId;

        // verifica se o jogo existe
        const game = await Game.findById(gameId);
        if(!game) return res.status(404).json({error: "Jogo não encontrado"})

        // adiciona o jogo caso ele não esteja na wishlist
        const user = await User.findById(userId);
        if(user.wishlist.includes(gameId)){
            return res.status(400).json({message: "O jogo já está na lista de desejos."});

        }
        user.wishlist.push(gameId);
        await user.save();
        res.json({message: "Jogo adicionado a lista de desejos"});

    } catch (err){
        res.status(500).json({error: "Erro ao adicionar jogo a lista de desejos."});
    }
}

// Remover jogo da lista de desejos

export async function removeFromWishlist(req, res){
    try{
        const userId = req.user.userId;
        const gameId = req.params.gameId;

        const user = await User.findById(userId);
        user.wishlist = user.wishlist.filter(id => id.toString() !== gameId);
        await user.save();
        res.json({message: "Jogo removido da lista de desejos."});

    } catch (err){
        res.status(500).json({error: "Erro ao remover jogo da lista de desejos."});
    }
}

export async function listWishlist(req, res){
  try{
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('wishlist');
    res.json({wishlist: user.wishlist});
  } catch (err){
    res.status(500).json({error: "Erro ao listar wishlist."});
  }
}