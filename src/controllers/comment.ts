import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { compare, hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'

export class CommentController {
    getAll = catchAsync(async (req : Request, res: Response, next: NextFunction) => {
        try {
            const comments = await storage.comment.find({})
            res.status(200).json({
                success:true,
                data : {
                    comments,
                }
            })
        } catch (error) {
            console.log('Proccess has ended with error : ', error)
            next(error)
        }
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const salt = await genSalt()

        const comment = await storage.comment.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                comment
            },
            message: 'Comment successfully created'
        })
    })

    update = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
        try {
          // res.locals.id для получения ID из контекста запроса
          const _id = req.params.id
      
          // Найдем пользователя по ID
          let comment = await storage.comment.findOne({ _id });
      
          if (!comment) {
            return res.status(404).json({ message: "Коммент не найден" });
          }
          comment = await storage.comment.update({ _id }, req.body)
      
          // Обновим имя пользователя
      
          res.status(200).json({ message: "Комментарий пользователя успешно обновлен", comment });
        } catch (error) {
          next(error);
        }
      });
      
    delete = catchAsync(async (req: Request, res:Response, next:NextFunction) => {
        const _id = req.params.id

        await storage.comment.update({ _id }, { deleted: true })

        res.status(200).json({
            success: true,
            message : 'Comment was successfully deleted'
        })
    })
    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const _id = req.params.id

        let comment = await storage.comment.findOne({ _id })

        comment = await storage.comment.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                comment
            },
            message: message('admin_getOne_200', lang)
        })
    })
}
