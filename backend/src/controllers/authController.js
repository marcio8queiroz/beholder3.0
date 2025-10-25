import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import usersRepository from "../repositories/usersRepository.js";

async function doLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await usersRepository.getUserByEmail(email);

    // CORREÇÃO: Verifica se o usuário não existe OU se não está ativo
    if(!user || !user.isActive) return res.sendStatus(401);

    // CORREÇÃO CRÍTICA: Corrigido o typo de 'passowrd' para 'password'
    const isValid = bcrypt.compareSync(password, user.password);
    if(!isValid) return res.sendStatus(401);

    // CORREÇÃO: O token deve ser assinado com o ID real do usuário
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRES)
    })

    return res.json({ id: user.id, token });
}

const blacklist = {};

async function doLogout(req, res, next) {
    const token = req.headers["authorization"];
    blacklist[token] = true;

    setTimeout(() => blacklist[token] = undefined, parseInt(process.env.JWT_EXPIRES) * 1000)

    return res.sendStatus(200);
}

function isBlacklisted(token){
    return blacklist[token];
}

export default {
    doLogin,
    doLogout,
    isBlacklisted
}
