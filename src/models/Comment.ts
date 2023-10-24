import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { IPost } from './Post'


export interface IComment extends Document {
    _id: string
    post_id: IPost['_id']
    text: string
    created_at: number
}

const commentSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    post_id: {
        type: String,
        required: true
    },
    text : {
        type : String,
        require : true
    },
    created_at: {
        type: Number,
        default: Date.now
    }
})

export default model<IComment>('comments', commentSchema)