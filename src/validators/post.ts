import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class PostValidator {

    private createSchema = Joi.object({
        user_id: Joi.string().required(),
        caption : Joi.string().required()
    })

    private updateSchema = Joi.object({
        user_id: Joi.string(),
        caption: Joi.string().required()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })


    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}