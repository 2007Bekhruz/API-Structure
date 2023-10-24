import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class AdminValidator {
    pattern =
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{6,30}$/

    private createSchema = Joi.object({
        name: Joi.string().required(),
        role: Joi.string().valid('owner').required(),
        login: Joi.string().required(),
        tel_number: Joi.number().required(),
        password: Joi.string().regex(this.pattern).required()
    })

    private loginSchema = Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required()
    })

    private updateSchema = Joi.object({
        name: Joi.string(),
        login: Joi.string(),
        tel_number: Joi.number(),
        role: Joi.forbidden(),
        old_password: Joi.string(),
        new_password: Joi.string().regex(this.pattern),
        status: Joi.string().valid('active', 'inactive')
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const role = res.locals.role
        if (role != 'owner') {
            if (role != 'manager' && req.body.role != 'seller') {
                return next(new AppError(401, 'auth_403'))
            } else {
                if (req.body.role === 'owner' || req.body.role === 'manager') {
                    return next(new AppError(401, 'auth_403'))
                }
            }
        } else if (req.body.role === 'owner') {
            return next(new AppError(401, 'auth_403'))
        }
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const new_password = req.body.new_password
        if (new_password === '') {
            delete req.body.new_password
        }
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
