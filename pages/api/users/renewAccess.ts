import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from './../../../lib/dbConnect'
import User from '../../../models/User'
import { generateAccessToken, isRefreshTokenValid } from '../../../lib/jwt'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== 'GET') {
        res.status(400).send("Invalid method");
        return;
    }
    const { __refresh_token__: refreshToken }: { __refresh_token__?: string } = req.cookies;
    //@ts-ignore
    const tokenPayload = isRefreshTokenValid(refreshToken);
    if (!tokenPayload) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { email } = tokenPayload;
    await dbConnect();
    // Creates user
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send("User not Found");
            return;
        }
        const { isAdmin } = user;
        const accessToken = generateAccessToken(email, isAdmin);
        res.status(200).json({
            data: accessToken
        });
        return;
    } catch (error) {
        res.status(500).send("Database Error!");
    }
}
