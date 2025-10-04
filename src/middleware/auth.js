import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({error: "Token não fornecido."});
    }
    const token = authHeader.replace('Bearer ', '');
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (err){
        return res.status(401).json({error: "Token inválido ou expirado"});
    }
}

export { authMiddleware };