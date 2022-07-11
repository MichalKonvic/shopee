import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from './../../../lib/dbConnect'
import User from '../../../models/User'
import { hash } from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt'
const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
};
    

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== 'POST') {
        res.status(400).send("Invalid method");
        return;
    }
    let { email, password }:{email:string,password:string} = req.body;
    email = email.toLowerCase();
    if (!email || !password) {
        res.status(400).send("Invalid request");
        return;
    }
    if (!validateEmail(email)) {
        res.status(400).send("Invalid email");
        return;
    }
    await dbConnect();
    // Creates user
    try {
        const hashedPassword = await hash(password, 10);
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            isAdmin: false
        });
        const { id } = newUser;
        const refreshToken = generateRefreshToken(email);
        const accessToken = generateAccessToken(email, false,id);
        const expirationDate = new Date();
        expirationDate.setMonth((new Date().getMonth() + 1));
        // FIXME TODO  add "Secure;" into response so token will be send only if server is https
        res.setHeader('Set-Cookie', `__refresh_token__=${refreshToken}; Expires=${expirationDate}; SameSite=Strict; HttpOnly; Path=/`);
        res.status(201).json({
            data: accessToken
        });
        return;
    } catch (error) {
        res.status(500).send("Database Error!");
    }
}
