import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Order, { OrderI } from '../../../models/Order';
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
    async function handleCheckoutPaid() {
        try {
            await Order.findByIdAndUpdate(orderId, { state: "PAID" });
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    }
    try {
        const orderQuery: OrderI = await Order.findById(orderId);
        if (orderQuery.state !== "PAID") {
            const sessionCheckout = await stripe.checkout.sessions.retrieve(orderQuery.sessionId);
            if (sessionCheckout.payment_status === "paid") {
                handleCheckoutPaid();
            }
        }
        const orderData: OrderI = (await Order.findById(orderId).select("-__v"))["_doc"];
        res.status(200).json({
            id: orderData.id,
            state: orderData.state,
            items: orderData.items,
            total: orderData.total,
            sessionId: orderData.sessionId,
            createdAt: orderData.createdAt,
            sessionExpirationAt: orderData.sessionExpirationAt
        })
        return;
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
        return;
    }
}