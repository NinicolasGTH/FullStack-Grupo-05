import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';


export async function register(req,res){
    try{
        const{name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "Nome, email e senha são obrigatórios."});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "Usuário com esse email já existe."});
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, passwordHash});
        res.status(201).json({message: "Usuário registrado com sucesso."});
    } catch (err){
        console.error(err);
        res.status(500).json({message: "Erro ao cadastrar usuário."});
    }
}