import { PostRepo } from '../repo/post'
import Post, { IPost } from '../../models/Post'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class PostStorage implements PostRepo {
    private scope = 'storage.post'

    async find(query: Object): Promise<IPost[]> {
        try {
            const posts = await Post.find({...query })

            return posts
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IPost> {
        try {
            const post = await Post.findOne({...query })

            if (!post) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }

            return post
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async findOneUpdate(query: Object): Promise<IPost> {
        try {
            const post = await Post.findOne({...query })

            if (!post) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }

            return post
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IPost): Promise<IPost> {
        try {
            const newPost = await Post.create(payload)

            return newPost
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: Object): Promise<IPost> {
        try {
            const post = await Post.findOneAndUpdate(query, payload, {
                new: true
            })

            if (!post) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'user_404')
            }

            return post
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IPost> {
        try {
            const post = await Post.findOneAndDelete(query)

            if (!post) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'admin_404')
            }

            return post
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
