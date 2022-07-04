import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String
    },
    password: String,
    isAdmin: Boolean
});

export default mongoose.models.User || mongoose.model('User', UserSchema)