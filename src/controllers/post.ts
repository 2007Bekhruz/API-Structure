import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'

export class PostController {
    getAll = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
        try {
            const posts = await storage.post.find({})
            res.status(200).json({
                success:true,
                data : { 
                    posts,
                }
            })
        } catch (error) {
            console.log('Proccess has ended with error : ', error)
            next(error)
        }
    })

    create = catchAsync(async (req : Request, res : Response, next: NextFunction) => {
        try {
            // Получите данные из запроса (например, req.body)
        const postData = req.body;
        console.log(req.body)
            // Создайте нового пользователя, используя полученные данные
        const newPost = await storage.post.create(postData)

            // Сохраните пользователя в базе данных
        const savedPost = await newPost.save();

        res.status(201).json({
            success: true,
            data: savedPost,
            message: 'User created successfully',
        });
    } catch (error) {
        console.log('Process has ended with error:', error);
        next(error);
    }
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            // res.locals.id для получения ID из контекста запроса
            const _id = req.params.id
        
            // Найдем пользователя по ID
            let post = await storage.post.findOne({ _id });
        
            if (!post) {
              return res.status(404).json({ message: "Пользователь не найден" });
            }
            post = await storage.post.update({ _id }, req.body)
        
            // Обновим имя пользователя
        
            res.status(200).json({ message: "Имя пользователя успешно обновлено", post });
          } catch (error) {
            next(error);
          }
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const _id = req.params.id

        await storage.user.update({ _id }, {deleted: true})

        res.status(200).json({
            success: true,
            message : 'Post was successfully deleted'
        })
    })
    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals;
        const _id = req.params.id;
      
        try {
          let post = await storage.post.findOne({ _id });
      
          if (!post) {
            return res.status(404).json({
              success: false,
              message: 'Пост не найден',
            });
          }
      
          let comments = await storage.comment.find({ post_id: post._id });
          
          const postWithComments = {
            ...post.toObject(),
            comments: comments,
          };
          // Добавляем свойство 'comments' к объекту 'post'
      
          res.status(200).json({
            success: true,
            data: {
                postWithComments,
            },
            message: message('admin_getOne_200', lang),
          });
        } catch (error) {
          console.log('Процесс завершился с ошибкой: ', error);
          next(error);
        }
      });
      
}