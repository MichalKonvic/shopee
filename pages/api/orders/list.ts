import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { isAccessTokenValid } from "../../../lib/jwt";
import Order, { OrderI } from "../../../models/Order";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;
	const { authorization } = req.headers;
	const token = authorization?.split(" ")[1];
	if (method != "GET") {
		res.status(400).send("Invalid method");
		return;
	}
	const tokenData = isAccessTokenValid(token);
	if (!tokenData) {
		res.status(401).send("Unauthorized");
		return;
	}
	if (!tokenData?.isAdmin) {
		res.status(403).send("Forbidden");
		return;
	}
	await dbConnect();
	try {
		const queryResult: OrderI[] = await Order.find().select(`-__v`);
		res.status(200).json(queryResult);
	} catch (error) {
		res.status(500).send("Server error");
	}
}
