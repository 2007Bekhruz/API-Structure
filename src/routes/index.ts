import express, { Router } from 'express'
import path from 'path'
import adminRouter from './admin'
import userRouter from './user'
import postRouter from './post'
import commentRouter from './comment'

const router = Router({ mergeParams: true })

router.use('/file', express.static(path.join(__dirname, '../../../uploads')))
router.use('/admins', adminRouter)
router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/comments', commentRouter)
export default router
