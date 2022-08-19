import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Product, { ProductI } from '../../../models/Product';
import { productI } from '../../../hooks/useShopping';
import { isAccessTokenValid } from '../../../lib/jwt';
import { UserI } from '../../../models/User';
import Order from '../../../models/Order';
import getStripe from '../../../lib/get-stripejs';
import { Stripe } from '@stripe/stripe-js';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== "POST") {
        res.status(400).send("Invalid method");
    }
    await dbConnect();
    const { items, accessToken }: { items: productI[], accessToken: string } = req.body;
    const user = isAccessTokenValid(accessToken);
    // TODO add expiration date
    const orderModelData:UserI = {
        ...(user && { author: user.userId }),
        state: "PAYMENT_REQUIRED",
        items: [],
        total: items.reduce((prevValue, item) => prevValue + (item.prize * item.quantity), 0)
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
    const stripe = await getStripe();
    // TODO add expiration date
    const params: Stripe.Checkout.SessionCreateParams = {
    submit_type: 'Pay',
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
    };
    try {
        const checkoutSession: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params);
        res.status(200).json({ url: checkoutSession.url });
        return;
    } catch (error) {
        res.status(500).send("Checkout error");
    }
}