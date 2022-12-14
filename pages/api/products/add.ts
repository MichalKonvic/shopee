import type { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync, unlinkSync } from 'fs';
import type { UserI } from '../../../models/User'
import formidable from 'formidable-serverless';
import { isAccessTokenValid } from '../../../lib/jwt';
import dbConnect from '../../../lib/dbConnect';
import Product, { ProductI } from '../../../models/Product';

export default async function handler( req: NextApiRequest, res: NextApiResponse){
    const { method } = req;
    if (method != "POST") {
        res.status(400).send("Invalid method");
        return;
    }
    const { authorization } = req.headers;
    const accessToken = authorization?.split(" ")[1];
    const tokenPayload: UserI | false = isAccessTokenValid(accessToken);
    if (!tokenPayload) {
        res.status(401).send("Unauthorized");
        return;
    }
    // Admin check
    if (!tokenPayload.isAdmin) {
        res.status(401).send("Unauthorized");
        return;
    }
    const form = new formidable.IncomingForm({maxFileSize:16777216,uploadDir: "tmp/",filter: function(file) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            return true;
        } else {
            return false;
        }
    },
    });
    await dbConnect();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).send("Server error");
            return;
        }
        let img = undefined;
        if (Object.keys(files).length !== 0) {
            const { path, type } = files.img[0] ?? files.img;
            img = `data:${type};base64, ` + readFileSync(path, 'base64');
            unlinkSync(path);
        }
        const { name, description, prize, inStock }: { [propName: string]: string } = fields;
        if (!name || !+prize) {
            res.status(400).send("Missing parameter");
            return;
        }
        try {
            const newProduct:ProductI = await Product.create({
                name,
                description,
                prize:+prize,
                img,
                inStock
            });
            const { id } = newProduct;
            res.status(201).json({
                data: id
            });
            return;
        } catch (error) {
            console.error(error)
            res.status(500).send("Database Error");
            return;
        }
    });
}
export const config = {
    api: {
        bodyParser: false,
    },
};