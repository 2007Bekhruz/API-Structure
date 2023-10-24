import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class UserValidator {

    private createSchema = Joi.object({
        name: Joi.string().required()
    })

    private updateSchema = Joi.object({
        name: Joi.string()
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