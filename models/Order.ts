import mongoose from "mongoose";
import './Product';
import './User';
interface OrderI {
    _id?: string;
    author?: string;
    state?: string;
    total?: number;
    items?: {
        id: string,
        quantity: number
    };
    [propName: string]: any;
}

const OrderSchema = new mongoose.Schema({
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    state: {
        type: String,
        maxLength: 32
    },
    items: [{
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        },
        prize: {
            type: Number,
            min:[0, 'Negative prize is not allowed']
        },
        quantity: {
            type: Number,
            required: true
        }
    }
    ],
    total: {
        type: Number,
        required: true,
        min:[0, 'Negative prize is not allowed']
    },
    createdAt: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date(),
    }
});
export type { OrderI }
export default mongoose.models.Order || mongoose.model('Order', OrderSchema)