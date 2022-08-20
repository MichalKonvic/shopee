import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Product, { ProductI } from '../../../models/Product';
import { productI } from '../../../hooks/useShopping';
import { isAccessTokenValid } from '../../../lib/jwt';
import Order, { OrderI } from '../../../models/Order';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY as string);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== "POST") {
        res.status(400).send("Invalid method");
    }
    await dbConnect();
    const { items, accessToken }: { items: productI[], accessToken: string } = req.body;
    const user = isAccessTokenValid(accessToken);
    const orderModelData:OrderI = {
        ...(user && { author: user.userId }),
        state: "GENERATED",
        items: [],
        total: items.reduce((prevValue, item) => prevValue + (item.prize * item.quantity), 0),
        sessionId: "SESSION_ID"
    }
    // Check if all products are inStock
    for (const item of items) {
        try {
            const itemQuery:ProductI = await Product.findById(item.id);
            if (item.quantity > itemQuery.inStock) {
                res.status(400).send("Out of stock");
                return;
            }
            if (item.prize !== itemQuery.prize) {
                res.status(400).send("Invalid item data");
                return;
            }
            itemQuery.inStock -= item.quantity;
            await itemQuery.save()
            orderModelData.items.push({
                id: item.id,
                prize: item.prize,
                quantity: item.quantity
            });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
    let orderId = "";
    try {
        const orderQuery = new Order(orderModelData);
        await orderQuery.save();
        orderId = orderQuery.id;
    } catch (error) {
        res.status(500).send("Server error");
    }
    const params= {
    submit_type: 'pay',
        line_items: items.map(item => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title
                    },
                    unit_amount: (item.prize*100)
                },
                quantity: item.quantity
        }
    }),
    success_url: `${process.env.SERVER_URL}/order?order_id=${orderId}`,
        cancel_url: `${process.env.SERVER_URL}/order?order_id=${orderId}`,
        mode: "payment",
        expires_at: Math.floor(new Date(new Date().setMinutes(new Date().getMinutes() + 31)).getTime() / 1000)
    };
    let checkoutSession:Stripe.Checkout.Session|null = null;
    try {
        checkoutSession =
            await stripe.checkout.sessions.create(params);
        orderModelData.sessionId = checkoutSession.id;
    } catch (error) {
        res.status(500).send("Checkout error");
        return;
    }
    const handleCheckoutPaid = async () => {
        try {
            await Order.findByIdAndUpdate(orderId, { state: "PAID" });
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    }
    const handleCheckoutExpiration = async () => {
        try {
            const orderQuery: OrderI = await Order.findByIdAndDelete(orderId);
            const orderItems = orderQuery.items;
            for (const orderItem of orderItems) {
                try {
                    const productQuery = await Product.findById(orderItem.id);
                    productQuery.inStock += orderItem.quantity;
                    await productQuery.save()
                } catch (error) {
                    console.error(error);
                    continue;
                }
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }
    try {
        const orderQuery:OrderI = await Order.findByIdAndUpdate(orderId,{sessionId:checkoutSession.id,state:"PAYMENT_REQUIRED"});
        res.status(200).json({ url: checkoutSession.url });
        const expiratesAt = new Date(new Date().setMinutes(new Date().getMinutes() + 32)).getTime();
        const checkPaymentInterval = setInterval(async() => {
            if (expiratesAt - new Date().getTime() < 0) {
                handleCheckoutExpiration();
                clearInterval(checkPaymentInterval);
            }
            const sessionCheckout = await stripe.checkout.sessions.retrieve(checkoutSession.id);
            if (sessionCheckout.payment_status === "paid") {
                handleCheckoutPaid()
                clearInterval(checkPaymentInterval);
            };
        },60 * 1000);
    } catch (error) {
        console.log(error)
        res.status(500).send("Server error");
        return;
    }
}