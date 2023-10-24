import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
    _id: string
    name: string
    created_at: number
}

const userSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Number,
        default: Date.now
    }
})

export default model<IUser>('users', userSchema)
