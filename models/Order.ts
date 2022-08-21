import mongoose from "mongoose";
import './Product';
import './User';
interface OrderI {
    _id?: string;
    author?: string;
    address?: string;
    note?: string;
    state?: string;
    sessionId?: string;
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
    address: {
        type: String,
        required: true
    },
    note: {
        type: String
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
    },
    sessionId: {
        type: String,
        required: true,
    },
    sessionExpirationAt: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date(new Date().setMinutes(new Date().getMinutes() + 35))
    } 
});
export type { OrderI }
export default mongoose.models.Order || mongoose.model('Order', OrderSchema)