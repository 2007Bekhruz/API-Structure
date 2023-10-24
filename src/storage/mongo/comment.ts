import { CommentRepo } from '../repo/comment'
import Comment, { IComment } from '../../models/Comment'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class CommenttStorage implements CommentRepo {
    private scope = 'storage.comment'

    async find(query: Object): Promise<IComment[]> {
        try {
            const comments = await Comment.find({...query})

            return comments
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IComment> {
        try {
            const comment = await Comment.findOne({...query })

            if (!comment) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }

            return comment
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async findOneUpdate(query: Object): Promise<IComment> {
        try {
            const comment = await Comment.findOne({...query })

            if (!comment) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }

            return comment
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IComment): Promise<IComment> {
        try {
            const newComment = await Comment.create(payload)

            return newComment
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: Object): Promise<IComment> {
        try {
            const comment = await Comment.findOneAndUpdate(query, payload, {
                new: true
            })

            if (!comment) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'comment_404')
            }

            return comment
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IComment> {
        try {
            const comment = await Comment.findOneAndDelete(query)

            if (!comment) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'admin_404')
            }

            return comment
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
