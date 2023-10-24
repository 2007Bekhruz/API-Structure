import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { IUser } from './User'


export interface IPost extends Document {
    _id: string
    user_id: IUser['_id']
    caption: string
    created_at: number
}

const postSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    user_id: {
        type: String,
        required: true
    },
    caption : {
        type : String,
        require : true
    },
    created_at: {
        type: Number,
        default: Date.now
    }
})

export default model<IPost>('posts', postSchema)