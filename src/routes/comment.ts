import { Router } from 'express'
import { CommentController } from '../controllers/comment'
import { CommentValidator } from '../validators/comment'


const router = Router({ mergeParams: true })
const controller = new CommentController()
const validator = new CommentValidator()


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