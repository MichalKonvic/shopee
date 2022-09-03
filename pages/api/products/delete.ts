import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { isAccessTokenValid } from "../../../lib/jwt";
import Product, { ProductI } from "../../../models/Product";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;
	const { authorization } = req.headers;
	const { id } = req.query;
	const token = authorization.split(" ")[1];
	if (method != "DELETE") {
		res.status(400).send("Invalid method");
		return;
	}
	// TODO authorize user
	const userData = isAccessTokenValid(token);
	if (!userData) {
		res.status(401).send("Unauthorized");
		return;
	}
	if (!userData?.isAdmin) {
		res.status(403).send("Forbidden");
		return;
	}
	if (!id) {
		res.status(400).send("Invalid id");
		return;
	}
	await dbConnect();
	try {
		await Product.deleteOne({ _id: id });
		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).send("Server error");
	}
}
