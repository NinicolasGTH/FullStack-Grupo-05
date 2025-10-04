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

async function login(req,res){
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: "Email e senha são obrigatórios."});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({error:"Credenciais inválidas."});
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid){
            return res.status(401).json({error:"Credenciais inválidas."});
        }

        const token = jwt.sign(
            {userId: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRES || '1d'}
        );
        res.json({
            message: 'Login realizado com sucesso.',
            token,
            user: {id: user._id, name: user.name, email: user.email, role: user.role}
        });
    } catch (err){
        console.error(err);
        res.status(500).json({message: "Erro ao realizar login."});
    }
}

export { login };

async function profile(req, res){
    try{
        // req.user vem do middleware galera do front-end
        res.json({user: req.user});
    } catch (err){
        res.status(500).json({error: "Erro ao buscar perfil."});

    }
}

export {profile};