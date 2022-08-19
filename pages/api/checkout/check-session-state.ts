import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY as string);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== "GET") {
        res.status(400).send("invalid method");
        return;
    }
    const { orderId } = req.query;
    if (!orderId) {
        res.status(404).send("not found");
    }
    await dbConnect();
    try {
        const orderQuery = await Order.findById(orderId);
        const sessionCheckout = await stripe.checkout.sessions.retrieve(orderQuery.sessionId);
        res.status(200).json({ status: sessionCheckout.payment_status });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
        return;
    }
}