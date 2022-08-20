import mongoose from "mongoose"
import { IUser } from "../interfaces/IUser.interfaces"

export const userEntity = () => {
    const userSchema = new mongoose.Schema<IUser>(
        {
            name: {
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            },
            role: {
                type: String,
                default: "user"
            },
            katas: {
                type: [],
                required: true
            }

        }
    )
    return mongoose.models.Users || mongoose.model<IUser>('Users', userSchema)
}
