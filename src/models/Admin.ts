import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IAdmin extends Document {
    _id: string
    name: string
    login: string
    tel_number: number
    password: string
    role: string
    deleted: boolean
    created_at: number
}

const adminSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    tel_number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['owner'],
        default: 'owner'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Number,
        default: Date.now
    }
})

export default model<IAdmin>('admins', adminSchema)
