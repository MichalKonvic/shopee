import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Product, { ProductI } from '../../../models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method != "GET") {
        res.status(400).send("Invalid method");
        return;
    }
    const { productId } = req.query;
    if (!productId) {
        res.status(400).send("Missing parameter");
        return;
    }
    try {
        const product:ProductI = (await Product.findOne({ id: productId }).select("-__v -id"))["_doc"];
        if (!product) {
            res.status(404).send("Not found");
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send("Database Error");
        return;
    }
}