import mongoose from "mongoose"
import { type } from "os"
import { stringify } from "querystring"
import { IKata, KataLevel } from "../interfaces/IKata.interfaces"

export const kataEntity = () => {
    const kataSchema = new mongoose.Schema<IKata>(
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true,
                // default: ''
            },
            level: {
                type: String,
                required: true,
                // default: KataLevel.BASIC
            },
            intents: {
                type: Number,
                required: true,
                // default: 0
            },
            stars: {
                type: Number,
                required: true,
                // default: 0
            },
            creator: {
                type: String,
                required: true
            },
            solution: {
                type: String,
                required: true,
                // default: ''
            },
            participants: {
                type: [],
                required: true,
                // default: []
            },
            starsUsers: {
                type: [],
                required: true,
            },
            nameFiles: {
                type: []
            }
        }, {
            // versionKey: false,
            timestamps: true
        }
    )

    return mongoose.models.Kata || mongoose.model<IKata>('Kata', kataSchema)
}
