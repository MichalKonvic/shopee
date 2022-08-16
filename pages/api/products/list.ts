import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Product, { ProductI } from '../../../models/Product';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const { method } = req;
    if (method != "GET") {
        res.status(400).send("Invalid method");
        return;
    }
    await dbConnect();
    try {
        const queryResult:ProductI[] = (await Product.find().select(`-__v -img`));
        res.status(200).json(queryResult);
    } catch (error) {
        res.status(500).send("Server error");
    }
}