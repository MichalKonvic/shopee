import mongoose from "mongoose";
interface UserI {
    _id?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
    [propName: string]: any;
}

const UserSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String
    },
    password: String,
    isAdmin: Boolean
});
export type {UserI}
export default mongoose.models.User || mongoose.model('User', UserSchema)