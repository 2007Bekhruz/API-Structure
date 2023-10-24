import { Router } from 'express'
import {PostController } from '../controllers/post'
import { PostValidator } from '../validators/post'


const router = Router({ mergeParams: true })
const controller = new PostController()
const validator = new PostValidator()


router.route('/create').post(
    validator.create,
    controller.create
    )
router.route('/all').get(controller.getAll)
router
    .route('/:id')
        .delete(controller.delete)
        .patch(
            validator.update,
            controller.update)
        .get(controller.getOne)

export default router