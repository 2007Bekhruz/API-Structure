import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { compare, hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'

export class AdminController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals

        const admin = await storage.admin.findOne({ _id: id })
        let admins
        if (admin.role === 'owner') {
            admins = await storage.admin.find({
                role: { $in: ['owner', 'manager', 'store_owner', 'seller'] }
            }) 
        } else if (admin.role === 'manager') {
            admins = await storage.admin.find({
                role: { $in: ['manager', 'store_owner', 'seller'] }
            }) 
        } else if (admin.role === 'store_owner') {
            admins = await storage.admin.find({
                role: { $in: ['seller'] }
            })
        } else {
            return next(new AppError(401, 'auth_403'))
        }
        res.status(200).json({
            success: true,
            data: {
                admins
            },
            message: message('get_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const _id = req.params.id

        let admin = await storage.admin.findOne({ _id: id })

        admin = await storage.admin.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                admin
            },
            message: message('admin_getOne_200', lang)
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { login, password } = req.body

        let admin = await storage.admin.findOne({ login })

        if (!(await compare(password, admin.password))) {
            return next(new AppError(401, 'auth_401'))
        }

        const token = await signToken(admin._id, admin.role)

        res.status(201).json({
            success: true,
            data: {
                admin,
                token
            },
            message: message('admin_logged_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals

        const salt = await genSalt()
        req.body.password = await hash(req.body.password, salt)

        const admin = await storage.admin.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                admin
            },
            message: message('admin_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { old_password, new_password } = req.body
        const { lang, id } = res.locals
        const _id = req.params.id

        const oldAdmin = await storage.admin.findOne({ _id: id })
        let admin = await storage.admin.findOneUpdate({ _id })
        if (_id === id) {
            if (new_password) {
                if (!(await compare(old_password, admin.password))) {
                    return next(new AppError(401, 'auth_401'))
                }
                const salt = await genSalt()
                req.body.password = await hash(new_password, salt)
            }
            admin = await storage.admin.update({ _id }, req.body)
        } else {
            if (
                (oldAdmin.role === 'owner' && admin.role === 'owner') ||
                (oldAdmin.role === 'manager' &&
                    (admin.role === 'manager' || admin.role === 'owner')) ||
                (oldAdmin.role === 'store_owner' && admin.role !== 'seller')
            ) {
                return next(new AppError(401, 'auth_403'))
            }
            if (new_password) {
                const salt = await genSalt()
                req.body.password = await hash(new_password, salt)
            }
            admin = await storage.admin.update({ _id }, req.body)
        }

        res.status(200).json({
            success: true,
            data: {
                admin
            },
            message: message('admin_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, lang } = res.locals
        const _id = req.params.id
        // const admin = await storage.admin.findOneUpdate({ _id })
        // const oldAdmin = await storage.admin.findOne({ _id: id })
        // if (_id === id) {
        //     return next(new AppError(401, 'auth_403'))
        // } else if (
        //     (oldAdmin.role === 'owner' && admin.role === 'owner') ||
        //     (oldAdmin.role === 'manager' && (admin.role === 'manager' || admin.role === 'owner')) ||
        //     (oldAdmin.role === 'store_owner' && admin.role !== 'seller')
        // ) {
        //     return next(new AppError(401, 'auth_403'))
        // }

        await storage.admin.update({ _id }, { deleted: true })

        res.status(200).json({
            success: true,
            message: message('admin_deleted_200', lang)
        })
    })

    createOwner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body

        const salt = await genSalt()
        const hashed_password = await hash(password, salt)

        const admin = await storage.admin.create({
            ...req.body,
            password: hashed_password,
            role: 'owner'
        })

        const token = await signToken(admin._id, 'owner')

        res.status(201).json({
            success: true,
            data: {
                admin,
                token
            }
        }) 
    })
}
 