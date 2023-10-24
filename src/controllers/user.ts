import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { compare, hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'
import User from '../models/User'; // Import your User model
import Post from '../models/Post'; // Import your Post model
import Comment from '../models/Comment';


export class UserController {
  getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
  
    try {
      let user = await storage.user.findOne({ _id });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден',
        });
      }
  
      let posts = await storage.post.find({ user_id: user._id });
      const postIds = posts.map(post => post._id);
      let comments = await storage.comment.find({ post_id: { $in: postIds } });
  
      // Создаем объект userWithPosts, который будет содержать посты и их комментарии
      const users = {
        ...user.toObject(),
        posts: posts.map(post => ({
          ...post.toObject(),
          comments: comments.filter(comment => comment.post_id === post._id),
        })),
      };
  
      res.status(200).json({
        success: true,
        data: {
          users,
        },
      });
    } catch (error) {
      console.log('Процесс завершился с ошибкой: ', error);
      next(error);
    }
  });
    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const salt = await genSalt()

        const user = await storage.user.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                user
            },
            message: 'User successfully created'
        })
    })

    update = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
        try {
          // res.locals.id для получения ID из контекста запроса
          const _id = req.params.id
      
          // Найдем пользователя по ID
          let user = await storage.user.findOne({ _id });
      
          if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
          }
          user = await storage.user.update({ _id }, req.body)
      
          // Обновим имя пользователя
      
          res.status(200).json({ message: "Имя пользователя успешно обновлено", user });
        } catch (error) {
          next(error);
        }
      });
      
      delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const _id = req.params.id;
      
        try {
          // Получаем пользователя по _id
          const user = await storage.user.findOne({ _id });
      
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'Пользователь не найден',
            });
          }
      
          // Получаем все посты, принадлежащие пользователю
          const posts = await storage.post.find({ user_id: user._id });
      
          for (const post of posts) {
            // Получаем комментарии к посту
            const comments = await storage.comment.find({ post_id: post._id });
    
            // Удаляем комментарии
            for (const comment of comments) {
              await storage.comment.delete({ _id: comment._id });
            }
      
            // Удаляем пост
            await storage.post.delete({ _id: post._id });
          }
      
          // Удаляем пользователя
          await storage.user.delete({ _id: user._id });
      
          res.status(200).json({
            success: true,
            message: 'Пользователь и связанные с ним посты и комментарии успешно удалены',
          });
        } catch (error) {
          console.log('Процесс завершился с ошибкой: ', error);
          next(error);
        }
      });

      getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
          // Получаем всех пользователей
          const users = await storage.user.find({});
      
          if (!users || users.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Пользователи не найдены',
            });
          }
      
          // Создаем массив для хранения данных пользователей с их постами и комментариями
          const usersWithPostsAndComments = await Promise.all(users.map(async (user) => {
            // Находим посты пользователя
            const posts = await storage.post.find({ user_id: user._id });
            const postIds = posts.map((post) => post._id);
      
            // Находим комментарии для постов пользователя
            const comments = await storage.comment.find({ post_id: { $in: postIds } });
      
            // Обновляем объект пользователя, добавляя посты внутрь него
            return {
              ...user.toObject(),
              posts: posts.map((post) => ({
                ...post.toObject(),
                comments: comments.filter((comment) => comment.post_id === post._id),
              })),
            };
          }));
      
          res.status(200).json({
            success: true,
            data: usersWithPostsAndComments,
          });
        } catch (error) {
          console.log('Процесс завершился с ошибкой: ', error);
          next(error);
        }
      });
      
    }