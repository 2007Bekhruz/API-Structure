import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import { AuthMiddleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new AuthMiddleware()

router.route('/all').get(middleware.auth(['owner']), controller.getUsers)
router.route('/create').post(
    validator.create,
    controller.create
    )

router
    .route('/:id')
        .delete(controller.delete)
        .patch(
            validator.update,
            controller.update)
        .get(controller.getOne)

export default router
