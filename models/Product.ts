import mongoose from "mongoose";
interface ProductI {
    _id?: string;
    name?: string;
    description?: string;
    prize?: number;
    img?: string;
    MD_Description?: string;
    inStock?: number;
    [propName: string]: any;
}

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32
    },
    description: {
        type: String,
        maxLength: 64
    },
    prize: {
        type: Number,
        required: true,
        min:[0, 'Negative prize is not allowed']
    },
    img: {
        type: String
    },
    MD_Description: {
        type: String
    },
    inStock: {
        type: Number,
        required: true,
        Default: 0
    }
});
export type { ProductI }
export default mongoose.models.Product || mongoose.model('Product', ProductSchema)