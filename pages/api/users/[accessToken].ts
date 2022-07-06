import type { NextApiRequest, NextApiResponse } from 'next'
import type {UserI} from '../../../models/User'
import dbConnect from './../../../lib/dbConnect'
import User from '../../../models/User'
import { isAccessTokenValid } from '../../../lib/jwt';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { accessToken } = req.query;
    const payload = isAccessTokenValid(accessToken as string);
    if (!payload) {
        res.status(401).send("Invalid token");
        return;
    }
    const { email: tokenEmail, userId } = payload;
    await dbConnect()
    try {
        const userSearch:UserI = (await User.findById(userId).select("-password -__v -_id"))["_doc"];
        if (!userSearch) {
            res.status(404).send("Not found");
            return;
        }
        userSearch.id = userId
        res.status(200).json(userSearch);
    } catch (error) {
        res.status(500).send("Database Error!");
    }
}
